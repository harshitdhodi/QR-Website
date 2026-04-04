"use client";

import { FC, ReactNode } from "react";
import { ArrowUpRight } from "react-feather";
import Link from "next/link";

interface ButtonProps {
    href?: string;
    label: string;
    icon?: ReactNode;
    padding?: string;
    bgColor?: string;        // e.g. "bg-blue-600"
    hoverBgColor?: string;  // optional override e.g. "hover:bg-blue-700"
    textColor?: string;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

// ✅ Static Tailwind-safe hover map
const HOVER_MAP: Record<string, string> = {
    "bg-brand-primary": "hover:opacity-90",
    "bg-brand-secondary": "hover:opacity-90",
    "bg-blue-900": "hover:bg-blue-800",
    "bg-blue-500": "hover:bg-blue-600",
    "bg-lime-300": "hover:bg-lime-400",
    "bg-cyan-500": "hover:bg-cyan-700",
    "bg-yellow-400": "hover:bg-yellow-500",
    "bg-cyan-600": "hover:bg-cyan-700",
    "bg-gray-900": "hover:bg-gray-800",
    "bg-blue-800": "hover:bg-blue-700",
    "bg-gray-800": "hover:bg-gray-700",
    "bg-teal-800": "hover:bg-teal-700",
    "bg-green-800": "hover:bg-green-700",
    "bg-red-600": "hover:bg-red-700",
    transparent: "hover:bg-gray-50",
};

const Button: FC<ButtonProps> = ({
    href,
    label,
    icon = <ArrowUpRight size={20} className="group-hover:translate-x-1 transition duration-300" />,
    padding = "px-6 py-2",
    bgColor = "bg-red-600",
    hoverBgColor,
    textColor = "text-white",
    className = "",
    onClick,
}) => {
    const bg = bgColor.trim();
    const fg = textColor.trim();
    const safeHoverClass = hoverBgColor || HOVER_MAP[bg] || "hover:opacity-90";
    /* Single normalized string — avoids SSR/client class whitespace drift from padded props e.g. ` ${btnColor} ` */
    const baseClasses = [
        "inline-flex min-h-11 min-w-[2.75rem] cursor-pointer items-center justify-center gap-2 rounded-xl text-base font-medium shadow-sm transition duration-300 btn-transition hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/35 focus-visible:ring-offset-2 group",
        padding,
        fg,
        bg,
        safeHoverClass,
        className.trim(),
    ]
        .filter(Boolean)
        .join(" ");

    if (onClick && (!href || href === "#")) {
        return (
            <button
                onClick={onClick}
                className={baseClasses}
                type="button"
            >
                <span>{label}</span>
                {icon}
            </button>
        );
    }

    return (
        <Link
            href={href || "#"}
            className={baseClasses}
            onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        >
            <span>{label}</span>
            {icon}
        </Link>
    );
};

export default Button;
