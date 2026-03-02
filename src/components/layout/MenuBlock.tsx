'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, X, ArrowUpRight } from 'react-feather';
import Image from 'next/image';

interface SubMenuItem {
    title: string;
    href: string;
    logo?: string;
}

interface MegaMenuItem {
    title: string;
    subMenu: SubMenuItem[];
}

interface MenuItem {
    title: string;
    href?: string;
    subMenu?: SubMenuItem[];
    megaMenu?: MegaMenuItem[];
}

interface MenuBlockProps {
    mobileOpen?: boolean;
    toggleMobileMenu?: () => void;
    logo?: string;
    btnColor?: string;
    btnlinkColor?: string;
}


const home1MenuItems: MenuItem[] = [
    // { title: 'Home', href: '#home' },
    { title: 'About', href: '#about' },
    { title: 'Shop', href: '/shop' },
    { title: 'Features', href: '#features' },
    { title: 'Services', href: '#services' },
    { title: 'Blogs', href: '/blogs' },
    // {
    //     title: 'Policies',
    //     subMenu: [
    //         { title: 'Privacy Policy', href: '/privacy-policy' },
    //         { title: 'Terms & Conditions', href: '/terms-and-conditions' },
    //         { title: 'Refund Policy', href: '/refund-policy' }
    //     ]
    // },
    { title: 'Contact', href: '#contact' },
];

