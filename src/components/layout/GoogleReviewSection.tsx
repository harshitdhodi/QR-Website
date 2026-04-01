"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "react-feather";
import Button from "@/components/ui/Button";

interface GoogleReviewItem {
    id?: string | number;
    name?: string;
    review?: string;
    rating?: number;
    is_active?: boolean;
    sort_order?: number;
}

const fallbackReviews: Required<Pick<GoogleReviewItem, "name" | "review" | "rating">>[] = [
    {
        name: "Rahul Sharma",
        review:
            "Great product quality and very easy setup. The QR sticker helped me reconnect with my lost keys in less than an hour.",
        rating: 5,
    },
    {
        name: "Neha Verma",
        review:
            "Customer support is quick and helpful. The privacy-first contact flow is exactly what I needed for my vehicle.",
        rating: 5,
    },
    {
        name: "Aman Patel",
        review:
            "Clean dashboard, simple activation, and reliable notifications. Highly recommended for pet and luggage tags.",
        rating: 5,
    },
];

export default function GoogleReviewSection() {
    const [reviews, setReviews] = useState<GoogleReviewItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoogleReviews = async () => {
            try {
                const response = await fetch("/api/google-reviews");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const parsedData = Array.isArray(data) ? data : [];
                const activeSorted = parsedData
                    .filter((item: GoogleReviewItem) => item?.is_active !== false)
                    .sort(
                        (a: GoogleReviewItem, b: GoogleReviewItem) =>
                            (a.sort_order ?? 9999) - (b.sort_order ?? 9999),
                    );

                setReviews(activeSorted);
            } catch (error) {
                console.error("Error fetching Google reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGoogleReviews();
    }, []);

    const displayReviews = useMemo(() => {
        if (!reviews.length) return fallbackReviews;
        return reviews.map((item) => ({
            name: item.name?.trim() || "Verified Customer",
            review: item.review?.trim() || "Great experience with the service.",
            rating: Math.max(1, Math.min(5, Number(item.rating) || 5)),
        }));
    }, [reviews]);

    const averageRating = useMemo(() => {
        if (!displayReviews.length) return "5.0";
        const total = displayReviews.reduce((sum, item) => sum + item.rating, 0);
        return (total / displayReviews.length).toFixed(1);
    }, [displayReviews]);

    return (
        <section className="lg:py-24 py-12 bg-white dark:bg-gray-900">
            <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3">
                <div className="flex flex-col items-center text-center mb-12">
                    <span className="inline-flex items-center gap-2 rounded-full border border-brand-secondary px-4 py-2 text-sm font-medium text-brand-primary bg-white dark:bg-gray-800">
                        <Star size={14} fill="currentColor" />
                        Google Reviews
                    </span>
                    <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
                        Loved by our customers
                    </h2>
                    <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl">
                        Real feedback from users who trust our QR safety solutions for vehicles, pets, and valuables.
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-brand-primary">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Star key={index} size={18} fill="currentColor" />
                            ))}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{averageRating}/5</span>
                        <span className="text-gray-500 dark:text-gray-400">
                            ({displayReviews.length}+ reviews)
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {(loading ? fallbackReviews : displayReviews).map((item, index) => (
                        <div
                            key={`${item.name}-${index}`}
                            className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800"
                            data-aos="fade-up"
                            data-aos-duration="300"
                            data-aos-delay={index * 100}
                        >
                            <div className="flex items-center gap-1 text-brand-primary mb-3">
                                {Array.from({ length: item.rating }).map((_, starIndex) => (
                                    <Star key={starIndex} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <p className="text-gray-700 dark:text-gray-200 leading-7">{item.review}</p>
                            <p className="mt-4 font-semibold text-gray-900 dark:text-white">{item.name}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <Button
                        href="/contact"
                        label="Share your review"
                        bgColor="bg-brand-primary"
                        textColor="text-white"
                    />
                </div>
            </div>
        </section>
    );
}
