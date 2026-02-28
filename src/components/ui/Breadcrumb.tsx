import Link from "next/link";
import { ChevronRight } from 'react-feather';

interface BreadcrumbProps {
    items: { label: string; href?: string }[];
    variant?: "default" | "light";
}

export const Breadcrumb = ({ items, variant = "default" }: BreadcrumbProps) => {
    const textColor = variant === "light" ? "text-gray-200" : "text-gray-500";
    const hoverColor = variant === "light" ? "hover:text-white" : "hover:text-gray-700";
    const activeColor = variant === "light" ? "text-white" : "text-gray-700";

    return (
        <nav className={`text-sm font-medium ${textColor}`} aria-label="Breadcrumb">
            <ol className="inline-flex items-center text-white space-x-1 md:space-x-3">
                {items.map((item, index) => (
                    <li key={index} className="inline-flex items-center text-base text-white font-medium">
                        {item.href ? (
                            <Link
                                href={item.href}
                                className={`inline-flex items-center text-white ${hoverColor}`}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={`${activeColor} items-center flex text-white`}>{item.label}</span>
                        )}

                        {index < items.length - 1 && (
                            <ChevronRight size={20} className="ml-2" />
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};
