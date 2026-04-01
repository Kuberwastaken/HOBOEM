"use client";

import Link from "next/link";
import { FocusEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import {
    Category,
    CategorySubcategory,
    CATEGORIES,
    CATEGORY_DISPLAY_NAMES,
    Gender,
    getCategorySubcategories,
    ProductSort,
    PRODUCT_SORT_DISPLAY_NAMES,
} from "@/lib/filter-config";

interface HeaderProps {
    selectedCategories: Category[];
    selectedGenders: Gender[];
    selectedSubcategoryId: string | null;
    productCount: number;
    totalCategoryCount: number;
    sortOrder: ProductSort;
    onCategoriesChange: (categories: Category[]) => void;
    onGendersChange: (genders: Gender[]) => void;
    onSubcategoryChange: (subcategoryId: string | null) => void;
    onSortChange: (sortOrder: ProductSort) => void;
    onLogoClick?: () => void;
}

const SORT_OPTIONS: ProductSort[] = ["FEATURED", "PRICE_ASC", "PRICE_DESC"];

function Checkbox({ checked }: { checked: boolean }) {
    return (
        <span className={`mr-2 flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center border border-current ${checked ? "bg-black text-white" : "bg-white text-transparent"}`}>
            <X className="h-2.5 w-2.5" strokeWidth={2.2} />
        </span>
    );
}

function didFocusLeaveContainer(
    event: FocusEvent<HTMLElement>,
    currentTarget: HTMLElement,
) {
    const nextTarget = event.relatedTarget;
    return !(nextTarget instanceof Node) || !currentTarget.contains(nextTarget);
}

function matchesSelectedGenders(selectedGenders: Gender[], genders?: Gender[]) {
    if (!genders || genders.length === 0) {
        return selectedGenders.length === 0;
    }

    return (
        selectedGenders.length === genders.length
        && genders.every((gender) => selectedGenders.includes(gender))
    );
}

function isSubcategoryActive(
    activeCategory: Category,
    activeGenders: Gender[],
    activeSubcategoryId: string | null,
    category: Category,
    subcategory: CategorySubcategory,
) {
    return activeCategory === category && (
        activeSubcategoryId === subcategory.id
        || (
            !activeSubcategoryId
            && subcategory.isDefault
            && matchesSelectedGenders(activeGenders, subcategory.genders)
        )
    );
}

function DesktopSubcategoryMenu({
    category,
    selectedCategory,
    selectedGenders,
    selectedSubcategoryId,
    onSelect,
}: {
    category: Category;
    selectedCategory: Category;
    selectedGenders: Gender[];
    selectedSubcategoryId: string | null;
    onSelect: (subcategory: CategorySubcategory) => void;
}) {
    const subcategories = getCategorySubcategories(category);

    if (subcategories.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-[80] mt-3 min-w-[180px] -translate-x-1/2 border border-black/10 bg-[#f4f1ea] p-1.5 shadow-[0_18px_36px_rgba(0,0,0,0.08)]"
        >
            {subcategories.map((subcategory) => {
                const isActive = selectedCategory === category && (
                    selectedSubcategoryId === subcategory.id
                    || (
                        !selectedSubcategoryId
                        && subcategory.isDefault
                        && matchesSelectedGenders(selectedGenders, subcategory.genders)
                    )
                );

                return (
                    <button
                        key={subcategory.id}
                        type="button"
                        onClick={() => onSelect(subcategory)}
                        className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.24em] transition-colors ${isActive
                            ? "bg-black text-white"
                            : "text-black/60 hover:bg-black hover:text-white"
                            }`}
                    >
                        <span>{subcategory.label}</span>
                    </button>
                );
            })}
        </motion.div>
    );
}

export default function Header({
    selectedCategories,
    selectedGenders,
    selectedSubcategoryId,
    productCount,
    totalCategoryCount,
    sortOrder,
    onCategoriesChange,
    onGendersChange,
    onSubcategoryChange,
    onSortChange,
    onLogoClick,
}: HeaderProps) {
    const cart = useCart();
    const itemCount = cart.items.length;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logoMenuOpen, setLogoMenuOpen] = useState(false);
    const [desktopOpenMenu, setDesktopOpenMenu] = useState<Category | "SORT" | null>(null);
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

    const selectedCategory = selectedCategories.length === 1
        ? selectedCategories[0]
        : null;
    const [tempSelectedCategories, setTempSelectedCategories] = useState<Category[]>(selectedCategories);
    const [tempSelectedGenders, setTempSelectedGenders] = useState<Gender[]>(selectedGenders);
    const [tempSelectedSubcategoryId, setTempSelectedSubcategoryId] = useState<string | null>(selectedSubcategoryId);
    const [tempSortOrder, setTempSortOrder] = useState<ProductSort>(sortOrder);
    const tempSelectedCategory = tempSelectedCategories.length === 1
        ? tempSelectedCategories[0]
        : null;

    const mobileSubcategories = tempSelectedCategory
        ? getCategorySubcategories(tempSelectedCategory)
        : [];

    const closeDesktopMenus = () => setDesktopOpenMenu(null);
    const closeMobileMenu = () => setIsMenuOpen(false);

    const openMobileMenu = () => {
        setTempSelectedCategories(selectedCategories);
        setTempSelectedGenders(selectedGenders);
        setTempSelectedSubcategoryId(selectedSubcategoryId);
        setTempSortOrder(sortOrder);
        closeDesktopMenus();
        setIsMenuOpen(true);
    };

    const handleLogoClick = () => {
        if (onLogoClick) {
            onLogoClick();
        }
        closeMobileMenu();
        closeDesktopMenus();
    };

    const handleCategorySelect = (category: Category) => {
        onCategoriesChange([category]);
        onGendersChange([]);
        onSubcategoryChange(null);
        closeDesktopMenus();
    };

    const handleSubcategorySelect = (category: Category, subcategory: CategorySubcategory) => {
        onCategoriesChange([category]);
        onGendersChange(subcategory.genders ?? []);
        onSubcategoryChange(subcategory.isDefault ? null : subcategory.id);
        closeDesktopMenus();
    };

    const handleSortSelect = (nextSortOrder: ProductSort) => {
        onSortChange(nextSortOrder);
        closeDesktopMenus();
    };

    const toggleMobileMenu = () => {
        if (isMenuOpen) {
            closeMobileMenu();
            return;
        }

        openMobileMenu();
    };

    const toggleCategorySelection = (categories: Category[], category: Category) => {
        if (!isMultiSelectMode) {
            return [category];
        }

        if (category === "ALL") {
            return ["ALL"];
        }

        const categoriesWithoutAll = categories.filter((item) => item !== "ALL");
        const nextCategories = categoriesWithoutAll.includes(category)
            ? categoriesWithoutAll.filter((item) => item !== category)
            : [...categoriesWithoutAll, category];

        return nextCategories.length > 0 ? nextCategories : ["ALL"];
    };

    const handleMobileCategorySelect = (category: Category) => {
        const nextCategories = toggleCategorySelection(tempSelectedCategories, category);
        setTempSelectedCategories(nextCategories);
        setTempSelectedGenders([]);
        setTempSelectedSubcategoryId(null);
    };

    const handleMobileSubcategorySelect = (
        category: Category,
        subcategory: CategorySubcategory,
    ) => {
        setTempSelectedCategories([category]);
        setTempSelectedGenders(subcategory.genders ?? []);
        setTempSelectedSubcategoryId(subcategory.isDefault ? null : subcategory.id);
    };

    const handleMobileApply = () => {
        onCategoriesChange(tempSelectedCategories);
        onGendersChange(tempSelectedGenders);
        onSubcategoryChange(tempSelectedSubcategoryId);
        onSortChange(tempSortOrder);
        closeMobileMenu();
    };

    return (
        <header className="sticky top-0 z-50 bg-white">
            <div className="relative mx-auto flex w-full max-w-[1920px] items-center justify-between px-3 py-5">
                <div className="z-[70] flex w-[120px] flex-shrink-0 items-center gap-4 md:w-[220px]">
                    <div
                        className="relative"
                        onMouseEnter={() => setLogoMenuOpen(true)}
                        onMouseLeave={() => setLogoMenuOpen(false)}
                        onBlurCapture={(event) => {
                            if (didFocusLeaveContainer(event, event.currentTarget)) {
                                setLogoMenuOpen(false);
                            }
                        }}
                    >
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={handleLogoClick}
                                className="text-lg font-bold uppercase tracking-tighter transition-opacity hover:opacity-50 md:text-xl"
                            >
                                HOBOEM
                            </button>
                            <ChevronDown className={`h-3 w-3 text-black/30 transition-transform ${logoMenuOpen ? "rotate-180" : ""}`} strokeWidth={2} />
                        </div>

                        <AnimatePresence>
                            {logoMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className="absolute left-0 top-full z-[80] mt-3 w-[220px] bg-white p-1.5 shadow-[0_18px_36px_rgba(0,0,0,0.08)] border border-black/10"
                                >
                                    {([
                                        { label: "About Us",        href: "/about" },
                                        { label: "Contact Us",       href: "/contact" },
                                        { label: "Our Clients",      href: "/clients" },
                                        { label: "Online Partners",  href: "/partners" },
                                    ] as const).map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setLogoMenuOpen(false)}
                                            className="flex w-full items-center px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.24em] text-black/60 transition-colors hover:bg-black hover:text-white"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 text-[12px] text-gray-400 md:flex">
                    {CATEGORIES.map((category) => {
                        const hasSubcategories = getCategorySubcategories(category).length > 0;
                        const isOpen = desktopOpenMenu === category;
                        const isActive = selectedCategories.includes(category);

                        return (
                            <div
                                key={category}
                                className="relative"
                                onMouseEnter={() => {
                                    if (hasSubcategories) {
                                        setDesktopOpenMenu(category);
                                    } else {
                                        closeDesktopMenus();
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (desktopOpenMenu === category) {
                                        closeDesktopMenus();
                                    }
                                }}
                                onFocusCapture={() => {
                                    if (hasSubcategories) {
                                        setDesktopOpenMenu(category);
                                    }
                                }}
                                onBlurCapture={(event) => {
                                    if (didFocusLeaveContainer(event, event.currentTarget)) {
                                        closeDesktopMenus();
                                    }
                                }}
                            >
                                <div className="flex items-center gap-1">
                                    <motion.button
                                        type="button"
                                        onClick={() => handleCategorySelect(category)}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`uppercase tracking-[0.18em] transition-colors ${isActive ? "text-black" : "hover:text-black"
                                            }`}
                                    >
                                        {CATEGORY_DISPLAY_NAMES[category]}
                                    </motion.button>

                                    {hasSubcategories && (
                                        <button
                                            type="button"
                                            aria-label={`Show ${CATEGORY_DISPLAY_NAMES[category]} subcategories`}
                                            onClick={() => setDesktopOpenMenu((currentMenu) => currentMenu === category ? null : category)}
                                            className={`rounded-full p-1 transition-colors ${isActive || isOpen ? "text-black" : "text-black/35 hover:text-black"
                                                }`}
                                        >
                                            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} strokeWidth={1.6} />
                                        </button>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {isOpen && (
                                        <DesktopSubcategoryMenu
                                            category={category}
                                            selectedCategory={selectedCategory}
                                            selectedGenders={selectedGenders}
                                            selectedSubcategoryId={selectedSubcategoryId}
                                            onSelect={(subcategory) => handleSubcategorySelect(category, subcategory)}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                <div className="z-[70] flex w-[120px] items-center justify-end gap-3 md:w-[220px] md:gap-4">
                    <div
                        className="relative hidden md:block"
                        onMouseEnter={() => setDesktopOpenMenu("SORT")}
                        onMouseLeave={() => {
                            if (desktopOpenMenu === "SORT") {
                                closeDesktopMenus();
                            }
                        }}
                        onFocusCapture={() => setDesktopOpenMenu("SORT")}
                        onBlurCapture={(event) => {
                            if (didFocusLeaveContainer(event, event.currentTarget)) {
                                closeDesktopMenus();
                            }
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setDesktopOpenMenu((currentMenu) => currentMenu === "SORT" ? null : "SORT")}
                            className={`flex items-center gap-1.5 border border-black/12 px-3 py-2 text-[10px] uppercase tracking-[0.26em] transition-colors ${desktopOpenMenu === "SORT" || sortOrder !== "FEATURED"
                                ? "text-black border-black/25"
                                : "text-black/55 hover:text-black"
                                }`}
                        >
                            <span>{sortOrder === "FEATURED" ? "Price" : PRODUCT_SORT_DISPLAY_NAMES[sortOrder]}</span>
                            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${desktopOpenMenu === "SORT" ? "rotate-180" : ""}`} strokeWidth={1.6} />
                        </button>

                        <AnimatePresence>
                            {desktopOpenMenu === "SORT" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className="absolute right-0 top-full z-[80] mt-3 min-w-[180px] border border-black/10 bg-[#f4f1ea] p-1.5 shadow-[0_18px_36px_rgba(0,0,0,0.08)]"
                                >
                                    {SORT_OPTIONS.map((option) => {
                                        const isActive = option === sortOrder;

                                        return (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => handleSortSelect(option)}
                                                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.24em] transition-colors ${isActive
                                                    ? "bg-black text-white"
                                                    : "text-black/60 hover:bg-black hover:text-white"
                                                    }`}
                                            >
                                                <span>{PRODUCT_SORT_DISPLAY_NAMES[option]}</span>
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        type="button"
                        onClick={toggleMobileMenu}
                        className="p-1 md:hidden"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>

                    <Link
                        href="/checkout"
                        className="flex flex-shrink-0 items-center gap-1.5 transition-opacity hover:opacity-50"
                    >
                        <span className="pt-0.5 text-xs font-bold md:text-sm">{itemCount}</span>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 pb-[1px] md:h-5 md:w-5"
                        >
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            <rect x="4" y="10" width="16" height="12" rx="2.5" />
                        </svg>
                    </Link>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-[69px] z-[60] flex flex-col bg-white md:hidden"
                    >
                        <div className="border-b border-black/8 px-4 py-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-[0.34em] text-black/40">Categories</span>
                                <span className="text-[10px] uppercase tracking-[0.28em] text-black/35">
                                    {productCount}/{totalCategoryCount} Items
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pb-8">
                            <div className="px-3 py-3">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.34em] text-black/40">
                                        Browse
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsMultiSelectMode((currentValue) => !currentValue)}
                                        className="flex items-center font-mono text-[10px] uppercase tracking-[0.24em] text-black/65"
                                    >
                                        <Checkbox checked={isMultiSelectMode} />
                                        Multi Select
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 border border-black/8">
                                    {CATEGORIES.map((category, index) => {
                                        const isActive = tempSelectedCategories.includes(category);
                                        const isRightColumn = index % 2 === 1;
                                        const isLastRow = index >= CATEGORIES.length - 2;

                                        return (
                                            <button
                                                key={category}
                                                type="button"
                                                onClick={() => handleMobileCategorySelect(category)}
                                                className={`flex min-h-[48px] items-center justify-center px-3 text-center font-mono text-[10px] uppercase tracking-[0.24em] transition-colors ${isRightColumn ? "" : "border-r border-black/8"
                                                    } ${isLastRow ? "" : "border-b border-black/8"} ${isActive
                                                        ? "bg-black text-white"
                                                        : "bg-white text-black/75 hover:bg-black/5 hover:text-black"
                                                    }`}
                                            >
                                                {isMultiSelectMode && <Checkbox checked={isActive} />}
                                                {CATEGORY_DISPLAY_NAMES[category]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <AnimatePresence initial={false}>
                                {tempSelectedCategory && mobileSubcategories.length > 0 && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.18, ease: "easeInOut" }}
                                        className="overflow-hidden border-t border-black/8"
                                    >
                                        <div className="px-3 py-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-black/40">
                                                    {CATEGORY_DISPLAY_NAMES[tempSelectedCategory]}
                                                </span>
                                                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-black/25">
                                                    Subcategories
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 border border-black/8">
                                                {mobileSubcategories.map((subcategory, index) => {
                                                    const isActive = isSubcategoryActive(
                                                        tempSelectedCategory,
                                                        tempSelectedGenders,
                                                        tempSelectedSubcategoryId,
                                                        tempSelectedCategory,
                                                        subcategory,
                                                    );
                                                    const isRightColumn = index % 2 === 1;
                                                    const isLastRow = index >= mobileSubcategories.length - 2;

                                                    return (
                                                        <button
                                                            key={subcategory.id}
                                                            type="button"
                                                            onClick={() => handleMobileSubcategorySelect(tempSelectedCategory, subcategory)}
                                                            className={`flex min-h-[48px] items-center justify-between px-3 text-left font-mono text-[10px] uppercase tracking-[0.24em] transition-colors ${isRightColumn ? "" : "border-r border-black/8"
                                                                } ${isLastRow ? "" : "border-b border-black/8"} ${isActive
                                                                    ? "bg-black text-white"
                                                                    : "bg-white text-black/70 hover:bg-black/5 hover:text-black"
                                                                }`}
                                                        >
                                                            <span>{subcategory.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="border-t border-black/8 px-3 py-4">
                                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.34em] text-black/40">
                                    Price Sort
                                </div>

                                <div className="grid grid-cols-2 border border-black/8">
                                    {SORT_OPTIONS.map((option, index) => {
                                        const isActive = option === tempSortOrder;
                                        const isRightColumn = index % 2 === 1;
                                        const isLastRow = index >= SORT_OPTIONS.length - 2;

                                        return (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => setTempSortOrder(option)}
                                                className={`flex min-h-[48px] items-center justify-between px-3 text-left font-mono text-[10px] uppercase tracking-[0.24em] transition-colors ${isRightColumn ? "" : "border-r border-black/8"
                                                    } ${isLastRow ? "" : "border-b border-black/8"} ${isActive
                                                        ? "bg-black text-white"
                                                        : "bg-white text-black/70 hover:bg-black/5 hover:text-black"
                                                    }`}
                                            >
                                                <span>{PRODUCT_SORT_DISPLAY_NAMES[option]}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-black/8 bg-white p-4">
                            <button
                                type="button"
                                onClick={handleMobileApply}
                                className="w-full bg-black py-4 text-xs font-bold uppercase tracking-[0.24em] text-white"
                            >
                                Apply Selection
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
