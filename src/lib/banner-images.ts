import "server-only";

import fs from "node:fs";
import path from "node:path";

interface BannerImage {
    src: string;
    alt: string;
}

interface BannerImageSet {
    desktop: BannerImage[];
    mobile: BannerImage[];
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

function getImagesFromDirectory(directoryPath: string, publicPathPrefix: string): BannerImage[] {
    if (!fs.existsSync(directoryPath)) {
        return [];
    }

    return fs.readdirSync(directoryPath)
        .filter((fileName) => SUPPORTED_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
        .sort((left, right) => collator.compare(left, right))
        .map((fileName) => ({
            src: `${publicPathPrefix}/${fileName}`,
            alt: createAltText(fileName),
        }));
}

export function getBannerImages(): BannerImageSet {
    const desktopBannerDirectory = path.join(process.cwd(), "public", "banners");
    const mobileBannerDirectory = path.join(desktopBannerDirectory, "mobile");

    return {
        desktop: getImagesFromDirectory(desktopBannerDirectory, "/banners"),
        mobile: getImagesFromDirectory(mobileBannerDirectory, "/banners/mobile"),
    };
}
