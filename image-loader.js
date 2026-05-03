// Custom Next.js image loader for static export under a basePath
// (e.g. GitHub Pages at /HOBOEM). Prepends NEXT_PUBLIC_BASE_PATH to
// any local absolute path. Pass-through for remote/data/blob URLs and
// already-prefixed paths.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function imageLoader({ src }) {
    if (!src) return src;
    if (/^(https?:|data:|blob:)/i.test(src)) return src;
    if (!BASE_PATH) return src;
    if (src.startsWith(BASE_PATH + "/")) return src;
    if (src.startsWith("/")) return BASE_PATH + src;
    return src;
}
