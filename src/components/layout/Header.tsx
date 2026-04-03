'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'react-feather';
import { useSession } from 'next-auth/react';
import MenuBlock from './MenuBlock';
import NavbarProductSearch from './NavbarProductSearch';
import Image from 'next/image';
import Button from '../ui/Button';
import UserProfile from './UserProfile';
import CartDropdown from './CartDropdown';

interface HeaderProps {
    btnColor?: string;
    btnlinkColor?: string;
    bgColor?: string;
    logo?: string;
    headerClass?: string;
    position?: string;
    theme?: 'header-dark' | 'header-light';
}

const Header = ({
    btnColor = 'bg-brand-primary',
    bgColor = "bg-white",
    headerClass = "",
    position = "absolute",
    btnlinkColor = "text-white",
    theme = "header-dark",
    logo = "/images/logo/Combined Logo (2000x400).png"
}: HeaderProps) => {
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const getDarkLogo = (src: string) => {
        if (src.endsWith('.png')) return src.replace('.png', '-white.png');
        if (src.endsWith('.jpg')) return src.replace('.jpg', '-white.jpg');
        if (src.endsWith('.svg')) return src.replace('.svg', '-white.svg');
        return src; // fallback
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

    // Scroll listener for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10); // change after 10px scroll
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`header-wrapper w-full min-w-0 border-b border-gray-200 ${position} left-0 right-0 z-50 transition-all duration-300 ease-in-out font-dm-sans ${headerClass === "bg-color-none" ? "bg-color-none top-0" : ""} ${theme} ${scrolled ? "scroll-header shadow-xs" : `${bgColor}`
                }`}
        >
            <div className="max-w-screen-xl mx-auto min-w-0 px-2 sm:px-3 md:px-14 lg:px-14 xl:px-18 2xl:px-3">
                <div className={`${headerClass === "bg-color-none" ? "bg-gray-200 rounded-xl px-4 shadow-md" : ""}`} >
                    <nav className="flex flex-col w-full min-w-0 gap-2 py-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:py-0 relative">

                        {/* Row 1 (mobile): logo + actions | Desktop: flows in one row with search + menu */}
                        <div className="flex min-w-0 items-center justify-between gap-1.5 sm:gap-2 lg:w-auto lg:shrink-0 lg:justify-start">
                            <Link href="/" className="flex min-w-0 max-w-[9.5rem] shrink items-center py-1 sm:max-w-[11rem] sm:shrink-0 lg:max-w-none lg:py-2">
                                {/* Light Logo */}
                                <Image
                                    src={logo}
                                    alt="logo"
                                    width={150}
                                    height={150}
                                    priority
                                    className="light-logo h-8 w-auto sm:h-9 lg:h-auto max-h-10 object-contain object-left"
                                />
                                {/* Dark Logo (auto-generated) */}
                                <Image
                                    src={getDarkLogo(logo)}
                                    alt="logo dark"
                                    width={150}
                                    height={150}
                                    priority
                                    className="dark-logo h-8 w-auto sm:h-9 lg:h-auto max-h-10 object-contain object-left"
                                />
                            </Link>

                            {/* Mobile / small tablet: cart, account, menu (search is on row 2) */}
                            <div className="flex min-w-0 shrink-0 items-center gap-0.5 sm:gap-2 lg:hidden [&_button]:shrink-0">
                                <CartDropdown />
                                {session?.user ? (
                                    <UserProfile variant="headerMobile" />
                                ) : (
                                    <>
                                        <Button href='/register' label='Register' icon="" className="hidden min-[400px]:inline-flex text-xs sm:text-sm register-btn px-2 sm:px-3 py-1.5" bgColor={` ${btnColor} `} textColor={` ${btnlinkColor} `} />
                                        <Button href='/login' label='Login' icon="" className="text-xs sm:text-sm register-btn px-2.5 sm:px-3 py-1.5" bgColor="transparent" textColor="text-gray-700 border border-gray-300" />
                                    </>
                                )}
                                <button
                                    type="button"
                                    aria-label="menu"
                                    className="-mr-0.5 flex shrink-0 items-center p-1.5 sm:p-1"
                                    onClick={toggleMobileMenu}
                                >
                                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                                </button>
                            </div>
                        </div>

                        {/* Product search: full width under logo row on mobile; inline on lg */}
                        <div className="w-full min-w-0 lg:flex-1 lg:max-w-sm xl:max-w-md lg:order-none">
                            <NavbarProductSearch />
                        </div>

                        {/* Mobile Menu Overlay */}
                        {mobileOpen && (
                            <div
                                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                                onClick={toggleMobileMenu}
                            ></div>
                        )}

                        {/* MenuBlock: desktop nav + slide-out drawer */}
                        <MenuBlock btnColor={btnColor} btnlinkColor={btnlinkColor} logo={logo} mobileOpen={mobileOpen} toggleMobileMenu={toggleMobileMenu} />

                        {/* Desktop only: cart + auth */}
                        <div className="hidden lg:flex items-center space-x-2 sm:space-x-3 shrink-0">
                            <CartDropdown />
                            {session?.user ? (
                                <UserProfile />
                            ) : (
                                <>
                                    <Button href='/register' label='Register' icon="" className="text-sm register-btn" bgColor={` ${btnColor} `} textColor={` ${btnlinkColor} `} />
                                    <Button href='/login' label='Login' icon="" className="text-sm register-btn" bgColor="transparent" textColor="text-gray-700 border border-gray-300" />
                                </>
                            )}
                        </div>

                    </nav>
                </div>
            </div>
        </header >
    );
};

export default Header;