/*
 * @Author: 龙际妙
 * @Date: 2022-04-10 07:00:43
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\api\system.js
 * @LastEditTime: 2022-04-10 07:02:20
 * @LastEditors: Please set LastEditors
 */
import request from '../utils/request'

export function queryDictionary(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/dictionary/getDictionaryPage',
    method: 'post',
    data,
  })
}

export function saveDictionary(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/dictionary/saveDictionary',
    method: 'post',
    data,
  })
}

export function deleteDictionary(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/dictionary/deleteDictionary',
    method: 'delete',
    data,
  })
}
