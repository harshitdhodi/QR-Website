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
  title: 'Secure QR Code Contact System | Private & Smart QR Communication',
  description: 'Connect instantly with privacy-first QR codes. Enable masked calling, WhatsApp, and SMS without revealing personal numbers. Secure, smart, and scalable QR communication.',
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