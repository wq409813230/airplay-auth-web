import router from './router/index'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getIsLogin } from './utils/auth'
import Cookies from 'js-cookie'

function setNearlyUsed(to) { // 最近使用模块
  if (to.meta.parentPath) {
    return
  }
  const nearlyUsed = Cookies.get('nearlyUsed')
  const used = nearlyUsed ? JSON.parse(nearlyUsed) : []
  if (used.filter(item => item.name === to.name).length) {
    return
  }
  to.name && used.unshift({ name: to.name, title: to.meta.title, query: to.query })
  used.length > 5 && used.pop()
  Cookies.set('nearlyUsed', JSON.stringify(used))
}

const whiteList = ['/login', '/bindAccount', '/transshipment'] // 不重定向白名单
const defaultRouterPath = ['/login', '/bindAccount', '/transshipment', '/404', '/home', '/home/platform']
router.beforeEach((to, from, next) => { // 注册全局前置守卫 to:Route即将要进入的目标对象路由  from:当前导航正要离开的路由 next:一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数
  NProgress.start()
  if (getIsLogin()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (!store.getters.userPermission) {
        store.dispatch('getUserPermission', {
          agencyCode: store.getters.agencyCode
        })
      }
      if (store.getters.addRouters.length === 0) {
        store.dispatch('getUserModulesTree').then(() => {
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          next({ ...to, replace: true })
        })
      } else if (defaultRouterPath.indexOf(to.path) > -1 || store.getters.routersMap[to.name]) { // 判断是否有当前模块的跳转权限
        if (defaultRouterPath.indexOf(to.path) < 0) { // 有權限的模块才需要记录进最近浏览
          setNearlyUsed(to)
        }
        next()
      } else {
        next({ path: '/404' })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})
router.afterEach((to, from) => { // 你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身
  store.state.permission.thirdModules.forEach(item => {
    if (item.moduleCode === to.name) {
      Cookies.set('uiModule', to.name)
    }
  })
  if (getIsLogin()) {
    // 如果store中不存在mainCode(刷新页面)
    if (!store.getters.mainCode) { // || (to.meta.mainCode !== Cookies.get('mainCode'))  或 首页快捷跳转目录的一级模块与当前模块不同 且不是刷新工作台
      store.dispatch('changeRouters', to.meta.mainCode || Cookies.get('mainCode'))
    }
    store.dispatch('getModuleBtns', to.meta.parentPath || to.name)
  }
  NProgress.done() // 结束Progress
})
