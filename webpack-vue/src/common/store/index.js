import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        // 登录用户
        loginUser: '',
        // 搜索历史
        searchKey: null,
        // 图片上传大小 
        uploadImageSize: 0,
        // 是否已登录
        isLogin: false,
        // 背景音主播信息
        makeParams: '',
    },
    getters: {
        // 获取已登录用户 
        loginUser(state) {
            if (state.loginUser) return state.loginUser
        },
        // 获取搜索历史
        searchKey(state) {
            if (state.searchKey) return state.searchKey
        },
        // 获取上传图片最大体积/M
        uploadImageSize(state) {
            if (state.uploadImageSize) return state.uploadImageSize
            if (data) {
                state.uploadImageSize = parseFloat(data)
            }
            return state.uploadImageSize || 10
        },
        // 是否登录
        isLogin(state) {
            if (state.isLogin) return true
            return false
        },
        // makeParams
        makeParams(state) {
            return state.makeParams
        }
    },
    mutations: {
        // 设置搜索历史
        searchKey(state, data) {
            state.searchKey = data
        },
        // 设置当前登录用户
        isLogin(state, data) {
            state.isLogin = data
        },
        // 设置当前登录用户
        loginUser(state, data) {
            if (data) {
                data.photo = CDN_URL + '/static/image/user/01.svg'
            }
            state.loginUser = data
        },
        // 设置上传图片体积
        uploadImageSize(state, data) {
            state.uploadImageSize = parseFloat(data)
        }
    },
})

export default store