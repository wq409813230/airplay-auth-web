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
