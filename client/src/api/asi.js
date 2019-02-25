import request from '@/utils/request'

export function getColumnList(params) {
  return request({
    url: 'asi/getColumnList',
    method: 'get',
    params
  })
}

export function createColumn(agencyCode, data) {
  return request({
    url: 'asi/createColumn?agencyCode=' + agencyCode,
    method: 'post',
    data
  })
}

export function updateColumn(agencyCode, data) {
  return request({
    url: 'asi/updateColumn?agencyCode=' + agencyCode,
    method: 'put',
    data
  })
}

export function deleteColumn(agencyCode, columnCode) {
  return request({
    url: 'asi/deleteColumn?agencyCode=' + agencyCode + '&columnCode=' + columnCode,
    method: 'delete'
  })
}

export function checkColumnCodeAvailable(agencyCode, columnCode) {
  return request({
    url: 'asi/checkColumnCodeAvailable?agencyCode=' + agencyCode + '&columnCode=' + columnCode,
    method: 'get'
  })
}

export function getDataTypes() {
  return request({
    url: 'asi/getDataTypes',
    method: 'get'
  })
}

export function getGroupList(params) {
  return request({
    url: 'asi/getGroupList',
    method: 'get',
    params
  })
}

export function getGroupTree(params) {
  return request({
    url: 'asi/getGroupTree',
    method: 'get',
    params
  })
}

export function createGroup(agencyCode, data) {
  return request({
    url: 'asi/createGroup?agencyCode=' + agencyCode,
    method: 'post',
    data
  })
}

export function updateGroup(agencyCode, data) {
  return request({
    url: 'asi/updateGroup?agencyCode=' + agencyCode,
    method: 'put',
    data
  })
}

export function deleteGroup(agencyCode, groupCode) {
  return request({
    url: 'asi/deleteGroup?agencyCode=' + agencyCode + '&groupCode=' + groupCode,
    method: 'delete'
  })
}

export function getGroupColumnList(agencyCode, groupCode) {
  return request({
    url: 'asi/getGroupColumnList?agencyCode=' + agencyCode + '&groupCode=' + groupCode,
    method: 'get'
  })
}

export function copyTemplateColumn(agencyCode, groupCode, data) { // 将列定义模板复制到自分组中
  return request({
    url: 'asi/copyTemplateColumn?agencyCode=' + agencyCode + '&groupCode=' + groupCode,
    method: 'post',
    data
  })
}

export function createGroupColumn(agencyCode, groupCode, data) { // 创建分组自定义列
  return request({
    url: 'asi/createGroupColumn?agencyCode=' + agencyCode + '&groupCode=' + groupCode,
    method: 'post',
    data
  })
}

export function deleteGroupColumn(agencyCode, groupCode, columnCode) {
  return request({
    url: 'asi/deleteGroupColumn?agencyCode=' + agencyCode + '&groupCode=' + groupCode + '&columnCode=' + columnCode,
    method: 'delete'
  })
}

export function checkGroupColumnAvailable(agencyCode, groupCode, columnCode) { // 验证自定义列编码是否可用
  return request({
    url: 'asi/checkGroupColumnAvailable?agencyCode=' + agencyCode + '&groupCode=' + groupCode + '&columnCode=' + columnCode,
    method: 'get'
  })
}

export function getColumnsDefine(groupCode, agencyCode) {
  return request({
    url: 'asi/getColumnsDefine?agencyCode=' + agencyCode + '&groupCode=' + groupCode,
    method: 'get'
  })
}
