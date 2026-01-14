import type { Metadata } from "next";

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
        <div className="min-h-screen bg-white text-black font-mono px-4 md:px-8 py-12 max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-black tracking-[0.3em] mb-8">PRIVACY POLICY</h1>

            <div className="space-y-6 text-sm leading-relaxed">
                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Information Collection</h2>
                    <p className="text-black/70">
                        HOBOEM collects minimal information necessary to process orders and improve your shopping experience.
                        We do not sell or share your personal information with third parties.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Data Usage</h2>
                    <p className="text-black/70">
                        Your data is used solely for order fulfillment, customer service, and internal analytics.
                        We employ industry-standard security measures to protect your information.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Cookies</h2>
                    <p className="text-black/70">
                        We use essential cookies to maintain your shopping cart and preferences.
                        No tracking or advertising cookies are used on this site.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Your Rights</h2>
                    <p className="text-black/70">
                        You have the right to access, modify, or delete your personal data at any time.
                        Contact us at privacy@hoboem.com for any data-related requests.
                    </p>
                </section>
            </div>
        </div>
    );
}
