import type { Metadata } from 'next'
import { Outfit, Space_Mono, Dancing_Script, Newsreader } from 'next/font/google'
import ClickEffect from '@/components/ClickEffect'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-newsreader',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sara Eldebissy — Product Designer',
  description: 'Product designer based in Dubai. Creating digital products that are fast, clear, and actually used.',
  openGraph: {
    title: 'Sara Eldebissy — Product Designer',
    description: 'Product designer based in Dubai.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceMono.variable} ${dancingScript.variable} ${newsreader.variable}`}>
      <body className="font-sans antialiased bg-canvas text-ink">
        <ClickEffect />
        {children}
      </body>
    </html>
  )
}
