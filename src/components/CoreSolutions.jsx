import SectionHeading from './SectionHeading';

const SOLUTIONS = [
    {
        title: '사업계획 & IR 덱 고도화',
        body: (
            <>아이디어를 투자자가 납득할 수 있는 <strong className="text-ink font-bold">'숫자와 데이터'</strong>로 시각화하여 투자 유치 확률을 극대화합니다.</>
        ),
        icon: (
            <path d="M6 2h9l5 5v15H6V2zm8 1.5V8h4.5L14 3.5zM8.5 12h7M8.5 15h7M8.5 18h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        ),
    },
    {
        title: 'MVP & PMF 전략 수립',
        body: (
            <>시행착오 비용을 줄이고 실제 고객의 지불 의사가 담긴 <strong className="text-ink font-bold">'진짜 시장'</strong>을 검증하여 진입 전략을 설계합니다.</>
        ),
        icon: (
            <path d="M10 2h4M11 2v6.5L6.5 18a2 2 0 001.8 3h7.4a2 2 0 001.8-3L13 8.5V2M8.5 14h7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        ),
    },
    {
        title: '경영 컨설팅 & 상시 멘토링',
        body: (
            <>19년 창업/엑시트 사령관의 시각으로 자금 조달, 조직 관리, 피벗 타이밍 등 <strong className="text-ink font-bold">의사결정의 러닝메이트</strong>가 됩니다.</>
        ),
        icon: (
            <path d="M4 13l6 6 4-4M14 9l6-6M14 3h6v6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        ),
    },
    {
        title: '지표 기반 스케일업 자문',
        body: (
            <>LTV/CAC 유닛 이코노믹스 최적화를 통해 밑 빠진 독에 물 붓기 식이 아닌 <strong className="text-ink font-bold">이익 기반의 성장 구조</strong>를 구축합니다.</>
        ),
        icon: (
            <path d="M4 20V4M4 20h16M8 16l3.5-4 3 2.5L20 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        ),
    },
];

export default function CoreSolutions() {
    return (
        <section className="relative bg-cream py-20 md:py-28">
            <div className="absolute inset-y-0 right-0 w-1/3 bg-cream-deep/50 hidden md:block" />
            <div className="container mx-auto px-4 relative">
                <SectionHeading accent="Solutions" after="for Survival">Core</SectionHeading>

                <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
                    {SOLUTIONS.map((s) => (
                        <div
                            key={s.title}
                            className="group bg-white rounded-3xl p-8 md:p-10 border border-ink/[0.06] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-full bg-orange/10 text-orange flex items-center justify-center mb-7 group-hover:bg-orange group-hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden="true">{s.icon}</svg>
                            </div>
                            <h3 className="font-display text-xl md:text-2xl font-bold text-ink mb-4">{s.title}</h3>
                            <p className="text-ink/60 leading-relaxed">{s.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
