from PIL import Image, ImageDraw, ImageFont

width, height = 1200, 630
bg_color = (252, 249, 242) # Clean light parchment
text_color = (190, 18, 60) # Crimson

img = Image.new('RGB', (width, height), color=bg_color)
d = ImageDraw.Draw(img)

try:
    font = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 100)
except:
    font = ImageFont.load_default()

text = "STOP USING CURE 1"
bbox = d.textbbox((0, 0), text, font=font)
text_w = bbox[2] - bbox[0]

# Draw text centered near the top
d.text(((width - text_w) / 2, 120), text, font=font, fill=text_color)

try:
    # Open icons
    cure1 = Image.open('48px-Cure_Icon.png').convert("RGBA")
    cure2 = Image.open('48px-Cure_II_Icon.png').convert("RGBA")

    # Scale icons (4x)
    icon_size = 192
    cure1 = cure1.resize((icon_size, icon_size), Image.Resampling.NEAREST)
    cure2 = cure2.resize((icon_size, icon_size), Image.Resampling.NEAREST)

    # Draw red X over Cure 1
    c1_draw = ImageDraw.Draw(cure1)
    red_x = (220, 38, 38, 255) # Bright red
    line_w = 16
    c1_draw.line((15, 15, icon_size-15, icon_size-15), fill=red_x, width=line_w)
    c1_draw.line((15, icon_size-15, icon_size-15, 15), fill=red_x, width=line_w)

    # Draw green check over Cure 2
    c2_draw = ImageDraw.Draw(cure2)
    green_chk = (22, 163, 74, 255) # Emerald green
    c2_draw.line((30, icon_size//2, icon_size//2.5, icon_size - 30), fill=green_chk, width=line_w)
    c2_draw.line((icon_size//2.5, icon_size - 30, icon_size - 20, 30), fill=green_chk, width=line_w)

    # Paste icons in the lower middle
    img.paste(cure1, (int(width/2 - icon_size - 80), 320), cure1)
    img.paste(cure2, (int(width/2 + 80), 320), cure2)
except Exception as e:
    print("Could not load/draw icons:", e)

img.save('og_banner.png')
print("Image updated successfully.")
