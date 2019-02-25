import request from '@/utils/request'

export function deptTree(params) {
  return request({
    url: 'dept/tree',
    method: 'get',
    params
  })
}

export function getList(params) {
  return request({
    url: 'dept/list',
    method: 'get',
    params
  })
}

export function createDept(data) {
  return request({
    url: 'dept/CURD',
    method: 'post',
    data
  })
}

export function getDeptInfo(id) {
  return request({
    url: 'dept/CURD?id=' + id,
    method: 'get'
  })
}

export function updateDept(id, data) {
  return request({
    url: 'dept/CURD?id=' + id,
    method: 'put',
    data
  })
}

export function changeDeptStatus(id) {
  return request({
    url: 'dept/lockStatus?id=' + id,
    method: 'put'
  })
}

export function deleteDept(data) {
  return request({
    url: 'dept/CURD',
    method: 'delete',
    data
  })
}

export function getUserByDept(parentCode) {
  return request({
    url: 'dept/getUserByDept?parentCode=' + parentCode,
    method: 'get'
  })
}
