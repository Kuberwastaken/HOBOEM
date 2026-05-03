"use client";

import Image from "next/image";
import { Product } from "@/lib/products";
import { thumbUrl } from "@/lib/cdn";

interface ProductCardProps {
    product: Product;
    priority?: boolean;
}

// Simple blur placeholder - a tiny gray square
const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEEoAAAAAA//Z";

export function ProductCard({ product, priority }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col cursor-pointer select-none active:scale-[0.98] transition-transform duration-300 hover:scale-[1.05]">
            {/* Product Image Container */}
            <div className="product-image w-full">
                <div className="relative w-full aspect-square bg-[#ffffff] overflow-hidden rounded-sm">
                    <Image
                        src={thumbUrl(product.variants[0]?.image || '')}
                        alt={product.name}
                        fill
                        priority={priority}
                        className="object-contain p-1"
                        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 16vw"
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                    />
                </div>
            </div>

            {/* Product Info - Minimalist: Just ID */}
            <div className="mt-2 text-center">
                <p className="text-[10px] md:text-xs font-[family-name:var(--font-share-tech)] uppercase text-black/60 tracking-wider truncate">
                    {product.id}
                </p>
                {/* Price and Gender removed as per request */}
            </div>
        </div>
    );
}
