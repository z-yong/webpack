// 所有配置项
var webpack = require('webpack')//引入打包工具
var HtmlWebpackPlugin = require('html-webpack-plugin')//自动生成html插件
var MiniCssExtractPlugin = require('mini-css-extract-plugin');//分离css文件的模块
var { CleanWebpackPlugin } = require('clean-webpack-plugin');//清除插件(每次打包之前自动清除上一次打包文件)
var VueLoaderPlugin = require('vue-loader/lib/plugin');//vue加载器插件 需要 npm install -D vue-loader vue-template-compiler
var CopyWebpackPlugin = require('copy-webpack-plugin')//拷贝插件
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')//压缩css插件
var autoprefixer = require('autoprefixer')//解析CSS文件并且添加浏览器前缀到CSS规则里
var px2rem = require('postcss-px2rem')//转换px为rem的插件
var merge = require('webpack-merge')//配置合并方法
var fs = require('fs')//导入文件系统

var util = require('./util.js')
var configUser = util.getConfig()

var entrys = {}; //用于多入口
var htmlWebpackPluginList = []; //处理自动生成html插件

var fileList = fs.readdirSync(util.getSrcPath())//拿到src文件下的紧邻文件夹名
fileList.map(item => {
    if(item == 'common') return
    entrys[item] = util.getSrcPath(item+'/entry/main.js')
    var template = fs.existsSync(util.getSrcPath(item+'/entry/index.html')) ? util.getSrcPath(item+'/entry/index.html') : util.getSrcPath('common/entry/index.html')
    var filename = configUser.root ? configUser.root.substring(1) + '/entry/' + item + '.html' : 'entry/' + item + '.html'
    htmlWebpackPluginList.push( //一个入口一个html
        new HtmlWebpackPlugin({
            template,
            filename,
            chunks: [item]
            // chunks: ['vendor', item]//将指定的vendor.js文件引入到对应的html中
        })
    )
})

// scss,css共用配置 及 postcss 插件设置
var PostCssPlugins = [autoprefixer()]
configUser.px2rem && PostCssPlugins.push(
    px2rem({ remUnit: configUser.px2rem })
)
var Mode = {
    'dev': 'development',
    'test': 'production',
    'pro': 'production',
}[process.env.NODE_ENV] || 'production'

// css及less scss公共配置
var cssOptions = [
    configUser.cssFile ? 
    { loader: MiniCssExtractPlugin.loader } :
    'vue-style-loader',
    {
        loader: 'css-loader',
        // options: { //压缩css 可能是版本原因 解开会报错
        //     minimize: Mode == 'production'
        // }
    },
    {
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: PostCssPlugins
        }
    }
]

