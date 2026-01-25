import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section className="py-12 md:py-20 bg-sood-cream border-b border-sood-burgundy/10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2 space-y-6">
                        <span className="text-sood-burgundy text-xs font-bold tracking-widest uppercase mb-2 block">
                            Featured Article
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-sood-charcoal leading-tight">
                            스타트업 성장의 핵심,<br />
                            <span className="italic text-sood-burgundy">본질에 집중하라</span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed font-sans max-w-lg">
                            초기 스타트업이 가장 흔히 범하는 실수와 이를 극복하기 위한
                            실질적인 전략을 Suit와 Hood 두 가지 관점에서 분석합니다.
                        </p>
                        <div className="pt-4">
                            <Link
                                to="/articles/1"
                                className="group inline-flex items-center gap-2 text-sood-charcoal font-bold border-b-2 border-sood-burgundy pb-1 hover:text-sood-burgundy transition-colors"
                            >
                                Read the Story
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>

                    <div className="md:w-1/2 w-full">
                        <div className="aspect-[4/3] w-full relative overflow-hidden group bg-gradient-to-br from-sood-burgundy/5 to-sood-burgundy/10 flex items-center justify-center border border-sood-burgundy/5">
                            <div className="text-sood-charcoal/20 font-serif text-3xl italic">
                                Strategic Visualization
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
