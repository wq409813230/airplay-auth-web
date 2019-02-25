import request from '@/utils/request'

export function getPermissions() {
  return request({
    url: 'privilege/getPermissions',
    method: 'get'
  })
}

export function getPermissionsByType(primaryType, primaryCode) { // 根据用户或角色查询对应权限信息
  return request({
    url: 'privilege/getPermissionsByType?primaryType=' + primaryType + '&primaryCode=' + primaryCode,
    method: 'get'
  })
}

export function createPermissions(data) {
  return request({
    url: 'privilege/createPermissions',
    method: 'post',
    data
  })
}

export function getUserModuleTree() {
  return request({
    url: 'privilege/getUserModuleTree',
    method: 'get'
  })
}

export function createDataPermission(data) {
  return request({
    url: 'privilege/createDataPermission',
    method: 'post',
    data
  })
}

export function previewDataPermission(data, start, length) {
  return request({
    url: 'privilege/previewDataPermission?start=' + start + '&length=' + length,
    method: 'post',
    data
  })
}

export function getDataPermission(params) {
  return request({
    url: 'privilege/getDataPermission',
    method: 'get',
    params
  })
}

export function deleteDataPermission(params) {
  return request({
    url: 'privilege/deleteDataPermission',
    method: 'delete',
    params
  })
}
