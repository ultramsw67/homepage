import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadIndex, loadBrunch, toBrunchPost, label, CATEGORY_ORDER } from '../lib/posts';
import { profile } from '../lib/site';
import PostCard from '../components/PostCard';

const PAGE = 18;
const CHANNELS = [
  { key: '전체', name: '전체' },
  { key: 'blog', name: '네이버 블로그' },
  { key: 'brunch', name: '브런치' },
];

export default function Articles() {
  const [posts, setPosts] = useState(null);
  const [brunch, setBrunch] = useState([]);
  const [error, setError] = useState(false);
  const [params, setParams] = useSearchParams();
  const channel = params.get('ch') || '전체';
  const filter = params.get('c') || '전체';
  const query = params.get('q') || '';
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => { loadIndex().then(setPosts).catch(() => setError(true)); }, []);
  useEffect(() => { loadBrunch().then((b) => setBrunch(b && b.posts ? b.posts.map(toBrunchPost) : [])); }, []);
  useEffect(() => { setLimit(PAGE); }, [channel, filter, query]);

  const blogPosts = posts || [];
  const all = useMemo(
    () => [...blogPosts, ...brunch].sort((a, b) => (b.date || '').localeCompare(a.date || '')),
    [blogPosts, brunch],
  );
  const inChannel = channel === 'blog' ? blogPosts : channel === 'brunch' ? brunch : all;

  // 채널마다 그 채널의 분류만 보여 준다 (블로그는 카테고리, 브런치는 연재)
  const categories = useMemo(() => {
    const present = new Set(inChannel.map((p) => p.category));
    if (channel === 'brunch') return ['전체', ...[...present].sort((a, b) => (a === '단편' ? 1 : b === '단편' ? -1 : a.localeCompare(b)))];
    const ordered = CATEGORY_ORDER.filter((c) => present.has(c));
    const rest = [...present].filter((c) => !CATEGORY_ORDER.includes(c) && c !== '단편').sort();
    return ['전체', ...ordered, ...rest];
  }, [inChannel, channel]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inChannel.filter(
      (p) => (channel === '전체' || filter === '전체' || p.category === filter)
        && (!q || (p.title + ' ' + (p.excerpt || '')).toLowerCase().includes(q)),
    );
  }, [inChannel, channel, filter, query]);

  function update(next) {
    const n = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) { if (v && v !== '전체') n.set(k, v); else n.delete(k); }
    setParams(n, { replace: true });
  }

  const count = (key) => (key === 'blog' ? blogPosts.length : key === 'brunch' ? brunch.length : all.length);

  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="eyebrow">글</p>
        <h1>스타트업 경영,<br />매일 <em>한 편씩.</em></h1>
        <p className="lead">
          사업모델·가격 전략, 투자유치·정부지원사업, 1인 기업 AI 활용, MVP·PMF 실전 전술, 창업자 멘탈·조직까지.
          <a href={profile.blog} target="_blank" rel="noreferrer">네이버 블로그</a>의 실전 칼럼과{' '}
          <a href={profile.brunch} target="_blank" rel="noreferrer">브런치</a>의 이야기를 한곳에 모았습니다.
          브런치 글은 원문이 있는 브런치에서 열립니다.
        </p>
      </header>

      <div className="toolbar">
        <div className="channel-filters" aria-label="채널">
          {CHANNELS.map((c) => (
            <button key={c.key} type="button" aria-pressed={channel === c.key} onClick={() => update({ ch: c.key, c: '전체' })}>
              {c.name} {posts ? count(c.key) : ''}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">글 검색</span>
          <input type="search" value={query} onChange={(e) => update({ q: e.target.value })} placeholder="제목·요약 검색" />
        </label>
      </div>

      {channel !== '전체' && (
        <div className="filters sub" aria-label={channel === 'brunch' ? '연재' : '글 카테고리'}>
          {categories.map((c) => (
            <button key={c} type="button" aria-pressed={filter === c} onClick={() => update({ c })}>
              {c === '전체' ? '전체' : channel === 'brunch' ? c : label(c)}
            </button>
          ))}
        </div>
      )}

      {error && <p className="empty" role="status">글 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}
      {posts && !error && (
        filtered.length ? (
          <>
            <p className="muted small result-count" role="status">{filtered.length}편</p>
            <div className="post-grid">{filtered.slice(0, limit).map((p, i) => <PostCard key={p.id} post={p} index={i} />)}</div>
            {limit < filtered.length && (
              <div className="more"><button type="button" className="button ghost" onClick={() => setLimit(limit + PAGE)}>더 보기 ({filtered.length - limit}편 남음)</button></div>
            )}
          </>
        ) : (
          <p className="empty" role="status">검색 결과가 없습니다. 다른 단어나 카테고리를 선택해 주세요.</p>
        )
      )}
      {!posts && !error && <p className="muted">글을 불러오는 중입니다.</p>}
    </div>
  );
}
