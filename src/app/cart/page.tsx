"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { PRODUCTS } from "@/lib/products";
import { decodeCartData } from "@/lib/receipt-generator";

type Status = "loading" | "success" | "error";

const StatusDisplay = ({ status, message, itemCount }: { status: Status; message: string; itemCount: number }) => {
    const icons = { loading: "⋯", success: "✓", error: "×" };
    const colors = { loading: "text-black/60", success: "text-black", error: "text-black/40" };

    return (
        <div className="text-center">
            <span className="text-8xl md:text-9xl font-black block mb-8 opacity-20">{icons[status]}</span>
            <h1 className={`text-3xl md:text-5xl font-black uppercase tracking-tight ${colors[status]}`}>
                {status === "loading" ? "Restoring" : status === "success" ? "Success" : "Failed"}
            </h1>
            <p className="text-black/40 text-sm uppercase tracking-widest mt-4">{message}</p>
            {status === "success" && <p className="text-black/20 text-xs mt-6">Redirecting...</p>}
        </div>
    );
};

function CartRestoreContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setItems } = useCart();
    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("Scanning receipt data...");
    const [itemCount, setItemCount] = useState(0);

    useEffect(() => {
        const data = searchParams.get("data");

        if (!data) {
            setStatus("error");
            setMessage("No cart data found");
            return;
        }

        try {
            const decoded = decodeCartData(data);
            if (!decoded?.length) throw new Error("Invalid data");

            const cartItems = decoded
                .map(item => {
                    const product = PRODUCTS.find(p => p.id === item.id);
                    return product ? { ...product, quantity: item.quantity, size: item.size } : null;
                })
                .filter(Boolean);

            if (!cartItems.length) throw new Error("Products not found");

            setItems(cartItems as any);
            setItemCount(cartItems.length);
            setStatus("success");
            setMessage(`${cartItems.length} item${cartItems.length > 1 ? "s" : ""} restored`);
            setTimeout(() => router.push("/checkout"), 1500);
        } catch {
            setStatus("error");
            setMessage("Failed to decode cart");
        }
    }, [searchParams, setItems, router]);

    return (
        <div className="min-h-screen bg-black text-white font-mono flex flex-col">
            <nav className="px-6 py-6 flex justify-between text-[10px] uppercase tracking-[0.3em] text-white/40">
                <Link href="/" className="hover:text-white transition-colors">HOBOEM</Link>
                <span>Cart Restore</span>
            </nav>

            <div className="flex-1 flex items-center justify-center px-6">
                <StatusDisplay status={status} message={message} itemCount={itemCount} />
            </div>

            {status === "error" && (
                <div className="p-6 text-center">
                    <Link href="/" className="inline-block bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-widest">
                        Browse Shop
                    </Link>
                </div>
            )}

            <div className="p-6 text-center text-[10px] uppercase tracking-[0.3em] text-white/20">
                HOBOEM © 2026
            </div>
        </div>
    );
}

export default function CartRestorePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-px bg-white/20 animate-pulse" />
            </div>
        }>
            <CartRestoreContent />
        </Suspense>
    );
}
