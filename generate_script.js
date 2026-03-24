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

let fullScript = '';

slideFiles.forEach((filename, index) => {
  const slideNum = parseInt(filename.replace('slide', '').replace('.xml', ''));
  const filePath = path.join(slidesDir, filename);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 提取所有文本
    const textMatches = content.match(/<a:t[^>]*>([^<]+)<\/a:t>/g);
    
    let texts = [];
    if (textMatches) {
      texts = textMatches.map(tag => {
        const match = tag.match(/<a:t[^>]*>([^<]+)<\/a:t>/);
        return match ? match[1].trim() : '';
      }).filter(text => text.length > 0);
    }
    
    // 将本幻灯片的文本添加到逐字稿中
    if (texts.length > 0) {
      // 添加幻灯片分隔标记
      fullScript += `\n\n=== 幻灯片 ${slideNum} ===\n\n`;
      
      // 将文本合并成段落（尝试智能合并）
      let currentParagraph = '';
      for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        
        // 如果文本以标点结尾或下一行很短，可能是连续对话
        const endsWithPunctuation = /[。！？：;，]$/.test(text);
        const nextText = i < texts.length - 1 ? texts[i + 1] : '';
        const isShortNext = nextText.length < 20;
        
        currentParagraph += text;
        
        // 决定是否换行或继续
        if (endsWithPunctuation || (isShortNext && !nextText.startsWith('('))) {
          fullScript += currentParagraph + '\n';
          currentParagraph = '';
        } else if (text.endsWith('！') || text.endsWith('？') || text.endsWith('。')) {
          fullScript += currentParagraph + '\n';
          currentParagraph = '';
        } else {
          currentParagraph += ' ';
        }
      }
      
      // 处理剩余的段落
      if (currentParagraph.trim()) {
        fullScript += currentParagraph + '\n';
      }
    }
  } catch (error) {
    fullScript += `\n\n=== 幻灯片 ${slideNum} 读取错误 ===\n`;
  }
});

// 保存到文件
const outputPath = path.join(__dirname, '美的净水器直播逐字稿.txt');
fs.writeFileSync(outputPath, fullScript.trim(), 'utf8');
console.log(`逐字稿已保存到: ${outputPath}`);
console.log(`总字符数: ${fullScript.length}`);

// 同时输出预览
console.log('\n=== 逐字稿预览（前1000字符） ===');
console.log(fullScript.substring(0, 1000) + '...');