import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Arrow } from './Icons';
import { loadKey, daysLeft, enc } from '../lib/check';

// 모바일 하단 고정 바. 상담 페이지(폼이 있는 곳)에서는 숨긴다.
// 2026-10-09: 반으로 나눠 왼쪽 「3분 진단」, 쪽지를 봉인한 기기에서는 「내 쪽지 D-n」 (열쇠는 이 기기 localStorage 에만)
export default function MobileBar() {
  const { pathname } = useLocation();
  const hidden = pathname === '/consulting';
  const [key, setKey] = useState(() => (typeof window === 'undefined' ? null : loadKey()));
  useEffect(() => {
    const on = () => setKey(loadKey());
    window.addEventListener('sood-check-key', on);
    window.addEventListener('storage', on);
    return () => { window.removeEventListener('sood-check-key', on); window.removeEventListener('storage', on); };
  }, []);
  useEffect(() => {
    document.body.classList.toggle('no-mobile-bar', hidden);
    return () => document.body.classList.remove('no-mobile-bar');
  }, [hidden]);
  if (hidden) return null;
  const left = key ? daysLeft(key) : null;
  const check = pathname === '/check' ? null
    : key ? <Link className="mb-check" to={'/check#k=' + enc(key)}>{left > 0 ? `내 쪽지 D-${left}` : '쪽지가 열렸습니다'}</Link>
      : <Link className="mb-check" to="/check">3분 진단</Link>;
  return (
    <div className={'mobile-bar' + (check ? ' split' : '')}>
      {check}
      <Link to="/consulting#contact">상담 문의하기<Arrow /></Link>
    </div>
  );
}
