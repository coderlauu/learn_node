/**
 * 手动实现WebSocket
 * 1. 创建http服务器： 使用内置的http模块创建
 * 2. 处理websocket握手： 处理Websocket协议中的握手请求
 * 3. 管理websocket数据帧： 根据websocket协议处理客户端和服务器之间的通信帧
 */
const http = require('http');
const crypto = require('crypto');
const WebSocket = require('ws');

// 创建http服务器
const server = http.createServer((req, res) => {
    // 不处理常规的HTTP请求
    res.writeHead(400)
    res.end('Not a websocket request')
});

// 监听Upgrade事件，处理WebSocket协议升级
server.on('upgrade', (req, socket, head) => {
    // 检查请求头中的websocket协议升级字段
    if (req.headers['upgrade'] !== 'websocket') {
        socket.write('HTTP/1.1 400 Bad Request\r\n')
        socket.destroy()
        return
    }

    // 获取websocket握手所需的key
    const websocketKey = req.headers('sec-websocket-key')
    const acceptKey = generateAcceptValue(websocketKey) // Base64编码的随机值，由服务器用于计算响应的Sec-WebSocket-Accept

    // 构建websocket握手响应头
    const responseHeaders = [
        'HTTP/1.1 101 Switching Protocols', // HTTP状态码，表明协议正在切换
        'Upgrade: websocket', // 告诉服务器希望升级协议到WebSocket
        'Connection: Upgrade', // 标记为升级连接
        `Sec-WebSocket-Accept: ${acceptKey}`,  // 根据客户端的Sec-WebSocket-Key计算得出的Base64编码字符串，表明握手成功
        '\r\n'
    ]

    socket.write(responseHeaders.join('\r\n'))

    // 监听和发送websocket数据帧
    socket.on('data', (buffer) => {
        const message = parseWebsocketMessage(buffer)
        console.log('Received message from client:', message);

        // 发送消息给客户端
        socket.write(constructReply(message))
    })

    socket.on('close', () => {
        console.log('Client disconnected');
    })

    // 监听错误事件
    socket.on('error', (error) => {
        console.error('WebSocket error:', error);
    })
})

// 生成websocket握手响应的 Sec-WebSocket-Accept 值
function generateAcceptValue(websocketKey) {
    return crypto.createHash('sha1').update(websocketKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64')
}

// 解析websocket数据帧
function parseWebsocketMessage(buffer) {
    const opcode = buffer[0] & 0x0f
    const isFin = (buffer[0] & 0x80) !== 0
    const isMasked = (buffer[1] & 0x80) !== 0

    // 提取消息内容
    const payload = buffer.slice(2)

    // 如果消息被掩码，则解码
    if (isMasked) {
        const mask = payload.slice(0, 4)
        const decoded = Buffer.alloc(payload.length - 4)
        for (let i = 0; i < payload.length - 4; i++) {
            decoded[i] = payload[i] ^ mask[i % 4]
        }
        return decoded.toString()
    }
    return payload.toString()
}

// 构造websocket消息回复
function constructReply(message) {
    const buffer = Buffer.from(message)
    const frame = Buffer.alloc(2 + buffer.length)

    // 0X81表示文本帧（FIN + 1表示文本帧）
    frame[0] = 0X81
    frame[1] = message.length
    // 将消息内容复制到帧中
    message.copy(frame, 2)

    return frame
}

// 启动服务器
const PORT = 8080

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


// 1、http升级：
// 服务器监听upgrade事件以处理Websocket握手请求
// 2、解析websocket数据帧：
// websocket使用自定义的帧格式，服务器接受客户端消息后需要解码帧，使用XOR掩码解码数据内容
// 3、发送Websocket响应帧：
// 服务器通过构建符合Websocket协议的数据帧，返回消息给客户端

/**
 * 握手解析
 * - 当客户端发起连接时，服务器通过监听upgrade事件响应协议升级请求
 * - 在协议升级时，服务器使用Sec-WebSocket-Key和XXXX固定字符串生成一个Base64编码的SHA1哈希，作为Sec-WebSocket-Accept头的值
 * - 握手成功后，服务器将升级连接，并准备处理WebSocket数据帧
 */

/**
 * WebSocket数据帧格式
 * WebSocket的数据通信是通过帧来进行的，每一帧都包含了如下字段：
 * - FIN： 标志帧是否是消息的最后一帧
 * - Opcode： 定义了数据的类型，如文本帧、二进制帧等
 * - Mask：掩码标志，客户端发送给服务器的数据必须进行掩码处理
 * - Payload：实际传输的数据
 */

/**
 * 通过http模块直接实现WebSocket服务器，涉及到了：
 * 1、websocket握手机制：使用http协议完成初始的握手，并通过升级协议从http转为websocket
 * 2、TCP长连接：websocket在http握手后，建立在单个TCP连接上，实现全双工通信
 * 3、websocket数据帧协议：通过帧的结构定义消息传输的格式，服务器需解析和处理这些帧
 */