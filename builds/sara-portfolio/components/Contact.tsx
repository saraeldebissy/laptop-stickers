'use client'

import { useState } from 'react'
import {
  Envelope,
  CalendarBlank,
  LinkedinLogo,
  GithubLogo,
  DribbbleLogo,
} from '@phosphor-icons/react/dist/ssr'

const SOCIAL = [
  { icon: LinkedinLogo, href: 'https://linkedin.com/in/saraeldebissy', label: 'LinkedIn' },
  { icon: GithubLogo,   href: 'https://github.com/saraeldebissy',      label: 'GitHub'   },
  { icon: DribbbleLogo, href: 'https://dribbble.com',                   label: 'Dribbble' },
]

const AGENTS = [
  { name: 'Ratchet',     initials: 'R',  bg: '#E8703A' },
  { name: 'Aloy',        initials: 'A',  bg: '#5A9E70' },
  { name: 'Six',         initials: 'S',  bg: '#7B5CAE' },
  { name: 'Gustave',     initials: 'G',  bg: '#C4933C' },
  { name: 'Hazel',       initials: 'H',  bg: '#E07A9E' },
  { name: 'Claude Code', initials: 'CC', bg: '#DA7756' },
]

export default function Contact() {
  const [showAgents, setShowAgents] = useState(false)

  return (
    <section id="contact" className="bg-canvas py-28 px-6 md:px-8">
      <div className="max-w-[720px] mx-auto text-center">

        {/* Eyebrow */}
        <p className="font-mono text-xs text-ink-subtle uppercase tracking-widest mb-6">
          Contact
        </p>

        {/* Headline */}
        <h2 className="font-newsreader font-normal text-[52px] md:text-[64px] leading-[1.05] text-ink mb-10">
          Let's build something<br />
          <span className="gradient-text">thoughtful</span> together
        </h2>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <a
            href="mailto:sara@eldebissy.com"
            className="inline-flex items-center gap-2 bg-action-bg text-white text-sm font-sans font-medium px-6 py-3 rounded-pill hover:bg-action-bg-hover transition-colors"
          >
            <Envelope size={15} weight="bold" />
            sara@eldebissy.com
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-surface-2 text-ink text-sm font-sans font-medium px-6 py-3 rounded-pill hover:bg-surface-3 transition-colors border border-border"
          >
            <CalendarBlank size={15} weight="bold" />
            Book a call
          </a>
        </div>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-2 mb-20">
          {SOCIAL.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 rounded-full bg-surface-2 border border-border flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-3 transition-colors"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-8 flex flex-col items-center gap-4">

          {/* Agent avatars — stacked, spread on hover */}
          <div
            className="flex items-center transition-all duration-300"
            style={{
              opacity: showAgents ? 1 : 0,
              transform: showAgents ? 'translateY(0px)' : 'translateY(6px)',
              pointerEvents: showAgents ? 'auto' : 'none',
            }}
          >
            {AGENTS.map(({ name, initials, bg }, i) => (
              <div
                key={name}
                title={name}
                className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold text-white border-2 border-canvas shrink-0"
                style={{
                  fontSize: initials.length > 1 ? '9px' : '12px',
                  background: bg,
                  marginLeft: i === 0 ? 0 : (showAgents ? '4px' : '-10px'),
                  zIndex: AGENTS.length - i,
                  transition: 'margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {initials}
              </div>
            ))}
          </div>

          {/* Hover trigger text */}
          <p
            className="font-mono text-xs text-ink-subtle cursor-default select-none"
            onMouseEnter={() => setShowAgents(true)}
            onMouseLeave={() => setShowAgents(false)}
          >
            Built by my agents team with Claude Code
          </p>

          <p className="font-mono text-xs text-ink-subtle">
            © 2025 Sara Eldebissy · Dubai, UAE
          </p>
        </div>

      </div>
    </section>
  )
}
