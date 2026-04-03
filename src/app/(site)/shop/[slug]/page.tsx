"use client";

import { use, useState, useEffect } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Star, Truck, Package } from "lucide-react";
import ProductGallery from "@/components/ui/ProductGallery";
import { useCart } from "@/components/providers/CartProvider";
import { notFound } from "next/navigation";
import PageTitle from "@/components/ui/PageTitle";
import Link from "next/link";
import QuantityDropdown from "@/components/ui/QuantityDropdown";

export default function SingleProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    // FETCH LOGIC
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${slug}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error(err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    if (loading) {
        return <div className="min-h-[50vh] flex items-center justify-center font-dm text-lg">Loading Product...</div>;
    }

    if (!product) {
        return notFound();
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`Added ${quantity} x ${product.title} to cart!`);
    };

    return (
        <>
            <div className="pt-24 pb-12 max-w-screen mx-auto font-dm">
                <PageTitle title={product.title} subtitle="Complete your purchase">
                    <div className="mt-4 flex justify-center px-6 py-2 ">
                        <Breadcrumb
                            items={[
                                { label: "Home", href: "/" },
                                { label: "Shop", href: "/shop" },
                                { label: product.title },
                            ]}
                        />
                    </div>
                </PageTitle>
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
                                {/* {product.size && product.size.length > 0 && (
                                    <div className="mt-6">
                                        <span className="font-semibold text-gray-800 text-base mb-3 inline-block">
                                            Size
                                        </span>
                                        <ul className="flex flex-row gap-2 mt-2">
                                            {product.size.map((size: string, i: number) => (
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
                                )} */}

                                {/* Color */}
                                {product.colors && product.colors.length > 0 && (
                                    <div className="mt-8">
                                        <span className="font-semibold text-gray-800 text-base mb-3 inline-block">
                                            Color
                                        </span>
                                        <ul className="flex flex-row gap-3">
                                            {product.colors.map((color: string, idx: number) => (
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
                                    <div className="flex gap-4 mt-2 max-w-sm items-center">
                                        <QuantityDropdown quantity={quantity} setQuantity={setQuantity} />
                                        <div className="flex flex-grow gap-3">
                                            <button
                                                onClick={handleAddToCart}
                                                className="flex-grow  border border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white rounded-lg px-4 py-2 font-semibold text-base transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                            <Link href="/checkout">
                                                <button
                                                    // onClick={handleAddToCart}
                                                    className="flex-grow text-white bg-blue-900 hover:bg-blue-800 rounded-lg px-9 py-2 font-semibold text-base cursor-pointer transition-colors"
                                                >
                                                    Buy Now
                                                </button>
                                            </Link>


                                            {/* <button className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-lg px-4 py-3 flex items-center justify-center transition-colors">
                                                <Heart className="w-5 h-5" />
                                            </button> */}
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

                                {/* Long Description */}
                            </div>
                        </div>
                    </div>
                    {product.longDesc && (
                        <div className="mt-10 pt-8 border-t border-gray-200">
                            <style>{`
            .product-longdesc {
                font-family: var(--font-dm, 'DM Sans', sans-serif);
                font-size: 0.875rem; /* base size for mobile */
                line-height: 1.7;
                color: #374151;
                overflow-wrap: break-word;
                word-wrap: break-word;
            }
            @media (min-width: 768px) {
                .product-longdesc {
                    font-size: 0.9375rem;
                    line-height: 1.85;
                }
            }
            .product-longdesc p {
                margin-bottom: 1rem;
            }
            .product-longdesc img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
            }
            .product-longdesc h1,
            .product-longdesc h2,
            .product-longdesc h3,
            .product-longdesc h4,
            .product-longdesc h5,
            .product-longdesc h6 {
                font-weight: 600;
                color: #111827;
                margin-top: 1.5rem;
                margin-bottom: 0.5rem;
                line-height: 1.3;
            }
            .product-longdesc h1 { font-size: 1.35rem; }
            .product-longdesc h2 { font-size: 1.25rem; }
            .product-longdesc h3 { font-size: 1.15rem; }
            @media (min-width: 768px) {
                .product-longdesc h1 { font-size: 1.75rem; }
                .product-longdesc h2 { font-size: 1.5rem; }
                .product-longdesc h3 { font-size: 1.3rem; }
            }
            @media (min-width: 1024px) {
                .product-longdesc h1 { font-size: 2.25rem; }
                .product-longdesc h2 { font-size: 1.7rem; }
                .product-longdesc h3 { font-size: 1.5rem; }
            }
            .product-longdesc ul,
            .product-longdesc ol {
                padding-left: 1.4rem;
                margin-bottom: 1rem;
            }
            .product-longdesc ul { 
                list-style-type: disc;
                padding-left: 1.5rem;
            }
            @media (min-width: 768px) {
                .product-longdesc ul { padding-left: 2rem; }
            }
            .product-longdesc ol { list-style-type: decimal; }
            .product-longdesc li {
                margin-bottom: 0.35rem;
            }
            .product-longdesc strong,
            .product-longdesc b {
                font-weight: 600;
                color: #1f2937;
            }
            .product-longdesc em,
            .product-longdesc i {
                font-style: italic;
                color: #4b5563;
            }
            .product-longdesc a {
                color: #2563eb;
                text-decoration: underline;
                text-underline-offset: 2px;
                word-break: break-all;
            }
            .product-longdesc a:hover { color: #1d4ed8; }
            .product-longdesc blockquote {
                border-left: 3px solid #2563eb;
                padding: 0.5rem 1rem;
                margin: 1.25rem 0;
                background: #f0f4ff;
                border-radius: 0 6px 6px 0;
                font-style: italic;
            }
            .product-longdesc .table-responsive {
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                margin-bottom: 1rem;
            }
            .product-longdesc table {
                width: 100%;
                min-width: 400px;
                border-collapse: collapse;
                font-size: 0.875rem;
            }
            .product-longdesc th,
            .product-longdesc td {
                border: 1px solid #e5e7eb;
                padding: 0.5rem 0.75rem;
                text-align: left;
            }
            .product-longdesc th {
                background: #f9fafb;
                font-weight: 600;
                color: #111827;
            }
            .product-longdesc tr:nth-child(even) td { background: #f9fafb; }
            .product-longdesc hr {
                border: none;
                border-top: 1px solid #e5e7eb;
                margin: 1.5rem 0;
            }
            .product-longdesc code {
                background: #f3f4f6;
                border-radius: 4px;
                padding: 0.1em 0.4em;
                font-size: 0.875em;
                color: #1f2937;
                word-break: break-word;
            }
        `}</style>
                            <h3 className="text-2xl md:text-[2.2rem] font-semibold text-gray-900 mb-4">Product Details</h3>
                            <div className="product-longdesc max-w-none">
                                {/* Using a wrapper to ensure any table generated by the HTML is horizontally scrollable if needed */}
                                <div dangerouslySetInnerHTML={{
                                    __html: product.longDesc.replace(/<table/g, '<div class="table-responsive"><table').replace(/<\/table>/g, '</table></div>')
                                }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
