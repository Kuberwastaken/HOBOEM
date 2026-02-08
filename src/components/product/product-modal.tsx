"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/products";
import { useCart } from "@/context/cart-context";
import { useCurrency } from "@/context/currency-context";
import { CATEGORY_DISPLAY_NAMES, GENDER_DISPLAY_NAMES } from "@/lib/filter-config";
import { X, ChevronLeft, ChevronRight, ArrowLeft, ShoppingBag } from "lucide-react";

interface ProductModalProps {
    product: Product;
    onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
    const { addItem } = useCart();
    const { formatPrice } = useCurrency();
    const [viewState, setViewState] = useState<"VIEW" | "SELECT">("VIEW");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    // Image carousel logic - get images from variants
    const images = product.variants.map(v => v.image);
    const hasMultipleImages = images.length > 1;

    const goToPrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // Determine if this product has sizes
    const hasSizes = product.availableSizes && product.availableSizes.length > 0;
    const sizes = product.availableSizes || [];

    const handleSelectSize = (size: string) => {
        setIsAdding(true);
        addItem(product, size);
        setTimeout(() => onClose(), 400);
    };

    const handleAddWithoutSize = () => {
        setIsAdding(true);
        addItem(product, "ONE SIZE");
        setTimeout(() => onClose(), 400);
    };

    const toggleState = () => {
        if (hasSizes) {
            setViewState(viewState === "VIEW" ? "SELECT" : "VIEW");
        } else {
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
                    {/* Navigation Arrows - Only show if multiple images */}
                    <AnimatePresence>
                        {viewState === "VIEW" && hasMultipleImages && (
                            <>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 0.2 }}
                                    onClick={goToPrevImage}
                                    className="absolute left-0 md:left-4 p-4 hover:opacity-50 transition-opacity z-10"
                                >
                                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 0.2 }}
                                    onClick={goToNextImage}
                                    className="absolute right-0 md:right-4 p-4 hover:opacity-50 transition-opacity z-10"
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
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={images[currentImageIndex]}
                                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Dot Indicators - Only show if multiple images */}
                    {hasMultipleImages && viewState === "VIEW" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2"
                        >
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex
                                        ? "bg-black"
                                        : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                />
                            ))}
                        </motion.div>
                    )}
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
                            /* VIEW STATE - Clean minimal layout */
                            <motion.div
                                key="view"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="flex flex-col items-center gap-1"
                            >
                                {/* Product Name */}
                                <div className="text-center font-bold font-mono tracking-wider uppercase text-base md:text-lg">
                                    {product.name}
                                </div>

                                {/* Description - Between name and price */}
                                {product.description && (
                                    <div className="mt-1 flex flex-col items-center text-[9px] md:text-[10px] font-mono uppercase tracking-wide text-center text-gray-400 leading-snug max-w-[280px] md:max-w-xs">
                                        {product.description.split(';').slice(0, 4).map((line: string, idx: number) => (
                                            <span key={idx}>{line.trim()}</span>
                                        ))}
                                        {product.description.split(';').length > 4 && (
                                            <span className="text-gray-300">...</span>
                                        )}
                                    </div>
                                )}

                                {/* Price - Bolder */}
                                {product.price && (
                                    <div className="text-center font-mono text-sm font-bold mt-2">
                                        {formatPrice(product.price)}
                                    </div>
                                )}

                                {/* Add Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleState}
                                    disabled={isAdding}
                                    className={`mt-4 px-6 py-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase border-2 border-black transition-all ${isAdding ? "bg-black text-white" : "bg-transparent text-black hover:bg-black hover:text-white"
                                        }`}
                                    animate={isAdding ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isAdding ? "Added ✓" : hasSizes ? "Select Size" : "Add"}
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

                                {/* Price */}
                                {product.price && (
                                    <div className="font-mono text-sm font-bold">
                                        {formatPrice(product.price)}
                                    </div>
                                )}

                                {/* Description - Yeezy style multi-line */}
                                {product.description && (
                                    <div className="flex flex-col items-center gap-0 text-[9px] md:text-[10px] font-mono uppercase tracking-wider text-center text-gray-500 max-w-xs">
                                        {product.description.split(';').map((line: string, idx: number) => (
                                            <span key={idx} className="leading-relaxed">{line.trim()}</span>
                                        ))}
                                    </div>
                                )}

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
