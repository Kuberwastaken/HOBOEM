/**
 * New Products Import Script
 *
 * Reads the new-products/ folder structure:
 *   Category/Subcategory/ containing Excel metadata + product images
 *
 * For each subcategory:
 *   1. Parses the Excel file for product metadata
 *   2. Copies product images to public/products/
 *   3. Generates standardized CSVs to products-csv/
 *   4. Generates src/lib/products.ts
 *
 * Expected folder structure:
 *   new-products/
 *     {Category}/
 *       {Subcategory}/
 *         *.xlsx   (one Excel file with product metadata)
 *         *.jpg    (product images named by Image SKU)
 *
 * To add new products:
 *   1. Place the Excel + images in the correct new-products subfolder
 *   2. If it's a new subcategory, add a mapping in FOLDER_MAP below
 *   3. Run: node scripts/import-new-products.js
 *
 * Usage: node scripts/import-new-products.js
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// ─── Configuration ───────────────────────────────────────────────────────────

const ROOT_DIR = path.join(__dirname, '..');
const NEW_PRODUCTS_DIR = path.join(ROOT_DIR, 'new-products');
const CSV_OUTPUT_DIR = path.join(ROOT_DIR, 'products-csv');
const PUBLIC_PRODUCTS_DIR = path.join(ROOT_DIR, 'public', 'products');
const TS_OUTPUT_PATH = path.join(ROOT_DIR, 'src', 'lib', 'products.ts');

/**
 * Folder mapping: relative path under new-products/ → category metadata.
 *
 * When you get new product drops in the same format, just:
 *   - Drop them into the matching folder
 *   - Or add a new entry here for a new subcategory
 *   - Re-run the script
 */
const FOLDER_MAP = {
    'Watches/Men Watch':            { category: 'WATCHES',    gender: 'MEN',    subcategory: 'WATCHES_MEN',        csvGroup: 'Watches' },
    'Watches/Women Watch':          { category: 'WATCHES',    gender: 'WOMEN',  subcategory: 'WATCHES_WOMEN',      csvGroup: 'Watches' },
    'Watches/Kids Watches':         { category: 'WATCHES',    gender: 'KIDS',   subcategory: 'WATCHES_KIDS',       csvGroup: 'Watches' },
    'Sunglasses/Sunglasses-Unisex': { category: 'SUNGLASSES', gender: 'UNISEX', subcategory: 'SUNGLASSES_UNISEX',  csvGroup: 'Sunglasses' },
    'Sunglasses/Kids Sunglass':     { category: 'SUNGLASSES', gender: 'KIDS',   subcategory: 'SUNGLASSES_KIDS',    csvGroup: 'Sunglasses' },
    'Belts/Men Belt':               { category: 'LEATHER',    gender: 'MEN',    subcategory: 'LEATHER_BELTS',      csvGroup: 'Leather' },
    'Belts/Women Belt':             { category: 'LEATHER',    gender: 'WOMEN',  subcategory: 'LEATHER_BELTS',      csvGroup: 'Leather' },
    'Wallet':                       { category: 'LEATHER',    gender: 'UNISEX', subcategory: 'LEATHER_WALLETS',    csvGroup: 'Leather' },
    'Lingerie':                     { category: 'LINGERIE',   gender: 'WOMEN',  subcategory: null,                 csvGroup: 'Lingerie' },
};

// Color terms to strip from descriptions for display
const COLOR_TERMS = [
    // Multi-word first (longest match wins)
    'Rose Gold', 'Dark Brown', 'Light Brown', 'Navy Blue', 'Sky Blue', 'Light Blue',
    'Dark Grey', 'Light Grey', 'Off White', 'Jet Black', 'Matte Black', 'Two Tone RG',
    // Frame color patterns (sunglasses)
    'Black Frame Color', 'White Frame Color', 'Blue Frame Color', 'Red Frame Color',
    'Pink Frame Color', 'Green Frame Color', 'Grey Frame Color', 'Brown Frame Color',
    'Purple Frame Color', 'Yellow Frame Color', 'Orange Frame Color', 'Transparent Frame Color',
    // Single colors
    'Black', 'White', 'Silver', 'Gold', 'Blue', 'Green', 'Red', 'Grey', 'Gray',
    'Brown', 'Pink', 'Purple', 'Orange', 'Yellow', 'Beige', 'Tan', 'Navy',
    'Burgundy', 'Maroon', 'Teal', 'Copper', 'Bronze', 'Cream', 'Ivory', 'Nude',
    // Abbreviations
    'IPS', 'RG', 'BK', 'WH', 'GR', 'BL', 'GRY', 'SL',
];

// ─── Column Detection ────────────────────────────────────────────────────────

