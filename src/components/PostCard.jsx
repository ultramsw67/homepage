import { Link } from 'react-router-dom';
import { label, formatDate } from '../lib/posts';

// 네이버 블로그 글은 홈페이지 안에서(/articles/:id), 브런치 글은 브런치 원문으로 연다.
export default function PostCard({ post }) {
  const brunch = post.channel === 'brunch';
  const inner = (
    <>
      {post.thumb ? (
        <div className="post-thumb"><img src={post.thumb} alt="" loading="lazy" referrerPolicy="no-referrer" /></div>
      ) : (
        <div className="post-thumb post-thumb-empty" aria-hidden="true"><span>{brunch ? post.category : label(post.category)}</span></div>
      )}
      <div className="post-body">
        <p className="meta">
          {brunch && <span className="chip chip-brunch">브런치</span>}
          <span className="chip">{brunch ? post.category : label(post.category)}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <h3>{post.title}</h3>
        {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
        {brunch && <p className="card-out">브런치에서 읽기 <span aria-hidden="true">↗</span></p>}
      </div>
    </>
  );

  if (brunch) {
    return (
      <a className="post-card" href={post.href} target="_blank" rel="noreferrer">
        {inner}
        <span className="sr-only">브런치에서 열립니다</span>
      </a>
    );
  }
  return <Link to={'/articles/' + post.id} className="post-card">{inner}</Link>;
}
