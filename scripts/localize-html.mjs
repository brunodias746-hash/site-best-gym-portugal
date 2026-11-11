// DC templates contain custom elements and bindings; retain their markup verbatim.
const tokens = /<!--[\s\S]*?-->|<(script|style)\b(?:[^>"']|"[^"]*"|'[^']*')*>[\s\S]*?<\/\1\s*>|<\/?[a-z][\w:-]*(?:[^>"']|"[^"]*"|'[^']*')*>|<![^>]*>|[^<]+|</gi;
const attributes = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=`<>]+)))?/g;
const voidTags = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
export const localizedAttributes = ['aria-label', 'aria-description', 'title', 'placeholder', 'alt', 'data-cursor', 'label'];
export const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export const decode = (value) => value.replace(/&(#\d+|#x[\da-f]+|quot|apos|amp|lt|gt|nbsp);/gi, (entity, key) => {
  if (key[0] === '#') return String.fromCodePoint(key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1)));
  return { quot: '"', apos: "'", amp: '&', lt: '<', gt: '>', nbsp: '\u00a0' }[key.toLowerCase()] ?? entity;
});

export function* htmlTokens(html) {
  for (const [raw, rawTag] of html.matchAll(tokens)) {
    if (rawTag || raw.startsWith('<!')) {
      yield { raw, kind: 'opaque' };
      continue;
    }
    const tag = raw.match(/^<(\/?)([\w:-]+)(?=[\s/>])/);
    if (!tag) {
      yield { raw, kind: 'text' };
      continue;
    }
    const name = tag[2].toLowerCase();
    if (tag[1]) {
      yield { raw, kind: 'close', name };
      continue;
    }
    const closed = raw.endsWith('/>');
    const end = closed ? -2 : -1;
    const body = raw.slice(tag[0].length, end);
    const pairs = [...body.matchAll(attributes)];
    const attrs = Object.fromEntries(pairs.map(([key, name, double, single, bare]) => [name.toLowerCase(), decode(double ?? single ?? bare ?? '')]));
    yield {
      raw, kind: 'open', name, attrs, void: closed || voidTags.has(name),
      update(values) {
        let next = body;
        for (const pair of pairs.reverse()) {
          const key = pair[1].toLowerCase();
          if (!Object.hasOwn(values, key)) continue;
          next = next.slice(0, pair.index) + `${pair[1]}="${escape(values[key])}"` + next.slice(pair.index + pair[0].length);
          delete values[key];
        }
        return tag[0] + next + Object.entries(values).map(([key, value]) => ` ${key}="${escape(value)}"`).join('') + raw.slice(end);
      }
    };
  }
}

export function localizeEnglish(html, route, { englishHref, campaign }) {
  const stack = [];
  return Array.from(htmlTokens(html), (token) => {
    if (token.kind === 'close') {
      const index = stack.findLastIndex(({ name }) => name === token.name);
      if (index !== -1) stack.length = index;
    } else if (token.kind === 'open') {
      const { attrs } = token;
      const campaignField = attrs['data-campaign-field'];
      const translation = campaign.en[campaignField] ?? attrs['data-en'];
      const text = attrs['data-en-text'] ? JSON.parse(attrs['data-en-text']) : [translation];
      if (!token.void) stack.push({ name: token.name, text, index: 0 });

      const updates = {};
      for (const key of localizedAttributes) {
        const source = 'data-en-' + key.replace(/^data-/, '');
        if (Object.hasOwn(attrs, source)) updates[key] = attrs[source];
      }
      if (Object.hasOwn(attrs, 'data-campaign-artwork')) updates.alt = 'BEST GYM campaign — ' + campaign.en.headline;
      if (token.name === 'a' && !Object.hasOwn(attrs, 'data-bg-language-link')) {
        const href = campaign.en[attrs['data-campaign-cta'] + 'Href'] ?? englishHref(attrs.href, route);
        if (href !== attrs.href) updates.href = href;
      }
      if (Object.keys(updates).length) return token.update(updates);
    } else if (token.kind === 'text' && token.raw.trim() && stack.length) {
      const frame = stack.at(-1);
      const translated = frame.text[frame.index++];
      if (translated != null && decode(token.raw.trim()) !== translated.trim()) {
        return token.raw.match(/^\s*/)[0] + escape(translated) + token.raw.match(/\s*$/)[0];
      }
    }
    return token.raw;
  }).join('');
}
