import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'SneakerDrop — The Art of the Drop',
  description:
    'Discover sneakers that define individuality. Limited releases. Iconic silhouettes. Uncompromising luxury streetwear style.',
  keywords: ['sneakers', 'streetwear', 'limited edition', 'exclusive drop', 'hype kicks', 'luxury sneaker'],
  openGraph: {
    title: 'SneakerDrop — The Art of the Drop',
    description: 'Discover sneakers that define individuality. Limited releases. Iconic silhouettes.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} dark`}>
      <body className="min-h-screen bg-[#111111] text-[#F5F3EE] font-[family-name:var(--font-inter)] antialiased selection:bg-[#D7FF45]/20 selection:text-[#D7FF45]">
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#202020',
              border: '1px solid #333333',
              color: '#F5F3EE',
              borderRadius: '0.75rem',
            },
          }}
        />
      </body>
    </html>
  );
}
