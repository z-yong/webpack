/**
 * webpack 执行环境统一入口
 */
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const util = require('./util.js')

// 根据命令参数加载不同环境配置
const argEnv = process.env.NODE_ENV = process.argv[2]
const configUser = util.getConfig()
let webpackConfig = require('./env.js')
// webpack 编译
let compileStart = Date.now()
let compileCount = 0

console.log(`正在编译...`)
console.log(`当前环境为：${argEnv==='dev'?'开发环境':argEnv==='test'?'测试环境':'生产环境'}`)

configUser.hot && WebpackDevServer.addDevServerEntrypoints(webpackConfig, webpackConfig.devServer)
let compiler = webpack(webpackConfig, (err, stats) => {
    if (err) throw err
    compileCount++
    var compileTime = parseInt((Date.now() - compileStart) / 1000)
    if (compileCount == 1) {
        console.log(`编译成功！耗时：${compileTime}s`)
        webpackConfig.devServer && startServer(webpackConfig.devServer)
    } else {
        console.log(`编译成功！ ${new Date().toLocaleString()}`)
    }
})

// 启动服务器
function startServer(serverConfig) {
    let server = new WebpackDevServer(compiler, serverConfig)
    console.log(`正在启动服务...`)
    server.listen(serverConfig.port, serverConfig.host, (err, stats) => {
        var url = `http://${serverConfig.host}`
        url += (serverConfig.port == 80 ? '' : `:${serverConfig.port}`)
        url = configUser.root ? (url + configUser.root) : url
        console.log(`${url.replace(util.getConfig().host,'127.0.0.1')} 已启动`)
    })
}