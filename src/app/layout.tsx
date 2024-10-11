
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import ClientWrapper from '../components/ClientWrapper'
import LanguageSelector from '../components/LanguageSelector'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientWrapper>
            <LanguageSelector />
            {children}
          </ClientWrapper>
        </Providers>
      </body>
    </html>
  )
  }