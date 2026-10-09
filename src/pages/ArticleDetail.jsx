import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { loadIndex, loadPost, label, formatDate } from '../lib/posts';
import { profile } from '../lib/site';
import { Q, CATEGORY_Q, POST_SHEET, SHEETS } from '../lib/check';
import { trackEvent } from '../lib/analytics';
import PostCard from '../components/PostCard';

export default function ArticleDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(undefined);
  const [index, setIndex] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    setPost(undefined);
    loadPost(id).then((p) => { if (alive) setPost(p); });
    loadIndex().then((i) => { if (alive) setIndex(i); }).catch(() => {});
    return () => { alive = false; };
  }, [id]);

  useEffect(() => { if (post?.title) document.title = post.title + ' | 수트와후드 SOOD'; }, [post]);

  if (post === undefined) return <div className="wrap page"><p className="muted">글을 불러오는 중입니다.</p></div>;
  if (post === null) return (
    <div className="wrap page not-found">
      <p className="eyebrow">글을 찾을 수 없습니다</p>
      <h1>주소가 바뀌었거나 삭제된 글입니다</h1>
      <Link className="button primary" to="/articles">글 목록으로</Link>
    </div>
  );

  const pos = index.findIndex((p) => p.id === post.id);
  const newer = pos > 0 ? index[pos - 1] : null;
  const older = pos >= 0 && pos < index.length - 1 ? index[pos + 1] : null;
  const related = index.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);

  return (
    <article className="wrap page reading">
      <Link className="text-link" to={'/articles?ch=blog&c=' + encodeURIComponent(post.category)}>← {label(post.category)}</Link>
      <header className="article-head">
        <h1>{post.title}</h1>
        <p className="meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span><span>{profile.brand} {profile.name}</span>
          {post.url && <><span>·</span><a href={post.url} target="_blank" rel="noreferrer">네이버 원문{post.comments ? ` · 댓글 ${post.comments}` : ''}</a></>}
        </p>
      </header>
      <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      <footer className="article-foot">
        {/* 2026-10-09: 글 주제에 맞는 진단 질문 하나를 글 안에서 바로 누르게 — 누르면 /check 에서 나머지 9개 */}
        {(() => {
          const qi = CATEGORY_Q[post.category] ?? 0;
          const sheet = POST_SHEET[post.id];
          const go = (v) => { trackEvent('article_check_answer', { q: qi + 1, category: post.category }); navigate(`/check?q=${qi}&v=${v}&from=article`); };
          return (
            <div className="article-check">
              <p className="ac-k">이 글을 읽은 분께 질문 하나 · 3분 진단 1/10</p>
              <p className="ac-q">{Q[qi][1]}</p>
              <div className="ac-b">
                <button type="button" onClick={() => go(10)}>예</button>
                <button type="button" onClick={() => go(5)}>조금</button>
                <button type="button" onClick={() => go(0)}>아니오</button>
              </div>
              <p className="ac-n">누르면 나머지 9개 질문으로 이어집니다. 3분이면 끝나고 이번 주 할 일 하나를 알려 드립니다.</p>
              {sheet && <Link className="ac-sheet" to={`/free?pick=${sheet}`} onClick={() => trackEvent('article_to_free', { pick: sheet })}>이 글의 표, 한 장으로 받기 — {SHEETS[sheet].name} →</Link>}
            </div>
          );
        })()}
        <div className="article-cta">
          <div>
            <strong>이 주제로 고민 중이라면</strong>
            <p>첫 상담 60분에 현재 상황을 듣고 다음 한 수를 한 장으로 정리해 드립니다.</p>
          </div>
          <Link className="button primary" to="/consulting#contact">첫 상담 60분 신청</Link>
        </div>
        <nav className="prev-next" aria-label="이전 · 다음 글">
          {newer ? <Link to={'/articles/' + newer.id}><span>다음 글</span>{newer.title}</Link> : <span />}
          {older ? <Link to={'/articles/' + older.id} className="older"><span>이전 글</span>{older.title}</Link> : <span />}
        </nav>
        {related.length > 0 && (
          <section className="related">
            <p className="eyebrow">같은 카테고리의 글</p>
            <div className="post-grid">{related.map((p) => <PostCard key={p.id} post={p} />)}</div>
          </section>
        )}
      </footer>
    </article>
  );
}
