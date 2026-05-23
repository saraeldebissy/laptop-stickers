import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'

const PROJECTS = [
  {
    id: 1,
    title: 'Nejoom Styli',
    type: 'Product Design',
    year: '2024',
    description: 'Influencer self-service platform replacing a fully manual onboarding process for Styli by Landmark.',
    tone: '#EFE5DB',
    dark: false,
    featured: true,
  },
  {
    id: 2,
    title: 'Landmark Design System',
    type: 'Design Systems',
    year: '2024',
    description: 'Unified component library scaling across Centrepoint, Max, and Homecenter.',
    tone: '#DFE8F5',
    dark: false,
    featured: false,
  },
  {
    id: 3,
    title: 'UX Police',
    type: 'Side Project',
    year: '2025',
    description: 'Dark pattern crime board for UX educators and researchers.',
    tone: '#0F1118',
    dark: true,
    featured: false,
  },
  {
    id: 4,
    title: 'Wall of Vibes',
    type: 'Side Project',
    year: '2024',
    description: 'Portfolio build tracking board with drag-and-drop, live at wall-of-vibes.vercel.app.',
    tone: '#EBDEEF',
    dark: false,
    featured: true,
  },
]

export default function Work() {
  return (
    <section id="work" className="bg-canvas py-24 px-6 md:px-8">
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-xs text-ink-subtle uppercase tracking-widest mb-3">
          Selected work
        </p>
        <h2 className="font-newsreader font-normal text-[40px] leading-[1.05] text-ink mb-12">
          What I've shipped
        </h2>

        {/* Row 1: 2/3 + 1/3 */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mb-4">
          <ProjectCard project={PROJECTS[0]} tall />
          <ProjectCard project={PROJECTS[1]} tall />
        </div>

        {/* Row 2: 1/3 + 2/3 (reversed) */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
          <ProjectCard project={PROJECTS[2]} />
          <ProjectCard project={PROJECTS[3]} />
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  tall = false,
}: {
  project: (typeof PROJECTS)[0]
  tall?: boolean
}) {
  const textPrimary = project.dark ? 'text-white' : 'text-ink'
  const textMuted = project.dark ? 'text-white/50' : 'text-ink-muted'
  const textSubtle = project.dark ? 'text-white/30' : 'text-ink-subtle'
  const tagBg = project.dark ? 'bg-white/10' : 'bg-white/60'
  const tagText = project.dark ? 'text-white/60' : 'text-ink-muted'
  const arrowDefault = project.dark ? 'text-white/30' : 'text-ink-subtle'
  const arrowHover = project.dark ? 'group-hover:text-white' : 'group-hover:text-ink'

  return (
    <div
      className={`group rounded-2xl overflow-hidden cursor-pointer transition-opacity hover:opacity-95 ${tall ? 'min-h-[280px]' : 'min-h-[200px]'}`}
      style={{ background: project.tone }}
    >
      <div className="p-6 h-full flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <p className={`font-mono text-[9px] uppercase tracking-widest ${textSubtle}`}>
            {project.type} · {project.year}
          </p>
          <ArrowUpRight
            size={15}
            className={`${arrowDefault} ${arrowHover} transition-colors shrink-0`}
          />
        </div>

        {/* Bottom: title + description */}
        <div className="mt-auto pt-6">
          <p className={`font-newsreader font-normal text-[26px] leading-tight mb-2 ${textPrimary}`}>
            {project.title}
          </p>
          <p className={`font-sans text-sm leading-relaxed ${textMuted}`}>
            {project.description}
          </p>
        </div>
      </div>
    </div>
  )
}
