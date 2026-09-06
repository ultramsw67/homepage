// 옵시디언 vault 의 네이버 블로그 발행글(md) → public/posts/*.json + sitemap.xml
// 실행: node scripts/import-blog.mjs [vault 블로그 폴더]
// 기본 폴더: C:\Obsidian\tomwiki\10_블로그\네이버
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC = resolve(process.argv[2] || 'C:/Obsidian/tomwiki/10_블로그/네이버');
const OUT = resolve('public/posts');
const SITE = 'https://sood-page.web.app';

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return null;
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    let v = line.slice(i + 1).trim();
    if (/^".*"$/.test(v)) v = JSON.parse(v);
    meta[line.slice(0, i).trim()] = v;
  }
  return { meta, body: m[2] };
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(s) {
  let t = esc(s);
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[\s(])_([^_]+?)_(?=[\s).,!?]|$)/g, '$1<em>$2</em>');
  t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  t = t.replace(/(^|[^"'>])(https?:\/\/[^\s<]+)/g, (m, pre, url) => `${pre}<a href="${url}" target="_blank" rel="noreferrer">${url}</a>`);
  return t;
}

function toHtml(body, title) {
  const lines = body.split(/\r?\n/);
  const html = [];
  let firstImage = '';
  let excerptFromQuote = '';
  let started = false;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!started) {
      if (line.startsWith('# ')) continue;
      if (line.startsWith('> ')) { excerptFromQuote = line.slice(2).trim(); continue; }
      if (line.startsWith('원문:')) { started = true; continue; }
      if (line === '') continue;
      started = true;
    }
    if (line === '' || line === '__' || line === '_' || line === '\\' ) continue;
    if (/^\*\s\*\s\*$/.test(line) || /^-{3,}$/.test(line) || /^_{3,}$/.test(line)) { html.push('<hr />'); continue; }
    const img = line.match(/^!\[([^\]]*)\]\((\S+?)\)$/);
    if (img) {
      const url = img[2];
      if (!firstImage) firstImage = url;
      let caption = '';
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;
      const next = (lines[j] || '').trim();
      if (next && next.length <= 60 && !/^!\[/.test(next) && !/^\*\s\*\s\*$/.test(next) && !/^\d+\.\s/.test(next) && !/^[가-힣]\)\s/.test(next) && !/^#/.test(next) && !/[.。!?]$/.test(next)) { caption = next; i = j; }
      html.push(`<figure><img src="${esc(url)}" alt="${esc(caption || title)}" loading="lazy" referrerpolicy="no-referrer" />${caption ? `<figcaption>${inline(caption)}</figcaption>` : ''}</figure>`);
      continue;
    }
    if (/^#[^\s#]/.test(line) && line.split(/\s+/).every((w) => w.startsWith('#'))) {
      html.push(`<p class="post-tags">${line.split(/\s+/).map((w) => `<span>${esc(w)}</span>`).join(' ')}</p>`);
      continue;
    }
    if (/^\d{1,2}\.\s\S/.test(line) && line.length <= 80) { html.push(`<h2>${inline(line)}</h2>`); continue; }
    if (/^[가-힣]\)\s\S/.test(line) && line.length <= 80) { html.push(`<h3>${inline(line)}</h3>`); continue; }
    if (/^#{1,3}\s/.test(line)) { const lvl = Math.min(3, line.match(/^#+/)[0].length + 1); html.push(`<h${lvl}>${inline(line.replace(/^#+\s/, ''))}</h${lvl}>`); continue; }
    if (/^>\s/.test(line)) { html.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); continue; }
    if (/^[-*]\s\S/.test(line)) {
      const items = [line];
      while (i + 1 < lines.length && /^[-*]\s\S/.test(lines[i + 1].trim())) items.push(lines[++i].trim());
      html.push(`<ul>${items.map((it) => `<li>${inline(it.replace(/^[-*]\s/, ''))}</li>`).join('')}</ul>`);
      continue;
    }
    if (/^\|.*\|$/.test(line)) {
      const rows = [line];
      while (i + 1 < lines.length && /^\|.*\|$/.test(lines[i + 1].trim())) rows.push(lines[++i].trim());
      const cells = rows.filter((r) => !/^\|[\s:-|]+\|$/.test(r)).map((r) => r.slice(1, -1).split('|').map((c) => c.trim()));
      if (cells.length) html.push(`<table><thead><tr>${cells[0].map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${cells.slice(1).map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      continue;
    }
    html.push(`<p>${inline(line)}</p>`);
  }
  return { html: html.join('\n'), firstImage, excerptFromQuote };
}

function excerptOf(html, quote) {
  const truncated = /(\.\.\.|…)\s*$/.test(quote);
  let t = quote.replace(/^스타트업 경영 코치 수드입니다\.?\s*/, '').replace(/\s*[…\.]{0,3}$/, '');
  if (truncated || t.length < 20) {
    const ps = [...html.matchAll(/<p>(.*?)<\/p>/g)].map((m) => m[1].replace(/<[^>]+>/g, '')).filter((p) => p.length > 30 && !p.startsWith('스타트업 경영 코치'));
    t = ps[0] || t;
  }
  t = t.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  if (t.length > 110) t = t.slice(0, 108).replace(/\s+\S*$/, '') + '…';
  return t;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const posts = [];
for (const file of walk(SRC)) {
  const parsed = parseFrontmatter(readFileSync(file, 'utf8'));
  if (!parsed || parsed.meta.type !== 'blog-post' || !parsed.meta.logNo) continue;
  const { meta, body } = parsed;
  const { html, firstImage, excerptFromQuote } = toHtml(body, meta.title);
  const post = {
    id: String(meta.logNo),
    title: meta.title,
    date: meta.date,
    category: meta.category || 'Etc',
    url: meta.url,
    comments: Number(meta.comments || 0),
    excerpt: excerptOf(html, excerptFromQuote),
    thumb: firstImage,
    words: html.replace(/<[^>]+>/g, '').length,
  };
  writeFileSync(join(OUT, `${post.id}.json`), JSON.stringify({ ...post, html }));
  posts.push(post);
}
posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
writeFileSync(join(OUT, 'index.json'), JSON.stringify(posts));

const urls = ['/', '/about', '/consulting', '/articles', ...posts.map((p) => `/articles/${p.id}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`;
writeFileSync(resolve('public/sitemap.xml'), sitemap);

const byCat = posts.reduce((a, p) => ((a[p.category] = (a[p.category] || 0) + 1), a), {});
console.log(`imported ${posts.length} posts from ${SRC}`);
console.log(byCat);
if (!existsSync(join(OUT, 'index.json'))) process.exit(1);
