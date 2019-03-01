<template>
  <div class="song" v-if="songReady" ref="song">
    <div class="back">
      <back></back>
    </div>
    <div class="title border-1px" :class="{'border-none': !frontSide}">
      <div class="song-name song-name-hook">
        <span class="marquee-wrapper">
          <span class="marquee-text">{{ song.name }}(歌名太长了，于是滚了起来)</span>
        </span>
        <span class="marquee-wrapper" v-if="isTextCopyShowed">
          <span class="marquee-text">{{ song.name }}(歌名太长了，于是滚了起来)</span>
        </span>
      </div>
      <div class="artist">
        <span class="artist-name">
          <span class="artist-name-item"
                v-for="(artist, artistId) in song.artist"
                :key="artistId"
          >{{ artist.name  }}</span>
          <span class="artist-name-item">(歌手名太长，就会被省略)</span>
        </span>
        <span class="more icon-right-arrow-more"></span>
      </div>
    </div>
    <div class="share">
      <share></share>
    </div>
    <div class="front-side" v-if="frontSide" @click="changeSide">
      <div class="cover">
        <div class="hand">
          <div class="rotate-wrapper" :class="{pausing: isPaused}">
            <img src="../assets/img/disk_hand.png" width="92" height="138">
          </div>
        </div>
        <div class="disk" :class="{pausing: isPaused}">
          <img :src="song.cover" width="177" height="177">
        </div>
      </div>
      <div class="operations">
        <span class="icon icon-love"></span>
        <span class="icon icon-download"></span>
        <span class="icon icon-effect"></span>
        <span class="icon icon-comment-num" v-if="song.countComment">
          <span class="count">{{ countChange(song.countComment) }}</span>
        </span>
        <span class="icon icon-comment" v-else></span>
        <span class="icon icon-more"></span>
      </div>
    </div>
    <div class="back-side" v-else @click="changeSide">
      <div class="volume">
        <div class="icon icon-music-volume"></div>
        <div class="volume-bar">
          <div class="fill"></div>
          <div class="indicator"></div>
        </div>
      </div>
      <div class="lyrics">
        <div class="text" v-if="song.lyrics">
          <p class="oneline" v-for="(oneLine, lIdx) in song.lyrics.split(/\n/g)" :key="lIdx">
            {{ oneLine }}
          </p>
        </div>
        <div class="text" v-else>
          <p class="oneline">暂无歌词</p>
        </div>
      </div>
    </div>
    <div class="background-wrapper">
      <div class="background"></div>
    </div>
  </div>
</template>

<script>
import apiSong from '@/api/song'
import { mapState } from 'vuex'
import Back from '@/components/Back'
import Share from '@/components/Share'

const ERR_OK = 0

