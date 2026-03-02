'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageTitle3 from '@/components/ui/PageTitle3';

interface CategoryItem {
    id: string;
    image: string;
    alt_name: string | null;
    img_title: string | null;
    title: string;
    subtitle: string;
    button_name: string;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    og_title: string | null;
    og_description: string | null;
    og_image: string | null;
    canonical_url: string | null;
    schema_markup: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export default function CategorySection() {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [_error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`/api/categories`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const activeCategories = Array.isArray(data)
                    ? data.filter((cat: CategoryItem) => cat.is_active)
                        .sort((a: CategoryItem, b: CategoryItem) => a.sort_order - b.sort_order)
                    : [];
                setCategories(activeCategories);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError(err instanceof Error ? err.message : 'Failed to load categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const fallbackCategories = [
        {
            id: "d914d43c-9f7d-4302-97f5-fe1bd892dedb",
            image: "https://ik.imagekit.io/mikbqwyy0/ChatGPT_Image_Feb_26__2026__03_19_12_PM-removebg-preview.png",
            title: "Vehicle",
            subtitle: "Secure QR tags for cars and bikes to manage parking and safety",
            button_name: "Buy Now",
            is_active: true,
            sort_order: 0
        },
        {
            id: "219986b3-2280-415b-8965-3b9687213e65",
            image: "https://ik.imagekit.io/mikbqwyy0/ChatGPT_Image_Feb_26__2026__03_17_14_PM-removebg-preview.png",
            title: "Pet",
            subtitle: "Smart tags to ensure your furry friends can always be identified.",
            button_name: "Buy Now",
            is_active: true,
            sort_order: 1
        },
        {
            id: "9667710f-bfc5-487f-90d0-2890417452e2",
            image: "https://ik.imagekit.io/mikbqwyy0/ChatGPT_Image_Feb_26__2026__03_13_12_PM-removebg-preview.png",
            title: "Miscellaneous",
            subtitle: "Versatile QR stickers for keys, luggage, laptops, and more.",
            button_name: "Buy Now",
            is_active: true,
            sort_order: 2
        }
    ];

    const displayData = categories.length > 0 ? categories : fallbackCategories;

    if (loading) {
        return (
            <div className="counter-wrap font-dm bg-home-one-gradient-banner relative py-12">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-4">
                    <div className="text-center">Loading categories...</div>
                </div>
            </div>
        );
    }

    return (
        <div id="features" className="counter-wrap font-dm bg-home-one-gradient-banner relative py-12 lg:py-16">
            <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-4">
                <PageTitle3
                    badgeText=""
                    title="Shop by Category"
                    subtitle="Select a category to find the perfect QR solution for your needs."
                    widthClass="xl:w-7/12 lg:w-2/3 mx-auto"
                    alignment="center"
                    padding="pb-10"
                    textColor=""
                />

                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 md:gap-6">
                    {displayData.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/cart?category=${category.title}`}
                            className="w-full block group"
                        >
                            <div
                                className="
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
                                "
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                {/* Hover bg wash */}
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

                                {/* Top accent line */}
                                {/* <div className="absolute top-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}

                                {/* Image */}
                                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 z-10">
                                    <div className="absolute inset-0 rounded-full bg-blue-50 dark:bg-blue-950/40 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors duration-300 scale-90" />
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        fill
                                        className="object-contain p-3 transition-transform duration-300 group-hover:scale-110 relative z-10"
                                        sizes="(max-width: 568px) 40vw, 160px"
                                    />
                                </div>

                                {/* Text */}
                                <div className="flex flex-col items-center z-10 gap-1.5">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        {category.title}
                                    </h3>
                                    <p className="text-md text-center text-gray-500 dark:text-gray-400 leading-snug line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                                        {category.subtitle}
                                    </p>
                                </div>

                                {/* Button */}
                                <div className="z-10 mt-2">
                                    <span className="
                                        inline-flex items-center gap-1.5
                                        py-2 px-6
                                        bg-blue-600 text-white text-sm
                                        rounded-full font-semibold
                                        transition-all duration-300
                                        group-hover:bg-blue-700
                                        group-hover:shadow-lg group-hover:shadow-blue-500/30
                                        group-hover:scale-105 transform
                                    ">
                                        {category.button_name || 'Buy Now'}
                                        <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}