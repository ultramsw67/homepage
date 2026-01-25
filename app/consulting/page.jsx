import Image from 'next/image';
import Link from 'next/link';

export default function ConsultingPage() {
    return (
        <main className="pt-24 pb-20 bg-sood-cream min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-sood-burgundy font-bold tracking-widest uppercase text-sm mb-4 block">Services</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-sood-charcoal mb-6">
                        Consulting & Advisory
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        아이디어는 있는데 비즈니스 모델이 명확하지 않은가요?<br />
                        데이터는 쌓이는데 전략으로 연결하지 못하고 계신가요?
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-sood-burgundy/10 rounded-full flex items-center justify-center mb-6 text-2xl">
                            📊
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-sood-charcoal mb-4">Business Strategy</h3>
                        <p className="text-gray-600 mb-6">
                            시장 분석부터 가치 제안, 수익 모델 설계까지. 스타트업의 생존과 성장을 위한 견고한 비즈니스 전략을 수립합니다.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>• 비즈니스 모델 (BM) 진단 및 고도화</li>
                            <li>• 사업 타당성 분석 및 피보팅 전략</li>
                            <li>• 중장기 성장 로드맵 설계</li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-sood-burgundy/10 rounded-full flex items-center justify-center mb-6 text-2xl">
                            🚀
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-sood-charcoal mb-4">Investment & Pitching</h3>
                        <p className="text-gray-600 mb-6">
                            투자자의 언어로 당신의 비즈니스를 번역합니다. 매력적인 스토리텔링과 논리적인 데이터로 투자 유치 성공률을 높입니다.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>• IR 자료(Pitch Deck) 스토리라인 기획</li>
                            <li>• 투자자 맞춤형 전략 수립</li>
                            <li>• 기업 가치평가(Valuation) 자문</li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-sood-burgundy/10 rounded-full flex items-center justify-center mb-6 text-2xl">
                            📈
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-sood-charcoal mb-4">Growth & Operations</h3>
                        <p className="text-gray-600 mb-6">
                            지표 기반의 의사결정 체계를 구축하고, 효율적인 조직 운영과 리텐션 전략으로 지속 가능한 성장을 만듭니다.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>• KPI/OKR 설정 및 성과 관리</li>
                            <li>• 유저 데이터 분석 및 리텐션 전략</li>
                            <li>• 조직 문화 및 팀 빌딩 자문</li>
                        </ul>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-sood-burgundy rounded-3xl p-12 text-center text-white max-w-4xl mx-auto relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-serif font-bold mb-6">Ready to Scale?</h2>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto">
                            당신의 고민을 듣고, 함께 해결책을 찾겠습니다. <br />
                            지금 바로 상담을 신청하세요.
                        </p>
                        <Link href="mailto:contact@themoontech.com" className="inline-block bg-white text-sood-burgundy font-bold py-4 px-10 rounded-full hover:bg-sood-cream transition-colors">
                            Get in Touch
                        </Link>
                    </div>
                    {/* Background Decorative Circle */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                </div>
            </div>
        </main>
    );
}
