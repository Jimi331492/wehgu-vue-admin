/*
 * @Author: 龙际妙
 * @Date: 2022-03-11 22:53:12
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\api\user.js
 * @LastEditTime: 2022-03-16 04:03:47
 * @LastEditors: Please set LastEditors
 */
import request from '../utils/request'

//认证用户分页查询
export function queryUser(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/sys_user/getUserPage',
    method: 'post',
    data,
  })
}

//微信用户分页查询
export function queryCustomer(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/sys_user_detail/getCustomerPage',
    method: 'post',
    data,
  })
}

//删除微信用户
export function deleteCustomer(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/sys_user_detail/deleteCustomer?UID=${data}`,
    method: 'delete',
    data,
  })
}

//保存微信用户信息
export function saveCustomer(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/sys_user_detail/saveCustomer`,
    method: 'post',
    data,
  })
}

//保存用户认证信息
export function saveUser(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/sys_user/saveUser`,
    method: 'post',
    data,
  })
}
