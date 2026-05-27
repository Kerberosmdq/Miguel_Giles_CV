from PIL import Image, ImageDraw

def process_image():
    # Load the image
    img_path = r"c:\AppsMiga\NexCV\public\logo_original.jpeg"
    try:
        img = Image.open(img_path)
    except Exception as e:
        print(f"Error loading image: {e}")
        return

    width, height = img.size
    print(f"Image dimensions: {width}x{height}")

    # Create a copy to draw on
    draw = ImageDraw.Draw(img)

    # We want to cover the bottom text and the messy lines.
    # Let's assume the text and messy lines are in the bottom 25% of the image.
    # The background color is a very dark blue. Let's sample a pixel near the top edge.
    bg_color = img.getpixel((width // 2, 10))
    
    # We will draw a grid to help us find the exact coordinates
    for x in range(0, width, 50):
        draw.line([(x, 0), (x, height)], fill=(255, 0, 0), width=1)
    for y in range(0, height, 50):
        draw.line([(0, y), (width, y)], fill=(255, 0, 0), width=1)
        
    # Save the grid image to the artifacts folder so the agent can see it
    out_path = r"C:\Users\migag\.gemini\antigravity\brain\6c2db9a2-30ef-476d-b1c6-f4ae125bbecb\logo_grid.jpg"
    img.save(out_path)
    print(f"Saved grid image to {out_path}")

if __name__ == "__main__":
    process_image()
