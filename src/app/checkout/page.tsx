"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, Plus, Minus } from "lucide-react";
import { BagIcon } from "@/components/ui/icons";
import { useCart } from "@/context/cart-context";

export default function CheckoutPage() {
    const { items, total, addItem, removeItem, updateQuantity } = useCart();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [subscribe, setSubscribe] = useState(true);

    // Safe item count
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="min-h-screen bg-white text-black font-mono flex flex-col md:flex-row relative z-50 overflow-hidden"
        >
            {/* Header / Top Bar - Absolute */}
            <div className="absolute top-0 right-0 p-6 z-[60] flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                <span>YZY WALLET</span>
                <BagIcon className="w-4 h-4" />
                <span>{itemCount}</span>
            </div>

            {/* Left Column: Form Section */}
            <div className="flex-1 overflow-y-auto no-scrollbar h-screen p-6 md:p-12 lg:pl-20 lg:pr-12 pt-20 border-r border-gray-100">
                <div className="max-w-xl mx-auto md:mx-0 w-full">
                    {/* Back Link */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[10px] md:text-xs text-black/60 hover:text-black transition-colors mb-8 uppercase tracking-widest font-bold"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Return to Shop
                    </button>

                    {/* Express Checkout */}
                    <div className="mb-12">
                        <h2 className="text-[10px] font-bold mb-4 uppercase text-black/40 tracking-[0.2em]">Express Checkout</h2>
                        <button className="w-full bg-[#FFC439] hover:brightness-95 transition-all text-black h-12 rounded-[4px] flex items-center justify-center shadow-sm">
                            <span className="font-serif italic font-bold text-xl">PayPal</span>
                        </button>
                        <div className="relative mt-6 text-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <span className="relative bg-white px-4 text-[10px] text-gray-300 uppercase tracking-widest">
                                Or Continue Below
                            </span>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-10">
                        <h2 className="text-[10px] font-bold mb-4 uppercase text-black tracking-[0.2em] font-[family-name:var(--font-share-tech)]">Contact Information</h2>
                        <input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 px-4 border border-gray-200 text-sm placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors uppercase font-mono mb-4"
                        />
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 border border-gray-300 flex items-center justify-center transition-colors ${subscribe ? "bg-black border-black" : "bg-white"}`}>
                                <input
                                    type="checkbox"
                                    checked={subscribe}
                                    onChange={(e) => setSubscribe(e.target.checked)}
                                    className="hidden"
                                />
                                {subscribe && <div className="w-2 h-2 bg-white" />}
                            </div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wide group-hover:text-black transition-colors">
                                Subscribe to updates and notifications
                            </span>
                        </label>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-10">
                        <h2 className="text-[10px] font-bold mb-4 uppercase text-black tracking-[0.2em] font-[family-name:var(--font-share-tech)]">Shipping Address</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input type="text" placeholder="FIRST NAME" className="w-full h-12 px-4 border border-gray-200 text-sm placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors uppercase font-mono" />
                            <input type="text" placeholder="LAST NAME" className="w-full h-12 px-4 border border-gray-200 text-sm placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors uppercase font-mono" />
                        </div>
                        <input type="text" placeholder="ADDRESS" className="w-full h-12 px-4 border border-gray-200 text-sm placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors uppercase font-mono mb-4" />
                        <input type="text" placeholder="APARTMENT, SUITE, ETC. (OPTIONAL)" className="w-full h-12 px-4 border border-gray-200 text-sm placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors uppercase font-mono mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mb-4">
                            <input type="text" placeholder="CITY" className="w-full h-12 px-4 border border-gray-200 text-sm placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors uppercase font-mono" />
                            <div className="relative">
                                <select className="w-full h-12 px-4 border border-gray-200 text-sm text-black focus:outline-none focus:border-black transition-colors uppercase font-mono appearance-none bg-transparent cursor-pointer">
                                    <option>UNITED STATES</option>
                                    <option>CANADA</option>
                                    <option>UNITED KINGDOM</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-4">
                            <div className="relative">
                                <select className="w-full h-12 px-4 border border-gray-200 text-sm text-gray-300 focus:outline-none focus:border-black transition-colors uppercase font-mono appearance-none bg-transparent cursor-pointer">
                                    <option value="" disabled selected>STATE</option>
                                    <option>CA</option>
                                    <option>NY</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <input type="text" placeholder="ZIP CODE" className="w-full h-12 px-4 border border-gray-200 text-sm placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors uppercase font-mono" />
                            <input type="text" placeholder="PHONE" className="w-full h-12 px-4 border border-gray-200 text-sm placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors uppercase font-mono" />
                        </div>
                    </div>

                    {/* Payment Placeholder */}
                    <div className="mb-20">
                        <div className="border border-gray-300 p-8 text-center">
                            <p className="text-[10px] md:text-sm uppercase tracking-wide text-gray-600">
                                Please enter your information above to select a payment method
                            </p>
                        </div>
                        {/* Faux Payment Methods */}
                        <div className="mt-4 space-y-2 opacity-50 grayscale pointer-events-none select-none">
                            <div className="border border-gray-100 p-4 flex items-center gap-4">
                                <div className="w-6 h-4 bg-gray-200 rounded-sm"></div>
                                <span className="text-xs uppercase text-gray-400">CREDIT / DEBIT CARD</span>
                            </div>
                            <div className="border border-gray-100 p-4 flex items-center gap-4">
                                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                <span className="text-xs uppercase text-gray-400">USDC (CRYPTO)</span>
                            </div>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button className="w-full bg-black text-white h-14 uppercase tracking-[0.1em] font-bold text-sm hover:bg-black/90 transition-colors mb-8">
                        Continue to Shipping
                    </button>

                </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="hidden md:block w-[400px] lg:w-[480px] bg-white h-screen p-6 pt-20 lg:pr-20 overflow-y-auto no-scrollbar">
                <div className="max-w-xs mx-auto w-full sticky top-20">
                    <h2 className="text-[10px] font-bold mb-8 uppercase text-black/40 tracking-[0.2em]">Order Summary</h2>

                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-300 uppercase text-xs tracking-widest">
                            Your cart is empty
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {items.map((item, idx) => (
                                <div key={`${item.id}-${item.size}-${idx}`} className="flex gap-6">
                                    {/* Product Image */}
                                    <div className="relative w-20 h-24 bg-[#f9fafb] flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-contain p-2"
                                            sizes="80px"
                                        />
                                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                            {item.quantity}
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-sm uppercase leading-tight mb-1">{item.name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wide">SIZE: {item.size}</p>
                                            </div>
                                            <p className="font-bold text-sm text-right">${item.price}</p>
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            {/* Qty Controls */}
                                            <div className="flex items-center gap-3 text-xs bg-gray-50 px-2 py-1 rounded-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.size, -1)}
                                                    className="w-4 h-4 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                                                >
                                                    <Minus className="w-2.5 h-2.5" />
                                                </button>
                                                <span className="font-mono w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.size, 1)}
                                                    className="w-4 h-4 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                                                >
                                                    <Plus className="w-2.5 h-2.5" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id, item.size)}
                                                className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Totals */}
                    <div className="mt-12 pt-8 border-t border-dashed border-gray-200 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 uppercase tracking-wide text-xs">Subtotal</span>
                            <span className="font-bold font-mono">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 uppercase tracking-wide text-xs">Shipping</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Calculated at next step</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 uppercase tracking-wide text-xs">Taxes</span>
                            <span className="font-bold font-mono">$0.00</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-black flex justify-between items-end">
                        <span className="text-xl font-bold uppercase tracking-tight">Total</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs text-gray-400 uppercase mr-1">USD</span>
                            <span className="text-2xl font-bold font-mono tracking-tighter">${total.toFixed(2)}</span>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
