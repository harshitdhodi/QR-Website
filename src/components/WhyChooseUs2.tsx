'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface HowItWorksItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  tagline: string;
  is_active: boolean;
  sort_order: number;
  updated_at: string;
}

interface SectionData {
  tag_line?: string;
  parent_title?: string;
  parent_subtitle?: string;
  [key: string]: unknown;
}

export default function WhyChooseUs2() {
  const [howItWorksData, setHowItWorksData] = useState<HowItWorksItem[]>([]);
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHowItWorks = async () => {
      try {
        // Fetch section data
        const sectionRes = await fetch('/api/feature-sections?section_name=how_it_work');
        if (sectionRes.ok) {
          const sData = await sectionRes.json();
          setSectionData(sData);
        }

        const response = await fetch(`/api/how-it-works`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();


        // Filter active items and sort by sort_order
        const activeItems = Array.isArray(data)
          ? data.filter((item: HowItWorksItem) => item.is_active).sort((a: HowItWorksItem, b: HowItWorksItem) => a.sort_order - b.sort_order)
          : [];

        setHowItWorksData(activeItems);
      } catch (err) {
        console.error('Error fetching how it works data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchHowItWorks();
  }, []);

  // Fallback data when API fails or loading
  const fallbackData = [
    {
      id: "1",
      image: "/images/icon-3.png",
      title: "QR Scanned",
      subtitle: "Category-specific landing page loads instantly. Scanner sees: 'You are trying to contact the owner.'",
      tagline: "+ Landing shown",
      is_active: true,
      sort_order: 0,
      created_at: "",
      updated_at: ""
    },
    {
      id: "2",
      image: "/images/icon-4.png",
      title: "Fill Dynamic Form",
      subtitle: "Category-based fields appear (e.g., vehicle: parking issue). Reason dropdown dynamically loaded.",
      tagline: "+ Form submitted",
      is_active: true,
      sort_order: 1,
      created_at: "",
      updated_at: ""
    },
    {
      id: "3",
      image: "/images/text-icon-2.png",
      title: "Auto Location Captured",
      subtitle: "GPS or IP-based location auto-fetched. Scan rate limiting prevents repeated abuse.",
      tagline: "+ Location logged",
      is_active: true,
      sort_order: 2,
      created_at: "",
      updated_at: ""
    },
    {
      id: "4",
      image: "/images/text-icon-3.png",
      title: "Contact Options Shown",
      subtitle: "Masked call, WhatsApp, or SMS options presented. Call hidden if DND is enabled.",
      tagline: "+ Contact ready",
      is_active: true,
      sort_order: 3,
      created_at: "",
      updated_at: ""
    }
  ];

  const displayData = howItWorksData.length > 0 ? howItWorksData : fallbackData;

  if (loading) {
    return (
      <section id="how_it_work" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-home-one-gradient-banner text-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="text-gray-600">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('How it works error:', error);
    // Still render with fallback data
  }

  const title = sectionData?.parent_title || 'How it work';
  const subtitle =
    sectionData?.parent_subtitle ||
    'Secure • Private • Instant — The smartest way to connect without exposing personal details.';
  const words = title.trim().split(' ');
  const lastWord = words.length > 1 ? words.pop() : '';
  const firstPart = words.join(' ');

  return (
    <section id="how_it_work" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-home-one-gradient-banner text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16" data-aos="fade-up" data-aos-duration="300">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4">
            {firstPart} <span className="text-brand-primary">{lastWord}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {displayData.map((step, index) => (
            <div
              key={step.id}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              data-aos-duration="350"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl border border-brand-secondary/50 flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <Image src={step.image} alt={step.title} width={24} height={24} className="w-6 h-6 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 mt-2 leading-7">{step.subtitle}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    {step.tagline}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
