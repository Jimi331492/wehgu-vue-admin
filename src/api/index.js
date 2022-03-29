/*
 * @Author: 龙际妙
 * @Date: 2022-03-11 22:32:29
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\api\index.js
 * @LastEditTime: 2022-03-27 00:46:33
 * @LastEditors: Please set LastEditors
 */
import request from '../utils/request'

// 用户登录
export function Login(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}
// 获取后台管理登录用户信息
export function getUserInfo(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/getCurrentUserInfo',
    method: 'post',
    data,
  })
}

// 示例
export function query() {
  //传数据写入data，不传则不需要
  return '查询成功'
}
// 示例
export function save() {
  //传数据写入data，不传则不需要
  return '查询成功'
}

// 示例
export function deletes() {
  //传数据写入data，不传则不需要
  return '查询成功'
}
