require('./aa')
require('./css/aa.css')
require('./css/aa.less')
// import Vue from 'vue'
console.log('打包webpack')
const fn = () => {
    console.log(123)
}
fn()
/**
 * 1.npm init --y 初始化
 * 2.安装依赖包(-D是将依赖记录成开发依赖, 实际上线不需要)
 * npm install webpack webpack-cli -D / yarn add webpack webpack-cli -D
 * 3.到package.json配置scripts
 * 4.提供webpack.config.js,进行相关配置
 * 
 * 5.自动生成html-html-webpack-plugin插件(如果webpack配置中的输出文件名修改了,需要及时在index.html中同步修改)
 * npm install html-webpack-plugin -D / yarn add html-webpack-plugin -D
 * 6.在webpack.config.js中配置插件
 * const HtmlWebpackPlugin = require('html-webpack-plugin')
 * plugins: [
        new HtmlWebpackPlugin({template: './public/index.html'})
    ]
   7.webpack默认只能识别js文件和json文件,对于css文件不能识别 所以需要使用loader加载器
   npm install style-loader css-loader -D
   在webpack.config.js中配置加载规则
   8.分离css文件
   npm install mini-css-extract-plugin
   在webpack中替换style-loader并配置规则
   9.转换less文件
   npm install less less-loader -D
   在webpack中配置规则
   10.处理图片
   npm install url-loader file-loader -D
   在webpack中配置规则
   11.清除dist目录(每次打包自动清除之前打包目录文件)
   npm install clean-webpack-plugin -D
   在webpack中配置规则
   12.配置babel --> 处理高版本js语法的兼容性
   npm install -D babel-loader @babel/core @babel/preset-env
   在webpack中配置规则
   13.自动刷新
   npm install webpack-dev-server -D
   在package.json中scripts配置 "server": "webpack-dev-server --config webpack.config.js",
   14.配置开发环境和生产环境
   npm install webpack-merge -D
   根目录新建config文件夹 分别创建webpack.base.js  webpack.dev.js  webpack.pro.js
 *  */ 
