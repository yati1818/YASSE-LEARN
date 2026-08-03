import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YASSE Learn - Premier Educational Platform & Mobile App',
  description: 'Free gamified educational app for Class 3 to Class 12 students with AI verified lectures, GitHub-style contribution streaks, and ChatGPT AI tutoring.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'YASSE Learn App',
  },
};

export const viewport: Viewport = {
  themeColor: '#070d1e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="https://api.dicebear.com/7.x/bottts/svg?seed=YasseAppIcon" />
      </head>
      <body className="bg-[#070d1e] text-slate-100 antialiased font-sans min-h-screen selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
