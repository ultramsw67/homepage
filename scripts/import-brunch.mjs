// 브런치(수트와후드 @a3b90b2e717a467) 공개 글 목록 → public/brunch.json (2026-09-22)
// 글 목록 페이지에서 네이버 블로그 글과 함께 보여 주려고 제목·부제·요약·대표 이미지·라이킷을 받아 둔다.
// 본문은 브런치가 자바스크립트로 그려서 가져오지 않는다 — 카드만 홈페이지, 읽기는 브런치에서.
// 카카오 로그인은 쓰지 않는다(손님 세션). 사용: npm run import:brunch
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'public', 'brunch.json');
const ID = 'a3b90b2e717a467';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const jar = {};
const cookie = () => Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ');
const keep = (r) => {
  const sc = r.headers.getSetCookie ? r.headers.getSetCookie() : [];
  for (const c of sc) { const kv = c.split(';')[0]; const i = kv.indexOf('='); if (i > 0) jar[kv.slice(0, i).trim()] = kv.slice(i + 1).trim(); }
};
async function get(url, accept) {
  for (let hop = 0; hop < 8; hop++) {
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: accept || 'text/html', cookie: cookie(), referer: 'https://brunch.co.kr/' }, redirect: 'manual' });
    keep(r);
    const loc = r.headers.get('location');
    if (r.status >= 300 && r.status < 400 && loc) { url = new URL(loc, url).href; continue; }
    return { status: r.status, text: await r.text() };
  }
  throw new Error('redirect 8회 초과');
}
const thumb = (u, w) => (u ? `https://img1.kakaocdn.net/thumb/R${w}x0.fpng/?fname=${encodeURIComponent(u)}` : null);
const clip = (s, n) => { const t = String(s || '').replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n - 1)}…` : t; };

try {
  await get(`https://brunch.co.kr/@${ID}`); // 손님 쿠키 받기
  const prof = await get(`https://brunch.co.kr/@${ID}`);
  if (prof.status !== 200) throw new Error(`프로필 HTTP${prof.status}`);
  const num = (re) => { const m = prof.text.match(re); return m ? Number(m[1]) : null; };

  const posts = [];
  let url = `https://api.brunch.co.kr/v1/article/@${ID}?page=1`;
  for (let page = 1; page <= 15 && url; page++) {
    const r = await get(url, 'application/json');
    if (r.status !== 200) throw new Error(`글 목록 HTTP${r.status}`);
    const j = JSON.parse(r.text);
    for (const a of j?.data?.list || []) {
      if (a.status && a.status !== 'publish') continue;
      const img = (a.articleImageList || [])[0];
      posts.push({
        no: a.no,
        url: `https://brunch.co.kr/@${ID}/${a.no}`,
        title: (a.title || '').trim(),
        sub: (a.subTitle || '').trim(),
        excerpt: clip(a.contentSummary, 120),
        date: a.publishTime ? new Date(a.publishTime).toISOString().slice(0, 10) : null,
        like: a.likeCount || 0,
        comments: a.commentCount || 0,
        series: a.magazineTitle || null,
        thumb: thumb(img?.url, 640),
      });
    }
    const next = j?.data?.nextUrl;
    url = next ? (/^https?:/.test(next) ? next : `https://api.brunch.co.kr${next}`) : null;
    await new Promise((r2) => setTimeout(r2, 300));
  }
  if (!posts.length) throw new Error('받은 글이 0편');
  posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const seriesNames = [...new Set(posts.map((p) => p.series).filter(Boolean))];
  const out = {
    at: new Date().toISOString(),
    profile: {
      url: `https://brunch.co.kr/@${ID}`,
      followers: num(/"followerCount"\s*:\s*(\d+)/),
      articles: num(/"articleCount"\s*:\s*(\d+)/),
      likes: posts.reduce((a, p) => a + p.like, 0),
    },
    series: seriesNames.map((name) => ({ name, count: posts.filter((p) => p.series === name).length })),
    posts,
  };
  mkdirSync(dirname(DEST), { recursive: true });
  writeFileSync(DEST, `${JSON.stringify(out, null, 1)}\n`, 'utf8');
  console.log(`imported ${posts.length} brunch posts (연재 ${seriesNames.length}개, 구독자 ${out.profile.followers})`);
} catch (e) {
  // 브런치가 잠깐 막히거나 형식이 바뀌어도 배포는 멈추지 않는다 — 지난번 파일을 그대로 쓴다
  const had = existsSync(DEST);
  console.error(`✗ 브런치 수집 실패: ${e.message}${had ? ' — 지난번 public/brunch.json 을 그대로 씁니다' : ' — brunch.json 없이 진행합니다'}`);
  if (had) { const old = JSON.parse(readFileSync(DEST, 'utf8')); console.error(`  (지난번 자료: ${old.posts?.length ?? 0}편, ${old.at})`); }
  process.exit(0);
}
