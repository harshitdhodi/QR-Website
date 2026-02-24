'use client';

import { QrCode, FileText, MapPin, Phone, CheckCircle2 } from 'lucide-react';

const whyChooseSteps = [
  {
    icon: QrCode,
    title: "QR Scanned",
    description:
      "Category-specific landing page loads instantly. Scanner sees: 'You are trying to contact the owner.'",
    status: "+ Landing shown",
  },
  {
    icon: FileText,
    title: "Fill Dynamic Form",
    description:
      "Category-based fields appear (e.g., vehicle: parking issue). Reason dropdown dynamically loaded.",
    status: "+ Form submitted",
  },
  {
    icon: MapPin,
    title: "Auto Location Captured",
    description:
      "GPS or IP-based location auto-fetched. Scan rate limiting prevents repeated abuse.",
    status: "+ Location logged",
  },
  {
    icon: Phone,
    title: "Contact Options Shown",
    description:
      "Masked call, WhatsApp, or SMS options presented. Call hidden if DND is enabled.",
    status: "+ Contact ready",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-black text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Secure • Private • Instant — The smartest way to connect without exposing personal details.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/30 via-cyan-600/20 to-transparent md:translate-x-[-50%]" />

          <div className="space-y-12 md:space-y-16 relative">
            {whyChooseSteps.map((step, index) => (
              <div
                key={index}
                className={`
                  relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10
                  ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end md:pl-0 md:pr-[calc(50%+2.5rem)]'}
                `}
              >
                {/* Card */}
                <div
                  className={`
                    flex-1 w-full md:w-[calc(50%-2rem)] 
                    p-6 rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-sm
                    hover:border-cyan-600/40 hover:bg-gray-900/80 transition-all duration-300
                    shadow-lg shadow-black/40 hover:shadow-cyan-900/20
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600/20 to-cyan-900/10 border border-cyan-500/30 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-cyan-400" strokeWidth={2} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-300 text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Status tag */}
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/60 border border-cyan-800/40 rounded-full text-sm text-cyan-300">
                    <CheckCircle2 className="w-4 h-4" />
                    {step.status}
                  </div>
                </div>

                {/* Circle connector on line (desktop) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-950 border-4 border-cyan-600 shadow-lg shadow-cyan-900/30 z-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}