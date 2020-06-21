import axios from 'axios'
import Vue from 'vue'
import nprogress from 'nprogress'
import store from '@common/store'

nprogress.configure({
  showSpinner: false
})

// 通用配置
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 15000,
  error: true,
}
axios.defaults.baseURL = BASE_URL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

/**
 * ajax请求
 * @param {*} opt 
 */
const ajax = async (opt) => {
  nprogress.start()
  return new Promise((resolve, reject) => {
    // 自动处理错误
    function handleError(err) {
      if (opt.error === undefined) {
        Vue.prototype.$toast(err.msg)
        if (err.code == '100001') {
          store.commit('isLogin', null)
          store.commit('loginUser', null)
          let url = '#/login'
          if (location.hash) url = url + '?url=' + location.hash.substr(1)
          location.href = url
        }
      }
      typeof opt.error == 'function' && opt.error(err)
      reject(err)
    }
    axios({
      ...config,
      ...opt,
    }).then(resp => {
      nprogress.done()
      resp.data && resp.data.fail && handleError(resp.data)
      return resolve(resp.data)
    }).catch(() => {
      nprogress.done()
      let msg = {
        fail: true,
        code: '504',
        msg: '网络出故障了~',
      }
      return handleError(msg)
    })
  })
}

/**
 * 提交get请求
 * @param {*} url 
 * @param {*} params
 * @param {*} opt 
 */
ajax.get = (url, params, opt) => {
  return ajax({
    ...opt,
    url,
    params,
    method: 'get'
  })
}

/**
 * 提交json请求
 * @param {*} url 
 * @param {*} data 
 * @param {*} opt 
 */
ajax.postJson = (url, data, opt) => {
    return post(
        url, data, opt,
        { 'Content-Type': 'application/json' }
    )
}

/**
 * ajax上传文件请求
 * @param {*} url 
 * @param {*} data 
 * @param {*} opt 
 */
ajax.postFile = (url, data, opt) => {
    return post(
        url, data, opt, 
        { 'Content-Type': 'multipart/form-data' }
    )
}

function post(url, data, opt, headers){
    return ajax({
        ...opt,
        method: 'post',
        headers,
        url,
        data
      })
}


export default ajax