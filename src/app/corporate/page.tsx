import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Corporate Enquiries",
    description: "HOBOEM by House of Brands provides end-to-end OEM and bulk supply solutions tailored for corporate clients, institutions, and organizations.",
    openGraph: {
        title: "Corporate Enquiries | HOBOEM",
        description: "HOBOEM provides end-to-end OEM and bulk supply solutions tailored for corporate clients.",
        url: "https://hoboem.com/corporate",
    },
};

export default function CorporatePage() {
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
                        Corporate
                    </span>
                </div>
            </nav>

            {/* Split Hero */}
            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
                {/* Left - Title */}
                <div className="flex flex-col justify-end p-6 md:p-16 pb-12 md:pb-20">
                    <div className="space-y-2">
                        <h1 className="text-[clamp(3.5rem,14vw,11rem)] font-black leading-[0.85] tracking-[-0.04em] uppercase">
                            Corporate
                        </h1>
                        <h1 className="text-[clamp(3.5rem,14vw,11rem)] font-black leading-[0.85] tracking-[-0.04em] uppercase text-black/20">
                            Enquiries
                        </h1>
                    </div>
                </div>

                {/* Right - Intro */}
                <div className="flex flex-col justify-end p-6 md:p-16 pb-12 md:pb-20 bg-black/5">
                    <div className="max-w-[45rem]">
                        <p className="text-lg md:text-xl leading-relaxed text-black/80">
                            HOBOEM by House of Brands provides end-to-end OEM and bulk supply solutions tailored for corporate clients, institutions, and organizations seeking reliable, scalable, and customized product offerings.
                        </p>
                        <div className="mt-8 pt-8 border-t border-black/10">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                                B2B & Bulk Supply
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Partner Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Offerings */}
                <div className="bg-[#d4cfc3] p-8 md:p-20 min-h-[60vh] flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-6">
                            Our Offerings
                        </h3>
                        <p className="text-black/80 leading-relaxed max-w-md mb-8">
                            We offer a diverse range of products across key categories, including watches, sunglasses, wallets, belts, lingerie, and curated gift sets for men, women, and kids. Our solutions are designed to support:
                        </p>
                        <ul className="space-y-4 text-black/60 max-w-md">
                            <li className="flex items-start gap-3">
                                <span className="text-black/30 mt-1">→</span>
                                <span>Employee and client gifting programs</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-black/30 mt-1">→</span>
                                <span>Promotional and branding merchandise</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-black/30 mt-1">→</span>
                                <span>Private label and brand launches</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-black/30 mt-1">→</span>
                                <span>Event, festive, and corporate gifting</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-black/30 mt-1">→</span>
                                <span>Bulk procurement with customization</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Customization */}
                <div className="bg-[#c9c4b8] p-8 md:p-20 min-h-[60vh] flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-6">
                            Customization Capabilities
                        </h3>
                        <p className="text-black/80 leading-relaxed max-w-md mb-8">
                            Our integrated approach enables complete branding flexibility. All services are supported by low MOQ requirements and scalable production capacity:
                        </p>
                        <ul className="space-y-4 text-black/60 max-w-md">
                            <li className="flex items-start gap-3">
                                <span className="text-black/30 mt-1">→</span>
                                <span>Logo application on products</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-black/30 mt-1">→</span>
                                <span>Custom packaging and gift boxes</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-black/30 mt-1">→</span>
                                <span>Private labeling solutions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-black/30 mt-1">→</span>
                                <span>Curated gift sets and combinations</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Why Partner with HOBOEM */}
            <div className="bg-black text-white py-20 md:py-32 px-6 md:px-16">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-12 pb-6 border-b border-white/20">
                        Why Partner with Us
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-white/80">
                        <li className="flex items-start gap-4">
                            <span className="text-white/40 mt-1">01</span>
                            <span>Established OEM and manufacturing expertise</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-white/40 mt-1">02</span>
                            <span>Strong global sourcing and production network</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-white/40 mt-1">03</span>
                            <span>Consistent quality assurance and timely delivery</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-white/40 mt-1">04</span>
                            <span>Dedicated support for corporate clients</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-white/40 mt-1">05</span>
                            <span>Flexible, business-focused solutions</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-white px-6 md:px-16 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-8">
                        Get In Touch
                    </p>
                    <p className="text-lg md:text-xl leading-relaxed text-black/60 mb-12 max-w-2xl mx-auto">
                        For corporate orders, collaborations, or customized requirements, please connect with our team. We will assist you with product selection, customization options, pricing, and timelines to ensure a seamless and efficient experience.
                    </p>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                        <a
                            href="mailto:sales@houseofbrands.in"
                            className="group"
                        >
                            <span className="block text-[10px] uppercase tracking-[0.4em] text-black/40 mb-2 group-hover:text-black transition-colors">Email</span>
                            <span className="text-2xl md:text-3xl font-bold group-hover:opacity-60 transition-opacity">sales@houseofbrands.in</span>
                        </a>
                        <a
                            href="https://wa.me/917303681193"
                            className="group"
                        >
                            <span className="block text-[10px] uppercase tracking-[0.4em] text-black/40 mb-2 group-hover:text-black transition-colors">WhatsApp</span>
                            <span className="text-2xl md:text-3xl font-bold group-hover:opacity-60 transition-opacity">+91 73036 81193</span>
                        </a>
                    </div>
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
                        <Link href="/corporate" className="hover:text-black transition-colors text-black">Corporate Enquiries</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
