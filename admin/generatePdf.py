import os
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import sys
import base64

image_data_base64 = sys.argv[1]

    # Decode the base64-encoded image data back to bytes
image_data_bytes = base64.b64decode(image_data_base64)

    # Create a BytesIO object to simulate a file-like object
from io import BytesIO
image_data_io = BytesIO(image_data_bytes)

    # Use Image.open() to open the image
qr_code = Image.open(image_data_io)

# Create a folder if it doesn't exist
if not os.path.exists("QR_CODE"):
    os.makedirs("QR_CODE")

# Create a PDF
district = (sys.argv[2]).upper()
police_station = (sys.argv[3]).upper()
pdf_name = f"QR_CODE/image.pdf"
pdf = canvas.Canvas(pdf_name, pagesize=letter)

# Set the font and size for the text
font_path = "Luthier-Bold.ttf"  # Provide the correct font path
font1 = ImageFont.truetype(font_path, 85)
font2 = ImageFont.truetype(font_path, 65)

# Open the template image
template_img = Image.open("template.png")
draw = ImageDraw.Draw(template_img)

# Position for district name
district_position = (400, 150)
# Position for police station name 
police_station_position = (400, 280)

# Paste the district and police station name on the image
draw.text(district_position, f"{district} POLICE", fill="#03095A", font=font1)
draw.text(police_station_position, f"{police_station}", fill="#03095A", font=font2)

# Open and resize the QR code
# qr_code = Image.open("6539279ee0265e4af914b846.png")
qr_code = qr_code.resize((500, 500))  # Adjust the size as needed
qr_code_position = (70, 1490)
template_img.paste(qr_code, qr_code_position)

output_image_name = f"QR_CODE/image.jpg"
template_img = template_img.convert('RGB')  # Convert the image to RGB mode
template_img.save(output_image_name)

# Draw the image on the PDF
pdf.drawInlineImage(template_img, 0, 0, width=letter[0], height=letter[1])

# Save the PDF
pdf.save()
