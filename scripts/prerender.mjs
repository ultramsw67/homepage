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
const DEFAULT_IMAGE = `${SITE}/sood-character.jpg`;   // 사람·브랜드 정보(JSON-LD)용 정사각 캐릭터
// 공유 카드(og:image) 1200×630 — scripts/og-card.mjs 로 만든다. 카톡·링크드인 미리보기가 위아래로 잘리지 않게 (2026-10-05)
const OG_IMAGE = `${SITE}/og-card.png`;
// 3분 진단 전용 공유 그림 1200×630 (2026-10-09, 원본 scripts/og-check.html — 크롬 헤드리스로 찍음)
const CHECK_OG = `${SITE}/og-check.png`;
// 상담 전용 공유 그림 1200×630 (2026-10-09, 원본 scripts/og-consulting.html — 황동 바탕·첫 상담 60분·한 장 체크표)
const CONSULT_OG = `${SITE}/og-consulting.png`;
const OG_ALT = '수트와후드 SOOD — 스타트업 경영 코치 문성운, soodcoach.com';
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
// 사례 연재 6개 (public/series.json) — /series 정적 본문
const SERIES_FILE = resolve('public/series.json');
const seriesData = existsSync(SERIES_FILE) ? JSON.parse(readFileSync(SERIES_FILE, 'utf8')) : { total: 0, series: [] };

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
const ABOUT_DESC = `${AUTHOR}(수드). 현대그룹 기획실에서 익힌 가치평가 방식과 IT 스타트업 창업·매각 경험으로, 창업자가 매주 볼 숫자를 같이 정합니다.`;
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
  description: '스타트업 경영 코치 문성운의 1:1 경영 자문 브랜드. 창업 3년 이내 대표와 1인 창업자의 사업모델·지표·투자·정부지원·AI 활용을 코칭합니다.',
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

// 크기를 아는 공유 카드일 때만 width·height 를 붙인다 (글 썸네일은 네이버 그림이라 크기를 모름)
const ogSize = (image) => (image === OG_IMAGE || image === CHECK_OG || image === CONSULT_OG
  ? `
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(image === CHECK_OG ? "3분 창업 준비도 진단 — 질문 10개로 보는 내 창업 준비, 수트와후드 SOOD" : image === CONSULT_OG ? "첫 상담 60분 — 할 일을 종이 한 장으로, 수트와후드 SOOD 1:1 스타트업 경영 자문" : OG_ALT)}" />`
  : '');

function render({ path, title, description, type = 'website', image = OG_IMAGE, head = '', body = '', file, noindex = false, canonicalUrl, ogUrl }) {
  const url = `${SITE}${path}`;
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${type}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${esc(ogUrl || url)}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(image)}" />${ogSize(image)}`);
  if (noindex) html = html.replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, follow" />');
  const canonical = noindex ? '' : `    <link rel="canonical" href="${esc(canonicalUrl || url)}" />\n`;
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
// 칼럼 수 = 블로그 + 브런치 (vite.config.js 의 __COLUMN_TOTAL__ 과 같은 계산, 10/9)
const COLUMN_TOTAL = posts.length + brunchPosts.length;
const statValue = (s) => (s.dynamic === 'posts' ? s.value.replace('{n}', COLUMN_TOTAL) : s.value);