/**
 * Detect key columns in heterogeneous Excel headers.
 * Each Excel has different column names, so we pattern-match.
 */
function detectColumns(headers) {
    const normalized = headers.map(h => String(h || '').toLowerCase().trim());

    // Image SKU column: look for common patterns
    let imageSkuIdx = normalized.findIndex(h =>
        h === 'image sku' || h === 'oem sku' || h === 'imagesku'
    );

    // Description column
    let descIdx = normalized.findIndex(h => h === 'description');

    // Special case: Lingerie file has duplicate "Image SKU" headers
    // First = actual SKU, second = description
    if (imageSkuIdx >= 0 && descIdx < 0) {
        const allImageSkuCols = normalized
            .map((h, i) => ({ h, i }))
            .filter(x => x.h === 'image sku' || x.h === 'oem sku');

        if (allImageSkuCols.length >= 2) {
            descIdx = allImageSkuCols[allImageSkuCols.length - 1].i;
        }
    }

    // Fallback: use last column as description
    if (descIdx < 0) {
        descIdx = headers.length - 1;
    }

    // Ensure SKU and desc aren't the same column
    if (imageSkuIdx === descIdx) {
        descIdx = headers.length - 1;
        if (imageSkuIdx === descIdx && headers.length > 1) {
            descIdx = headers.length - 2;
        }
    }

    const priceIdx = normalized.findIndex(h => h === 'price');

    return { imageSkuIdx, descIdx, priceIdx };
}

// ─── Excel Parsing ───────────────────────────────────────────────────────────

function parseExcelFile(excelPath, folderConfig) {
    const workbook = XLSX.readFile(excelPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length < 2) return [];

    const headers = rows[0];
    const { imageSkuIdx, descIdx, priceIdx } = detectColumns(headers);

    if (imageSkuIdx < 0) {
        console.error(`  ⚠️  Could not find Image SKU column in: ${path.basename(excelPath)}`);
        console.error(`     Headers: ${headers.join(', ')}`);
        return [];
    }

    const products = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const imageSku = String(row[imageSkuIdx] || '').trim();
        if (!imageSku) continue;

        // Skip example/guide rows
        if (imageSku.startsWith('EXAMPLE_') || imageSku.startsWith('---')) continue;

        const description = descIdx >= 0 ? String(row[descIdx] || '').trim() : '';
        const price = priceIdx >= 0 ? parseFloat(row[priceIdx]) || undefined : undefined;

        products.push({
            id: imageSku,
            imageSku,
            category: folderConfig.category,
            gender: folderConfig.gender,
            subcategory: folderConfig.subcategory,
            price,
            description,
        });
    }

    return products;
}

// ─── Image Handling ──────────────────────────────────────────────────────────

function findProductImage(imageDir, imageSku) {
    // Try exact match with common extensions
    const exts = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'];
    for (const ext of exts) {
        const imgPath = path.join(imageDir, imageSku + ext);
        if (fs.existsSync(imgPath)) return imgPath;
    }

    // Case-insensitive fallback: scan directory
    try {
        const files = fs.readdirSync(imageDir);
        const skuLower = imageSku.toLowerCase();
        const match = files.find(f => {
            const nameNoExt = path.parse(f).name.toLowerCase();
            const ext = path.extname(f).toLowerCase();
            return nameNoExt === skuLower && ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
        });
        if (match) return path.join(imageDir, match);
    } catch { /* ignore */ }

    return null;
}

function copyProductImage(srcPath, imageSku) {
    const destDir = path.join(PUBLIC_PRODUCTS_DIR, imageSku);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    const ext = path.extname(srcPath).toLowerCase();
    const destPath = path.join(destDir, imageSku + ext);
    fs.copyFileSync(srcPath, destPath);
    return `/products/${imageSku}/${imageSku}${ext}`;
}

// ─── Description Processing ─────────────────────────────────────────────────

function stripColors(description) {
    if (!description) return '';

    let result = description;

    // Sort by length (longest first) to avoid partial replacements
    const sortedColors = [...COLOR_TERMS].sort((a, b) => b.length - a.length);

    for (const color of sortedColors) {
        const escaped = color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
        result = result.replace(regex, '');
    }

    return result
        .replace(/;\s*;/g, ';')         // collapse double semicolons
        .replace(/;\s*$/g, '')           // trailing semicolon
        .replace(/^\s*;\s*/g, '')        // leading semicolon
        .replace(/\s+/g, ' ')           // multiple spaces
        .replace(/\s*;\s*/g, ' ; ')     // normalize spacing around semicolons
        .trim();
}

// ─── CSV Generation ─────────────────────────────────────────────────────────

