// 빌드 후 실행: dist/index.html 을 바탕으로 라우트별 정적 HTML(제목·설명·canonical·OG·JSON-LD·본문 폴백)과 rss.xml 을 만든다.
// 검색엔진(특히 네이버)이 자바스크립트 없이도 글 제목·본문을 읽을 수 있게 하기 위한 것. React 는 로드 후 #root 를 다시 그린다.
// 실행: node scripts/prerender.mjs  (package.json build 에서 vite build 뒤에 자동 실행)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SITE = 'https://sood-page.web.app';
const DIST = resolve('dist');
const POSTS = resolve('public/posts');
const BRAND = '수트와후드 SOOD';
const AUTHOR = '문성운';
const DEFAULT_IMAGE = `${SITE}/sood-character.jpg`;

if (!existsSync(join(DIST, 'index.html'))) { console.error('dist/index.html 이 없습니다. vite build 먼저 실행하세요.'); process.exit(1); }
const template = readFileSync(join(DIST, 'index.html'), 'utf8');
const posts = JSON.parse(readFileSync(join(POSTS, 'index.json'), 'utf8'));

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (iso) => (iso ? iso.replace(/-/g, '.') : '');
const jsonld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

const person = {
  '@type': 'Person', name: AUTHOR, alternateName: '수드', jobTitle: '스타트업 경영 코치', url: `${SITE}/about`,
  sameAs: ['https://blog.naver.com/ultramsw67', 'https://brunch.co.kr/@a3b90b2e717a467'],
  worksFor: { '@type': 'Organization', name: BRAND, url: SITE },
};
const organization = { '@type': 'Organization', name: BRAND, url: SITE, logo: DEFAULT_IMAGE, founder: { '@type': 'Person', name: AUTHOR } };

