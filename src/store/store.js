import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    my: {
      id: '5c065278fc13ae254d000028',
      avatar: '/static/img/avatar.jpg',
      username: 'Username',
      gender: 'M',
      level: 0,
      following: 0,
      followers: 0,
      birth: '1900-01-01',
      city: '南京市',
      province: '江苏省',
      introduce: ''},
    user: {
      id: '5c065278fc13ae254d000028',
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
    playlist: {}, // 用户所有播放列表：包括两种，自己创建的和收藏的
    myPlaylist: {}, // 对象：有两个属性，collection和creation
    userReady: false,

    player: {
      songId: '5c066a22fc13ae7908000007',
      songList: [
        {
          id: '5c066a22fc13ae7908000007',
          name: 'Dancing Machine',
          artist: [
            'TYLER GELRUD'
          ],
          cover: '/api/images/img/5c066ec5fc13ae178600002a.jpg'
        },
        {
          id: '5c066a22fc13ae790800000d',
          name: 'Just Say Hello',
          artist: [
            'TYLER GELRUD'
          ],
          cover: '/api/images/img/5c066ec5fc13ae178600002a.jpg'
        },
        {
          id: '5c066a22fc13ae7908000014',
          name: 'Sing You To Sleep',
          artist: [
            'TYLER GELRUD'
          ],
          cover: '/api/images/img/5c066ec5fc13ae178600002a.jpg'
        },
        {
          id: '5c066a22fc13ae7908000018',
          name: 'Midnight Mind',
          artist: [
            'TYLER GELRUD'
          ],
          cover: '/api/images/img/5c066ec5fc13ae178600002a.jpg'
        },
        {
          id: '5c066a22fc13ae790800001d',
          name: 'Silent Movies',
          artist: [
            'Carter Vail'
          ],
          cover: '/api/images/img/5c066ec5fc13ae178600002c.jpg'
        }
      ],
      isResetPlayMode: false,  // 0-列表循环 1-单曲循环 2-随
      isPaused: true
    },
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
    setMy (state, my) {
      state.my = my
    },
    setUser (state, user) {
      state.user = user
    },
    setUserReady (state, userReady) {
      state.userReady = userReady
    },
    setPlaylist (state, playlist) {
      state.playlist = playlist
    },
    setMyPlaylist (state, playlist) {
      state.myPlaylist = playlist
    },

    setPlayingTrack (state, songId) {
      this.commit('setIsPaused', true)
      state.player.songId = songId
    },
    setPlayingList (state, list) {
      state.player.songList = list
    },
    resetPlayMode (state, isReset) {
      state.player.isResetPlayMode = isReset
    },

    removeListTrack (state, index) {
      this.commit('setIsPaused', true) //暂停歌曲
      const removedSongId = state.player.songList[index].id
      state.player.songList.splice(index, 1)
      if (removedSongId === state.player.songId) {
        state.player.songId = state.player.songList[index].id
      }
    },

    setCurrentTime (state, time) {
      state.player.currentTime = time
    },
    setTrackDuration (state, duration) {
      state.player.trackDuration = duration
    },

    setIsPaused (state, isPaused) {
      state.player.isPaused = isPaused
    }
  },
  actions: {
    setMy ({ commit }, my) {
      commit('setMy', my)
    },
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    setUserReady ({ commit }, userReady) {
      commit('setUserReady', userReady)
    },
    setPlaylist ({ commit }, playlist) {
      commit('setPlaylist', playlist)
    },
    setMyPlaylist ({ commit }, playlist) {
      commit('setMyPlaylist', playlist)
    },

    setPlayingTrack ({ commit }, songId) {
      commit('setPlayingTrack', songId)
    },
    setPlayingList ({ commit }, list) {
      commit('setPlayingList', list)
    },
    resetPlayMode ({ commit }, isReset) {
      commit('resetPlayMode', isReset)
    },

    removeListTrack ({ commit }, index) {
      commit('removeListTrack', index)
    },

    setCurrentTime ({ commit }, time) {
      commit('setCurrentTime', time)
    },
    setTrackDuration ({ commit }, duration) {
      commit('setTrackDuration', duration)
    },

    setIsPaused ({ commit }, isPaused) {
      commit('setIsPaused', isPaused)
    }
  }
})

export default store