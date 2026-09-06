import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">본문으로 건너뛰기</a>
      <div className="wrap header-inner">
        <Link to="/" className="wordmark" aria-label="수트와후드 SOOD 홈">SOOD<small>수트와후드</small></Link>
        <button className="menu-toggle" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
          {open ? '닫기' : '메뉴'}
        </button>
        <nav id="primary-nav" className={open ? 'nav is-open' : 'nav'} aria-label="주 메뉴">
          <NavLink to="/about">소개</NavLink>
          <NavLink to="/articles">글</NavLink>
          <NavLink to="/consulting">상담</NavLink>
          <Link className="nav-cta" to="/consulting#contact">상담 문의</Link>
        </nav>
      </div>
    </header>
  );
}
