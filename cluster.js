/**
 * 负载均衡：
 * 1. 将请求分发到多个工作进程，避免单个进程过载
 * 2.创建一个主进程和多个工作进程，主进程负责监听端口，接收请求，并将请求分发给工作进程处理
 */
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

console.log('当前机器的CPU核数：', numCPUs);
// console.log('cluster', cluster);

if (cluster.isMaster) {
    // 创建工作进程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker) => {
        console.log(`工作进程${worker.process.pid}已退出, 重新启动...`);
        cluster.fork()
    })
} else {
    // 在每个工作进程中启动服务器
    http.createServer((req, res) => {
        res.writeHead(200)
        res.end('Hello World\n')
    }).listen(8000)
}