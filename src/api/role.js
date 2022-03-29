/*
 * @Author: 龙际妙
 * @Date: 2022-03-13 20:24:48
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\api\role.js
 * @LastEditTime: 2022-03-19 03:12:41
 * @LastEditors: Please set LastEditors
 */
import request from '../utils/request'

// 角色分页查询
export function queryRole(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/sys_role/getRolePage',
    method: 'post',
    data,
  })
}

// 新增
export function saveRole(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/sys_role/saveRole`,
    method: 'post',
    data,
  })
}

// 删除
export function deleteRole(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/sys_role/deleteRole?UID=${data}`,
    method: 'delete',
    data,
  })
}

// 角色分页查询
export function getPermsTree(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/sys_role/getPermsTree?UID=${data}`,
    method: 'post',
    data,
  })
}

// 角色分页查询
export function getRoleDefKeys(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/sys_role/getRoleDefKeys?UID=${data}`,
    method: 'post',
    data,
  })
}
