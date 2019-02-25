import { getUserModuleTree } from '@/api/privilege'
import { constantRouterMap, generateRouterLink } from '@/router'
import { getPermissionOpers } from '@/api/sysmodule'
import Cookies from 'js-cookie'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param opers
 * @param route
 */
/* function hasPermission(opers, route) {
  if (!route.hidden) {
    return opers.some(oper => route.name === oper.moduleCode)
  } else {
    return true
  }
}*/

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
/* function filterAsyncRouter(asyncRouterMap, data) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(data, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, data)
      }
      return true
    }
    return false
  })
  return accessedRouters
}*/

/* function opersCombine(data) {
  let opers = []
  data.forEach(v => { // 获取1,2,3级目录
    opers.push({ 'moduleCode': v.moduleCode, 'moduleName': v.moduleName })
    if (v.children && v.children.length > 0) {
      opers = opers.concat(opersCombine(v.children))
    }
  })
  return opers
}*/
const opers = {}
function routersMap(data) {
  data.forEach(v => {
    if (v.children && v.children.length > 0) {
      routersMap(v.children)
    } else {
      opers[v.name] = v.meta ? v.meta.title : true
    }
  })
  return opers
}

const permission = {
  state: {
    userMoudlesTree: null,
    routers: constantRouterMap,
    addRouters: [],
    operButtons: [],
    routersMap: {},
    mainCode: '', // 当前一级模块code
    mainModules: [],
    thirdModules: [], // 获取所有三级目录
    mainModuleRouterMap: {},
    userPermission: null
  },
  mutations: {
    SET_USERMOUDLES_TREE: (state, data) => {
      state.userMoudlesTree = data
    },
    SET_ROUTERS: (state, routers) => {
      state.routers = constantRouterMap.concat(routers)
    },
    SET_ROUTERSMAP: (state, data) => {
      state.routersMap = data
    },
    SET_ADDROUTERS: (state, routers) => {
      state.addRouters = routers
    },
    SET_BUTTONS: (state, data) => {
      state.operButtons = data
    },
    SET_MAINCODE: (state, data) => {
      state.mainCode = data
    },
    SET_MAINMODULES: (state, data) => {
      state.mainModules = data
    },
    SET_MAINMODULE_ROUTER: (state, data) => {
      state.mainModuleRouterMap = data
    },
    SET_USERPERMISSION: (state, data) => {
      state.userPermission = data
    },
    SET_THIRDMODULES: (state, data) => {
      state.thirdModules = data
    }
  },
  actions: {
    getUserModulesTree({ commit }) {
      return new Promise((resolve, reject) => {
        getUserModuleTree().then(response => {          
          const tempThirdModules = []
          const mainModuleMap = {}
          let tempAddRouters = []
          const mainModules = [{ moduleCode: 'mainIndex', moduleName: '首页' }]
          response.children.forEach(item => {
            const _routers = generateRouterLink(item.moduleCode, item.children)
            routersMap(_routers) // 获取用户所有权限模块组成的map，用来消息列表跳转时判断用户有无权限
            mainModuleMap[item.moduleCode] = _routers
            tempAddRouters = tempAddRouters.concat(_routers)
            mainModules.push({ moduleCode: item.moduleCode, moduleName: item.moduleName })
            if (item.children && item.children.length) {
              item.children.forEach(v => {
                if (v.children && v.children.length) {
                  v.children.forEach(i => {
                    tempThirdModules.push({ 'moduleName': i.moduleName, 'moduleCode': i.moduleCode })
                  })
                }
              })
            }
          })
          commit('SET_ROUTERSMAP', opers)
          tempAddRouters.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTERS', mainModuleMap[response.children[0].moduleCode])
          commit('SET_ADDROUTERS', tempAddRouters)
          commit('SET_MAINMODULES', mainModules)
          commit('SET_MAINMODULE_ROUTER', mainModuleMap)
          commit('SET_THIRDMODULES', tempThirdModules)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /* getSuperModulesTree({ commit }) {
      return new Promise((resolve, reject) => {
        getModulesTree('SUPER_ADMIN').then(res => {
          const data = opersCombine(res ? res.children : [])
          commit('SET_USERMOUDLES_TREE', data)
        })
        commit('SET_ROUTERS', asyncRouterMap)
        commit('SET_ADDROUTERS', asyncRouterMap)
        resolve()
      })
    },*/
    getUserPermission(store, { agencyCode }) {
      return new Promise((resolve, reject) => {
        getPermissionOpers().then(data => {
          localStorage.setItem('userPermission', JSON.stringify(data))
          store.commit('SET_USERPERMISSION', data)
        })
      })
    },
    getModuleBtns(store, moduleCode) {
      if (moduleCode && store.state.userPermission) {
        store.commit('SET_BUTTONS', store.state.userPermission[moduleCode])
      }
    },
    changeRouters(store, moduleCode) {
      return new Promise((resolve, reject) => {
        if (moduleCode === 'mainIndex') {
          const used = Cookies.get('nearlyUsed')
          store.commit('SET_ROUTERS', used ? JSON.parse(used) : [])
        } else {
          store.commit('SET_ROUTERS', store.state.mainModuleRouterMap[moduleCode] || [])
        }
        store.commit('SET_MAINCODE', moduleCode)
        resolve()
      })
    }
  }
}

export default permission
