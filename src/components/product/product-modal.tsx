"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/products";
import { useCart } from "@/context/cart-context";
import { shouldShowSizeFilter, CATEGORY_DISPLAY_NAMES, GENDER_DISPLAY_NAMES } from "@/lib/filter-config";
import { X, ChevronLeft, ChevronRight, Plus, ArrowLeft, ShoppingBag } from "lucide-react";

interface ProductModalProps {
    product: Product;
    onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
    const { addItem } = useCart();
    const [viewState, setViewState] = useState<"VIEW" | "SELECT">("VIEW");

    // Determine if this product has sizes
    const hasSizes = product.availableSizes && product.availableSizes.length > 0;
    const sizes = product.availableSizes || [];

    const handleSelectSize = (size: string) => {
        addItem(product, size);
        onClose();
    };

    const handleAddWithoutSize = () => {
        addItem(product, "ONE SIZE");
        onClose();
    };

    const toggleState = () => {
        if (hasSizes) {
            setViewState(viewState === "VIEW" ? "SELECT" : "VIEW");
        } else {
            // No sizes - add directly
            handleAddWithoutSize();
        }
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
                    ease: [0.32, 0.72, 0, 1],
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
                    className="w-full max-w-md flex flex-col items-center justify-end pb-12 min-h-[180px]"
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
                                className="flex flex-col items-center gap-3"
                            >
                                {/* Product Name */}
                                <div className="text-center font-bold font-mono tracking-wider uppercase text-lg">
                                    {product.name}
                                </div>

                                {/* Category & Gender Badge */}
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest">
                                    <span>{CATEGORY_DISPLAY_NAMES[product.category]}</span>
                                    {product.gender && (
                                        <>
                                            <span>•</span>
                                            <span>{GENDER_DISPLAY_NAMES[product.gender]}</span>
                                        </>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="text-center font-mono text-sm">
                                    ${product.price}
                                </div>

                                {/* Add Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleState}
                                    className="mt-4 p-2"
                                    title={hasSizes ? "Select Size" : "Add to Cart"}
                                >
                                    {hasSizes ? (
                                        <Plus className="w-6 h-6" />
                                    ) : (
                                        <ShoppingBag className="w-6 h-6" />
                                    )}
                                </motion.button>

                                {/* Size availability hint */}
                                {hasSizes && (
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                                        {sizes.length} sizes available
                                    </div>
                                )}
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
                                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono text-sm md:text-base font-bold">
                                    {sizes.map((size) => (
                                        <motion.button
                                            key={size}
                                            whileHover={{ scale: 1.15 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleSelectSize(size)}
                                            className="hover:opacity-50 min-w-[40px] h-10 flex items-center justify-center border border-gray-200 rounded-sm hover:border-black transition-colors"
                                        >
                                            {size}
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="mt-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-black cursor-pointer transition-colors">
                                    Size Guide
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
