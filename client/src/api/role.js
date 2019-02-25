import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'roles/list',
    method: 'get',
    params
  })
}

export function createRole(data) {
  return request({
    url: 'roles/createOrDelete',
    method: 'post',
    data
  })
}

export function getRoleInfo(id) {
  return request({
    url: 'roles/updateOrGetInfo?id=' + id,
    method: 'get'
  })
}

export function updateRole(id, data) {
  return request({
    url: 'roles/updateOrGetInfo?id=' + id,
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: 'roles/createOrDelete',
    method: 'delete',
    data
  })
}

export function checkRoleCodeAvailable(params) {
  return request({
    url: 'roles/checkCodeAvailable',
    method: 'get',
    params
  })
}
