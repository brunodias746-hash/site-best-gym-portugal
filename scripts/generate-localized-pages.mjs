import '../site-config.js';
import { copyFile, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const { origin, pages } = globalThis.BGSiteConfig;
const publicRoot = path.resolve('public');
const outputRoot = path.join(publicRoot, 'localized-pages');
await rm(publicRoot, { recursive: true, force: true });
await mkdir(publicRoot, { recursive: true });

for (const directory of ['_ds', 'assets']) {
  await cp(directory, path.join(publicRoot, directory), { recursive: true });
}
const rootEntries = await readdir('.', { withFileTypes: true });
for (const entry of rootEntries) {
  if (entry.isFile() && !entry.name.startsWith('.') &&
      (/\.(?:html|css|js|png|jpg|jpeg|webp|svg|ico|mp4)$/i.test(entry.name) || ['robots.txt', 'sitemap.xml'].includes(entry.name))) {
    await copyFile(entry.name, path.join(publicRoot, entry.name));
  }
}

const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const head = (ptPath, page, english) => {
  const route = english ? page.en : ptPath;
  const seo = english ? page.english : page.pt;
  return [
    `<title>${escape(seo[0])}</title>`,
    `<meta name="description" content="${escape(seo[1])}">`,
    `<link rel="canonical" href="${origin}${route}">`,
    `<link rel="alternate" hreflang="pt-PT" href="${origin}${ptPath}">`,
    `<link rel="alternate" hreflang="en" href="${origin}${page.en}">`,
    `<link rel="alternate" hreflang="x-default" href="${origin}${ptPath}">`,
    `<meta property="og:title" content="${escape(seo[0])}">`,
    `<meta property="og:description" content="${escape(seo[1])}">`,
    `<meta property="og:url" content="${origin}${route}">`,
    `<meta property="og:locale" content="${english ? 'en_GB' : 'pt_PT'}">`,
    `<meta property="og:locale:alternate" content="${english ? 'pt_PT' : 'en_GB'}">`
  ].join('\n');
};

for (const [ptPath, page] of Object.entries(pages)) {
  const basename = page.source || (ptPath === '/' ? 'index' : ptPath.slice(1));
  const source = await readFile(`${basename}.dc.html`, 'utf8');
  for (const english of [false, true]) {
    const locale = english ? 'en' : 'pt';
    let localized = source
      .replace('<html>', `<html lang="${english ? 'en' : 'pt-PT'}" data-locale="${locale}">`)
      .replace('<meta charset="utf-8">', `<meta charset="utf-8">\n${head(ptPath, page, english)}`);
    if (english) {
      localized = localized.replace(/(<([a-z][\w-]*)\b[^>]*\bdata-en="([^"]*)"[^>]*>)([\s\S]*?)(<\/\2>)/gi,
        (_, open, tag, translation, original, close) => open + translation.replaceAll('&quot;', '"') + close);
      localized = localized.replace(/alt="[^"]*" data-en-alt="([^"]*)"/g, 'alt="$1" data-en-alt="$1"');
    }
    const folder = path.join(outputRoot, locale);
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, `${basename}.html`), localized, 'utf8');
    // Directory index files also work on ordinary static hosts without Vercel rewrites.
    const route = english ? page.en : ptPath;
    const portableFolder = path.join(publicRoot, route.replace(/^\/+|\/+$/g, ''));
    await mkdir(portableFolder, { recursive: true });
    await writeFile(path.join(portableFolder, 'index.html'), localized, 'utf8');
  }
}

await import('./generate-sitemap.mjs');
await copyFile(path.join(outputRoot, 'pt', 'index.html'), path.join(publicRoot, 'index.html'));
await copyFile('sitemap.xml', path.join(publicRoot, 'sitemap.xml'));
await copyFile(path.join('assets', 'logo-red.png'), path.join(publicRoot, 'favicon.ico'));
await writeFile(path.join(publicRoot, '.image-slots.state.json'), '{}\n', 'utf8');
console.log(`Generated ${Object.keys(pages).length * 2} localized HTML documents.`);
