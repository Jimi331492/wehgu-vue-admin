/*
 * @Author: 龙际妙
 * @Date: 2022-03-27 01:17:39
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\api\carousel.js
 * @LastEditTime: 2022-03-27 01:31:48
 * @LastEditors: Please set LastEditors
 */
import request from '../utils/request'
// 分页查询
export function queryCarousel(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/carousel/getCarouselPage',
    method: 'post',
    data,
  })
}

// 新增
export function saveCarousel(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/carousel/saveCarousel`,
    method: 'post',
    data,
  })
}

// 删除
export function deleteCarousel(data) {
  //传数据写入data，不传则不需要
  return request({
    url: `/carousel/deleteCarousel?UID=${data}`,
    method: 'delete',
    data,
  })
}
