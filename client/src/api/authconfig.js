import request from '@/utils/request'

export function createAuthConfig(data) {
  return request({
    url: 'authConfig/createAuthConfig',
    method: 'POST',
    data
  })
}

export function deleteAuthConfig(id) {
  return request({
    url: 'authConfig/deleteAuthConfig?id=' + id,
    method: 'DELETE'
  })
}

export function updateAuthConfig(id, data) {
  return request({
    url: 'authConfig/updateAuthConfig?id=' + id,
    method: 'PUT',
    data
  })
}

export function getAuthConfigByPage(params) {
  return request({
    url: 'authConfig/paginate',
    method: 'GET',
    params
  })
}

export function getAuthHistoryByPage(params) {
  return request({
    url: 'authConfig/getAuthHistoryByPage',
    method: 'GET',
    params
  })
}

export function generateKeyPair() {
  return request({
    url: 'authConfig/generateKeyPair',
    method: 'POST'
  })
}

export function getKeyPair() {
  return request({
    url: 'authConfig/getKeyPair',
    method: 'GET'
  })
}

export function deleteAuthHistory(deviceMac) {
  return request({
    url: 'authConfig/deleteAuthHistory?deviceMac=' + deviceMac,
    method: 'DELETE'
  })
}

export function getAuthInfoList(configId, params) {
  return request({
    url: 'authConfig/getAuthInfoList?configId=' + configId,
    method: 'GET',
    params
  })
}

export function deleteAuthInfo(id) {
  return request({
    url: 'authConfig/deleteAuthInfo?id=' + id,
    method: 'DELETE'
  })
}
