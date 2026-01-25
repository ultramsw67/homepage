export default function NewsletterCTA() {
    return (
        <section className="py-20 bg-sood-burgundy text-sood-cream">
            <div className="container mx-auto px-4 text-center max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                    Subscribe to Sood
                </h2>
                <p className="text-lg text-white/80 mb-8 font-sans leading-relaxed">
                    매주 월요일 아침, 스타트업 성장에 필요한 <br className="hidden md:block" />
                    가 확실한 인사이트를 배달해 드립니다.
                </p>

                <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="flex-1 px-6 py-4 rounded-none bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition-colors"
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 bg-white text-sood-burgundy font-bold uppercase tracking-wide hover:bg-sood-cream transition-colors"
                    >
                        Subscribe
                    </button>
                </form>
                <p className="mt-4 text-xs text-white/40">
                    No spam, unsubscribe anytime.
                </p>
            </div>
        </section>
    );
}
