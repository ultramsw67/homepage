import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadIndex, loadBrunch, loadSearch, toBrunchPost, label, CATEGORY_ORDER } from '../lib/posts';
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
  // 검색창은 주소(?q=)가 아니라 이 상태로 그린다.
  // 한글은 자모를 조합해 한 글자가 되는데, 주소를 거쳐 값이 돌아오면 조합이 끊겨
  // '스타트업'이 'ㅅ스슽스타…'로 풀어져 버린다 (2026-09-22 수정).
  const [text, setText] = useState(query);
  const composing = useRef(false);
  const pushed = useRef(query);
  // 본문 검색 자료. undefined=아직 안 받음, null=못 받음, 객체=받음
  const [bodies, setBodies] = useState(undefined);
  const [loadingBodies, setLoadingBodies] = useState(false);
  const asked = useRef(false);

  useEffect(() => { loadIndex().then(setPosts).catch(() => setError(true)); }, []);
  useEffect(() => { loadBrunch().then((b) => setBrunch(b && b.posts ? b.posts.map(toBrunchPost) : [])); }, []);
  useEffect(() => { setLimit(PAGE); }, [channel, filter, query]);
  // 뒤로 가기 등으로 주소가 밖에서 바뀔 때만 검색창을 맞춘다 (내가 넣은 값은 건드리지 않는다)
  useEffect(() => { if (query !== pushed.current) { pushed.current = query; setText(query); } }, [query]);
  // 주소에 ?q= 를 달고 바로 들어온 경우에도 본문 검색 자료를 받는다
  useEffect(() => { if (query) wantBodies(); }, [query]);

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
    // 제목·요약에서 찾은 글이 본문에서만 찾은 글보다 앞에 온다 (각 묶음 안에서는 최신순 그대로)
    const inHead = (p) => (p.title + ' ' + (p.excerpt || '')).toLowerCase().includes(q);
    const hit = (p) => inHead(p) || Boolean(bodies && bodies[p.id] && bodies[p.id].includes(q));
    const list = inChannel.filter((p) => (filter === '전체' || p.category === filter) && (!q || hit(p)));
    return q ? list.sort((a, b) => Number(inHead(b)) - Number(inHead(a))) : list;
  }, [inChannel, filter, query, bodies]);

  function update(next) {
    setParams((prev) => {
      const n = new URLSearchParams(prev);
      for (const [k, v] of Object.entries(next)) { if (v && v !== '전체') n.set(k, v); else n.delete(k); }
      return n;
    }, { replace: true });
  }

  // 검색창을 누르거나 검색어가 들어오면 그때 한 번만 본문 자료를 받는다
  function wantBodies() {
    if (asked.current) return;
    asked.current = true;
    setLoadingBodies(true);
    loadSearch().then((b) => { setBodies(b); setLoadingBodies(false); });
  }

  function pushQuery(v) {
    pushed.current = v;
    update({ q: v });
  }

  function onSearchChange(e) {
    const v = e.target.value;
    if (v) wantBodies();
    setText(v);
    if (!composing.current) pushQuery(v);
  }

  function onCompositionEnd(e) {
    composing.current = false;
    const v = e.currentTarget.value;
    setText(v);
    pushQuery(v);
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
          <input
            type="search"
            value={text}
            onChange={onSearchChange}
            onFocus={wantBodies}
            onCompositionStart={() => { composing.current = true; }}
            onCompositionEnd={onCompositionEnd}
            placeholder="제목·본문 검색"
          />
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
            <p className="muted small result-count" role="status">
              {filtered.length}편
              {query && loadingBodies && <span className="search-note">본문까지 찾는 중…</span>}
              {query && !loadingBodies && channel !== 'blog' && <span className="search-note">브런치 글은 제목·소개글에서만 찾습니다</span>}
            </p>
            <div className="post-grid">{filtered.slice(0, limit).map((p, i) => <PostCard key={p.id} post={p} index={i} />)}</div>
            {limit < filtered.length && (
              <div className="more"><button type="button" className="button ghost" onClick={() => setLimit(limit + PAGE)}>더 보기 ({filtered.length - limit}편 남음)</button></div>
            )}
          </>
        ) : (
          <p className="empty" role="status">{query && loadingBodies ? '본문까지 찾는 중…' : '검색 결과가 없습니다. 다른 단어나 카테고리를 선택해 주세요.'}</p>
        )
      )}
      {!posts && !error && <p className="muted">글을 불러오는 중입니다.</p>}
    </div>
  );
}
