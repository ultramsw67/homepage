import { Link } from 'react-router-dom';
import { profile } from '../lib/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div>
          <Link className="wordmark" to="/">SOOD</Link>
          <p className="footer-tag">수트의 논리, 후드의 실행.</p>
          <p className="footer-copy">© {new Date().getFullYear()} 수트와후드 · {profile.name}</p>
        </div>
        <div className="footer-links">
          <a href={'mailto:' + profile.email}>{profile.email}</a>
          <a href={profile.blog} target="_blank" rel="noreferrer">네이버 블로그</a>
          <a href={profile.brunch} target="_blank" rel="noreferrer">브런치</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
