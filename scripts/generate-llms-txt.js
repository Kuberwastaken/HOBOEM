// Generates public/llms.txt — a structured plain-text file for LLM crawlers
// following the llmstxt.org convention.
// Run: node scripts/generate-llms-txt.js

const fs = require("fs");
const path = require("path");

// Inline the product data by parsing products.ts with regex
// (avoids needing ts-node; the file structure is deterministic)
const productsFile = fs.readFileSync(
    path.join(__dirname, "../src/lib/products.ts"),
    "utf8"
);

// Parse products by splitting on top-level objects
const productBlocks = [];
const re =
    /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)"\s*as Category,\s*gender:\s*"([^"]+)"\s*as Gender,(?:\s*subcategory:\s*"([^"]*)",)?(?:\s*description:\s*"([^"]*)",)?/g;

let match;
while ((match = re.exec(productsFile)) !== null) {
    productBlocks.push({
        id: match[1],
        name: match[2],
        category: match[3],
        gender: match[4],
        subcategory: match[5] || "",
        description: match[6] || "",
    });
}

// Group by subcategory
const groups = {};
for (const p of productBlocks) {
    const key = p.subcategory || p.category;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
}

const SUBCATEGORY_LABELS = {
    WATCHES_MEN: "Men's Watches",
    WATCHES_WOMEN: "Women's Watches",
    WATCHES_KIDS: "Kids' Watches",
    SUNGLASSES_UNISEX: "Unisex Sunglasses",
    SUNGLASSES_KIDS: "Kids' Sunglasses",
    LEATHER_BELTS: "Leather Belts",
    LEATHER_WALLETS: "Leather Wallets",
    LINGERIE: "Lingerie",
};

const lines = [];

lines.push("# HOBOEM");
lines.push("");
lines.push(
    "HOBOEM is a premium Indian fashion and accessories brand offering watches, sunglasses, leather belts, leather wallets, and lingerie. All products are available at https://hoboem.com."
);
lines.push("");
lines.push("## Pages");
lines.push("");
lines.push("- [Home / Full Catalog](https://hoboem.com): Browse all 1052+ products with filtering by category and gender.");
lines.push("- [About](https://hoboem.com/about): Brand story and philosophy.");
lines.push("- [Partners](https://hoboem.com/partners): Online retail partners including Amazon, Myntra, Flipkart, Ajio, FirstCry, Hopscotch, Shoppers Stop, and Noon.");
lines.push("- [Contact](https://hoboem.com/contact): Contact information.");
lines.push("- [Privacy Policy](https://hoboem.com/privacy): Privacy policy.");
lines.push("- [Terms of Service](https://hoboem.com/terms): Terms and conditions.");
lines.push("");
lines.push("## Product Catalog");
lines.push("");
lines.push(
    `The full catalog contains ${productBlocks.length} products across ${Object.keys(groups).length} categories. Each product has a dedicated page at https://hoboem.com/products/{id}.`
);
lines.push("");

for (const [key, products] of Object.entries(groups)) {
    const label = SUBCATEGORY_LABELS[key] || key;
    lines.push(`### ${label} (${products.length} products)`);
    lines.push("");
    for (const p of products) {
        const desc = p.description ? ` — ${p.description}` : "";
        lines.push(`- [${p.id}](https://hoboem.com/products/${p.id})${desc}`);
    }
    lines.push("");
}

lines.push("## Sitemap");
lines.push("");
lines.push("Full sitemap: https://hoboem.com/sitemap.xml");
lines.push("");

const out = lines.join("\n");
const outPath = path.join(__dirname, "../public/llms.txt");
fs.writeFileSync(outPath, out, "utf8");
console.log(`✓ Wrote ${outPath} (${productBlocks.length} products, ${out.length} bytes)`);
