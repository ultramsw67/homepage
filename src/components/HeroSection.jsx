const LINKS = [
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/%EC%84%B1%EC%9A%B4-%EB%AC%B8-415976234/',
        icon: (
            <path d="M4.98 3.5a2 2 0 11-.02 4 2 2 0 01.02-4zM3 8.5h4V21H3V8.5zM9 8.5h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C20.4 8.25 21 10.9 21 14.3V21h-4v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.5-2.3 3.1V21H9V8.5z" />
        ),
    },
    {
        label: 'Email',
        href: 'mailto:contact@themoontech.com',
        icon: (
            <path d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 7.5L4 7v.4l8 5.3 8-5.3V7l-8 5.5z" />
        ),
    },
    {
        label: 'Blog',
        href: 'https://blog.naver.com/ultramsw67',
        icon: (
            <path d="M5 4h9a5 5 0 015 5v6a5 5 0 01-5 5H5V4zm3 4v8h5a2 2 0 002-2v-1l-3 3V8H8z" />
        ),
    },
    {
        label: 'Brunch',
        href: 'https://brunch.co.kr/@a3b90b2e717a467',
        icon: (
            <path d="M16.5 3.5a3 3 0 014.2 4.2l-9.5 9.5-5.2 1.5 1.5-5.2 9-9zM14 6l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ),
    },
];

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-cream">
            {/* warm cream panel anchoring the right side, like the deck */}
            <div className="absolute inset-y-0 right-0 w-1/2 md:w-[42%] bg-cream-deep/60 hidden md:block" />
            {/* navy + orange footer rule */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
                <span className="flex-[3] bg-ink" />
                <span className="flex-1 bg-orange" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center py-16 md:py-24">
                    {/* Left — copy */}
                    <div>
                        <p className="text-ink/45 text-sm md:text-base font-semibold tracking-[0.25em] uppercase mb-6 font-display">
                            Suit Logic <span className="text-orange">×</span> Hoodie Action
                        </p>

                        <h1 className="font-display font-extrabold text-ink leading-[0.95] mb-7">
                            <span className="align-top text-base md:text-lg font-bold text-ink/50 mr-2">SOOD</span>
                            <span className="text-5xl md:text-6xl lg:text-7xl">Startup</span>
                            <br />
                            <span className="text-5xl md:text-6xl lg:text-7xl">Strategy</span>
                            <span className="text-orange text-xl md:text-2xl font-bold ml-3 align-middle">Partner</span>
                        </h1>

                        <p className="text-lg md:text-xl text-ink/70 leading-relaxed max-w-lg mb-9">
                            현대그룹 기획실의 정교함과 19년 창업 야전 내공의 결합. <br className="hidden sm:block" />
                            성장을 위한 <span className="text-orange font-bold">가장 현실적인 전략</span>을 제안합니다.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {LINKS.map((l) => (
                                <a
                                    key={l.label}
                                    href={l.href}
                                    target={l.href.startsWith('http') ? '_blank' : undefined}
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 bg-white border border-ink/10 rounded-full pl-4 pr-5 py-2.5 shadow-sm hover:shadow-md hover:border-orange/40 transition-all"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-orange" aria-hidden="true">
                                        {l.icon}
                                    </svg>
                                    <span className="text-sm font-semibold text-ink">{l.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right — portrait */}
                    <div className="flex justify-center md:justify-end">
                        <div className="relative">
                            <div className="absolute -inset-3 rounded-full bg-white shadow-2xl shadow-ink/10" />
                            <img
                                src="/profile.webp"
                                alt="SOOD Startup Strategy Partner"
                                className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] rounded-full object-cover object-top ring-8 ring-white"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
