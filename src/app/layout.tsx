import type { Metadata } from 'next';
import { Lilita_One } from 'next/font/google';
import './globals.css';

const lilitaOne = Lilita_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-lilita-one',
});

export const metadata: Metadata = {
  title: 'Brawldle - Adivinhe o Brawler do dia!',
  description: 'Um jogo diário onde você tenta adivinhar o Brawler secreto de Brawl Stars',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
    <body className={lilitaOne.variable}>{children}</body>
    </html>
  );
}