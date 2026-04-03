// app/(site)/layout.tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';


export const metadata = {
    title: 'Exsit Next',
    description: 'Modern Next.js app with Tailwind + TypeScript + SCSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='font-dm-sans'>
            <Header />
            {children}
            {/* <CtaSection /> */}
            <Footer />
        </div>
    );
}