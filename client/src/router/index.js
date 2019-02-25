import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
/**
* mainCode 一级菜单code
* data 一级模块下子模块信息
**/
export function generateRouterLink(mainCode, data) {
  const routers = []
  data.forEach(item => {
    let routerChilds = []
    item.children.forEach(child => {
      routerChilds.push({
        path: child.moduleCode,
        name: child.moduleCode,
        component: _import(child.direction),
        meta: { title: child.moduleName, mainCode: mainCode }
      })
    })
    if (hiddenRouterMap[item.moduleCode]) {
      routerChilds = routerChilds.concat(hiddenRouterMap[item.moduleCode])
    }
    routers.push({
      path: '/' + item.moduleCode,
      name: item.moduleCode,
      component: Layout,
      redirect: 'noredirect',
      meta: { title: item.moduleName },
      children: routerChilds
    })
  })
  // routers.push({ path: '*', redirect: '/404', hidden: true })
  return routers
}

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '/home',
    component: Layout,
    hidden: true,
    children: [{
      path: 'platform',
      component: _import('home'),
      meta: { mainCode: 'mainIndex' },
      hidden: true
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home/platform',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const hiddenRouterMap = {
  productInfo: []
}
