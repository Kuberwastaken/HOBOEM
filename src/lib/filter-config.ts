// Filter Configuration for HOBOEM

export type Category =
    | "ALL"
    | "WATCHES"
    | "SUNGLASSES"
    | "LEATHER"
    | "LINGERIE"
    | "GIFT_SET";

export type Gender = "MEN" | "WOMEN" | "UNISEX" | "KIDS";

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "FREESIZE";

export type ProductSort = "FEATURED" | "PRICE_ASC" | "PRICE_DESC";

export const CATEGORIES: Category[] = [
    "ALL",
    "WATCHES",
    "SUNGLASSES",
    "LEATHER",
    "LINGERIE",
    "GIFT_SET",
];

export const CATEGORY_DISPLAY_NAMES: Record<Category, string> = {
    ALL: "All",
    WATCHES: "Watches",
    SUNGLASSES: "Sunglasses",
    LEATHER: "Leather",
    LINGERIE: "Lingerie",
    GIFT_SET: "Gift Set",
};

export const PRODUCT_SORT_DISPLAY_NAMES: Record<ProductSort, string> = {
    FEATURED: "Featured",
    PRICE_ASC: "Low to High",
    PRICE_DESC: "High to Low",
};

export const GENDERS: Gender[] = ["MEN", "WOMEN", "UNISEX", "KIDS"];

export const GENDER_DISPLAY_NAMES: Record<Gender, string> = {
    MEN: "Men",
    WOMEN: "Women",
    UNISEX: "Unisex",
    KIDS: "Kids",
};

export const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL", "FREESIZE"];

// Configuration: Which categories support which filters
export interface CategoryFilterConfig {
    hasGender: boolean;
    hasSize: boolean;
    availableGenders?: Gender[];
}

export interface CategorySubcategory {
    id: string;
    label: string;
    genders?: Gender[];
    isDefault?: boolean;
}

export const CATEGORY_FILTER_CONFIG: Record<Category, CategoryFilterConfig> = {
    ALL: {
        hasGender: true,
        hasSize: false,
        availableGenders: ["MEN", "WOMEN", "KIDS"],
    },
    WATCHES: {
        hasGender: true,
        hasSize: false,
        availableGenders: ["MEN", "WOMEN", "KIDS"],
    },
    SUNGLASSES: {
        hasGender: false,
        hasSize: false,
    },
    LEATHER: {
        hasGender: false,
        hasSize: false,
    },
    LINGERIE: {
        hasGender: false,
        hasSize: false,
    },
    GIFT_SET: {
        hasGender: false,
        hasSize: false,
    },
};

export const CATEGORY_SUBCATEGORIES: Partial<Record<Category, CategorySubcategory[]>> = {
    WATCHES: [
        { id: "ALL_WATCHES", label: "All Watches", isDefault: true },
        { id: "WATCHES_MEN", label: "Men", genders: ["MEN"] },
        { id: "WATCHES_WOMEN", label: "Women", genders: ["WOMEN"] },
        { id: "WATCHES_KIDS", label: "Kids", genders: ["KIDS"] },
    ],
    SUNGLASSES: [
        { id: "ALL_SUNGLASSES", label: "All Sunglasses", isDefault: true },
        { id: "SUNGLASSES_UNISEX", label: "Unisex", genders: ["UNISEX"] },
        { id: "SUNGLASSES_KIDS", label: "Kids", genders: ["KIDS"] },
    ],
    LEATHER: [
        { id: "ALL_LEATHER", label: "All Leather", isDefault: true },
        { id: "LEATHER_WALLETS", label: "Wallets" },
        { id: "LEATHER_BELTS", label: "Belts" },
    ],
};

// Helper functions
export function getCategoryConfig(category: Category): CategoryFilterConfig {
    return CATEGORY_FILTER_CONFIG[category];
}

export function shouldShowGenderFilter(category: Category): boolean {
    return CATEGORY_FILTER_CONFIG[category].hasGender;
}

export function shouldShowSizeFilter(category: Category): boolean {
    return CATEGORY_FILTER_CONFIG[category].hasSize;
}

export function getAvailableGenders(category: Category): Gender[] {
    const config = CATEGORY_FILTER_CONFIG[category];
    return config.hasGender ? (config.availableGenders || GENDERS) : [];
}

export function getCategorySubcategories(category: Category): CategorySubcategory[] {
    return CATEGORY_SUBCATEGORIES[category] || [];
}

export function getCategorySubcategoryById(
    category: Category,
    subcategoryId: string | null,
): CategorySubcategory | null {
    if (!subcategoryId) {
        return null;
    }

    return getCategorySubcategories(category).find(
        (subcategory) => subcategory.id === subcategoryId,
    ) || null;
}
