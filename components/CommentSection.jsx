'use client';
import { useState, useRef } from 'react';

export default function CommentSection({ articleId }) {
    const [comments, setComments] = useState([
        { id: 1, author: '익명', text: '좋은 글 잘 읽었습니다! 큰 도움이 되네요.', date: '2025-10-25' },
        { id: 2, author: 'User123', text: '특히 피치덱 구조 부분이 와닿습니다.', date: '2025-10-26' }
    ]);
    const [newComment, setNewComment] = useState('');
    const commentsBottomRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            author: '익명', // Anonymous by default as per request
            text: newComment,
            date: new Date().toISOString().split('T')[0]
        };

        setComments([...comments, comment]);
        setNewComment('');

        // Slight delay to scroll after render
        setTimeout(() => {
            commentsBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <section className="mt-16 pt-10 border-t border-gray-200">
            <h3 className="text-2xl font-serif font-bold text-sood-charcoal mb-8">
                Comments ({comments.length})
            </h3>

            {/* Comment List */}
            <div className="space-y-6 mb-10">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-sood-cream/50 p-6 rounded-xl border border-sood-burgundy/5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-sood-burgundy">{comment.author}</span>
                            <span className="text-xs text-gray-400">{comment.date}</span>
                        </div>
                        <p className="text-sood-charcoal">{comment.text}</p>
                    </div>
                ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative" ref={commentsBottomRef}>
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-bold text-sood-charcoal mb-2">
                        Leave a comment (Anonymous)
                    </label>
                    <textarea
                        id="comment"
                        rows="4"
                        className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-sood-burgundy focus:ring-1 focus:ring-sood-burgundy transition-all"
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-sood-burgundy text-white font-bold rounded-lg hover:bg-sood-burgundy/90 transition-colors"
                    >
                        Post Comment
                    </button>
                </div>
            </form>
        </section>
    );
}
