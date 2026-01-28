import os
import shutil
import random

# ---------- CONFIGURATION ----------
dataset_path = r"C:\Users\User\Downloads\BE-main\BE-main\dataset\ISL_Dataset"
split_path   = r"C:\Users\User\Downloads\BE-main\BE-main\dataset\ISL_SPLIT"
train_ratio  = 0.8  # 80% train, 20% test

# ---------- CLEAN old train/test folders ----------
for folder in ["train", "test"]:
    folder_path = os.path.join(split_path, folder)
    if os.path.exists(folder_path):
        shutil.rmtree(folder_path)  # delete folder and all contents

# ---------- GET ALL CLASSES ----------
classes = [d for d in os.listdir(dataset_path) if os.path.isdir(os.path.join(dataset_path, d))]
classes.sort()  # optional, keeps classes in order

# ---------- CREATE TRAIN/TEST SPLIT ----------
for cls in classes:
    cls_path = os.path.join(dataset_path, cls)
    
    # Create class folder in train/test
    for split in ["train", "test"]:
        os.makedirs(os.path.join(split_path, split, cls), exist_ok=True)
    
    images = os.listdir(cls_path)
    random.shuffle(images)
    
    split_index = int(len(images) * train_ratio)
    train_images = images[:split_index]
    test_images  = images[split_index:]
    
    # Copy train images
    for img in train_images:
        shutil.copy(os.path.join(cls_path, img), os.path.join(split_path, "train", cls, img))
    
    # Copy test images
    for img in test_images:
        shutil.copy(os.path.join(cls_path, img), os.path.join(split_path, "test", cls, img))

print("✅ Dataset split complete!")
print(f"Classes found: {classes}")
