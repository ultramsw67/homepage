import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <main className="pt-24 pb-20 bg-sood-cream min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <section className="max-w-4xl mx-auto mb-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-sood-charcoal mb-6 leading-tight">
                        대기업의 '로직'과 <br />
                        <span className="text-sood-burgundy italic">스타트업의 '야성'을 잇는</span><br />
                        비즈니스 전략가
                    </h1>
                    <p className="text-xl text-sood-gray max-w-2xl mx-auto leading-relaxed">
                        잘 듣고 생각하고 정리하여 대화하기 좋아하는 열정 많은 사람입니다.<br />
                        IT 서비스 분야에 관심이 많으며, 분석과 방향 설정에 강점이 있습니다.
                    </p>
                </section>

                {/* Profile Image & Key Intro */}
                <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="relative w-full">
                        <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl mb-6 bg-gradient-to-br from-[#FDFBF7] to-[#E5E5E5] flex items-center justify-center">
                            <div className="text-sood-burgundy font-serif font-bold text-4xl opacity-20">Sood</div>
                        </div>
                        <div className="flex justify-center gap-6">
                            <Link to="https://blog.naver.com/ultramsw67" target="_blank" className="text-sood-burgundy font-bold hover:underline">Naver Blog</Link>
                            <Link to="https://brunch.co.kr/@a3b90b2e717a467" target="_blank" className="text-sood-burgundy font-bold hover:underline">Brunch</Link>
                            <Link to="https://www.linkedin.com/in/%EC%84%B1%EC%9A%B4-%EB%AC%B8-415976234/" target="_blank" className="text-sood-burgundy font-bold hover:underline">LinkedIn</Link>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-sood-charcoal mb-3">
                                "대기업 출신이 왜 사서 고생을?"
                            </h3>
                            <h4 className="text-lg font-bold text-sood-burgundy mb-4">
                                안락함을 버리고 증명해낸 '생존의 기술'
                            </h4>
                            <p className="text-gray-600 leading-relaxed">
                                H그룹 계열사 기획실에서 커리어를 시작했습니다. 수천억 규모의 M&A, 가치평가, 사업 타당성 분석 등 비즈니스의 정석을 배우며 '숫자와 논리'의 힘을 깨달았습니다. 하지만 거대한 시스템 속 부품이 아닌, 스스로의 힘으로 가치를 증명하고자 안정된 '수트(Suit)'를 벗어던지고 거친 '후드티(Hood)'의 세계로 뛰어들었습니다.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-sood-charcoal mb-3">
                                맨땅에서 일궈낸 IT 스타트업 신화
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                IT 스타트업 창업은 낭만이 아닌 치열한 생존 전쟁이었습니다. 자금난과 냉담한 시장 반응 속 '죽음의 계곡'을 건너며, 저는 빠른 피보팅과 위기관리 능력을 체득했습니다. 혹독한 야생에서 틔운 새싹은 결국 단단한 나무가 되어 성공적인 엑시트(Exit)라는 결실을 맺었습니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Current Role & Consulting Philosophy */}
                <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-24 max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-sood-charcoal mb-4">
                            두 세계를 잇는 '실전형 전략가'
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            현재는 엑시트 경험을 바탕으로 스타트업 코치이자 자문가로 활동하고 있습니다. 대기업의 '구조적 사고'와 창업가의 '실전 감각'을 결합하여, 맞춤형 솔루션을 제공합니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-sood-cream p-8 rounded-xl">
                            <h3 className="font-bold text-xl text-sood-burgundy mb-4">주요 자문 성과</h3>
                            <ul className="space-y-4 text-sood-charcoal text-sm md:text-base">
                                <li className="flex gap-3">
                                    <span className="text-sood-burgundy font-bold">•</span>
                                    <span><strong>미디어 커머스 A사:</strong> UX 데이터 분석을 통한 신규 아이템 발굴 및 즉각적인 매출 상승 견인</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-sood-burgundy font-bold">•</span>
                                    <span><strong>숏폼 플랫폼 B사:</strong> 투자자 맞춤형 사업계획서 재설계로 벤처기업 인증 및 어워드 수상</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-sood-burgundy font-bold">•</span>
                                    <span><strong>커뮤니티 플랫폼 C사:</strong> 정밀한 유저 활동 분석 기반 리텐션 전략 수립</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-sood-burgundy font-bold">•</span>
                                    <span><strong>HAI 분야:</strong> AI 기술 트렌드와 비즈니스 모델을 결합하는 전략 수립 자문</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center space-y-6">
                            <blockquote className="text-xl md:text-2xl font-serif italic text-sood-charcoal border-l-4 border-sood-burgundy pl-6">
                                "복잡한 시장의 흐름을 브르고뉴 와인의 풍미처럼 섬세하게 풀어내고, 불협화음처럼 복잡한 문제 속에서 완벽한 화음을 만들어냅니다."
                            </blockquote>
                            <p className="text-gray-600 font-medium">
                                위로가 아닌, 실제 매출로 이어지는 구체적인 전략을 제시합니다. 길을 밝히는 예리한 지성의 나침반이 되겠습니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Career Timeline */}
                <section className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-serif font-bold text-sood-charcoal mb-10 text-center">Career History</h2>
                    <div className="space-y-8">
                        {/* Job 1 */}
                        <div className="border-l-2 border-sood-burgundy pl-8 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sood-burgundy"></div>
                            <div className="mb-1 text-sm text-sood-burgundy font-bold">2023.12 - 현재</div>
                            <h3 className="text-xl font-bold text-sood-charcoal">더문테크 | 경영고문 & 전문연구위원</h3>
                            <p className="text-gray-600 mt-2">스타트업 전략 자문 및 성장 로드맵 설계</p>
                        </div>

                        {/* Job 2 */}
                        <div className="border-l-2 border-sood-burgundy/30 pl-8 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sood-burgundy/30"></div>
                            <div className="mb-1 text-sm text-gray-500 font-bold">2020.05 - 2023.05</div>
                            <h3 className="text-xl font-bold text-sood-charcoal">(주)오렌지가든 | CSO (Chief Strategy Officer)</h3>
                            <p className="text-gray-600 mt-2">ARNO 등 고급 브랜드 제조 수출 및 미디어커머스 총괄, 팀 관리</p>
                        </div>

                        {/* Job 3 */}
                        <div className="border-l-2 border-sood-burgundy/30 pl-8 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sood-burgundy/30"></div>
                            <div className="mb-1 text-sm text-gray-500 font-bold">2001.01 - 2019.12</div>
                            <h3 className="text-xl font-bold text-sood-charcoal">(주)인터랙티비 | 대표이사</h3>
                            <p className="text-gray-600 mt-2">디지털 마케팅 전문 회사 운영 (아이라이크클릭 등 플랫폼), 임원 관리 및 총괄</p>
                        </div>

                        {/* Job 4 */}
                        <div className="border-l-2 border-sood-burgundy/30 pl-8 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sood-burgundy/30"></div>
                            <div className="mb-1 text-sm text-gray-500 font-bold">1993.11 - 2000.03</div>
                            <h3 className="text-xl font-bold text-sood-charcoal">(주)현대석유화학 | 기획실 대리</h3>
                            <p className="text-gray-600 mt-2">가치평가, 신규 사업 분석, 사업 타당성 분석</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
