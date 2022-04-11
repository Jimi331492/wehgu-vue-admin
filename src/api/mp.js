/*
 * @Author: 龙际妙
 * @Date: 2022-04-07 18:55:40
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\api\mp.js
 * @LastEditTime: 2022-04-11 08:34:59
 * @LastEditors: Please set LastEditors
 */

import request from '../utils/request'

//标签分页查询
export function queryTag(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/tag/getTagPage',
    method: 'post',
    data,
  })
}

//帖子分页查询
export function queryPost(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/post/getPostPage',
    method: 'post',
    data,
  })
}

//新增标签
export function saveTag(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/tag/saveTag',
    method: 'post',
    data,
  })
}

//新增帖子
export function savePost(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/post/savePost',
    method: 'post',
    data,
  })
}

//批量新增保存帖子
export function batchSavePost(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/post/batchSavePost',
    method: 'post',
    data,
  })
}

//删除标签
export function deleteTag(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/tag/deleteTag?UID=${data}`,
    method: 'delete',
    data,
  })
}

//删除帖子
export function deletePost(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/post/deletePost`,
    method: 'delete',
    data,
  })
}
