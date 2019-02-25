import Cookies from 'js-cookie'

const IsLogin = 'isLogin'
const LoginId = 'loginId'
const UserId = 'userId'

export function getIsLogin() {
  return Cookies.get(IsLogin)
}

export function setIsLogin(isLogin) {
  return Cookies.set(IsLogin, isLogin, { expires: 7 })
}

export function removeIsLogin() {
  return Cookies.remove(IsLogin)
}

export function setLoginId(loginId) {
  return Cookies.set(LoginId, loginId, { expires: 7 })
}

export function getLoginId() {
  return Cookies.get(LoginId)
}

export function removeLoginId() {
  return Cookies.remove(LoginId)
}

export function setUserId(userId) {
  return Cookies.set(UserId, userId, { expires: 7 })
}

export function getUserId() {
  return Cookies.get(UserId)
}

export function removeUserId() {
  return Cookies.remove(UserId)
}
