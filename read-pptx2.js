const { readPptx } = require('./extensions/pptx/index.js');
const path = require('path');

const pptxPath = path.join(__dirname, '..', 'Desktop', '美的文件', '美的净水器逐字稿（互动版）修改版.pptx');
console.log('Reading PPTX from:', pptxPath);

readPptx(pptxPath).then(result => {
    console.log('Success:', JSON.stringify(result, null, 2));
}).catch(err => {
    console.error('Error:', err);
});