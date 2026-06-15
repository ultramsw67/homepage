import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="border-b border-ink/10 bg-cream/90 backdrop-blur sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="font-display text-2xl font-extrabold text-ink tracking-tight">
                    SOOD<span className="text-orange">.</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-8">
                    <Link to="/about" className="text-ink/80 hover:text-orange transition-colors font-medium">
                        About
                    </Link>
                    <Link to="/articles" className="text-ink/80 hover:text-orange transition-colors font-medium">
                        Insights
                    </Link>
                    <Link to="/consulting" className="text-ink/80 hover:text-orange transition-colors font-medium">
                        Consulting
                    </Link>
                </nav>

                <a
                    href="mailto:contact@themoontech.com"
                    className="text-sm font-bold tracking-wide px-5 py-2.5 rounded-full bg-orange text-white hover:bg-orange-soft transition-colors"
                >
                    상담 신청
                </a>
            </div>
        </header>
    );
}
