import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from '@/constants';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: APP_DESCRIPTION,
  keywords: [
    'Tourist Safety',
    'Travel Safety Score',
    'Safe Route Navigation',
    'Emergency SOS',
    'Tourist Assistance',
    'Chennai Safety',
    'Travel Intelligence',
  ],
  authors: [{ name: 'SafeWander Team' }],
  openGraph: {
    title: `${APP_NAME} — Tourist Safety & Communication Platform`,
    description: APP_DESCRIPTION,
    type: 'website',
    locale: 'en_US',
    siteName: APP_NAME,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0b1329] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
