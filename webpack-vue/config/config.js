module.exports = {
    dev: {
        // 本地server的host，为空时默认自动获取本机ip
        host: 'localhost',
        // 标题
        title: '多入口项目',
        // 本地server端口
        port: 3000,
        // 代理配置
        proxy: {
            '/api': 'http://m.91qycl.com',
            // '/api': 'http://10.1.202.62:9966's,
        },
        // 用于接口路径拼接
        baseUrl: '/api',
        cdnUrl: '',
        // mock数据请求前辍,请在/mock中配置json数据，不启用请设为false
        mock: '/api/mock',
        // 是否启用热更新
        hot: true,
        // 打包输出目录
        dist: '../dist',
        // 是否将vue文件中的css提取到单独css文件中
        cssFile: false,
        // 是否启动即打开浏览器
        open: false
    },
    test: {

    },
    pro: {
        
    },
    base: {
        // 根url，于ajax请求路径前辍定义
        baseUrl: '',
        // cnd地址，同output.publicPath
        cdnUrl: '',
        // 打包输出目录
        dist: '../dist',
        // 是否将vue文件中的css提取到单独css文件中
        cssFile: true,
        // px2rem自动转换, 如 100px => 1rem
        px2rem: 100,
        // 入口页路径
        root: '',
        // 自定义环境变量，使用process.env.NAME访问
        env: {},
        // 标题
        title: '多入口项目',
        // 启用noInfo后，启动时和每次保存之后会隐藏webpack输出日志,错误和警告仍然会显示。
        noInfo: true
    }
}