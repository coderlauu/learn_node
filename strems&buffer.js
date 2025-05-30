const fs = require('fs');

// const readStream = fs.createReadStream('example.txt');

// readStream.on('data', (chunk) => {
//     console.log('读取到的数据块=》', chunk);
// });

// readStream.on('end', () => {
//     console.log('end');
// })


/**
 * buffer：一次性将数据全部加载到内存，适合小数据量文件处理
 * stream：分批次读取，适合大文件处理，可读可写可双工
 */
