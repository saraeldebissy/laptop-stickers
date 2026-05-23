'use client'

import { useEffect, useState } from 'react'
import {
  House,
  Briefcase,
  User,
  Envelope,
  LinkedinLogo,
  FileArrowDown,
} from '@phosphor-icons/react/dist/ssr'

const NAV_ITEMS = [
  { label: 'Home',    icon: House,     href: '#',        sectionId: 'home'    },
  { label: 'Work',    icon: Briefcase, href: '#work',    sectionId: 'work'    },
  { label: 'About',   icon: User,      href: '#about',   sectionId: 'about'   },
  { label: 'Contact', icon: Envelope,  href: '#contact', sectionId: 'contact' },
]

const EXTERNAL_ITEMS = [
  { label: 'LinkedIn', icon: LinkedinLogo,  href: 'https://linkedin.com/in/saraeldebissy' },
  { label: 'Resume',   icon: FileArrowDown, href: '#' },
]

export default function Nav() {
  const [expanded, setExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const ids = ['work', 'about', 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.4 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    const onScroll = () => {
      if (window.scrollY < 200) setActiveSection('home')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <nav
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-1 rounded-2xl p-1.5 bg-surface-2"
      style={{
        width: expanded ? '196px' : '52px',
        transition: 'width 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'clip',
        boxShadow: '0 4px 20px rgba(15, 17, 24, 0.07)',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {NAV_ITEMS.map(({ label, icon: Icon, href, sectionId }) => {
        const isActive = activeSection === sectionId
        return (
          <a
            key={label}
            href={href}
            title={!expanded ? label : undefined}
            className={`flex items-center shrink-0 rounded-xl py-2.5 transition-colors ${
              expanded ? 'gap-3 px-3' : 'justify-center'
            } ${
              isActive
                ? 'bg-white text-ink'
                : 'text-ink-muted hover:text-ink'
            }`}
            style={isActive ? { boxShadow: '0 1px 3px rgba(15, 17, 24, 0.08)' } : undefined}
          >
            <Icon size={17} weight={isActive ? 'fill' : 'regular'} className="shrink-0" />
            {expanded && (
              <span className="font-sans text-sm font-medium truncate">{label}</span>
            )}
          </a>
        )
      })}

      {/* Separator */}
      <div className="mx-2 my-0.5 border-t border-border shrink-0" />

      {EXTERNAL_ITEMS.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={!expanded ? label : undefined}
          className={`flex items-center shrink-0 rounded-xl py-2.5 transition-colors text-ink-subtle hover:text-ink-muted ${
            expanded ? 'gap-3 px-3' : 'justify-center'
          }`}
        >
          <Icon size={17} className="shrink-0" />
          {expanded && (
            <span className="font-sans text-sm font-medium truncate">{label}</span>
          )}
        </a>
      ))}
    </nav>
  )
}
