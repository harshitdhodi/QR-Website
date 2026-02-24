"use client";
import { blogPosts } from "@/const/blogData";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTitle3 from '@/components/ui/PageTitle3';
import videoTestimonials from "@/data/video-testimonials.json";
import HeroOne from "@/components/layout/Heroone";
import FeatureCard from "@/components/ui/FeatureCard4";
import ContactPage from "./(site)/contact/page";
import Link from "next/link";
import WhyChooseUs from "@/components/WhyChooseUs";
import BlogCardThree from "@/components/ui/BlogCardThree";
import Button from "@/components/ui/Button";
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
    const bottomPosts = blogPosts.filter((post) => !post.featured).slice(0, 3);
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
            
            {/* why choose us */}
             <WhyChooseUs />    
            {/* category cards */}
            <div id="features" className="counter-wrap lg:pb-24 pb-12 font-dm bg-home-one-gradient-banner relative lg:py-24 py-20">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-4">
                    <PageTitle3
                        badgeText=""
                        title="Shop by Category"
                        subtitle="Select a category to find the perfect QR solution for your needs."
                        widthClass="xl:w-7/12 lg:w-2/3 mx-auto"
                        alignment="center"
                        padding="pb-16"
                        textColor=""
                    />

                    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 md:gap-8">
                        <Link href="/cart?category=Vehicle" className="w-full block">
                            <FeatureCard
                                title="Vehicle"
                                description="Secure QR tags for cars and bikes to manage parking and safety."
                                delay={100}
                                bgColor="bg-blue-500"           // fallback if image fails
                                layout="centered"
                                imageUrl="https://ik.imagekit.io/mikbqwyy0/ChatGPT%20Image%20Feb%2021,%202026,%2011_01_12%20AM.png"
                            />
                        </Link>

                        <Link href="/cart?category=Pets" className="w-full block">
                            <FeatureCard
                                title="Pets"
                                description="Smart tags to ensure your furry friends can always be identified."
                                delay={200}
                                bgColor="bg-cyan-500"
                                layout="centered"
                                imageUrl="https://ik.imagekit.io/mikbqwyy0/ChatGPT%20Image%20Feb%2021,%202026,%2011_13_29%20AM.png"
                            />
                        </Link>

                        <Link href="/cart?category=Miscellaneous" className="w-full block">
                            <FeatureCard
                                title="Miscellaneous"
                                description="Versatile QR stickers for keys, luggage, laptops, and more."
                                delay={300}
                                bgColor="bg-indigo-500"
                                layout="centered"
                                imageUrl="https://ik.imagekit.io/mikbqwyy0/ChatGPT%20Image%20Feb%2021,%202026,%2011_13_32%20AM.png"
                            />
                        </Link>
                    </div>
                </div>
            </div>

           


            {/* cta wrap */}
            <section id="contact">
                <ContactPage />
            </section>
            <section className="blog-wrap lg:py-24 py-12">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 pb-0 lg:py-4 py-0">
                    <div className="flex flex-wrap justify-between pb-16 gap-y-4">
                        <PageTitle3
                            badgeText=""
                            title="Stay informed with our latest blog entries"
                            subtitle="New blog articles, insights, and updates here."
                            widthClass="w-full xl:w-5/12 lg:w-7/12"
                            alignment="start"
                            padding="pb-0"
                        />
                        <div className="lg:text-right mt-auto">
                            <Button href="/blog-1" label="Check out for more blog" bgColor="bg-blue-600" textColor="text-white" />
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
                        {bottomPosts.map((post) => <BlogCardThree key={post.id} post={post} />)}
                    </div>
                </div>
            </section>
            {/* <CtaSection /> */}
            {/* footer */}
            <Footer />
        </>
    );
}
