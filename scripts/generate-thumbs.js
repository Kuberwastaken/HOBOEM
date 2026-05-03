/**
 * Generates compressed thumbnails for all product images.
 * Output: {original-name}-thumb.jpg at 600px wide, quality 75.
 * Run: node scripts/generate-thumbs.js
 * Runs automatically in CI before `next build`.
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PRODUCTS_DIR = path.join(__dirname, "..", "public", "products");
const THUMB_WIDTH = 600;
const THUMB_QUALITY = 75;
const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function generateThumbs() {
    if (!fs.existsSync(PRODUCTS_DIR)) {
        console.error("public/products/ not found");
        process.exit(1);
    }

    const dirs = fs.readdirSync(PRODUCTS_DIR).filter((d) => {
        return fs.statSync(path.join(PRODUCTS_DIR, d)).isDirectory();
    });

    let generated = 0;
    let skipped = 0;
    let errors = 0;

    for (const dir of dirs) {
        const dirPath = path.join(PRODUCTS_DIR, dir);
        const files = fs.readdirSync(dirPath).filter((f) => {
            const ext = path.extname(f).toLowerCase();
            return SUPPORTED.has(ext) && !f.includes("-thumb");
        });

        for (const file of files) {
            const ext = path.extname(file);
            const base = path.basename(file, ext);
            const srcPath = path.join(dirPath, file);
            const thumbPath = path.join(dirPath, `${base}-thumb${ext}`);

            if (fs.existsSync(thumbPath)) {
                skipped++;
                continue;
            }

            try {
                await sharp(srcPath)
                    .resize(THUMB_WIDTH, null, { withoutEnlargement: true })
                    .jpeg({ quality: THUMB_QUALITY, progressive: true })
                    .toFile(thumbPath);
                generated++;
            } catch (err) {
                console.error(`  ✗ ${file}: ${err.message}`);
                errors++;
            }
        }
    }

    console.log(`Thumbnails: ${generated} generated, ${skipped} skipped, ${errors} errors`);
    if (errors > 0) process.exit(1);
}

generateThumbs();
