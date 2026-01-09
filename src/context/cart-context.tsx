"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/products";

interface CartItem extends Product {
    quantity: number;
    size?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, size?: string) => void;
    removeItem: (id: string, size?: string) => void;
    updateQuantity: (id: string, size: string | undefined, delta: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const saved = localStorage.getItem("cart");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem("cart", JSON.stringify(items));
        }
    }, [items, isClient]);

    const addItem = (product: Product, size?: string) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id && i.size === size);
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id && i.size === size
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...product, quantity: 1, size }];
        });
    };

    const removeItem = (id: string, size?: string) => {
        setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
    };

    const updateQuantity = (id: string, size: string | undefined, delta: number) => {
        setItems((prev) =>
            prev.map((i) => {
                if (i.id === id && i.size === size) {
                    const newQty = Math.max(0, i.quantity + delta);
                    return { ...i, quantity: newQty };
                }
                return i;
            }).filter((i) => i.quantity > 0)
        );
    };

    const clearCart = () => setItems([]);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
