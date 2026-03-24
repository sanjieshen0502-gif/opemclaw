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

console.log('=== PPT结构分析报告 ===\n');

// 分析每张幻灯片
let totalTextLength = 0;
const slideAnalysis = [];

slideFiles.forEach((filename, index) => {
  const slideNum = parseInt(filename.replace('slide', '').replace('.xml', ''));
  const filePath = path.join(slidesDir, filename);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 提取文本
    const textMatches = content.match(/<a:t[^>]*>([^<]+)<\/a:t>/g);
    let texts = [];
    if (textMatches) {
      texts = textMatches.map(tag => {
        const match = tag.match(/<a:t[^>]*>([^<]+)<\/a:t>/);
        return match ? match[1].trim() : '';
      }).filter(text => text.length > 0);
    }
    
    const slideText = texts.join(' ');
    const charCount = slideText.length;
    const wordCount = slideText.split(/\s+/).length;
    totalTextLength += charCount;
    
    // 分析内容类型
    let contentType = '其他';
    const lowerText = slideText.toLowerCase();
    
    if (lowerText.includes('开场') || lowerText.includes('痛点')) {
      contentType = '开场/痛点';
    } else if (lowerText.includes('品牌方') || lowerText.includes('实验') || lowerText.includes('tds')) {
      contentType = '产品演示';
    } else if (lowerText.includes('价格') || lowerText.includes('折扣') || lowerText.includes('促销')) {
      contentType = '价格促销';
    } else if (lowerText.includes('滤芯') || lowerText.includes('滤芯')) {
      contentType = '配件展示';
    } else if (lowerText.includes('道具') || lowerText.includes('视觉')) {
      contentType = '视觉道具';
    }
    
    // 提取关键词
    const keywords = [];
    const keywordPatterns = [
      '净水器', '美的', 'P80', '滤芯', 'RO', '反渗透', 'TDS', '纯净水', '弱碱水',
      '鲜矿水', '阻垢剂', '价格', '促销', '实验', '品牌方', '派哥'
    ];
    
    keywordPatterns.forEach(keyword => {
      if (slideText.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    slideAnalysis.push({
      slideNum,
      charCount,
      wordCount,
      contentType,
      keywords: [...new Set(keywords)], // 去重
      textPreview: slideText.substring(0, 100) + (slideText.length > 100 ? '...' : '')
    });
    
  } catch (error) {
    slideAnalysis.push({
      slideNum,
      charCount: 0,
      wordCount: 0,
      contentType: '错误',
      keywords: [],
      textPreview: '读取错误'
    });
  }
});

// 输出分析报告
console.log(`📊 总览:`);
console.log(`  幻灯片数量: ${slideAnalysis.length}`);
console.log(`  总文本长度: ${totalTextLength} 字符\n`);

console.log(`📈 内容分布:`);
const contentDist = {};
slideAnalysis.forEach(slide => {
  contentDist[slide.contentType] = (contentDist[slide.contentType] || 0) + 1;
});
Object.entries(contentDist).forEach(([type, count]) => {
  console.log(`  ${type}: ${count} 张幻灯片 (${Math.round(count/slideAnalysis.length*100)}%)`);
});

console.log(`\n⏱️ 时间线估计 (基于内容密度):`);
console.log(`  假设平均每张幻灯片讲解时间:`);
console.log(`  - 文本密集幻灯片: 60-90秒`);
console.log(`  - 中等内容幻灯片: 30-60秒`);
console.log(`  - 视觉道具幻灯片: 15-30秒`);

let estimatedTotalTime = 0;
slideAnalysis.forEach(slide => {
  let estTime = 30; // 默认30秒
  if (slide.charCount > 200) estTime = 60;
  if (slide.charCount > 400) estTime = 90;
  if (slide.contentType === '视觉道具') estTime = 20;
  estimatedTotalTime += estTime;
});

console.log(`  预计总讲解时间: ${Math.round(estimatedTotalTime/60)} 分钟\n`);

console.log(`🎭 话术节奏分析:`);
console.log(`  1. 开场痛点 (幻灯片1): 建立需求，引发共鸣`);
console.log(`  2. 产品演示 (幻灯片2): 视觉化证明，增强信任`);
console.log(`  3. 价格促销 (幻灯片3): 价值塑造→价格对比→限时优惠`);
console.log(`  4. 视觉道具 (幻灯片4-6): 强化记忆点，直观展示\n`);

console.log(`🔑 关键词频率:`);
const keywordFreq = {};
slideAnalysis.forEach(slide => {
  slide.keywords.forEach(keyword => {
    keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1;
  });
});

const sortedKeywords = Object.entries(keywordFreq).sort((a, b) => b[1] - a[1]);
sortedKeywords.forEach(([keyword, count]) => {
  console.log(`  ${keyword}: ${count} 次`);
});

console.log(`\n📋 详细幻灯片分析:`);
slideAnalysis.forEach(slide => {
  console.log(`\n  幻灯片 ${slide.slideNum}:`);
  console.log(`    类型: ${slide.contentType}`);
  console.log(`    文本量: ${slide.charCount} 字符, ${slide.wordCount} 词`);
  console.log(`    关键词: ${slide.keywords.join(', ') || '(无)'}`);
  console.log(`    预览: ${slide.textPreview}`);
});

// 保存报告到文件
const report = `
PPT结构分析报告
生成时间: ${new Date().toLocaleString('zh-CN')}

${console.log.toString().match(/[\s\S]*/)?.[0] || ''}
`;

const reportPath = path.join(__dirname, 'PPT结构分析报告.txt');
fs.writeFileSync(reportPath, report, 'utf8');
console.log(`\n📄 报告已保存到: ${reportPath}`);