<template>
  <div class="user">
    <div class="simple-info">
      <div class="buttons">
        <!--这个可以拆分成一个组件-->
        <span class="icon icon-arrow_left"></span>
        <span class="icon icon-share"></span>
      </div>
      <div class="user-info">
        <div class="avatar">
          <img :src="user.avatar" width="80" height="80">
        </div>
        <div class="info">
          <div class="username">{{ user.username }}</div>
          <div class="follow-state">
            <span class="following">关注 {{ user.following }}</span>
            <span class="followers">粉丝 {{ user.followers }}</span>
          </div>
          <div class="tags">
            <span class="tag level">Lv.{{ user.level }}</span>
            <span class="tag">{{ user.city }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-wrapper">
      <div class="nav-tab border-1px">
        <router-link to="/user/playlist" class="tab-item">
          <span class="text">音乐</span>
          <span class="count" v-if="playlist.creation">{{ playlist.creation.data.length + playlist.collection.data.length }}</span>
        </router-link>
        <router-link to="/user/status" class="tab-item">
          <span class="text">动态</span>
          <!--<span class="count" v-if="userReady">{{ user.shares.length}}</span>-->
        </router-link>
        <router-link to="/user/about" class="tab-item">
          <span class="text">关于我</span>
          <!--<span class="count" v-if="userReady">{{ user.comments.length}}</span>-->
          <span class="count">36</span>
        </router-link>
      </div>
    </div>
    <div class="details">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
const ERR_NO = 0
// const USER_ID = '5c065278fc13ae254d000028'
const USERNAME = 'dasSpielIstGut'

export default {
  name: 'User',
  data () {
    return {
      user: {},
      playlist: []
    }
  },
  created () {
    this.user = this.$store.state.user
    this.playlist = this.$store.state.playlist
    this.$http.get('/api/user/' + USERNAME)
        .then(res => {
          res = res.data
          if (res.err_no === ERR_NO) {
            setTimeout(() => {
              this.user = res.data
              this.$store.dispatch('setUser', res.data)

              if (!this.$store.getters.initPlaylist) {
                this.$http.get('/api/playlist/' + this.user.id)
                    .then(res => {
                      res = res.data
                      this.playlist = res.data
                      this.$store.dispatch('setPlaylist', res.data)
                    })
              } else {
                this.playlist = this.$store.state.playlist
              }
            }, 3000)
            //
            // this.$store.dispatch('setUserReady', true)
          }
        })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../assets/stylus/mixin.styl'

.user
  font-size: 0
  .simple-info
    background-color: #000
    .buttons
      padding: 16px 14px 14px 18px
      .icon
        width: 20px
        height: 20px
        font-size: 20px
        &:before
          color: black
    .user-info
      padding: 58px 13px 18px 19px
      color: black /*暂时填充*/
      .avatar
        width: 80px
        height: 80px
        overflow: hidden
        border-radius: 50%
      .info
        margin-left: 2px
        .username
          margin-top: 24px
          font-size: 17px
          font-weight: 700
          color: #ffffff
        .follow-state
          margin-top: 11px
          .following, .followers
            font-size: 13px
            color: rgba(255, 255, 255, 0.8)
          .following
            margin-right: 10px
          .followers
            margin-left: 10px
        .tags
          margin-top: 9px
          .tag
            display: inline-block
            margin-left: 5px
            padding: 3px 10px
            font-size: 11px
            line-height: 11px
            font-weight: 300
            color: #ffffff
            background-color: rgba(255, 255, 255, 0.5)
            border-radius: 10px
            &:first-child
              margin-left: 0
          .level
            padding-left: 8px
            padding-right: 8px
            font-style: italic
            font-weight: 700
  .nav-wrapper
    background-color: #000
    .nav-tab
      display: flex
      text-align: center
      background-color: #ffffff
      border-top-left-radius: 10px
      border-top-right-radius: 10px
      border-1px(rgba(0, 0, 0, 0.1))
      .tab-item
        flex: 1
        display: inline-block
        padding: 13px 10px 4px
        .text
          padding: 0 1px 8px
          font-size: 13px
          font-weight: 400
          color: #666666
        .count
          margin-left: 4px
          font-size: 10px
          font-weight: 400
          color: #999999
        &.active
          .text
            display: inline-block
            padding-bottom: 7px
            font-weight: 700
            color: #ce3d3a
            border-bottom: 2px solid #ce3d3a
          .count
            font-weight: 700
  .details
    font-size: 14px
    color: black
</style>