/*
 * @Author: 龙际妙
 * @Date: 2022-03-16 04:32:17
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\api\perm.js
 * @LastEditTime: 2022-03-17 17:12:40
 * @LastEditors: Please set LastEditors
 */
import request from '../utils/request'

//分页查询
export function queryPerm(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/sys_perm/getPermPage',
    method: 'post',
    data,
  })
}

//分页查询
export function queryPermTree(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/sys_perm/getPermTree',
    method: 'post',
    data,
  })
}

//删除权限
export function deletePerm(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/sys_perm/deletePerm?UID=${data}`,
    method: 'delete',
    data,
  })
}

//保存微信用户信息
export function savePerm(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/sys_perm/savePerm`,
    method: 'post',
    data,
  })
}

//将权限授予给角色
export function authorize(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/sys_role/authorizeRole`,
    method: 'post',
    data,
  })
}
