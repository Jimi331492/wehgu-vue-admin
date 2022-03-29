/*
 * @Author: 龙际妙
 * @Date: 2021-11-08 01:46:20
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\store\modules\user.js
 * @LastEditTime: 2022-03-26 21:05:15
 * @LastEditors: Please set LastEditors
 */

import { Login, getUserInfo } from '../../api/index'

import { authList, asyncRouter, homeRouter, getAsyncRouter, getHomeRouter } from '../../utils/myFunction'
// import { asyncRouter} from '../../utils/myFunction'
//
const user = {
  state: {
    init: false,
    token: '',
    menuList: {}, //菜单列表
    asyncRouter: [], //用户的异步路由数组
    authList: [], //权限标识列表
    userInfo: {}, //用户信息
    homeRouter: {},
  },
  mutations: {
    INIT(state, init) {
      state.init = init
    },

    SET_TOKEN(state, token) {
      state.token = token
    },

    // 保存用户信息
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo
    },

    // 保存用户菜单信息
    SET_MENULIST(state, menuList) {
      state.menuList = menuList
    },
    // 保存用户路由信息
    SET_ASYNCROUTER(state, asyncRouter) {
      state.asyncRouter = asyncRouter
    },
    // 保存HOME路由信息
    SET_HOMEROUTER(state, homeRouter) {
      state.homeRouter = homeRouter
    },
    // 保存用户权限标识信息
    SET_AUTHLIST(state, authList) {
      state.authList = authList
    },
  },
  actions: {
    // 封装用户登录的接口
    userLogin({ commit }, loginForm) {
      return new Promise((resolve, reject) => {
        Login(loginForm)
          .then((data) => {
            const res = data.data
            if (res.code !== 200) return reject(res)
            commit('SET_TOKEN', res.data['X-Token'])
            localStorage.setItem('X-Token', res.data['X-Token'])
            sessionStorage.setItem('X-Token', res.data['X-Token'])
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 封装用户登录之后获取用户信息的接口
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((data) => {
            const res = data.data
            if (res.code !== 200) return reject(res)
            // console.log('res ', res.data)
            commit('INIT', true)
            commit('SET_USERINFO', res.data)
            commit('SET_MENULIST', res.data.permList)
            getAsyncRouter(res.data.permList)
            getHomeRouter()
            //保存
            commit('SET_ASYNCROUTER', asyncRouter)
            commit('SET_AUTHLIST', authList)
            commit('SET_HOMEROUTER', homeRouter)
            sessionStorage.setItem('authList', JSON.stringify(authList))
            sessionStorage.setItem('homeRouter', JSON.stringify(homeRouter))

            resolve(homeRouter)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
  modules: {},
}

export default user
