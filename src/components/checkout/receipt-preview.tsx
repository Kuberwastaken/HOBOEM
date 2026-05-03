"use client";

import React, { forwardRef, useEffect, useState } from "react";
import Image from "next/image";
import { thumbUrl } from "@/lib/cdn";
import { Plus, Minus, X } from "lucide-react";
import { generateReceiptId, generateQRCode } from "@/lib/receipt-generator";
import { useCart } from "@/context/cart-context";
import { useCurrency } from "@/context/currency-context";

interface CartItem {
    id: string;
    name: string;
    images: string[];
    variants: { image: string }[];
    size?: string;
    quantity: number;
    price?: number;
}

interface ReceiptPreviewProps {
    items: CartItem[];
    interactive?: boolean;
}

export const ReceiptPreview = forwardRef<HTMLDivElement, ReceiptPreviewProps>(
    function ReceiptPreview({ items, interactive = false }, ref) {
        const { updateQuantity, removeItem } = useCart();
        const { formatPrice } = useCurrency();
        const [receiptId] = useState(() => generateReceiptId());
        const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
        const [currentDate] = useState(() => {
            const now = new Date();
            return now.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        });
        const [currentTime] = useState(() => {
            const now = new Date();
            return now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
            });
        });

        // Calculate totals
        const subtotal = items.reduce((acc, item) => {
            return acc + (item.price || 0) * item.quantity;
        }, 0);

        // Generate QR code on mount / items change
        useEffect(() => {
            const cartData = items.map((item) => ({
                id: item.id,
                size: item.size,
                quantity: item.quantity,
            }));
            generateQRCode(cartData).then(setQrCodeUrl).catch(console.error);
        }, [items]);

        if (items.length === 0) {
            return (
                <div
                    ref={ref}
                    className="bg-white border border-dashed border-gray-300 p-8 text-center min-h-[300px] flex flex-col items-center justify-center"
                >
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                        Your cart is empty
                    </p>
                    <p className="text-[10px] text-gray-300">
                        Add items to generate receipt
                    </p>
                </div>
            );
        }

        return (
            <div
                ref={ref}
                className="bg-white border border-gray-200 shadow-sm font-mono text-black w-full"
            >
                {/* Header */}
                <div className="border-b border-dashed border-gray-300 p-4 text-center">
                    <h1 className="text-xl md:text-2xl font-black tracking-[0.3em] mb-1">HOBOEM</h1>
                    <p className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-widest">
                        Premium Fashion & Accessories
                    </p>
                </div>

                {/* Receipt Info */}
                <div className="border-b border-dashed border-gray-300 px-3 md:px-4 py-2 flex justify-between text-[9px] md:text-[10px] text-gray-600">
                    <div>
                        <span className="uppercase tracking-wide">Receipt</span>
                        <p className="font-bold text-black text-[10px]">{receiptId}</p>
                    </div>
                    <div className="text-right">
                        <span className="uppercase tracking-wide">Date</span>
                        <p className="font-bold text-black">{currentDate}</p>
                    </div>
                </div>

                {/* Items */}
                <div className="border-b border-dashed border-gray-300 p-3 md:p-4">
                    <div className="space-y-3">
                        {items.map((item, idx) => (
                            <div
                                key={`${item.id}-${item.size}-${idx}`}
                                className="flex gap-2 md:gap-3 items-start"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gray-50 flex-shrink-0">
                                    <Image
                                        src={thumbUrl(item.variants[0]?.image || '')}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-1"
                                        sizes="48px"
                                    />
                                </div>
                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] md:text-xs font-bold uppercase truncate leading-tight">
                                        {item.name}
                                    </p>
                                    <p className="text-[9px] text-gray-500">
                                        {item.size ? `Size: ${item.size}` : "One Size"}
                                    </p>

                                    {/* Interactive controls */}
                                    {interactive && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.size, -1)}
                                                className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-xs font-bold min-w-[24px] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.size, 1)}
                                                className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.id, item.size)}
                                                className="ml-auto w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Non-interactive quantity display */}
                                    {!interactive && (
                                        <p className="text-[9px] text-gray-400">×{item.quantity}</p>
                                    )}
                                </div>
                                {/* Price */}
                                <div className="text-right flex-shrink-0">
                                    <p className="text-[10px] md:text-xs font-bold">
                                        {item.price ? formatPrice(item.price * item.quantity) : "—"}
                                    </p>
                                    <p className="text-[9px] md:text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">
                                        {item.quantity} × {item.price ? formatPrice(item.price) : "—"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totals */}
                <div className="border-b border-dashed border-gray-300 p-3 md:p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm font-black uppercase tracking-wide">Total</span>
                        <span className="text-base md:text-lg font-black">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="text-right mt-1">
                        <span className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest">+ GST + SHIPPING</span>
                    </div>
                </div>

                {/* QR Code & Footer */}
                <div className="p-3 md:p-4 flex items-end justify-between gap-2">
                    {/* QR Code */}
                    <div className="flex flex-col items-center flex-shrink-0">
                        {qrCodeUrl && (
                            <img
                                src={qrCodeUrl}
                                alt="Cart QR Code"
                                className="w-12 h-12 md:w-14 md:h-14"
                            />
                        )}
                        <p className="text-[7px] md:text-[8px] text-gray-400 mt-1">Scan to restore</p>
                    </div>
                    {/* Footer text */}
                    <div className="text-right">
                        <p className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-wider">
                            Thank you!
                        </p>
                        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-0.5">
                            hoboem.com
                        </p>
                    </div>
                </div>
            </div>
        );
    }
);
