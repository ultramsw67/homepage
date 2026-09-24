// 빌드 후 실행: dist/index.html 을 바탕으로 라우트별 정적 HTML(제목·설명·canonical·OG·JSON-LD·본문 폴백), rss.xml, llms.txt, 404.html 을 만든다.
// 검색엔진(특히 네이버)과 AI 검색 수집기(GPTBot·ClaudeBot·PerplexityBot 등, 대부분 자바스크립트를 실행하지 않음)가
// 자바스크립트 없이도 소개·서비스·글 본문을 읽을 수 있게 하기 위한 것. React 는 로드 후 #root 를 다시 그린다.
// 실행: node scripts/prerender.mjs  (package.json build 에서 vite build 뒤에 자동 실행)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { experience, services, profile, cases, process as steps, faq, stats } from '../src/lib/site.js';

const SITE = 'https://soodcoach.com';
const DIST = resolve('dist');
const POSTS = resolve('public/posts');
const BRAND = '수트와후드 SOOD';
const AUTHOR = '문성운';
const DEFAULT_IMAGE = `${SITE}/sood-character.jpg`;
const PERSON_ID = `${SITE}/about#person`;
const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;
const MOBIINSIDE = 'https://www.mobiinside.co.kr/author/ultramsw67/';

if (!existsSync(join(DIST, 'index.html'))) { console.error('dist/index.html 이 없습니다. vite build 먼저 실행하세요.'); process.exit(1); }
const template = readFileSync(join(DIST, 'index.html'), 'utf8');
const posts = JSON.parse(readFileSync(join(POSTS, 'index.json'), 'utf8'));
// 브런치 글 (public/brunch.json) — 목록 페이지에 함께 싣는다. 본문은 브런치에 있으므로 링크만
const BRUNCH_FILE = resolve('public/brunch.json');
const brunch = existsSync(BRUNCH_FILE) ? JSON.parse(readFileSync(BRUNCH_FILE, 'utf8')) : { posts: [], profile: {} };
const brunchPosts = brunch.posts || [];

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (iso) => (iso ? iso.replace(/-/g, '.') : '');
const jsonld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const plain = (html = '') => html
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();
const clip = (s, n = 150) => (s.length <= n ? s : `${s.slice(0, s.lastIndexOf(' ', n) > n * 0.6 ? s.lastIndexOf(' ', n) : n)}…`);

