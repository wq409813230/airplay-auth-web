import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'dictionary/getPageList',
    method: 'get',
    params
  })
}

export function createDict(data) {
  return request({
    url: 'dictionary/createOrDelete',
    method: 'post',
    data
  })
}

export function updateDict(dictCode, data) {
  return request({
    url: 'dictionary/updateOrGetInfo?code=' + dictCode,
    method: 'put',
    data
  })
}

export function deleteDict(data) {
  return request({
    url: 'dictionary/createOrDelete',
    method: 'delete',
    data
  })
}

// 获取字典的所有字段值
export function getDictVal(dictCode) {
  return request({
    url: 'dictionary/getDictVal?dictCode=' + dictCode,
    method: 'get'
  })
}

export function getDicValList(dictCode, params) {
  return request({
    url: 'dictionary/getDicValPageList?dictCode=' + dictCode,
    method: 'get',
    params
  })
}

export function getDicValAll(dictCode) {
  return request({
    url: 'dictionary/deleteDictVal?dictCode=' + dictCode,
    method: 'get'
  })
}

export function updateDicVal(dictCode, entryKey, data) {
  return request({
    url: 'dictionary/updateDictVal?dictCode=' + dictCode + '&entryKey=' + entryKey,
    method: 'put',
    data
  })
}

export function createDicVal(dictCode, data) {
  return request({
    url: 'dictionary/createDictVal?dictCode=' + dictCode,
    method: 'post',
    data
  })
}

export function changeDictValStatus(dictCode, entryKey) {
  return request({
    url: 'dictionary/changeDictValStatus?dictCode=' + dictCode + '&entryKey=' + entryKey,
    method: 'put'
  })
}

export function deleteDictVal(dictCode, data) {
  return request({
    url: 'dictionary/deleteDictVal?dictCode=' + dictCode,
    method: 'delete',
    data
  })
}

export function getDicValByKey(dictCode, key) {
  return request({
    url: 'dictionary/getDicValByKey?dictCode=' + dictCode + '&key=' + key,
    method: 'get'
  })
}

export function validateDictCodeAvaiable(dictCode) {
  return request({
    url: 'dictionary/checkDictCodeAvailable?dictCode=' + dictCode,
    method: 'get'
  })
}

export function validateEntryKeyAvaiable(dictCode, entryKey, agency) {
  return request({
    url: 'dictionary/checkEntryKeyAvailable?dictCode=' + dictCode + '&entryKey=' + entryKey + '&agency=' + agency,
    method: 'get'
  })
}
