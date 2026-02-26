'use client';

import { useEffect, useRef, useState } from 'react';
import { QrCode, FileText, MapPin, Phone, CheckCircle2 } from 'lucide-react';

const whyChooseSteps = [
  {
    icon: QrCode,
    title: "QR Scanned",
    description: "Category-specific landing page loads instantly. Scanner sees: 'You are trying to contact the owner.'",
    status: "+ Landing shown",
  },
  {
    icon: FileText,
    title: "Fill Dynamic Form",
    description: "Category-based fields appear (e.g., vehicle: parking issue). Reason dropdown dynamically loaded.",
    status: "+ Form submitted",
  },
  {
    icon: MapPin,
    title: "Auto Location Captured",
    description: "GPS or IP-based location auto-fetched. Scan rate limiting prevents repeated abuse.",
    status: "+ Location logged",
  },
  {
    icon: Phone,
    title: "Contact Options Shown",
    description: "Masked call, WhatsApp, or SMS options presented. Call hidden if DND is enabled.",
    status: "+ Contact ready",
  },
];

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
  const timelineRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(timelineRef as React.RefObject<HTMLElement>);

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-home-one-gradient-banner text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <HeaderBlock />

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
            {whyChooseSteps.map((step, index) => (
              <StepCard key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeaderBlock() {
  const { ref, inView } = useInView(0.3);
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
       How it <span className='text-blue-900'>work</span>
      </h2>
      <p className="text-lg text-gray-400 max-w-3xl mx-auto">
        Secure • Private • Instant — The smartest way to connect without exposing personal details.
      </p>
    </div>
  );
}

function StepCard({ step, index }: { step: typeof whyChooseSteps[0]; index: number }) {
  const { ref, inView } = useInView(0.3);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-center ${isEven ? 'md:justify-start' : 'md:justify-end'}`}
    >
      {/* Card with AOS-style animation */}
      <div
        className="w-full md:w-[calc(48%-1rem)] p-6 rounded-2xl border bg-gray-100/60 dark:bg-gray-900/60 border-gray-100/40 dark:border-gray-700/40 hover:bg-gray-200/80 dark:hover:bg-gray-800/80 transition-all duration-300 shadow-md shadow-blue-900/70 hover:shadow-blue-900/20"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView
            ? 'translateX(0) scale(1)'
            : `translateX(${isEven ? '-40px' : '40px'}) scale(0.96)`,
          transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
        }}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-900/10 dark:from-blue-400/20 dark:to-blue-600/10 border border-gray-500/30 dark:border-blue-500/30 flex items-center justify-center"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-20deg)',
              transition: `opacity 0.5s ease ${index * 0.1 + 0.2}s, transform 0.5s ease ${index * 0.1 + 0.2}s`,
            }}
          >
            <step.icon className="w-6 h-6 text-gray-900 dark:text-blue-400" strokeWidth={2} />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">{step.description}</p>
          </div>
        </div>

        {/* Status tag */}
        <div
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950/60 dark:bg-blue-900/60 border border-blue-800/40 dark:border-blue-700/40 rounded-full text-sm text-white dark:text-blue-300"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(10px)',
            transition: `opacity 0.5s ease ${index * 0.1 + 0.35}s, transform 0.5s ease ${index * 0.1 + 0.35}s`,
          }}
        >
          <CheckCircle2 className="w-4 h-4" />
          {step.status}
        </div>
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