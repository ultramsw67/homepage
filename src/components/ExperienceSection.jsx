import SectionHeading from './SectionHeading';

const CREDENTIALS = [
    {
        title: '연세대학교 화학공학 졸업',
        body: '공학적 데이터 분석 및 논리적 비즈니스 설계 능력',
        icon: <path d="M12 3L2 8l10 5 8-4v6M6 11v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
    },
    {
        title: '현대그룹 기획실 근무',
        body: '거시적 기업 전략 수립 및 가치평가(Valuation) 실무 체득',
        icon: <path d="M5 21V4a1 1 0 011-1h8a1 1 0 011 1v17M15 21h4V9a1 1 0 00-1-1h-3M8 7h2M8 11h2M8 15h2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
    },
    {
        title: '(주)인터랙티비 창업 & 매각',
        body: '19년 경영, 투자 유치, 성공적 엑시트(Exit) 직접 완수',
        icon: <path d="M5 13l4-4M12 2c4 1 7 4 8 8-4 .5-7 2-9 4l-3-3c2-2 3.5-5 4-9zM5 13l-2 6 6-2M9 13a2 2 0 100-4 2 2 0 000 4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
    },
    {
        title: 'Brunch 상위 크리에이터',
        body: '커리어 분야 공식 인증 작품 활동 중',
        icon: <path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 19.6 7.1 22.2 8 16.7 4 12.8l5.5-.8L12 2z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
    },
];

export default function ExperienceSection() {
    return (
        <section className="bg-white py-20 md:py-28">
            <div className="container mx-auto px-4">
                <SectionHeading accent="Proven Authority">Experience &</SectionHeading>

                <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
                    {/* Credentials */}
                    <div className="lg:col-span-3">
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-ink mb-8">
                            19년의 야전 내공과 정교한 기획력
                        </h3>
                        <ul className="space-y-7">
                            {CREDENTIALS.map((c) => (
                                <li key={c.title} className="flex gap-4">
                                    <span className="shrink-0 w-11 h-11 rounded-xl bg-orange/10 text-orange flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">{c.icon}</svg>
                                    </span>
                                    <div>
                                        <p className="font-display font-bold text-ink text-lg">{c.title}</p>
                                        <p className="text-ink/55 leading-relaxed">{c.body}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* The Numbers — dark panel */}
                    <div className="lg:col-span-2">
                        <div className="bg-ink rounded-[2rem] p-10 md:p-12 text-center shadow-2xl shadow-ink/20">
                            <p className="text-orange font-display font-bold text-xl tracking-wide mb-10">The Numbers</p>

                            <div className="mb-9">
                                <p className="font-display font-extrabold text-white text-5xl md:text-6xl leading-none">7,400<span className="text-orange">+</span></p>
                                <p className="text-white/55 mt-3">NAVER AI 누적 인용</p>
                            </div>

                            <div className="h-px bg-white/10 mb-9" />

                            <div className="mb-8">
                                <p className="font-display font-extrabold text-white text-5xl md:text-6xl leading-none">상위 <span className="text-orange">0.1%</span></p>
                                <p className="text-white/55 mt-3">비즈니스 카테고리 등급</p>
                            </div>

                            <p className="text-white/40 text-sm leading-relaxed">
                                * 네이버 생성형 AI 엔진이 매달 수천 번씩<br className="hidden sm:block" />
                                '표준 정답'으로 채택하는 독보적 통찰
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
