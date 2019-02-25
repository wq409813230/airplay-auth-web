import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'auth/loginByPwd',
    method: 'post',
    data
  })
}

export function logOut() {
  return request({
    url: 'auth/logOut',
    method: 'post',
    data: {}
  })
}

export function getInfo(userId) {
  return request({
    url: 'security/userInfo?userId=' + userId,
    method: 'get'
  })
}

export function dingTalkUrl() { // 获取钉钉登录的授权页面地址
  return request({
    url: 'auth/dingTalkUrl',
    method: 'get'
  })
}

export function dingTalk(code) { // 钉钉登录
  return request({
    url: 'auth/dingTalk?code=' + code,
    method: 'post'
  })
}

export function bindAccount(data) { // 绑定用户账户
  return request({
    url: 'auth/bindAccount',
    method: 'put',
    data
  })
}

export function dingTalkCode(loginTmpCode) { // 获取钉钉临时授权码
  return request({
    url: 'auth/dingTalkCode?loginTmpCode=' + loginTmpCode,
    method: 'get'
  })
}
