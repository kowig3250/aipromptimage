import os
from PIL import Image

def standardize_image(file_path, output_path, size=(1024, 1024)):
    try:
        with Image.open(file_path) as img:
            # Convert to RGB if needed (handle RGBA)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            width, height = img.size
            if width == height:
                res = img.resize(size, Image.LANCZOS)
            else:
                # Center crop to square
                new_dim = min(width, height)
                left = (width - new_dim) / 2
                top = (height - new_dim) / 2
                right = (width + new_dim) / 2
                bottom = (height + new_dim) / 2
                img = img.crop((left, top, right, bottom))
                res = img.resize(size, Image.LANCZOS)
            
            res.save(output_path, "PNG", optimize=True)
            return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    root = r"d:\agent\홍프로 프로젝트\assets_warehouse"
    personas = ["choi", "jenny", "kodari", "mandgi", "yang"]
    
    total = 0
    success = 0
    
    for p in personas:
        p_path = os.path.join(root, p)
        if not os.path.exists(p_path):
            print(f"Directory missing: {p_path}")
            continue
            
        print(f"Processing group: {p}")
        for f in os.listdir(p_path):
            if f.lower().endswith(".png"):
                total += 1
                f_path = os.path.join(p_path, f)
                if standardize_image(f_path, f_path):
                    success += 1
                else:
                    print(f"FAILED: {f_path}")

    print(f"\n--- Standardization Complete ---")
    print(f"Total: {total}, Success: {success}, Failed: {total - success}")

if __name__ == "__main__":
    main()
