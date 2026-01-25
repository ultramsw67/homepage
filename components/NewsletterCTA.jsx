export default function NewsletterCTA() {
    return (
        <section className="py-20 bg-sood-cream text-sood-charcoal border-t border-sood-burgundy/10">
            <div className="container mx-auto px-4 text-center max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-sood-burgundy mb-6">
                    Subscribe to Sood
                </h2>
                <p className="text-lg text-sood-charcoal/80 mb-8 font-sans leading-relaxed">
                    매주 월요일 아침, 스타트업 성장에 필요한 <br className="hidden md:block" />
                    가 확실한 인사이트를 배달해 드립니다.
                </p>

                <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="flex-1 px-6 py-4 rounded-none bg-white border border-sood-burgundy/20 text-sood-charcoal placeholder-sood-gray focus:outline-none focus:border-sood-burgundy focus:ring-1 focus:ring-sood-burgundy transition-all"
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 bg-sood-burgundy text-white font-bold uppercase tracking-wide hover:bg-sood-burgundy/90 transition-colors"
                    >
                        Subscribe
                    </button>
                </form>
                <p className="mt-4 text-xs text-sood-gray">
                    No spam, unsubscribe anytime.
                </p>
            </div>
        </section>
    );
}
