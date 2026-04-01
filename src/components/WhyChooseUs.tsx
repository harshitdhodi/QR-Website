'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const GradientDefs = () => (
  <svg width="0" height="0">
    <defs>
      <linearGradient id="blueToBlackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#477fee" />
        <stop offset="100%" stopColor="#174dd4" />
      </linearGradient>
    </defs>
  </svg>
);

interface WhyChooseUsItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface SectionData {
  tag_line?: string;
  parent_title?: string;
  parent_subtitle?: string;
  [key: string]: unknown;
}

export default function Home() {
  const [whyChooseUsData, setWhyChooseUsData] = useState<WhyChooseUsItem[]>([]);
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWhyChooseUs = async () => {
      try {
        // Fetch section data
        const sectionRes = await fetch('/api/feature-sections?section_name=why_choose_us');
        if (sectionRes.ok) {
          const sData = await sectionRes.json();
          setSectionData(sData);
        }

        const response = await fetch(`/api/why-choose-us`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();


        // Filter active items and sort by sort_order
        const activeItems = Array.isArray(data)
          ? data.filter((item: WhyChooseUsItem) => item.is_active).sort((a: WhyChooseUsItem, b: WhyChooseUsItem) => a.sort_order - b.sort_order)
          : [];

        setWhyChooseUsData(activeItems);
      } catch (err) {
        console.error('Error fetching why choose us data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchWhyChooseUs();
  }, []);

  // Fallback data when API fails or loading
  const fallbackData = [
    {
      id: "1",
      image: "/images/feature-1.svg",
      title: "Smart QR Codes",
      subtitle: "Category-wise QR designs for vehicles, pets & miscellaneous assets with unique 6-digit codes.",
      is_active: true,
      sort_order: 0,
      created_at: "",
      updated_at: ""
    },
    {
      id: "2",
      image: "/images/feature-2.svg",
      title: "Masked Calling",
      subtitle: "Privacy-first communication — real phone numbers are never exposed to scanners.",
      is_active: true,
      sort_order: 1,
      created_at: "",
      updated_at: ""
    },
    {
      id: "3",
      image: "/images/feature-3.svg",
      title: "DND Controls",
      subtitle: "Time-based Do Not Disturb per asset. Hide calling options while keeping WhatsApp/SMS available.",
      is_active: true,
      sort_order: 2,
      created_at: "",
      updated_at: ""
    },
    {
      id: "4",
      image: "/images/feature-4.svg",
      title: "Emergency Alerts",
      subtitle: "OTP-verified emergency flow with instant SMS to all emergency contacts with location.",
      is_active: true,
      sort_order: 3,
      created_at: "",
      updated_at: ""
    },
    {
      id: "5",
      image: "/images/icon-1.png",
      title: "Lifetime Validity",
      subtitle: "QR codes remain valid forever with unlimited scans. No expiration dates or renewal needed.",
      is_active: true,
      sort_order: 4,
      created_at: "",
      updated_at: ""
    },
    {
      id: "6",
      image: "/images/icon-2.png",
      title: "Multi-Asset Profiles",
      subtitle: "One profile, unlimited assets. Manage all your vehicles, pets & items from a single dashboard.",
      is_active: true,
      sort_order: 5,
      created_at: "",
      updated_at: ""
    }
  ];

  const displayData = whyChooseUsData.length > 0 ? whyChooseUsData : fallbackData;

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <GradientDefs />
        <section id="why_choose_us" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <div className="text-gray-600">Loading...</div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    console.error('Why choose us error:', error);
    // Still render with fallback data
  }

  return (
    <main className="bg-gradient-to-b from-background to-muted/20">
      <GradientDefs />

      <section id="why_choose_us" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header – made more compact */}
          {(() => {
            const title = sectionData?.parent_title || "Why Choose Us";
            const subtitle = sectionData?.parent_subtitle || "Everything you need for secure, privacy-first QR code communication.";

            // split title to get the last word
            const words = title.trim().split(' ');
            const lastWord = words.length > 1 ? words.pop() : '';
            const firstPart = words.join(' ');

            return (
              <div className="text-center mb-10 md:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-3">
                  {firstPart} <span className="text-blue-900">{lastWord}</span>
                </h1>
                <p className="text-black md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  {subtitle}
                </p>
              </div>
            );
          })()}

          {/* Features Grid – constrained height on larger screens */}
          {/* Features Grid – removed height constraints and overflow hidden */}
          <div className="
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
            gap-5 sm:gap-6 lg:gap-7 
            pb-8
          ">
            {displayData.map((feature, index) => (
              <div
                key={feature.id}
                className={`
      group relative flex flex-col items-center gap-4 p-5 sm:p-6 
      bg-white dark:bg-gray-950 
      border border-gray-200 dark:border-gray-800 
      rounded-2xl 
      shadow-md shadow-blue-500/10 
      transition-all duration-500 ease-out
      hover:shadow-2xl hover:shadow-blue-500/25
      hover:-translate-y-3
      hover:scale-[1.02]
      hover:bg-gradient-to-br hover:from-white hover:to-blue-50/50
      dark:hover:from-gray-950 dark:hover:to-blue-950/30
      overflow-hidden
    `}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="500"
              >
                {/* Animated background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                {/* Dynamic Image with enhanced hover */}
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0 z-10">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-gray-100 dark:from-blue-900 dark:to-purple-900 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110" />
                  <Image
                    src={feature.image}
                    alt={`${feature.title} icon`}
                    fill
                    className="object-contain rounded-full border-2 border-gray-200 dark:border-gray-800 group-hover:border-blue-400 dark:group-hover:border-blue-600 transition-all duration-500 relative z-10 p-2 group-hover:scale-110 group-hover:rotate-3"
                    sizes="80px"
                  />
                </div>

                {/* Text with enhanced hover effects */}
                <div className="flex flex-col items-center text-center flex-grow pt-1 z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed px-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {feature.subtitle}
                  </p>
                </div>

                {/* Subtle glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10" />

                {/* Optional: small CTA with hover effect */}
                <div className="z-10">
                  <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    Learn more →
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}