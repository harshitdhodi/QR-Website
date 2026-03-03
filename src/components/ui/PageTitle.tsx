import React, { ReactNode } from "react";

interface PageTitleProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, children }) => {
    return (
        <div
            className="page-title font-dm relative w-full"
            style={{
                backgroundImage: 'url(https://ik.imagekit.io/mikbqwyy0/qr_banner.png)',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                // minHeight: '300px'
            }}
        >
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Centered content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[350px] px-4">
                <div className="text-center text-white">
                    <h2 className="lg:text-5xl md:text-5xl text-4xl font-bold lg:mb-2 tracking-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-lg mt-0 mb-0 font-medium">{subtitle}</p>
                    )}
                </div>
                {children && <div className="mt-4">{children}</div>}
            </div>
        </div>
    );
};

export default PageTitle;
