import { PropsWithChildren } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { TooltipProvider } from '@/components/ui/tooltip';
import { env } from '@/config/environment';
import { cn } from '@/utils/cn';
import './globals.css';
import ClientProviders from './providers';
import { AI } from './action'; // Import AI from action.tsx for generative UI utilities
import { Inter as FontSans } from "next/font/google"

// Metadata and viewport configuration
const metadata = {
  title: 'ink!athon Boilerplate SSJ4',
  description: 'and this is to go EVEN FURTHER BEYOND',
  openGraph: {
    type: 'website',
    locale: 'en',
    url: env.url,
    siteName: 'behold, my power',
    images: [
      {
        url: '/images/inkathon-og-banner.jpg',
        width: 1280,
        height: 640,
      },
    ],
  },
  twitter: {
    site: '@yikesawjeez',
    creator: '@yikesawjeez adapted from @scio_xyz',
    card: 'summary_large_image',
  },
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={cn('dark', GeistSans.variable, GeistMono.variable)}>
            <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ClientProviders>
          <TooltipProvider>
            <AI> {/* Wrap children with AI for generative UI capabilities */}
              {children}
            </AI>
          </TooltipProvider>
        </ClientProviders>
        {!!env.isProduction && <Analytics />}
      </body>
    </html>
  );
}