// 1) 홈
render({
  path: '/',
  title: `${BRAND} | 스타트업 경영 코치 ${AUTHOR}`,
  description: `스타트업 경영 코치 문성운(수트와후드 SOOD). 현대석유화학 기획실에서 M&A와 가치평가를 맡았고, 2001년 창업한 인터랙티비를 19년 운영한 뒤 매각했습니다. 초기 창업자의 사업모델, 지표와 PMF, 정부지원과 투자, AI 1인 기업 운영을 1:1로 자문합니다. 경영 칼럼 ${COLUMN_TOTAL}편.`,
  head: `    ${graph({ '@type': 'WebSite', '@id': WEBSITE_ID, name: BRAND, alternateName: '수트와후드', url: SITE, inLanguage: 'ko', publisher: { '@id': ORG_ID } }, organization, person)}\n`,
  body: `<main class="wrap page"><h1>${BRAND} | 스타트업 경영 코치 ${AUTHOR}</h1><p>현대 기획실에서 숫자를 배웠고, 제 회사를 19년 운영했습니다. 지금은 초기 창업자와 마주 앉아 사업모델, 숫자, 자금 문제를 같이 봅니다. 수트와후드(SOOD)는 넥타이와 후드티를 둘 다 입어 본 사람의 자문이라는 뜻입니다.</p>${channelLinks}<ul>${stats.map((s) => `<li><strong>${esc(statValue(s))}</strong> — ${esc(s.label)}</li>`).join('')}</ul><h2>이런 문제를 같이 봅니다</h2>${servicesHtml()}<h2>왜 수트와후드인가</h2><p>1993년 현대석유화학 기획실에서 첫 경력을 시작해 M&amp;A와 가치평가(Valuation)를 맡았습니다. 수천억 원 규모의 거래를 숫자로 따지는 자리였습니다. 2001년에는 넥타이를 풀고 IT 스타트업 인터랙티비를 창업했습니다. 투자를 유치해 회사를 키웠고 매각까지 이뤄냈습니다.</p><p>그 뒤로 여러 스타트업을 곁에서 자문해 왔습니다. 지금은 수트의 논리와 후드의 실행, 두 경험을 합쳐 창업자를 코칭합니다.</p><h2>최근 글</h2><ul>${posts.slice(0, 6).map(postLink).join('')}</ul><h2>코치 소개</h2><p>기획실에서는 사업성을 따지는 쪽에, 창업하고 나서는 그 숫자를 맞춰야 하는 쪽에 있었습니다. <a href="/about">경력 전체 보기</a></p><p><a href="/check">3분 창업 준비도 진단</a> · <a href="/free">경영 체크표 받기</a> · <a href="/articles">글 전체 보기</a> · <a href="/about">소개</a> · <a href="/consulting">상담</a> · <a href="/consulting#faq">자주 묻는 질문</a></p></main>`,
});

// 2) 소개
render({
  path: '/about',
  title: `${AUTHOR} 소개 | 스타트업 경영 코치 · ${BRAND}`,
  description: ABOUT_DESC,
  type: 'profile',
  head: `    ${graph({ '@type': 'ProfilePage', '@id': `${SITE}/about`, url: `${SITE}/about`, name: `${AUTHOR} 소개`, inLanguage: 'ko', isPartOf: { '@id': WEBSITE_ID }, mainEntity: person }, organization, crumbs([{ name: '소개', path: '/about' }]))}\n`,
  body: `<main class="wrap page"><h1>${AUTHOR} 소개</h1><p>수트와후드 ${AUTHOR}입니다. 마케팅 솔루션과 광고 플랫폼 사업을 창업해 투자 유치와 성장을 거쳐 매각까지 이끌었습니다. 벤처 생태계에서 대표가 언제, 무엇을 결정해야 하는지 현장에서 배웠습니다. 이제 그 결정의 순간 곁에 서는 스타트업 경영 코치입니다.</p><p>${AUTHOR}(수드)는 현대그룹 기획실에서 익힌 가치평가(Valuation) 방식과 IT 스타트업을 창업해 매각(Exit)까지 한 경험으로, 창업자가 매주 볼 숫자를 같이 정하는 스타트업 경영 코치입니다.</p><p>2023년부터 30만 유저 서비스의 전략 고문으로 리텐션 관리와 AI 에이전트 도입 모델을 맡았고, 지금까지 20개 팀의 사업모델·지표·투자·정부지원을 1:1로 자문했습니다. 비즈니스 모델 설계, 지표 튜닝, 신사업 타당성 시뮬레이션, 투자유치·정부지원사업, AI 에이전트 활용을 1:1로 코칭합니다.</p><p>매일 아침 네이버 블로그 「수트와후드」에 스타트업 경영 칼럼을 쓰고, 브런치북 「온라인 쇼핑몰의 데이터 경영 전략」 「런웨이 12주, 1000억의 증명」을 펴냈으며, 모비인사이드에 「수트와 후드의 스타트업 경영」을 연재합니다.</p>${channelLinks}<h2>경력</h2>${experienceHtml}<p>연세대학교 화학공학 졸업</p><h2>자문 사례</h2><ul>${cases.map((c) => `<li><strong>${esc(c.field)}</strong> — ${esc(c.result)}</li>`).join('')}</ul><p>고객사 이름과 상세 수치는 공개하지 않습니다.</p><p><a href="/consulting">상담 안내</a> · <a href="/articles">칼럼 보기</a></p></main>`,
});

