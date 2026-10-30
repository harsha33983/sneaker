import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Nova 01 · Run light',
  description: 'A 198 g road-running shoe with a glowing foam midsole. One piece of foam, tuned to give back more than you put in.',
};

export const viewport: Viewport = {
  themeColor: '#010101',
};

export default function NovaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

