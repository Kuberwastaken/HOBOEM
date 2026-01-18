import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about HOBOEM - a premium fashion and accessories brand dedicated to quality, minimalism, and timeless design. Discover our philosophy and commitment.",
    openGraph: {
        title: "About Us | HOBOEM",
        description: "Learn about HOBOEM - a premium fashion brand dedicated to quality, minimalism, and timeless design.",
        url: "https://hoboem.com/about",
    },
};

export default function AboutPage() {
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
                        About
                    </span>
                </div>
            </nav>

            {/* Split Hero */}
            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
                {/* Left - Title */}
                <div className="flex flex-col justify-end p-6 md:p-16 pb-12 md:pb-20">
                    <div className="space-y-2">
                        <h1 className="text-[clamp(4rem,15vw,12rem)] font-black leading-[0.85] tracking-[-0.04em] uppercase">
                            About
                        </h1>
                        <h1 className="text-[clamp(4rem,15vw,12rem)] font-black leading-[0.85] tracking-[-0.04em] uppercase text-black/20">
                            Us
                        </h1>
                    </div>
                </div>

                {/* Right - Intro */}
                <div className="flex flex-col justify-end p-6 md:p-16 pb-12 md:pb-20 bg-black/5">
                    <div className="max-w-md">
                        <p className="text-lg md:text-xl leading-relaxed text-black/80">
                            HOBOEM is a premium fashion and accessories brand dedicated to delivering exceptional quality
                            and timeless design.
                        </p>
                        <div className="mt-8 pt-8 border-t border-black/10">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                                Est. 2026 • India
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Philosophy Section */}
            <div className="bg-black text-white py-20 md:py-40 px-6 md:px-16">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
                        <div className="md:col-span-1">
                            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                                Our Philosophy
                            </span>
                        </div>
                        <div className="md:col-span-2">
                            <blockquote className="text-3xl md:text-5xl font-light leading-tight">
                                "We believe in minimalism, functionality, and craftsmanship."
                            </blockquote>
                            <p className="mt-8 text-white/60 leading-relaxed max-w-lg">
                                Every product is selected with care to ensure it meets our exacting standards
                                for quality and aesthetic appeal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Quality */}
                <div className="bg-[#d4cfc3] p-8 md:p-20 min-h-[60vh] flex flex-col justify-between">
                    <span className="text-8xl md:text-[10rem] font-black text-black/[0.05] leading-none">
                        Q
                    </span>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-6">
                            Quality Commitment
                        </h3>
                        <p className="text-black/60 leading-relaxed max-w-md">
                            Each item in our collection undergoes rigorous quality control.
                            We work directly with manufacturers to ensure authenticity and durability,
                            providing you with products that stand the test of time.
                        </p>
                    </div>
                </div>

                {/* Customer */}
                <div className="bg-[#c9c4b8] p-8 md:p-20 min-h-[60vh] flex flex-col justify-between">
                    <span className="text-8xl md:text-[10rem] font-black text-black/[0.05] leading-none">
                        C
                    </span>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-6">
                            Customer First
                        </h3>
                        <p className="text-black/60 leading-relaxed max-w-md">
                            Your satisfaction is our priority. We offer transparent pricing,
                            detailed product information, and responsive customer service
                            to make your shopping experience seamless.
                        </p>
                    </div>
                </div>
            </div>

            {/* Categories Strip */}
            <div className="bg-white py-16 px-6 md:px-16 overflow-hidden">
                <div className="flex gap-12 md:gap-24 text-[clamp(2rem,8vw,6rem)] font-black uppercase tracking-tight text-black/10 whitespace-nowrap">
                    <span>Watches</span>
                    <span>•</span>
                    <span>Belts</span>
                    <span>•</span>
                    <span>Sunglasses</span>
                    <span>•</span>
                    <span>Lingerie</span>
                    <span>•</span>
                    <span>Wallets</span>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-[#e8e4dc] px-6 md:px-16 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-8">
                        Ready to explore?
                    </p>
                    <Link
                        href="/"
                        className="inline-block text-4xl md:text-6xl font-black uppercase tracking-tight hover:opacity-60 transition-opacity"
                    >
                        Shop Now →
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-[#e8e4dc] px-6 md:px-16 py-6 border-t border-black/10">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-black/40">
                    <span>HOBOEM © 2026</span>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
