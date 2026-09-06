import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadIndex, label, CATEGORY_ORDER } from '../lib/posts';
import { profile } from '../lib/site';
import PostCard from '../components/PostCard';

const PAGE = 18;

export default function Articles() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(false);
  const [params, setParams] = useSearchParams();
  const filter = params.get('c') || '전체';
  const query = params.get('q') || '';
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => { loadIndex().then(setPosts).catch(() => setError(true)); }, []);
  useEffect(() => { setLimit(PAGE); }, [filter, query]);

  const categories = useMemo(() => {
    if (!posts) return [];
    const present = new Set(posts.map((p) => p.category));
    const ordered = CATEGORY_ORDER.filter((c) => present.has(c));
    const rest = [...present].filter((c) => !CATEGORY_ORDER.includes(c)).sort();
    return ['전체', ...ordered, ...rest];
  }, [posts]);

  const filtered = useMemo(() => {
    if (!posts) return [];
    const q = query.trim().toLowerCase();
    return posts.filter((p) => (filter === '전체' || p.category === filter) && (!q || (p.title + ' ' + p.excerpt).toLowerCase().includes(q)));
  }, [posts, filter, query]);

  function update(next) {
    const n = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) { if (v && v !== '전체') n.set(k, v); else n.delete(k); }
    setParams(n, { replace: true });
  }

  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="eyebrow">글</p>
        <h1>스타트업 경영,<br />매일 <em>한 편씩.</em></h1>
        <p className="lead">전략과 피벗, 투자와 정부지원, AI 활용, 창업자의 마음가짐까지. 네이버 블로그에 쓴 칼럼을 이곳에 모았습니다. 댓글과 원문은 <a href={profile.blog} target="_blank" rel="noreferrer">네이버 블로그</a>에서 볼 수 있습니다.</p>
      </header>

      <div className="toolbar">
        <div className="filters" aria-label="글 카테고리">
          {categories.map((c) => (
            <button key={c} type="button" aria-pressed={filter === c} onClick={() => update({ c })}>
              {c === '전체' ? `전체 ${posts ? posts.length : ''}` : label(c)}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">글 검색</span>
          <input type="search" value={query} onChange={(e) => update({ q: e.target.value })} placeholder="제목·요약 검색" />
        </label>
      </div>

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
