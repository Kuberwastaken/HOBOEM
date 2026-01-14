import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with HOBOEM. Contact our customer service team via WhatsApp at +91 73036 81193 or email. We're here to help with orders and inquiries.",
    openGraph: {
        title: "Contact Us | HOBOEM",
        description: "Get in touch with HOBOEM. Contact our customer service team via WhatsApp or email.",
        url: "https://hoboem.com/contact",
    },
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white text-black font-mono px-4 md:px-8 py-12 max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-black tracking-[0.3em] mb-8">CONTACT US</h1>

            <div className="space-y-8 text-sm leading-relaxed">
                <section>
                    <p className="text-black/70 text-base mb-6">
                        We're here to help with any questions about our products, orders, or services.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Customer Service</h2>
                    <div className="space-y-2 text-black/70">
                        <p>WhatsApp: +91 73036 81193</p>
                        <p>Email: support@hoboem.com</p>
                        <p>Hours: Monday - Saturday, 10:00 AM - 6:00 PM IST</p>
                    </div>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Order Inquiries</h2>
                    <div className="space-y-2 text-black/70">
                        <p>For questions about your order, please include your order number.</p>
                        <p>Email: orders@hoboem.com</p>
                    </div>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Business Inquiries</h2>
                    <div className="space-y-2 text-black/70">
                        <p>Wholesale: wholesale@hoboem.com</p>
                        <p>Partnerships: collaborations@hoboem.com</p>
                        <p>Press: press@hoboem.com</p>
                    </div>
                </section>

                <section className="pt-6 border-t border-gray-200">
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Location</h2>
                    <div className="text-black/70">
                        <p>HOBOEM</p>
                        <p>India</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
