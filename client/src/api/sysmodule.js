import request from '@/utils/request'

export function getModulesTree(agencyCode) {
  return request({
    url: 'sysmodule/getModulesTree?agencyCode=' + agencyCode,
    method: 'get'
  })
}

export function createModule(data) {
  return request({
    url: 'sysmodule/createModule',
    method: 'post',
    data
  })
}

export function updateModule(agencyCode, moduleCode, data) {
  return request({
    url: 'sysmodule/updateModule?agencyCode=' + agencyCode + '&moduleCode=' + moduleCode,
    method: 'put',
    data
  })
}

export function deleteModule(agencyCode, data) {
  return request({
    url: 'sysmodule/deleteModule?agencyCode=' + agencyCode,
    method: 'delete',
    data
  })
}

export function getOperations() { // 获取系统所有操作资源
  return request({
    url: 'sysmodule/getOperations',
    method: 'get'
  })
}

export function getOperationsByPage(params) { // 分页获取系统所有操作资源
  return request({
    url: 'sysmodule/getOperationsByPage',
    method: 'get',
    params
  })
}

export function createModuleOperations(data) {
  return request({
    url: 'sysmodule/createModuleOperations',
    method: 'post',
    data
  })
}

export function getModuleOperations(agencyCode, moduleCode) {
  return request({
    url: 'sysmodule/getModuleOperations?agencyCode=' + agencyCode + '&moduleCode=' + moduleCode,
    method: 'get'
  })
}

export function getModuleBtnList(params) { // 分页查询模块按钮
  return request({
    url: 'sysmodule/getModuleBtnList',
    method: 'get',
    params
  })
}

export function getPermissionOpers(params) { // 获取用户操作权限
  return request({
    url: 'sysmodule/getPermissionOpers',
    method: 'get',
    params
  })
}

export function createModuleBtn(data) { // 创建模块按钮
  return request({
    url: 'sysmodule/createModuleBtn',
    method: 'post',
    data
  })
}

export function updateModuleBtn(moduleOperationId, data) { // 编辑模块按钮
  return request({
    url: 'sysmodule/updateOrDelModuleBtn?moduleOperationId=' + moduleOperationId,
    method: 'put',
    data
  })
}

export function deleteModuleBtn(moduleOperationId) {
  return request({
    url: 'sysmodule/updateOrDelModuleBtn?moduleOperationId=' + moduleOperationId,
    method: 'delete'
  })
}

export function checkButtonCodeAvailable(params) { // 校验按钮编码是否可用
  return request({
    url: 'sysmodule/checkButtonCodeAvailable',
    method: 'get',
    params
  })
}
