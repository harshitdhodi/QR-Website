"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import type { Splide as SplideInstance } from "@splidejs/splide";
import "@splidejs/react-splide/css";
import { useState } from "react";

type Slide = {
    src: string;
    title: string;
    subtitle: string;
};

type CounterCarouselProps = {
    slides: Slide[];
};

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

export default function CounterCarousel({ slides }: CounterCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div className="relative">
            {/* Slider */}
            <Splide
                aria-label="Counter Carousel"
                options={{
                    type: "loop",
                    perPage: 1,
                    arrows: false,
                    pagination: false,
                    autoplay: false,
                    interval: 4000,
                }}
                onMoved={(_: SplideInstance, newIndex: number) =>
                    setCurrentIndex(newIndex)
                }
                className="slider-no-arrows"
            >
                {slides.map((slide, idx) => {
                    const videoId = getYouTubeVideoId(slide.src);
                    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    
                    return (
                        <SplideSlide key={idx}>
                            <div className="relative overflow-hidden rounded-xl">
                                <div className="relative w-full h-[350px]">
                                    {videoId ? (
                                        <iframe
                                            src={embedUrl}
                                            title={slide.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full"
                                        ></iframe>
                                    ) : (
                                        // Fallback for non-YouTube URLs or if ID extraction fails
                                        <div className="w-full h-full bg-black flex items-center justify-center">
                                            <p className="text-white">Invalid video source</p>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.5)_100%)]"></div>
                                {/* Content */}
                                <div className="absolute bottom-0 left-0 w-full p-5 z-20">
                                    <h3 className="text-white md:text-3xl text-2xl font-medium mb-1">
                                        {slide.title}
                                    </h3>
                                    <p className="text-gray-200 text-base mb-0">{slide.subtitle}</p>
                                </div>
                            </div>
                        </SplideSlide>
                    )
                })}
            </Splide>
            
            <div className="absolute bottom-0 right-4 -translate-y-1/2 z-30 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                <span className="text-2xl">{currentIndex + 1}</span> / {slides.length}
            </div>
        </div>
    );
}
