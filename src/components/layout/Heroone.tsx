"use client";
import { useState, useEffect } from "react";
import { Boxes } from "lucide-react";
import Button from "../ui/Button";
import Image from "next/image";
import TopCarousel from "../ui/TopCarousel";
import img from "/public/images/right-banner-bg.webp";
import a1 from "/public/images/avater-11.webp";
import a2 from "/public/images/avater-12.webp";
import a3 from "/public/images/avater-13.webp";
import shap from "/public/images/shap1.webp";

interface HeroContent {
  badge?: string;
  title?: string;
  subtitle?: string;
  primary_button_text?: string;
  primary_button_href?: string;
  secondary_button_text?: string;
  secondary_button_href?: string;
  stats_text?: string;
  stats_subtext?: string;
  carousel_items?: string;
  avatar1_url?: string;
  avatar2_url?: string;
  avatar3_url?: string;
  main_image_url?: string;
  decorative_image_url?: string;
  floating_icon_type?: string;
}

export default function HeroOne() {
  const [heroData, setHeroData] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await fetch(`/api/hero-content`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        // Data comes as an array, take the first item
        if (Array.isArray(data) && data.length > 0) {
          setHeroData(data[0]);
        }
      } catch (err) {
        console.error('Error fetching hero content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  // Fallback content when API fails or loading
  const fallbackContent = {
    badge: "Online program is now available",
    title: "Empowering <span className='text-blue-900'>Superior</span> results by thinking",
    subtitle: "When you join our journey, you are choosing a partner who believes in a healthier, more balanced you — and works tirelessly to help you get there.",
    primary_button_text: "Start trial for 14 days",
    primary_button_href: "/pricing",
    secondary_button_text: "Explore more",
    secondary_button_href: "/about",
    stats_text: "7.65m+",
    stats_subtext: "Content Creators and Teams",
    carousel_items: '["Affordable2 & scalable plans", "Plans that fit every stage", "Built to scale with your needs"]',
    avatar1_url: "/public/images/avater-11.webp",
    avatar2_url: "/public/images/avater-12.webp", 
    avatar3_url: "/public/images/avater-13.webp",
    main_image_url: "/public/images/right-banner-bg.webp",
    decorative_image_url: "/images/text-icon.png",
    floating_icon_type: "boxes"
  };

  const content = heroData || fallbackContent;

  // Parse carousel items from string to array
  const carouselItems = content.carousel_items 
    ? JSON.parse(content.carousel_items)
    : ["Affordable & scalable plans", "Plans that fit every stage", "Built to scale with your needs"];

  if (loading) {
    return (
      <div className="banner-wrap lg:pb-24 pb-12 font-dm bg-home-one-gradient-banner relative pt-24">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 pb-0">
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Hero content error:', error);
    // Still render with fallback content
  }

  return (
    <div className="banner-wrap lg:pb-24 pb-12 font-dm bg-home-one-gradient-banner relative pt-24">
      <Image src={shap} alt="shape" className="object-cover absolute top-0 left-0 object-center opacity-20" />
      <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 pb-0">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-10 lg:pt-10 relative z-10">
          {/* left side */}
          <div className="w-full items-center flex h-full xl:pr-8">
            <div className="flex flex-col">
              {/* Badge */}
              <div>
                <span className="inline-block py-2 px-3 rounded-full border border-gray-200 bg-white text-sm text-blue-600 font-medium aos-init aos-animate" data-aos="fade-up" data-aos-duration="200">
                  {content.badge}
                </span>
              </div>

              {/* Heading */}
              <h1 
                className="text-gray-900 font-semibold xl:text-[80px] lg:text-6xl text-5xl mt-2 mb-3 tracking-tighter aos-init aos-animate" 
                data-aos="fade-up" 
                data-aos-duration="400"
                dangerouslySetInnerHTML={{ __html: content.title || fallbackContent.title }}
              />
              <p className="font-medium text-gray-900 max-w-xl lg:pr-10 text-lg aos-init aos-animate" data-aos="fade-up" data-aos-duration="500">
                {content.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-8 pb-3">
                <Button 
                 href={content.primary_button_href?.startsWith('/') 
  ? content.primary_button_href 
  : `/${content.primary_button_href}` || fallbackContent.primary_button_href}
 
                  label={content.primary_button_text || fallbackContent.primary_button_text} 
                  bgColor="bg-blue-900" 
                  textColor="text-white" 
                  padding="py-4 px-6" 
                />
                <Button 
                  href={content.secondary_button_href || fallbackContent.secondary_button_href} 
                  label={content.secondary_button_text || fallbackContent.secondary_button_text} 
                  bgColor="bg-gray-900" 
                  textColor="text-gray-100" 
                  padding="py-4 px-6" 
                />
              </div>

              {/* Decorative Image */}
              <div data-aos="zoom-in" data-aos-duration="300" className="aos-init aos-animate">
                <Image 
                  src={content.decorative_image_url || fallbackContent.decorative_image_url} 
                  alt="text" 
                  className="relative left-5" 
                  width={299} 
                  height={70} 
                  loading="eager" 
                />
              </div>
            </div>
          </div>

          {/* right side */}
          <div className="w-full">
            <div className="relative rounded-xl lg:overflow-visible overflow-hidden aos-init aos-animate" data-aos="fade-up" data-aos-duration="600">
              {/* Main Image */}
              <Image 
                src={content.main_image_url || img} 
                alt="banner" 
                decoding="async" 
                loading="eager" 
                width={637} 
                height={721} 
                className="w-full rounded-xl" 
                priority 
              />

              {/* Floating Icon */}
              <div className="absolute top-16 left-0 -translate-x-1/2 hidden lg:flex">
                <div className="w-16 h-16 rounded-xl bg-lime-300 flex items-center justify-center text-center">
                  <Boxes size={34} strokeWidth="1.5" />
                </div>
              </div>

              {/* Avatar Group */}
              <div className="absolute top-4 -right-8 bg-white rounded-xl border border-gray-200 shadow-sm p-3 gap-4 mt-4 hidden lg:flex flex-row items-center aos-init aos-animate" data-aos="fade-up" data-aos-duration="400" data-delay="400">
                <div className="flex -space-x-4">
                  <Image
                    src={content.avatar1_url || a1}
                    width={48}
                    height={48}
                    alt="member-avatar"
                    className="w-11 h-11 rounded-full"
                    loading="lazy"
                  />
                  <Image
                    src={content.avatar2_url || a2}
                    width={48}
                    height={48}
                    alt="member-avatar"
                    className="w-11 h-11 rounded-full"
                    loading="lazy"
                  />
                  <Image
                    src={content.avatar3_url || a3}
                    width={48}
                    height={48}
                    alt="member-avatar"
                    className="w-11 h-11 rounded-full"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col leading-tight text-gray-900 font-semibold text-2xl">
                  {content.stats_text || fallbackContent.stats_text} 
                  <span className="block text-base font-medium text-gray-800">
                    {content.stats_subtext || fallbackContent.stats_subtext}
                  </span>
                </div>
              </div>

              {/* topslider */}
              <TopCarousel
                items={carouselItems}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}