import { Category, Gender, Size } from "./filter-config";

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: Category;
    gender?: Gender;
    availableSizes?: Size[];
}

// Helper to generate product with random assignment for demo
function generateProduct(
    id: string,
    name: string,
    price: number,
    image: string,
    category: Category,
    gender?: Gender,
    availableSizes?: Size[]
): Product {
    return { id, name, price, image, category, gender, availableSizes };
}

// Sample HOBOEM Products
export const PRODUCTS: Product[] = [
    // WATCHES - has gender, no sizes
    generateProduct("WT-001", "CHRONOGRAPH WT-01", 450, "/assets/extracted/images/img_1_PK-01_1.webp", "WATCHES", "MEN"),
    generateProduct("WT-002", "CLASSIC WT-02", 380, "/assets/extracted/images/img_3_JC-10_3.webp", "WATCHES", "MEN"),
    generateProduct("WT-003", "ELEGANT WT-03", 520, "/assets/extracted/images/img_5_JC-11_5.webp", "WATCHES", "WOMEN"),
    generateProduct("WT-004", "SPORTS WT-04", 290, "/assets/extracted/images/img_7_SL-03_7.webp", "WATCHES", "UNISEX"),
    generateProduct("WT-005", "SMART WT-05", 650, "/assets/extracted/images/img_11_SG-03_11.webp", "WATCHES", "UNISEX"),
    generateProduct("WT-006", "KIDS WT-06", 120, "/assets/extracted/images/img_13_BP-02_13.webp", "WATCHES", "KIDS"),
    generateProduct("WT-007", "DIVER WT-07", 780, "/assets/extracted/images/img_15_PK-01_15.webp", "WATCHES", "MEN"),
    generateProduct("WT-008", "MINIMALIST WT-08", 340, "/assets/extracted/images/img_17_WD-02_17.webp", "WATCHES", "WOMEN"),

    // SUNGLASSES - has gender, no sizes
    generateProduct("SG-001", "AVIATOR SG-01", 180, "/assets/extracted/images/img_19_SL-01_19.webp", "SUNGLASSES", "MEN"),
    generateProduct("SG-002", "WAYFARER SG-02", 220, "/assets/extracted/images/img_21_CT-01_21.webp", "SUNGLASSES", "UNISEX"),
    generateProduct("SG-003", "CAT EYE SG-03", 195, "/assets/extracted/images/img_23_BG-03_23.webp", "SUNGLASSES", "WOMEN"),
    generateProduct("SG-004", "ROUND SG-04", 160, "/assets/extracted/images/img_25_TS-07_25.webp", "SUNGLASSES", "UNISEX"),
    generateProduct("SG-005", "SPORTS SG-05", 280, "/assets/extracted/images/img_27_LS-03_27.webp", "SUNGLASSES", "MEN"),
    generateProduct("SG-006", "VINTAGE SG-06", 240, "/assets/extracted/images/img_29_SL-01_29.webp", "SUNGLASSES", "WOMEN"),
    generateProduct("SG-007", "KIDS SG-07", 85, "/assets/extracted/images/img_31_RC-04_31.webp", "SUNGLASSES", "KIDS"),
    generateProduct("SG-008", "OVERSIZED SG-08", 310, "/assets/extracted/images/img_33_WP-02_33.webp", "SUNGLASSES", "WOMEN"),

    // WALLETS - no gender, no sizes
    generateProduct("WL-001", "BIFOLD WL-01", 95, "/assets/extracted/images/img_35_JC-07_35.webp", "WALLETS"),
    generateProduct("WL-002", "CARDHOLDER WL-02", 65, "/assets/extracted/images/img_37_JC-09_37.webp", "WALLETS"),
    generateProduct("WL-003", "TRIFOLD WL-03", 120, "/assets/extracted/images/img_39_BB-02_39.webp", "WALLETS"),
    generateProduct("WL-004", "SLIM WL-04", 80, "/assets/extracted/images/img_41_RC-03_41.webp", "WALLETS"),
    generateProduct("WL-005", "ZIPPER WL-05", 140, "/assets/extracted/images/img_43_WD-01_43.webp", "WALLETS"),
    generateProduct("WL-006", "TRAVEL WL-06", 175, "/assets/extracted/images/img_45_WP-01_45.webp", "WALLETS"),
    generateProduct("WL-007", "MONEY CLIP WL-07", 55, "/assets/extracted/images/img_47_WB-04_47.webp", "WALLETS"),
    generateProduct("WL-008", "CHAIN WL-08", 110, "/assets/extracted/images/img_49_BB-01_49.webp", "WALLETS"),

    // BELTS - has gender, has sizes
    generateProduct("BT-001", "LEATHER BT-01", 85, "/assets/extracted/images/img_51_JC-04_51.webp", "BELTS", "MEN", ["S", "M", "L", "XL"]),
    generateProduct("BT-002", "REVERSIBLE BT-02", 95, "/assets/extracted/images/img_53_WB-04_53.webp", "BELTS", "MEN", ["M", "L", "XL", "XXL"]),
    generateProduct("BT-003", "BRAIDED BT-03", 70, "/assets/extracted/images/img_55_BB-01_55.webp", "BELTS", "WOMEN", ["XS", "S", "M", "L"]),
    generateProduct("BT-004", "WESTERN BT-04", 120, "/assets/extracted/images/img_57_HD-04_57.webp", "BELTS", "MEN", ["M", "L", "XL"]),
    generateProduct("BT-005", "CHAIN BT-05", 65, "/assets/extracted/images/img_59_BB-01_59.webp", "BELTS", "WOMEN", ["S", "M", "L"]),
    generateProduct("BT-006", "CLASSIC BT-06", 90, "/assets/extracted/images/img_61_HD-04_61.webp", "BELTS", "UNISEX", ["S", "M", "L", "XL"]),
    generateProduct("BT-007", "STRETCH BT-07", 55, "/assets/extracted/images/img_63_JC-09_63.webp", "BELTS", "UNISEX", ["FREESIZE"]),
    generateProduct("BT-008", "DRESS BT-08", 110, "/assets/extracted/images/img_65_WP-01_65.webp", "BELTS", "MEN", ["M", "L", "XL"]),

    // BLAZERS - has gender, has sizes
    generateProduct("BZ-001", "SINGLE BREASTED BZ-01", 380, "/assets/extracted/images/img_67_WD-01_67.webp", "BLAZERS", "MEN", ["S", "M", "L", "XL", "XXL"]),
    generateProduct("BZ-002", "DOUBLE BREASTED BZ-02", 450, "/assets/extracted/images/img_69_TS-03_69.webp", "BLAZERS", "MEN", ["M", "L", "XL"]),
    generateProduct("BZ-003", "SLIM FIT BZ-03", 320, "/assets/extracted/images/img_71_TS-03_71.webp", "BLAZERS", "WOMEN", ["XS", "S", "M", "L"]),
    generateProduct("BZ-004", "CASUAL BZ-04", 280, "/assets/extracted/images/img_73_TS-03_73.webp", "BLAZERS", "UNISEX", ["S", "M", "L", "XL"]),
    generateProduct("BZ-005", "VELVET BZ-05", 520, "/assets/extracted/images/img_75_TS-07_75.webp", "BLAZERS", "MEN", ["S", "M", "L", "XL"]),
    generateProduct("BZ-006", "CROPPED BZ-06", 290, "/assets/extracted/images/img_77_TT-06_77.webp", "BLAZERS", "WOMEN", ["XS", "S", "M"]),
    generateProduct("BZ-007", "LINEN BZ-07", 340, "/assets/extracted/images/img_79_LS-03_79.webp", "BLAZERS", "MEN", ["M", "L", "XL", "XXL"]),
    generateProduct("BZ-008", "OVERSIZED BZ-08", 360, "/assets/extracted/images/img_81_HD-10_81.webp", "BLAZERS", "WOMEN", ["S", "M", "L"]),

    // LINGERIE - women only, has sizes
    generateProduct("LG-001", "LACE SET LG-01", 120, "/assets/extracted/images/img_83_JC-08_83.webp", "LINGERIE", "WOMEN", ["XS", "S", "M", "L"]),
    generateProduct("LG-002", "SILK ROBE LG-02", 180, "/assets/extracted/images/img_85_JC-08_85.webp", "LINGERIE", "WOMEN", ["S", "M", "L", "XL"]),
    generateProduct("LG-003", "BODYSUIT LG-03", 95, "/assets/extracted/images/img_87_PK-01_87.webp", "LINGERIE", "WOMEN", ["XS", "S", "M", "L"]),
    generateProduct("LG-004", "CHEMISE LG-04", 85, "/assets/extracted/images/img_101_YS-01_101.webp", "LINGERIE", "WOMEN", ["S", "M", "L"]),
    generateProduct("LG-005", "BRA SET LG-05", 75, "/assets/extracted/images/img_103_PK-01_103.webp", "LINGERIE", "WOMEN", ["XS", "S", "M", "L", "XL"]),
    generateProduct("LG-006", "TEDDY LG-06", 110, "/assets/extracted/images/img_105_BD-10_105.webp", "LINGERIE", "WOMEN", ["S", "M", "L"]),
    generateProduct("LG-007", "CAMISOLE LG-07", 65, "/assets/extracted/images/img_107_WJ-02_107.webp", "LINGERIE", "WOMEN", ["XS", "S", "M", "L"]),
    generateProduct("LG-008", "CORSET LG-08", 150, "/assets/extracted/images/img_109_PT-05_109.webp", "LINGERIE", "WOMEN", ["XS", "S", "M", "L"]),

    // GIFT SETS - no gender, no sizes
    generateProduct("GS-001", "EXECUTIVE SET GS-01", 350, "/assets/extracted/images/img_111_PT-10_111.webp", "GIFT_SETS"),
    generateProduct("GS-002", "GROOMING SET GS-02", 180, "/assets/extracted/images/img_113_LG-14_113.webp", "GIFT_SETS"),
    generateProduct("GS-003", "TRAVEL SET GS-03", 220, "/assets/extracted/images/img_115_BX-01_115.webp", "GIFT_SETS"),
    generateProduct("GS-004", "LUXURY SET GS-04", 480, "/assets/extracted/images/img_117_HT-04_117.webp", "GIFT_SETS"),
    generateProduct("GS-005", "STARTER SET GS-05", 120, "/assets/extracted/images/img_119_BG-01_119.webp", "GIFT_SETS"),
    generateProduct("GS-006", "PREMIUM SET GS-06", 550, "/assets/extracted/images/img_121_WJ-01_121.webp", "GIFT_SETS"),
    generateProduct("GS-007", "EVERYDAY SET GS-07", 95, "/assets/extracted/images/img_123_PK-01_123.webp", "GIFT_SETS"),
    generateProduct("GS-008", "SIGNATURE SET GS-08", 420, "/assets/extracted/images/img_125_WH-01_125.webp", "GIFT_SETS"),

    // Additional products to fill the grid
    generateProduct("WT-009", "LUXURY WT-09", 890, "/assets/extracted/images/img_127_YS-01_127.webp", "WATCHES", "MEN"),
    generateProduct("WT-010", "DIAMOND WT-10", 1200, "/assets/extracted/images/img_129_YS-01_129.webp", "WATCHES", "WOMEN"),
    generateProduct("SG-009", "MIRROR SG-09", 175, "/assets/extracted/images/img_131_HD-01_131.webp", "SUNGLASSES", "UNISEX"),
    generateProduct("SG-010", "GRADIENT SG-10", 195, "/assets/extracted/images/img_133_PT-04_133.webp", "SUNGLASSES", "WOMEN"),
    generateProduct("WL-009", "RFID WL-09", 130, "/assets/extracted/images/img_135_BT-01_135.webp", "WALLETS"),
    generateProduct("WL-010", "PASSPORT WL-10", 160, "/assets/extracted/images/img_137_HD-01_137.webp", "WALLETS"),
    generateProduct("BT-009", "CANVAS BT-09", 45, "/assets/extracted/images/img_139_HD-01_139.webp", "BELTS", "UNISEX", ["FREESIZE"]),
    generateProduct("BT-010", "SUEDE BT-10", 100, "/assets/extracted/images/img_141_JC-05_141.webp", "BELTS", "MEN", ["M", "L", "XL"]),
    generateProduct("BZ-009", "TWEED BZ-09", 420, "/assets/extracted/images/img_143_YS-01_143.webp", "BLAZERS", "WOMEN", ["S", "M", "L"]),
    generateProduct("BZ-010", "CORDUROY BZ-10", 380, "/assets/extracted/images/img_145_TS-01_145.webp", "BLAZERS", "MEN", ["M", "L", "XL", "XXL"]),
    generateProduct("LG-009", "SATIN SET LG-09", 130, "/assets/extracted/images/img_147_TS-02_147.webp", "LINGERIE", "WOMEN", ["S", "M", "L"]),
    generateProduct("LG-010", "MESH LG-10", 88, "/assets/extracted/images/img_149_TS-04_149.webp", "LINGERIE", "WOMEN", ["XS", "S", "M", "L"]),
    generateProduct("GS-009", "ANNIVERSARY SET GS-09", 650, "/assets/extracted/images/img_151_TT-02_151.webp", "GIFT_SETS"),
    generateProduct("GS-010", "ESSENTIALS SET GS-10", 140, "/assets/extracted/images/img_153_TT-04_153.webp", "GIFT_SETS"),

    // Even more products
    generateProduct("WT-011", "TITANIUM WT-11", 950, "/assets/extracted/images/img_155_BD-03_155.webp", "WATCHES", "MEN"),
    generateProduct("WT-012", "ROSE GOLD WT-12", 680, "/assets/extracted/images/img_157_BD-04_157.webp", "WATCHES", "WOMEN"),
    generateProduct("SG-011", "POLARIZED SG-11", 260, "/assets/extracted/images/img_159_LS-04_159.webp", "SUNGLASSES", "MEN"),
    generateProduct("SG-012", "RIMLESS SG-12", 320, "/assets/extracted/images/img_161_HD-02_161.webp", "SUNGLASSES", "WOMEN"),
    generateProduct("WL-011", "COIN WL-11", 75, "/assets/extracted/images/img_163_HD-03_163.webp", "WALLETS"),
    generateProduct("WL-012", "LONG WL-12", 145, "/assets/extracted/images/img_165_JC-01_165.webp", "WALLETS"),
    generateProduct("BT-011", "FORMAL BT-11", 130, "/assets/extracted/images/img_167_WB-01_167.webp", "BELTS", "MEN", ["L", "XL", "XXL"]),
    generateProduct("BT-012", "THIN BT-12", 60, "/assets/extracted/images/img_169_BR-09_169.webp", "BELTS", "WOMEN", ["XS", "S", "M"]),
    generateProduct("BZ-011", "TUXEDO BZ-11", 580, "/assets/extracted/images/img_171_SH-01_171.webp", "BLAZERS", "MEN", ["S", "M", "L", "XL"]),
    generateProduct("BZ-012", "BLAZER DRESS BZ-12", 340, "/assets/extracted/images/img_173_SH-06_173.webp", "BLAZERS", "WOMEN", ["XS", "S", "M", "L"]),
];

// Filter products by criteria
export function filterProducts(
    products: Product[],
    categories?: Category[],
    genders?: Gender[],
    sizes?: Size[]
): Product[] {
    return products.filter((product) => {
        // Category filter
        if (categories && categories.length > 0) {
            const hasAll = categories.includes("ALL");
            if (!hasAll && !categories.includes(product.category)) {
                return false;
            }
        }

        // Gender filter
        if (genders && genders.length > 0 && product.gender) {
             if (!genders.includes(product.gender)) return false;
        }

        // Size filter
        if (sizes && sizes.length > 0 && product.availableSizes) {
             const hasOverlap = sizes.some(s => product.availableSizes?.includes(s));
             if (!hasOverlap) return false;
        }

        return true;
    });
}
