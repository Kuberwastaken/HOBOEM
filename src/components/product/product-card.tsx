"use client";

import Image from "next/image";
import { Product } from "@/lib/products";

interface ProductCardProps {
    product: Product;
}

// Simple blur placeholder - a tiny gray square
const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEEoAAAAAA//Z";

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col cursor-pointer select-none active:scale-[0.98] transition-transform duration-300 hover:scale-[1.05]">
            {/* Product Image Container */}
            <div className="product-image w-full">
                <div className="relative w-full aspect-square bg-[#f9fafb] overflow-hidden">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 16vw"
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                    />
                </div>
            </div>

            {/* Product Info - Share Tech Mono font like header categories */}
            <div className="mt-1 text-center">
                <p className="text-xs md:text-sm font-[family-name:var(--font-share-tech)] uppercase text-black tracking-wide">
                    {product.id.split('-').slice(0, 2).join('-')}
                </p>
            </div>
        </div>
    );
}
