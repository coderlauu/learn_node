/**
 * 如何在Nodejs中进行流量控制和防止DDOS攻击
 * 
 * 1. 使用express框架
 * 2. 使用express-rate-limit中间件
 *  - 实现原理：限制单位时间内同一IP地址或用户的请求数量，从而防止大量请求压垮服务器
 *  - 可以结合Redis或内存存储来跟踪每个用户的请求次数，当超过预设的限额时，返回429状态码（Too Many Requests）
 * 
 */
const rateLimit = require('express-rate-limit');

// 创建流量限制中间件
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP最多100次请求
    message: '请求次数过多，请稍后再试'
})

// app.use(limiter)
