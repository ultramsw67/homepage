// public/posts/*.json 의 본문에서 태그를 걷어낸 글자만 모아 public/search.json 을 만든다.
// 글 목록의 검색창이 제목·요약뿐 아니라 본문까지 훑을 수 있게 하는 자료.
// 검색창을 누르는 순간에만 내려받으므로 첫 화면 속도에는 영향을 주지 않는다.
// 실행: node scripts/build-search.mjs  (import:blog 끝과 build 앞에서 자동 실행)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const POSTS = resolve('public/posts');
const OUT = resolve('public/search.json');

// scripts/prerender.mjs 의 plain() 과 같은 규칙 (두 곳의 결과가 달라지지 않게)
const plain = (html = '') => html
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();

const indexFile = join(POSTS, 'index.json');
if (!existsSync(indexFile)) { console.error('public/posts/index.json 이 없습니다. npm run import:blog 를 먼저 실행하세요.'); process.exit(1); }

const posts = JSON.parse(readFileSync(indexFile, 'utf8'));
const bodies = {};
let chars = 0;
for (const p of posts) {
  const file = join(POSTS, `${p.id}.json`);
  if (!existsSync(file)) continue;
  const text = plain(JSON.parse(readFileSync(file, 'utf8')).html || '').toLowerCase();
  if (!text) continue;
  bodies[p.id] = text;
  chars += text.length;
}

const json = JSON.stringify(bodies);
writeFileSync(OUT, json);
const kb = (n) => `${Math.round(n / 1024)}KB`;
console.log(`search.json: ${Object.keys(bodies).length}편 · 본문 ${chars.toLocaleString()}자 · ${kb(Buffer.byteLength(json))} (압축 전송 시 약 ${kb(gzipSync(Buffer.from(json)).length)})`);
