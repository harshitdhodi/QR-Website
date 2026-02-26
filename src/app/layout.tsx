// app/layout.tsx
import './globals.css';
import { Sora, DM_Sans } from 'next/font/google';
import AOSWrapper from "@/components/layout/AOSWrapper";
import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper';

import { CartProvider } from '@/components/providers/CartProvider';

// Define a secondary font for headings
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
});

// Define a font for your primary body text
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata = {
  title: 'Exsit Next',
  description: 'Modern Next.js app with Tailwind + TypeScript + SCSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
      <body>
        <SessionProviderWrapper>
          <CartProvider>
            <AOSWrapper />
            {children}
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}