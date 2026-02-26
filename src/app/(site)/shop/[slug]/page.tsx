"use client";

import { use, useState } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import RelatedProducts from "@/components/ui/RelatedProducts";
import { Star, Truck, Package, Heart } from "lucide-react";
import ProductGallery from "@/components/ui/ProductGallery";
import { products } from "@/const/productData";
import { useCart } from "@/components/providers/CartProvider";
import { notFound } from "next/navigation";
import PageTitle from "@/components/ui/PageTitle";

export default function SingleProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { addToCart } = useCart();

    // Convert title to slug for matching
    const product = products.find((p) => p.title.toLowerCase().replace(/\s+/g, "-") === slug) || products[0];

    if (!product) {
        return notFound();
    }

    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`Added ${quantity} x ${product.title} to cart!`);
    };

    return (
        <>
            <div className="pt-24 pb-12 max-w-screen mx-auto font-dm">
              <PageTitle title={product.title} subtitle="Complete your purchase" />
            </div>
            <div className="shop-wrap pt-4 sm:pt-8 font-dm">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 lg:py-20 py-12">
                    <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-10 relative lg:space-y-0 space-y-5">
                        {/* left side */}
                        <div className="w-full">
                            <ProductGallery
                                images={[product.imgOne, product.imgTwo]}
                            />
                        </div>
                        {/* right side */}
                        <div className="w-full">
                            {/* Breadcrumb */}
                            <Breadcrumb
                                items={[
                                    { label: "Home", href: "/" },
                                    { label: "Shop", href: "/shop" },
                                    { label: product.title },
                                ]}
                            />

                            {/* Review Section */}
                            <div className="flex flex-col mt-3">
                                <h1 className="text-4xl font-semibold text-gray-900">
                                    {product.title}
                                </h1>

                                {/* Stars */}
                                <div className="flex items-center text-blue-400 my-1 gap-[1px]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < Math.floor(product.review || 5) ? "fill-current text-blue-400" : "text-gray-300"} />
                                    ))}
                                    <span className="text-gray-700 text-sm font-medium ml-2 leading-6">
                                        {product.review || 5} Reviews
                                    </span>
                                </div>

                                {/* Price */}
                                <p className="text-2xl font-semibold leading-6 pt-3 text-gray-900 flex gap-3 items-center">
                                    ₹{product.price}
                                    {product.oldPrice && (
                                        <span className="line-through text-gray-500 font-medium text-lg">
                                            ₹{product.oldPrice}
                                        </span>
                                    )}
                                    {product.discount && (
                                        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                                            {product.discount}
                                        </span>
                                    )}
                                </p>

                                {/* Description */}
                                <p className="text-base font-medium text-gray-700 mt-4">
                                    {product.shortDesc}
                                </p>

                                {/* Size */}
                                {product.size && product.size.length > 0 && (
                                    <div className="mt-6">
                                        <span className="font-semibold text-gray-800 text-base mb-3 inline-block">
                                            Size
                                        </span>
                                        <ul className="flex flex-row gap-2 mt-2">
                                            {product.size.map((size, i) => (
                                                <li key={i}>
                                                    <input
                                                        type="radio"
                                                        id={`size-${i}`}
                                                        name="size"
                                                        value={size}
                                                        className="hidden peer"
                                                        defaultChecked={i === 0}
                                                    />
                                                    <label
                                                        htmlFor={`size-${i}`}
                                                        className="cursor-pointer px-4 py-3 text-sm font-medium border-2 border-gray-200 text-gray-800 peer-checked:border-gray-800 peer-checked:bg-gray-50 rounded-md transition-all"
                                                    >
                                                        {size}
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Color */}
                                {product.colors && product.colors.length > 0 && (
                                    <div className="mt-8">
                                        <span className="font-semibold text-gray-800 text-base mb-3 inline-block">
                                            Color
                                        </span>
                                        <ul className="flex flex-row gap-3">
                                            {product.colors.map((color, idx) => (
                                                <li key={idx}>
                                                    <input
                                                        type="radio"
                                                        id={`color-${idx}`}
                                                        name="color"
                                                        value={color}
                                                        className="hidden peer"
                                                        defaultChecked={idx === 0}
                                                    />
                                                    <label
                                                        htmlFor={`color-${idx}`}
                                                        className="flex items-center justify-center w-10 h-10 rounded-full peer-checked:ring-2 ring-offset-2 ring-gray-800 border border-gray-300 cursor-pointer"
                                                    >
                                                        <span className={`w-8 h-8 rounded-full block ${color}`} />
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Quantity */}
                                <div className="mt-8">
                                    <span className="font-semibold text-gray-800 text-base mb-2 inline-block">
                                        Quantity
                                    </span>
                                    <div className="flex gap-4 mt-2 max-w-md items-center">
                                        <select
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            className="w-24 text-base font-medium border-2 border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:border-gray-800"
                                        >
                                            {[1, 2, 3, 4, 5, 10].map((q) => (
                                                <option key={q} value={q}>{q}</option>
                                            ))}
                                        </select>
                                        <div className="flex flex-grow gap-3">
                                            <button
                                                onClick={handleAddToCart}
                                                className="flex-grow text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-3 font-semibold text-base transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                            <button className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-lg px-4 py-3 flex items-center justify-center transition-colors">
                                                <Heart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col gap-4 text-sm">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Truck className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <span className="text-gray-900 font-semibold block">Fast Delivery</span>
                                            <span className="text-gray-600">Usually ships within 24-48 hours</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Package className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <span className="text-gray-900 font-semibold block">Free Shipping</span>
                                            <span className="text-gray-600">On all orders above ₹799</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="related-products lg:pb-20 pb-12 bg-gray-50 pt-16">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3">
                    <div className="flex justify-center lg:mb-12 mb-8">
                        <h2 className="lg:text-4xl text-3xl font-bold text-gray-900">Related Products</h2>
                    </div>
                    <RelatedProducts />
                </div>
            </div>
        </>
    );
}
