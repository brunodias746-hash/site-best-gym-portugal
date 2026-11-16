const { crc32 } = require('../../lib/cv-validation.cjs');
function pdfBytes() {
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  ];
  const text = 'BT /F1 12 Tf 40 800 Td (Technical test only. Ignore application.) Tj ET';
  objects.push('<< /Length ' + Buffer.byteLength(text) + ' >>\nstream\n' + text + '\nendstream');
  let body = '%PDF-1.4\n', offsets = [0];
  objects.forEach((object, i) => { offsets.push(Buffer.byteLength(body)); body += (i + 1) + ' 0 obj\n' + object + '\nendobj\n'; });
  const end = Buffer.byteLength(body);
  body += 'xref\n0 6\n0000000000 65535 f \n' + offsets.slice(1).map(n => String(n).padStart(10, '0') + ' 00000 n \n').join('') +
    'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + end + '\n%%EOF\n';
  return Buffer.from(body);
}
function zip(entries, compress = false) {
  const files = [], directory = [];
  let offset = 0;
  for (const [name, text] of Object.entries(entries)) {
    const filename = Buffer.from(name), data = Buffer.from(text), crc = crc32(data);
    const packed = compress ? require('node:zlib').deflateRawSync(data) : data;
    const method = compress ? 8 : 0;
    const local = Buffer.alloc(30); local.writeUInt32LE(0x04034b50); local.writeUInt16LE(20, 4);
    local.writeUInt16LE(method, 8);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(packed.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(filename.length, 26);
    files.push(local, filename, packed);
    const central = Buffer.alloc(46); central.writeUInt32LE(0x02014b50); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6);
    central.writeUInt16LE(method, 10);
    central.writeUInt32LE(crc, 16); central.writeUInt32LE(packed.length, 20); central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(filename.length, 28); central.writeUInt32LE(offset, 42);
    directory.push(central, filename); offset += local.length + filename.length + packed.length;
  }
  const central = Buffer.concat(directory), end = Buffer.alloc(22), count = Object.keys(entries).length;
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(count, 8); end.writeUInt16LE(count, 10);
  end.writeUInt32LE(central.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...files, central, end]);
}
function docxBytes(compress = false) {
  return zip({
    '[Content_Types].xml': '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
    '_rels/.rels': '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
    'word/document.xml': '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Technical test only. Ignore application.</w:t></w:r></w:p></w:body></w:document>'
  }, compress);
}
function cv(kind = 'pdf', bytes = kind === 'pdf' ? pdfBytes() : docxBytes()) {
  return { name: 'CV-test.' + kind, type: kind === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: bytes.length, content: bytes.toString('base64') };
}
function careers(unit = 'famalicao', kind = 'pdf') {
  return {
    type: 'careers', language: 'pt-PT', submittedAt: new Date().toISOString(), requestId: require('node:crypto').randomUUID(),
    data: { name: 'TESTE TECNICO — ignorar candidatura', email: 'qa@example.invalid', phone: '+351 900 000 000', unit, role: 'spontaneous', cv: cv(kind), message: 'Synthetic QA data', privacy: true, website: '' }
  };
}
module.exports = { pdfBytes, docxBytes, cv, careers, zip };
