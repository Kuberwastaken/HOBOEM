import type { Metadata } from "next";

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
        <div className="min-h-screen bg-white text-black font-mono px-4 md:px-8 py-12 max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-black tracking-[0.3em] mb-8">ABOUT HOBOEM</h1>

            <div className="space-y-8 text-sm leading-relaxed">
                <section>
                    <p className="text-black/70 text-base">
                        HOBOEM is a premium fashion and accessories brand dedicated to delivering exceptional quality
                        and timeless design. Our curated collection spans watches, belts, sunglasses, and lingerie.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Our Philosophy</h2>
                    <p className="text-black/70">
                        We believe in minimalism, functionality, and craftsmanship. Every product is selected with care
                        to ensure it meets our exacting standards for quality and aesthetic appeal.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Quality Commitment</h2>
                    <p className="text-black/70">
                        Each item in our collection undergoes rigorous quality control. We work directly with manufacturers
                        to ensure authenticity and durability, providing you with products that stand the test of time.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Customer First</h2>
                    <p className="text-black/70">
                        Your satisfaction is our priority. We offer transparent pricing, detailed product information,
                        and responsive customer service to make your shopping experience seamless.
                    </p>
                </section>
            </div>
        </div>
    );
}
