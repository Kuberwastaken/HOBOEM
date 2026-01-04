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
        <footer className="py-12 px-4 md:px-8 flex flex-col items-center justify-center gap-8 text-[10px] md:text-xs text-black/60 font-mono tracking-widest">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                {links.map((link) => (
                    <Link key={link} href="#" className="hover:text-black">
                        {link}
                    </Link>
                ))}
            </div>
            <div>
                © YEEZY
            </div>
        </footer>
    );
}
