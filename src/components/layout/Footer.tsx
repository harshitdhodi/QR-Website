"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Facebook, Linkedin, Instagram, MapPin } from "react-feather";
type FooterLayout = "default" | "classic" | "modern" | "light" | "elegant";

interface FooterProps {
    layout?: FooterLayout;
    bgColor?: string;
    foreColor?: string;
    iconbgColor?: string;
    foretextColor?: string;
    borderColor?: string;
    logo?: string;
}

const HOVER_MAP: Record<string, string> = {
    "bg-blue-600": "hover:bg-blue-800",
    "bg-blue-500": "hover:bg-blue-600",
    "bg-lime-300": "hover:bg-lime-400",
    "bg-cyan-500": "hover:bg-cyan-700",
    "bg-yellow-400": "hover:bg-white",
    "bg-cyan-600": "hover:bg-cyan-700",
    "bg-gray-900": "hover:bg-gray-800",
    "bg-blue-800": "hover:bg-blue-700",
    "bg-gray-800": "hover:bg-gray-700",
    "bg-teal-800": "hover:bg-teal-700",
    "bg-green-800": "hover:bg-green-700",
    "bg-red-600": "hover:bg-red-700",
};

export default function Footer({ logo = "/images/logo/logo-white.png" }: FooterProps) {

    const getDarkLogo = (src: string) => {
        // If the filename already contains "-white" before the extension, return as is
        if (/-white\.(png|jpg|jpeg|svg)$/i.test(src)) {
            return src;
        }

        // Otherwise, insert "-white" before the file extension
        return src.replace(/\.(png|jpg|jpeg|svg)$/i, '-white.$1');
    };

    return (
        <footer className={`font-dm relative z-10 text-gray-300 bg-gray-900 pt-16 pb-8`}>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-14 gap-10 lg:gap-8 mb-16">

                    {/* Column 1: Logo & Info */}
                    <div className="lg:col-span-4 lg:pr-10">
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src={getDarkLogo(logo)}
                                alt="logo"
                                width={180}
                                height={60}
                                priority
                                className="h-12 w-auto"
                            />
                        </Link>
                        <p className="mb-8 text-gray-400 font-medium leading-relaxed max-w-xs">
                            We place great emphasis on designers, artists, and brands.
                        </p>
                        <div className="flex items-center gap-3">
                            <Link href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-blue-900 hover:text-white transition group">
                                <Facebook size={18} className="text-gray-300 group-hover:text-white" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-blue-900 hover:text-white transition group">
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className="text-gray-300 group-hover:text-white"><path d="M12.006 12.274h6.9c-.312 2.296-1.585 4.39-3.725 5.586-2.272 1.258-5.358 1.104-7.46-.42-2.103-1.523-2.91-4.22-1.957-6.52.894-2.164 3.012-3.666 5.374-3.834 2.112-.15 4.148.882 5.253 2.602l3.414-3.414c-2.486-2.613-6.265-3.824-9.873-2.94-3.533.864-6.425 3.553-7.534 7.027-1.12 3.489.157 7.375 3.086 9.537 2.872 2.122 6.84 2.454 10.02.83 3.193-1.633 5.3-5.275 5.09-8.914h-8.588v2.46z" /></svg>
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-blue-900 hover:text-white transition group">
                                <Instagram size={18} className="text-gray-300 group-hover:text-white" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-blue-900 hover:text-white transition group">
                                <Linkedin size={18} className="text-gray-300 group-hover:text-white" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white font-bold mb-6 tracking-widest uppercase relative pb-4 
                        after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-px after:bg-gray-600">
                            QUICK LINKS
                        </h4>
                        <ul className="flex flex-col gap-4 text-gray-300 font-medium">
                            <li><Link href="/#about" className="hover:text-white transition">About Us</Link></li>
                            <li><Link href="/shop" className="hover:text-white transition">Shop</Link></li>
                            <li><Link href="/#how_it_work" className="hover:text-white transition">How It Works</Link></li>
                            <li><Link href="/#why_choose_us" className="hover:text-white transition">Why Choose Us</Link></li>
                            <li><Link href="/blogs" className="hover:text-white transition">Blogs</Link></li>
                            <li><Link href="/#contact" className="hover:text-white transition">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Policies */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white font-bold mb-6 tracking-widest uppercase relative pb-4 
                        after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-px after:bg-gray-600">
                            POLICIES
                        </h4>
                        <ul className="flex flex-col gap-4 text-gray-300 font-medium">
                            <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
                            <li><Link href="/terms-and-conditions" className="hover:text-white transition">Terms &amp; Conditions</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Us */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white font-bold mb-6 tracking-widest uppercase relative pb-4 
                        after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-px after:bg-gray-600">
                            CONTACT US
                        </h4>
                        <ul className="flex flex-col gap-5 text-gray-300 font-medium text-sm">
                            <li className="flex items-start gap-4 hover:text-white transition cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-blue-900 border border-gray-800 flex items-center justify-center flex-shrink-0 text-white">
                                    <Phone size={14} />
                                </div>
                                <div className="pt-1.5">+91-730 494 5823</div>
                            </li>
                            <li className="flex items-start gap-4 hover:text-white transition cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-blue-900 border border-gray-800 flex items-center justify-center flex-shrink-0 text-white">
                                    <Mail size={14} />
                                </div>
                                <div className="pt-1.5">info@rndtechnosoft.com</div>
                            </li>
                            <li className="flex items-start gap-4 hover:text-white transition cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-blue-900 border border-gray-800 flex items-center justify-center flex-shrink-0 text-white">
                                    <MapPin size={14} />
                                </div>
                                <div className="pt-1.5 leading-relaxed">
                                    3rd Floor, Sapphire, Daman Rd, above Axis Bank, Daulat Nagar, Chala, Vapi, Gujarat 396191
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-center items-center gap-4 text-gray-400 font-medium text-sm">
                    <p className="mb-0">
                        Copyright © 2026 RnD Technosoft. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
