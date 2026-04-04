"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle } from "react-feather";
import Accordion from "../ui/Accordion";
import PageTitle3 from "../ui/PageTitle3";

interface FaqItem {
    id: string;
    question: string;
    answer: string;
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

const FaqSection = () => {
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [sectionData, setSectionData] = useState<SectionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                // Fetch section data
                const sectionRes = await fetch('/api/feature-sections?section_name=faq');
                if (sectionRes.ok) {
                    const sData = await sectionRes.json();
                    setSectionData(sData);
                }

                const response = await fetch('/api/faqs');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Filter active and sort
                const activeFaqs = Array.isArray(data)
                    ? data.filter((faq: FaqItem) => faq.is_active)
                        .sort((a: FaqItem, b: FaqItem) => a.sort_order - b.sort_order)
                    : [];

                setFaqs(activeFaqs);
            } catch (err) {
                console.error('Error fetching FAQs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const fallbackFaqs = [
        {
            question: "What12 is the design process for branding?",
            answer: "Our design services start and end with a best-in-class experience strategy that builds brands.",
        },
        {
            question: "How long will it take to complete my project?",
            answer: "You can cancel your subscription anytime — no questions asked. We start and finish every design project with a world-class experience strategy.",
        },
    ];

    const displayData = faqs.length > 0
        ? faqs.map(f => ({ question: f.question, answer: f.answer }))
        : fallbackFaqs;

    if (loading) {
        return (
            <div className="faq-wrap bg-home-one-gradient-banner py-12 font-dm lg:py-16">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 text-center">
                    Loading FAQs...
                </div>
            </div>
        );
    }

    return (
        <div className="faq-wrap bg-home-one-gradient-banner py-12 font-dm lg:py-16">
            <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3">
                <div className="grid gap-8 lg:grid-cols-12 xl:gap-16">
                    {/* Left Side */}
                    <div className="xl:col-span-6 col-span-12 lg:col-span-6 flex flex-col">
                        <PageTitle3
                            icon={<HelpCircle size={18} />}
                            badgeText={sectionData?.tag_line || "Frequently Asked Question"}
                            title={sectionData?.parent_title || "Have any questions? here some answers"}
                            subtitle={sectionData?.parent_subtitle || "Whether you're building a startup landing page, a dashboard interface, or a modern web app gives you full control."}
                            widthClass="xl:w-10/12 lg:w-2/3 w-full"
                            alignment="start"
                            padding="pb-8"
                        />
                    </div>

                    {/* Right Side (Accordion) */}
                    <div className="lg:col-span-6 col-span-12 xl:pl-16">
                        <Accordion items={displayData} defaultOpenIndex={0} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqSection;