function render({ path, title, description, type = 'website', image = DEFAULT_IMAGE, head = '', body = '' }) {
  const url = `${SITE}${path}`;
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${type}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(image)}" />`);
  html = html.replace('</head>', `    <link rel="canonical" href="${url}" />\n    <meta name="twitter:title" content="${esc(title)}" />\n    <meta name="twitter:description" content="${esc(description)}" />\n    <meta name="twitter:image" content="${esc(image)}" />\n${head}  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  const dir = path === '/' ? DIST : join(DIST, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

const postLink = (p) => `<li><a href="/articles/${p.id}">${esc(p.title)}</a> <span>${fmt(p.date)}</span></li>`;

// 1) 홈
render({
  path: '/',
  title: `${BRAND} | 스타트업 경영 코치 ${AUTHOR}`,
  description: `스타트업 경영 코치 수트와후드(SOOD) ${AUTHOR}. 현대그룹 기획실과 19년 창업·엑시트 경험으로 사업모델, 지표·PMF, 투자·정부지원, AI 활용을 코칭합니다. 스타트업 경영 칼럼 ${posts.length}편.`,
  head: `    ${jsonld({ '@context': 'https://schema.org', '@graph': [{ '@type': 'WebSite', name: BRAND, url: SITE, inLanguage: 'ko', publisher: organization }, { '@context': 'https://schema.org', ...person }, { '@context': 'https://schema.org', ...organization }] })}\n`,
  body: `<main class="wrap page"><h1>${BRAND} | 스타트업 경영 코치 ${AUTHOR}</h1><p>수트의 논리, 후드의 실행. 사업모델·지표·투자·정부지원·AI 활용을 함께 설계하는 스타트업 경영 코치입니다.</p><h2>최근 글</h2><ul>${posts.slice(0, 6).map(postLink).join('')}</ul><p><a href="/articles">글 전체 보기</a> · <a href="/about">소개</a> · <a href="/consulting">상담</a></p></main>`,
});

// 2) 소개
render({
  path: '/about',
  title: `소개 | ${BRAND}`,
  description: `${AUTHOR}(수드). 현대그룹 기획실 출신의 가치평가 프레임과 IT 스타트업 창업·매각 경험을 융합해 지표 중심의 데이터 경영을 코칭합니다.`,
  type: 'profile',
  head: `    ${jsonld({ '@context': 'https://schema.org', ...person })}\n`,
  body: `<main class="wrap page"><h1>소개</h1><p>${AUTHOR}(수드)는 현대그룹 기획실 출신의 가치평가(Valuation) 프레임과 IT 스타트업 창업·매각(Exit) 경험을 융합해 지표 중심의 데이터 경영을 리드하는 스타트업 경영 코치입니다.</p><p>비즈니스 모델 설계, 지표 튜닝, 신사업 타당성 시뮬레이션, 투자유치·정부지원사업, AI 활용을 1:1로 코칭합니다.</p></main>`,
});

// 3) 상담
render({
  path: '/consulting',
  title: `1:1 경영 상담 | ${BRAND}`,
  description: '초기 스타트업·1인 기업 대표를 위한 1:1 경영 코칭. 사업모델, 지표·PMF, 투자·정부지원, AI 활용을 함께 설계합니다.',
  body: `<main class="wrap page"><h1>1:1 경영 상담</h1><p>초기 스타트업과 1인 기업 대표를 위한 1:1 경영 코칭입니다. 사업모델, 지표와 PMF, 투자유치와 정부지원사업, AI 활용을 함께 설계합니다.</p><p>문의: ultramsw67@gmail.com</p></main>`,
});

// 4) 글 목록
render({
  path: '/articles',
  title: `스타트업 경영 칼럼 ${posts.length}편 | ${BRAND}`,
  description: '스타트업 전략·피벗, 투자·정부지원, 실전 전술, AI 리터러시, 창업자 마인드셋. 매일 발행하는 스타트업 경영 칼럼.',
  head: `    ${jsonld({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: '스타트업 경영 칼럼', url: `${SITE}/articles`, isPartOf: { '@type': 'WebSite', name: BRAND, url: SITE } })}\n`,
  body: `<main class="wrap page"><h1>스타트업 경영 칼럼</h1><ul>${posts.map(postLink).join('')}</ul></main>`,
});

// 5) 글 상세
let n = 0;
for (const p of posts) {
  const file = join(POSTS, `${p.id}.json`);
  if (!existsSync(file)) continue;
  const full = JSON.parse(readFileSync(file, 'utf8'));
  const url = `${SITE}/articles/${p.id}`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.excerpt, url,
    mainEntityOfPage: url, datePublished: p.date, dateModified: p.date, inLanguage: 'ko',
    image: p.thumb ? [p.thumb] : [DEFAULT_IMAGE], author: person, publisher: organization, isBasedOn: p.url,
  };
  render({
    path: `/articles/${p.id}`,
    title: `${p.title} | ${BRAND}`,
    description: p.excerpt || p.title,
    type: 'article',
    image: p.thumb || DEFAULT_IMAGE,
    head: `    <meta property="article:published_time" content="${p.date}" />\n    <meta property="article:author" content="${AUTHOR}" />\n    <meta property="article:section" content="${esc(p.category)}" />\n    ${jsonld(ld)}\n`,
    body: `<article class="wrap page reading"><header class="article-head"><p class="eyebrow">${esc(p.category)}</p><h1>${esc(p.title)}</h1><p class="muted">${fmt(p.date)} · ${AUTHOR}</p></header><div class="article-body">${full.html}</div><p><a href="${esc(p.url)}" rel="noreferrer">네이버 블로그 원문 보기</a> · <a href="/articles">글 목록</a></p></article>`,
  });
  n++;
}

// 6) RSS (네이버 서치어드바이저 RSS 제출용)
const rssItems = posts.slice(0, 50).map((p) => `    <item>\n      <title>${esc(p.title)}</title>\n      <link>${SITE}/articles/${p.id}</link>\n      <guid isPermaLink="true">${SITE}/articles/${p.id}</guid>\n      <description>${esc(p.excerpt || '')}</description>\n      <category>${esc(p.category)}</category>\n      <pubDate>${new Date(`${p.date}T09:00:00+09:00`).toUTCString()}</pubDate>\n    </item>`).join('\n');
writeFileSync(join(DIST, 'rss.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${BRAND} 스타트업 경영 칼럼</title>\n    <link>${SITE}</link>\n    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />\n    <description>스타트업 경영 코치 ${AUTHOR}의 칼럼</description>\n    <language>ko</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${rssItems}\n  </channel>\n</rss>\n`);

console.log(`prerendered: 4 pages + ${n} articles, rss.xml (${Math.min(50, posts.length)} items)`);
