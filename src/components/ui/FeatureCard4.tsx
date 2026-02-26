"use client";
import React from "react";
import Image from "next/image"; // ← make sure to import this

interface FeatureCardProps {
  icon?: React.ReactNode;           // optional fallback SVG icon
  title: string;
  description: string;
  delay?: number;
  bgColor?: string;
  layout?: "default" | "centered";
  imageUrl?: string;                // ← now used as main icon image
}

export default function FeatureCard({
  icon,
  title,
  description,
  delay = 100,
  bgColor = "bg-blue-500",
  layout = "default",
  imageUrl,
}: FeatureCardProps) {
  if (layout === "centered") {
    return (
      <div
        className={`
          flex flex-col items-center gap-5 lg:p-3 p-3 bg-white 
          hover:shadow-xl shadow-xl shadow-blue-500/30 rounded-2xl border border-gray-200 
          transition-all duration-300 hover:-translate-y-1
          min-h-[360px] justify-between
        `}
        data-aos="zoom-in"
        data-aos-delay={delay}
        data-aos-duration="500"
      >
        {/* Main Icon – using your image if provided, else fallback SVG */}
        <div className="relative w-24 h-24 rounded-full shadow-md mx-auto mt-2 ">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${title} icon`}
              fill
              className="object-contain "
              priority={false}
              // sizes="(max-width: 768px) 120px, 128px"
            />
          ) : (
            <div
              className={`w-full h-full rounded-full flex items-center justify-center ${bgColor}`}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col items-center text-center">
          <h3 className="text-gray-900 text-3xl font-bold mb-3">{title}</h3>
          <p className="text-gray-700 text-lg leading-relaxed px-4 max-w-xs">
            {description}
          </p>
        </div>

        {/* Buy Now Button */}
        <div className=" w-fit pb-2">
          <button
            className={`
              w-full   py-1 px-4 
              hover:bg-white hover:border-2 hover:border-blue-900 text-gray-50 
              font-semibold text-md bg-blue-900 text-white rounded-md shadow-md
              transition-all duration-300 hover:shadow-lg cursor-pointer hover:text-blue-900 hover:bg-blue-800 active:scale-98
            `}
          >
            Buy Now →
          </button>
        </div>
      </div>
    );
  }

  // Default layout (fallback – you can remove if not needed)
  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${bgColor}`}>
        {icon}
      </div>
      <h3 className="text-gray-900 text-xl font-semibold">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}