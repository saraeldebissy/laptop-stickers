'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  CalendarBlank,
  LinkedinLogo,
  GithubLogo,
  XLogo,
  FigmaLogo,
  Copy,
  Check,
} from '@phosphor-icons/react/dist/ssr'

const SOCIAL = [
  { icon: LinkedinLogo, href: 'https://www.linkedin.com/in/sara-eldebissy/', label: 'LinkedIn' },
  { icon: GithubLogo,   href: 'https://github.com/saraeldebissy',            label: 'GitHub'   },
  { icon: XLogo,        href: 'https://x.com/SaraEldebissy',                 label: 'X'        },
  { icon: FigmaLogo,    href: 'https://www.figma.com/@saraeldebissy',        label: 'Figma'    },
]

const AGENTS = [
  { name: 'Ratchet', img: '/ratchet-tr.png', quote: "I built the whole thing."          },
  { name: 'Gustave', img: '/gustave-tr.png', quote: "The direction was mine."            },
  { name: 'Six',     img: '/six-tr.png',     quote: "I told her it wasn't good enough."  },
  { name: 'Aloy',    img: '/aloy-tr.png',    quote: "I mapped every pattern first."      },
  { name: 'Hazel',   img: '/hazel-tr.png',   quote: "Every word, in Sara's voice."       },
]

const EMAIL = 'sara.eldebissy@gmail.com'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="snap-start relative z-10 bg-canvas min-h-dvh flex flex-col px-6 md:px-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
        <div className="max-w-[900px] w-full">

          <p className="font-mono text-xs text-ink-subtle uppercase tracking-widest mb-6">
            Contact
          </p>

          <div className="btn-gradient-ring mb-8">
            <div className="btn-gradient-ring-inner inline-flex items-center gap-2 px-5 py-2.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: '#F3A6C7', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite, dot-color-cycle 2s ease-in-out infinite' }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ animation: 'dot-color-cycle 2s ease-in-out infinite' }} />
              </span>
              <p className="font-sans text-sm text-ink-muted">
                Open to senior roles, collaborations, and great conversations.
              </p>
            </div>
          </div>

          <h2 className="font-sans text-[58px] md:text-[76px] leading-[1.05] tracking-tighter text-ink mb-10">
            <span className="font-medium">Let&apos;s build something</span><br />
            <span className="whitespace-nowrap">
              <span className="font-sans italic gradient-text-flow">thoughtful</span>
              <span className="font-medium"> together</span>
            </span>
          </h2>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">

            {/* Email — normal border */}
            <div className="inline-flex items-center gap-3 bg-surface-2 border border-border rounded-pill px-5 py-3">
              <a
                href={`mailto:${EMAIL}`}
                className="text-sm font-sans font-medium text-ink underline-offset-2 hover:underline decoration-border"
              >
                {EMAIL}
              </a>
              <button
                onClick={copyEmail}
                aria-label="Copy email address"
                className="text-ink-muted hover:text-ink transition-colors"
              >
                {copied
                  ? <Check size={14} weight="bold" className="text-green-500" />
                  : <Copy size={14} />
                }
              </button>
            </div>

            {/* Book a call */}
            <a
              href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3p-jfjRHe6hTNnFdcUifpFrC97FGPCXrDEAK_whEUOGOc_uAXjc-I7ZH-T97eltepZ4zxDUhtq"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient-ring-hover"
            >
              <span className="btn-gradient-ring-hover-inner inline-flex items-center gap-2 text-sm font-sans font-medium px-6 py-3">
                <CalendarBlank size={15} weight="bold" />
                Let&apos;s talk
              </span>
            </a>
          </div>

          {/* Social */}
          <div>
            <p className="font-mono text-xs text-ink-subtle uppercase tracking-widest mb-5">
              Also find me on
            </p>
            <div className="flex items-center justify-center gap-6">
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
          </div>

        </div>
      </div>

      {/* ── Agent bar — pinned to bottom ── */}
      <div className="border-t border-border py-6 px-6 md:px-8 flex items-center justify-center gap-20 flex-wrap">

        {/* Gradient sparkle + combined credit */}
        <div className="flex items-center gap-2 shrink-0">
          <p className="font-sans text-xs text-ink-subtle flex items-center gap-2">
            <span>© 2026 Sara Eldebissy</span>
            <svg viewBox="0 0 16 16" width="10" height="10" className="shrink-0">
              <defs>
                <linearGradient id="sparkle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F3A6C7" />
                  <stop offset="100%" stopColor="#C8B8FF" />
                </linearGradient>
              </defs>
              <path d="M8 0 C8 4.5 11.5 8 16 8 C11.5 8 8 11.5 8 16 C8 11.5 4.5 8 0 8 C4.5 8 8 4.5 8 0Z" fill="url(#sparkle-grad)" />
            </svg>
            <span>Built with <strong className="text-ink-muted font-semibold">my AI agent team</strong> and <strong className="text-ink-muted font-semibold">Claude Code</strong></span>
          </p>
        </div>

        {/* Agents — names below, quote bubble on hover */}
        <div className="flex items-end gap-6">
          {AGENTS.map(({ name, img, quote }) => (
            <div key={name} className="group relative flex flex-col items-center cursor-default">
              {/* Hover bubble */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-10
                              pointer-events-none whitespace-nowrap
                              opacity-0 group-hover:opacity-100
                              translate-y-1 group-hover:translate-y-0
                              transition-all duration-200">
                <div className="bg-canvas border border-border rounded-lg px-3 py-2 shadow-float">
                  <p className="font-sans text-[10px] text-ink-muted">{quote}</p>
                </div>
                <div className="mx-auto mt-0 w-2 h-1.5 bg-canvas border-r border-b border-border rotate-45 -translate-y-1 translate-x-[calc(50%-4px)]" />
              </div>

              <Image
                src={img}
                alt={name}
                width={48}
                height={64}
                className="object-contain object-bottom transition-transform duration-200
                           group-hover:-translate-y-2 group-hover:scale-110"
              />
              <p className="font-mono text-[10px] text-ink-subtle/50 group-hover:text-ink-muted group-hover:font-bold mt-1 whitespace-nowrap transition-colors duration-200">
                {name}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
