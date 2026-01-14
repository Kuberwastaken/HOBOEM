import type { Metadata } from "next";

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
    return (
        <div className="min-h-screen bg-white text-black font-mono px-4 md:px-8 py-12 max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-black tracking-[0.3em] mb-8">TERMS OF SERVICE</h1>

            <div className="space-y-6 text-sm leading-relaxed">
                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Agreement</h2>
                    <p className="text-black/70">
                        By accessing and using HOBOEM, you agree to be bound by these terms of service.
                        If you disagree with any part of these terms, please do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Orders & Payment</h2>
                    <p className="text-black/70">
                        All orders are subject to availability and confirmation. We reserve the right to refuse or cancel any order.
                        Payment must be received in full before order processing begins.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Returns & Refunds</h2>
                    <p className="text-black/70">
                        Items may be returned within 14 days of receipt in original condition.
                        Refunds will be processed within 7-10 business days of receiving the return.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Intellectual Property</h2>
                    <p className="text-black/70">
                        All content, designs, and branding on HOBOEM are protected by copyright and trademark laws.
                        Unauthorized use is strictly prohibited.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Limitation of Liability</h2>
                    <p className="text-black/70">
                        HOBOEM shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.
                    </p>
                </section>
            </div>
        </div>
    );
}