// 3) 상담
const offerCatalog = {
  '@type': 'Service', '@id': `${SITE}/consulting#service`, name: '1:1 스타트업 경영 자문', serviceType: '스타트업 경영 코칭', url: `${SITE}/consulting`,
  provider: { '@id': ORG_ID }, areaServed: { '@type': 'Country', name: '대한민국' }, audience: { '@type': 'Audience', audienceType: '창업 3년 이내 대표, 1인 창업자' },
  hasOfferCatalog: { '@type': 'OfferCatalog', name: '자문 분야', itemListElement: [{ '@type': 'Offer', name: '첫 상담 60분', price: '0', priceCurrency: 'KRW', description: '현재 숫자와 고민을 듣고 먼저 풀 문제 하나와 4주 할 일을 한 장으로 정리 (무료)' }, ...services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.description } }))] },
};
render({
  path: '/consulting',
  image: CONSULT_OG,
  ogUrl: `${SITE}/consulting?card=b`, // 네이버 링크 카드가 새 그림을 읽게 (canonical 은 /consulting 그대로)
  title: `1:1 스타트업 경영 상담·자문 | ${BRAND}`,
  description: '창업 3년 이내 대표와 1인 창업자를 위한 1:1 경영 코칭. 정부지원사업·첫 투자 심사 준비, 사업모델, 지표·PMF, AI 활용을 함께 봅니다. 첫 상담 60분 무료.',
  head: `    ${graph(offerCatalog, { '@type': 'FAQPage', '@id': `${SITE}/consulting#faq`, mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }, organization, crumbs([{ name: '상담', path: '/consulting' }]))}\n`,
  body: `<main class="wrap page"><h1>1:1 경영 상담</h1><p>창업 3년 이내 대표, 1인 창업자와 일합니다. 정부지원사업이나 첫 투자 심사를 앞두고 숫자로 증명해야 한다면 특히 잘 맞습니다. 자주 받는 질문은 아래에 먼저 답해 두었습니다.</p><h2>이런 문제를 같이 봅니다</h2>${servicesHtml()}<h2>상담은 이렇게 진행됩니다</h2><ol>${steps.map((p) => `<li><strong>${esc(p.title)}</strong> — ${esc(p.desc)}</li>`).join('')}</ol><h3>첫 상담 60분 · 무료</h3><p>지금 숫자와 고민을 듣고, 가장 먼저 풀 문제 하나와 4주 동안 할 일을 종이 한 장으로 드립니다. 이 한 장을 '다음 한 수 1장'이라고 부릅니다. 계속 같이 할지는 그다음에 정하셔도 됩니다.</p><p>첫 상담은 무료입니다. 이어서 자문을 하실 때만 비용을 정합니다.</p>${faqHtml}<h2>문의</h2><p>정리된 계획서가 없어도 괜찮습니다. 현재 상황과 고민부터 들려주세요. 보통 1~2일 안에 답장드립니다.</p><p><a href="mailto:${profile.email}">${profile.email}</a></p></main>`,
});