const MenuBlock: React.FC<MenuBlockProps> = ({ mobileOpen = false, toggleMobileMenu, logo = "/images/logo/logo-blue.png", btnColor = 'bg-blue-600', btnlinkColor = "text-white", }) => {
    const [openSubMenu, setOpenSubMenu] = useState<Record<string, boolean>>({});
    const pathname = usePathname();

    // Dynamically modify menu items based on current page
    const menuItems = home1MenuItems.map(item => ({
        ...item,
        href: item.href?.startsWith('#') && pathname !== '/home-1'
            ? `/${item.href}`
            : item.href
    }));

    const toggleSubMenu = (key: string) => {
        setOpenSubMenu((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const getDarkLogo = (src: string) => {
        if (src.endsWith('.png')) return src.replace('.png', '-white.png');
        if (src.endsWith('.jpg')) return src.replace('.jpg', '-white.jpg');
        if (src.endsWith('.svg')) return src.replace('.svg', '-white.svg');
        return src; // fallback
    };

    return (
        <>
            {/* Desktop Menu */}
            <ul className="hidden lg:flex gap-6 font-semibold text-[17px] main-menu">
                {menuItems.map((item, index) => (
                    item.subMenu ? (
                        // Normal dropdown menu
                        <li key={index} className="group relative">
                            <button className="flex items-center gap-1 py-8">
                                {item.title} <ChevronDown size={14} />
                            </button>
                            <ul className="absolute top-full py-2 left-0 bg-white shadow-lg rounded-lg hidden group-hover:flex flex-col min-w-[220px] z-50 overflow-hidden">
                                {item.subMenu.map((sub, subIndex) => (
                                    <li key={subIndex}>
                                        <Link
                                            href={sub.href || "#"}
                                            className="block px-4 py-2 text-gray-700 hover:translate-x-2 dark:hover:bg-gray-800 transition duration-300"
                                        >
                                            {sub.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ) : item.megaMenu ? (
                        // Mega menu (NO relative on li)
                        <li key={index} className="group">
                            <button className="flex items-center gap-1 py-8">
                                {item.title} <ChevronDown size={14} />
                            </button>
                            <div className="absolute top-full left-0 w-full bg-white shadow-lg hidden group-hover:block rounded-lg z-50">
                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 lg:gap-6 gap-1 lg:p-6 p-0 text-base font-medium text-gray-900">
                                    {item.megaMenu.map((section, secIndex) => (
                                        <div key={secIndex}>
                                            <h4 className="font-semibold mb-4">{section.title}</h4>
                                            <ul className="flex flex-col gap-2">
                                                {section.subMenu.map((sub, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link
                                                            href={sub.href || "#"}
                                                            className="text-gray-700 hover:translate-x-2 duration-300 transition"
                                                        >
                                                            {sub.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    <div className="hidden lg:flex flex-col justify-between bg-blue-50 rounded-xl p-6">
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">Explore more</h4>
                                            <Image
                                                src="/images/menu-right-banner-1.svg"
                                                alt="banner"
                                                width={400}   // required
                                                height={250}  // required
                                                className="my-3"
                                            />
                                        </div>
                                        <a href="blog-1.html" className="text-blue-600 hover:translate-x-2 duration-300 transition font-medium inline-flex items-center gap-1 text-base">
                                            See more content
                                            <ArrowUpRight size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ) : (
                        // Simple link
                        <li key={index}>
                            <Link href={item.href || "#"} className="flex items-center gap-1 py-8">
                                {item.title}
                            </Link>
                        </li>
                    )
                ))}
            </ul>


            {/* Mobile Menu */}
            <div
                className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 flex flex-col lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        {/* Light Logo */}
                        <Image
                            src={logo}
                            alt="logo"
                            width={125}
                            height={40}
                            priority
                            className="h-9 dark:hidden w-auto"
                        />
                        {/* Dark Logo (auto-generated) */}
                        <Image
                            src={getDarkLogo(logo)}
                            alt="logo dark"
                            width={125}
                            height={40}
                            priority
                            className="h-9 hidden dark:flex w-auto"
                        />
                    </Link>
                    <button onClick={toggleMobileMenu} aria-label="close menu">
                        <X size={24} />
                    </button>
                </div>
                <ul className="flex flex-col p-4 gap-2 overflow-y-auto">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            {item.subMenu || item.megaMenu ? (
                                <>
                                    <button
                                        onClick={() => toggleSubMenu(`${index}`)}
                                        className="flex justify-between w-full items-center py-2 font-medium text-gray-900"
                                    >
                                        {item.title} <ChevronDown size={18} />
                                    </button>
                                    {openSubMenu[`${index}`] && (
                                        <ul className="pl-4 mt-2 flex flex-col gap-2">
                                            {/* Regular SubMenu */}
                                            {item.subMenu &&
                                                item.subMenu.map((sub, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link href={sub.href || '#'} className="text-gray-700 py-1 block font-medium">
                                                            {sub.title}
                                                        </Link>
                                                    </li>
                                                ))}

                                            {/* Mega Menu Sections */}
                                            {item.megaMenu &&
                                                item.megaMenu.map((section, secIndex) => (
                                                    <li key={secIndex}>
                                                        <button
                                                            onClick={() =>
                                                                toggleSubMenu(`${index}-${secIndex}`)
                                                            }
                                                            className="flex justify-between w-full items-center py-1 font-medium text-gray-900"
                                                        >
                                                            {section.title} <ChevronDown size={16} />
                                                        </button>
                                                        {openSubMenu[`${index}-${secIndex}`] && (
                                                            <ul className="pl-4 mt-1 flex flex-col gap-1">
                                                                {section.subMenu.map((sub, subIndex) => (
                                                                    <li key={subIndex}>
                                                                        <Link
                                                                            href={sub.href || '#'}
                                                                            className="text-gray-700 py-1 block font-medium"
                                                                        >
                                                                            {sub.title}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <Link href={item.href || '#'} className="py-2 block text-gray-900 font-medium">
                                    {item.title}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="mt-auto p-4">
                    <Link
                        href="/register"
                        className={`flex items-center justify-center gap-3 px-6 py-3  rounded-md text-sm font-medium hover:bg-blue-700 transition-all duration-200 ${btnColor} ${btnlinkColor}`}
                    >
                        Register
                    </Link>
                </div>
            </div>
        </>
    );
};

export default MenuBlock;
