/**
 * http模块
 */

/**
 * 1、http.createServer([options][, requestListener])
 * options: 提供服务器配置（可选），允许指定HTTP/1.1、HTTP/2等协议
 * requestListener: 处理请求的回调函数，当有请求时，会调用该函数
 */
const http = require('http')

const server = http.createServer((req, res) => {
    // req：请求详细信息，URL、HTTP方法、请求头等
    // res：响应客户端请求，可设置状态码、响应头及响应体；
    // res.writeHead(statusCode) 设置状态码和头部信息
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello World\n')
})

server.listen(3000, () => {
    console.log('Server is running on port 3000');
})
