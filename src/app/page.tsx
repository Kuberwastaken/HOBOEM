import { HomePage } from "@/components/home/home-page";
import { getBannerImages } from "@/lib/banner-images";
import { PRODUCTS } from "@/lib/products";
import { fullUrl } from "@/lib/cdn";

export default function Page() {
    const bannerImages = getBannerImages();

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "HOBOEM",
        url: "https://hoboem.com",
        description: "Premium watches, sunglasses, leather accessories, and lingerie by HOBOEM.",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://hoboem.com/?q={search_term_string}",
            "query-input": "required name=search_term_string",
        },
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "HOBOEM",
        url: "https://hoboem.com",
        logo: "https://hoboem.com/favicon.png",
        sameAs: [],
    };

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "HOBOEM Product Catalog",
        description: "Full catalog of HOBOEM fashion accessories including watches, sunglasses, leather belts, wallets, and lingerie.",
        numberOfItems: PRODUCTS.length,
        itemListElement: PRODUCTS.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://hoboem.com/products/${p.id}`,
            name: p.id,
            description: p.description ?? undefined,
            image: fullUrl(p.variants[0]?.image ?? ""),
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />
            <HomePage bannerImages={bannerImages} />
        </>
    );
}
