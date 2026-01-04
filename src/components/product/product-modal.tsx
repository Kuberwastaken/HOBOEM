"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/products";
import { useCart } from "@/context/cart-context";
import { X, ChevronLeft, ChevronRight, Plus, ArrowLeft } from "lucide-react";

interface ProductModalProps {
    product: Product;
    onClose: () => void;
}

// Sizes matching the minimalist "1, 2, 3" aesthetic from the mockup
const SIZES = ["1", "2", "3"];

export function ProductModal({ product, onClose }: ProductModalProps) {
    const { addItem } = useCart();
    const [viewState, setViewState] = useState<"VIEW" | "SELECT">("VIEW");
    const [selectedSize, setSelectedSize] = useState<string>("");

    const handleSelectSize = (size: string) => {
        setSelectedSize(size);
        addItem(product, size);
        onClose();
    };

    const toggleState = () => {
        setViewState(viewState === "VIEW" ? "SELECT" : "VIEW");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
        >
            {/* White Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 bg-white"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{
                    duration: 0.4,
                    ease: [0.32, 0.72, 0, 1], // iOS-like spring easing
                }}
                className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8"
            >
                {/* Back Button - Top Left (VIEW state only) */}
                <AnimatePresence>
                    {viewState === "VIEW" && (
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2, delay: 0.15 }}
                            onClick={onClose}
                            className="absolute top-4 left-4 md:top-8 md:left-8 p-2 hover:opacity-50 transition-opacity z-10"
                        >
                            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Image Section */}
                <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center mb-12">
                    {/* Navigation Arrows */}
                    <AnimatePresence>
                        {viewState === "VIEW" && (
                            <>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute left-0 md:left-4 p-4 hover:opacity-50 transition-opacity"
                                >
                                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute right-0 md:right-4 p-4 hover:opacity-50 transition-opacity"
                                >
                                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                                </motion.button>
                            </>
                        )}
                    </AnimatePresence>

                    <motion.div
                        animate={{ scale: viewState === "SELECT" ? 0.9 : 1 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.32, 0.72, 0, 1],
                        }}
                        className="relative w-full max-w-md aspect-square"
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </motion.div>
                </div>

                {/* Controls Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="w-full max-w-md flex flex-col items-center justify-end pb-12 min-h-[150px]"
                >
                    <AnimatePresence mode="wait">
                        {viewState === "VIEW" ? (
                            /* VIEW STATE */
                            <motion.div
                                key="view"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="text-center font-bold font-mono tracking-wider uppercase text-lg">
                                    {product.name.split(' ').slice(0, 2).join(' ')}
                                </div>

                                <div className="text-center font-mono text-sm">
                                    ${product.price}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleState}
                                    className="mt-4 p-2"
                                >
                                    <Plus className="w-6 h-6" />
                                </motion.button>
                            </motion.div>
                        ) : (
                            /* SELECT SIZE STATE */
                            <motion.div
                                key="select"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="w-full flex flex-col items-center gap-6"
                            >
                                {/* Header Row */}
                                <div className="w-full flex justify-between items-center px-8 text-xs font-bold font-mono tracking-widest uppercase">
                                    <button className="hover:opacity-50">?</button>
                                    <span>SELECT SIZE</span>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleState}
                                        className="hover:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </motion.button>
                                </div>

                                <div className="font-mono text-sm font-bold">
                                    ${product.price}
                                </div>

                                {/* Sizes */}
                                <div className="flex items-center justify-center gap-12 md:gap-16 font-mono text-lg md:text-xl font-bold">
                                    {SIZES.map((size) => (
                                        <motion.button
                                            key={size}
                                            whileHover={{ scale: 1.25 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleSelectSize(size)}
                                            className="hover:opacity-50"
                                        >
                                            {size}
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="mt-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-black cursor-pointer transition-colors">
                                    Information
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