// 3-1) 3분 창업 준비도 진단 · 체크표 받기 (2026-10-09)
const CHECK_QS = ['내 고객이 누구인지 한 문장으로 말할 수 있나요?', '그 고객 5명 이상과 직접 이야기해 봤나요?', '고객이 지금 그 문제를 어떻게 해결하고 있는지 알고 있나요?', '고객이 그 문제에 이미 돈이나 시간을 쓰고 있나요?', '누가 얼마를 낼지 가격을 정해 봤나요?', '한 달에 나가는 돈과 버틸 수 있는 개월 수를 알고 있나요?', '고객이 직접 써 볼 수 있는 것(시제품·MVP·샘플)이 있나요?', '지난 4주 동안 매주 확인한 숫자가 하나라도 있나요?', '함께할 사람(공동창업자·외주·AI 도구)을 정했나요?', '넣을 정부지원사업이나 투자 경로를 1개 이상 정했나요?'];
render({
  path: '/check',
  image: CHECK_OG,
  // 네이버 링크 카드는 og:url 을 열쇠로 옛 그림을 기억한다 → 그림을 바꿀 때 ?card= 값을 바꿔 새로 읽게 한다 (canonical 은 /check 그대로, 2026-10-09)
  ogUrl: `${SITE}/check?card=b`,
  title: `3분 창업 준비도 진단 — 질문 10개로 보는 내 창업 준비 | ${BRAND}`,
  description: '고객·문제·돈·실행·자금 다섯 갈래를 질문 10개로 점검하는 3분 창업 준비도 진단. 아이디어와 연락처는 묻지 않고, 점수와 이번 주 할 일 하나, 2주 뒤 다시 재 보는 쪽지를 드립니다.',
  head: `    ${graph({ '@type': 'WebPage', '@id': `${SITE}/check`, url: `${SITE}/check`, name: '3분 창업 준비도 진단', inLanguage: 'ko', isPartOf: { '@id': WEBSITE_ID }, author: personRef }, crumbs([{ name: '3분 진단', path: '/check' }]))}
`,
  body: `<main class="wrap page"><h1>3분 창업 준비도 진단</h1><p>질문 10개, 3분이면 끝납니다. 아이디어도, 이름·연락처도 묻지 않습니다. 회사에 다니며 고민만 하는 단계여도 괜찮습니다. 고객·문제·돈·실행·자금과 팀, 다섯 갈래로 지금 준비가 어디쯤인지 보고, 다음 칸으로 가는 질문 하나와 이번 주 할 일을 드립니다.</p><h2>진단 질문 10개</h2><ol>${CHECK_QS.map((q) => `<li>${esc(q)}</li>`).join('')}</ol><p>답은 예·조금·아니오로 고릅니다. 결과는 씨앗·새싹·나무·열매 네 단계로 나옵니다. <a href="/free">체크표 받기</a> · <a href="/consulting">상담 안내</a></p></main>`,
});
render({
  path: '/free',
  title: `스타트업 경영 체크표 무료 — 고객 대화 노트·주문 1건 계산서 | ${BRAND}`,
  description: '출력해서 바로 쓰는 스타트업 경영 체크표 4종. 고객 5명 대화 노트, 주문 1건 계산서(유닛 이코노믹스), 피치덱 12항목 체크표, PoC 착수 전 합의표를 A4 한 장 PDF로 받습니다.',
  head: `    ${graph({ '@type': 'WebPage', '@id': `${SITE}/free`, url: `${SITE}/free`, name: '스타트업 경영 체크표 4종', inLanguage: 'ko', isPartOf: { '@id': WEBSITE_ID }, author: personRef }, crumbs([{ name: '체크표 받기', path: '/free' }]))}
`,
  body: `<main class="wrap page"><h1>출력해서 바로 쓰는 스타트업 경영 한 장</h1><p>블로그 글에서 쓰던 표를 한 장짜리로 정리했습니다. 이메일을 적으면 바로 내려받을 수 있습니다.</p><ul><li><strong>고객 5명 대화 노트</strong> — 무엇을 묻고 무엇을 적을지 정해 둔 한 장. 다섯 명 만나면 다음 칸이 보입니다.</li><li><strong>주문 1건 계산서</strong> — 한 건 팔면 얼마 남는지, 몇 건 팔아야 본전인지 계산합니다.</li><li><strong>피치덱 12항목 체크표</strong> — 투자자가 보는 순서대로 내 덱에 빠진 항목을 찾습니다.</li><li><strong>PoC 착수 전 합의표</strong> — 기업 고객과 시범 사업 전에 서면으로 정할 6가지입니다.</li></ul><p><a href="/check">3분 준비도 진단</a> · <a href="/consulting">상담 안내</a></p></main>`,
});