export default {
  name: 'Song',
  data () {
    return {
      song: {},
      songReady: false,
      frontSide: true,
      isTextCopyShowed: false,
      isAnimationRestarted: false
    }
  },
  components: {
    back: Back,
    share: Share
  },
  created () {
    apiSong.getSongById(this.$store.state.player.songId || this.$route.query.id)
        .then(res => {
          res = res.data
          if (res.err_no === ERR_OK) {
            this.song = res.data
            this.songReady = true

            this.$nextTick(() => {
              // 标题过长滚动
              this.marquee()
              // 背景图设置
              this.$refs.song.querySelector('.background-wrapper .background').style.backgroundImage = 'url(' + this.song.cover + ')'
            })
          }
        })
  },
  computed: {
    ...mapState({
      songId: state => state.player.songId,
      isPaused: state => state.player.isPaused
    })
  },
  watch: {
    songId (val) {
      apiSong.getSongById(val)
          .then(res => {
            res = res.data
            if (res.err_no === ERR_OK) {
              this.song = res.data
              // 标题过长滚动
              this.marquee()
              // 背景图设置
              this.$refs.song.querySelector('.background-wrapper .background').style.backgroundImage = 'url(' + this.song.cover + ')'
            }
          })
    }
  },
  methods: {
    // 翻转
    changeSide () {
      this.frontSide = !this.frontSide
    },
    // 标题过长滚动
    marquee () {
      const songNameNode = this.$refs.song.querySelector('.song-name-hook')
      // 可见宽度
      const visibleWidth = songNameNode.parentNode.offsetWidth
      // 文字实际宽度
      const textNodes = songNameNode.querySelector('.marquee-text')
      const textWidth = textNodes.offsetWidth

      // 文本内容适宜则返回
      if (visibleWidth >= textWidth) {
        this.isTextCopyShowed = false
        return
      }

      // 文本过长则滚动
      this.isTextCopyShowed = true // 显示复制节点

      // 自动调整宽度
      const marginWidth = 87
      songNameNode.style.width = textWidth * 2 + marginWidth * 2 + 'px'

      const marqueeNodes = songNameNode.getElementsByClassName('marquee-wrapper')
      for (let node of marqueeNodes) {
        node.style.width = (textWidth + marginWidth) + 'px'
      }

      // 计算合适的速度
      const defaultDuration = 11
      const properDuration = defaultDuration / (visibleWidth + marginWidth) * (textWidth + marginWidth)

      // 切换歌曲后，重新开始动画
      const animations = ['song-name-marquee', 'song-name-marquee-copy']
      this.isAnimationRestarted = !this.isAnimationRestarted
      const nowAnimation = animations[Number(this.isAnimationRestarted)]
      songNameNode.style.animation = nowAnimation + ' ' + properDuration + 's linear infinite'

      // 每次移动到开头，暂停一秒
      const defaultPause = 1
      const properPauseFrame = (properDuration - defaultPause) / properDuration * 100
      this.$util.appendKeyFrameRule(nowAnimation, properPauseFrame + '%', 'transform: translateX(-50%);')
    },
    // 数值转换
    countChange (n) {
      let types = [n, '999+', '1w+']
      return types[(n / 999 > 1) + (n / 10000 > 1)]
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../assets/stylus/mixin.styl'
body, html, #app
  height: 100%
.song
  display: flex
  flex-direction: column
  height: 100%
  font-size: 0
  .back, .share
    position: absolute
    top: 0
    width: 57px
    height: 52px
    font-size: 20px
    line-height: 52px
    text-align: center
    :before
      color: #ffffff
    &.back
      left: 0
    &.share
      right: 0
  .title
    flex: 0 0 40px
    margin: 0 48px 0 56px
    padding: 7px 0 4px 0
    overflow: hidden
    border-1px-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6))
    &.border-none
      border-none()
    .song-name
      overflow: hidden
      white-space: nowrap
      @keyframes song-name-marquee
        100%
          transform: translateX(-50%)
      @keyframes song-name-marquee-copy
        100%
          transform: translateX(-50%)
      .marquee-wrapper
        display: inline-block
        .marquee-text
          font-size: 18px
          color: #ffffff
    .artist
      display: flex
      align-items: center
      justify-content: flex-start
      margin-top: 4px
      .artist-name
        max-width: calc(100% - 14px)
        padding-right: 10px
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        color: rgba(255, 255, 255, 0.7)
        .artist-name-item
          display: inline-block
          font-size: 14px
          color: rgba(255, 255, 255, 0.7)
          &:after
            content: '/'
          &:last-child:after
            content: none
      .more
        margin-left: 4px
        font-size: 9px
        color: rgba(255, 255, 255, 0.7)
  .front-side
    flex: 1
    .cover
      position: relative
      .hand
        position: absolute
        top: -63px
        z-index: 1
        width: 100%
        height: 120px
        overflow: hidden
        .rotate-wrapper
          position: absolute
          left: 50%
          transition: all 1s
          &.pausing
            transform: rotate(-30deg)
            transform-origin: 0 0
          img
            position: absolute
            left: -16px
            top: -16px
      .disk
        margin: 63px auto 0
        padding: 44px
        width: 177px
        height: 177px
        border-radius: 50%
        background: url('../assets/img/disk.png') no-repeat
        background-size: 270px
        animation: spin 25s linear infinite
        animation-play-state: running
        @keyframes spin
          to
            transform: rotate(360deg)
        &.pausing
          animation-play-state: paused
        img
          border: 3px solid #0a0708
          border-radius: 50%
    .operations
      position: fixed
      left: 0
      right: 0
      bottom: 127px
      display: flex
      justify-content: space-around
      padding: 0 10%
      .icon
        position: relative
        font-size: 21px
        color: rgba(255, 255, 255, 0.6)
        .count
          position: absolute
          left: 16px
          top: -4px
          width: 100%
          font-size: 7px
  .back-side
    flex: 1
    overflow: hidden
    .volume
      display: flex
      align-items: center
      margin: 3px 33px 2px 23px
      .icon
        font-size: 13px
        color: #f2f4f5
      .volume-bar
        position: relative
        margin-left: 18px
        width: 100%
        height: 2px
        background-color: rgba(255, 255, 255, 0.4)
        border-radius: 4px
        .fill
          width: 50%
          height: 2px
          background-color: #f2f4f5
          border-radius: 4px
        .indicator
          position: absolute
          top: -3px
          left: 50%
          width: 8px
          height: 8px
          border-radius: 50%
          background-color: #f2f4f5
    .lyrics
      height: 100%
      overflow: auto
      .text
        margin: 133px auto
        text-align: center
        .oneline
          margin: 30px auto
          font-size: 15px
          color: rgba(255, 255, 255, 0.4)
          &.now
            color: #ffffff
  .player-wrapper
    flex: 0 0 108px
    width: 100%
    height: 100px
  .background-wrapper
    position: absolute
    left: 0
    top: 0
    z-index: -10
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, 0.5)
    .background
      width: 100%
      height: 100%
      background: url('../assets/img/cover.jpg')
      background-size: 100% 100%
      filter: blur(150px)
</style>