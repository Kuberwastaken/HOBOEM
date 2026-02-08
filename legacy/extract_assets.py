
import os
import base64
import re
from bs4 import BeautifulSoup

SOURCE_FILE = r"d:\HOB-Projects\HOBOEM\source\index.html"
OUTPUT_DIR = r"d:\HOB-Projects\HOBOEM\yeezy-app\public\assets\extracted"
IMG_DIR = os.path.join(OUTPUT_DIR, "images")
SVG_DIR = os.path.join(OUTPUT_DIR, "svgs")

os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(SVG_DIR, exist_ok=True)

def save_base64_image(data_uri, file_prefix, index):
    try:
        header, encoded = data_uri.split(',', 1)
        mime_type = header.split(':')[1].split(';')[0]
        extension = mime_type.split('/')[1]
        
        # Mapping common extensions
        if extension == 'svg+xml': extension = 'svg'
        if extension == 'jpeg': extension = 'jpg'
        
        file_name = f"{file_prefix}_{index}.{extension}"
        file_path = os.path.join(IMG_DIR, file_name)
        
        with open(file_path, "wb") as f:
            f.write(base64.b64decode(encoded))
        return file_name
    except Exception as e:
        print(f"Error saving image {index}: {e}")
        return None

def extract_assets():
    print(f"Reading {SOURCE_FILE}...")
    with open(SOURCE_FILE, "r", encoding="utf-8") as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, "html.parser")
    
    print("Extracting <img> tags...")
    images = soup.find_all("img")
    for i, img in enumerate(images):
        src = img.get("src")
        alt = img.get("alt", "image").replace(" ", "_").replace("/", "-")[:50] # Sanitize alt
        
        if src and src.startswith("data:image"):
            saved_name = save_base64_image(src, f"img_{i}_{alt}", i)
            if saved_name:
                print(f"Saved {saved_name}")
        elif src:
             print(f"Skipping non-data URI image: {src[:30]}...")

    print("Extracting inline styles (background-images)...")
    # Regex to find data URIs in css/style attributes
    # url("data:image/png;base64,.....")
    style_pattern = re.compile(r'url\s*\(\s*[\'"]?(data:image\/[^;]+;base64,[^\'"\)]+)[\'"]?\s*\)')
    
    # We can check style tags and style attributes
    style_tags = soup.find_all("style")
    url_matches = []
    
    for style in style_tags:
        url_matches.extend(style_pattern.findall(style.string or ""))
        
    # Also check inline styles on all elements (expensive but thorough)
    # Actually, SingleFile puts most stuff in <style> or preserves inline.
    # Let's just do a regex on the whole HTML for background images if the css extraction misses
    # But let's verify style attributes first
    elements_with_style = soup.find_all(attrs={"style": True})
    for el in elements_with_style:
        url_matches.extend(style_pattern.findall(el["style"]))

    print(f"Found {len(url_matches)} potential background images.")
    for i, data_uri in enumerate(set(url_matches)): # Use set to deduplicate
        saved_name = save_base64_image(data_uri, "bg", i)
        if saved_name:
            print(f"Saved Background: {saved_name}")

    print("Extracting <svg> tags...")
    svgs = soup.find_all("svg")
    for i, svg in enumerate(svgs):
        # We save the svg content directly
        # Sometimes key SVGs like logos have classes/ids
        name = "icon"
        if svg.get("class"):
            name = "_".join(svg.get("class"))
        
        file_name = f"svg_{i}_{name}.svg"
        file_path = os.path.join(SVG_DIR, file_name)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(str(svg))
        print(f"Saved SVG: {file_name}")

if __name__ == "__main__":
    extract_assets()
