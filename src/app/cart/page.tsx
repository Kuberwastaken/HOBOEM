"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { PRODUCTS } from "@/lib/products";
import { decodeCartData } from "@/lib/receipt-generator";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

function CartRestoreContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setItems } = useCart();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Restoring your cart...");
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

            if (!decoded || decoded.length === 0) {
                setStatus("error");
                setMessage("Invalid cart data");
                return;
            }

            // Convert decoded data to cart items
            const cartItems = decoded.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.id);
                if (!product) return null;
                return {
                    ...product,
                    quantity: item.quantity,
                    size: item.size,
                };
            }).filter(Boolean);

            if (cartItems.length === 0) {
                setStatus("error");
                setMessage("Products not found");
                return;
            }

            // Set cart items
            setItems(cartItems as any);
            setItemCount(cartItems.length);
            setStatus("success");
            setMessage(`Restored ${cartItems.length} item(s) to your cart!`);

            // Redirect to checkout after delay
            setTimeout(() => {
                router.push("/checkout");
            }, 2000);
        } catch {
            setStatus("error");
            setMessage("Failed to restore cart");
        }
    }, [searchParams, setItems, router]);

    return (
        <div className="text-center max-w-sm">
            {/* Logo */}
            <h1 className="text-3xl font-black tracking-[0.3em] mb-8">HOBOEM</h1>

            {/* Status Icon */}
            <div className="mb-6">
                {status === "loading" && (
                    <Loader2 className="w-12 h-12 text-gray-400 mx-auto animate-spin" />
                )}
                {status === "success" && (
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                )}
                {status === "error" && (
                    <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                )}
            </div>

            {/* Message */}
            <p className={`text-sm uppercase tracking-widest mb-4 ${status === "success" ? "text-green-600" :
                    status === "error" ? "text-red-600" :
                        "text-gray-500"
                }`}>
                {message}
            </p>

            {/* Actions */}
            {status === "success" && (
                <p className="text-xs text-gray-400">
                    Redirecting to checkout...
                </p>
            )}

            {status === "error" && (
                <div className="space-y-3">
                    <button
                        onClick={() => router.push("/")}
                        className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-black/90 transition-colors"
                    >
                        Go to Shop
                    </button>
                    <p className="text-[10px] text-gray-400">
                        The cart link may have expired or is invalid
                    </p>
                </div>
            )}
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="text-center max-w-sm">
            <h1 className="text-3xl font-black tracking-[0.3em] mb-8">HOBOEM</h1>
            <Loader2 className="w-12 h-12 text-gray-400 mx-auto animate-spin mb-6" />
            <p className="text-sm uppercase tracking-widest text-gray-500">
                Loading...
            </p>
        </div>
    );
}

export default function CartRestorePage() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <Suspense fallback={<LoadingFallback />}>
                <CartRestoreContent />
            </Suspense>
        </div>
    );
}
