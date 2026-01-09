import Link from "next/link";

export default function Footer() {
    const links = [
        "PRIVACY POLICY",
        "TERMS",
        "DEALERS",
        "ARCHIVE",
        "NEWSLETTER"
    ];

    return (
        <footer className="py-4 md:py-8 px-3 md:px-8 flex flex-col md:flex-col items-center justify-center gap-2 md:gap-6 text-[9px] md:text-xs text-black/60 font-mono tracking-widest">
            {/* Mobile: Single line with links only, no HOBOEM */}
            {/* Desktop: Links row + HOBOEM row */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-12">
                {links.map((link) => (
                    <Link key={link} href="#" className="hover:text-black">
                        {link}
                    </Link>
                ))}
                {/* Mobile: Add copyright inline */}
                <span className="md:hidden">© HOBOEM</span>
            </div>
            {/* Desktop only: Separate copyright line */}
            <div className="hidden md:block">
                © HOBOEM
            </div>
        </footer>
    );
}
