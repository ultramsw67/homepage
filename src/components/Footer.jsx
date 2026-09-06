import { Link } from 'react-router-dom';
import { profile } from '../lib/site';
export default function Footer() {
  return <footer className="site-footer"><div className="shell">
    <div className="footer-top"><div><p className="eyebrow">LET’S THINK. THEN BUILD.</p><h2>좋은 질문에서,<br />다음 가능성으로.</h2></div><Link to="/consulting#contact" className="round-link" aria-label="프로젝트 상담하기">↗</Link></div>
    <div className="footer-bottom"><Link className="wordmark" to="/">sood<span>®</span></Link><p>수트의 논리. 후드의 실행.<br /><small>© {new Date().getFullYear()} SOOD · 문성운</small></p><div className="social-links"><a href={profile.blog} target="_blank" rel="noreferrer">Naver ↗</a><a href={profile.brunch} target="_blank" rel="noreferrer">Brunch ↗</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div></div>
  </div></footer>;
}
