import '../site-config.js';
import { writeFile } from 'node:fs/promises';

const { origin, pages } = globalThis.BGSiteConfig;
const alternate = (lang, href) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${origin}${href}"/>`;
const entries = Object.entries(pages).flatMap(([pt, page]) => [pt, page.en].map((loc) =>
  `  <url><loc>${origin}${loc}</loc>${alternate('pt-PT', pt)}${alternate('en', page.en)}${alternate('x-default', pt)}</url>`
));
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
await writeFile(new URL('../sitemap.xml', import.meta.url), xml, 'utf8');
console.log(`Generated ${entries.length} localized sitemap entries from site-config.js.`);
