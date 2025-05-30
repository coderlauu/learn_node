// 文件 IO 读写
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// __dirname 是在commonjs规范下的变量
// import.meta.dirname 是在es规范下的变量

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const filePath = __dirname + "/package.json";
// const content = fs.readFileSync(filePath, "utf-8"); // 读文件
const content = fs.readdirSync(__dirname); // 读目录
console.log("content: ", content);
