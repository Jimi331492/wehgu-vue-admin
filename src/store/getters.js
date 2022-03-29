/*
 * @Author: 龙际妙
 * @Date: 2021-11-08 04:33:01
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\store\getters.js
 * @LastEditTime: 2022-03-26 21:20:27
 * @LastEditors: Please set LastEditors
 */
const getters = {
  // 全局数据
  collapse: (state) => state.global.collapse,
  tagList: (state) => state.global.tagList,
  // 用户数据
  token: (state) => state.user.token,
  userInfo: (state) => state.user.userBaseInfo,
  menuList: (state) => state.user.menuList,
  asyncRouter: (state) => state.user.asyncRouter,
  authList: (state) => state.user.authList,
  homeRouter: (state) => state.user.homeRouter,

  // 权限相关
}

export default getters
