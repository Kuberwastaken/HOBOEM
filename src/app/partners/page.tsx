import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

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
    { name: "Amazon", src: "/partners/amazon.jpg" },
    { name: "Myntra", src: "/partners/myntra.jpg" },
    { name: "Flipkart", src: "/partners/flipkart.jpg" },
    { name: "Ajio", src: "/partners/ajio.jpg" },
    { name: "FirstCry", src: "/partners/firstcry.jpg" },
    { name: "Hopscotch", src: "/partners/hopscotch.jpg" },
    { name: "Shoppers Stop", src: "/partners/shoppers-stop.jpg" },
    { name: "Noon", src: "/partners/noon.jpg" },
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
            <div className="border-t border-black/8 w-full overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4 border-l border-black/8">
                    {PARTNERS.map((partner) => (
                        <div
                            key={partner.name}
                            className="group flex flex-col items-center justify-center p-8 md:p-16 aspect-square border-r border-b border-black/8 hover:bg-black/5 transition-colors"
                        >
                            <div className="relative w-full h-full max-w-[140px] max-h-[80px]">
                                <Image
                                    src={partner.src}
                                    alt={partner.name}
                                    fill
                                    className="object-contain mix-blend-multiply opacity-80 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
                                />
                            </div>
                            <span className="mt-8 text-[10px] uppercase tracking-[0.3em] text-black/40 group-hover:text-black transition-colors text-center hidden md:block">
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </div>
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
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                        <Link href="/about" className="hover:text-black transition-colors">About Us</Link>
                        <Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link>
                        <Link href="/clients" className="hover:text-black transition-colors">Our Clients</Link>
                        <Link href="/partners" className="hover:text-black transition-colors">Online Partners</Link>
                        <Link href="/corporate" className="hover:text-black transition-colors">Corporate Enquiries</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
