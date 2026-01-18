import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Work With Us",
    description: "Partner with HOBOEM. Explore wholesale opportunities, brand collaborations, and career opportunities with our premium fashion brand.",
    openGraph: {
        title: "Work With Us | HOBOEM",
        description: "Partner with HOBOEM. Explore wholesale opportunities, brand collaborations, and career opportunities.",
        url: "https://hoboem.com/work",
    },
};

export default function WorkPage() {
    return (
        <div className="min-h-screen bg-black text-white font-mono">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50">
                <div className="flex justify-between items-center px-6 md:px-16 py-6">
                    <Link
                        href="/"
                        className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors"
                    >
                        ← Back
                    </Link>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                        Opportunities
                    </span>
                </div>
            </nav>

            {/* Hero */}
            <div className="min-h-screen flex flex-col justify-center px-6 md:px-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-white/[0.02] leading-none pointer-events-none select-none">
                    W
                </div>

                <div className="relative z-10 max-w-5xl">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">
                        Join the vision
                    </p>
                    <h1 className="text-[clamp(3rem,12vw,10rem)] font-black leading-[0.9] tracking-[-0.03em] uppercase">
                        Work
                        <br />
                        <span className="text-white/20">With Us</span>
                    </h1>
                    <p className="mt-12 text-white/60 text-lg max-w-md leading-relaxed">
                        HOBOEM is always looking for talented individuals and partners who share our vision
                        for quality, design, and innovation.
                    </p>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-12 left-6 md:left-16">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-px bg-white/20" />
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                            Scroll to explore
                        </span>
                    </div>
                </div>
            </div>

            {/* Opportunities */}
            <div className="border-t border-white/10">
                {/* Wholesale */}
                <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/10 group hover:bg-white/5 transition-colors">
                    <div className="md:col-span-1 p-6 md:p-12 flex items-start">
                        <span className="text-[10px] text-white/20">01</span>
                    </div>
                    <div className="md:col-span-4 p-6 md:p-12 md:border-l border-white/10">
                        <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wide">
                            Wholesale
                        </h2>
                    </div>
                    <div className="md:col-span-5 p-6 md:p-12 md:border-l border-white/10">
                        <p className="text-white/60 leading-relaxed mb-6">
                            Interested in carrying HOBOEM products in your store? We offer competitive wholesale pricing
                            and flexible terms for qualified retailers.
                        </p>
                        <a
                            href="mailto:wholesale@hoboem.com"
                            className="inline-flex items-center gap-3 text-sm text-white group-hover:opacity-100 opacity-60 transition-opacity"
                        >
                            wholesale@hoboem.com
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>
                    <div className="md:col-span-2 p-6 md:p-12 md:border-l border-white/10 flex items-center justify-end">
                        <span className="text-6xl md:text-8xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                            →
                        </span>
                    </div>
                </div>

                {/* Collaborations */}
                <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/10 group hover:bg-white/5 transition-colors">
                    <div className="md:col-span-1 p-6 md:p-12 flex items-start">
                        <span className="text-[10px] text-white/20">02</span>
                    </div>
                    <div className="md:col-span-4 p-6 md:p-12 md:border-l border-white/10">
                        <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wide">
                            Collaborations
                        </h2>
                    </div>
                    <div className="md:col-span-5 p-6 md:p-12 md:border-l border-white/10">
                        <p className="text-white/60 leading-relaxed mb-6">
                            We're open to creative collaborations with like-minded brands and designers.
                            If you have an idea that aligns with our aesthetic, we'd love to hear from you.
                        </p>
                        <a
                            href="mailto:collaborations@hoboem.com"
                            className="inline-flex items-center gap-3 text-sm text-white group-hover:opacity-100 opacity-60 transition-opacity"
                        >
                            collaborations@hoboem.com
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>
                    <div className="md:col-span-2 p-6 md:p-12 md:border-l border-white/10 flex items-center justify-end">
                        <span className="text-6xl md:text-8xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                            →
                        </span>
                    </div>
                </div>

                {/* Careers */}
                <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/10 group hover:bg-white/5 transition-colors">
                    <div className="md:col-span-1 p-6 md:p-12 flex items-start">
                        <span className="text-[10px] text-white/20">03</span>
                    </div>
                    <div className="md:col-span-4 p-6 md:p-12 md:border-l border-white/10">
                        <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wide">
                            Careers
                        </h2>
                    </div>
                    <div className="md:col-span-5 p-6 md:p-12 md:border-l border-white/10">
                        <p className="text-white/60 leading-relaxed mb-6">
                            We're a small, dedicated team passionate about what we do. While we don't have open positions
                            at the moment, we're always interested in hearing from talented individuals.
                        </p>
                        <a
                            href="mailto:careers@hoboem.com"
                            className="inline-flex items-center gap-3 text-sm text-white group-hover:opacity-100 opacity-60 transition-opacity"
                        >
                            careers@hoboem.com
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>
                    <div className="md:col-span-2 p-6 md:p-12 md:border-l border-white/10 flex items-center justify-end">
                        <span className="text-6xl md:text-8xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                            →
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="py-32 px-6 md:px-16 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4">
                    Ready to connect?
                </p>
                <Link
                    href="/contact"
                    className="inline-block text-3xl md:text-5xl font-black uppercase tracking-wide hover:opacity-60 transition-opacity"
                >
                    Get in Touch →
                </Link>
            </div>

            {/* Footer */}
            <div className="px-6 md:px-16 py-6 border-t border-white/10">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-white/40">
                    <span>HOBOEM © 2026</span>
                    <Link href="/" className="hover:text-white transition-colors">
                        Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}
