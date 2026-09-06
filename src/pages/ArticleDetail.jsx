import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { loadIndex, loadPost, label, formatDate } from '../lib/posts';
import { profile } from '../lib/site';
import PostCard from '../components/PostCard';

export default function ArticleDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(undefined);
  const [index, setIndex] = useState([]);

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
      <h1>주소가 바뀌었거나 삭제된 글입니다.</h1>
      <Link className="button primary" to="/articles">글 목록으로</Link>
    </div>
  );

  const pos = index.findIndex((p) => p.id === post.id);
  const newer = pos > 0 ? index[pos - 1] : null;
  const older = pos >= 0 && pos < index.length - 1 ? index[pos + 1] : null;
  const related = index.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);

  return (
    <article className="wrap page reading">
      <Link className="text-link" to={'/articles?c=' + encodeURIComponent(post.category)}>← {label(post.category)}</Link>
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
        <p>이 주제로 고민 중이라면 <a href={'mailto:' + profile.email}>{profile.email}</a> 로 상황을 들려주세요. <Link to="/consulting">상담 안내 →</Link></p>
        <nav className="prev-next" aria-label="이전 · 다음 글">
          {newer ? <Link to={'/articles/' + newer.id}><span>다음 글</span>{newer.title}</Link> : <span />}
          {older ? <Link to={'/articles/' + older.id} className="older"><span>이전 글</span>{older.title}</Link> : <span />}
        </nav>
        {related.length > 0 && (
          <section className="related">
            <p className="eyebrow">같은 카테고리의 글</p>
            <div className="post-grid">{related.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}</div>
          </section>
        )}
      </footer>
    </article>
  );
}
