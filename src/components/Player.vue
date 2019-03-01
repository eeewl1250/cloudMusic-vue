<template>
  <div class="player border-1px" :class="playerStyle" @click="$router.push({ path: '/song' })">
    <audio ref="track"
           @timeupdate="onTimeUpdate"
           @loadedmetadata="onLoadedMetaData"
           @ended="onEnded"
    >
      <source :src="trackSrc" type="audio/mpeg" />
    </audio>
    <div ref="progress"
         class="progress"
    >
      <div class="current-time">{{ $util.timeStyle(currentTime) }}</div>
      <div class="progress-bar">
        <div class="fill"></div>
        <div class="indicator"
        >
        </div>
      </div>
      <div class="track-duration">{{ $util.timeStyle(trackDuration) }}</div>
    </div>
    <div class="track-info" v-if="trackInfo">
      <div class="cover">
        <img :src="trackInfo.cover"
             width="37"
             height="37"
        >
      </div>
      <div class="detail">
        <div class="track-name">{{ trackInfo.name }}</div>
        <div class="artist">
          <span class="artist-name">
            <span class="artist-name-item"
                  v-for="(artist, artistId) in trackInfo.artist"
                  :key="artistId"
              >{{ artist  }}</span>
            <span class="artist-name-item">111111</span>
          </span>
        </div>
      </div>
    </div>
    <div class="play-operations">
      <span class="icon icon-play-mode"
            :class="playModeClasses[playModeNo]"
            @click="changeMode"
      ></span>
      <span class="icon icon-music-prev" @click="changeTrack(false)"></span>
      <span class="icon icon-play-state"
            :class="playStateClasses[playStateNo]"
            @click.stop="playReverse"
      ></span>
      <span class="icon icon-music-next" @click="changeTrack(true)"></span>
      <span class="icon icon-music-playlist" @click.stop="togglePlaylist"></span>
    </div>
    <div class="music-playlist-wrapper" v-if="isShowPlaylist" @click.stop>
      <div class="background-wrapper" @click="togglePlaylist"></div>
      <div class="music-playlist">
        <div class="title border-1px">
          <div class="play-mode" @click="changeMode">
        <span class="icon"
              :class="playModeClasses[playModeNo]"
        ></span>
            <span class="text">{{ nowPlayModeChi }}（{{ songList.length }}）</span>
          </div>
          <div class="operations">
            <div class="collect">
              <span class="icon icon-collection"></span>
              <span class="text">收藏全部</span>
            </div>
            <div class="clear">
              <span class="icon icon-close"></span>
            </div>
          </div>
        </div>
        <div class="tracks">
          <div class="track-item"
               v-for="(track, tIdx) in songList"
               :key="tIdx"
               @click="playTrack(tIdx)"
          >
            <div class="text border-1px"
                 :class="[{playing: tIdx === nowTrackNo},
                      {'icon-music-volume': tIdx === nowTrackNo}]"
            >
              <span class="track-name">{{ track.name }}</span>
              <span class="artists"
                    v-for="(artist, aIdx) in track.artist"
                    :key="aIdx"
              >
            <span class="artist-name">{{ artist }}</span>
          </span>
            </div>
            <div class="remove icon-close"
                 @click.stop="removeTrack(tIdx)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

// 生成随机数组
function createShuffledArray (len, playingTrackNo) {
  let shuffled = Array.apply(null, { length: len })
  for (let i = 0; i < len; i++) {
    if (i === playingTrackNo) continue
    let index = Math.round(Math.random() * len)
    shuffled.splice(index, 0, i)
  }
  // 确保当前播放歌曲处于列表头部
  if (playingTrackNo !== undefined) {
    shuffled.unshift(playingTrackNo)
  }
  return shuffled.filter(item => item !== undefined)
}

const playModeTypes = {
  REPEAT_LIST: 'repeat-list',
  REPEAT_TRACK: 'repeat-track',
  SHUFFLE: 'shuffle'
}
const playModeChinese = new Map([
    [playModeTypes.REPEAT_LIST, '列表循环'],
    [playModeTypes.REPEAT_TRACK, '单曲循环'],
    [playModeTypes.SHUFFLE, '随机播放']
])
const playModes = [
  playModeTypes.REPEAT_LIST,
  playModeTypes.REPEAT_TRACK,
  playModeTypes.SHUFFLE
]
const playerStyles = ['base', 'song-view']

