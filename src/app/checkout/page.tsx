"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { BagIcon } from "@/components/ui/icons";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, total, removeItem } = useCart();
    const [showSummaryMobile, setShowSummaryMobile] = useState(false);
    const router = useRouter();

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
            }}
            className="min-h-screen bg-white text-black font-mono flex flex-col md:flex-row fixed inset-0 z-50"
        >
            {/* Left Column: Form */}
            <div className="flex-1 p-6 md:p-12 lg:p-20 border-r border-gray-100">
                <div className="flex justify-between items-center mb-8 md:hidden">
                    <Link href="/" className="text-xl font-bold">YZY</Link>
                    <button
                        className="flex items-center gap-2"
                        onClick={() => setShowSummaryMobile(!showSummaryMobile)}
                    >
                        <BagIcon className="w-5 h-5" />
                        <span>{items.length}</span>
                    </button>
                </div>

                {/* Mobile Summary Toggle */}
                {showSummaryMobile && (
                    <div className="mb-8 border-b border-gray-100 pb-8 md:hidden">
                        <h3 className="text-xs font-bold mb-4 uppercase tracking-widest text-gray-400">Order Summary</h3>
                        {items.length === 0 ? (
                            <div className="text-gray-400 text-sm">YOUR CART IS EMPTY</div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item, idx) => (
                                    <div key={`${item.id}-${idx}`} className="flex gap-4">
                                        <div className="relative w-16 h-20 bg-gray-50 flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 text-sm">
                                            <p className="font-bold">{item.name}</p>
                                            <p className="text-gray-500 text-xs">SIZE: {item.size || "M"}</p>
                                        </div>
                                        <div className="text-sm font-bold">${item.price * item.quantity}</div>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold pt-4 border-t border-gray-100">
                                    <span>Total</span>
                                    <span>${total}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="mb-8 hidden md:block">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-xs text-gray-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        RETURN TO SHOP
                    </button>
                </div>

                <h2 className="text-xs font-bold mb-4 uppercase text-gray-400 tracking-widest">Express Checkout</h2>
                <button className="w-full bg-[#ffc439] hover:bg-[#f2ba36] text-black font-bold py-3 rounded mb-8 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                    <span className="italic font-serif font-bold text-lg">PayPal</span>
                </button>

                <div className="relative mb-8 text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <span className="relative bg-white px-2 text-xs text-gray-400 uppercase tracking-widest">Or continue below</span>
                </div>

                <form className="space-y-8">
                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xs font-bold mb-4 uppercase tracking-widest text-gray-900">Contact Information</h3>
                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors uppercase placeholder:text-gray-400 font-mono"
                            />
                            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                                <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                                <span className="uppercase tracking-wide">Subscribe to updates and notifications</span>
                            </label>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                        <h3 className="text-xs font-bold mb-4 uppercase tracking-widest text-gray-900">Shipping Address</h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors uppercase placeholder:text-gray-400 font-mono" placeholder="FIRST NAME" />
                                <input className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors uppercase placeholder:text-gray-400 font-mono" placeholder="LAST NAME" />
                            </div>
                            <input className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors uppercase placeholder:text-gray-400 font-mono" placeholder="ADDRESS" />
                            <input className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors uppercase placeholder:text-gray-400 font-mono" placeholder="APARTMENT, SUITE, ETC. (OPTIONAL)" />
                            <div className="grid grid-cols-2 gap-3">
                                <input className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors uppercase placeholder:text-gray-400 font-mono" placeholder="CITY" />
                                <div className="relative">
                                    <select className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors uppercase font-mono appearance-none bg-white">
                                        <option>UNITED STATES</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="relative col-span-1">
                                    <select className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors uppercase font-mono appearance-none bg-white text-gray-500">
                                        <option>STATE</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="gray" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <input className="col-span-1 w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors uppercase placeholder:text-gray-400 font-mono" placeholder="ZIP CODE" />
                                <input className="col-span-1 w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors uppercase placeholder:text-gray-400 font-mono items-center justify-center text-center" placeholder="PHONE" />
                            </div>
                        </div>
                    </div>

                    <button type="button" className="w-full bg-black text-white hover:bg-gray-900 font-bold py-4 text-sm mt-8 transition-all tracking-[0.2em] uppercase">
                        CONTINUE TO SHIPPING
                    </button>
                </form>
            </div>

            {/* Right Column: Order Summary (Desktop) */}
            <div className="w-full md:w-[450px] bg-gray-50 p-6 md:p-12 lg:p-20 border-l border-gray-100 hidden md:block">
                <h3 className="text-xs font-bold mb-8 uppercase tracking-widest text-gray-400">Order Summary</h3>

                {items.length === 0 ? (
                    <div className="text-gray-400 text-sm">YOUR CART IS EMPTY</div>
                ) : (
                    <div className="space-y-6 mb-8 border-b border-gray-200 pb-8">
                        {items.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="flex gap-4 group relative items-start">
                                <div className="w-20 h-24 bg-white relative flex-shrink-0 border border-gray-100">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-2"
                                        unoptimized
                                    />
                                    <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {item.quantity}
                                    </div>
                                </div>
                                <div className="flex-1 text-sm pt-1">
                                    <p className="font-bold uppercase tracking-wide">{item.name}</p>
                                    <p className="text-gray-500 text-xs font-mono mt-1">SIZE: {item.size || "M"}</p>
                                    <p className="text-gray-500 text-xs font-mono uppercase mt-0.5">Color: Black</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-sm font-bold">${item.price * item.quantity}</div>
                                    <button
                                        onClick={() => removeItem(item.id, item.size)}
                                        className="text-[10px] text-gray-400 hover:text-red-500 mt-2 uppercase"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-2 text-sm mt-8 pt-8 border-t border-gray-200">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-bold">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span className="text-gray-400 text-xs">CALCULATED AT NEXT STEP</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Taxes</span>
                        <span className="font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200 mt-4">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
