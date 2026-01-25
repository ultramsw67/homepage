import Link from 'next/link';

export default function Header() {
    return (
        <header className="border-b border-sood-burgundy/10 bg-sood-cream sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-serif text-2xl font-bold text-sood-burgundy">
                    Sood
                </Link>

                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/about" className="text-sood-charcoal hover:text-sood-burgundy transition-colors font-medium">
                        About
                    </Link>
                    <Link href="/articles" className="text-sood-charcoal hover:text-sood-burgundy transition-colors font-medium">
                        Articles
                    </Link>
                    <Link href="/consulting" className="text-sood-charcoal hover:text-sood-burgundy transition-colors font-medium">
                        Consulting
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button className="text-sm font-bold tracking-wide uppercase px-5 py-2 border border-sood-burgundy text-sood-burgundy hover:bg-sood-burgundy hover:text-white transition-all">
                        Subscribe
                    </button>
                </div>
            </div>
        </header>
    );
}
