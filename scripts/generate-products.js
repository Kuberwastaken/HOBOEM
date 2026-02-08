/**
 * Product Generation Script v5
 * 
 * Each folder in products-assets = ONE product
 * Each image in that folder = a variant of that product
 * 
 * CSV provides metadata (price, description) keyed by imageSku (folder name)
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

// Asset folder configuration
// Each entry scans for product folders and assigns category/gender
const ASSET_CONFIG = [
    // Sunglasses
    { basePath: 'Sunglasses', category: 'SUNGLASSES', gender: 'UNISEX' },
    
    // Men's Watches - nested by brand
    { basePath: 'Men Watches Images/M&H Watches', category: 'WATCHES', gender: 'MEN' },
    { basePath: 'Men Watches Images/Roadster Watches', category: 'WATCHES', gender: 'MEN' },
    { basePath: 'Men Watches Images/Wrogn Watch Image', category: 'WATCHES', gender: 'MEN' },
    
    // Women's Watches - nested by brand
    { basePath: 'Women Watch Images/Dressberry Luxe Women Watches', category: 'WATCHES', gender: 'WOMEN' },
    { basePath: 'Women Watch Images/Dressberry Single Watch', category: 'WATCHES', gender: 'WOMEN' },
    { basePath: 'Women Watch Images/Killer Watches', category: 'WATCHES', gender: 'WOMEN' },
    { basePath: 'Women Watch Images/Lavie Women Watches', category: 'WATCHES', gender: 'WOMEN' },
    { basePath: 'Women Watch Images/M&H Watches', category: 'WATCHES', gender: 'WOMEN' },
    { basePath: 'Women Watch Images/Provogue Watches', category: 'WATCHES', gender: 'WOMEN' },
    
    // Kids Watches
    { basePath: 'Kids Watches', category: 'WATCHES', gender: 'KIDS' },
];

// CSV files for metadata lookup (keyed by imageSku)
const CSV_FILES = [
    'products_Sunglasses.csv',
    'products_Men Watches.csv',
    'products_Women Watch.csv',
    'products_Kids Watch.csv',
];

// Parse all CSVs and build a metadata lookup by imageSku
function loadMetadata() {
    const metadata = new Map();
    
    for (const csvFile of CSV_FILES) {
        const csvPath = path.join(CSV_DIR, csvFile);
        if (!fs.existsSync(csvPath)) continue;
        
        const content = fs.readFileSync(csvPath, 'utf-8');
        const lines = content.split('\n').filter(l => l.trim());
        if (lines.length < 2) continue;
        
        const headers = parseCSVLine(lines[0]);
        const imageSkuIdx = headers.indexOf('imageSku');
        const priceIdx = headers.indexOf('price');
        const descIdx = headers.indexOf('desc');
        
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const imageSku = imageSkuIdx >= 0 ? values[imageSkuIdx] : values[0];
            
            if (imageSku && !metadata.has(imageSku)) {
                metadata.set(imageSku, {
                    price: priceIdx >= 0 ? parseFloat(values[priceIdx]) || undefined : undefined,
                    description: descIdx >= 0 ? values[descIdx] : undefined,
                });
            }
        }
    }
    
    return metadata;
}

// Parse CSV line handling quotes
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
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
    return values;
}

// Find all product folders in a path
function findProductFolders(basePath) {
    const fullPath = path.join(ASSETS_DIR, basePath);
    if (!fs.existsSync(fullPath)) return [];
    
    return fs.readdirSync(fullPath)
        .filter(name => {
            const itemPath = path.join(fullPath, name);
            return fs.statSync(itemPath).isDirectory();
        })
        .map(name => ({
            id: name,
            path: path.join(fullPath, name)
        }));
}

// Find all images (variants) in a product folder
function findVariantImages(productPath) {
    if (!fs.existsSync(productPath)) return [];
    
    return fs.readdirSync(productPath)
        .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
        .sort()
        .map(f => ({
            filename: f,
            variantId: path.parse(f).name,  // filename without extension = variant ID
            fullPath: path.join(productPath, f)
        }));
}

// Copy images to public and return web paths
function copyImagesToPublic(productId, variants) {
    const cleanId = productId.replace(/[^a-zA-Z0-9-_]/g, '-');
    const destDir = path.join(PUBLIC_DIR, cleanId);
    
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    return variants.map(v => {
        const destPath = path.join(destDir, v.filename);
        fs.copyFileSync(v.fullPath, destPath);
        return {
            variantId: v.variantId,
            image: `/products/${cleanId}/${v.filename}`
        };
    });
}

// Generate display name from ID
function generateProductName(id) {
    return id
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toUpperCase()
        .trim();
}

// Main
function generateProducts() {
    console.log('📖 Starting product generation v5 (folder = product, images = variants)...\n');
    
    // Clear public products directory
    if (fs.existsSync(PUBLIC_DIR)) {
        fs.rmSync(PUBLIC_DIR, { recursive: true });
    }
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    
    // Load metadata from CSVs
    const metadata = loadMetadata();
    console.log(`📋 Loaded metadata for ${metadata.size} product IDs\n`);
    
    const allProducts = [];
    let totalVariants = 0;
    
    for (const config of ASSET_CONFIG) {
        console.log(`📁 Scanning: ${config.basePath}`);
        
        const productFolders = findProductFolders(config.basePath);
        
        if (productFolders.length === 0) {
            console.log(`   ⚠️ No product folders found\n`);
            continue;
        }
        
        for (const { id, path: productPath } of productFolders) {
            const variants = findVariantImages(productPath);
            
            if (variants.length === 0) {
                console.log(`   ⚠️ ${id}: No images found`);
                continue;
            }
            
            const variantData = copyImagesToPublic(id, variants);
            totalVariants += variantData.length;
            
            // Get metadata if available
            const meta = metadata.get(id) || {};
            
            const product = {
                id,
                name: generateProductName(id),
                category: config.category,
                gender: config.gender,
                price: meta.price,
                description: meta.description,
                variants: variantData,
            };
            
            allProducts.push(product);
            console.log(`   ✅ ${id}: ${variantData.length} variant(s)`);
        }
        
        console.log('');
    }
    
    // Generate TypeScript output
    const productStrings = allProducts.map(p => {
        let str = '    {\n';
        str += `        id: "${p.id}",\n`;
        str += `        name: "${p.name}",\n`;
        str += `        category: "${p.category}" as Category,\n`;
        str += `        gender: "${p.gender}" as Gender,\n`;
        if (p.price !== undefined) {
            str += `        price: ${p.price},\n`;
        }
        if (p.description) {
            str += `        description: ${JSON.stringify(p.description)},\n`;
        }
        str += `        variants: [\n`;
        for (const v of p.variants) {
            str += `            { variantId: "${v.variantId}", image: "${v.image}" },\n`;
        }
        str += `        ],\n`;
        str += '    }';
        return str;
    }).join(',\n');
    
    const output = `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// Generated by scripts/generate-products.js
// Run: npm run generate-products

import { Category, Gender, Size } from "./filter-config";

export interface ProductVariant {
    variantId: string;
    image: string;
}

export interface Product {
    id: string;
    name: string;
    category: Category;
    gender: Gender;
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
    console.log(`   ${allProducts.length} products, ${totalVariants} total variants`);
}

generateProducts();
