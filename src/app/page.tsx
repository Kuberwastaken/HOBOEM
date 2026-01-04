"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/product/product-card";
import { ProductModal } from "@/components/product/product-modal";
import { PRODUCTS, Product, filterProducts } from "@/lib/products";
import { Category, Gender, Size } from "@/lib/filter-config";

export default function Home() {
    // Multi-Select States
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(["ALL"]);
    const [selectedGenders, setSelectedGenders] = useState<Gender[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [gridMode, setGridMode] = useState<"compact" | "expanded">("compact");

    // Filter products based on all criteria
    const filteredProducts = useMemo(() => {
        return filterProducts(
            PRODUCTS,
            selectedCategories,
            selectedGenders,
            selectedSizes
        );
    }, [selectedCategories, selectedGenders, selectedSizes]);

    // Calculate total products for the current category selection (ignoring sub-filters)
    const totalCategoryCount = useMemo(() => {
        return filterProducts(
            PRODUCTS,
            selectedCategories,
            undefined, // Ignore gender
            undefined  // Ignore size
        ).length;
    }, [selectedCategories]);

    const toggleGridMode = () => {
        setGridMode(gridMode === "compact" ? "expanded" : "compact");
    };

    // Generate a unique key for animation based on all filters
    const filterKey = `${selectedCategories.join(",")}-${selectedGenders.join(",") || "all"}-${selectedSizes.join(",") || "all"}`;

    return (
        <div className="min-h-screen pb-20 bg-[#f9fafb] text-black font-mono">
            <Header
                selectedCategories={selectedCategories}
                selectedGenders={selectedGenders}
                selectedSizes={selectedSizes}
                productCount={filteredProducts.length}
                totalCategoryCount={totalCategoryCount}
                onCategoriesChange={setSelectedCategories}
                onGendersChange={setSelectedGenders}
                onSizesChange={setSelectedSizes}
                onLogoClick={toggleGridMode}
            />

            <main className="px-1.5 md:px-3 mt-4">
                {/* Mobile Product Count - Top Left of Content */}
                <div className="md:hidden text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-4 pl-1">
                    {filteredProducts.length}/{totalCategoryCount} ITEMS
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <p className="text-gray-400 uppercase tracking-widest text-sm mb-4">
                            No products found
                        </p>
                        <p className="text-gray-300 text-xs">
                            Try adjusting your filters
                        </p>
                    </motion.div>
                )}

                {/* Product Grid */}
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

            {/* Product Modal */}
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
