import { Link, useParams } from 'react-router-dom';
import { articlesData } from '@/lib/articles';
import CommentSection from '@/components/CommentSection';

export default function ArticleDetail() {
    const { id } = useParams();
    const article = articlesData.find((a) => a.id === id);

    if (!article) {
        return <div className="pt-32 text-center text-xl">Article not found.</div>;
    }

    return (
        <main className="pt-24 pb-20 bg-white min-h-screen">
            <article className="container mx-auto px-4 max-w-3xl">
                {/* Header */}
                <header className="mb-12 text-center">
                    <span className="text-sood-burgundy font-bold tracking-widest uppercase text-sm mb-4 block">
                        {article.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-sood-charcoal mb-6 leading-tight">
                        {article.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>By Sood</span>
                    </div>
                </header>

                {/* Cover Image */}
                <div className="aspect-[16/9] w-full relative rounded-2xl overflow-hidden shadow-lg mb-12 bg-gray-100">
                    <img
                        src="/rss/image/chart_placeholder.svg"
                        alt={article.title}
                        className="object-cover w-full h-full absolute inset-0"
                    />
                </div>

                {/* Content */}
                <div
                    className="prose prose-lg prose-neutral mx-auto max-w-none prose-headings:font-serif prose-headings:text-sood-charcoal prose-a:text-sood-burgundy hover:prose-a:text-sood-burgundy/80 font-sans leading-loose text-gray-700"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Comments */}
                <CommentSection articleId={article.id} />

                {/* Back Link */}
                <div className="mt-16 pt-8 border-t border-gray-100 text-center">
                    <Link to="/articles" className="inline-flex items-center gap-2 text-sood-burgundy font-bold hover:underline">
                        ← Back to Articles
                    </Link>
                </div>
            </article>
        </main>
    );
}
