"use client";

import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart, X } from "react-feather";
import { resolveBackendImageSrc } from "@/lib/resolveBackendImageSrc";

export default function CartDropdown() {
    const { cart, removeFromCart, cartTotal } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevCartCountRef = useRef<number>(cart.length);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const closeDropdown = () => setIsOpen(false);

    useEffect(() => {
        if (!isOpen) return;

        const onPointerDown = (e: MouseEvent | TouchEvent) => {
            const el = containerRef.current;
            if (!el) return;
            if (e.target instanceof Node && !el.contains(e.target)) {
                closeDropdown();
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeDropdown();
        };

        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("touchstart", onPointerDown, { passive: true });
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("touchstart", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        const prev = prevCartCountRef.current;
        const next = cart.length;
        prevCartCountRef.current = next;

        // If something was added, briefly show the cart then auto-close.
        if (next > prev) {
            setIsOpen(true);
            if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
            autoCloseTimerRef.current = setTimeout(() => {
                setIsOpen(false);
            }, 4000);
        }

        return () => {
            if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart.length]);

    return (
        <div ref={containerRef} className="relative shrink-0">
            <button
                type="button"
                onClick={toggleDropdown}
                className="tap-target relative inline-flex items-center justify-center rounded-lg p-2.5 text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 active:scale-95"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <ShoppingCart size={22} />
                {cart.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Cart"
                    className="absolute right-0 mt-2 w-[22rem] max-w-[calc(100vw-1rem)] bg-white shadow-xl rounded-2xl border border-gray-200 z-50 overflow-hidden"
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-bold tracking-wide text-gray-900">Your Cart</h3>
                        <button
                            type="button"
                            onClick={closeDropdown}
                            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-800 active:scale-95"
                            aria-label="Close cart"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    {cart.length === 0 ? (
                        <div className="px-4 py-6">
                            <p className="text-sm text-gray-600">Your cart is empty.</p>
                            <p className="mt-1 text-xs text-gray-500">Add items to see them here.</p>
                        </div>
                    ) : (
                        <>
                            <div className="max-h-72 overflow-y-auto px-4 py-3">
                                {cart.map((item) => (
                                    <div key={item.product.id} className="flex gap-3 py-3 border-b border-gray-100 items-center last:border-b-0">
                                        <Image
                                            src={resolveBackendImageSrc(item.product.imgOne, "/images/fallback-image.png")}
                                            alt={item.product.title}
                                            width={44}
                                            height={44}
                                            className="rounded-lg border border-gray-100 object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.quantity} × ₹{item.product.price}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.product.id)}
                                            className="inline-flex items-center justify-center rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                                            aria-label={`Remove ${item.product.title} from cart`}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-3 border-t border-gray-100">
                                <div className="flex justify-between items-center font-semibold text-gray-900">
                                    <span className="text-sm">Total</span>
                                    <span className="text-sm">₹{cartTotal}</span>
                                </div>
                                <Link
                                    onClick={() => setIsOpen(false)}
                                    href="/checkout"
                                    className="mt-3 block text-center w-full bg-brand-primary text-white py-2.5 rounded-xl font-semibold text-sm hover:opacity-95 active:scale-[0.99] transition"
                                >
                                    Checkout
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
