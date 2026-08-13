const WORDS = ['Strategy', 'Creativity', 'Technology', 'Outcomes']

export function Marquee() {
  const row = [...WORDS, ...WORDS, ...WORDS]
  return (
    <div
      data-testid="editorial-marquee"
      aria-hidden
      className="overflow-hidden border-y border-white/5 bg-depth-1/40 py-6 md:py-8"
    >
      <div className="marquee-track flex w-max items-center whitespace-nowrap">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center">
            {row.map((w, i) => (
              <span key={`${dup}-${i}`} className="flex items-center">
                <span
                  className={`px-8 font-serif text-3xl tracking-tight md:px-12 md:text-5xl ${
                    i % 2 ? 'italic text-white/30' : 'text-white/65'
                  }`}
                >
                  {w}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-electric/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
