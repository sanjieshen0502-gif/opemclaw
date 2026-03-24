const pptx = require('pptx');
const fs = require('fs');
const path = require('path');

const pptxPath = path.join(__dirname, '..', 'Desktop', '美的文件', '美的净水器逐字稿（互动版）修改版.pptx');
console.log('Reading PPTX from:', pptxPath);

// Check if file exists
if (!fs.existsSync(pptxPath)) {
    console.error('File not found:', pptxPath);
    process.exit(1);
}

// Read the PPTX file
try {
    const presentation = new pptx.Presentation();
    presentation.load(pptxPath).then(() => {
        console.log('Number of slides:', presentation.slides.length);
        presentation.slides.forEach((slide, index) => {
            console.log(`\n=== Slide ${index + 1} ===`);
            // Extract text from slide
            const text = slide.getText();
            console.log('Text:', text);
        });
    }).catch(err => {
        console.error('Error reading PPTX:', err);
    });
} catch (err) {
    console.error('Error:', err);
}