// 4) 글 목록
render({
  path: '/articles',
  title: `스타트업 경영 칼럼 ${COLUMN_TOTAL}편 | ${BRAND}`,
  description: '사업모델·가격 전략, 투자유치·정부지원사업, 1인 기업 AI 활용, MVP·PMF 실전 전술, 창업자 멘탈·조직. 네이버 블로그 칼럼과 브런치 연재를 한곳에.',
  head: `    ${graph({ '@type': 'CollectionPage', '@id': `${SITE}/articles`, name: '스타트업 경영 칼럼', url: `${SITE}/articles`, inLanguage: 'ko', isPartOf: { '@id': WEBSITE_ID }, author: personRef, mainEntity: { '@type': 'ItemList', numberOfItems: posts.length, itemListElement: posts.slice(0, 30).map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/articles/${p.id}`, name: p.title })) } }, crumbs([{ name: '칼럼', path: '/articles' }]))}\n`,
  body: `<main class="wrap page"><h1>스타트업 경영 칼럼</h1><p>스타트업 경영 코치 ${AUTHOR}(수트와후드 SOOD)이 쓰는 글 ${COLUMN_TOTAL}편입니다. 네이버 블로그 칼럼 ${posts.length}편과 브런치 글 ${brunchPosts.length}편.</p><ul>${posts.map(postLink).join('')}</ul><h2>브런치</h2><p>연재와 이야기 ${brunchPosts.length}편 — 원문은 브런치에서 읽습니다.</p><ul>${brunchPosts.map(brunchLink).join('')}</ul></main>`,
});

// 4-1) 사례 연재 (2026-10-05)
render({
  path: '/series',
  title: `사례 연재 6개 ${seriesData.total}편 — 비즈니스 모델·MVP·피벗·1인 기업 | ${BRAND}`,
  description: '한 회사를 끝까지 뜯어보는 스타트업 사례 연재 6개. 수드의 BM 해부, MVP 사례, 피벗 사례, 1인 기업 사례, AI 스타트업 해부, 창업자 이야기를 회차순으로 모았습니다.',
  head: `    ${graph({ '@type': 'CollectionPage', '@id': `${SITE}/series`, name: '수드의 사례 연재', url: `${SITE}/series`, inLanguage: 'ko', isPartOf: { '@id': WEBSITE_ID }, author: personRef, hasPart: seriesData.series.map((x) => ({ '@type': 'CreativeWorkSeries', name: x.name, description: x.desc, numberOfItems: x.items.length })) }, crumbs([{ name: '연재', path: '/series' }]))}\n`,
  body: `<main class="wrap page"><h1>회사 하나를 끝까지 뜯어보는 6개 연재</h1><p>스타트업 경영 코치 ${AUTHOR}의 블로그 사례 글 ${seriesData.total}편을 연재별로 모았습니다.</p>${seriesData.series.map((x) => `<h2>${esc(x.name)} (${x.items.length}편)</h2><p>${esc(x.desc)}</p><ol>${x.items.map((i) => `<li>${i.no}편 · ${esc(i.subject)} · ${fmt(i.date)} — <a href="${esc(i.url)}" rel="noreferrer">${esc(i.title)}</a></li>`).join('')}</ol>`).join('')}<p><a href="/articles">글 전체 보기</a> · <a href="/consulting">상담</a></p></main>`,
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
    mainEntityOfPage: p.url, datePublished: p.date, dateModified: p.date, inLanguage: 'ko', articleSection: catName(p.category),
    image: p.thumb ? [p.thumb] : [DEFAULT_IMAGE], author: personRef, publisher: orgRef, isPartOf: { '@id': WEBSITE_ID }, isBasedOn: p.url,
  };
  // 원본 표시는 네이버 블로그 원문으로 (2026-10-02). 같은 글이 두 곳에 있어 검색엔진이 블로그를 원본으로 보므로,
  // 홈페이지 사본은 검색 경쟁에서 빠지고 블로그 검색을 지킨다. og:url 은 홈페이지 주소 그대로 — 링크드인 공유 카드가 홈페이지로 오게
  // 본문이 거의 없는 글(인사·이벤트 글 등)은 검색에 내보내지 않는다 — 빈약한 페이지가 사이트 평가를 깎지 않게 (2026-10-05, check-seo.mjs 와 같은 200자 기준)
  const thin = plain(full.html).length < 200;
  render({
    noindex: thin,
    canonicalUrl: p.url,
    path: `/articles/${p.id}`,
    title: `${p.title} | ${BRAND}`,
    description,
    type: 'article',
    image: p.thumb || OG_IMAGE,
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
  `> 스타트업 경영 코치 ${AUTHOR}(수트와후드 SOOD). 현대석유화학 기획실에서 M&A와 가치평가를 맡았고, 2001년 창업한 인터랙티비를 19년 운영한 뒤 매각했습니다. 초기 창업자의 사업모델, 지표와 PMF, 정부지원과 투자, AI 1인 기업 운영을 1:1로 자문합니다. 경영 칼럼 ${COLUMN_TOTAL}편.`,
  '',
  '## 기본 정보',
  `- 이름: ${AUTHOR} (수드, Sung Woon Moon)`,
  '- 역할: 스타트업 경영 코치, 수트와후드(SOOD)',
  '- 학력: 연세대학교 화학공학 졸업',
  `- 자문 실적: 초기 스타트업 20개 팀 1:1 자문 (고객사 이름과 상세 수치는 비공개)`,
  `- 칼럼: 네이버 블로그 「수트와후드」 매일 연재, 이 사이트에 ${COLUMN_TOTAL}편 수록(블로그 ${posts.length}·브런치 ${brunchPosts.length}). 브런치북 「온라인 쇼핑몰의 데이터 경영 전략」 「런웨이 12주, 1000억의 증명」, 모비인사이드 「수트와 후드의 스타트업 경영」`,
  `- 문의: ${profile.email} · ${SITE}/consulting (보통 1~2일 안에 답장)`,
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
  `- [상담 안내](${SITE}/consulting): 자문 분야, 진행 방식, 첫 상담(60분 무료), 자주 묻는 질문, 문의 폼`,
  `- [칼럼 전체 목록](${SITE}/articles): ${COLUMN_TOTAL}편`,
  `- [3분 창업 준비도 진단](${SITE}/check): 고객·문제·돈·실행·자금 다섯 갈래를 질문 10개로 점검, 점수와 이번 주 할 일 하나, 2주 뒤 다시 재는 쪽지`,
  `- [스타트업 경영 체크표 4종](${SITE}/free): 고객 5명 대화 노트, 주문 1건 계산서, 피치덱 12항목 체크표, PoC 착수 전 합의표 (A4 PDF)`,
  `- [사례 연재](${SITE}/series): 연재 6개 ${seriesData.total}편 (${seriesData.series.map((x) => x.name).join(' · ')})`,
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

console.log(`prerendered: 7 pages + ${n} articles + 404.html, rss.xml (${Math.min(50, posts.length)} items), llms.txt (${llms.length} chars)`);
