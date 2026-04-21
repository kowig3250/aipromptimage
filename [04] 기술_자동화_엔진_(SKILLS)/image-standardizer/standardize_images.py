import os
from PIL import Image
import sys

def standardize_image(file_path, target_size=(1024, 1024)):
    try:
        with Image.open(file_path) as img:
            # Ensure it's RGB (in case of RGBA or palette)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            w, h = img.size
            
            # 1. Center Crop to Square
            if w != h:
                min_dim = min(w, h)
                left = (w - min_dim) / 2
                top = (h - min_dim) / 2
                right = (w + min_dim) / 2
                bottom = (h + min_dim) / 2
                img = img.crop((left, top, right, bottom))
            
            # 2. Resize to Target
            img = img.resize(target_size, Image.Resampling.LANCZOS)
            
            # 3. Save (Quality 95)
            img.save(file_path, "PNG", optimize=True)
            print(f"Processed: {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    base_dir = r"d:\agent\홍프로 프로젝트\assets_warehouse"
    dashboard_assets_dir = r"d:\agent\홍프로 프로젝트\[01] 브리핑_콕핏_(DASHBOARD)\assets"
    
    targets = ["choi", "jenny", "kodari", "mandgi", "yang"]
    
    # Process assets_warehouse
    for target in targets:
        dir_path = os.path.join(base_dir, target)
        if not os.path.isdir(dir_path):
            continue
        
        for filename in os.listdir(dir_path):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(dir_path, filename)
                standardize_image(file_path)

    # Process Dashboard Assets (Mirroring)
    for target in targets:
        dir_path = os.path.join(dashboard_assets_dir, target)
        if not os.path.isdir(dir_path):
            continue
        
        for filename in os.listdir(dir_path):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(dir_path, filename)
                standardize_image(file_path)

if __name__ == "__main__":
    main()
