// CDN URL helpers for product images.
//
// THUMBNAILS  → served from GitHub Pages (generated in CI by Sharp)
//   /products/HOBF19/HOBF19.jpg  →  /products/HOBF19/HOBF19-thumb.jpg
//   ~30-50 KB each, loaded on every product grid page.
//
// FULL-SIZE   → served via jsDelivr from the git commit SHA
//   /products/HOBF19/HOBF19.jpg  →  https://cdn.jsdelivr.net/gh/Kuberwastaken/HOBOEM@{sha}/public/products/HOBF19/HOBF19.jpg
//   Loaded only when user opens a product modal.
//   NEXT_PUBLIC_CDN_TAG is injected by the CI workflow (${{ github.sha }}) for
//   automatic per-deploy cache busting. Falls back to local path in dev.

const CDN_TAG = process.env.NEXT_PUBLIC_CDN_TAG || "";
const CDN_BASE = CDN_TAG
    ? `https://cdn.jsdelivr.net/gh/Kuberwastaken/HOBOEM@${CDN_TAG}/public`
    : "";

/**
 * Returns the thumbnail path for a product image.
 * e.g. /products/HOBF19/HOBF19.jpg → /products/HOBF19/HOBF19-thumb.jpg
 * Thumbnails are 600 px wide, q75 JPEG (~30-50 KB).
 */
export function thumbUrl(src: string): string {
    if (!src) return src;
    return src.replace(/(\.[^./]+)$/, "-thumb$1");
}

/**
 * Returns the jsDelivr CDN URL for the full-size product image.
 * Falls back to the local path during development (CDN_TAG not set).
 * e.g. /products/HOBF19/HOBF19.jpg → https://cdn.jsdelivr.net/.../HOBF19.jpg
 */
export function fullUrl(src: string): string {
    if (!src) return src;
    if (/^(https?:|data:|blob:)/i.test(src)) return src;
    if (!CDN_BASE) return src;
    return CDN_BASE + src;
}