// 사람·브랜드 정보는 @id 로 한 번 정의하고 모든 페이지에서 같은 id 로 가리킨다 (AI·검색엔진이 같은 사람으로 묶게)
const topics = ['스타트업 경영', '비즈니스 모델 설계', '지표·PMF 검증', '가치평가(Valuation)', '투자유치·IR', '정부지원사업', 'AI 에이전트 활용', '1인 기업'];
const ABOUT_DESC = `${AUTHOR}(수드). 현대그룹 기획실 출신의 가치평가 프레임과 IT 스타트업 창업·매각 경험을 융합해 지표 중심의 데이터 경영을 코칭합니다.`;
const person = {
  '@type': 'Person', '@id': PERSON_ID, name: AUTHOR, alternateName: ['수드', 'Sung Woon Moon'], jobTitle: '스타트업 경영 코치',
  description: ABOUT_DESC, url: `${SITE}/about`, image: DEFAULT_IMAGE, email: `mailto:${profile.email}`,
  alumniOf: { '@type': 'CollegeOrUniversity', name: '연세대학교' },
  knowsAbout: topics,
  sameAs: [profile.blog, profile.brunch, profile.linkedin, MOBIINSIDE],
  worksFor: { '@id': ORG_ID },
};
const organization = {
  '@type': 'Organization', '@id': ORG_ID, name: BRAND, alternateName: ['수트와후드', 'SOOD', 'Suit & Hood'], url: SITE,
  logo: DEFAULT_IMAGE, image: DEFAULT_IMAGE, email: profile.email,
  description: '스타트업 경영 코치 문성운의 1:1 경영 자문 브랜드. 초기 스타트업 대표, 예비창업자, 1인 기업가의 사업모델·지표·투자·정부지원·AI 활용을 코칭합니다.',
  founder: { '@id': PERSON_ID }, areaServed: { '@type': 'Country', name: '대한민국' }, knowsAbout: topics,
  sameAs: [profile.blog, profile.brunch],
};
const personRef = { '@type': 'Person', '@id': PERSON_ID, name: AUTHOR, url: `${SITE}/about` };
const orgRef = { '@type': 'Organization', '@id': ORG_ID, name: BRAND, url: SITE, logo: { '@type': 'ImageObject', url: DEFAULT_IMAGE } };
const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: '홈', path: '/' }, ...items].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${SITE}${c.path}` })),
});
const graph = (...nodes) => jsonld({ '@context': 'https://schema.org', '@graph': nodes });

function render({ path, title, description, type = 'website', image = DEFAULT_IMAGE, head = '', body = '', file, noindex = false }) {
  const url = `${SITE}${path}`;
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${type}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(image)}" />`);
  if (noindex) html = html.replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, follow" />');
  const canonical = noindex ? '' : `    <link rel="canonical" href="${url}" />\n`;
  html = html.replace('</head>', `${canonical}    <link rel="alternate" type="text/plain" title="llms.txt" href="${SITE}/llms.txt" />\n    <meta name="twitter:title" content="${esc(title)}" />\n    <meta name="twitter:description" content="${esc(description)}" />\n    <meta name="twitter:image" content="${esc(image)}" />\n${head}  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  if (file) { writeFileSync(join(DIST, file), html); return; }
  const dir = path === '/' ? DIST : join(DIST, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

const postLink = (p) => `<li><a href="/articles/${p.id}">${esc(p.title)}</a> <span>${fmt(p.date)}</span></li>`;
const brunchLink = (p) => `<li><a href="${esc(p.url)}" rel="noreferrer">${esc(p.title)}</a> <span>${fmt(p.date)} · 브런치${p.series ? ` · ${esc(p.series)}` : ''}</span></li>`;
const channelLinks = `<p><a href="${profile.blog}">네이버 블로그 「수트와후드」</a> · <a href="${profile.brunch}">브런치</a> · <a href="${profile.linkedin}">링크드인</a> · <a href="${MOBIINSIDE}">모비인사이드 칼럼</a> · <a href="mailto:${profile.email}">${profile.email}</a></p>`;
const servicesHtml = (tag = 'h3') => services.map((s) => `<section id="${s.id}"><${tag}>${s.number}. ${esc(s.title)}</${tag}><p><strong>${esc(s.tagline)}</strong> ${esc(s.description)}</p><ul>${s.outputs.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></section>`).join('');
const experienceHtml = `<ol class="timeline">${experience.map((e) => `<li><span>${esc(e.period)}</span><div><strong>${esc(e.org)}</strong> <em>${esc(e.role)}</em><p>${esc(e.desc || '')}</p></div></li>`).join('')}</ol>`;
const faqHtml = `<section id="faq"><h2>자주 묻는 질문</h2><dl>${faq.map((f) => `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`).join('')}</dl></section>`;
const statValue = (s) => (s.dynamic === 'posts' ? s.value.replace('{n}', posts.length + brunchPosts.length) : s.value);

// 1) 홈
render({
  path: '/',
  title: `${BRAND} | 스타트업 경영 코치 ${AUTHOR}`,
  description: `스타트업 경영 코치 문성운(수트와후드 SOOD). 현대석유화학 기획실에서 M&A와 가치평가를 맡았고, 2001년 창업한 인터랙티비를 19년 운영한 뒤 매각했습니다. 초기 창업자의 사업모델, 지표와 PMF, 정부지원과 투자, AI 1인 기업 운영을 1:1로 자문합니다. 경영 칼럼 ${posts.length + brunchPosts.length}편.`,
  head: `    ${graph({ '@type': 'WebSite', '@id': WEBSITE_ID, name: BRAND, alternateName: '수트와후드', url: SITE, inLanguage: 'ko', publisher: { '@id': ORG_ID } }, organization, person)}\n`,
  body: `<main class="wrap page"><h1>${BRAND} | 스타트업 경영 코치 ${AUTHOR}</h1><p>현대 기획실에서 숫자를 배웠고, 제 회사를 19년 운영했습니다. 지금은 초기 창업자와 마주 앉아 사업모델, 숫자, 자금 문제를 같이 봅니다. 수트와후드(SOOD)는 넥타이와 후드티를 둘 다 입어 본 사람의 자문이라는 뜻입니다.</p>${channelLinks}<ul>${stats.map((s) => `<li><strong>${esc(statValue(s))}</strong> — ${esc(s.label)}</li>`).join('')}</ul><h2>이런 문제를 같이 봅니다</h2>${servicesHtml()}<h2>왜 수트와후드인가</h2><p>1993년 현대석유화학 기획실에서 첫 경력을 시작해 M&amp;A와 가치평가(Valuation)를 맡았습니다. 수천억 원 규모의 거래를 숫자로 따지는 자리였습니다. 2001년에는 넥타이를 풀고 IT 스타트업 인터랙티비를 창업했습니다. 투자를 유치해 회사를 키웠고 매각까지 이뤄냈습니다.</p><p>그 뒤로 여러 스타트업을 곁에서 자문해 왔습니다. 지금은 수트의 논리와 후드의 실행, 두 경험을 합쳐 창업자를 코칭합니다.</p><h2>최근 글</h2><ul>${posts.slice(0, 6).map(postLink).join('')}</ul><h2>걸어온 길</h2>${experienceHtml}<p><a href="/articles">글 전체 보기</a> · <a href="/about">소개</a> · <a href="/consulting">상담</a> · <a href="/consulting#faq">자주 묻는 질문</a></p></main>`,
});

// 2) 소개
render({
  path: '/about',
  title: `${AUTHOR} 소개 | 스타트업 경영 코치 · ${BRAND}`,
  description: ABOUT_DESC,
  type: 'profile',
  head: `    ${graph({ '@type': 'ProfilePage', '@id': `${SITE}/about`, url: `${SITE}/about`, name: `${AUTHOR} 소개`, inLanguage: 'ko', isPartOf: { '@id': WEBSITE_ID }, mainEntity: person }, organization, crumbs([{ name: '소개', path: '/about' }]))}\n`,
  body: `<main class="wrap page"><h1>${AUTHOR} 소개</h1><p>수트와후드, ${AUTHOR}입니다. 연세대학교 화학공학을 졸업하고 현대그룹 기획실에서 커리어를 시작했습니다. 사업의 구조를 이해하고 실행의 어려움을 아는 창업가이자 스타트업 경영 코치입니다.</p><p>${AUTHOR}(수드)는 현대그룹 기획실 출신의 가치평가(Valuation) 프레임과 IT 스타트업 창업·매각(Exit) 경험을 융합해 지표 중심의 데이터 경영을 리드하는 스타트업 경영 코치입니다.</p><p>2023년부터 25만 유저 서비스의 전략 고문으로 리텐션 관리와 AI 에이전트 도입 모델을 맡았고, 지금까지 20개 팀의 사업모델·지표·투자·정부지원을 1:1로 자문했습니다. 비즈니스 모델 설계, 지표 튜닝, 신사업 타당성 시뮬레이션, 투자유치·정부지원사업, AI 에이전트 활용을 1:1로 코칭합니다.</p><p>매일 아침 네이버 블로그 「수트와후드」에 스타트업 경영 칼럼을 쓰고, 브런치북 「온라인 쇼핑몰의 데이터 경영 전략」 「런웨이 12주, 1000억의 증명」을 펴냈으며, 모비인사이드에 「수트와 후드의 스타트업 경영」을 연재합니다.</p>${channelLinks}<h2>경력</h2>${experienceHtml}<p>연세대학교 화학공학 졸업</p><h2>자문 사례</h2><ul>${cases.map((c) => `<li><strong>${esc(c.field)}</strong> — ${esc(c.result)}</li>`).join('')}</ul><p>고객사 이름과 상세 수치는 공개하지 않습니다.</p><p><a href="/consulting">상담 안내</a> · <a href="/articles">칼럼 보기</a></p></main>`,
});

// 3) 상담
const offerCatalog = {
  '@type': 'Service', '@id': `${SITE}/consulting#service`, name: '1:1 스타트업 경영 자문', serviceType: '스타트업 경영 코칭', url: `${SITE}/consulting`,
  provider: { '@id': ORG_ID }, areaServed: { '@type': 'Country', name: '대한민국' }, audience: { '@type': 'Audience', audienceType: '초기 스타트업 대표, 예비창업자, 1인 기업가' },
  hasOfferCatalog: { '@type': 'OfferCatalog', name: '자문 분야', itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.description } })) },
};
render({
  path: '/consulting',
  title: `1:1 스타트업 경영 상담·자문 | ${BRAND}`,
  description: '초기 스타트업·예비창업자·1인 기업 대표를 위한 1:1 경영 코칭. 사업모델, 지표·PMF, 투자·정부지원, AI 활용을 함께 설계합니다. 첫 상담 60분.',
  head: `    ${graph(offerCatalog, { '@type': 'FAQPage', '@id': `${SITE}/consulting#faq`, mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }, organization, crumbs([{ name: '상담', path: '/consulting' }]))}\n`,
  body: `<main class="wrap page"><h1>1:1 경영 상담</h1><p>초기 스타트업 대표, 예비창업자, 1인 기업가와 일합니다. 자주 받는 질문은 아래에 먼저 답해 두었습니다.</p><h2>이런 문제를 같이 봅니다</h2>${servicesHtml()}<h2>상담은 이렇게 진행됩니다</h2><ol>${steps.map((p) => `<li><strong>${esc(p.title)}</strong> — ${esc(p.desc)}</li>`).join('')}</ol><h3>첫 상담 60분</h3><p>지금 숫자와 고민을 듣고, 가장 먼저 풀 문제 하나와 4주 동안 할 일을 종이 한 장으로 드립니다. 이 한 장을 '다음 한 수 1장'이라고 부릅니다. 계속 같이 할지는 그다음에 정하셔도 됩니다.</p><p>비용은 할 일을 정한 뒤 말씀드립니다.</p>${faqHtml}<h2>문의</h2><p>정리된 계획서가 없어도 괜찮습니다. 현재 상황과 고민부터 들려주세요. 보통 2~3일 안에 답장드립니다.</p><p><a href="mailto:${profile.email}">${profile.email}</a></p></main>`,
});

