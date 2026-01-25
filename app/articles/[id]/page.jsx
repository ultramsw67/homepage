import Link from 'next/link';
import Image from 'next/image';
import { articlesData } from '@/lib/articles';
import CommentSection from '@/components/CommentSection';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return articlesData.map((article) => ({
        id: article.id,
    }));
}

export default function ArticleDetail({ params }) {
    // In Next.js 15+ or server components, params might need to be awaited or used directly.
    // For safety in this setup:
    const { id } = params;
    const article = articlesData.find((a) => a.id === id);

    if (!article) {
        notFound();
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
                    <Image
                        src="/rss/image/chart_placeholder.svg"
                        alt={article.title}
                        fill
                        className="object-cover"
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
                    <Link href="/articles" className="inline-flex items-center gap-2 text-sood-burgundy font-bold hover:underline">
                        ← Back to Articles
                    </Link>
                </div>
            </article>
        </main>
    );
}
