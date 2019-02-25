import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'users/list',
    method: 'get',
    params
  })
}

export function createUser(data) {
  return request({
    url: 'users/CURD',
    method: 'post',
    data
  })
}

export function getUserInfo(id) {
  return request({
    url: 'users/CURD?id=' + id,
    method: 'get'
  })
}

export function updateUser(id, data) {
  return request({
    url: 'users/CURD?id=' + id,
    method: 'put',
    data
  })
}

export function changeUserStatus(id) {
  return request({
    url: 'users/changeStatus?id=' + id,
    method: 'put'
  })
}

export function getRoleList(params) {
  return request({
    url: 'roles/roleList',
    method: 'get',
    params
  })
}

export function getDeptList(params) {
  return request({
    url: 'dept/list',
    method: 'get',
    params
  })
}

export function brieflyEmployee() {
  return request({
    url: 'users/brieflyEmployee',
    method: 'get'
  })
}

export function checkCodeIsValid(code) {
  return request({
    url: 'users/checkCodeIsValid?code=' + code,
    method: 'get'
  })
}

export function resetPassword(data) {
  return request({
    url: 'users/resetPassword',
    method: 'put',
    data
  })
}
export function brieflyEmployeeParam(roleCode) {
  return request({
    url: 'users/brieflyEmployeeParam?roleCode=' + roleCode,
    method: 'get'
  })
}
export function updateEmployeePassword(userId) {
  return request({
    url: 'users/updateEmployeePassword?userId=' + userId,
    method: 'put'
  })
}

export function deleteMergeAccount(userId) {
  return request({
    url: 'users/deleteMergeAccount?userId=' + userId,
    method: 'delete'
  })
}
