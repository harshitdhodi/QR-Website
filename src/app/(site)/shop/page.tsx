"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageTitle from "@/components/ui/PageTitle";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/ui/ProductCard";
import { Product as BaseProduct } from "@/const/productData";

interface Product extends BaseProduct {
    categoryNames?: string[];
}

function ShopContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selected, setSelected] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                setProducts(data);

                const uniqueCategories = Array.from(
                    new Set(data.flatMap((p: Product) => p.categoryNames || []))
                ) as string[];
                setCategories(uniqueCategories.filter(Boolean));

                // Read category from URL and auto-select it
                const categoryFromUrl = searchParams.get("category");
                if (categoryFromUrl) {
                    setSelectedCategories([categoryFromUrl]);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, [searchParams]);

    const handleCategoryChange = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    let displayedProducts = [...products];
    if (selectedCategories.length > 0) {
        displayedProducts = displayedProducts.filter((p) =>
            p.categoryNames?.some((c: string) => selectedCategories.includes(c))
        );
    }

    if (selected === "high-low") {
        displayedProducts.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return (
        <>
            <div className="pt-24 pb-12 max-w-screen mx-auto font-dm">
                {/* Page Title */}
                <PageTitle title="Shop" subtitle="">
                    {/* Breadcrumb */}
                    <div className="flex justify-center text-center">
                        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop" }]} variant="light" />
                    </div>
                </PageTitle>
            </div>
            <div className="shop-wrap font-dm lg:pt-20 pt-12">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 lg:pb-24 pb-12">
                    <div className="grid lg:grid-cols-4 grid-cols-1 lg:gap-10 relative lg:space-y-0 space-y-5">
                        {/* Filters */}
                        <div className="w-full">
                            <h2 className="text-gray-800 mt-2 text-2xl font-semibold mb-6">
                                Filters
                            </h2>

                            {/* Categories */}
                            <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-gray-200">
                                <h3 className="text-base font-semibold text-gray-900 mb-3">
                                    Categories
                                </h3>
                                {categories.map((cat, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`category-${i}`}
                                                className="accent-blue-500"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => handleCategoryChange(cat)}
                                            />
                                            <label
                                                htmlFor={`category-${i}`}
                                                className="text-base text-gray-900 font-medium cursor-pointer"
                                            >
                                                {cat}
                                            </label>
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">
                                            {products.filter((p) => p.categoryNames?.includes(cat)).length}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Listing */}
                        <div className="col-span-3">
                            {/* Sorting */}
                            <div className="flex flex-row justify-between items-center pb-3 border-b border-gray-200 mb-3">
                                <p className="m-0 text-sm md:text-base font-medium text-gray-700">
                                    Showing 1 - {displayedProducts.length} of {displayedProducts.length} results
                                </p>
                                <select
                                    value={selected}
                                    onChange={(e) => setSelected(e.target.value)}
                                    className="w-auto text-base font-medium px-4 py-2 appearance-none pr-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-300"
                                    aria-label="Relevance"
                                >
                                    <option value="">Relevance</option>
                                    <option value="best-selling">Best Selling</option>
                                    <option value="popularity">Popularity</option>
                                    <option value="high-low">High to Low</option>
                                </select>
                            </div>

                            {/* Product Grid */}
                            {products.length === 0 ? (
                                <div className="py-10 text-center text-gray-500 font-medium">
                                    Loading products...
                                </div>
                            ) : displayedProducts.length === 0 ? (
                                <div className="py-10 text-center text-gray-500 font-medium">
                                    No products match your criteria.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 relative py-3">
                                    {displayedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} variant="extended" />
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}
