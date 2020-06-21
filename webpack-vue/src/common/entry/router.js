import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '@home/page/Index.vue'


Vue.use(VueRouter)

var Router = {
    Index
}
export default coverRouter => {
    // 路由覆盖
    Router = {
        ...Router,
        ...coverRouter
    }
    const routes = [
        {
            path: '/',
            name: 'Index',
            component: Router.Index
        }
    ]

    // 路由实例化
    const router = new VueRouter({
        routes,
        linkActiveClass: 'active',
        linkExactActiveClass: 'active',
    })
 
    // 拦截路由判断是否登录
    // router.beforeEach((to, from, next) => {
    //     window.scrollTo(0, 0)
    //     const loginUser = store.getters.loginUser
    //     if (to.meta.auth !== true)
    //         return next()
    //             // 判断是否登录 
    //     if (loginUser) return next()
    //     return next({
    //         path: '/login',
    //         query: { 
    //             url: to.fullPath
    //         }
    //     })
    // })
    return router
}