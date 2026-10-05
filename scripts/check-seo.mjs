// 빌드 검사: prerender 뒤에 dist/ 의 모든 페이지를 검사하고, 하나라도 틀리면 실패(종료 코드 1)해서 배포를 멈춘다 — 2026-10-05
// 검사: <title> 1개 · <h1> 1개 · description 50자 이상 · 본문 200자 이상 · canonical(글은 네이버 원문, 나머지는 자기 주소)
//       · JSON-LD 파싱 · og:image 가 이 사이트 파일이면 dist 에 실제로 있는지 · favicon.ico 존재
// 실행: node scripts/check-seo.mjs  (package.json build 맨 끝에서 자동 실행)
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const SITE = 'https://soodcoach.com';
const DIST = resolve('dist');
const SKIP = new Set(['404.html']);   // noindex 페이지
const SKIP_DIRS = new Set(['dashboard', 'assets', 'posts']);   // 잠긴 대시보드·빌드 산출물

const pages = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(f)) walk(p); }
    else if (f === 'index.html') pages.push(p);
  }
})(DIST);

const text = (html) => html
  .replace(/<head[\s\S]*?<\/head>/, ' ')
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
const count = (html, re) => (html.match(re) || []).length;

const errors = [];
const noindexed = [];
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(DIST, file).replace(/\\/g, '/');
  if (SKIP.has(rel)) continue;
  if (/<meta name="robots" content="noindex/.test(html)) { noindexed.push(rel); continue; }   // 검색 제외 페이지(본문이 거의 없는 글)
  const route = '/' + rel.replace(/(^|\/)index\.html$/, '');
  const url = SITE + (route === '/' ? '/' : route.replace(/\/$/, ''));
  const bad = (msg) => errors.push(`${route}: ${msg}`);

  if (count(html, /<title>/g) !== 1) bad(`<title> ${count(html, /<title>/g)}개`);
  const h1 = count(html, /<h1[\s>]/g);
  if (h1 !== 1) bad(`<h1> ${h1}개`);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  if (desc.length < 50) bad(`description ${desc.length}자 (50자 이상)`);
  const body = text(html);
  if (body.length < 200) bad(`본문 ${body.length}자 (200자 이상)`);

  const canon = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
  if (canon.length !== 1) bad(`canonical ${canon.length}개`);
  else if (route.startsWith('/articles/')) { if (!/^https:\/\/blog\.naver\.com\//.test(canon[0])) bad(`글 canonical 이 네이버 원문이 아님: ${canon[0]}`); }
  else if (canon[0] !== url) bad(`canonical 불일치: ${canon[0]} (기대 ${url})`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { bad(`JSON-LD 파싱 실패: ${e.message}`); }
  }
  const og = (html.match(/<meta property="og:image" content="([^"]*)"/) || [])[1];
  if (!og) bad('og:image 없음');
  else if (og.startsWith(SITE + '/') && !existsSync(join(DIST, og.slice(SITE.length + 1)))) bad(`og:image 파일 없음: ${og}`);
}
if (!existsSync(join(DIST, 'favicon.ico'))) errors.push('/favicon.ico 없음');

if (errors.length) {
  console.error(`검색 최적화 검사 실패 ${errors.length}건 (${pages.length}쪽 중):`);
  for (const e of errors.slice(0, 50)) console.error('  - ' + e);
  if (errors.length > 50) console.error(`  … 외 ${errors.length - 50}건`);
  process.exit(1);
}
console.log(`검색 최적화 검사 통과: ${pages.length - noindexed.length}쪽 (title·h1·description·본문·canonical·JSON-LD·og:image·favicon)${noindexed.length ? ` · 검색 제외 ${noindexed.length}쪽` : ''}`);
