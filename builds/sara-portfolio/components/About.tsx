const SKILLS = [
  'Figma',
  'User Research',
  'Prototyping',
  'Design Systems',
  'Next.js',
  'Framer',
  'Spline',
  'Motion Design',
  'Information Architecture',
  'Workshop Facilitation',
]

export default function About() {
  return (
    <section id="about" className="bg-surface-1 py-24 px-6 md:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-16 items-start">

          {/* Left: bio */}
          <div>
            <p className="font-mono text-xs text-ink-subtle uppercase tracking-widest mb-3">
              About
            </p>
            <h2 className="font-newsreader font-normal text-[40px] leading-[1.05] text-ink mb-6">
              Designer by trade,<br />builder by habit
            </h2>
            <div className="space-y-4">
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                I'm Sara — a product designer at Landmark Group in Dubai. I work across Centrepoint, Max, Homecenter, and Styli, designing features used by millions of customers across the GCC.
              </p>
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                Outside of my day job, I build side projects to explore new tools and ideas — mostly things I wish existed, shipped as fast as possible.
              </p>
            </div>
          </div>

          {/* Right: skills */}
          <div>
            <p className="font-mono text-xs text-ink-subtle uppercase tracking-widest mb-5">
              Tools & skills
            </p>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="font-sans text-sm text-ink-muted bg-canvas border border-border px-4 py-2 rounded-pill"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
