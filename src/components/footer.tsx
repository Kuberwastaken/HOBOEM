import Link from "next/link";
import { useCurrency, Currency } from "@/context/currency-context";

export default function Footer() {
    const { currency, setCurrency } = useCurrency();
    const links = [
        { label: "ABOUT US", href: "/about" },
        { label: "CONTACT US", href: "/contact" },
        { label: "OUR CLIENTS", href: "/clients" },
        { label: "ONLINE PARTNERS", href: "/partners" },
        { label: "CORPORATE ENQUIRIES", href: "/corporate" },
        { label: "PRIVACY", href: "/privacy" },
        { label: "TERMS", href: "/terms" },
    ];

    return (
        <footer className="mt-16 md:mt-24 py-4 md:py-6 px-3 md:px-8 flex justify-center text-[9px] md:text-xs text-black/60 font-mono tracking-widest">
            <div className="flex flex-col items-center gap-6">
                <div className="flex flex-wrap justify-center gap-3 md:gap-8">
                    {links.map((link) => (
                        <Link key={link.label} href={link.href} className="hover:text-black transition-colors">
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Currency Selector */}
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="bg-transparent text-[9px] md:text-xs text-black/60 font-mono tracking-widest border-none focus:ring-0 cursor-pointer hover:text-black uppercase"
                >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="HKD">HKD ($)</option>
                    <option value="CNY">CNY (¥)</option>
                </select>

                <div className="text-[8px] md:text-[9px] text-black/40">
                    © {new Date().getFullYear()} HOBOEM
                </div>
            </div>
        </footer>
    );
}
