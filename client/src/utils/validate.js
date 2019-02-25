/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor', 'super']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
/* 大小写字母及数字下划线*/
export function validateCode(str) {
  const reg = /^[A-Za-z\d_]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/* 验证金额 */
export function validateMoney(val) {
  const reg = /^([1-9][0-9]{0,7})((\.([0-9]{1,2}))?)$|^[0](\.([0-9]{1,2}))$/
  return reg.test(val) && parseFloat(val) <= 21474836.47
}

/* 验证正整数 */
export function validateIntNumber(val) {
  const reg = /^[1-9]\d*$/
  return reg.test(val)
}

/* 验证折扣 */
export function validateDiscount(val) {
  const reg = /^[1-9](.[1-9])?$|10/
  return reg.test(val)
}

/* 验证手机号 */
export function validatePhone(val) {
  const reg = /^(13[0-9]|14[5|7]|17[0|6|7|8]|15[0-9]|18[0-9])\d{8}$/
  return reg.test(val)
}

/* 验证固话 */
export function validateTelephone(val) {
  const reg = /^(\(\d{3,4}-\)|\d{3,4}-)?\d{7,8}$/
  return reg.test(val)
}
