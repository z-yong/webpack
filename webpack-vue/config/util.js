const path = require('path')
const config = require('./config.js')

module.exports = {
    // 从config 获取不同环境 的用户配置 
    getConfig(env){
        env = env || process.env.NODE_ENV || 'dev'
        return Object.assign({}, config.base, config[env] || {})
    },

    // src目录
    getSrcPath(dir=''){
        return path.resolve(__dirname, '../src', dir)
    },

    // 打包目录
    getDistPath(dir=''){
        var folder = this.getConfig().dist
        return path.resolve(__dirname, folder, dir);
    },

     // 项目根路径
     rootResolve(dir = '') {
        return path.resolve(__dirname, '..', dir);
    },
    // 获取本机ip
    getLocalIp() {
        var os = require("os");
        var networkInterfaces = os.networkInterfaces()
        let ip = localIp = '127.0.0.1'
        Object.keys(networkInterfaces).forEach(key => {
            let items = networkInterfaces[key]
            if (ip !== localIp) return
            for (var i in items) {
                var self = items[i]
                if (self.address && (self.address.match(/^(192\.168\.)|(10\.1\.)/))) {
                    ip = self.address
                    return false
                }
            }
        })
        return ip
    }
}