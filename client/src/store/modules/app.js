import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    appHeight: 0,
    noReadMsgCount: 0, // 未读消息数量
    messageFlag: new Date().getTime() // 时间戳,仅用来标识当前是否有新消息进入
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_APPHEIGHT: (state, height) => {
      state.appHeight = height
    },
    SET_MSGCOUNT: (state, num) => {
      state.noReadMsgCount = num
    },
    SET_MSGFLAG: (state, time) => {
      state.messageFlag = time
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    ChangeMsgCount({ commit }, num) {
      commit('SET_MSGCOUNT', num)
    },
    ChangeMsgFlag({ commit }, time) {
      commit('SET_MSGFLAG', time)
    }
  }
}

export default app
