import Link from 'next/link';

interface Article {
    id: string;
    category: string;
    title: string;
    excerpt: string;
    date: string;
}

const articles: Article[] = [
    {
        id: '1',
        category: 'Streategy',
        title: '투자자를 설득하는 피치덱의 구조',
        excerpt: '성공적인 투자 유치를 위한 스토리텔링과 데이터 시각화의 정석.',
        date: 'Oct 24, 2025'
    },
    {
        id: '2',
        category: 'Culture',
        title: '초기 팀 빌딩: 누구를 버스에 태울 것인가',
        excerpt: '문화적 적합성과 기술적 역량 사이의 균형을 찾는 방법.',
        date: 'Oct 18, 2025'
    },
    {
        id: '3',
        category: 'Product',
        title: 'Product-Market Fit을 찾는 여정',
        excerpt: '가설 설정부터 검증까지, 실패를 줄이는 프로세스.',
        date: 'Oct 10, 2025'
    },
    {
        id: '4',
        category: 'Insight',
        title: '실리콘밸리 트렌드 2026',
        excerpt: '현지에서 직접 보고 들은 최신 기술 트렌드와 시사점.',
        date: 'Sep 28, 2025'
    },
];

export default function ArticleGrid() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-sood-charcoal">
                        Latest Articles
                    </h2>
                    <Link href="/articles" className="text-sood-burgundy font-bold hover:underline">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {articles.map((article) => (
                        <Link key={article.id} href={`/articles/${article.id}`} className="group block h-full">
                            <article className="flex flex-col h-full">
                                <div className="aspect-[3/2] bg-gray-100 mb-6 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-neutral-200 transition-transform duration-500 group-hover:scale-105" />
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="mb-3 flex items-center gap-3">
                                        <span className="text-xs font-bold text-sood-burgundy uppercase tracking-wider">
                                            {article.category}
                                        </span>
                                        <span className="text-xs text-gray-400 font-sans">
                                            {article.date}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-serif font-bold text-sood-charcoal mb-3 group-hover:text-sood-burgundy transition-colors leading-tight">
                                        {article.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
