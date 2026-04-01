import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Online Partners",
    description: "HOBOEM products are available through our network of trusted online retail partners. Shop HOBOEM watches, sunglasses, and accessories on your preferred platform.",
    openGraph: {
        title: "Online Partners | HOBOEM",
        description: "Shop HOBOEM through our trusted online retail partners.",
        url: "https://hoboem.com/partners",
    },
};

const PARTNERS = [
    {
        name: "Amazon India",
        type: "Marketplace",
        url: "https://amazon.in",
        description: "Full catalogue with Prime delivery across India.",
    },
    {
        name: "Flipkart",
        type: "Marketplace",
        url: "https://flipkart.com",
        description: "Watches and sunglasses with fast delivery.",
    },
    {
        name: "Myntra",
        type: "Fashion Platform",
        url: "https://myntra.com",
        description: "Premium accessories and fashion collections.",
    },
    {
        name: "Meesho",
        type: "Reseller Platform",
        url: "https://meesho.com",
        description: "Wholesale and reseller-friendly pricing.",
    },
    {
        name: "Ajio",
        type: "Fashion Platform",
        url: "https://ajio.com",
        description: "Curated lifestyle and accessories selection.",
    },
    {
        name: "Nykaa Fashion",
        type: "Fashion Platform",
        url: "https://nykaafashion.com",
        description: "Accessories and fashion-forward collections.",
    },
];

export default function PartnersPage() {
    return (
        <div className="min-h-screen bg-white text-black font-mono">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
                <div className="flex justify-between items-center px-6 md:px-16 py-6">
                    <Link
                        href="/"
                        className="text-[10px] uppercase tracking-[0.3em] text-black/40 hover:text-black transition-colors"
                    >
                        ← Back
                    </Link>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                        Partners
                    </span>
                </div>
            </nav>

            {/* Hero */}
            <div className="min-h-[60vh] flex flex-col justify-end px-6 md:px-16 pb-12 pt-32">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-6">
                        Shop With Us
                    </span>
                    <h1 className="text-[clamp(3rem,12vw,10rem)] font-black leading-[0.85] tracking-[-0.04em] uppercase">
                        Online
                    </h1>
                    <h1 className="text-[clamp(3rem,12vw,10rem)] font-black leading-[0.85] tracking-[-0.04em] uppercase text-black/15">
                        Partners
                    </h1>
                </div>
            </div>

            {/* Intro strip */}
            <div className="bg-[#f5f5f0] px-6 md:px-16 py-12">
                <div className="max-w-2xl">
                    <p className="text-lg md:text-xl leading-relaxed text-black/70">
                        HOBOEM products are available through our network of trusted
                        online retail partners. Find us on the platform you prefer.
                    </p>
                </div>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2">
                {PARTNERS.map((partner, index) => (
                    <a
                        key={partner.name}
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group p-8 md:p-16 min-h-[40vh] flex flex-col justify-between border-b border-r border-black/8 transition-colors hover:bg-black hover:text-white ${index % 2 === 0 ? "" : "border-r-0"}`}
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-black/30 group-hover:text-white/40 transition-colors">
                                {partner.type}
                            </span>
                            <span className="text-2xl text-black/15 group-hover:text-white/40 transition-colors">
                                ↗
                            </span>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
                                {partner.name}
                            </h2>
                            <p className="text-black/50 group-hover:text-white/60 transition-colors max-w-sm text-sm leading-relaxed">
                                {partner.description}
                            </p>
                        </div>
                    </a>
                ))}
            </div>

            {/* Become a Partner CTA */}
            <div className="bg-black text-white px-6 md:px-16 py-20 md:py-32">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
                    <div className="md:col-span-1">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                            Become a Partner
                        </span>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-3xl md:text-4xl font-light leading-tight mb-8">
                            Interested in carrying HOBOEM products on your platform?
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-4 border border-white/30 px-8 py-4 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                        >
                            Contact Our Team →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom strip */}
            <div className="bg-[#f5f5f0] px-6 md:px-16 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-black/40">
                    <span>HOBOEM © 2026</span>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
                        <Link href="/" className="hover:text-black transition-colors">Shop</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
