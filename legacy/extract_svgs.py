
import re

file_path = r"d:\HOB-Projects\HOBOEM\source\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

svg_matches = re.findall(r'<svg.*?</svg>', content, re.DOTALL)

for i, svg in enumerate(svg_matches):
    print(f"--- SVG {i+1} ---")
    print(svg[:500]) # Print first 500 chars to identify
    print("...")
