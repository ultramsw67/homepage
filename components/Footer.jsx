import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-sood-charcoal text-sood-cream py-12 border-t border-sood-burgundy">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <Link href="/" className="font-serif text-2xl font-bold text-white mb-4 block">
                            Sood
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            수드(Sood) - 스타트업 컨설팅 및 인사이트.<br />
                            Suits and Hoods.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-serif text-lg text-white mb-4">Connect</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="https://www.linkedin.com/in/%EC%84%B1%EC%9A%B4-%EB%AC%B8-415976234/" target="_blank" rel="noopener noreferrer" className="hover:text-sood-cream transition-colors">LinkedIn</a></li>
                            <li><a href="https://blog.naver.com/ultramsw67" target="_blank" rel="noopener noreferrer" className="hover:text-sood-cream transition-colors">Naver Blog</a></li>
                            <li><a href="https://brunch.co.kr/@a3b90b2e717a467" target="_blank" rel="noopener noreferrer" className="hover:text-sood-cream transition-colors">Brunch</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif text-lg text-white mb-4">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            스타트업 성장을 위한 인사이트를 매주 받아보세요.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-gray-800 text-white px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-sood-burgundy"
                            />
                            <button className="bg-sood-burgundy text-white px-4 py-2 text-sm uppercase tracking-wide font-bold hover:bg-red-900 transition-colors">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} Sood. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
