
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import ClientWrapper from '../components/ClientWrapper'
import LanguageSelector from '../components/LanguageSelector'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Family Tree App',
  description: 'Explore and manage your family history with our interactive family tree application.',
  keywords: 'family tree, genealogy, ancestry, family history',
  openGraph: {
    title: 'Family Tree App',
    description: 'Explore and manage your family history with our interactive family tree application.',
    url: 'https://tree.sajanadhikari.com.np',
    siteName: 'Family Tree App',
    images: [
      {
        url: 'https://tree.sajanadhikari.com.np/_next/image?url=%2Flogo.png&w=128&q=75',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Family Tree App',
    description: 'Explore and manage your family history with our interactive family tree application.',
    images: ['https://tree.sajanadhikari.com.np/_next/image?url=%2Flogo.png&w=128&q=75'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'G-JZJFLMPXBR',
  },
}


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
        <ToastContainer />
      </body>
    </html>
  )
  }