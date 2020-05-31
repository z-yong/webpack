// production 生产环境配置:

// 导入公共配置
const base = require('./webpack.base.js')

// 导入用于合并的包
const merge = require('webpack-merge')

// 导出生产环境的配置
// merge方法可以传入多个参数,会将多个参数合并成一个对象
// 如果有重复的属性名,后面的对象属性会覆盖掉前面的
module.exports = merge(base, {
    // 模式 development未压缩, production压缩
    mode: 'production'
})