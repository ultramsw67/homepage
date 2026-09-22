import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Header() {
  const [open, setOpen] = useState(false);
  // 어디로든 움직이면 메뉴를 닫는다. 같은 쪽 안의 앵커 이동(#contact)이나
  // 보고 있던 쪽을 다시 누른 경우까지 닫히도록 주소 대신 이동 자체(key)를 본다.
  const { key } = useLocation();
  useEffect(() => { setOpen(false); }, [key]);
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">본문으로 건너뛰기</a>
      <div className="wrap header-inner">
        <Link to="/" className="wordmark" aria-label="수트와후드 SOOD 홈">
          <span className="mark">SOOD</span>
          <small>수트의 논리, 후드의 실행</small>
        </Link>
        <button className="menu-toggle" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
          {open ? '닫기' : '메뉴'}
        </button>
        <nav id="primary-nav" className={open ? 'nav is-open' : 'nav'} aria-label="주 메뉴">
          <NavLink to="/about">소개</NavLink>
          <NavLink to="/consulting" end>자문 영역</NavLink>
          <NavLink to="/articles">글</NavLink>
          <Link className="nav-cta" to="/consulting#contact">상담 문의</Link>
        </nav>
      </div>
    </header>
  );
}
