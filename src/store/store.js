import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {
      id: '',
      avatar: '/static/img/avatar.jpg',
      username: 'Username',
      gender: 'M',
      level: 0,
      following: 0,
      followers: 0,
      birth: '1900-01-01',
      city: '南京市',
      province: '江苏省',
      introduce: ''
    },
    playlist: {},
    userReady: false
  },
  getters: {
    initUser (state) {
      return !!state.user.id
    },
    initPlaylist (state) {
      return !!Object.keys(state.playlist).length
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    setUserReady (state, userReady) {
      state.userReady = userReady
    },
    setPlaylist (state, playlist) {
      state.playlist = playlist
    }
  },
  actions: {
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    setUserReady ({ commit }, userReady) {
      commit('setUserReady', userReady)
    },
    setPlaylist ({ commit }, playlist) {
      commit('setPlaylist', playlist)
    }
  }
})

export default store