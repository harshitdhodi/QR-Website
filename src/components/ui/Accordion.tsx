// components/Accordion.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown } from "react-feather";

export interface AccordionItem {
    question: string;
    answer: React.ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    defaultOpenIndex?: number | null;
    variant?: "white" | "gray" | "line"; // white is default
    textColor?: string; // e.g. "text-gray-900"
    borderColor?: string; // e.g. "border-gray-200"
    bgColor?: string;
    className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
    items,
    defaultOpenIndex = null,
    variant = "white",
    textColor = "text-gray-900",
    borderColor = "border-gray-200",
    bgColor = "bg-white",
    className = "",
}) => {
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const contentMuted =
        textColor.includes("text-white") || textColor.includes("gray-100")
            ? "text-slate-300"
            : "text-slate-600";

    return (
        <div className={`${variant === "line" ? "space-y-0" : "space-y-4"} ${className}`.trim()}>
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                const panelId = `accordion-panel-${index}`;
                const headerId = `accordion-header-${index}`;

                const containerClass =
                    variant === "white"
                        ? `${bgColor} border ${borderColor} rounded-xl shadow-sm overflow-hidden`
                        : variant === "gray"
                            ? `${bgColor} rounded-lg pb-1`
                            : `border-b ${borderColor} last:border-b-0 pb-0 ${bgColor}`;

                const buttonClass =
                    variant === "white"
                        ? `w-full flex justify-between items-center gap-3 px-5 py-4 text-left ${textColor} font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-900/30 cursor-pointer`
                        : variant === "gray"
                            ? `accordion-header w-full flex justify-between items-center px-5 py-4 text-left ${textColor} font-medium focus:outline-none bg-gray-100 rounded-lg cursor-pointer`
                            : `w-full flex justify-between items-center gap-3 py-4 pr-1 text-left ${textColor} font-semibold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/25 focus-visible:ring-offset-2 rounded-sm cursor-pointer`;

                const iconClass = `shrink-0 w-5 h-5 text-slate-400 transform transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`;

                const contentClass =
                    variant === "white"
                        ? `px-5 pb-5 pt-0 text-[15px] sm:text-[17px] font-normal leading-relaxed ${contentMuted}`
                        : variant === "gray"
                            ? `accordion-content px-5 pt-3 pb-4 text-[17px] font-normal leading-relaxed lg:pr-10 ${contentMuted}`
                            : `accordion-content pb-5 pt-0 text-[15px] sm:text-[16px] font-normal leading-relaxed ${contentMuted}`;

                return (
                    <div key={index} className={containerClass}>
                        <button
                            type="button"
                            id={headerId}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => toggleAccordion(index)}
                            className={buttonClass}
                        >
                            <span className="text-base sm:text-lg">{item.question}</span>
                            <ChevronDown size={20} className={iconClass} aria-hidden />
                        </button>

                        {isOpen ? (
                            <div
                                id={panelId}
                                role="region"
                                aria-labelledby={headerId}
                                className={contentClass}
                            >
                                {item.answer}
                            </div>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
};

export default Accordion;
