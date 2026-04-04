// app/(site)/layout.tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';


export const metadata = {
    title: 'odokho',
    description: 'your everyday solution ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="font-dm-sans">
            <Header />
            <main className="min-h-[40vh] w-full overflow-x-hidden">{children}</main>
            <Footer />
        </div>
    );
}