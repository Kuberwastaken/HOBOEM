/**
 * Product Generation Script
 * 
 * Reads products.csv and scans sample-images folder to generate products.ts
 * 
 * Usage: npx ts-node scripts/generate-products.ts
 * Or: npm run generate-products
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const CSV_PATH = path.join(__dirname, '..', 'products.csv');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'sample-images');
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'lib', 'products.ts');

// Valid categories (must match filter-config.ts)
const VALID_CATEGORIES = ['WATCHES', 'SUNGLASSES', 'WALLETS', 'BELTS', 'BLAZERS', 'LINGERIE', 'GIFT_SETS'] as const;
const VALID_GENDERS = ['MEN', 'WOMEN', 'UNISEX', 'KIDS'] as const;
const VALID_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREESIZE'] as const;

// Category filter rules (which fields are applicable)
const CATEGORY_RULES: Record<string, { hasGender: boolean; hasSize: boolean }> = {
    WATCHES: { hasGender: true, hasSize: false },
    SUNGLASSES: { hasGender: true, hasSize: false },
    WALLETS: { hasGender: false, hasSize: false },
    BELTS: { hasGender: true, hasSize: false },  // User said no sizes for belts
    BLAZERS: { hasGender: true, hasSize: true },
    LINGERIE: { hasGender: false, hasSize: true },  // User said no gender for lingerie
    GIFT_SETS: { hasGender: false, hasSize: false },
};

interface CsvRow {
    id: string;
    name: string;
    category: string;
    gender: string;
    sizes: string;
}

interface Product {
    id: string;
    name: string;
    images: string[];
    category: string;
    gender?: string;
    availableSizes?: string[];
}

// Parse CSV
function parseCsv(content: string): CsvRow[] {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    return lines.slice(1).map(line => {
        // Handle quoted values with commas
        const values: string[] = [];
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

        const row: Record<string, string> = {};
        headers.forEach((header, i) => {
            row[header] = values[i] || '';
        });

        return row as unknown as CsvRow;
    });
}

// Find images for a product ID
function findImages(productId: string): string[] {
    const images: string[] = [];

    // Recursive search through sample-images
    function searchDir(dir: string): void {
        if (!fs.existsSync(dir)) return;

        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                // Check if this folder matches the product ID
                if (entry.name.toUpperCase() === productId.toUpperCase()) {
                    // Found the product folder - get all images inside
                    const folderImages = fs.readdirSync(fullPath)
                        .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
                        .map(f => {
                            const relativePath = path.relative(
                                path.join(__dirname, '..', 'public'),
                                path.join(fullPath, f)
                            ).replace(/\\/g, '/');
                            return '/' + relativePath;
                        });
                    images.push(...folderImages);
                } else {
                    // Keep searching in subdirectories
                    searchDir(fullPath);
                }
            } else if (entry.isFile()) {
                // Check if this file matches the product ID (for single-image products)
                const fileName = path.parse(entry.name).name;
                if (fileName.toUpperCase().startsWith(productId.toUpperCase())) {
                    const relativePath = path.relative(
                        path.join(__dirname, '..', 'public'),
                        fullPath
                    ).replace(/\\/g, '/');
                    images.push('/' + relativePath);
                }
            }
        }
    }

    searchDir(IMAGES_DIR);
    return images;
}

// Validate and generate products
function generateProducts(): void {
    console.log('📖 Reading CSV...');

    if (!fs.existsSync(CSV_PATH)) {
        console.error('❌ products.csv not found at', CSV_PATH);
        process.exit(1);
    }

    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const rows = parseCsv(csvContent);

    console.log(`📦 Found ${rows.length} products in CSV`);

    const products: Product[] = [];
    const errors: string[] = [];

    for (const row of rows) {
        // Skip empty rows
        if (!row.id || !row.name || !row.category) {
            continue;
        }

        // Validate category
        const category = row.category.toUpperCase();
        if (!VALID_CATEGORIES.includes(category as any)) {
            errors.push(`❌ ${row.id}: Invalid category "${row.category}"`);
            continue;
        }

        // Find images
        const images = findImages(row.id);
        if (images.length === 0) {
            errors.push(`⚠️ ${row.id}: No images found in sample-images folder`);
            // Still add product but with placeholder
            images.push('/placeholder.png');
        }

        // Build product
        const product: Product = {
            id: row.id,
            name: row.name,
            images: images,
            category: category,
        };

        // Add gender if applicable and provided
        const rules = CATEGORY_RULES[category];
        if (rules?.hasGender && row.gender) {
            const gender = row.gender.toUpperCase();
            if (VALID_GENDERS.includes(gender as any)) {
                product.gender = gender;
            } else {
                errors.push(`⚠️ ${row.id}: Invalid gender "${row.gender}"`);
            }
        }

        // Add sizes if applicable and provided
        if (rules?.hasSize && row.sizes) {
            const sizes = row.sizes.split('|').map(s => s.trim().toUpperCase()).filter(Boolean);
            const validSizes = sizes.filter(s => VALID_SIZES.includes(s as any));
            if (validSizes.length > 0) {
                product.availableSizes = validSizes;
            }
            if (validSizes.length !== sizes.length) {
                errors.push(`⚠️ ${row.id}: Some invalid sizes in "${row.sizes}"`);
            }
        }

        products.push(product);
        console.log(`✅ ${row.id}: ${images.length} image(s)`);
    }

    // Print errors
    if (errors.length > 0) {
        console.log('\n⚠️ Warnings/Errors:');
        errors.forEach(e => console.log('  ' + e));
    }

    // Generate TypeScript file
    const output = `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// Generated from products.csv by scripts/generate-products.ts
// Run: npm run generate-products

import { Category, Gender, Size } from "./filter-config";

export interface Product {
    id: string;
    name: string;
    images: string[];
    category: Category;
    gender?: Gender;
    availableSizes?: Size[];
}

export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 4)
            .replace(/"category": "(\w+)"/g, '"category": "$1" as Category')
            .replace(/"gender": "(\w+)"/g, '"gender": "$1" as Gender')
            .replace(/"availableSizes": \[([^\]]+)\]/g, (match, sizes) => {
                const formatted = sizes.replace(/"(\w+)"/g, '"$1" as Size');
                return `"availableSizes": [${formatted}]`;
            })};

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
    console.log(`\n✨ Generated ${OUTPUT_PATH}`);
    console.log(`   ${products.length} products with ${products.reduce((acc, p) => acc + p.images.length, 0)} total images`);
}

// Run
generateProducts();
