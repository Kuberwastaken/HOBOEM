"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { BagIcon } from "@/components/ui/icons";
import {
    Category,
    Gender,
    Size,
    CATEGORIES,
    CATEGORY_DISPLAY_NAMES,
    GENDER_DISPLAY_NAMES,
    SIZES,
    CATEGORY_FILTER_CONFIG,
    getAvailableGenders,
} from "@/lib/filter-config";
import { Plus, Minus, Menu, X } from "lucide-react";

interface HeaderProps {
    selectedCategories: Category[];
    selectedGenders: Gender[];
    selectedSizes: Size[];
    productCount: number;
    totalCategoryCount: number;
    onCategoriesChange: (categories: Category[]) => void;
    onGendersChange: (genders: Gender[]) => void;
    onSizesChange: (sizes: Size[]) => void;
    onLogoClick?: () => void;
}

// Checkbox Component for Multi-Select
const Checkbox = ({ checked }: { checked: boolean }) => (
    <div className={`w-3 h-3 md:w-3.5 md:h-3.5 border border-black mr-2 flex items-center justify-center transition-colors ${checked ? "bg-black" : "bg-white"}`}>
        {checked && <X className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />}
    </div>
);

export default function Header({
    selectedCategories,
    selectedGenders,
    selectedSizes,
    productCount,
    totalCategoryCount,
    onCategoriesChange,
    onGendersChange,
    onSizesChange,
    onLogoClick,
}: HeaderProps) {
    const cart = useCart();
    const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Global Multi-Select Toggle
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

    // Local State for Menu (Deferred application)
    const [tempCategories, setTempCategories] = useState<Category[]>(selectedCategories);
    const [tempGenders, setTempGenders] = useState<Gender[]>(selectedGenders);
    const [tempSizes, setTempSizes] = useState<Size[]>(selectedSizes);

    // Sync local state when menu opens
    useEffect(() => {
        if (isMenuOpen) {
            setTempCategories(selectedCategories);
            setTempGenders(selectedGenders);
            setTempSizes(selectedSizes);
        }
    }, [isMenuOpen, selectedCategories, selectedGenders, selectedSizes]);

    const handleApply = () => {
        onCategoriesChange(tempCategories);
        onGendersChange(tempGenders);
        onSizesChange(tempSizes);
        setIsMenuOpen(false);
    };

    // Helper: Toggle Selection Logic
    const toggleList = <T,>(list: T[], item: T, canBeEmpty: boolean = true): T[] => {
        if (isMultiSelectMode) {
            // Multi-Select: Toggle
            if (list.includes(item)) {
                const newList = list.filter(i => i !== item);
                // If removing makes it empty and not allowed, handle?
                // For now, allow empty (which might mean "ALL" relative to global logic, but we handle empty arrays in page)
                return newList;
            }
            // Support selecting "ALL" in Multi Mode?
            // Usually "ALL" clears list.
            if (item === "ALL" as unknown as T) return ["ALL" as unknown as T];

            // If adding regular item, remove "ALL" if present
            const cleanList = list.filter(i => i !== "ALL" as unknown as T);
            return [...cleanList, item];
        } else {
            // Single Select: Replace
            // If clicking same item? Replace.
            return [item];
        }
    };

    const handleTempCategoryChange = (cat: Category) => {
        const newList = toggleList(tempCategories, cat);
        setTempCategories(newList);
        // If single select, we normally clear filters.
        // If multi select, arguably we keep them? 
        // For simplicity: Clear filters if switching in Single Mode. Keep in Multi?
        if (!isMultiSelectMode) {
            setTempGenders([]);
            setTempSizes([]);
        }
    };

    const handleDesktopCategoryChange = (cat: Category) => {
        const newList = toggleList(selectedCategories, cat);
        onCategoriesChange(newList);
        if (!isMultiSelectMode) {
            onGendersChange([]);
            onSizesChange([]);
        }
    };

    // Helpers to resolve available filters based on current *Set* of categories
    const getDerivedFilters = (categories: Category[]) => {
        // If "ALL" is selected, we assume basically everything? Or specific ALL logic?
        // Current config: ALL has no specific config.
        // We iterate over specific categories selected.
        // If list is empty or ["ALL"], show ALL filters? Or "ALL" means all categories.
        // Let's assume if ["ALL"], we show everything.
        const effectiveCats = (categories.includes("ALL") || categories.length === 0)
            ? CATEGORIES
            : categories;

        const hasGender = effectiveCats.some(c => CATEGORY_FILTER_CONFIG[c]?.hasGender);
        const hasSize = effectiveCats.some(c => CATEGORY_FILTER_CONFIG[c]?.hasSize);
        // Union of available keys
        const availableGenders = Array.from(new Set(
            effectiveCats.flatMap(c => getAvailableGenders(c))
        ));

        return { hasGender, hasSize, availableGenders };
    };

    const menuFilters = getDerivedFilters(tempCategories);
    const desktopFilters = getDerivedFilters(selectedCategories);

    // Categories Slicing
    const midPoint = Math.ceil(CATEGORIES.length / 2);
    const topRowCategories = CATEGORIES.slice(0, midPoint);
    const bottomRowCategories = CATEGORIES.slice(midPoint);

    return (
        <header className="sticky top-0 z-50 bg-[#f9fafb]">
            {/* 1. Navbar Top Row */}
            <div className="flex items-center justify-between px-3 py-5 relative max-w-[1920px] mx-auto w-full">

                {/* Logo */}
                <div className="flex items-center gap-4 flex-shrink-0 w-[100px] md:w-[200px] z-[70]">
                    <button
                        onClick={() => {
                            if (onLogoClick) onLogoClick();
                            setIsMenuOpen(false);
                        }}
                        className="text-lg md:text-xl font-bold tracking-tighter uppercase hover:opacity-50 transition-opacity"
                    >
                        HOBOEM
                    </button>
                </div>

                {/* Categories - Desktop Only - Absolute Center */}
                <div className="hidden md:flex flex-col items-center gap-1.5 absolute left-1/2 -translate-x-1/2 text-[10px] md:text-[11px] text-gray-400 font-[family-name:var(--font-share-tech)]">
                    <div className="flex items-center gap-6 md:gap-8 justify-center">
                        {topRowCategories.map((cat) => (
                            <motion.button
                                key={cat}
                                onClick={() => handleDesktopCategoryChange(cat)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`uppercase transition-colors tracking-widest flex items-center ${selectedCategories.includes(cat) ? "text-black font-bold" : "hover:text-black"
                                    }`}
                            >
                                {isMultiSelectMode && <Checkbox checked={selectedCategories.includes(cat)} />}
                                {CATEGORY_DISPLAY_NAMES[cat]}
                            </motion.button>
                        ))}
                    </div>
                    <div className="flex items-center gap-6 md:gap-8 justify-center">
                        {bottomRowCategories.map((cat) => (
                            <motion.button
                                key={cat}
                                onClick={() => handleDesktopCategoryChange(cat)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`uppercase transition-colors tracking-widest flex items-center ${selectedCategories.includes(cat) ? "text-black font-bold" : "hover:text-black"
                                    }`}
                            >
                                {isMultiSelectMode && <Checkbox checked={selectedCategories.includes(cat)} />}
                                {CATEGORY_DISPLAY_NAMES[cat]}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center justify-end gap-3 md:gap-6 w-[100px] md:w-[200px] z-[70]">
                    {/* Desktop Filter Toggle */}
                    {(desktopFilters.hasGender || desktopFilters.hasSize) && (
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`hidden md:flex items-center gap-2 px-2 md:px-2.5 py-1 md:py-1.5 rounded-sm transition-all text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase border ${isFilterOpen
                                ? "bg-black text-white border-black"
                                : "bg-transparent text-black border-gray-300 hover:border-black"
                                }`}
                        >
                            <span>Filter</span>
                            {isFilterOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-1"
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Cart */}
                    <Link
                        href="/checkout"
                        className="flex items-center gap-2 hover:opacity-50 transition-opacity group flex-shrink-0"
                    >
                        <span key={itemCount} className="text-xs md:text-sm font-mono">
                            {itemCount}
                        </span>
                        <BagIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </Link>
                </div>
            </div>

            {/* Mobile Hamburger Menu Overlay - INDUSTRIAL / SPREADSHEET STYLE */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-[60px] bg-white z-[60] flex flex-col md:hidden"
                    >
                        <div className="flex flex-col flex-1 overflow-y-auto">
                            {/* Categories Section */}
                            <div className="px-3 pb-2 pt-2 flex justify-between items-center">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Categories</span>
                                {/* Mobile Multi-Select Toggle */}
                                <button
                                    onClick={() => setIsMultiSelectMode(!isMultiSelectMode)}
                                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono"
                                >
                                    <div className={`w-3 h-3 border border-black flex items-center justify-center ${isMultiSelectMode ? "bg-black" : "bg-white"}`}>
                                    </div>
                                    Multi Select
                                </button>
                            </div>
                            <div className="grid grid-cols-2 border-t border-gray-200">
                                {CATEGORIES.map((cat, index) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleTempCategoryChange(cat)}
                                        className={`flex items-center justify-center p-4 text-xs font-mono uppercase tracking-widest transition-colors border-b border-r border-gray-200 rounded-none ${(index + 1) % 2 === 0 ? "border-r-0" : ""
                                            } ${tempCategories.includes(cat) ? "bg-black text-white" : "text-black hover:bg-gray-50"
                                            }`}
                                    >
                                        {isMultiSelectMode && <Checkbox checked={tempCategories.includes(cat)} />}
                                        {CATEGORY_DISPLAY_NAMES[cat]}
                                    </button>
                                ))}
                            </div>

                            {/* Filters Section */}
                            {(menuFilters.hasGender || menuFilters.hasSize) && (
                                <div className="flex flex-col gap-6 pt-8 px-3 mt-4">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Filters</span>

                                    {/* Gender Filters */}
                                    {menuFilters.hasGender && (
                                        <div className="flex flex-col gap-3">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Gender</span>
                                            <div className="flex flex-wrap">
                                                <button
                                                    onClick={() => setTempGenders(toggleList(tempGenders, "ALL" as unknown as Gender))} // Fix casting for ALL logic? Or specific reset
                                                    // "ALL" in Multi select usually maps to Empty Array in page logic.
                                                    // Here simply clearing selection.
                                                    className={`flex-1 min-w-[30%] px-2 py-3 text-[10px] font-mono uppercase tracking-widest border border-gray-300 transition-colors rounded-none -ml-[1px] first:ml-0 -mt-[1px] first:mt-0 ${tempGenders.length === 0 ? "bg-black text-white border-black z-10" : "text-gray-500 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    All
                                                </button>
                                                {menuFilters.availableGenders.map((gender) => (
                                                    <button
                                                        key={gender}
                                                        onClick={() => setTempGenders(toggleList(tempGenders, gender))}
                                                        className={`flex-1 min-w-[30%] px-2 py-3 text-[10px] font-mono uppercase tracking-widest border border-gray-300 transition-colors rounded-none -ml-[1px] -mt-[1px] flex items-center justify-center ${tempGenders.includes(gender) ? "bg-black text-white border-black z-10" : "text-gray-500 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {isMultiSelectMode && <Checkbox checked={tempGenders.includes(gender)} />}
                                                        {GENDER_DISPLAY_NAMES[gender]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Size Filters */}
                                    {menuFilters.hasSize && (
                                        <div className="flex flex-col gap-3">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Size</span>
                                            <div className="flex flex-wrap">
                                                <button
                                                    onClick={() => setTempSizes([])}
                                                    className={`flex-1 min-w-[14%] px-2 py-3 text-[10px] font-mono uppercase tracking-widest border border-gray-300 transition-colors rounded-none -ml-[1px] first:ml-0 -mt-[1px] first:mt-0 ${tempSizes.length === 0 ? "bg-black text-white border-black z-10" : "text-gray-500 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    All
                                                </button>
                                                {SIZES.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setTempSizes(toggleList(tempSizes, size))}
                                                        className={`flex-1 min-w-[14%] px-2 py-3 text-[10px] font-mono uppercase tracking-widest border border-gray-300 transition-colors rounded-none -ml-[1px] -mt-[1px] flex items-center justify-center ${tempSizes.includes(size) ? "bg-black text-white border-black z-10" : "text-gray-500 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {isMultiSelectMode && <Checkbox checked={tempSizes.includes(size)} />}
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="h-24"></div>
                        </div>

                        {/* Apply Button Footer */}
                        <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <button
                                onClick={handleApply}
                                className="w-full bg-black text-white py-4 text-xs font-mono font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors"
                            >
                                Apply Selection
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Filter Bar */}
            <AnimatePresence>
                {isFilterOpen && (desktopFilters.hasGender || desktopFilters.hasSize) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="hidden md:block overflow-hidden bg-[#f5f5f5]"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between px-1.5 md:px-3 py-4 md:py-8 relative max-w-[1920px] mx-auto w-full gap-3 md:gap-0">

                            {/* Product Count */}
                            <div className="hidden md:flex items-center justify-start w-[200px] order-1">
                                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                                    {productCount}/{totalCategoryCount} Items
                                </div>
                            </div>

                            {/* Filters Container */}
                            <div className="static md:absolute md:left-1/2 md:-translate-x-1/2 flex flex-col md:flex-row items-center gap-2 md:gap-16 order-2 w-full md:w-auto">
                                {/* Gender Filters */}
                                {desktopFilters.hasGender && (
                                    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
                                        <motion.button
                                            onClick={() => onGendersChange([])}
                                            whileTap={{ scale: 0.95 }}
                                            className={`text-[9px] md:text-[10px] md:text-xs uppercase tracking-[0.2em] transition-colors ${selectedGenders.length === 0
                                                ? "text-black font-bold"
                                                : "text-gray-400 hover:text-black"
                                                }`}
                                        >
                                            All
                                        </motion.button>
                                        {desktopFilters.availableGenders.map((gender) => (
                                            <motion.button
                                                key={gender}
                                                onClick={() => onGendersChange(toggleList(selectedGenders, gender))}
                                                whileTap={{ scale: 0.95 }}
                                                className={`text-[9px] md:text-[10px] md:text-xs uppercase tracking-[0.2em] transition-colors flex items-center ${selectedGenders.includes(gender)
                                                    ? "text-black font-bold"
                                                    : "text-gray-400 hover:text-black"
                                                    }`}
                                            >
                                                {isMultiSelectMode && <Checkbox checked={selectedGenders.includes(gender)} />}
                                                {GENDER_DISPLAY_NAMES[gender]}
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {/* Divider */}
                                {desktopFilters.hasGender && desktopFilters.hasSize && (
                                    <div className="hidden md:block text-gray-400 font-bold tracking-widest text-[10px]">
                                        //
                                    </div>
                                )}

                                {/* Size Filters */}
                                {desktopFilters.hasSize && (
                                    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 md:mt-0">
                                        <motion.button
                                            onClick={() => onSizesChange([])}
                                            whileTap={{ scale: 0.95 }}
                                            className={`text-[9px] md:text-[10px] md:text-xs uppercase tracking-[0.2em] transition-colors ${selectedSizes.length === 0
                                                ? "text-black font-bold"
                                                : "text-gray-400 hover:text-black"
                                                }`}
                                        >
                                            All
                                        </motion.button>
                                        {SIZES.map((size) => (
                                            <motion.button
                                                key={size}
                                                onClick={() => onSizesChange(toggleList(selectedSizes, size))}
                                                whileTap={{ scale: 0.95 }}
                                                className={`text-[9px] md:text-[10px] md:text-xs uppercase tracking-[0.2em] transition-colors min-w-[16px] md:min-w-[20px] text-center flex items-center ${selectedSizes.includes(size)
                                                    ? "text-black font-bold"
                                                    : "text-gray-400 hover:text-black"
                                                    }`}
                                            >
                                                {isMultiSelectMode && <Checkbox checked={selectedSizes.includes(size)} />}
                                                {size}
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Balance Spacer WITH MULTI SELECT TOGGLE */}
                            <div className="hidden md:flex items-center justify-end w-[200px] order-3">
                                <button
                                    onClick={() => setIsMultiSelectMode(!isMultiSelectMode)}
                                    className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest hover:opacity-50 transition-opacity h-full"
                                >
                                    <div className={`w-3 h-3 border border-black flex items-center justify-center ${isMultiSelectMode ? "bg-black" : "bg-white"}`}>
                                    </div>
                                    Multi Select
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
