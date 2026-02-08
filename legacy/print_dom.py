
from bs4 import BeautifulSoup

SOURCE_FILE = r"d:\HOB-Projects\HOBOEM\source\index.html"

with open(SOURCE_FILE, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

# Try to find a known product image by alt text part
img = soup.find("img", alt=lambda x: x and "PK-01" in x)
if img:
    print(f"Found Image: {img}")
    parent = img.parent
    for _ in range(5):
        if parent:
            print(f"Parent: <{parent.name} class='{parent.get('class')}'>")
            parent = parent.parent
        else:
            break
else:
    print("Image with PK-01 not found.")

# Also print the first few major containers in body
body = soup.body
if body:
    print("\nBody direct children:")
    for child in body.find_all(recursive=False):
        print(f"<{child.name} class='{child.get('class')}'>")
