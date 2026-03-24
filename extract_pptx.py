import os
import xml.etree.ElementTree as ET
from pathlib import Path

# 路径
extracted_dir = r"C:\Users\Komorebi\.openclaw\workspace\temp_pptx\extracted"
slides_dir = os.path.join(extracted_dir, "ppt", "slides")

# 命名空间
namespaces = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'
}

# 注册命名空间以便查找
for prefix, uri in namespaces.items():
    ET.register_namespace(prefix, uri)

# 遍历所有幻灯片文件
slide_files = sorted(Path(slides_dir).glob('slide*.xml'))
print(f"找到 {len(slide_files)} 张幻灯片")
print("=" * 50)

for slide_file in slide_files:
    slide_num = slide_file.stem.replace('slide', '')
    try:
        tree = ET.parse(slide_file)
        root = tree.getroot()
        
        # 查找所有文本节点
        text_elements = root.findall('.//a:t', namespaces)
        texts = [elem.text.strip() for elem in text_elements if elem.text and elem.text.strip()]
        
        print(f"幻灯片 {slide_num}:")
        if texts:
            for i, text in enumerate(texts, 1):
                print(f"  {i}. {text}")
        else:
            print("  (无文本内容)")
        print()
    except Exception as e:
        print(f"幻灯片 {slide_num} 解析错误: {e}")
        print()