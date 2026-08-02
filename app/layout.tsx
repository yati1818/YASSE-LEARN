import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YASSE Learn | Free Educational Platform Class 3 to 12',
  description: 'A production-ready, highly engaging, playful yet professional free educational web platform for Class 3 to 12. Featuring AI compliance video verification, doubt clarification dispatch, dual gamified streaks, and YASSE AI study helper.',
  keywords: ['YASSE Learn', 'EdTech', 'Free Education', 'Class 3-12', 'AI Verification', 'Doubt Clarification', 'CBSE', 'ICSE', 'NCERT'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
