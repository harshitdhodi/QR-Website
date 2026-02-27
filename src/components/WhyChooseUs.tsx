'use client';

import { QrCode, Shield, Bell, Phone, Clock, Users } from 'lucide-react';
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

interface Feature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  description: string;
  delay: number;
  imageUrl?: string;
}

const features: Feature[] = [
  { icon: QrCode, title: 'Smart QR Codes', description: 'Category-wise QR designs for vehicles, pets & miscellaneous assets with unique 6-digit codes.', delay: 0 },
  { icon: Shield, title: 'Masked Calling', description: 'Privacy-first communication — real phone numbers are never exposed to scanners.', delay: 100 },
  { icon: Bell, title: 'DND Controls', description: 'Time-based Do Not Disturb per asset. Hide calling options while keeping WhatsApp/SMS available.', delay: 200 },
  { icon: Phone, title: 'Emergency Alerts', description: 'OTP-verified emergency flow with instant SMS to all emergency contacts with location.', delay: 300 },
  { icon: Clock, title: 'Lifetime Validity', description: 'QR codes remain valid forever with unlimited scans. No expiration dates or renewal needed.', delay: 400 },
  { icon: Users, title: 'Multi-Asset Profiles', description: 'One profile, unlimited assets. Manage all your vehicles, pets & items from a single dashboard.', delay: 500 },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <GradientDefs />

      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header – made more compact */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-3">
              Why <span className='text-blue-900'>Choose Us</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for secure, privacy-first QR code communication.
            </p>
          </div>

          {/* Features Grid – constrained height on larger screens */}
          <div className="
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
            gap-5 sm:gap-6 lg:gap-7 
            max-h-[80vh] lg:max-h-[76vh] 
            overflow-hidden
          ">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className={`
                    flex flex-col items-center gap-4 p-5 sm:p-6 
                    bg-white dark:bg-gray-950 
                    border border-gray-200 dark:border-gray-800 
                    rounded-2xl 
                    hover:shadow-xl shadow-md shadow-blue-500/10 
                    transition-all duration-300 hover:-translate-y-1.5
                  `}
                  data-aos="fade-up"
                  data-aos-delay={feature.delay}
                  data-aos-duration="500"
                >
                  {/* Smaller icon */}
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full shadow-sm flex-shrink-0">
                    {feature.imageUrl ? (
                      <Image
                        src={feature.imageUrl}
                        alt={`${feature.title} icon`}
                        fill
                        className="object-contain rounded-full p-3"
                        sizes="80px"
                      />
                    ) : (
                      <div
                        className="
                          w-full h-full rounded-full flex items-center justify-center 
                          bg-gradient-to-br from-blue-50 to-slate-100 
                          dark:from-blue-950 dark:to-slate-900
                        "
                      >
                        <Icon
                          className="w-8 h-8 sm:w-9 sm:h-9"
                          style={{
                            fill: 'url(#blueToBlackGradient)',
                            stroke: 'url(#blueToBlackGradient)',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Text – tighter spacing, left or center aligned */}
                  <div className="flex flex-col items-center text-center flex-grow pt-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed px-1">
                      {feature.description}
                    </p>
                  </div>

                  {/* Optional: small CTA – uncomment if needed */}
                  {/* <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800">
                    Learn more →
                  </button> */}
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </main>
  );
}