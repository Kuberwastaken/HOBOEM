
import os
import json
import random

IMAGE_DIR = r"d:\HOB-Projects\HOBOEM\yeezy-app\public\assets\extracted\images"
OUTPUT_FILE = r"d:\HOB-Projects\HOBOEM\yeezy-app\src\lib\products.ts"

def get_category_and_name(id_prefix):
    # Guesses based on prefixes
    prefix = id_prefix.upper()
    if prefix.startswith('PK'): return "MENS", "PARKA"
    if prefix.startswith('JC'): return "MENS", "JACKET"
    if prefix.startswith('SL'): return "ACCESSORIES", "SLIDES"
    if prefix.startswith('BL'): return "ACCESSORIES", "BLANKET"
    if prefix.startswith('BP'): return "ACCESSORIES", "BACKPACK"
    if prefix.startswith('WD'): return "MENS", "WINDBREAKER"
    if prefix.startswith('CT'): return "WOMENS", "COAT"
    if prefix.startswith('BG'): return "ACCESSORIES", "BAG"
    if prefix.startswith('RC'): return "WOMENS", "RAIN COAT"
    if prefix.startswith('WP'): return "MENS", "PANTS"
    if prefix.startswith('JC'): return "MENS", "JACKET"
    if prefix.startswith('BB'): return "WOMENS", "BUBBLE JACKET"
    if prefix.startswith('HD'): return "MENS", "HOODIE"
    if prefix.startswith('TS'): return "MENS", "T-SHIRT"
    if prefix.startswith('SH'): return "MENS", "SHIRT"
    if prefix.startswith('SK'): return "MENS", "SNEAKER" # Guessing SK is sneaker or skirt? Yeezy usually has chunky shoes/boots. Maybe "FOOTWEAR" but we only have MENS/WOMENS/ACCESSORIES. Let's say ACCESSORIES or MENS. Let's go MENS.
    if prefix.startswith('LG'): return "WOMENS", "LEGGINGS"
    if prefix.startswith('LZ'): return "WOMENS", "SHIRT"
    if prefix.startswith('BR'): return "WOMENS", "BRA"
    if prefix.startswith('LS'): return "MENS", "LONG SLEEVE"
    if prefix.startswith('TT'): return "WOMENS", "TOP"
    if prefix.startswith('HT'): return "ACCESSORIES", "HAT"
    if prefix.startswith('GL'): return "ACCESSORIES", "GLOVES"
    if prefix.startswith('SC'): return "ACCESSORIES", "SCARF"
    if prefix.startswith('BT'): return "ACCESSORIES", "BOOT"
    if prefix.startswith('WJ'): return "MENS", "WORK JACKET"
    if prefix.startswith('PT'): return "MENS", "PANTS"
    if prefix.startswith('BD'): return "WOMENS", "BODYSUIT"
    
    return "MENS", "PRODUCT" # Default

products = []
seen_ids = set()

# List files
files = os.listdir(IMAGE_DIR)
# Sort to keep order
files.sort()

for f in files:
    if not f.endswith('.webp'): continue
    
    # Expected format: img_{INDEX}_{ID}_{INDEX}.webp
    parts = f.split('_')
    if len(parts) >= 4:
        # parts[0] = img
        # parts[1] = index
        # parts[2] = ID (e.g., PK-01)
        # parts[3] = index.webp
        
        prod_id = parts[2]
        
        if not prod_id or len(prod_id) < 2:
            continue
        
        if prod_id in seen_ids:
             # If we already have PK-01, maybe this is a variant?
             # Let's generate a variant ID like PK-01-2
             pass
        # Actually, let's look at the filenames again.
        # img_1_PK-01_1.webp
        # img_15_PK-01_15.webp
        # img_87_PK-01_87.webp
        # These are likely different colorways or shots.
        # Let's include them all as separate items for the "Grid" feel.
        
        category, name_base = get_category_and_name(prod_id)
        
        # Determine price based on item type
        price = 200
        if "JACKET" in name_base or "COAT" in name_base or "PARKA" in name_base: price = 400 + random.randint(0, 40) * 10
        elif "TEE" in name_base or "SHIRT" in name_base or "TOP" in name_base: price = 100 + random.randint(0, 10) * 10
        elif "PANT" in name_base or "LEGGING" in name_base: price = 220 + random.randint(0, 8) * 10
        elif "HOODIE" in name_base: price = 180 + random.randint(0, 8) * 10
        elif "SLIDE" in name_base: price = 70
        elif "BOOT" in name_base: price = 300
        
        # Unique ID for our app
        # Use the file index to make it unique: PK-01-1, PK-01-15
        idx = parts[1]
        unique_id = f"{prod_id}-{idx}"
        
        products.append({
            "id": unique_id,
            "name": f"{name_base} {prod_id}", # e.g. PARKA PK-01
            "price": price,
            "image": f"/assets/extracted/images/{f}",
            "category": category
        })

# Generate TypeScript content
ts_content = """export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: "MENS" | "WOMENS" | "ACCESSORIES";
}

export const PRODUCTS: Product[] = [
"""

for p in products:
    ts_content += "    {\n"
    ts_content += f'        id: "{p["id"]}",\n'
    ts_content += f'        name: "{p["name"]}",\n'
    ts_content += f'        price: {p["price"]},\n'
    ts_content += f'        image: "{p["image"]}",\n'
    ts_content += f'        category: "{p["category"]}",\n'
    ts_content += "    },\n"

ts_content += "];\n"

with open(OUTPUT_FILE, "w") as f:
    f.write(ts_content)

print(f"Generated {len(products)} products in {OUTPUT_FILE}")