var config = {
    mode: Mode,
    devtool: Mode === 'development' ? 'cheap-module-eval-source-map' : 'none',
    // 打包入口 --> 从哪个文件开始打包
    entry: entrys, // 注意这里的文件路径是从根目录开始找
    // 打包出口
    output: {
        // 打包输出的目录(输出的目录必须是一个绝对路径)
        path: util.getDistPath(),
        // 打包后生成的文件名
        // 开发环境下无法使用contenthash
        // 使用hash 其js文件隐藏 
        filename: Mode === 'development' ? 'static/chunk/js/[name].[hash:6].js' : 'static/chunk/js/[name].[contenthash:6].js',
        chunkFilename: Mode === 'development' ? 'static/chunk/js/[name].[hash:6].js' : 'static/chunk/js/[name].[contenthash:6].js',
        publicPath: configUser.cdnUrl.endsWith('/') ? configUser.cdnUrl : configUser.cdnUrl + '/',
    },
    // 模块加载规则
    // webpack只认识js和json文件, 如果希望打包处理其他文件,则需要配置对应loader(加载器)
    module: {
        rules: [
            {   //配置css文件解析
                test: /\.css$/,
                // 处理顺序: 从右往左 从后往前
                // style-loader是通过动态创建style标签的方式,让解析后的css内容能够作用到页面中
                // css-loader是让webpack能够识别并解析css文件
                // use: [ 'style-loader', 'css-loader' ]//不分离css文件
                use: cssOptions,
            },
            {
                test: /\.scss$/,
                use: cssOptions.concat([
                    'sass-loader',
                    { //引入公用的scss文件 在任何vue文件中使用其scss类都可解析,无需再引入
                        loader: 'sass-resources-loader',
                        options: {
                            resources: [util.getSrcPath('common/assets/css/common.scss')]
                        }
                    }
                ]),
            },
            {//配置less文件解析
                test: /\.less$/,
                use: cssOptions.concat([
                    'less-loader'
                ])
            },
            {//配置图片文件解析
                test: /\.(png|jpeg|jpg|gif|svg|eot|svg|ttf|woff|woff2)$/i,
                // 图片默认转成base64格式 如果不配置options
                // 好处: 浏览器不会发起请求,可以直接读取
                // 坏处: 如果图片过大,再传base64就会让图片的体积增加30%左右,得不偿失
                // 配置options中的limit可以解决这个问题
                use: [
                    {
                        loader: 'url-loader',
                        // 8k以内的图片默认转成base64格式, 大于8kb的图片单独文件请求
                        options: {
                            // limit: 8*1024,
                            limit: 1,
                            // 配置输出的文件名
                            name: 'static/chunk/assets/[name].[hash:6].[ext]'
                            // name: '[name].[ext]',//图片名是什么就是什么,后缀是什么就是什么
                            //引用路径
                            // publicPath: '../image/',
                            // // 输出文件目录
                            // outputPath: 'image/'
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
            },
            // 配置vue加载规则
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    // 配置插件
    plugins: [
        //生成css文件
        new MiniCssExtractPlugin({
            // 一般css文件用到contenthash 只要文件内容不同 哈希值则不同 起到缓存作用
            filename: 'static/css/[name].[contenthash:6].css',
            chunkFilename: 'static/css/[name].[contenthash:6].css',
        }),
        // 清空编译目录 (不要看启动时dist目录没有消失 其实已经删除了可以通过内部文件观察)
        new CleanWebpackPlugin(),
        //引入vue加载器插件
        new VueLoaderPlugin(), 
        // 定义环境变量 可直接在页面使用
        new webpack.DefinePlugin({
            BASE_URL: JSON.stringify(configUser.baseUrl),
            CDN_URL: JSON.stringify(configUser.cdnUrl),
            ENV: JSON.stringify(process.env.NODE_ENV),
            TITLE: JSON.stringify(util.getConfig().title)
        }),
         // 拷贝静态文件
        new CopyWebpackPlugin({
            patterns: [{
                from: util.getSrcPath('common/public'),
                to: util.getDistPath()
            }]
        }),
        // 压缩css
        new OptimizeCssAssetsPlugin()
    ].concat(htmlWebpackPluginList),

    // 代码分割
    optimization: {
        splitChunks: {
            cacheGroups: {//设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
                commons: {
                    chunks: 'initial',
                    minChunks: 5,
                    maxInitialRequests: 5,
                    minSize: 0 //表示在压缩前的最小模块大小,默认值是30kb
                },
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 1,
                    enforce: true
                },
                element: {
                    test: /element/,
                    chunks: 'initial',
                    name: 'element',
                    priority: 2,
                    enforce: true
                }
            }
        },
    },
    // 简写配置
    resolve:{
        extensions:['.js', '.jsx', '.json', '.vue'],//这几个后缀名的文件后缀可以省略不写
        alias:{
            '@': util.getSrcPath(),//@就表示根目录src这个路径
            '@common': util.getSrcPath('common'),//@common就表示根目录src/common这个路径
            '@home': util.getSrcPath('home'),
            '@second': util.getSrcPath('second'),
            '@img': util.getSrcPath('common/assets/img'),
            '@components': util.getSrcPath('common/components'),
        }
    }
}

// 当前环境为dev时
if(process.env.NODE_ENV === 'dev'){
    var proxys = {}
    for(key in configUser.proxy){
         var item = {
            target: configUser.proxy[key], //要代理的域名
            ws: true, //是否启用websockets
            //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，
            //这样服务端和服务端进行数据的交互就不会有跨域问题
            changeOrigin: true,//为true时发送请求头中host会设置成target
            logLevel: 'debug', //开启代理输出日志
            //只有接口才会需要被代理 静态文件图片,css等不需要代理,所以此时就需要一个标识key
            // 而如果希望省事 而key又不能为空 那么pathRewrite的作用就是将这个标识转化为空
            // 这样既能有了key标识 又不会代理到静态文件
            pathRewrite: {} 
        }
        item.pathRewrite['^'+key] = '';
        proxys[key] = item
    }
    // 主机和端口
    var host = configUser.host || '0.0.0.0'
    var port = configUser.port || 80
    config = merge(config, {
        devServer: {
            proxy: proxys,
            // app拦截请求 如果配置了mock则使用mock
            before: app => {
                configUser.mock && require('./mock')(app)
            },
            open: configUser.open,//是否自动启动浏览器
            host: host,//指定ip 如果为0.0.0.0 那么127.0.0.1,localhost以及本地ip地址都能访问
            port: port,//指定端口号
            //contentBase代表html页面所在的相对目录，从何处提供内容
            //如果不配置，devServer默认html所在的目录就是项目的根目录
            contentBase: util.getDistPath(),//默认项目根目录
            // 启用noInfo后，启动时和每次保存之后，
            // 那些显示的 webpack 包(bundle)信息的消息将被隐藏。错误和警告仍然会显示。
            noInfo: util.getConfig().noInfo,
            // 热更新
            hot: configUser.hot,
            // 编译出错的时候，在浏览器页面上显示错误，默认是false
            overlay: true,
            // 出错时终端只打印错误信息 不会输出不重要的文件
            // 且报错时颜色不是红色那么显著
            stats: "errors-only",
            // 是否关闭用于 DNS 重绑定的 HTTP 请求的 HOST 检查
            // DevServer 默认只接受来自本地的请求，关闭后可以接受来自任何 HOST 的请求。 
            // 它通常用于搭配--host 0.0.0.0使用，因为你想要其它设备访问你本地的服务，
            // 但访问时是直接通过 IP 地址访问而不是 HOST 访问，所以需要关闭 HOST 检查
            // 但注意的是 必须是同一局域网且至少有一台是宽带连接
            disableHostCheck: true,
            // 配置在客户端的日志等级，这会影响到你在浏览器开发者工具控制台里看到的日志内容。
            // clientLogLevel是枚举类型，可取如下之一的值none | error | warning | info。 
            // 默认为info级别，即输出所有类型的日志，设置成none可以不输出任何日志
            clientLogLevel: 'info',
            watchOptions: {
                // 每300毫秒检查一次变动
                poll: 300,
                // 当第一个文件更改，会在重新构建前增加延迟。
                // 这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里。以毫秒为单位
                aggregateTimeout: 500,
                ignored: /node_modules/ //排除监听文件 可以是数组形式
            },
        }
    })
}

module.exports = config