import './globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeProvider from '@/components/shared/providers/ThemeProvider/ThemeProvider';
import LanguageProvider from '@/components/shared/providers/LanguageProvider/LanguageProvider';
import { AuthProvider } from '@/components/shared/providers/AuthProvider/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // 1. 基本情報 (SEOの最重要項目)
  title: {
    default: '理大祭特設サイト', // 開催回数は仮で「??」
    template: '%s | 理大祭',
  },
  description: '東京理科大学葛飾キャンパスで開催される理大祭の当日用サイトです。開催日程、企画情報、アクセス、出展団体、ゲスト情報などを掲載しています。皆様のご来場をお待ちしております！',
  keywords: ['理大祭', '東京理科大学', '理科大', '学園祭', '大学祭', '神楽坂', '葛飾', '野田'],

  // 2. OGP (SNSシェア対策)
  openGraph: {
    title: '第13回 東京理科大学 理大祭 当日サイト',
    description: '開催日程、企画情報、アクセス、出展団体、ゲスト情報などを掲載。理大祭を楽しもう！',
    url: 'https://tusfes.vercel.app/', // 実際のURLを設定
    siteName: '理大祭 公式サイト',
    images: [
      {
        url: 'https://tusfes.vercel.app/ogp-main.jpg', // 理大祭のロゴやメインビジュアルを使った画像
        width: 1200,
        height: 630,
        alt: '第13回 理大祭 メインビジュアル',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  
  // 3. Twitter Card (特に学生の拡散で重要)
  twitter: {
    card: 'summary_large_image',
    title: '第13回 東京理科大学 理大祭 公式サイト',
    description: '今年のゲストや企画、開催日程をチェック！ #理大祭 #東京理科大学',
    creator: '@tus_ridaisai', // 理大祭公式アカウントのTwitter ID
    images: ['https://tusfes.vercel.app//twitter-card.jpg'],
  },

  // 4. その他
  robots: 'index, follow', // クローラーにインデックスとフォローを許可 (通常はデフォルトで設定されていますが明示)
  authors: [{ name: 'tus.Genesis' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
