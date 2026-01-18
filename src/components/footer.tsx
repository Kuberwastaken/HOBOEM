import Link from "next/link";

export default function Footer() {
    const links = [
        { label: "PRIVACY POLICY", href: "/privacy" },
        { label: "TERMS", href: "/terms" },
        { label: "ABOUT", href: "/about" },
        { label: "WORK", href: "/work" },
        { label: "CONTACT US", href: "/contact" },
    ];

    return (
        <footer className="py-3 md:py-4 px-3 md:px-8 flex justify-center text-[9px] md:text-xs text-black/60 font-mono tracking-widest">
            <div className="flex flex-wrap justify-center gap-3 md:gap-8">
                {links.map((link) => (
                    <Link key={link.label} href={link.href} className="hover:text-black transition-colors">
                        {link.label}
                    </Link>
                ))}
            </div>
        </footer>
    );
}
