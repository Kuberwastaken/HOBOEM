// Prepends the configured basePath to absolute local asset paths. Use
// this for any asset URL that is NOT consumed by next/image (which has
// its own custom loader). Safe for remote, data, and blob URLs.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(src: string): string {
    if (!src) return src;
    if (/^(https?:|data:|blob:)/i.test(src)) return src;
    if (!BASE_PATH) return src;
    if (src.startsWith(BASE_PATH + "/")) return src;
    if (src.startsWith("/")) return BASE_PATH + src;
    return src;
}

export const BASE_PATH_VALUE = BASE_PATH;
