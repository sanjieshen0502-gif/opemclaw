const fs = require('fs');
const path = require('path');

const extractedDir = path.join(__dirname, 'temp_pptx', 'extracted');
const slidesDir = path.join(extractedDir, 'ppt', 'slides');

// 获取所有幻灯片文件
const slideFiles = fs.readdirSync(slidesDir)
  .filter(f => f.startsWith('slide') && f.endsWith('.xml'))
  .sort((a, b) => {
    const aNum = parseInt(a.replace('slide', '').replace('.xml', ''));
    const bNum = parseInt(b.replace('slide', '').replace('.xml', ''));
    return aNum - bNum;
  });

console.log(`找到 ${slideFiles.length} 张幻灯片`);
console.log('='.repeat(50));

slideFiles.forEach((filename, index) => {
  const slideNum = filename.replace('slide', '').replace('.xml', '');
  const filePath = path.join(slidesDir, filename);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 简单正则提取 <a:t> 标签内的文本
    // 注意：这个正则不处理嵌套标签或属性中的 <a:t>，但对大多数PPTX足够
    const textMatches = content.match(/<a:t[^>]*>([^<]+)<\/a:t>/g);
    
    let texts = [];
    if (textMatches) {
      texts = textMatches.map(tag => {
        // 提取标签内的文本
        const match = tag.match(/<a:t[^>]*>([^<]+)<\/a:t>/);
        return match ? match[1].trim() : '';
      }).filter(text => text.length > 0);
    }
    
    console.log(`幻灯片 ${slideNum}:`);
    if (texts.length > 0) {
      texts.forEach((text, i) => {
        console.log(`  ${i + 1}. ${text}`);
      });
    } else {
      console.log(`  (无文本内容)`);
    }
    console.log();
  } catch (error) {
    console.log(`幻灯片 ${slideNum} 读取错误: ${error.message}`);
    console.log();
  }
});