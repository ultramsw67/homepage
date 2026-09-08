// IndexNow 로 사이트맵의 URL 을 검색엔진(네이버·빙·얀덱스 등 IndexNow 참여 엔진)에 직접 제출한다.
// 키 파일: public/<32자리 hex>.txt (내용 = 키). 배포되어 https://sood-page.web.app/<key>.txt 로 접근 가능해야 한다.
// 실행: node scripts/indexnow.mjs            → 사이트맵 전체 URL 제출
//       node scripts/indexnow.mjs /articles/224404004807 …  → 지정 URL 만 제출
import { readdirSync, readFileSync } from 'node:fs';

const SITE = 'https://sood-page.web.app';
const HOST = 'sood-page.web.app';
const keyFile = readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) { console.error('public/ 에 IndexNow 키 파일(32자리 hex .txt)이 없습니다.'); process.exit(1); }
const key = readFileSync(`public/${keyFile}`, 'utf8').trim();

let urls = process.argv.slice(2).map((u) => (u.startsWith('http') ? u : SITE + u));
if (!urls.length) {
  const sm = readFileSync('public/sitemap.xml', 'utf8');
  urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

// 키 파일이 실제로 배포되어 있는지 먼저 확인
const check = await fetch(`${SITE}/${keyFile}`);
if (!check.ok || (await check.text()).trim() !== key) { console.error(`키 파일이 아직 배포되지 않았습니다: ${SITE}/${keyFile} (${check.status})`); process.exit(2); }

const body = { host: HOST, key, keyLocation: `${SITE}/${keyFile}`, urlList: urls.slice(0, 10000) };
// 참여 엔진 한 곳에 제출하면 나머지에도 공유되지만, 이 노트북에서 api.indexnow.org 연결이 끊기는 경우가 있어 네이버·빙 엔드포인트에도 직접 제출한다.
const endpoints = ['https://searchadvisor.naver.com/indexnow', 'https://www.bing.com/indexnow', 'https://api.indexnow.org/indexnow'];
let ok = 0;
for (const ep of endpoints) {
  try {
    const res = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) });
    console.log(`${ep} → HTTP ${res.status} ${res.statusText} (${urls.length} URLs)`);
    if ([200, 202].includes(res.status)) ok++; else console.error((await res.text()).slice(0, 300));
  } catch (e) { console.log(`${ep} → 연결 실패 (${e.cause?.code || e.message})`); }
}
if (!ok) process.exit(3);
