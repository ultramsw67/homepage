// 옵시디언 vault 의 「수드 사례 연재 목록」 → public/series.json (홈페이지 /series 연재 페이지 자료, 2026-10-05)
// 사용: node scripts/import-series.mjs   (npm run import:blog 가 글 가져오기 뒤에 함께 실행한다)
// 연재 목록 노트는 평일 07:10 자동 작업(tomwiki 연재 문구)이 새 사례 글마다 한 줄씩 더한다 → 08:00 발행 마무리 때 이 파일도 갱신된다.
// 노트가 없으면(다른 컴퓨터·CI) 지난번 series.json 을 그대로 둔다.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const SRC = 'C:/Obsidian/tomwiki/10_블로그/블로그 운영/수드 사례 연재 목록.md';
const OUT = resolve('public/series.json');

if (!existsSync(SRC)) { console.log('series: 연재 목록 노트가 없어 건너뜀'); process.exit(0); }
const md = readFileSync(SRC, 'utf8');

const series = [];
let cur = null;
for (const line of md.split(/\r?\n/)) {
  let m = line.match(/^## ([A-Z])\. (.+?) \((\d+)편\)\s*$/);
  if (m) { cur = { key: m[1], name: m[2].trim(), desc: '', items: [] }; series.push(cur); continue; }
  if (!cur) continue;
  m = line.match(/^본문 문구: `\[[^\]]+\] ([^`]+)`/);
  // "…분석해보는 연재입니다." → "…분석합니다." (카드 한 줄 설명)
  if (m) { cur.desc = m[1].replace(/ 연재입니다\.$/, '').replace(/분석해보는$/, '분석합니다.').replace(/살펴보는$/, '살펴봅니다.').trim(); continue; }
  // 손으로 쓴 줄은 "[제목](주소) · [[노트]]", 자동 작업이 더한 줄은 "[제목](주소)" 로 끝난다 — 둘 다 받는다
  m = line.match(/^\| *(\d+) *\| *(\d{4}-\d\d-\d\d) *\| *(.*?) *\| *\d* *\| *\[(.+)\]\((https:\/\/blog\.naver\.com\/ultramsw67\/(\d+))\)/);
  if (m) cur.items.push({ no: +m[1], date: m[2], subject: m[3] === '—' ? '' : m[3], title: m[4].replace(/｜/g, '|'), url: m[5], id: m[6] });
}
for (const s of series) s.items.sort((a, b) => a.no - b.no);

const total = series.reduce((n, s) => n + s.items.length, 0);
if (series.length < 6 || total < 59) { console.error(`series: 연재 목록을 다 읽지 못함 (연재 ${series.length}개, ${total}편) → 지난 파일 유지`); process.exit(0); }

const data = { at: series.flatMap((s) => s.items.map((i) => i.date)).sort().pop(), total, series };
const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
const next = JSON.stringify(data);
if (before !== next) writeFileSync(OUT, next);
console.log(`series: 연재 ${series.length}개 · ${total}편${before === next ? ' (변경 없음)' : ' → public/series.json'}`);
