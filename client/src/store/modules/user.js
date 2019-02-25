import { login, getInfo, logOut } from '@/api/login'
import { setIsLogin, removeIsLogin, setLoginId, removeLoginId, setUserId, removeUserId } from '@/utils/auth'

const user = {
  state: {
    token: '',
    userId: '',
    name: '',
    avatar: '',
    agencyCode: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_AGENCYCODE: (state, agencyCode) => {
      state.agencyCode = agencyCode
    }
  },

  actions: {
    // 登录
    Login({ dispatch, commit }, loginInfo) {
      console.log('action')
      return login(loginInfo).then(response => {
        commit('SET_TOKEN', response.token)
        commit('SET_USERID', response.userId)
        commit('SET_AGENCYCODE', loginInfo.agency)
        localStorage.setItem('agencyCode', loginInfo.agency)
        setLoginId(response.loginId)
        setIsLogin(1)
        setUserId(response.userId)
        dispatch('GetInfo')
      })
    },
    DingTalkLogin({ dispatch, commit }, loginInfo) {
      commit('SET_TOKEN', loginInfo.token)
      commit('SET_USERID', loginInfo.userId)
      commit('SET_AGENCYCODE', 'SUPER_ADMIN')
      localStorage.setItem('agencyCode', 'SUPER_ADMIN') // loginInfo.agency
      setLoginId(loginInfo.loginId)
      setIsLogin(1)
      setUserId(loginInfo.userId)
      dispatch('GetInfo')
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return getInfo(state.userId).then(response => {
        if (response) {
          commit('SET_NAME', response.userName)
          commit('SET_AVATAR', response.avatar)
          localStorage.setItem('username', response.userName)
        } else {
          commit('SET_NAME', '超级管理员')
          localStorage.setItem('username', '超级管理员')
        }
      })
    },

    // 登出
    LogOut({ commit }) {
      return logOut().then(() => {
        commit('SET_TOKEN', '')
        localStorage.removeItem('username')
        localStorage.removeItem('userPermission')
        removeIsLogin()
        removeLoginId()
        removeUserId()
      })
    }
  }
}

export default user