// 4) 글 목록
render({
  path: '/articles',
  title: `스타트업 경영 칼럼 ${posts.length + brunchPosts.length}편 | ${BRAND}`,
  description: '사업모델·가격 전략, 투자유치·정부지원사업, 1인 기업 AI 활용, MVP·PMF 실전 전술, 창업자 멘탈·조직. 네이버 블로그 칼럼과 브런치 연재를 한곳에.',
  head: `    ${graph({ '@type': 'CollectionPage', '@id': `${SITE}/articles`, name: '스타트업 경영 칼럼', url: `${SITE}/articles`, inLanguage: 'ko', isPartOf: { '@id': WEBSITE_ID }, author: personRef, mainEntity: { '@type': 'ItemList', numberOfItems: posts.length, itemListElement: posts.slice(0, 30).map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/articles/${p.id}`, name: p.title })) } }, crumbs([{ name: '칼럼', path: '/articles' }]))}\n`,
  body: `<main class="wrap page"><h1>스타트업 경영 칼럼</h1><p>스타트업 경영 코치 ${AUTHOR}(수트와후드 SOOD)이 쓰는 글 ${posts.length + brunchPosts.length}편입니다. 네이버 블로그 칼럼 ${posts.length}편과 브런치 글 ${brunchPosts.length}편.</p><ul>${posts.map(postLink).join('')}</ul><h2>브런치</h2><p>연재와 이야기 ${brunchPosts.length}편 — 원문은 브런치에서 읽습니다.</p><ul>${brunchPosts.map(brunchLink).join('')}</ul></main>`,
});

const CATEGORY_NAMES = { '사업모델·가격-전략': '사업모델·가격 전략', '투자유치·정부지원사업': '투자유치·정부지원사업', '1인-기업-AI-활용': '1인 기업 AI 활용', 'MVP·PMF-실전-전술': 'MVP·PMF 실전 전술', '창업자-멘탈·조직': '창업자 멘탈·조직', 'Startup_Business': '기타' };
const catName = (c) => CATEGORY_NAMES[c] || c;

// 5) 글 상세
let n = 0;
const summaries = {};
for (const p of posts) {
  const file = join(POSTS, `${p.id}.json`);
  if (!existsSync(file)) continue;
  const full = JSON.parse(readFileSync(file, 'utf8'));
  const url = `${SITE}/articles/${p.id}`;
  // 설명: 도입부 첫 문장만으로는 검색 결과 요약이 짧아서 본문 앞부분(첫 인사 제외)을 150자 안팎으로 쓴다
  const lead = plain(full.html.replace(/<figure[\s\S]*?<\/figure>/g, ' ')).replace(/^스타트업 경영 코치 수드입니다\.?\s*/, '');
  const description = clip(lead.length > 40 ? lead : (p.excerpt || p.title));
  summaries[p.id] = description;
  const ld = {
    '@type': 'BlogPosting', '@id': `${url}#article`, headline: p.title, description, url,
    mainEntityOfPage: url, datePublished: p.date, dateModified: p.date, inLanguage: 'ko', articleSection: catName(p.category),
    image: p.thumb ? [p.thumb] : [DEFAULT_IMAGE], author: personRef, publisher: orgRef, isPartOf: { '@id': WEBSITE_ID }, isBasedOn: p.url,
  };
  render({
    path: `/articles/${p.id}`,
    title: `${p.title} | ${BRAND}`,
    description,
    type: 'article',
    image: p.thumb || DEFAULT_IMAGE,
    head: `    <meta property="article:published_time" content="${p.date}" />\n    <meta property="article:author" content="${AUTHOR}" />\n    <meta property="article:section" content="${esc(catName(p.category))}" />\n    ${graph(ld, crumbs([{ name: '칼럼', path: '/articles' }, { name: p.title, path: `/articles/${p.id}` }]))}\n`,
    body: `<article class="wrap page reading"><header class="article-head"><p class="eyebrow">${esc(catName(p.category))}</p><h1>${esc(p.title)}</h1><p class="muted">${fmt(p.date)} · <a href="/about">${AUTHOR}</a> (스타트업 경영 코치, ${BRAND})</p></header><div class="article-body">${full.html}</div><p><a href="${esc(p.url)}" rel="noreferrer">네이버 블로그 원문 보기</a> · <a href="/articles">글 목록</a> · <a href="/consulting">1:1 경영 상담</a></p></article>`,
  });
  n++;
}

