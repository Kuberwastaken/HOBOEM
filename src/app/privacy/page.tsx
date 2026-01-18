import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "HOBOEM's privacy policy. Learn how we collect, use, and protect your personal information when you shop with us.",
    openGraph: {
        title: "Privacy Policy | HOBOEM",
        description: "HOBOEM's privacy policy. Learn how we collect, use, and protect your personal information.",
        url: "https://hoboem.com/privacy",
    },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#f5f5f0] text-black font-mono">
            {/* Hero Section */}
            <div className="h-[40vh] flex items-end justify-start px-6 md:px-16 pb-12 border-b border-black/10">
                <div>
                    <Link
                        href="/"
                        className="inline-block text-[10px] uppercase tracking-[0.3em] text-black/40 hover:text-black transition-colors mb-8"
                    >
                        ← Back to Shop
                    </Link>
                    <h1 className="text-[clamp(3rem,12vw,10rem)] font-black leading-[0.85] tracking-[-0.04em] uppercase">
                        Privacy
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide mt-4 text-black/60">
                        Policy
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-black/10">
                {/* Left Column - Index */}
                <div className="md:col-span-3 border-r border-black/10 p-6 md:p-12 md:sticky md:top-0 md:h-screen">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-8">
                        Index
                    </div>
                    <nav className="space-y-4">
                        {["Collection", "Usage", "Cookies", "Rights"].map((item, i) => (
                            <div key={item} className="group flex items-baseline gap-4">
                                <span className="text-[10px] text-black/30 font-mono">0{i + 1}</span>
                                <span className="text-sm uppercase tracking-widest text-black/70 group-hover:text-black transition-colors cursor-pointer">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Right Column - Content */}
                <div className="md:col-span-9 p-6 md:p-16">
                    <div className="max-w-2xl space-y-20">
                        <section>
                            <div className="flex items-baseline gap-6 mb-8">
                                <span className="text-6xl md:text-8xl font-black text-black/10">01</span>
                                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">
                                    Information Collection
                                </h2>
                            </div>
                            <div className="pl-0 md:pl-24 space-y-6 text-black/60 leading-relaxed">
                                <p>
                                    HOBOEM collects minimal information necessary to process orders and improve your shopping experience.
                                </p>
                                <p>
                                    We do not sell or share your personal information with third parties.
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-baseline gap-6 mb-8">
                                <span className="text-6xl md:text-8xl font-black text-black/10">02</span>
                                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">
                                    Data Usage
                                </h2>
                            </div>
                            <div className="pl-0 md:pl-24 space-y-6 text-black/60 leading-relaxed">
                                <p>
                                    Your data is used solely for order fulfillment, customer service, and internal analytics.
                                </p>
                                <p>
                                    We employ industry-standard security measures to protect your information.
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-baseline gap-6 mb-8">
                                <span className="text-6xl md:text-8xl font-black text-black/10">03</span>
                                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">
                                    Cookies
                                </h2>
                            </div>
                            <div className="pl-0 md:pl-24 space-y-6 text-black/60 leading-relaxed">
                                <p>
                                    We use essential cookies to maintain your shopping cart and preferences.
                                </p>
                                <p>
                                    No tracking or advertising cookies are used on this site.
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-baseline gap-6 mb-8">
                                <span className="text-6xl md:text-8xl font-black text-black/10">04</span>
                                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">
                                    Your Rights
                                </h2>
                            </div>
                            <div className="pl-0 md:pl-24 space-y-6 text-black/60 leading-relaxed">
                                <p>
                                    You have the right to access, modify, or delete your personal data at any time.
                                </p>
                                <div className="pt-6 border-t border-black/10">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-2">Contact</p>
                                    <p className="text-black">privacy@hoboem.com</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 md:px-16 py-8 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-black/40">
                <span>HOBOEM © 2026</span>
                <Link href="/" className="hover:text-black transition-colors">
                    Return to Shop
                </Link>
            </div>
        </div>
    );
}
