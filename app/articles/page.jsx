import Image from 'next/image';
import Link from 'next/link';
import { articlesData as allArticles } from '@/lib/articles';

export default function ArticlesPage() {
    return (
        <main className="pt-24 pb-20 bg-white min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-sood-charcoal mb-4">
                        Articles
                    </h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        스타트업 성장, 전략, 그리고 인사이트에 관한 깊이 있는 이야기들
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {allArticles.map((article) => (
                        <Link key={article.id} href={`/articles/${article.id}`} className="group block h-full">
                            <article className="flex flex-col h-full bg-sood-cream rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="aspect-[3/2] bg-gray-100 relative overflow-hidden">
                                    <Image
                                        src="/rss/image/nanobanana_placeholder.svg"
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
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

                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                                        {article.excerpt}
                                    </p>

                                    <div className="mt-auto pt-4 text-sood-burgundy font-bold text-sm flex items-center gap-2">
                                        Read More <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