export default {
  name: 'Player',
  data () {
    return {
      currentTime: 0, // 当前播放时间
      trackDuration: 0, // 歌曲总时长

      playModeClasses: playModes.map(v => 'icon-music-' + v), // 播放模式对应的icon类型
      playModeNo: 0, // 当前播放模式 0-列表循环 1-单曲循环 2-随机

      trackOrder: [], // 歌曲播放顺序
      nowTrackOrderNo: 0, // 当前播放歌曲所处播放顺序索引

      // 播放/暂停按钮的icon类型
      playStateClasses: [
        'icon-music-playing',
        'icon-music-pausing'
      ],

      reload: false, // 歌曲是否重新加载

      isShowPlaylist: false // 是否显示播放列表
    }
  },
  created () {
    this.$nextTick(() => {
      // 初始化：默认播放模式 列表循环
      this.playModeNo = this.getPlayModeNo(playModeTypes.REPEAT_LIST) // OK
      // 初始化：表单歌曲播放顺序
      this.trackOrder = Array.apply(null, { length: this.songList.length }).map((v, i) => i)
    })
  },
  computed: {
    // store
    ...mapState({
      songId: state => state.player.songId,
      songList: state => state.player.songList,
      isResetPlayMode: state => state.player.isResetPlayMode,
      isPaused: state => state.player.isPaused
    }),
    // 播放器样式
    playerStyle () {
      if (this.$route.name === 'song') return playerStyles[1]
      return playerStyles[0]
    },
    // 当前歌曲信息
    trackInfo () {
      if (!this.songList) return false
      return this.songList[this.nowTrackNo]
    },
    // 播放状态码，用以获取icon类型
    playStateNo () {
      return Number(this.isPaused)
    },
    // 当前播放歌曲，在原始播放列表中的索引
    nowTrackNo () {
      return this.trackOrder[this.nowTrackOrderNo]
    },
    // 完整的歌曲src
    trackSrc () {
      return '/api/music/' + this.songId + '.mp3'
    },
    // 当前播放模式中文
    nowPlayModeChi () {
      return playModeChinese.get(playModes[this.playModeNo])
    }
  },
  watch: {
    // 音频src变换时，重新加载，并自动播放
    trackSrc () {
      this.$refs.track.load()
      this.reload = true
    },
    // 重置播放模式，默认为列表循环
    isResetPlayMode (val) {
      if (!val) return
      this.playModeNo = this.getPlayModeNo(playModeTypes.REPEAT_LIST)
      this.resetPlayMode(false)
    },
    // 根据时间，更新进度条位置
    currentTime () {
      const progressBarWidth = parseFloat(this.$util.getStyle(this.$refs.progress.querySelector('.progress-bar'), 'width'))
      const percent = this.currentTime < this.trackDuration ? this.currentTime / this.trackDuration : 1
      this.$refs.progress.querySelector('.fill').style.width = progressBarWidth * percent  + 'px'
      this.$refs.progress.querySelector('.indicator').style.left = progressBarWidth * percent - 5  + 'px'
    },
    // 监控播放状态
    isPaused (val) {
      if (val) {
        this.$refs.track.pause()
      } else {
        this.$refs.track.play()
      }
    }
  },
  methods: {
    // store
    ...mapActions([
      'resetPlayMode',
      'setPlayingTrack',
      'setIsPaused',
      'removeListTrack'
    ]),
    // 播放模式代码转换
    getPlayModeNo (mode) {
      return playModes.indexOf(mode)
    },
    // 切换播放模式，依次顺序为 列表循环 - 单曲循环 - 随机播放
    changeMode () {
      const playModeLen = this.playModeClasses.length
      // 改变模式代码，同时会改变icon图标和播放模式
      this.playModeNo = (this.playModeNo + 1) % playModeLen

      const playMode = new Map([
          [
            playModeTypes.REPEAT_LIST,
            this.repeat(playModeTypes.REPEAT_LIST)
          ],
          [
            playModeTypes.REPEAT_TRACK,
            this.repeat(playModeTypes.REPEAT_TRACK)
          ],
          [
            playModeTypes.SHUFFLE,
            this.shuffle
          ]
      ])
      playMode.get(playModes[this.playModeNo])()
    },
    // 循环播放模式
    repeat (playMode) {
      const _this = this
      return function repeatMode () {
        // 设置是否单曲循环
        _this.$refs.track.loop = playMode === playModeTypes.REPEAT_TRACK

        // 重置歌曲播放顺序，恢复原顺序
        _this.nowTrackOrderNo = _this.nowTrackNo // 保存当前播放歌曲索引
        _this.trackOrder = Array.apply(null, { length: _this.songList.length }).map((v, i) => i)
      }
    },
    // 随机播放模式
    shuffle () {
      this.$refs.track.loop = false
      this.trackOrder = createShuffledArray(this.songList.length, this.nowTrackNo)
    },
    // 切歌
    changeTrack (isNext) {
      const len = this.songList.length

      // shuffle模式下，最后一首往后切，或第一首往前，需重新打乱顺序
      const oldOrderNo = this.nowTrackOrderNo
      if (this.playModeNo === playModes.indexOf(playModeTypes.SHUFFLE)
          && (isNext && oldOrderNo === len - 1
              || !isNext && oldOrderNo === 0)
         ) {
        this.trackOrder = createShuffledArray(this.songList.length)
      }

      this.nowTrackOrderNo = (this.nowTrackOrderNo
                              + len
                              + (isNext ? 1 : -1)
                             )
                             % len
      // 更新songId，从而重新计算trackSrc，歌曲重新加载，并自动播放
      this.setPlayingTrack(this.songList[this.nowTrackNo].id)
    },
    // 切换播放状态：播放 / 暂停
    playReverse () {
      this.setIsPaused(!this.isPaused)
    },
    // 更新播放时间
    onTimeUpdate () {
      // 最大值不得超过总时长
      this.currentTime = Math.min(
                              this.trackDuration,
                              Math.floor(
                                  this.$refs.track
                                  ? this.$refs.track.currentTime
                                  : 0
                              )
                          )
    },
    // 音频/视频元数据（时长）已加载时触发
    onLoadedMetaData () {
      this.trackDuration = Math.floor(this.$refs.track.duration)
      // 歌曲重新加载后，自动播放
      if (!this.reload) return
      this.setIsPaused(false)
    },
    // 播放已结束时
    onEnded () {
      // 不播放的情况下，不自动播放下一首
      if (this.$refs.track.loop) return

      // shuffle模式下，播放到最后一首，需重新对下一轮进行洗牌
      if (this.nowTrackOrderNo === this.trackOrder.length - 1) {
        this.trackOrder = createShuffledArray(this.songList.length)
      }

      // 播放下一首
      this.changeTrack(true)
    },
    // 隐藏或显示播放列表
    togglePlaylist () {
      this.isShowPlaylist = !this.isShowPlaylist
    },
    // 播放特定歌曲
    playTrack (nowTrackNo) {
      this.nowTrackOrderNo = this.trackOrder.indexOf(nowTrackNo)
      // 设置当前播放歌曲
      this.setPlayingTrack(this.songList[nowTrackNo].id)
      this.isShowPlaylist = false
      // 跳转歌曲页面
      this.$router.push({ path:'/song' })
    },
    // 从当前播放列表中，移除一首歌曲
    removeTrack (removeIndex) {
      // 更新trackOrder, 移除最大的那个数
      this.trackOrder.splice(this.trackOrder.indexOf(this.songList.length - 1), 1)

      // 操纵store里的list，移除该歌曲
      this.removeListTrack(removeIndex)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../assets/stylus/mixin.styl'
.player
  z-index: 10
  .music-playlist-wrapper
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 30
    .background-wrapper
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      background-color: rgba(0, 0, 0, 0.6)
    .music-playlist
      position: fixed
      left: 0
      bottom: 0
      z-index: 31
      width: 100%
      height: 383px
      background-color: #ffffff
      border-top-left-radius: 10px
      border-top-right-radius: 10px
      .title
        display: flex
        align-items: center
        line-height: 50px
        border-1px(rgba(0, 0, 0, 0.1))
        .icon
          vertical-align: middle
          font-size: 16px
          color: #929292
          &::before
            line-height: 50px
        .text
          vertical-align: middle
          margin-left: 8px
          font-size: 14px
          color: #333333
        .play-mode, .collect, .clear
          active-background()
        .play-mode
          flex: 0 0 130px
          .icon
            margin-left: 10px
        .operations
          flex: 1
          display: flex
          justify-content: flex-end
          .collect
            padding: 0 15px
            border-1px-right(rgba(0, 0, 0, 0.1), 20px)
          .clear
            padding: 0 10px
      .tracks
        height: 333px
        overflow: auto
        .track-item
          position: relative
          padding: 0 11px
          active-background()
          .text
            padding: 16px 0
            border-1px(rgba(0, 0, 0, 0.1))
            .track-name
              font-size: 14px
              color: #333333
              &:after
                content: '-'
                margin: 0 4px
            .artists
              .artist-name
                font-size: 10px
                color: #7a7a7a
            &.playing
              .track-name, .artists .artist-name
                color: #d33a31
              &:before
                margin-right: 8px
                font-size: 13px
                color: #d33a31
          .remove
            position: absolute
            right: 0
            top: 1px
            padding: 17px 12px
            font-size: 12px
            color: #ababab
.player.song-view
  position: fixed
  bottom: 0
  left: 0
  width: 100%
  height: 107px
  .track-info
    display: none
  .play-operations
    display: flex
    justify-content: space-around
    align-items: center
    height: 80px
    .icon
      color: rgba(255, 255, 255, 0.5)
      &.icon-play-mode
        font-size: 19px
      &.icon-music-prev, &.icon-music-next
        font-size: 23px
        color: rgba(255, 255, 255, 0.8)
      &.icon-play-state
        font-size: 46px
        color: #ffffff
      &.icon-music-playlist
        font-size: 18px
  .progress
    display: flex
    align-items: center
    margin: 0 22px 0 20px
    .current-time, .track-duration
      flex: 0 0 31px
      font-size: 8px
      color: rgba(255, 255, 255, 0.5)
      text-align: left
    .track-duration
      text-align: right
    .progress-bar
      flex: 1
      position: relative
      width: w = 80%
      height: 2px
      background-color: rgba(255, 255, 255, 0.55)
      .fill
        position: absolute
        left: 0
        top: 0
        width: 0
        height: 2px
        background-color: #d33a31
      .indicator
        position: absolute
        left: -5px
        top: -5px
        width: 2px
        height: 2px
        background-color: #d23c30
        border: 5px solid #ffffff
        border-radius: 50%
.player.base
  border-1px-top(rgba(0, 0, 0, 0.1))
  position: fixed
  bottom: 0
  left: 0
  height: 49px
  width: 100%
  overflow: hidden
  background-color: rgba(255, 255, 255, 0.95)
  .progress
    display: none
  .track-info
    display: flex
    margin: 6px
    .cover
      margin-right: 6px
      width: 37px
      height: 37px
      img
        border-radius: 2px
    .detail
      .track-name
        font-size: 14px
        color: #323232
      .artist
        display: flex
        align-items: center
        justify-content: flex-start
        margin-top: 2px
        color: #808080
        .artist-name
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          .artist-name-item
            display: inline-block
            font-size: 12px
            &:after
              content: '/'
            &:last-child:after
              content: none
  .play-operations
    position: absolute
    right: -10px
    bottom: -10px
    display: flex
    .icon
      display: none
      width: 68px
      height: 68px
      text-align: center
      line-height: 68px
      border-radius: 50%
      active-background()
      &.icon-play-state
        display: inline-block
        margin-right: -21px
        vertical-align: middle
        font-size: 26px
        color: #4d4d4d
      &.icon-music-playlist
        display: inline-block
        vertical-align: middle
        font-size: 17px
        color: #4d4d4d

</style>