// 6) 404 (Firebase 가 없는 주소에 404 상태로 보여 줌. React 가 NotFound 화면을 그린다)
render({
  path: '/404', file: '404.html', noindex: true,
  title: `페이지를 찾을 수 없습니다 | ${BRAND}`,
  description: '요청한 페이지를 찾을 수 없습니다.',
  body: '<main class="wrap page not-found"><p class="eyebrow">404</p><h1>페이지를 찾을 수 없습니다.</h1><p class="lead">주소를 확인하거나 첫 화면에서 다시 시작해 주세요.</p><a class="button primary" href="/">홈으로</a></main>',
});

// 7) RSS (네이버 서치어드바이저 RSS 제출용)
const rssItems = posts.slice(0, 50).map((p) => `    <item>\n      <title>${esc(p.title)}</title>\n      <link>${SITE}/articles/${p.id}</link>\n      <guid isPermaLink="true">${SITE}/articles/${p.id}</guid>\n      <description>${esc(summaries[p.id] || p.excerpt || '')}</description>\n      <category>${esc(catName(p.category))}</category>\n      <pubDate>${new Date(`${p.date}T09:00:00+09:00`).toUTCString()}</pubDate>\n    </item>`).join('\n');
writeFileSync(join(DIST, 'rss.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${BRAND} 스타트업 경영 칼럼</title>\n    <link>${SITE}</link>\n    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />\n    <description>스타트업 경영 코치 ${AUTHOR}의 칼럼</description>\n    <language>ko</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${rssItems}\n  </channel>\n</rss>\n`);

// 8) llms.txt — ChatGPT·Claude·Perplexity 같은 AI 검색이 사이트를 한 번에 파악하도록 쓰는 요약 (https://llmstxt.org 형식)
const byCategory = {};
for (const p of posts) (byCategory[p.category] ||= []).push(p);
const llms = [
  `# ${BRAND} — 스타트업 경영 코치 ${AUTHOR}`,
  '',
  `> 스타트업 경영 코치 ${AUTHOR}(수트와후드 SOOD). 현대석유화학 기획실에서 M&A와 가치평가를 맡았고, 2001년 창업한 인터랙티비를 19년 운영한 뒤 매각했습니다. 초기 창업자의 사업모델, 지표와 PMF, 정부지원과 투자, AI 1인 기업 운영을 1:1로 자문합니다. 경영 칼럼 ${posts.length + brunchPosts.length}편.`,
  '',
  '## 기본 정보',
  `- 이름: ${AUTHOR} (수드, Sung Woon Moon)`,
  '- 역할: 스타트업 경영 코치, 수트와후드(SOOD)',
  '- 학력: 연세대학교 화학공학 졸업',
  `- 자문 실적: 초기 스타트업 20개 팀 1:1 자문 (고객사 이름과 상세 수치는 비공개)`,
  `- 칼럼: 네이버 블로그 「수트와후드」 매일 연재, 이 사이트에 ${posts.length}편 수록. 브런치북 「온라인 쇼핑몰의 데이터 경영 전략」 「런웨이 12주, 1000억의 증명」, 모비인사이드 「수트와 후드의 스타트업 경영」`,
  `- 문의: ${profile.email} · ${SITE}/consulting (보통 2~3일 안에 답장)`,
  `- 채널: [네이버 블로그](${profile.blog}) · [브런치](${profile.brunch}) · [링크드인](${profile.linkedin}) · [모비인사이드](${MOBIINSIDE})`,
  '',
  '## 자문 분야',
  ...services.map((s) => `- ${s.title}: ${s.tagline} ${s.description} (산출물: ${s.outputs.join(', ')})`),
  '',
  '## 경력',
  ...experience.map((e) => `- ${e.period} ${e.org} ${e.role}: ${e.desc}`),
  '',
  '## 자주 묻는 질문',
  ...faq.map((f) => `- ${f.q} ${f.a}`),
  '',
  '## 주요 페이지',
  `- [홈](${SITE}/): 브랜드 소개, 자문 분야, 최근 칼럼`,
  `- [소개](${SITE}/about): ${AUTHOR}의 경력과 자문 사례`,
  `- [상담 안내](${SITE}/consulting): 자문 분야, 진행 방식, 첫 상담, 자주 묻는 질문, 문의 폼`,
  `- [칼럼 전체 목록](${SITE}/articles): ${posts.length}편`,
  `- [RSS](${SITE}/rss.xml)`,
  '',
  ...Object.entries(byCategory).flatMap(([cat, list]) => [
    `## 칼럼: ${CATEGORY_NAMES[cat] || cat} (${list.length}편 중 최근 8편)`,
    ...list.slice(0, 8).map((p) => `- [${p.title}](${SITE}/articles/${p.id}) (${p.date}): ${summaries[p.id] || p.excerpt || ''}`),
    '',
  ]),
  '## 참고',
  `- 칼럼은 네이버 블로그(${profile.blog})에 먼저 발행되고 같은 내용이 이 사이트로 옮겨집니다. 각 글 페이지에 원문 링크가 있습니다.`,
  '',
].join('\n');
writeFileSync(join(DIST, 'llms.txt'), llms);

console.log(`prerendered: 4 pages + ${n} articles + 404.html, rss.xml (${Math.min(50, posts.length)} items), llms.txt (${llms.length} chars)`);
