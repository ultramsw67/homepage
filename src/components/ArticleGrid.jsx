import { Link } from 'react-router-dom';
import { articlesData as articles } from '@/lib/articles';

export default function ArticleGrid() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-sood-charcoal">
                        Latest Articles
                    </h2>
                    <Link to="/articles" className="text-sood-burgundy font-bold hover:underline">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {articles.map((article) => (
                        <Link key={article.id} to={`/articles/${article.id}`} className="group block h-full">
                            <article className="flex flex-col h-full">
                                <div className="aspect-[3/2] bg-sood-charcoal/5 relative overflow-hidden flex items-center justify-center group-hover:bg-sood-charcoal/10 transition-colors">
                                    <span className="text-4xl text-sood-burgundy/20 font-serif font-bold">
                                        {article.title.charAt(0)}
                                    </span>
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
