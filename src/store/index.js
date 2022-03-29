/*
 * @Author: 龙际妙
 * @Date: 2021-10-14 18:32:18
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\store\index.js
 * @LastEditTime: 2022-03-11 22:39:01
 * @LastEditors: Please set LastEditors
 */
import { createStore } from 'vuex'
import user from './modules/user'
import global from './modules/global'
import getters from './getters'

const store = createStore({
  modules: {
    global,
    user,
  },
  mutations: {
    USER_LOGOUT() {
      sessionStorage.clear()

      global.collapse = false
      user.init = false
      user.userId = 0
      user.token = ''
      user.userBaseInfo = {}
      user.roleInfo = {}
      user.asyncRouter = []
      user.permList = []
      user.homeRouter = {}
    },
  },
  actions: {},
  getters,
})

export default store
