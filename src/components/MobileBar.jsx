import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Arrow } from './Icons';

// 모바일 하단 고정 '첫 상담 60분 신청' 바. 상담 페이지(폼이 있는 곳)에서는 숨긴다.
export default function MobileBar() {
  const { pathname } = useLocation();
  const hidden = pathname === '/consulting';
  useEffect(() => {
    document.body.classList.toggle('no-mobile-bar', hidden);
    return () => document.body.classList.remove('no-mobile-bar');
  }, [hidden]);
  if (hidden) return null;
  return (
    <div className="mobile-bar">
      <Link to="/consulting#contact">첫 상담 60분 신청하기<Arrow /></Link>
    </div>
  );
}
