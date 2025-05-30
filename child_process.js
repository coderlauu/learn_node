console.log('子进程已启动');

// 接收父进程发来的消息
process.on('message', (msg) => {
    console.log('子进程收到消息', msg);

    process.send('Hello, parent process!')
})

