import request from '@/utils/request'

export function createMachineModel(data) {
  return request({
    url: 'machinemodel/CRUD',
    method: 'POST',
    data
  })
}

export function deleteMachineModel(modelCode) {
  return request({
    url: 'machinemodel/CRUD?modelCode=' + modelCode,
    method: 'DELETE'
  })
}

export function getMachineModel(modelCode) {
  return request({
    url: 'machinemodel/CRUD?modelCode=' + modelCode,
    method: 'GET'
  })
}

export function getMachineModelByPage(params) {
  return request({
    url: 'machinemodel/paginate',
    method: 'GET',
    params
  })
}
