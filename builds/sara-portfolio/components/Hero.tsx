import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-canvas bg-grid overflow-hidden">

      {/* ── Center: Name + tagline ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none">
        <h1
          className="text-[88px] md:text-[112px] leading-none text-ink"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Sara
        </h1>
        <p className="font-mono text-[11px] text-ink-muted tracking-[0.35em] uppercase mt-4">
          I think before I build. I build to think better.
        </p>
      </div>

      {/* ── CTAs — bottom center ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <a
          href="#work"
          className="inline-flex items-center gap-2 bg-action-bg text-white text-sm font-sans font-medium px-5 py-2.5 rounded-pill hover:bg-action-bg-hover transition-colors"
        >
          See my work <ArrowRight size={13} weight="bold" />
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 bg-surface-1 text-ink text-sm font-sans font-medium px-5 py-2.5 rounded-pill hover:bg-surface-2 transition-colors"
        >
          Get in touch
        </a>
      </div>

      {/* ══════════════════════════════
          SCATTERED CARDS — desktop only
          ══════════════════════════════ */}

      {/* Card 1 — ID Badge (top-left) */}
      <div
        className="hidden md:block absolute z-20"
        style={{ left: '4%', top: '16%', transform: 'rotate(-4deg)' }}
      >
        <div className="bg-ink rounded-xl w-[190px] p-5 shadow-float">
          <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] mb-5">
            Landmark Group
          </p>
          <p
            className="text-3xl text-white leading-none mb-2"
            style={{ fontFamily: 'var(--font-script)' }}
          >
            Sara
          </p>
          <p className="font-sans text-xs text-white/50 leading-relaxed mb-5">
            Designing at the intersection<br />of craft and code
          </p>
          <div className="w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
            <span className="font-sans font-semibold text-base text-white/50">SE</span>
          </div>
          <p className="font-mono text-[9px] text-white/25 mt-4 tracking-wider">
            Dubai · UAE
          </p>
        </div>
      </div>

      {/* Card 2 — Projects stat (left, below badge) */}
      <div
        className="hidden md:block absolute z-20"
        style={{ left: '5%', top: '64%', transform: 'rotate(3deg)' }}
      >
        <div className="bg-canvas rounded-xl w-[164px] p-4 shadow-float border border-border">
          {/* Record visual */}
          <div className="w-20 h-20 mx-auto rounded-full bg-ink flex items-center justify-center mb-3 relative">
            <div className="absolute inset-[6px] rounded-full border border-white/10" />
            <div className="w-5 h-5 rounded-full bg-white/20" />
          </div>
          <p className="font-mono text-[9px] text-ink-subtle uppercase tracking-widest text-center">
            Projects
          </p>
          <p className="font-sans font-bold text-2xl text-ink text-center mt-0.5">23+</p>
          <p className="font-sans text-xs text-ink-muted text-center mt-0.5">Learning by building</p>
        </div>
      </div>

      {/* Card 3 — Terminal (bottom, slightly right of center) */}
      <div
        className="hidden md:block absolute z-20"
        style={{ left: '40%', bottom: '12%', transform: 'rotate(-1.5deg)' }}
      >
        <div className="bg-canvas rounded-xl w-[300px] shadow-float border border-border overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-1.5 bg-surface-2 px-4 py-3 border-b border-border">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
            <p className="font-mono text-[10px] text-ink-subtle ml-2">sara — zsh</p>
          </div>
          {/* Terminal body */}
          <div className="px-4 py-4 space-y-1.5">
            <p className="font-mono text-xs text-ink-muted">
              <span className="text-accent">~ $</span> whoami
            </p>
            <p className="font-mono text-xs text-ink">Product Designer · 5+ years</p>
            <p className="font-mono text-xs text-ink-muted mt-2">
              <span className="text-accent">~ $</span> ls interests/
            </p>
            <p className="font-mono text-xs text-ink">design/code/side-projects</p>
            <p className="font-mono text-xs text-ink-muted mt-2">
              <span className="text-accent">~ $</span> <span className="animate-pulse">▌</span>
            </p>
          </div>
        </div>
      </div>

      {/* Card 4 — Design × Tech ticket (top-right area) */}
      <div
        className="hidden md:block absolute z-20"
        style={{ right: '22%', top: '10%', transform: 'rotate(4deg)' }}
      >
        <div className="bg-canvas rounded-xl w-[220px] p-5 shadow-float border border-border">
          <div className="flex items-start justify-between mb-3">
            <div className="w-3 h-12 bg-ink rounded-full" />
            <div className="w-16 h-4 rounded bg-surface-2" />
          </div>
          <p className="font-sans font-bold text-xl text-ink leading-tight">
            DESIGN ×<br />TECHNOLOGY
          </p>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="font-mono text-[9px] text-ink-subtle uppercase tracking-widest">Est.</p>
            <p className="font-mono text-xs text-ink">2019 → Present</p>
            <p className="font-mono text-[9px] text-ink-subtle mt-2">Dubai + Remote</p>
          </div>
        </div>
      </div>

      {/* Card 5 — Currently at (right) */}
      <div
        className="hidden md:block absolute z-20"
        style={{ right: '4%', top: '38%', transform: 'rotate(-3deg)' }}
      >
        <div className="bg-surface-1 rounded-xl w-[200px] p-5 shadow-float border border-border">
          <p className="font-mono text-[9px] text-ink-subtle uppercase tracking-widest mb-3">
            Currently
          </p>
          <p className="font-sans font-semibold text-sm text-ink leading-snug">
            Product Designer<br />@ Landmark Group
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {['Figma', 'Next.js', 'Framer'].map((t) => (
              <span
                key={t}
                className="font-mono text-[9px] text-ink-muted bg-canvas border border-border px-2 py-1 rounded-pill"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Watermark */}
      <p className="hidden md:block absolute bottom-8 right-8 font-mono text-[9px] text-ink-subtle tracking-[0.15em] uppercase select-none z-10">
        Portfolio · 2025
      </p>
    </section>
  )
}
