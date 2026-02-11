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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <AppDataProvider>
          <main className="max-w-lg mx-auto min-h-screen pb-20 md:pb-4">{children}</main>
          <BottomNav />
        </AppDataProvider>
      </body>
    </html>
  );
}
