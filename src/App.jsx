import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Consulting from './pages/Consulting';

const TITLES = { '/': '수트의 논리, 후드의 실행', '/about': '소개', '/articles': '글', '/consulting': '상담' };

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!pathname.startsWith('/articles/')) document.title = (TITLES[pathname] || '수트와후드') + ' | 수트와후드 SOOD';
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' });
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
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
