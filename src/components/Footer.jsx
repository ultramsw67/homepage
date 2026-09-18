import { Link } from 'react-router-dom';
import { profile } from '../lib/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-inner">
          <div>
            <Link className="wordmark" to="/"><span className="mark">SOOD</span></Link>
            <p className="footer-tag">수트의 논리, 후드의 실행.</p>
          </div>
          <nav className="footer-links" aria-label="푸터 메뉴">
            <a href={'mailto:' + profile.email}>{profile.email}</a>
            <a href={profile.blog} target="_blank" rel="noreferrer">네이버 블로그</a>
            <a href={profile.brunch} target="_blank" rel="noreferrer">브런치</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <Link to="/consulting#faq">자주 묻는 질문</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} 수트와후드 · {profile.name}</span>
          <span>{profile.role} · {profile.brandEn}</span>
        </div>
      </div>
    </footer>
  );
}
