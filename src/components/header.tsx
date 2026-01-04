"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { BagIcon } from "@/components/ui/icons";

interface HeaderProps {
    categories?: string[];
    selectedCategory?: string;
    onCategoryChange?: (category: string) => void;
    onLogoClick?: () => void;
}

export default function Header({
    categories = [],
    selectedCategory = "ALL",
    onCategoryChange,
    onLogoClick
}: HeaderProps) {
    const cart = useCart();
    const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-5 bg-[#f9fafb] border-b border-gray-200/50">
            {/* Logo - Click to toggle grid */}
            <button
                onClick={onLogoClick}
                className="text-xl font-bold tracking-tighter uppercase flex-shrink-0 hover:opacity-50 transition-opacity"
            >
                YZY
            </button>

            {/* Category Filters - Center */}
            {categories.length > 0 && (
                <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-gray-400 font-[family-name:var(--font-share-tech)]">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat}
                            onClick={() => onCategoryChange?.(cat)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={`hover:text-black transition-colors tracking-wider ${selectedCategory === cat ? "text-black font-medium" : ""
                                }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </nav>
            )}

            {/* Mobile Categories - Show below on mobile */}
            {categories.length > 0 && (
                <nav className="md:hidden absolute left-0 right-0 top-full flex items-center justify-center gap-4 py-2 bg-white/95 backdrop-blur-md text-xs text-gray-400 font-[family-name:var(--font-share-tech)] border-b border-gray-100/50">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat}
                            onClick={() => onCategoryChange?.(cat)}
                            whileTap={{ scale: 0.97 }}
                            className={`hover:text-black transition-colors tracking-wider ${selectedCategory === cat ? "text-black font-medium" : ""
                                }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </nav>
            )}

            {/* Cart */}
            <Link href="/checkout" className="flex items-center gap-2 hover:opacity-50 transition-opacity group flex-shrink-0">
                <span
                    key={itemCount}
                    className="text-sm font-mono"
                >
                    {itemCount}
                </span>
                <BagIcon className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110" />
            </Link>
        </header>
    );
}
