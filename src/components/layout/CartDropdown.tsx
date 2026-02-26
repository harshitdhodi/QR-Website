"use client";

import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, X } from "react-feather";

export default function CartDropdown() {
    const { cart, removeFromCart, cartTotal } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative">
            <button onClick={toggleDropdown} className="relative p-2 text-gray-700 hover:text-blue-600">
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50 p-4">
                    <h3 className="text-lg font-semibold mb-3">Your Cart</h3>
                    {cart.length === 0 ? (
                        <p className="text-sm text-gray-500">Cart is empty.</p>
                    ) : (
                        <>
                            <div className="max-h-60 overflow-y-auto pr-2">
                                {cart.map((item) => (
                                    <div key={item.product.id} className="flex gap-3 mb-3 border-b pb-2 items-center">
                                        <Image src={item.product.imgOne} alt={item.product.title} width={40} height={40} className="rounded" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.title}</p>
                                            <p className="text-sm text-gray-500">{item.quantity} x ₹{item.product.price}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-3 font-semibold text-gray-900 border-t pt-2">
                                <span>Total:</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <Link onClick={() => setIsOpen(false)} href="/checkout" className="mt-3 block text-center w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                                Checkout
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