function generateCSV(products, outputName) {
    const header = 'id,imageSku,category,gender,subcategory,price,desc';
    const lines = [header];

    for (const p of products) {
        const desc = (p.description || '').replace(/"/g, '""');
        lines.push([
            p.id,
            p.imageSku,
            p.category,
            p.gender,
            p.subcategory || '',
            p.price != null ? p.price : '',
            `"${desc}"`,
        ].join(','));
    }

    const csvPath = path.join(CSV_OUTPUT_DIR, outputName);
    fs.writeFileSync(csvPath, lines.join('\n') + '\n', 'utf-8');
    return csvPath;
}

// ─── TypeScript Generation ──────────────────────────────────────────────────

function escapeString(s) {
    return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function generateTypeScript(allProducts) {
    const productStrings = allProducts
        .filter(p => p.imagePath) // only products with images
        .map(p => {
            const cleanDesc = stripColors(p.description);
            let str = '    {\n';
            str += `        id: "${escapeString(p.id)}",\n`;
            str += `        name: "${escapeString(p.id)}",\n`;
            str += `        category: "${p.category}" as Category,\n`;
            str += `        gender: "${p.gender}" as Gender,\n`;
            if (p.subcategory) {
                str += `        subcategory: "${p.subcategory}",\n`;
            }
            if (p.price != null) {
                str += `        price: ${p.price},\n`;
            }
            if (cleanDesc) {
                str += `        description: "${escapeString(cleanDesc)}",\n`;
            }
            str += `        variants: [\n`;
            str += `            { variantId: "${escapeString(p.id)}", image: "${p.imagePath}"`;
            if (cleanDesc) {
                str += `, description: "${escapeString(cleanDesc)}"`;
            }
            if (p.price != null) {
                str += `, price: ${p.price}`;
            }
            str += ` },\n`;
            str += `        ],\n`;
            str += '    }';
            return str;
        }).join(',\n');

    const output = `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// Generated by scripts/import-new-products.js
// Run: npm run generate-products

import { Category, Gender, Size } from "./filter-config";

export interface ProductVariant {
    variantId: string;
    image: string;
    description?: string;
    price?: number;
}

export interface Product {
    id: string;
    name: string;
    category: Category;
    gender: Gender;
    subcategory?: string;
    price?: number;
    description?: string;
    variants: ProductVariant[];
    availableSizes?: Size[];
}

export const PRODUCTS: Product[] = [
${productStrings}
];

// Helper: get all images for a product
export function getProductImages(product: Product): string[] {
    return product.variants.map(v => v.image);
}

// Filter products by criteria
export function filterProducts(
    products: Product[],
    categories?: Category[],
    genders?: Gender[],
    sizes?: Size[],
    subcategoryId?: string | null,
): Product[] {
    return products.filter((product) => {
        if (categories && categories.length > 0) {
            const hasAll = categories.includes("ALL");
            if (!hasAll && !categories.includes(product.category)) {
                return false;
            }
        }

        if (genders && genders.length > 0 && product.gender) {
            if (!genders.includes(product.gender)) return false;
        }

        if (sizes && sizes.length > 0 && product.availableSizes) {
            const hasOverlap = sizes.some(s => product.availableSizes?.includes(s));
            if (!hasOverlap) return false;
        }

        // Subcategory filter (for Leather: Wallets vs Belts, etc.)
        if (subcategoryId && product.subcategory) {
            if (product.subcategory !== subcategoryId) return false;
        }

        return true;
    });
}

// Flatten products: each variant becomes a standalone product entry
export function flattenProducts(products: Product[]): Product[] {
    const result: Product[] = [];
    for (const product of products) {
        for (const variant of product.variants) {
            result.push({
                ...product,
                id: variant.variantId,
                name: variant.variantId,
                price: variant.price ?? product.price,
                variants: [variant],
            });
        }
    }
    return result;
}
`;

    fs.writeFileSync(TS_OUTPUT_PATH, output, 'utf-8');
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
    console.log('🚀 Importing new products...\n');

    // Clean output directories
    if (fs.existsSync(PUBLIC_PRODUCTS_DIR)) {
        fs.rmSync(PUBLIC_PRODUCTS_DIR, { recursive: true });
    }
    fs.mkdirSync(PUBLIC_PRODUCTS_DIR, { recursive: true });

    // Clean CSV output (but don't delete the directory if it has other stuff)
    const existingCsvs = fs.existsSync(CSV_OUTPUT_DIR)
        ? fs.readdirSync(CSV_OUTPUT_DIR).filter(f => f.endsWith('.csv'))
        : [];
    for (const csv of existingCsvs) {
        fs.unlinkSync(path.join(CSV_OUTPUT_DIR, csv));
    }
    if (!fs.existsSync(CSV_OUTPUT_DIR)) {
        fs.mkdirSync(CSV_OUTPUT_DIR, { recursive: true });
    }

    const allProducts = [];
    const missingImages = [];
    const skuSources = new Map(); // track imageSku → [folderPaths] for collision detection

    for (const [folderPath, config] of Object.entries(FOLDER_MAP)) {
        const fullPath = path.join(NEW_PRODUCTS_DIR, ...folderPath.split('/'));
        if (!fs.existsSync(fullPath)) {
            console.log(`⚠️  Folder not found: ${folderPath}`);
            continue;
        }

        // Find Excel file
        const excelFile = fs.readdirSync(fullPath).find(f =>
            f.endsWith('.xlsx') && !f.startsWith('~$')
        );
        if (!excelFile) {
            console.log(`⚠️  No Excel file in: ${folderPath}`);
            continue;
        }

        console.log(`📁 ${folderPath} → ${config.category}/${config.gender}`);

        // Parse Excel
        const products = parseExcelFile(path.join(fullPath, excelFile), config);
        console.log(`   📋 ${products.length} products from ${excelFile}`);

        // Track SKU sources for collision detection
        for (const product of products) {
            if (!skuSources.has(product.imageSku)) {
                skuSources.set(product.imageSku, []);
            }
            skuSources.get(product.imageSku).push({ folderPath, config, product });
        }

        allProducts.push(...products.map(p => ({ ...p, _folderPath: folderPath, _fullPath: fullPath })));
    }

    // Detect and resolve SKU collisions by prefixing product IDs
    const collisions = [...skuSources.entries()].filter(([, sources]) => sources.length > 1);
    if (collisions.length > 0) {
        console.log(`\n⚠️  ${collisions.length} SKU collisions detected — resolving with prefixes...`);
        const CATEGORY_PREFIX = {
            WATCHES: 'W', SUNGLASSES: 'SG', LEATHER: 'LT', LINGERIE: 'LG', GIFT_SET: 'GS',
        };
        for (const [sku] of collisions) {
            const dupes = allProducts.filter(p => p.imageSku === sku);
            for (const p of dupes) {
                const prefix = CATEGORY_PREFIX[p.category] || p.category.substring(0, 2);
                p.id = `${prefix}-${p.imageSku}`;
            }
        }
        console.log(`   Resolved ${collisions.length} collisions (e.g., HOB501 → W-HOB501 & SG-HOB501)`);
    }

    // Copy images (after collision resolution so IDs are unique)
    for (const product of allProducts) {
        const imgPath = findProductImage(product._fullPath, product.imageSku);
        if (imgPath) {
            product.imagePath = copyProductImage(imgPath, product.id);
        } else {
            missingImages.push(`${product._folderPath}/${product.imageSku}`);
        }
    }
    const imageCount = allProducts.filter(p => p.imagePath).length;
    console.log(`\n🖼️  ${imageCount}/${allProducts.length} images copied`);

    // Clean up internal fields
    for (const p of allProducts) {
        delete p._folderPath;
        delete p._fullPath;
    }

    // Generate CSVs grouped by csvGroup
    const byGroup = {};
    for (const p of allProducts) {
        const key = FOLDER_MAP[Object.keys(FOLDER_MAP).find(k =>
            FOLDER_MAP[k].category === p.category &&
            FOLDER_MAP[k].gender === p.gender &&
            FOLDER_MAP[k].subcategory === p.subcategory
        )]?.csvGroup || p.category;
        if (!byGroup[key]) byGroup[key] = [];
        byGroup[key].push(p);
    }

    console.log('\n📝 Generating CSVs...');
    for (const [group, products] of Object.entries(byGroup)) {
        const filename = `products_${group}.csv`;
        generateCSV(products, filename);
        console.log(`   ✅ ${filename} (${products.length} products)`);
    }

    // Generate TypeScript
    console.log('\n⚙️  Generating products.ts...');
    const productsWithImages = allProducts.filter(p => p.imagePath);
    generateTypeScript(allProducts);
    console.log(`   ✅ ${productsWithImages.length} products with images`);

    // Summary
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`✨ Done! ${allProducts.length} total products imported.`);
    console.log(`   ${productsWithImages.length} with images → public/products/`);
    console.log(`   ${Object.keys(byGroup).length} CSV files → products-csv/`);
    console.log(`   1 TypeScript file → src/lib/products.ts`);

    if (missingImages.length > 0) {
        console.log(`\n⚠️  ${missingImages.length} products missing images:`);
        for (const m of missingImages.slice(0, 10)) {
            console.log(`   - ${m}`);
        }
        if (missingImages.length > 10) {
            console.log(`   ... and ${missingImages.length - 10} more`);
        }
    }

    console.log('');
}

main();
