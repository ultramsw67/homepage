import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-ink text-white/70 py-14 relative">
            <div className="absolute top-0 left-0 right-0 h-1 flex">
                <span className="flex-[3] bg-ink-soft" />
                <span className="flex-1 bg-orange" />
            </div>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    <div>
                        <Link to="/" className="font-display text-2xl font-extrabold text-white mb-4 block tracking-tight">
                            SOOD<span className="text-orange">.</span>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Suit Logic × Hoodie Action.<br />
                            현대그룹 기획실의 정교함과 19년 창업 야전 내공의 결합.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-display font-bold text-white mb-4">Connect</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="https://www.linkedin.com/in/%EC%84%B1%EC%9A%B4-%EB%AC%B8-415976234/" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors">LinkedIn</a></li>
                            <li><a href="https://blog.naver.com/ultramsw67" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors">Naver Blog</a></li>
                            <li><a href="https://brunch.co.kr/@a3b90b2e717a467" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors">Brunch</a></li>
                            <li><a href="mailto:contact@themoontech.com" className="hover:text-orange transition-colors">Email</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display font-bold text-white mb-4">성장을 위한 가장 현실적인 전략</h4>
                        <p className="text-white/50 text-sm mb-5 leading-relaxed">
                            사업계획, IR, PMF 검증부터 스케일업까지.<br />
                            의사결정의 러닝메이트가 되어 드립니다.
                        </p>
                        <a
                            href="mailto:contact@themoontech.com"
                            className="inline-block bg-orange text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-orange-soft transition-colors"
                        >
                            상담 신청하기
                        </a>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-xs text-white/40">
                    &copy; {new Date().getFullYear()} SOOD. Startup Strategy Partner. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
