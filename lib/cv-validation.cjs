/* CVs are validated in memory and attached to email; never stored or logged. */
const { inflateRawSync } = require('node:zlib');
const MAX_CV_BYTES = 5 * 1024 * 1024;
const TYPES = Object.freeze({ pdf: 'application/pdf', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
const crcTable = Array.from({ length: 256 }, (_, value) => {
  for (let i = 0; i < 8; i++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) value = crcTable[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}
function isDocx(bytes) {
  // Read the central directory before inflating. Bound both total declared
  // expansion and the XML we inspect, including when a file lies about sizes.
  if (bytes.length < 22 || bytes.readUInt32LE(0) !== 0x04034b50) return false;
  let end = bytes.length - 22;
  while (end >= Math.max(0, bytes.length - 65557) && bytes.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < 0 || bytes.readUInt32LE(end) !== 0x06054b50 || end + 22 + bytes.readUInt16LE(end + 20) !== bytes.length) return false;
  if (bytes.readUInt16LE(end + 4) || bytes.readUInt16LE(end + 6)) return false;
  const count = bytes.readUInt16LE(end + 10), size = bytes.readUInt32LE(end + 12), start = bytes.readUInt32LE(end + 16);
  if (!count || count > 512 || bytes.readUInt16LE(end + 8) !== count || start + size !== end) return false;
  const entries = new Map();
  let pos = start, expanded = 0;
  for (let i = 0; i < count; i++) {
    if (pos + 46 > end || bytes.readUInt32LE(pos) !== 0x02014b50) return false;
    const flags = bytes.readUInt16LE(pos + 8), method = bytes.readUInt16LE(pos + 10);
    const compressed = bytes.readUInt32LE(pos + 20), length = bytes.readUInt32LE(pos + 24);
    const nameLength = bytes.readUInt16LE(pos + 28), extra = bytes.readUInt16LE(pos + 30), comment = bytes.readUInt16LE(pos + 32);
    if (pos + 46 + nameLength + extra + comment > end || (flags & 1) || ![0, 8].includes(method)) return false;
    const name = bytes.subarray(pos + 46, pos + 46 + nameLength).toString('utf8');
    if (!name || name.startsWith('/') || name.includes('\\') || name.split('/').includes('..') || entries.has(name) || /vbaproject|\.exe$/i.test(name)) return false;
    expanded += length;
    if (expanded > 25 * 1024 * 1024) return false;
    const local = bytes.readUInt32LE(pos + 42);
    if (local + 30 > start || bytes.readUInt32LE(local) !== 0x04034b50 || bytes.readUInt16LE(local + 6) !== flags || bytes.readUInt16LE(local + 8) !== method) return false;
    const localNameLength = bytes.readUInt16LE(local + 26), localExtra = bytes.readUInt16LE(local + 28);
    const dataStart = local + 30 + localNameLength + localExtra;
    if (dataStart + compressed > start || bytes.subarray(local + 30, local + 30 + localNameLength).toString('utf8') !== name) return false;
    entries.set(name, { dataStart, compressed, length, method, crc: bytes.readUInt32LE(pos + 16) });
    pos += 46 + nameLength + extra + comment;
  }
  if (pos !== end) return false;
  function xml(name) {
    const entry = entries.get(name);
    if (!entry || entry.length > 1024 * 1024) return '';
    const packed = bytes.subarray(entry.dataStart, entry.dataStart + entry.compressed);
    const data = entry.method === 0 ? packed : inflateRawSync(packed, { maxOutputLength: 1024 * 1024 });
    if (data.length !== entry.length || crc32(data) !== entry.crc) return '';
    const text = data.toString('utf8');
    if (/<!DOCTYPE|<!ENTITY/i.test(text)) return '';
    return text;
  }
  const types = xml('[Content_Types].xml'), document = xml('word/document.xml'), rels = xml('_rels/.rels');
  return /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document\.main\+xml/.test(types) &&
    /<w:document\b/.test(document) && /schemas\.openxmlformats\.org\/wordprocessingml\/2006\/main/.test(document) &&
    /officeDocument/.test(rels) && /word\/document\.xml/.test(rels);
}
function validateCv(file) {
  const fail = error => ({ error, field: 'cv' });
  if (!file || typeof file !== 'object' || Array.isArray(file)) return fail('file_required');
  if (typeof file.name !== 'string' || file.name.length > 255 || typeof file.type !== 'string' || typeof file.content !== 'string') return fail('file_invalid');
  if (file.size > MAX_CV_BYTES || file.content.length > 4 * Math.ceil(MAX_CV_BYTES / 3)) return fail('file_too_large');
  const extension = file.name.match(/\.([^.]+)$/)?.[1].toLowerCase();
  if (!Object.hasOwn(TYPES, extension || '') || (file.type && file.type !== TYPES[extension])) return fail('file_type');
  if (!file.content || file.content.length % 4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(file.content)) return fail('file_invalid');
  const bytes = Buffer.from(file.content, 'base64');
  if (bytes.length > MAX_CV_BYTES) return fail('file_too_large');
  if (!bytes.length || !Number.isInteger(file.size) || bytes.length !== file.size || bytes.toString('base64') !== file.content) return fail('file_invalid');
  try {
    const valid = extension === 'pdf'
      ? /^%PDF-(?:1\.[0-9]|2\.0)/.test(bytes.subarray(0, 12).toString('ascii')) && /%%EOF\s*$/.test(bytes.subarray(-1024).toString('latin1'))
      : isDocx(bytes);
    if (!valid) return fail('file_invalid');
  } catch { return fail('file_invalid'); }
  let name = file.name.split(/[\\/]/).at(-1).normalize('NFKC').replace(/[^\p{L}\p{N}._ -]/gu, '_').replace(/^\.+/, '').trim();
  name = name.slice(0, 120 - extension.length - 1).replace(/\.(?:pdf|docx)$/i, '') + '.' + extension;
  return { filename: name || 'CV.' + extension, content: file.content, content_type: TYPES[extension] };
}
module.exports = { validateCv, MAX_CV_BYTES, crc32 };
