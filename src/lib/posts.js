export const CATEGORY_LABELS = {
  '사업모델·가격-전략': '사업모델·가격 전략',
  '투자유치·정부지원사업': '투자유치·정부지원사업',
  '1인-기업-AI-활용': '1인 기업 AI 활용',
  'MVP·PMF-실전-전술': 'MVP·PMF 실전 전술',
  '창업자-멘탈·조직': '창업자 멘탈·조직',
  'Startup_Business': '기타',
  '에피소드': '에피소드',
};

export const CATEGORY_ORDER = ['사업모델·가격-전략', '투자유치·정부지원사업', '1인-기업-AI-활용', 'MVP·PMF-실전-전술', '창업자-멘탈·조직'];

export const label = (c) => CATEGORY_LABELS[c] || c;

export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${y}.${m}.${d}`;
}

let indexPromise;
export function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch('/posts/index.json', { cache: 'no-cache' }).then((r) => {
      if (!r.ok) throw new Error('index ' + r.status);
      return r.json();
    }).catch((e) => { indexPromise = undefined; throw e; });
  }
  return indexPromise;
}

// 브런치 글 (public/brunch.json) — 목록에 함께 보여 주고, 읽기는 브런치 원문에서
let brunchPromise;
export function loadBrunch() {
  if (!brunchPromise) {
    brunchPromise = fetch('/brunch.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return brunchPromise;
}

// 브런치 글을 글 카드가 아는 모양으로 바꾼다 (id 없음 · 바깥 링크)
export const toBrunchPost = (b) => ({
  id: 'br' + b.no,
  channel: 'brunch',
  href: b.url,
  title: b.title,
  date: b.date,
  excerpt: b.sub || b.excerpt,
  thumb: b.thumb,
  category: b.series || '단편',
  series: b.series || null,
  like: b.like,
});

// 본문 검색 자료 (public/search.json, 글 번호 → 소문자로 눌러 놓은 본문 글자).
// 1.6MB 라 첫 화면에서는 받지 않고, 검색창을 누르거나 검색어가 들어올 때 한 번만 받는다.
// 못 받으면 null 을 돌려 제목·요약 검색으로 조용히 되돌아간다.
let searchPromise;
export function loadSearch() {
  if (!searchPromise) {
    searchPromise = fetch('/search.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => { searchPromise = undefined; return null; });
  }
  return searchPromise;
}

const postCache = new Map();
export function loadPost(id) {
  if (!/^\d+$/.test(id)) return Promise.resolve(null);
  if (!postCache.has(id)) {
    postCache.set(id, fetch(`/posts/${id}.json`, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => { postCache.delete(id); return null; }));
  }
  return postCache.get(id);
}
