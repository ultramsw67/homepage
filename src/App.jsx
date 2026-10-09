import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBar from './components/MobileBar';
import Home from './pages/Home';
import About from './pages/About';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Consulting from './pages/Consulting';
import Series from './pages/Series';
import Check from './pages/Check';
import Free from './pages/Free';
import { trackPageview } from './lib/analytics';

// 사전 렌더링(scripts/prerender.mjs)의 제목과 같은 문구. 검색엔진은 JS 실행 뒤 제목을 쓰므로 어긋나면 안 된다.
const TITLES = { '/': '수트와후드 SOOD | 스타트업 경영 코치 문성운', '/about': '문성운 소개 | 스타트업 경영 코치 · 수트와후드 SOOD', '/articles': '스타트업 경영 칼럼 | 수트와후드 SOOD', '/consulting': '1:1 스타트업 경영 상담·자문 | 수트와후드 SOOD', '/series': '사례 연재 6개 — 비즈니스 모델·MVP·피벗·1인 기업 | 수트와후드 SOOD', '/check': '3분 창업 준비도 진단 — 질문 10개로 보는 내 창업 준비 | 수트와후드 SOOD', '/free': '스타트업 경영 체크표 무료 — 고객 대화 노트·주문 1건 계산서 | 수트와후드 SOOD' };

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const firstLoad = useRef(true);
  useEffect(() => { trackPageview(); }, [pathname]);
  useEffect(() => {
    // 첫 화면은 사전 렌더링된 제목을 그대로 두고, 사이트 안에서 이동할 때만 바꾼다.
    if (firstLoad.current) firstLoad.current = false;
    else if (!pathname.startsWith('/articles/')) document.title = TITLES[pathname] || '수트와후드 SOOD';
    const frame = requestAnimationFrame(() => {
      if (hash && !hash.startsWith('#k=')) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  return (
    <div className="wrap page not-found">
      <p className="eyebrow">404</p>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p className="lead">주소를 확인하거나 첫 화면에서 다시 시작해 주세요.</p>
      <Link className="button primary" to="/">홈으로</Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteEffects />
      <Header />
      <main id="main" tabIndex="-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/series" element={<Series />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/check" element={<Check />} />
          <Route path="/free" element={<Free />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileBar />
    </BrowserRouter>
  );
}
