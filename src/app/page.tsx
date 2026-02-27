"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import videoTestimonials from "@/data/video-testimonials.json";
import HeroOne from "@/components/layout/Heroone";
import ContactPage from "./(site)/contact/page";
import WhyChooseUs from "@/components/WhyChooseUs";
import WhyChooseUs2 from "@/components/WhyChooseUs2";
import CategorySection from "@/components/layout/CategorySection";
import FaqSection from "@/components/layout/FaqSection";
import BlogSection from "@/components/layout/BlogSection";

// Helper to get video ID from YouTube URL
const getYouTubeVideoId = (url: string) => {
    let videoId = '';
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.substring(1).split('?')[0];
        } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            videoId = urlObj.searchParams.get('v') || '';
        }
    } catch (e) {
        console.error("Invalid URL", e);
    }
    return videoId;
};


export default function HomePage() {
    const [singleVideo, ...carouselVideos] = videoTestimonials;

    const singleVideoId = getYouTubeVideoId(singleVideo.src);
    const singleVideoEmbedUrl = `https://www.youtube.com/embed/${singleVideoId}`;

    return (
        <>
            {/* Header */}
            <Header />
            {/* Hero */}
            <section id="home">
                <HeroOne />
            </section>
            <WhyChooseUs2 />
            {/* why choose us */}
            <WhyChooseUs />

            {/* dynamic category section */}
            <CategorySection />

            {/* FAQ section */}
            <FaqSection />

            {/* cta wrap */}
            <section id="contact">
                <ContactPage />
            </section>

            {/* dynamic blog section */}
            <BlogSection />

            {/* footer */}
            <Footer />
        </>
    );
}
