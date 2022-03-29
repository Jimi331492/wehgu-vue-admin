/*
 * @Author: 龙际妙
 * @Date: 2021-11-10 14:29:35
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\utils\myFunction.js
 * @LastEditTime: 2022-03-26 21:15:36
 * @LastEditors: Please set LastEditors
 */
// import Layout from '../views/Layout'
// import Welcome from '../views/welcome/Welcome'
// import UserInfo from '../views/welcome/UserInfo'

const Index = () => import(/* webpackChunkName: "public" */ '../views/Index')
const Welcome = () => import(/* webpackChunkName: "public" */ '../views/welcome/Welcome')
const UserInfo = () => import(/* webpackChunkName: "public" */ '../views/welcome/UserInfo')

// const User = () => import(/* webpackChunkName: "admin" */ '../views/system/User')
// const Role = () => import(/* webpackChunkName: "admin" */ '../views/system/Role')
// const Menu = () => import(/* webpackChunkName: "menu" */ '../views/system/Menu')

export let homeRouter = new Object({
  name: 'Home',
  path: '/home',
  component: Index,
  redirect: '/welcome',
  children: [
    {
      name: '首页',
      path: '/welcome',
      component: Welcome,
      meta: {
        title: '首页',
      },
    },
    {
      name: '个人信息',
      path: '/userinfo',
      component: UserInfo,
      meta: {
        title: '个人信息',
      },
    },
  ],
})
export const loadView = (view) => {
  return () => import(/* webpackChunkName: "router" */ `../views${view}`)
}
// export const loadView = (view) => {
//   return (resolve) => require([`@/views${view}`], resolve)
// }

export let asyncRouter = new Array() //用户异步路由
export let authList = new Array() //权限标识
export const getAsyncRouter = (permList) => {
  permList.forEach((item) => {
    if (item.type === 0 && item.url !== null && item.url !== '') {
      asyncRouter.push({
        name: `${item.title}`,
        path: `${item.url}`,
        meta: { title: item.title, perms: item.auth },
        component: loadView(item.url),
      })
    }

    if (item.auth !== null) {
      authList.push(item.auth)
    }
    // 是否存在子集
    if (item.children && item.children.length) {
      getAsyncRouter(item.children)
    }

    // console.log('item', item)
  })
  //   获取
}

export const getHomeRouter = () => {
  // 将用户的异步路由合并到首页路由的
  homeRouter.children = [...homeRouter.children, ...asyncRouter]

  console.log('asyncRouter', asyncRouter)
  console.log('homeRouter', homeRouter)
}

export const reset = () => {
  //重置
  asyncRouter = []
  authList = []
  homeRouter = {
    name: 'home',
    path: '/home',
    component: Index,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,
        meta: {
          title: '首页',
        },
      },
      {
        path: '/userinfo',
        component: UserInfo,
        meta: {
          title: '个人信息',
        },
      },
    ],
  }
}
