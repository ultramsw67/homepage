import { Link } from 'react-router-dom';
import { label, formatDate } from '../lib/posts';

export default function PostCard({ post, index }) {
  return (
    <Link to={'/articles/' + post.id} className="post-card">
      {post.thumb ? (
        <div className="post-thumb"><img src={post.thumb} alt="" loading="lazy" referrerPolicy="no-referrer" /></div>
      ) : (
        <div className="post-thumb post-thumb-empty" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></div>
      )}
      <div className="post-body">
        <p className="meta"><span className="chip">{label(post.category)}</span><time dateTime={post.date}>{formatDate(post.date)}</time></p>
        <h3>{post.title}</h3>
        {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
      </div>
    </Link>
  );
}
