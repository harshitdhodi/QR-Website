// app/shop/components/ProductCard.tsx
"use client";

import React from "react";
import { Product } from "@/const/productData";
import { Star } from "lucide-react";
import Button from "./Button";
import Image from "next/image";
import { useCart } from "@/components/providers/CartProvider";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    product: Product;
    variant?: "compact" | "extended";
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = "compact" }) => {
    const { addToCart } = useCart();
    const quantity = 1;
    const router = useRouter();

    // Use the actual backend slug if available, else fallback to formatted title
    const productSlug = product.slug || product.title.toLowerCase().replace(/\s+/g, '-');

    const handleAddToCart = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        addToCart(product, quantity);
        alert(`Added ${quantity} x ${product.title} to cart!`);
    };

    const handleCardClick = () => {
        router.push(`/shop/${productSlug}`);
    };

    if (variant === "extended") {
        return (
            <div
                className="flex sm:flex-row flex-col md:space-x-7 md:gap-0 gap-3 cursor-pointer transition-all duration-300 hover:bg-gray-50 p-3 -m-3 rounded-xl"
                onClick={handleCardClick}
            >
                {/* product image */}
                <div className="relative w-72 overflow-hidden rounded-xl bg-productcard-gradient shrink-0">
                    {product.discount && (
                        <div className="absolute top-3 left-3 z-10 bg-green-600 text-white text-xs font-medium py-1 px-2 rounded-md">
                            {product.discount}
                        </div>
                    )}
                    <div className="group block relative">
                        <div className="img-one max-h-80 text-center justify-center object-center">
                            <Image
                                src={product.imgOne}
                                alt={product.title}
                                className="rounded-xl overflow-hidden object-contain transition-opacity duration-300 group-hover:opacity-0"
                                width={290}
                                height={335}
                            />
                        </div>
                        <div className="img-two max-h-80 text-center object-center justify-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Image
                                src={product.imgTwo}
                                alt={product.title}
                                className="rounded-xl overflow-hidden"
                                width={290}
                                height={435}
                            />
                        </div>
                    </div>
                </div>

                {/* product content */}
                <div className="mb-2 flex-1">
                    <span className="block text-2xl font-semibold text-gray-900 mb-0 pt-2 group-hover:text-blue-600 transition-colors duration-300">
                        {product.title}
                    </span>
                    <p className="text-sm font-medium text-gray-500 mt-[2px] mb-2">{product.subtitle}</p>
                    <p className="text-lg font-semibold text-gray-800 pt-1">
                        ₹{product.price.toLocaleString()}
                        {product.oldPrice && (
                            <span className="line-through text-sm text-gray-500 font-medium ml-2">
                                ₹{product.oldPrice.toLocaleString()}
                            </span>
                        )}
                    </p>

                    {/* review */}
                    {product.review && (
                        <div className="flex items-center text-blue-500 mb-3 mt-2">
                            <Star fill="blue" size={16} strokeWidth={0} />
                            <span className="text-sm text-gray-600 font-medium leading-6 ml-1 inline-block">
                                {product.review} Reviews
                            </span>
                        </div>
                    )}

                    {/* short description */}
                    {product.shortDesc && (
                        <p className="font-medium text-base text-gray-700 fw-500">{product.shortDesc}</p>
                    )}

                    {/* action buttons */}
                    <div className="flex flex-row gap-2 mt-5">
                        <Button
                            label="Add to Cart"
                            icon=""
                            className="cursor-pointer"
                            bgColor="bg-blue-900"
                            textColor="text-white"
                            onClick={handleAddToCart}
                        />
                        <Button
                            label="Read More"
                            icon=""
                            bgColor="bg-gray-100"
                            className="border border-blue-900"
                            textColor="text-gray-900"
                            href={`/shop/${productSlug}`}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // --- Compact layout (default) ---
    return (
        <div
            className="group flex flex-col gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md"
            onClick={handleCardClick}
        >
            {/* product image */}
            <div className="relative overflow-hidden rounded-xl bg-productcard-gradient min-h-[180px] flex items-center justify-center">
                {product.discount && (
                    <div className="absolute top-3 left-3 z-10 bg-green-600 text-white text-[11px] font-medium py-1 px-2 rounded-md">
                        {product.discount}
                    </div>
                )}
                {product.badge && (
                    <div className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[11px] font-medium py-1 px-2 rounded-md">
                        {product.badge}
                    </div>
                )}
                <div className="group block relative">
                    <div className="img-one">
                        <Image
                            src={product.imgOne}
                            alt={product.title}
                            className="rounded-xl overflow-hidden transition-opacity duration-300 group-hover:opacity-0"
                            width={290}
                            height={435}
                        />
                    </div>
                    <div className="img-two absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Image
                            src={product.imgTwo}
                            alt={product.title}
                            className="rounded-xl overflow-hidden"
                            width={290}
                            height={435}
                        />
                    </div>
                </div>
            </div>

            {/* product content */}
            <div className="mb-1">
                <span className="block text-[17px] leading-6 font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 min-h-[3rem]">
                    {product.title}
                </span>
                <p className="text-sm font-medium text-gray-500 mt-[2px] mb-2 line-clamp-1">{product.subtitle}</p>
                <p className="text-lg font-semibold text-gray-800 pt-1">
                    ₹{product.price.toLocaleString()}
                    {product.oldPrice && (
                        <span className="line-through text-sm text-gray-500 font-medium ml-2">
                            ₹{product.oldPrice.toLocaleString()}
                        </span>
                    )}
                </p>
                {product.review && (
                    <div className="flex items-center text-blue-500 mb-1 mt-1">
                        <Star fill="blue" size={15} strokeWidth={0} />
                        <span className="text-xs text-gray-600 font-medium leading-6 ml-1 inline-block">
                            {product.review}
                        </span>
                    </div>
                )}
                {/* Optional: Add action buttons in compact layout too if desired */}
                <div className="flex flex-row gap-2 mt-3">
                    <Button
                        label="View Details"
                        padding="px-4 py-2"
                        icon=""
                        bgColor="bg-brand-primary"
                        textColor="text-white"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/shop/${productSlug}`);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
