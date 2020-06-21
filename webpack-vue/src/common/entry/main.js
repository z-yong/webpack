import Vue from 'Vue'
import App from './app'
import router from './router'
import store from '../store'

//引入公共css
import '@common/assets/css/common.css'
import '@common/assets/css/z-main.css'

import ajax from '@common/service/ajax'
Vue.prototype.$http = ajax
// 引入公共组件
import Toast from '@components/pub-toast'
Vue.use(Toast)

// 实例化
export default coverRouter => {
    return new Vue({
        router: router(coverRouter),
        store,
        render: h => h(App)
    }).$mount('#app')
}