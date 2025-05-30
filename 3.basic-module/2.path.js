// - path.join(): 将多个路径拼接成一个路径
// - path.resolve(): 将相对路径解析为绝对路径
// - path.basename(): 返回路径的最后一部分（文件名）
// - path.dirname(): 返回路径的目录部分
// - path.extname(): 返回文件的扩展名

import path from "node:path";

const filePath = path.join("./", "./1.fs.js");
console.log("join=>", filePath);

const filePath2 = path.resolve("./", "./1.fs.js");
console.log("resolve=>", filePath2);

const filePath3 = path.basename(filePath2);
console.log("basename=>", filePath3);

const filePath4 = path.dirname(filePath2);
console.log("dirname=>", filePath4);

const filePath5 = path.extname(filePath2);
console.log("extname=>", filePath5);
