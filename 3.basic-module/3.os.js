// - os.arch() 返回操作系统的架构（如 x64）
// - os.platform() 返回操作系统的平台（如 win32、linux、 darwin(mac)）
// - os.cpus 返回 cpu 信息
// - os.freemem() 返回可用系统内存
// - os.totalmem() 返回系统总内存
// - os.homedir() 返回当前用户的主目录
// - os.uptime() 返回系统运行时间（秒）

import os from "node:os";

console.log("arch=>", os.arch());
console.log("platform=>", os.platform());
console.log("cpus=>", os.cpus(), os.cpus().length);
console.log("freemem=>", os.freemem() / 1024 / 1024 / 1024 + "GB");
console.log("totalmem=>", os.totalmem() / 1024 / 1024 / 1024 + "GB");
console.log("homedir=>", os.homedir());
console.log("uptime=>", os.uptime());
