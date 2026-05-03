import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/products";
import { fullUrl, thumbUrl } from "@/lib/cdn";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/filter-config";

export const dynamic = "force-static";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
    return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return {};

    const categoryLabel = CATEGORY_DISPLAY_NAMES[product.category] ?? product.category;
    const genderLabel = product.gender.charAt(0) + product.gender.slice(1).toLowerCase();
    const description =
        product.description
            ? `${product.description}. ${genderLabel}'s ${categoryLabel} by HOBOEM — premium quality accessories.`
            : `${genderLabel}'s ${categoryLabel} by HOBOEM — premium quality accessories. Product ID: ${product.id}.`;

    const imageUrl = fullUrl(product.variants[0]?.image ?? "");

    return {
        title: `${product.id} — ${genderLabel}'s ${categoryLabel}`,
        description,
        openGraph: {
            title: `${product.id} | HOBOEM`,
            description,
            url: `https://hoboem.com/products/${product.id}`,
            images: imageUrl ? [{ url: imageUrl, alt: product.id }] : [],
        },
        alternates: {
            canonical: `https://hoboem.com/products/${product.id}`,
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) notFound();

    const categoryLabel = CATEGORY_DISPLAY_NAMES[product.category] ?? product.category;
    const genderLabel = product.gender.charAt(0) + product.gender.slice(1).toLowerCase();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.id,
        description: product.description ?? `${genderLabel}'s ${categoryLabel} by HOBOEM`,
        brand: { "@type": "Brand", name: "HOBOEM" },
        category: categoryLabel,
        url: `https://hoboem.com/products/${product.id}`,
        image: product.variants.map((v) => fullUrl(v.image)).filter(Boolean),
        ...(product.price != null && {
            offers: {
                "@type": "Offer",
                priceCurrency: "INR",
                price: product.price,
                availability: "https://schema.org/InStock",
                seller: { "@type": "Organization", name: "HOBOEM" },
            },
        }),
    };

    return (
        <div className="min-h-screen bg-white text-black font-mono">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-black/8">
                <div className="flex justify-between items-center px-6 md:px-16 py-5">
                    <Link
                        href="/"
                        className="text-[10px] uppercase tracking-[0.3em] text-black/40 hover:text-black transition-colors"
                    >
                        ← Catalog
                    </Link>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                        {product.id}
                    </span>
                </div>
            </nav>

            {/* Content */}
            <div className="pt-24 pb-16 px-6 md:px-16 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                    {/* Images */}
                    <div className="flex flex-col gap-4">
                        {product.variants.map((variant) => (
                            <div
                                key={variant.variantId}
                                className="relative aspect-square bg-[#f5f5f0] overflow-hidden"
                            >
                                <Image
                                    src={thumbUrl(variant.image)}
                                    alt={`${product.id} — ${variant.variantId}`}
                                    fill
                                    className="object-contain p-8"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                        ))}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-8 pt-2">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-3">
                                {categoryLabel} / {genderLabel}
                            </p>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                                {product.id}
                            </h1>
                        </div>

                        {product.description && (
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-2">
                                    Details
                                </p>
                                <p className="text-sm leading-relaxed text-black/70">
                                    {product.description.split(";").map((part, i) => (
                                        <span key={i} className="block">
                                            {part.trim()}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        )}

                        {product.price != null && (
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-1">
                                    Price
                                </p>
                                <p className="text-2xl font-bold">₹{product.price.toLocaleString("en-IN")}</p>
                            </div>
                        )}

                        {product.variants.length > 1 && (
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-2">
                                    Variants
                                </p>
                                <p className="text-sm text-black/60">{product.variants.length} available variants</p>
                            </div>
                        )}

                        <div className="mt-auto pt-8 border-t border-black/8">
                            <Link
                                href="/"
                                className="inline-block border border-black px-6 py-3 text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-colors"
                            >
                                View Full Catalog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
