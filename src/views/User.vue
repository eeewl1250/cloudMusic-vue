<template>
  <div class="user">
    <div class="simple-info">
      <div class="buttons">
        <span class="icon share">
          <share></share>
        </span>
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
          <span class="count" v-if="$store.getters.initPlaylist">{{ playlist.creation.data.length + playlist.collection.data.length }}</span>
        </router-link>
        <router-link to="/user/status" class="tab-item">
          <span class="text">动态</span>
        </router-link>
        <router-link to="/user/about" class="tab-item">
          <span class="text">关于我</span>
        </router-link>
      </div>
    </div>
    <div class="details">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import apiUser from '@/api/user'

import Share from '@/components/Share'

const ERR_OK = 0

export default {
  name: 'User',
  data () {
    return {
      user: {},
      playlist: {},
      my: false
    }
  },
  components: {
    share: Share
  },
  created () {
    this.user = this.$store.state.user
    this.playlist = this.$store.state.playlist

    let queryUserId = this.$route.query.id

    // user界面的信息，在退出后都需要再次请求获取
    // 除非只是点返回键返回到user页面
    apiUser.getUser(queryUserId || this.user.id)
        .then(res => {
          res = res.data
          if (res.err_no === ERR_OK) {
            this.user = res.data
            this.$store.dispatch('setUser', res.data)
            // 获取用户所有playlist信息
            apiUser.getPlaylist(this.user.id)
                .then(res => {
                  res = res.data
                  this.playlist = res.data
                  this.$store.dispatch('setPlaylist', res.data)
                })
          }
        })
  },
  mounted () {
    // 判断当前user界面是否是用户本人
    const queryUserId = this.$route.query.id
    this.my = !queryUserId || queryUserId === this.user.id
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
      display: flex
      justify-content: space-between
      padding: 16px 14px 14px 18px
      .icon
        width: 20px
        height: 20px
        font-size: 20px
        :before
          color: #ffffff
    .user-info
      padding: 58px 13px 18px 19px
      color: black
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