/*
 * @Author: 龙际妙
 * @Date: 2021-10-13 13:22:12
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\utils\request.js
 * @LastEditTime: 2022-03-19 03:26:15
 * @LastEditors: Please set LastEditors
 */
import axios from 'axios'
// import store from '../store'
import Cookies from 'js-cookie'
// import Cookies from 'js-cookie'
import { ElMessageBox, ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

//配置请求头 配置接口地址
// axios.defaults.baseURL = 'http://47.93.25.230:10077/wehgu'
axios.defaults.baseURL = 'http://localhost:10077/wehgu'

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'

// 封装axios
const service = axios.create({
  timeout: 50000, // 请求超时时间
})

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// request token
service.interceptors.request.use(
  (config) => {
    Nprogress.start()
    const tokens = localStorage.getItem('X-Token') || Cookies.get('X-Token')
    // console.log('tokens', tokens)
    if (tokens) {
      config.headers['X-Token'] = tokens
      config.headers.post['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// response interceptor 拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    Nprogress.done()
    if (res.code === 401 || res.code === 403) {
      ElMessage({
        message: res.message,
        type: 'error',
        duration: 5 * 1000,
      })
      ElMessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // store.dispatch('user/resetToken').then(() => {
          //   location.reload()
          // })
          window.location.href = '/'
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    } else {
      return response
    }
  },
  (error) => {
    const res = error.response.data
    ElMessage({
      message: res.message,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)

export default service
