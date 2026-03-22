import "server-only";

import fs from "node:fs";
import path from "node:path";

interface BannerImage {
    src: string;
    alt: string;
}

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);
const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

function createAltText(fileName: string) {
    const nameWithoutExtension = fileName.replace(/\.[^.]+$/, "");

    return nameWithoutExtension
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();
}

export function getBannerImages(): BannerImage[] {
    const bannerDirectory = path.join(process.cwd(), "public", "banners");

    if (!fs.existsSync(bannerDirectory)) {
        return [];
    }

    return fs.readdirSync(bannerDirectory)
        .filter((fileName) => SUPPORTED_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
        .sort((left, right) => collator.compare(left, right))
        .map((fileName) => ({
            src: `/banners/${fileName}`,
            alt: createAltText(fileName),
        }));
}
