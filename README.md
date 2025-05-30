## Node.js

Nodejs 是跨平台的 js 运行时环境，nodejs 也是基于 Google 的 V8 引擎，使得其在浏览器之外也可以运行 js

### Nodejs 特点

- 异步非阻塞
  ... 见课件

## Node 项目初始化与基础开发

1. package.json

- npm init - npm init -y 2.项目工程模块化
- 默认 nodejs 是 commonjs 规范，如果想用 esmodule，则在 package.json 中的 `type` 改为 "module"

commonjs 与 esmodule 的区别

- commonjs：它是运行时的，意味着只有在运行的时候才会加载；require 是同步的，模块会在需要时同步加载；它有·模块缓存·，多次 require 同一个模块时，模块只会被加载一次
- esModule：它是编译时的，意味着编译阶段就能确定模块依赖；支持异步加载(懒加载)；不允许动态导入或到处；

如何选择？

- commonjs：比较旧了，兼容旧 nodejs(v12 之前)，以及旧的依赖
- esmodule：新项目推荐使用

### 入口文件

- main -> commonjs 的入口
- module -> esm 的入口
- bin -> 二进制执行文件入口
- exports -> 暴露特别模块
- types -> ts 类型声明文件

## typescript 支持

<!-- /packages/cli/package.json -->

```
  "main": "dist/index.js",
  "module": "esm/index.js",
  "types": "dist/type/index.d.ts",
  "bin": {
    "mmts": "bin/mmts"
  },
  "exports": {
    ".": {
      "import": "./esm/index.js",
      "require": "./dist/index.js"
    },
    "./package.json": "./package.json",
    "./styles.css": "./styles.css"  // 在apps/demo中这样使用： import '@miaoma-demo/cli/styles.css'
  },
```

<!-- /apps/demo/package.json -->

```
  "dependencies": {
    "@miaoma-demo/cli": "workspace:*"  // key名必须与 `/packages/cli/package.json` 中的name一样
  }
```

## 内置模块

### node:path

- path.join(): 将多个路径拼接成一个路径
- path.resolve(): 将相对路径解析为绝对路径
- path.basename(): 返回路径的最后一部分（文件名）
- path.dirname(): 返回路径的目录部分
- path.extname(): 返回文件的扩展名

### node:os 模块

- os.arch() 返回操作系统的架构（如 x64）
- os.platform() 返回操作系统的平台（如 win32、linux、 darwin）
- os.cpus 返回 cpu 信息
- os.freemem() 返回可用系统内存
- os.totalmem() 返回系统总内存
- os.homedir() 返回当前用户的主目录
- os.uptime() 返回系统运行时间（秒）

### process 模块

-
