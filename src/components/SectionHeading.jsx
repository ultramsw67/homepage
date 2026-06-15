// Deck-style section heading: orange tick bar + bold navy text with a small orange accent word.
export default function SectionHeading({ children, accent, after }) {
    return (
        <div className="flex items-center gap-4 mb-10 md:mb-14">
            <span className="w-1.5 h-9 md:h-11 bg-orange rounded-full shrink-0" />
            <h2 className="font-display text-3xl md:text-[2.5rem] font-extrabold text-ink leading-none flex items-baseline flex-wrap gap-x-3">
                <span>{children}</span>
                {accent && <span className="text-orange text-lg md:text-xl font-bold">{accent}</span>}
                {after && <span>{after}</span>}
            </h2>
        </div>
    );
}
