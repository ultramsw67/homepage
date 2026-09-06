import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [menuPath, setMenuPath] = useState(pathname);
  const visible = open && menuPath === pathname;
  return <header className="site-header">
    <a className="skip-link" href="#main">본문으로 건너뛰기</a>
    <div className="shell header-inner">
      <Link to="/" className="wordmark" aria-label="SOOD 수트와후드 홈">sood<span>®</span><small>수트와후드</small></Link>
      <button className="menu-toggle" aria-label={visible ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={visible} aria-controls="primary-nav" onClick={() => { setMenuPath(pathname); setOpen(!visible); }}>{visible ? '닫기 −' : '메뉴 +'}</button>
      <nav id="primary-nav" className={visible ? 'navigation is-open' : 'navigation'} aria-label="주 메뉴">
        <NavLink to="/about" onClick={() => setOpen(false)}>소개 <span>About</span></NavLink>
        <NavLink to="/articles" onClick={() => setOpen(false)}>생각과 기록 <span>Journal</span></NavLink>
        <NavLink to="/consulting" onClick={() => setOpen(false)}>함께하는 일 <span>Services</span></NavLink>
        <Link className="nav-contact" to="/consulting#contact" onClick={() => setOpen(false)}>프로젝트 이야기하기 ↗</Link>
      </nav>
    </div>
  </header>;
}
