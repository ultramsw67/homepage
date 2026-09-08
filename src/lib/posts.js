export const CATEGORY_LABELS = {
  'Strategy-Pivot': 'Strategy · Pivot',
  'Funding-Growth': 'Funding · Growth',
  'Tech-AI-Literacy': 'Tech · AI Literacy',
  'TacticalPlaybook': 'Tactical Playbook',
  'Founder-Mindset': 'Founder Mindset',
  'Startup_Business': 'Startup Business',
  '에피소드': '에피소드',
};

export const CATEGORY_ORDER = ['Strategy-Pivot', 'Funding-Growth', 'TacticalPlaybook', 'Tech-AI-Literacy', 'Founder-Mindset'];

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
