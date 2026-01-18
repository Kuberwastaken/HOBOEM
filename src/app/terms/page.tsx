import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "HOBOEM's terms of service. Read our policies on orders, payments, returns, and intellectual property rights.",
    openGraph: {
        title: "Terms of Service | HOBOEM",
        description: "HOBOEM's terms of service. Read our policies on orders, payments, returns, and intellectual property.",
        url: "https://hoboem.com/terms",
    },
};

export default function TermsPage() {
    const sections = [
        {
            number: "01",
            title: "Agreement",
            content: [
                "By accessing and using HOBOEM, you agree to be bound by these terms of service.",
                "If you disagree with any part of these terms, please do not use our services."
            ]
        },
        {
            number: "02",
            title: "Orders & Payment",
            content: [
                "All orders are subject to availability and confirmation. We reserve the right to refuse or cancel any order.",
                "Payment must be received in full before order processing begins."
            ]
        },
        {
            number: "03",
            title: "Returns & Refunds",
            content: [
                "Items may be returned within 14 days of receipt in original condition.",
                "Refunds will be processed within 7-10 business days of receiving the return."
            ]
        },
        {
            number: "04",
            title: "Intellectual Property",
            content: [
                "All content, designs, and branding on HOBOEM are protected by copyright and trademark laws.",
                "Unauthorized use is strictly prohibited."
            ]
        },
        {
            number: "05",
            title: "Limitation of Liability",
            content: [
                "HOBOEM shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white text-black font-mono">
            {/* Minimal Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-black/5">
                <div className="flex justify-between items-center px-6 md:px-16 py-4">
                    <Link
                        href="/"
                        className="text-[10px] uppercase tracking-[0.3em] text-black/40 hover:text-black transition-colors"
                    >
                        ← Back
                    </Link>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                        Terms
                    </span>
                </div>
            </div>

            {/* Full-bleed Hero */}
            <div className="h-screen flex flex-col justify-end px-6 md:px-16 pb-20">
                <div className="max-w-4xl">
                    <div className="overflow-hidden">
                        <h1 className="text-[clamp(4rem,18vw,14rem)] font-black leading-[0.8] tracking-[-0.05em] uppercase">
                            Terms
                        </h1>
                    </div>
                    <div className="flex items-end justify-between mt-8 border-t border-black/10 pt-8">
                        <p className="text-black/40 text-sm max-w-md leading-relaxed">
                            The legal framework that governs your relationship with HOBOEM.
                            Read carefully before proceeding.
                        </p>
                        <div className="hidden md:block text-right">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-1">
                                Last Updated
                            </div>
                            <div className="text-sm">
                                January 2026
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <div className="w-px h-16 bg-gradient-to-b from-transparent via-black/20 to-black/40 animate-pulse" />
                </div>
            </div>

            {/* Content Sections */}
            <div className="bg-[#fafaf8]">
                {sections.map((section, index) => (
                    <div
                        key={section.number}
                        className={`border-b border-black/5 ${index === 0 ? 'border-t' : ''}`}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[50vh]">
                            {/* Number */}
                            <div className="md:col-span-2 flex items-start justify-start p-6 md:p-12">
                                <span className="text-[8rem] md:text-[12rem] font-black leading-none text-black/[0.03]">
                                    {section.number}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="md:col-span-10 flex flex-col justify-center p-6 md:p-12 md:pl-0">
                                <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wide mb-8">
                                    {section.title}
                                </h2>
                                <div className="max-w-xl space-y-4">
                                    {section.content.map((paragraph, i) => (
                                        <p key={i} className="text-black/60 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="bg-black text-white px-6 md:px-16 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6">
                        Questions about our terms?
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block text-2xl md:text-4xl font-bold uppercase tracking-wider hover:opacity-60 transition-opacity"
                    >
                        Contact Us →
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-black text-white/40 px-6 md:px-16 py-6 border-t border-white/10">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em]">
                    <span>HOBOEM © 2026</span>
                    <Link href="/" className="hover:text-white transition-colors">
                        Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}
