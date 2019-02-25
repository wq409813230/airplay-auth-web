import request from '@/utils/request'

export function deleteFile(data) {
  return request({
    url: 'storage/deleteFile',
    method: 'delete',
    data
  })
}

export function upload(data) {
  return request({
    url: 'storage/upload',
    method: 'post',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function multiUpload(data) {
  return request({
    url: 'storage/multiUpload',
    method: 'post',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function exportExel(type, data) {
  return request({
    url: 'storage/exportExel?type=' + type,
    method: 'post',
    data
  })
}

export function getDownloadFilePath(contentId) {
  return request({
    url: 'storage/getDownloadFilePath?contentId=' + contentId,
    method: 'get'
  })
}

export function importExcel(type, data) {
  return request({
    url: 'storage/importExcel?type=' + type,
    method: 'post',
    data
  })
}

export function exportingByConditions(type, data) {
  return request({
    url: 'storage/exportingByConditions?type=' + type,
    method: 'post',
    data
  })
}
