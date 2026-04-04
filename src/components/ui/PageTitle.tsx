import React, { ReactNode } from "react";

interface PageTitleProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, children }) => {
    return (
        <div className="px-3 py-5 sm:px-6 md:px-8 md:py-8">
            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center">
                <div className="animate-fade-in-up text-center text-gray-900">
                    <h2 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-[2.75rem] lg:leading-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-2 max-w-2xl text-pretty text-base font-medium leading-relaxed text-gray-600 md:text-lg">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children && <div className="mt-4 md:mt-5">{children}</div>}
            </div>
        </div>
    );
};

export default PageTitle;
