import './globals.css'
import { Inter } from 'next/font/google'
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
        <ClientWrapper>
          <LanguageSelector />
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}