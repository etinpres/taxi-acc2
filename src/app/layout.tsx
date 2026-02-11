import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { AppDataProvider } from '@/contexts/app-data-context';
import { BottomNav } from '@/components/common/bottom-nav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '고도비만 택시장부',
  description: '고도비만 택시장부 - 택시기사 수입지출 장부 웹앱',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '고도비만 택시장부',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563EB',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/taxi-acc2/manifest.json" />
      </head>
      <body className={`${geistSans.variable} font-sans antialiased bg-gray-50 text-gray-900 h-dvh flex flex-col overflow-hidden`}>
        <AppDataProvider>
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-lg mx-auto pb-4">{children}</div>
          </main>
          <BottomNav />
        </AppDataProvider>
      </body>
    </html>
  );
}
