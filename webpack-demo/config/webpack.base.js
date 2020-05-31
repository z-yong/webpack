// 开发与生产的公共配置:
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')//引入自动生成html插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//引入分离css文件的模块
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//导入清除插件(每次打包之前自动清除上一次打包文件)

module.exports = {
    // 打包入口 --> 从哪个文件开始打包
    // 注意这里的文件路径是从根目录开始找
    entry: './src/main.js',
    // 打包出口
    output: {
        // 打包输出的目录(输出的目录必须是一个绝对路径)
        // __dirname指的是当前文件所在的文件夹
        path: path.join(__dirname, '../dist'),
        // 打包后生成的文件名
        filename: 'js/bundle.js'
    },
    // 模块加载规则
    // webpack只认识js和json文件, 如果希望打包处理其他文件,则需要配置对应loader(加载器)
    module: {
        rules: [
            {//配置css文件解析
                test: /\.css$/,
                // 处理顺序:从右往左
                // style-loader是通过动态创建style标签的方式,让解析后的css内容能够作用到页面中
                // css-loader是让webpack能够识别并解析css文件
                // use: [ 'style-loader', 'css-loader' ]//不分离css文件
                use: [{//分离css文件
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // 文件引用路径
                        publicPath: '../'
                    } 
                }, 'css-loader' ]
            },
            {//配置less文件解析
                test: /\.less$/,
                // use: ['style-loader', 'css-loader','less-loader']//不分离less文件
                use: [{//分离css文件
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        //文件引用路径
                        publicPath: '../'
                    }
                } , 'css-loader','less-loader']
            },
            {//配置图片文件解析
                test: /.(png|jpg|gif)$/i,
                // 图片默认转成base64格式 如果不配置options
                // 好处: 浏览器不会发起请求,可以直接读取
                // 坏处: 如果图片过大,再传base64就会让图片的体积增加30%左右,得不偿失
                // 配置options中的limit可以解决这个问题
                use: [
                    {
                        loader: 'url-loader',
                        // 8k以内的图片默认转成base64格式, 大于8kb的图片单独文件请求
                        options: {
                            limit: 8*1024,
                            // 配置输入的文件名
                            name: '[name].[ext]',//图片名是什么就是什么,后缀是什么就是什么
                            //引用路径
                            publicPath: '../image/',
                            // 输出文件目录
                            outputPath: 'image/'
                        }
                    }
                ]
            },
            {//配置对于高版本js的兼容性处理
                test: /\.js$/,
                exclude: /(node_modules)/, //配置排除项
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    // 配置插件
    plugins: [
        new HtmlWebpackPlugin({template: './public/index.html'}),//处理自动生成html插件
        new MiniCssExtractPlugin({filename: 'css/index.css'}),//分离css插件
        new CleanWebpackPlugin(),//分离css插件清除打包目录插件
    ]
}