/**
 * Product Generation Script v2
 * 
 * Reads multiple CSV files from products-csv/ folder
 * Maps products to images in products-assets/ folder
 * Copies images to public/products/ and generates products.ts
 * 
 * Usage: node scripts/generate-products.js
 * Or: npm run generate-products
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CSV_DIR = path.join(__dirname, '..', 'products-csv');
const ASSETS_DIR = path.join(__dirname, '..', 'products-assets');
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'products');
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'lib', 'products.ts');

// Mapping from CSV file name to asset folder name
const CSV_TO_ASSET_MAP = {
    'products_Babydoll.csv': 'Babydoll',
    'products_Belt.csv': 'Belt',
    'products_Kids Watch.csv': 'Kids Watch',
    'products_Men Watches.csv': 'men-watch',
    'products_Sunglasses.csv': 'Sunglass',
    'products_Wallet.csv': 'Wallet',
    'products_Women Watch.csv': 'Women Watch',
};

// Valid values
const VALID_CATEGORIES = ['WATCHES', 'SUNGLASSES', 'WALLETS', 'BELTS', 'BLAZERS', 'LINGERIE', 'GIFT_SETS'];
const VALID_GENDERS = ['MEN', 'WOMEN', 'UNISEX', 'KIDS'];

// Parse CSV - handle BOM and various line endings
function parseCsv(content) {
    // Strip BOM (Byte Order Mark) that Excel adds
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.substring(1);
    }
    // Also handle UTF-8 BOM bytes
    content = content.replace(/^\uFEFF/, '');

    const lines = content.trim().split('\n').map(l => l.replace(/\r/g, ''));
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    return lines.slice(1).map(line => {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (const char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        const row = {};
        headers.forEach((header, i) => {
            row[header] = values[i] || '';
        });

        return row;
    }).filter(row => row.id && row.id.trim() !== ''); // Filter out empty rows
}

// Find images for a product in the asset folder
function findProductImages(assetFolder, productId) {
    const productPath = path.join(ASSETS_DIR, assetFolder, productId);

    if (!fs.existsSync(productPath)) {
        return [];
    }

    const stat = fs.statSync(productPath);
    if (!stat.isDirectory()) {
        return [];
    }

    return fs.readdirSync(productPath)
        .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
        .sort()
        .map(f => path.join(productPath, f));
}

// Copy images to public folder and return web paths
function copyImagesToPublic(productId, imagePaths) {
    const destDir = path.join(PUBLIC_DIR, productId);

    // Create destination directory
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const webPaths = [];

    for (const srcPath of imagePaths) {
        const filename = path.basename(srcPath);
        const destPath = path.join(destDir, filename);

        // Copy file
        fs.copyFileSync(srcPath, destPath);

        // Return web path
        webPaths.push(`/products/${productId}/${filename}`);
    }

    return webPaths;
}

// Extract product name from ID (fallback)
function generateProductName(id, category) {
    // Remove prefix and format nicely
    const name = id.replace(/-/g, ' ').toUpperCase();
    return name;
}

// Main
function generateProducts() {
    console.log('📖 Starting product generation...\n');

    // Ensure public products directory exists
    if (!fs.existsSync(PUBLIC_DIR)) {
        fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    // Read all CSV files
    const csvFiles = fs.readdirSync(CSV_DIR).filter(f => f.endsWith('.csv'));
    console.log(`📁 Found ${csvFiles.length} CSV files\n`);

    const products = [];
    const errors = [];
    let totalImages = 0;

    for (const csvFile of csvFiles) {
        const assetFolder = CSV_TO_ASSET_MAP[csvFile];

        if (!assetFolder) {
            errors.push(`⚠️ No asset folder mapping for ${csvFile}`);
            continue;
        }

        console.log(`📄 Processing ${csvFile} → ${assetFolder}/`);

        const csvPath = path.join(CSV_DIR, csvFile);
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const rows = parseCsv(csvContent);

        for (const row of rows) {
            const id = row.id.trim();
            if (!id) continue;

            // Find images
            const imagePaths = findProductImages(assetFolder, id);

            if (imagePaths.length === 0) {
                errors.push(`⚠️ ${id}: No images found in ${assetFolder}/${id}/`);
                continue; // Skip products without images
            }

            // Copy images to public
            const webPaths = copyImagesToPublic(id, imagePaths);
            totalImages += webPaths.length;

            // Build product
            const category = row.category?.toUpperCase() || 'WATCHES';
            const product = {
                id: id,
                name: generateProductName(id, category),
                images: webPaths,
                category: VALID_CATEGORIES.includes(category) ? category : 'WATCHES',
            };

            // Add gender if valid
            if (row.gender) {
                const gender = row.gender.toUpperCase();
                if (VALID_GENDERS.includes(gender)) {
                    product.gender = gender;
                }
            }

            // Add price if present
            if (row.price && !isNaN(parseFloat(row.price))) {
                product.price = parseFloat(row.price);
            }

            // Add description if present
            if (row.desc && row.desc.trim()) {
                product.description = row.desc.trim();
            }

            products.push(product);
            console.log(`   ✅ ${id}: ${webPaths.length} image(s)`);
        }

        console.log('');
    }

    // Print errors
    if (errors.length > 0) {
        console.log('⚠️ Warnings:');
        errors.forEach(e => console.log('  ' + e));
        console.log('');
    }

    // Generate output TypeScript file
    const productStrings = products.map(p => {
        let str = '    {\n';
        str += `        id: "${p.id}",\n`;
        str += `        name: "${p.name}",\n`;
        str += `        images: ${JSON.stringify(p.images)},\n`;
        str += `        category: "${p.category}" as Category,\n`;
        if (p.gender) {
            str += `        gender: "${p.gender}" as Gender,\n`;
        }
        if (p.price !== undefined) {
            str += `        price: ${p.price},\n`;
        }
        if (p.description) {
            // Escape quotes in description
            const escapedDesc = p.description.replace(/"/g, '\\"');
            str += `        description: "${escapedDesc}",\n`;
        }
        str += '    }';
        return str;
    }).join(',\n');

    const output = `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// Generated from products-csv/ by scripts/generate-products.js
// Run: npm run generate-products

import { Category, Gender, Size } from "./filter-config";

export interface Product {
    id: string;
    name: string;
    images: string[];
    category: Category;
    gender?: Gender;
    availableSizes?: Size[];
    price?: number;
    description?: string;
}

export const PRODUCTS: Product[] = [
${productStrings}
];

// Filter products by criteria
export function filterProducts(
    products: Product[],
    categories?: Category[],
    genders?: Gender[],
    sizes?: Size[]
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

        return true;
    });
}
`;

    fs.writeFileSync(OUTPUT_PATH, output);
    console.log(`✨ Generated ${OUTPUT_PATH}`);
    console.log(`   ${products.length} products, ${totalImages} images copied to public/products/`);
}

generateProducts();
