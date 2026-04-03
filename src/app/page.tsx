"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroOne from "@/components/layout/Heroone";
import ContactPage from "./(site)/contact/page";
import WhyChooseUs from "@/components/WhyChooseUs";
import WhyChooseUs2 from "@/components/WhyChooseUs2";
import CategorySection from "@/components/layout/CategorySection";
import FaqSection from "@/components/layout/FaqSection";
import BlogSection from "@/components/layout/BlogSection";
import GoogleReviewSection from "@/components/layout/GoogleReviewSection";

export default function HomePage() {

    return (
        <>
            {/* Header */}
            <Header />
            {/* Hero */}
            <section id="home">
                <HeroOne />
            </section>
            {/* features (How it works) */}
            <section id="features">
                <WhyChooseUs2 />
            </section>

            {/* services (Why choose us) */}
            <section id="services">
                <WhyChooseUs />
            </section>
            <CategorySection />

            <GoogleReviewSection />

            {/* dynamic category section */}

            {/* FAQ section */}
            <FaqSection />

            {/* cta wrap */}
            <section id="contact">
                <ContactPage />
            </section>

            {/* dynamic blog section */}
            {/* <BlogSection /> */}

            {/* footer */}
            <Footer />
        </>
    );
}
