import SectionHeading from './SectionHeading';

const NAVER = 'https://blog.naver.com/ultramsw67';
const BRUNCH = 'https://brunch.co.kr/@a3b90b2e717a467';

const INSIGHTS = [
    {
        channel: 'NAVER BLOG',
        channelClass: 'bg-emerald-100 text-emerald-700',
        href: NAVER,
        title: 'Agentic Search 시대의 도래',
        body: '전통적 검색과 AI 에이전트의 본질적 차이 및 스타트업이 취해야 할 기술적 비즈니스 모델 해부',
        gradient: 'from-sky-500 via-indigo-500 to-orange-400',
    },
    {
        channel: 'BRUNCH STORY',
        channelClass: 'bg-violet-100 text-violet-700',
        href: BRUNCH,
        title: '수트(Suit)를 벗고 후디(Hoodie)를 입다',
        body: '현대그룹 기획실에서 IT 스타트업 엑시트까지, 온몸으로 겪은 19년 데스밸리 생존과 성장 기록',
        gradient: 'from-slate-800 via-slate-700 to-slate-900',
    },
    {
        channel: 'NAVER BLOG',
        channelClass: 'bg-emerald-100 text-emerald-700',
        href: NAVER,
        title: '유닛 이코노믹스의 함정',
        body: '왜 트래픽만 모으다 무너지는가? 투자자를 단칼에 설득하는 LTV/CAC 엑셀 시뮬레이션 제안',
        gradient: 'from-orange-400 via-rose-400 to-amber-300',
    },
];

export default function FeaturedInsights() {
    return (
        <section className="relative bg-cream py-20 md:py-28">
            <div className="absolute inset-y-0 right-0 w-1/3 bg-cream-deep/50 hidden md:block" />
            <div className="container mx-auto px-4 relative">
                <SectionHeading accent="Insights">Featured</SectionHeading>

                <div className="grid md:grid-cols-3 gap-7 lg:gap-8">
                    {INSIGHTS.map((a) => (
                        <a
                            key={a.title}
                            href={a.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-ink/[0.06] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={`relative aspect-[16/9] bg-gradient-to-br ${a.gradient} overflow-hidden`}>
                                <span className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_30%_30%,white,transparent_60%)]" />
                                <span className={`absolute top-4 left-4 text-[0.7rem] font-bold tracking-wide px-3 py-1 rounded-full ${a.channelClass}`}>
                                    {a.channel}
                                </span>
                            </div>
                            <div className="flex flex-col flex-1 p-7">
                                <h3 className="font-display text-xl font-bold text-ink mb-3 leading-snug group-hover:text-orange transition-colors">
                                    {a.title}
                                </h3>
                                <p className="text-ink/55 text-sm leading-relaxed flex-1">{a.body}</p>
                                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange">
                                    원문 보기
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

                <p className="text-center text-ink/45 italic mt-12">
                    * 모든 콘텐츠는 '수트와후드' 채널에서 상세 원문을 확인하실 수 있습니다.
                </p>
            </div>
        </section>
    );
}
