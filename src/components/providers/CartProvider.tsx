"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { Product } from "@/const/productData";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isDbLoaded, setIsDbLoaded] = useState(false);

    // Initial load: Local storage
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Load from DB if user is logged in
    useEffect(() => {
        if (status === 'authenticated' && session?.user && !isDbLoaded) {
            const customerId = (session.user as { id?: string }).id || session.user.email;
            if (!customerId) return;

            fetch(`/api/carts?customerId=${customerId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data?.items?.length > 0) {
                        // Merge or replace cart from DB
                        // Simple approach: map db items to CartItem structure
                        const dbCart = data.data.items.map((it: { productId: number; title: string; price: string | number; slug: string; imgOne: string; quantity: number }) => ({
                            product: {
                                id: it.productId,
                                title: it.title || `Product #${it.productId}`,
                                price: parseFloat(String(it.price || 0)),
                                slug: it.slug,
                                imgOne: it.imgOne
                            },
                            quantity: it.quantity
                        }));
                        setCart(dbCart);
                    }
                    setIsDbLoaded(true);
                })
                .catch(err => console.error("Failed to fetch user cart", err));
        }
    }, [status, session, isDbLoaded]);

    // Save to local storage & DB
    useEffect(() => {
        // ALWAYS update local storage as fallback
        localStorage.setItem("cart", JSON.stringify(cart));

        // If logged in, sync to DB
        if (status === 'authenticated' && session?.user && isDbLoaded) {
            const customerId = (session.user as { id?: string }).id || session.user.email;
            if (!customerId) return;

            const payload = {
                customerId,
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    options: {}
                }))
            };

            fetch('/api/carts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(e => console.error("Failed to sync cart to DB", e));
        }
    }, [cart, status, session, isDbLoaded]);

    const addToCart = (product: Product, quantity: number = 1) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce(
        (total, item) => total + Number(item.product.price) * item.quantity,
        0
    );

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
