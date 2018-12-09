<template>
  <div class="playlist">
    <div class="top">顶部</div>
    <div class="background-wrapper">
      <div class="background"></div>
    </div>
    <div class="info">
      <div class="cover" @click="showListFullInfo">
        <img :src="playlist.cover" width="126" height="126">
        <span class="count-play">
          <span class="icon icon-listen"></span>
          <span class="number">{{ playlist.countPlay }}</span>
        </span>
        <span class="more icon-info"></span>
      </div>
      <div class="other-info">
        <div class="list-name">{{ playlist.name }}</div>
        <div class="user-info" @click="$router.push({ path: '/user', query: { id: playlist.user.id }})">
          <span class="avatar">
            <img :src="playlist.user.avatar" width="26" height="26">
          </span>
          <span class="username">{{ playlist.user.username }}</span>
          <span class="icon icon-right-arrow-more"></span>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="list-full-info" v-show="ifShowListFullInfo" @click="hideListFullInfo">
        <div class="info-background-wrapper">
          <div class="background"></div>
        </div>
        <div class="close-wrapper" @click="hideListFullInfo">
          <div class="icon icon-close"></div>
        </div>
        <div class="content">
          <div class="title border-1px">
            <div class="cover">
              <img :src="playlist.cover" width="220" height="220">
            </div>
            <div class="list-name">{{ playlist.name }}</div>
          </div>
          <div class="detail">
            <div class="label">
              <span class="explain">标签:</span>
              <span class="label-item"
                    v-for="(label, lIdx) in playlist.labels"
                    :key="lIdx"
              >{{ label }}</span>
            </div>
            <div class="description" v-html="newlineConvert(playlist.description)"></div>
          </div></div>
        <div class="actions" @click.stop>
          <button class="button edit">编辑歌单</button>
          <button class="button save">保存封面</button>
        </div>
      </div>
    </transition>
    <div class="action-buttons">
      <div class="button-item">
        <div class="icon icon-comment"></div>
        <div class="text">{{ playlist.countComment ? playlist.countComment : '评论' }}</div>
      </div>
      <div class="button-item">
        <div class="icon icon-share"></div>
        <div class="text">{{ playlist.countShare ? playlist.countShare : '分享' }}</div>
      </div>
      <div class="button-item">
        <div class="icon icon-download"></div>
        <div class="text">下载</div>
      </div>
      <div class="button-item">
        <div class="icon icon-checkbox"></div>
        <div class="text">多选</div>
      </div>
    </div>
    <div class="songs">
      <div class="title border-1px">
        <span class="icon icon-play"></span>
        <span class="text">播放全部</span>
        <span class="number">(共{{ playlist.songs.length }}首)</span>
        <span class="count-collect">
          <span class="self-created"
                v-if="selfCreated && playlist.countCollection > 0"
          >{{ playlist.countCollection }}人收藏</span>
          <span class="user-created is-not-collected"
                v-if="!selfCreated && !isCollected"
          >+ 收藏 ({{ playlist.countCollection }})</span>
          <span class="user-created icon-collection"
                v-if="!selfCreated && isCollected"
          >{{ playlist.countCollection }}</span>
        </span>
      </div>
      <ul class="song-list">
        <li class="song-item" v-for="(song, index) in playlist.songs" :key="index">
          <div class="index">{{ index + 1 }}</div>
          <div class="detail border-1px">
            <div class="song-info">
              <div class="name">{{ song.name }}</div>
              <div class="other-info">
                <span class="high-quality icon-SQ"></span>
                <span class="artist">
                  <span class="name"
                        v-for="(artist, aIdx) in song.artist"
                        :key="aIdx"
                  >{{ artist.name }}</span>
                </span>
                <span class="album">{{ song.album.name }}</span>
              </div>
            </div>
            <div class="video icon-video"></div>
            <div class="more icon-more"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Playlist',
  data () {
    return {
      listId: this.$route.query.id,
      playlist: {
        id: '',
        name: '歌单',
        createdAt: '',
        cover: '/static/img/cover.jpg',
        user: {
          id: '',
          username: '用户名',
          avatar: '/static/img/avatar.jpg'
        },
        labels: [],
        description: '',
        countComment: 0,
        countShare: 0,
        countCollection: 0,
        countPlay: 0,
        songs: []
      },
      ifShowListFullInfo: false,
      selfCreated: false,
      isCollected: false
    }
  },
  mounted () {
    if (!this.listId) return
    this.$http.get('/api/playlist/' + this.listId)
        .then(res => {
          res = res.data
          this.playlist = res.data
          this.selfCreated = this.$store.state.user.id === this.playlist.user.id
          this.isCollected = !this.selfCreated && this.listIsCollected()
        })
  },
  methods: {
    showListFullInfo () {
      this.ifShowListFullInfo = true
      this.stopBodyMove()
    },
    hideListFullInfo () {
      this.ifShowListFullInfo = false
      this.bodyMove()
    },
    stopBodyMove () {
      document.body.style.overflow = 'hidden'
      this.$on(e => { e.preventDefault() })
    },
    bodyMove () {
      document.body.style.overflow = ''
      this.$off(e => { e.preventDefault() })
    },
    newlineConvert (text) {
      return text.replace(/\n/g, '<br>')
    },
    listIsCollected () {
      for (let item of this.$store.state.playlist.collection.data) {
        if (item.id === this.playlist.id) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../assets/stylus/mixin.styl'

.playlist
  padding-top: 52px
  font-size: 0
  .top
    position: absolute
    height: 52px
  .background-wrapper
    position: absolute
    left: 0
    top: 0
    z-index: -10
    width: 100%
    height: 290px
    background-color: rgba(0, 0, 0, 0.2)
    .background
      width: 100%
      height: 290px
      background: url('../assets/img/cover.jpg') no-repeat top
      background-size: 100% 290px
      filter: blur(150px)
  .info
    display: flex
    margin: 20px
    .cover
      position: relative
      flex: 0 0 126px
      height: 126px
      color: #ffffff
      .count-play
        position: absolute
        top: 4px
        right: 6px
        .icon
          font-size: 10px
        .number
          margin-left: 2px
          font-size: 10px
      .more
        display: inline-block
        position: absolute
        right: 3px
        bottom: 3px
        font-size: 17px
        background-color: rgba(0, 0, 0, 0.2)
        border-radius: 50%
    .other-info
      margin: 11px 7px 0 17px
      font-size: 14px
      .list-name
        font-size: 16px
        line-height: 23px
        font-weight: 700
        color: #ffffff
      .user-info
        display: flex
        align-items: center
        margin: 32px 3px 0 1px
        .avatar
          width: 26px
          height: 26px
          overflow: hidden
          border-radius: 50%
        .username
          margin-left: 10px
          font-size: 14px
          color: rgba(255, 255, 255, 0.8)
        .icon
          margin-left: 6px
          font-size: 9px
          color: rgba(255, 255, 255, 0.8)
  .fade-enter, .fade-leave-to
    opacity: 0
  .fade-enter-active, .fade-leave-active
    transition: all 0.3s
  .list-full-info
    display: flex
    flex-flow: column
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    /*width: 100%*/
    /*height: 100%*/
    z-index: 11
    .info-background-wrapper
      position: absolute
      left: 0
      top: 0
      right: 0
      bottom: 0
      z-index: -1
      background-color: #cccccc
      .background
        background: url('../assets/img/cover.jpg') repeat
        background-size: 100px
        filter: blur(150px)
        width: 100%
        height: 100%
    .close-wrapper
      position: absolute
      top: 0
      right: 0
      z-index: 20
      .icon
        padding: 22px 20px
        font-size: 14px
        color: #ffffff
    .content
      flex: 1
      overflow-y: auto
      .title
        margin-top: 76px
        padding: 0 34px 29px
        border-1px(rgba(0, 0, 0, 0.1))
        .cover
          margin: 0 auto
          width: 220px
          height: 220px
          img
            border-radius: 3px
        .list-name
          margin-top: 24px
          font-size: 17px
          text-align: center
          color: #ffffff
      .detail
        margin: 15px 31px 0 43px
        color: #ffffff
        .label
          .explain
            margin-right: 12px
            font-size: 14px
          .label-item
            margin-right: 7px
            padding: 3px 8px
            font-size: 12px
            border: 1px solid rgba(255, 255, 255, 0.5)
            border-radius: 10px
        .description
          margin-top: 21px
          font-size: 13px
          line-height: 19px
    .actions
      flex: 0 0 86px
      text-align: center
      .button
        padding: 8px 16px
        margin-right: 20px
        font-size: 12px
        color: #ffffff
        background: none
        border: 1px solid rgba(255, 255, 255, 0.5)
        border-radius: 20px
        outline: none
        &:last-child
          margin-right: 0
        &:active
          color: rgba(255, 255, 255, 0.9)
          background-color: rgba(255, 255, 255, 0.5)
  .action-buttons
    display: flex
    justify-content: space-around
    margin: 11px 0 13px
    .button-item
      text-align: center
      .icon
        font-size: 18px
        color: #ffffff
      .text
        margin-top: 7px
        font-size: 12px
        color: rgba(255, 255, 255, 0.7)
  .songs
    .title
      position: relative
      padding: 0 15px
      height: 45px
      line-height: 45px
      background-color: #ffffff
      border-top-left-radius: 10px
      border-top-right-radius: 10px
      border-1px(rgba(0, 0, 0, 0.1))
      overflow: hidden
      .icon
        font-size: 20px
        color: #4d4d4d
        vertical-align: middle
      .text
        margin-left: 16px
        font-size: 16px
        color: #333333
        vertical-align: middle
      .number
        font-size: 16px
        color: #999999
        vertical-align: middle
      .count-collect
        display: inline-block
        position: absolute
        right: 0
        .self-created, .user-created
          display: inline-block
          padding: 0 11px
          height: 45px
          font-size: 15px
          color: #999999
          line-height: 45px
          vertical-align: middle
          &:before
            font-size: 17px
            margin-right: 6px
            color: #b3b3b3
            vertical-align: bottom
          &.is-not-collected
            padding: 0 12px
            font-size: 17px
            color: #ffffff
            background: linear-gradient(left, #fe5b49, #d53c31)
    .song-list
      font-size: 12px
      background-color: #ffffff
      .song-item
        display: flex
        .index
          flex: 0 0 50px
          height: 54px
          font-size: 12px
          line-height: 54px
          color: #999999
          text-align: center
        .detail
          flex: 1
          display: flex
          overflow: hidden
          align-items: center
          padding: 9px 20px 8px 0
          border-1px(rgba(0, 0, 0, 0.1))
          .song-info
            flex: 1
            overflow: hidden
            .name
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              font-size: 16px
              color: #333333
            .other-info
              margin-top: 10px
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              color: #888888
              .high-quality
                font-size: 9px
                color: #fe682e
              .artist
                margin-left: 4px
                color: #888888
                &:after
                  content: '-'
                  margin-left: 5px
                .name
                  font-size: 12px
                  color: #888888
                  &:after
                    content: '/'
                  &:last-child:after
                    content: none
              .album
                margin-left: 5px
                font-size: 12px
                color: #888888
          .video, .more
            flex: 0 0 20px
            font-size: 18px
            color: #b2b2b2
          .more
            margin-left: 23px
</style>