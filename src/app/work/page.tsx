import type { Metadata } from "next";

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
        <div className="min-h-screen bg-white text-black font-mono px-4 md:px-8 py-12 max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-black tracking-[0.3em] mb-8">WORK WITH US</h1>

            <div className="space-y-8 text-sm leading-relaxed">
                <section>
                    <p className="text-black/70 text-base">
                        HOBOEM is always looking for talented individuals and partners who share our vision
                        for quality, design, and innovation.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Wholesale Partnerships</h2>
                    <p className="text-black/70 mb-3">
                        Interested in carrying HOBOEM products in your store? We offer competitive wholesale pricing
                        and flexible terms for qualified retailers.
                    </p>
                    <p className="text-black/70">
                        Contact: wholesale@hoboem.com
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Brand Collaborations</h2>
                    <p className="text-black/70 mb-3">
                        We're open to creative collaborations with like-minded brands and designers.
                        If you have an idea that aligns with our aesthetic, we'd love to hear from you.
                    </p>
                    <p className="text-black/70">
                        Contact: collaborations@hoboem.com
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-3 uppercase tracking-wide">Join Our Team</h2>
                    <p className="text-black/70 mb-3">
                        We're a small, dedicated team passionate about what we do. While we don't have open positions
                        at the moment, we're always interested in hearing from talented individuals.
                    </p>
                    <p className="text-black/70">
                        Send your portfolio to: careers@hoboem.com
                    </p>
                </section>
            </div>
        </div>
    );
}
