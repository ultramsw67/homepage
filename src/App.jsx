import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ArticlesPage from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import ConsultingPage from './pages/Consulting';

// Scroll to top on route change
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-sood-cream text-sood-charcoal">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/articles" element={<ArticlesPage />} />
                        <Route path="/articles/:id" element={<ArticleDetail />} />
                        <Route path="/consulting" element={<ConsultingPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
