import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Our Clients",
    description: "HOBOEM is trusted by retailers and individuals across India and the Middle East. Discover the partners who rely on our premium watches, sunglasses, and accessories.",
    openGraph: {
        title: "Our Clients | HOBOEM",
        description: "Trusted by retailers and individuals across India and the Middle East.",
        url: "https://hoboem.com/clients",
    },
};

const CLIENT_REGIONS = [
    {
        region: "India",
        description: "Retailers and boutiques across major metros and Tier-2 cities trust HOBOEM for premium, competitively-priced accessories.",
        cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Kolkata", "Chennai", "Pune", "Ahmedabad"],
    },
    {
        region: "Middle East",
        description: "Wholesale partners across the Gulf who value quality craftsmanship and reliable supply for their discerning customers.",
        cities: ["Dubai", "Abu Dhabi", "Sharjah", "Riyadh", "Jeddah", "Kuwait City"],
    },
    {
        region: "South-East Asia",
        description: "Growing network of distributors across emerging fashion markets in South-East Asia.",
        cities: ["Singapore", "Kuala Lumpur", "Bangkok", "Jakarta"],
    },
];

const STATS = [
    { figure: "500+", label: "Retail Partners" },
    { figure: "12", label: "Countries" },
    { figure: "3 Cr+", label: "Products Delivered" },
    { figure: "98%", label: "Retention Rate" },
];

export default function ClientsPage() {
    return (
        <div className="min-h-screen bg-[#e8e4dc] text-black font-mono">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
                <div className="flex justify-between items-center px-6 md:px-16 py-6">
                    <Link
                        href="/"
                        className="text-[10px] uppercase tracking-[0.3em] text-white hover:opacity-60 transition-opacity"
                    >
                        ← Home
                    </Link>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white">
                        Clients
                    </span>
                </div>
            </nav>

            {/* Split Hero */}
            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
                {/* Left - Title */}
                <div className="flex flex-col justify-end p-6 md:p-16 pb-12 md:pb-20">
                    <div className="space-y-2">
                        <h1 className="text-[clamp(3.5rem,14vw,11rem)] font-black leading-[0.85] tracking-[-0.04em] uppercase">
                            Our
                        </h1>
                        <h1 className="text-[clamp(3.5rem,14vw,11rem)] font-black leading-[0.85] tracking-[-0.04em] uppercase text-black/20">
                            Clients
                        </h1>
                    </div>
                </div>

                {/* Right - Intro */}
                <div className="flex flex-col justify-end p-6 md:p-16 pb-12 md:pb-20 bg-black/5">
                    <div className="max-w-md">
                        <p className="text-lg md:text-xl leading-relaxed text-black/80">
                            We partner with retailers, boutiques, and wholesale distributors
                            who share our commitment to quality and customer satisfaction.
                        </p>
                        <div className="mt-8 pt-8 border-t border-black/10">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                                Global Reach • Local Trust
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Strip */}
            <div className="bg-black text-white">
                <div className="grid grid-cols-2 md:grid-cols-4">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="p-8 md:p-12 border-r border-white/5 last:border-0 text-center">
                            <div className="text-4xl md:text-5xl font-black mb-3">
                                {stat.figure}
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Regions */}
            {CLIENT_REGIONS.map((region, index) => (
                <div
                    key={region.region}
                    className={`grid grid-cols-1 md:grid-cols-2 ${index % 2 === 0 ? "" : "md:[direction:rtl]"}`}
                >
                    <div className={`p-8 md:p-20 min-h-[50vh] flex flex-col justify-between ${index % 2 === 0 ? "bg-[#d4cfc3]" : "bg-[#c9c4b8]"} md:[direction:ltr]`}>
                        <span className="text-8xl md:text-[10rem] font-black text-black/[0.05] leading-none">
                            {region.region.charAt(0)}
                        </span>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-6">
                                {region.region}
                            </h3>
                            <p className="text-black/60 leading-relaxed max-w-md">
                                {region.description}
                            </p>
                        </div>
                    </div>
                    <div className={`p-8 md:p-20 min-h-[50vh] flex items-end ${index % 2 === 0 ? "bg-[#e0dbd1]" : "bg-[#ddd8ce]"} md:[direction:ltr]`}>
                        <div className="flex flex-wrap gap-3">
                            {region.cities.map((city) => (
                                <span
                                    key={city}
                                    className="border border-black/15 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-black/50"
                                >
                                    {city}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {/* CTA */}
            <div className="bg-[#e8e4dc] px-6 md:px-16 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-8">
                        Become a partner
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block text-4xl md:text-6xl font-black uppercase tracking-tight hover:opacity-60 transition-opacity"
                    >
                        Get In Touch →
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-[#e8e4dc] px-6 md:px-16 py-6 border-t border-black/10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-black/40">
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
