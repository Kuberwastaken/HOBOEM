import openpyxl
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.datavalidation import DataValidation

# Create workbook
wb = Workbook()
ws = wb.active
ws.title = "Product Catalog"

# Define headers
headers = [
    "SKU",
    "Category",
    "Men",
    "Women", 
    "Kids",
    "Unisex",
    "Size Options",
    "Hero Image",
    "Variation 1",
    "Variation 2",
    "Variation 3",
    "Variation 4",
    "Variation 5",
    "Variation 6",
    "Notes"
]

# Style headers
header_fill = PatternFill(start_color="000000", end_color="000000", fill_type="solid")
header_font = Font(color="FFFFFF", bold=True, size=11)

for col_num, header in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col_num)
    cell.value = header
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center")

# Set column widths
ws.column_dimensions['A'].width = 15  # SKU
ws.column_dimensions['B'].width = 20  # Category
ws.column_dimensions['C'].width = 8   # Men
ws.column_dimensions['D'].width = 10  # Women
ws.column_dimensions['E'].width = 8   # Kids
ws.column_dimensions['F'].width = 10  # Unisex
ws.column_dimensions['G'].width = 25  # Size Options
ws.column_dimensions['H'].width = 25  # Hero Image
for col in ['I', 'J', 'K', 'L', 'M', 'N']:  # Variations
    ws.column_dimensions[col].width = 25
ws.column_dimensions['O'].width = 40  # Notes

# Category dropdown (Column B)
category_dv = DataValidation(
    type="list",
    formula1='"Watches,Sunglasses,Lingerie,Wallets,Belts,Blazers,Watch Gift Set"',
    allow_blank=False
)
category_dv.error = 'Please select a valid category'
category_dv.errorTitle = 'Invalid Category'
ws.add_data_validation(category_dv)
category_dv.add(f'B2:B1000')

# Gender checkboxes (Men, Women, Kids, Unisex) - Columns C, D, E, F
# Note: We'll use YES/NO dropdowns instead of actual checkboxes
gender_dv = DataValidation(
    type="list",
    formula1='"YES,NO"',
    allow_blank=True
)
ws.add_data_validation(gender_dv)
gender_dv.add('C2:F1000')

# Size Options dropdown (Column G)
size_dv = DataValidation(
    type="list",
    formula1='"XS,S,M,L,XL,XXL,Freesize,N/A"',
    allow_blank=True
)
size_dv.error = 'Select valid size or N/A'
size_dv.errorTitle = 'Invalid Size'
ws.add_data_validation(size_dv)
size_dv.add('G2:G1000')

# Add instruction row with light gray background
instruction_fill = PatternFill(start_color="F0F0F0", end_color="F0F0F0", fill_type="solid")
instruction_font = Font(size=9, italic=True, color="666666")

instructions = [
    "e.g. YZ-001",
    "Select category",
    "YES/NO",
    "YES/NO",
    "YES/NO",
    "YES/NO",
    "Select if applicable",
    "filename.webp",
    "filename.webp",
    "filename.webp",
    "filename.webp",
    "filename.webp",
    "filename.webp",
    "filename.webp",
    "Optional specs"
]

for col_num, instruction in enumerate(instructions, 1):
    cell = ws.cell(row=2, column=col_num)
    cell.value = instruction
    cell.fill = instruction_fill
    cell.font = instruction_font
    cell.alignment = Alignment(horizontal="left", vertical="center")

# Add sample data row
sample_data = [
    "YZ-001",
    "Watches",
    "YES",
    "NO",
    "NO",
    "NO",
    "N/A",
    "yz001_hero.webp",
    "yz001_side.webp",
    "yz001_back.webp",
    "yz001_detail.webp",
    "",
    "",
    "",
    "Stainless steel, 42mm case"
]

for col_num, value in enumerate(sample_data, 1):
    cell = ws.cell(row=3, column=col_num)
    cell.value = value

# Freeze header row
ws.freeze_panes = 'A2'

# Add a separate "Rules" sheet for reference
rules_sheet = wb.create_sheet("RULES - READ THIS")
rules_sheet.column_dimensions['A'].width = 80

rules = [
    ("PRODUCT CATALOG TEMPLATE - RULES", "000000", "FFFFFF", True, 14),
    ("", None, None, False, 11),
    ("CATEGORY LOGIC:", "1F4E78", "FFFFFF", True, 12),
    ("", None, None, False, 11),
    ("Watches: Gender options (Men/Women/Kids/Unisex) available, NO size options", None, None, False, 10),
    ("Sunglasses: Gender options available, NO size options", None, None, False, 10),
    ("Wallets: Gender options available, NO size options", None, None, False, 10),
    ("Belts: Gender options available, Size options available", None, None, False, 10),
    ("Blazers: Gender options available, Size options REQUIRED (XS-XXL)", None, None, False, 10),
    ("Watch Gift Set: Gender options available, NO size options", None, None, False, 10),
    ("Lingerie: NO gender options (obviously), Size options available", None, None, False, 10),
    ("", None, None, False, 11),
    ("GENDER SELECTION RULES:", "1F4E78", "FFFFFF", True, 12),
    ("", None, None, False, 11),
    ("• If Men OR Women selected → Cannot select Unisex (but can add Kids)", None, None, False, 10),
    ("• If Kids selected alone → Cannot select Men/Women", None, None, False, 10),
    ("• Unisex can only be selected if NO Men/Women selected", None, None, False, 10),
    ("• Multiple selections allowed: Men + Kids, Women + Kids", None, None, False, 10),
    ("", None, None, False, 11),
    ("IMAGE FILE NAMING:", "1F4E78", "FFFFFF", True, 12),
    ("", None, None, False, 11),
    ("• All images must be .webp format with white background", None, None, False, 10),
    ("• Use lowercase with underscores: yz001_hero.webp", None, None, False, 10),
    ("• NO spaces in filenames", None, None, False, 10),
    ("• Hero image is REQUIRED, variations are optional", None, None, False, 10),
    ("• Place all images in ONE folder, zip with this Excel file", None, None, False, 10),
    ("", None, None, False, 11),
    ("SIZE OPTIONS:", "1F4E78", "FFFFFF", True, 12),
    ("", None, None, False, 11),
    ("• Leave blank or use 'N/A' if product doesn't have sizes", None, None, False, 10),
    ("• For multi-size products: Select multiple cells or use comma-separated", None, None, False, 10),
    ("• Common for Blazers and Lingerie", None, None, False, 10),
]

for row_num, (text, bg_color, font_color, bold, size) in enumerate(rules, 1):
    cell = rules_sheet.cell(row=row_num, column=1)
    cell.value = text
    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    
    if bg_color:
        cell.fill = PatternFill(start_color=bg_color, end_color=bg_color, fill_type="solid")
    if font_color:
        cell.font = Font(color=font_color, bold=bold, size=size)
    else:
        cell.font = Font(bold=bold, size=size)

# Save workbook
wb.save('product_catalog_template.xlsx')
print("✅ Template created: product_catalog_template.xlsx")
print("\nKey Features:")
print("• Category dropdown with 7 options")
print("• Gender checkboxes (YES/NO dropdowns)")
print("• Size options dropdown")
print("• Hero image + 6 variation columns")
print("• Built-in validation rules")
print("• Separate 'RULES' sheet with complete logic")