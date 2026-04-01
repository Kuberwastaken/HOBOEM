"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/product/product-card";
import { ProductModal } from "@/components/product/product-modal";
import { BannerCarousel } from "@/components/home/banner-carousel";
import { PRODUCTS, Product, filterProducts, flattenProducts } from "@/lib/products";
import {
    Category,
    Gender,
    Size,
    CATEGORY_DISPLAY_NAMES,
    getCategorySubcategoryById,
    ProductSort,
} from "@/lib/filter-config";

interface BannerImage {
    src: string;
    alt: string;
}

interface BannerImageSet {
    desktop: BannerImage[];
    mobile: BannerImage[];
}

function seededShuffle<T>(array: T[], seed: number): T[] {
    const result = [...array];
    let currentSeed = seed;
    const random = () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
    };

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function createAllViewOrder(products: Product[]): Product[] {
    const rotationConfig = [
        { category: "WATCHES" as Category, gender: "MEN" as Gender },
        { category: "SUNGLASSES" as Category, gender: undefined },
        { category: "WATCHES" as Category, gender: "WOMEN" as Gender },
        { category: "LEATHER" as Category, gender: undefined },
        { category: "WATCHES" as Category, gender: "KIDS" as Gender },
        { category: "LINGERIE" as Category, gender: undefined },
        { category: "GIFT_SET" as Category, gender: undefined },
    ];

    const groupSize = 6;
    const result: Product[] = [];

    const groups = rotationConfig.map((config) => {
        let filtered = products.filter((product) => product.category === config.category);
        if (config.gender) {
            filtered = filtered.filter((product) => product.gender === config.gender);
        }
        return seededShuffle(filtered, 12345);
    });

    const indices = rotationConfig.map(() => 0);

    let hasMore = true;
    while (hasMore) {
        hasMore = false;
        for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
            const group = groups[groupIndex];
            const startIndex = indices[groupIndex];
            const chunk = group.slice(startIndex, startIndex + groupSize);
            if (chunk.length > 0) {
                result.push(...chunk);
                indices[groupIndex] += chunk.length;
                hasMore = true;
            }
        }
    }

    const usedIds = new Set(result.map((product) => product.id));
    const remaining = products.filter((product) => !usedIds.has(product.id));
    result.push(...remaining);

    return result;
}

function getProductPrice(product: Product) {
    return product.price ?? product.variants.find((variant) => variant.price !== undefined)?.price ?? Number.POSITIVE_INFINITY;
}

function sortProducts(products: Product[], sortOrder: ProductSort) {
    if (sortOrder === "FEATURED") {
        return products;
    }

    return [...products].sort((left, right) => {
        const leftPrice = getProductPrice(left);
        const rightPrice = getProductPrice(right);

        return sortOrder === "PRICE_ASC"
            ? leftPrice - rightPrice
            : rightPrice - leftPrice;
    });
}

export function HomePage({ bannerImages }: { bannerImages: BannerImageSet | BannerImage[] }) {
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(["ALL"]);
    const [selectedGenders, setSelectedGenders] = useState<Gender[]>([]);
    const [selectedSizes] = useState<Size[]>([]);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<ProductSort>("FEATURED");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [gridMode, setGridMode] = useState<"compact" | "expanded">("compact");

    const filteredProducts = useMemo(() => {
        const flat = flattenProducts(PRODUCTS);
        let filtered = filterProducts(
            flat,
            selectedCategories,
            selectedGenders,
            selectedSizes,
        );

        const isAllView = selectedCategories.includes("ALL") || selectedCategories.length === 0;
        const noSubFilters = selectedGenders.length === 0 && selectedSizes.length === 0;

        if (sortOrder === "FEATURED" && isAllView && noSubFilters) {
            filtered = createAllViewOrder(filtered);
        }

        return sortProducts(filtered, sortOrder);
    }, [selectedCategories, selectedGenders, selectedSizes, sortOrder]);

    const totalCategoryCount = useMemo(() => {
        return filterProducts(
            flattenProducts(PRODUCTS),
            selectedCategories,
            undefined,
            undefined,
        ).length;
    }, [selectedCategories]);

    const toggleGridMode = () => {
        setGridMode((currentMode) => currentMode === "compact" ? "expanded" : "compact");
    };

    const filterKey = `${selectedCategories.join(",")}-${selectedGenders.join(",") || "all"}-${selectedSizes.join(",") || "all"}-${selectedSubcategoryId || "none"}-${sortOrder}`;
    const singleCategorySelection = selectedCategories.length === 1 && selectedCategories[0] !== "ALL"
        ? selectedCategories[0]
        : null;
    const selectedSubcategory = singleCategorySelection
        ? getCategorySubcategoryById(singleCategorySelection, selectedSubcategoryId)
        : null;
    const emptyStateTitle = selectedSubcategory
        ? `${selectedSubcategory.label} Placeholder`
        : singleCategorySelection
            ? `${CATEGORY_DISPLAY_NAMES[singleCategorySelection]} Placeholder`
        : "No products found";
    const emptyStateBody = selectedSubcategory
        ? `${selectedSubcategory.label} products will land here once the catalog is ready.`
        : singleCategorySelection
            ? `${CATEGORY_DISPLAY_NAMES[singleCategorySelection]} products will land here once the catalog is ready.`
        : "Try adjusting your filters";

    return (
        <div className="min-h-screen pb-4 md:pb-8 bg-[#ffffff] text-black font-mono">
            <Header
                selectedCategories={selectedCategories}
                selectedGenders={selectedGenders}
                selectedSubcategoryId={selectedSubcategoryId}
                productCount={filteredProducts.length}
                totalCategoryCount={totalCategoryCount}
                onCategoriesChange={(categories) => {
                    setSelectedCategories(categories);
                    setSelectedSubcategoryId(null);
                }}
                onGendersChange={setSelectedGenders}
                onSubcategoryChange={setSelectedSubcategoryId}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                onLogoClick={toggleGridMode}
            />

            <BannerCarousel bannerImages={bannerImages} />

            <main className="px-1.5 md:px-3 mt-5 md:mt-6">
                <div className="md:hidden text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-4 pl-1">
                    {filteredProducts.length}/{totalCategoryCount} ITEMS
                </div>

                {filteredProducts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center border border-black/10 bg-[#f4f1ea]"
                    >
                        {singleCategorySelection && (
                            <span className="mb-5 border border-black/10 px-3 py-2 text-[9px] uppercase tracking-[0.35em] text-black/45">
                                Coming Soon
                            </span>
                        )}
                        <p className="text-gray-500 uppercase tracking-[0.28em] text-sm mb-4">
                            {emptyStateTitle}
                        </p>
                        <p className="text-gray-400 text-xs max-w-sm leading-relaxed uppercase tracking-[0.16em]">
                            {emptyStateBody}
                        </p>
                    </motion.div>
                )}

                <LayoutGroup>
                    <motion.div
                        className={`grid ${gridMode === "compact"
                            ? "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-1 md:gap-x-2 gap-y-3"
                            : "grid-cols-2 md:grid-cols-3 gap-x-2 md:gap-x-4 gap-y-4"
                            }`}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={filterKey}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="contents"
                            >
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        layout="position"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            layout: {
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 25,
                                                mass: 0.8,
                                            },
                                            opacity: { duration: 0.3 },
                                            y: { duration: 0.4, delay: index * 0.02 },
                                        }}
                                        onClick={() => setSelectedProduct(product)}
                                        className="cursor-pointer"
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </LayoutGroup>
            </main>

            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
