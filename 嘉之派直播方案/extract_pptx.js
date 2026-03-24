const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const inboundDir = "C:\\Users\\Komorebi\\.openclaw\\media\\inbound";
const outputDir = "C:\\Users\\Komorebi\\.openclaw\\workspace\\嘉之派直播方案";

// Find PPTX file
let pptxFile = null;
const files = fs.readdirSync(inboundDir);
for (const f of files) {
    if (f.endsWith('.pptx') && f.includes('美的')) {
        pptxFile = path.join(inboundDir, f);
        break;
    }
}

if (!pptxFile) {
    const pptxFiles = files.filter(f => f.endsWith('.pptx'));
    if (pptxFiles.length > 0) {
        // Get most recent
        pptxFiles.sort((a, b) => {
            const statA = fs.statSync(path.join(inboundDir, a));
            const statB = fs.statSync(path.join(inboundDir, b));
            return statB.mtime - statA.mtime;
        });
        pptxFile = path.join(inboundDir, pptxFiles[0]);
    }
}

if (!pptxFile || !fs.existsSync(pptxFile)) {
    console.log('未找到PPTX文件');
    process.exit(1);
}

console.log('读取文件:', pptxFile);

const data = fs.readFileSync(pptxFile);
JSZip.loadAsync(data).then(zip => {
    const textContent = [];
    const slideFiles = Object.keys(zip.files).filter(f => f.match(/ppt\/slides\/slide\d+\.xml$/));
    
    slideFiles.sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)\.xml/)[1]);
        const numB = parseInt(b.match(/slide(\d+)\.xml/)[1]);
        return numA - numB;
    });
    
    const promises = slideFiles.map(slideFile => {
        return zip.files[slideFile].async('string').then(content => {
            // Extract text from XML
            const matches = content.match(/<a:t>([^<]*)<\/a:t>/g);
            if (matches) {
                const texts = matches.map(m => m.replace(/<a:t>|<\/a:t>/g, '').trim()).filter(t => t);
                if (texts.length > 0) {
                    const slideNum = slideFile.match(/slide(\d+)\.xml/)[1];
                    return `=== 第${slideNum}页 ===\n${texts.join('\n')}`;
                }
            }
            return null;
        });
    });
    
    Promise.all(promises).then(results => {
        const fullText = results.filter(r => r).join('\n\n');
        
        const outputFile = path.join(outputDir, '话术01_美的净水器脚本.md');
        const mdContent = `# 话术01：美的净水器直播脚本\n_来源：${path.basename(pptxFile)}\n_提取时间：2026-03-24_\n\n---\n\n${fullText}`;
        
        fs.writeFileSync(outputFile, mdContent, 'utf8');
        console.log('已保存到:', outputFile);
        console.log('\n========== 内容预览 ==========\n');
        console.log(fullText);
    });
});
