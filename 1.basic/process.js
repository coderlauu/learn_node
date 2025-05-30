/**
 * process：进程使用场景
 * 1、获取命令行参数，process.argv
 * 2、获取系统信息，process.platform
 * 3、获取当前工作目录，process.cwd()
 * 4、获取当前进程的PID，process.pid
 * 5、获取当前进程的CPU使用情况，process.cpuUsage()
 * 
 */
process.env.SAAS = 'jp' // 只会在此项目中出现，不会出现在系统的环境变量中
// console.log(process.argv, process);


/**
 * 主进程派生出来的，用于独立执行任务的进程：并发任务、CPU密集型任务
 * child_process：子进程使用场景
 * 1、执行shell命令或外部程序，child_process.exec()
 * 2、大文件压缩、图片处理等流式传输数据，通过spawn()，创建子进程，将这些任务移交给子进程处理，防止阻塞主线程
 * 3、父进程与子进程之间通信，使用child_process.fork()
 */

// 1、执行shell命令或外部程序，列出当前目录下的文件
// const { exec } = require('child_process')

const command = process.platform === 'win32' ? 'dir' : 'ls';
// exec(command, (error, stdout, stderr) => {
//     if (error) {
//         console.error('执行失败', error);
//         return;
//     }
//     console.log('执行成功', stdout);
// })

// 2、spawn()示例
// const { spawn } = require('child_process')

// // 创建子进程
// const args = process.platform === 'win32' ? [] : ['-lh']
// const ls = spawn(command, args, {
//     shell: true
// })

// // 子进程的标准输出
// ls.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// })

// // 子进程的标准错误
// ls.stderr.on('error', (data) => {
//     console.error(`stderr: ${data}`);
// })

// // 子进程退出
// ls.on('close', (code) => {
//     console.log(`子进程退出，退出码：${code}`);
// })

// 3、创建子进程，给子进程发送消息
const { fork } = require('child_process')

// 执行子文件
const child = fork('./child_process.js')

// 父进程发送消息给子进程
child.send('Hello, child process!')

// 接收子进程发来的消息
child.on('message', (msg) => {
    console.log('父进程收到消息', msg);

    setTimeout(() => {
        process.exit(0)
    }, 1500);
})

child.on('close', (code) => {
    console.log('子进程已关闭', code);
})


/**
 * cluster：同child_process一样，用于管理进程，在管理子进程、处理多核并发任务重要作用
 * 区别：
 * - child_process: 创建(exec、spawn、fork、execFile)和控制子进程，可以执行系统命令、shell脚本、启动其他node进程，
 * - cluster: 专注于利用多核CPU提高node并发性能，它是集群：通过child_process创建的子进程（称为工作进程或worker），这些进程共享同一个服务器端口，实现负载均衡
 */
