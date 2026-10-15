import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Flintzy — Never Publish Something Broken | Social Media Scheduler',
  description:
    'Flintzy gives solo creators and agency social teams unified multi-channel publishing with proactive pre-flight checks, instant failure recovery, and zero platform limit surprises.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
