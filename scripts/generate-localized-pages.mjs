import '../site-config.js';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const { origin, pages } = globalThis.BGSiteConfig;
const outputRoot = path.resolve('localized-pages');
await rm(outputRoot, { recursive: true, force: true });

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
  const basename = ptPath === '/' ? 'index' : ptPath.slice(1);
  const source = await readFile(`${basename}.dc.html`, 'utf8');
  for (const english of [false, true]) {
    const locale = english ? 'en' : 'pt';
    const localized = source
      .replace('<html>', `<html lang="${english ? 'en' : 'pt-PT'}" data-locale="${locale}">`)
      .replace('<meta charset="utf-8">', `<meta charset="utf-8">\n${head(ptPath, page, english)}`);
    const folder = path.join(outputRoot, locale);
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, `${basename}.html`), localized, 'utf8');
  }
}

await import('./generate-sitemap.mjs');
console.log(`Generated ${Object.keys(pages).length * 2} localized HTML documents.`);
