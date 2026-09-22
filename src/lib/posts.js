export const CATEGORY_LABELS = {
  '사업모델·가격-전략': '사업모델·가격 전략',
  '투자유치·정부지원사업': '투자유치·정부지원사업',
  '1인-기업-AI-활용': '1인 기업 AI 활용',
  'MVP·PMF-실전-전술': 'MVP·PMF 실전 전술',
  '창업자-멘탈·조직': '창업자 멘탈·조직',
  'Startup_Business': 'Startup Business',
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

const postCache = new Map();
export function loadPost(id) {
  if (!/^\d+$/.test(id)) return Promise.resolve(null);
  if (!postCache.has(id)) {
    postCache.set(id, fetch(`/posts/${id}.json`, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => { postCache.delete(id); return null; }));
  }
  return postCache.get(id);
}
