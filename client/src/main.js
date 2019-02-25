import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import './element-variables.scss'
// import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
import * as filters from './filters' // global filters
import global_ from './Global'
Vue.prototype.GLOBAL = global_
Vue.use(ElementUI, { locale })

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false // 设置为 false 以阻止 vue 在启动时生成生产提示

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  mounted: function() {
    store.commit('SET_NAME', localStorage.getItem('username'))
    store.commit('SET_APPHEIGHT', this.$el.clientHeight)
    store.commit('SET_AGENCYCODE', localStorage.getItem('agencyCode'))
    store.commit('SET_USERPERMISSION', JSON.parse(localStorage.getItem('userPermission')))
  }
})
