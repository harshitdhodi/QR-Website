'use client';

import { useEffect, useRef, useState } from 'react';
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

function useScrollProgress(ref: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // progress from 0 → 1 as the container scrolls through viewport
      const total = rect.height + windowH;
      const filled = windowH - rect.top;
      const pct = Math.min(Math.max(filled / total, 0), 1);
      setProgress(pct);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);

  return progress;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function WhyChooseUs2() {
  const [howItWorksData, setHowItWorksData] = useState<HowItWorksItem[]>([]);
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(timelineRef as React.RefObject<HTMLElement>);

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
        console.log(data);

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

  return (
    <section id="how_it_work" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-home-one-gradient-banner text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <HeaderBlock sectionData={sectionData} />

        {/* Vertical Timeline */}
        <div ref={timelineRef} className="relative max-w-3xl mx-auto">
          {/* Background (faint) line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300/30 md:-translate-x-1/2" />

          {/* Animated progress line */}
          <div
            className="absolute left-8 md:left-1/2 top-0 w-0.5 md:-translate-x-1/2 origin-top transition-none"
            style={{
              height: `${progress * 100}%`,
              background: 'linear-gradient(to bottom, #3b82f6, #1d4ed8, #1e40af88)',
              boxShadow: '0 0 8px 2px #3b82f680',
              transition: 'height 0.1s linear',
            }}
          />

          <div className="space-y-12 md:space-y-20 relative">
            {displayData.map((step, index) => (
              <StepCard key={step.id} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeaderBlock({ sectionData }: { sectionData?: SectionData | null }) {
  const { ref, inView } = useInView(0.3);

  const title = sectionData?.parent_title || "How it work";
  const subtitle = sectionData?.parent_subtitle || "Secure • Private • Instant — The smartest way to connect without exposing personal details.";

  // split title to get the last word
  const words = title.trim().split(' ');
  const lastWord = words.length > 1 ? words.pop() : '';
  const firstPart = words.join(' ');

  return (
    <div
      ref={ref}
      className="text-center mb-12 md:mb-16 transition-all duration-700"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
      }}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4">
        {firstPart} <span className="text-blue-900">{lastWord}</span>
      </h2>
      <p className="text-lg text-gray-400 max-w-3xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}

function StepCard({ step, index }: { step: HowItWorksItem; index: number }) {
  const { ref, inView } = useInView(0.3);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-center ${isEven ? 'md:justify-start' : 'md:justify-end'}`}
    >
      {/* Card with enhanced hover animation */}
      <div
        className={`
          group relative w-full md:w-[calc(48%-1rem)] p-6 rounded-2xl 
          border bg-gray-100/60 dark:bg-gray-900/60 
          border-gray-100/40 dark:border-gray-700/40 
          shadow-md shadow-blue-900/70 
          transition-all duration-500 ease-out
          hover:shadow-2xl hover:shadow-blue-900/25
          hover:bg-gray-200/80 dark:hover:bg-gray-800/80
          hover:-translate-y-3
          hover:scale-[1.02]
          hover:bg-gradient-to-br hover:from-gray-200/80 hover:to-blue-50/50
          dark:hover:from-gray-800/80 dark:hover:to-blue-950/30
          overflow-hidden
        `}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView
            ? 'translateX(0) scale(1)'
            : `translateX(${isEven ? '-40px' : '40px'}) scale(0.96)`,
          transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
        }}
      >
        {/* Animated background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

        <div className="flex items-start gap-4 relative z-10">
          {/* Dynamic Image with enhanced hover */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-900/10 dark:from-blue-400/20 dark:to-blue-600/10 border border-gray-500/30 dark:border-blue-500/30 flex items-center justify-center overflow-hidden relative"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-20deg)',
              transition: `opacity 0.5s ease ${index * 0.1 + 0.2}s, transform 0.5s ease ${index * 0.1 + 0.2}s`,
            }}
          >
            {/* Hover background for image */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-100 to-gray-100 dark:from-blue-900 dark:to-purple-900 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110" />
            <Image
              src={step.image}
              alt={step.title}
              width={24}
              height={24}
              className="w-7 h-7 object-contain rounded-lg transition-all duration-500 relative z-10 group-hover:scale-110 group-hover:rotate-3"
            />
          </div>

          <div className="flex-1 relative z-10">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors duration-300">
              {step.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              {step.subtitle}
            </p>
          </div>
        </div>

        {/* Status tag with enhanced hover */}
        <div
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-900 dark:bg-blue-900 border border-blue-800/40 dark:border-blue-700/40 rounded-full text-sm text-white dark:text-blue-300 relative z-10 group-hover:bg-blue-800 dark:group-hover:bg-blue-800 transition-all duration-300"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(10px)',
            transition: `opacity 0.5s ease ${index * 0.1 + 0.35}s, transform 0.5s ease ${index * 0.1 + 0.35}s`,
          }}
        >
          <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
          {step.tagline}
        </div>

        {/* Subtle glow effect on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10" />
      </div>

      {/* Dot on the line — pulses when in view */}
      <div
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gray-800 dark:bg-gray-950 border-4 border-blue-500 dark:border-blue-400 shadow-lg z-10"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'scale(1)' : 'scale(0)',
          transition: `opacity 0.4s ease ${index * 0.1 + 0.15}s, transform 0.4s ease ${index * 0.1 + 0.15}s`,
          boxShadow: inView ? '0 0 12px 3px #3b82f680' : 'none',
        }}
      />

      {/* Pulse ring on dot */}
      {inView && (
        <div
          className="hidden md:block absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-blue-400 dark:border-blue-300 z-10 animate-ping opacity-40"
        />
      )}
    </div>
  );
}
