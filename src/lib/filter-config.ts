// Filter Configuration for HOBOEM

export type Category =
    | "ALL"
    | "WATCHES"
    | "SUNGLASSES"
    | "WALLETS"
    | "BELTS"
    | "BLAZERS"
    | "LINGERIE"
    | "GIFT_SETS";

export type Gender = "MEN" | "WOMEN" | "UNISEX" | "KIDS";

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "FREESIZE";

export const CATEGORIES: Category[] = [
    "ALL",
    "WATCHES",
    "SUNGLASSES",
    "WALLETS",
    "BELTS",
    "BLAZERS",
    "LINGERIE",
    "GIFT_SETS",
];

export const CATEGORY_DISPLAY_NAMES: Record<Category, string> = {
    ALL: "All",
    WATCHES: "Watches",
    SUNGLASSES: "Sunglasses",
    WALLETS: "Wallets",
    BELTS: "Belts",
    BLAZERS: "Blazers",
    LINGERIE: "Lingerie",
    GIFT_SETS: "Gift Sets",
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

export const CATEGORY_FILTER_CONFIG: Record<Category, CategoryFilterConfig> = {
    ALL: {
        hasGender: true,
        hasSize: true,
        availableGenders: ["MEN", "WOMEN", "UNISEX", "KIDS"],
    },
    WATCHES: {
        hasGender: true,
        hasSize: false,
        availableGenders: ["MEN", "WOMEN", "UNISEX", "KIDS"],
    },
    SUNGLASSES: {
        hasGender: true,
        hasSize: false,
        availableGenders: ["MEN", "WOMEN", "UNISEX", "KIDS"],
    },
    WALLETS: {
        hasGender: false,
        hasSize: false,
    },
    BELTS: {
        hasGender: true,
        hasSize: false,
        availableGenders: ["MEN", "WOMEN", "UNISEX"],
    },
    BLAZERS: {
        hasGender: true,
        hasSize: true,
        availableGenders: ["MEN", "WOMEN", "UNISEX"],
    },
    LINGERIE: {
        hasGender: false, // Update: No gender for Lingerie
        hasSize: true,
    },
    GIFT_SETS: {
        hasGender: false,
        hasSize: false,
    },
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
