/**
 * Product Generation Script v3
 * 
 * Reads product folders from products-assets/ with support for nested brand folders
 * Copies images to public/products/ and generates products.ts
 * 
 * Usage: node scripts/generate-products.js
 * Or: npm run generate-products
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ASSETS_DIR = path.join(__dirname, '..', 'products-assets');
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'products');
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'lib', 'products.ts');

// Asset folder configuration
// Each entry: { folder: 'path', category: 'CATEGORY', gender: 'GENDER' (optional) }
const ASSET_CONFIG = [
    // Sunglasses - flat structure
    { folder: 'Sunglasses', category: 'SUNGLASSES', gender: 'UNISEX' },

    // Men's Watches - nested by brand
    { folder: 'Men Watches Images/M&H Watches', category: 'WATCHES', gender: 'MEN' },
    { folder: 'Men Watches Images/Roadster Watches', category: 'WATCHES', gender: 'MEN' },
    { folder: 'Men Watches Images/Wrogn Watch Image', category: 'WATCHES', gender: 'MEN' },

    // Women's Watches - nested by brand
    { folder: 'Women Watch Images/Dressberry Luxe Women Watches', category: 'WATCHES', gender: 'WOMEN' },
    { folder: 'Women Watch Images/Dressberry Single Watch', category: 'WATCHES', gender: 'WOMEN' },
    { folder: 'Women Watch Images/Killer Watches', category: 'WATCHES', gender: 'WOMEN' },
    { folder: 'Women Watch Images/Lavie Women Watches', category: 'WATCHES', gender: 'WOMEN' },
    { folder: 'Women Watch Images/M&H Watches', category: 'WATCHES', gender: 'WOMEN' },
    { folder: 'Women Watch Images/Provogue Watches', category: 'WATCHES', gender: 'WOMEN' },

    // Kids Watches
    { folder: 'Kids Watches/Kids Watches', category: 'WATCHES', gender: 'KIDS' },
];

// Valid values
const VALID_CATEGORIES = ['WATCHES', 'SUNGLASSES'];
const VALID_GENDERS = ['MEN', 'WOMEN', 'UNISEX', 'KIDS'];

// Find all product folders in a directory (non-recursive, just immediate children)
function findProductFolders(basePath) {
    if (!fs.existsSync(basePath)) {
        console.log(`   ⚠️ Path not found: ${basePath}`);
        return [];
    }

    return fs.readdirSync(basePath)
        .filter(name => {
            const fullPath = path.join(basePath, name);
            return fs.statSync(fullPath).isDirectory();
        })
        .map(name => ({
            id: name,
            path: path.join(basePath, name)
        }));
}

// Find images in a product folder
function findProductImages(productPath) {
    if (!fs.existsSync(productPath)) return [];

    return fs.readdirSync(productPath)
        .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
        .sort()
        .map(f => path.join(productPath, f));
}

// Copy images to public folder and return web paths
function copyImagesToPublic(productId, imagePaths) {
    // Clean product ID for filesystem (replace special chars)
    const cleanId = productId.replace(/[^a-zA-Z0-9-_]/g, '-');
    const destDir = path.join(PUBLIC_DIR, cleanId);

    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const webPaths = [];

    for (const srcPath of imagePaths) {
        const filename = path.basename(srcPath);
        const destPath = path.join(destDir, filename);

        fs.copyFileSync(srcPath, destPath);
        webPaths.push(`/products/${cleanId}/${filename}`);
    }

    return webPaths;
}

// Generate a display name from product ID
function generateProductName(id) {
    // Clean up the ID to create a readable name
    return id
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toUpperCase()
        .trim();
}

// Main
function generateProducts() {
    console.log('📖 Starting product generation v3...\n');

    // Clear and recreate public products directory
    if (fs.existsSync(PUBLIC_DIR)) {
        fs.rmSync(PUBLIC_DIR, { recursive: true });
    }
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });

    const products = [];
    let totalImages = 0;

    for (const config of ASSET_CONFIG) {
        const basePath = path.join(ASSETS_DIR, config.folder);
        console.log(`📁 Processing: ${config.folder}`);

        const productFolders = findProductFolders(basePath);

        if (productFolders.length === 0) {
            console.log(`   ⚠️ No product folders found\n`);
            continue;
        }

        for (const { id, path: productPath } of productFolders) {
            const imagePaths = findProductImages(productPath);

            if (imagePaths.length === 0) {
                console.log(`   ⚠️ ${id}: No images found`);
                continue;
            }

            const webPaths = copyImagesToPublic(id, imagePaths);
            totalImages += webPaths.length;

            const product = {
                id: id,
                name: generateProductName(id),
                images: webPaths,
                category: config.category,
            };

            if (config.gender && VALID_GENDERS.includes(config.gender)) {
                product.gender = config.gender;
            }

            products.push(product);
            console.log(`   ✅ ${id}: ${webPaths.length} image(s)`);
        }

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
        str += '    }';
        return str;
    }).join(',\n');

    const output = `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// Generated by scripts/generate-products.js
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
