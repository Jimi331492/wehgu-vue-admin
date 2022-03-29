/*
 * @Author: 龙际妙
 * @Date: 2022-03-27 02:51:54
 * @Description:
 * @FilePath: \wehgu-vue-admin\src\api\common.js
 * @LastEditTime: 2022-03-27 02:53:46
 * @LastEditors: Please set LastEditors
 */
import request from '../utils/request'

// 图片上传
export function uploadPicture(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/file/uploadPicture',
    method: 'post',
    data,
  })
}

// 视频上传
export function uploadVideo(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/file/uploadVideo',
    method: 'post',
    data,
  })
}

// 获取图片路径
export function getPicturePath(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/file/getPicturePath',
    method: 'post',
    data,
  })
}

// 图片路径存储
export function savePicturePath(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/file/savePicturePath',
    method: 'post',
    data,
  })
}

// 根据相对路径获取网络路径
export function getURIByPath(data) {
  //传数据写入data，不传则不需要
  return request({
    url: '/file/getURIByPath',
    method: 'post',
    data,
  })
}
