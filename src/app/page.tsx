"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/product/product-card";
import { ProductModal } from "@/components/product/product-modal";
import { PRODUCTS, Product } from "@/lib/products";

const CATEGORIES = ["ALL", "MENS", "WOMENS", "ACCESSORIES"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [gridMode, setGridMode] = useState<"compact" | "expanded">("compact"); // compact = 6 cols, expanded = 3 cols

  const filteredProducts = PRODUCTS.filter(
    (product) => selectedCategory === "ALL" || product.category === selectedCategory
  );

  const toggleGridMode = () => {
    setGridMode(gridMode === "compact" ? "expanded" : "compact");
  };

  return (
    <div className="min-h-screen pb-20 bg-[#f9fafb] text-black font-mono">
      <Header
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onLogoClick={toggleGridMode}
      />

      <main className="px-2 md:px-4 lg:px-6 mt-4">

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
                key={selectedCategory}
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
