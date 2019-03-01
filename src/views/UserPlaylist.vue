<template>
  <div class="user-playlist" v-if="playlistReady">
      <div class="lists" v-for="(listType, key) in playlist" :key="key">
        <div class="title">
          <span class="text">{{ getNameByType(listType.type) }}</span>
          <span class="count" v-if="listType.data">({{ listType.data.length }})</span>
        </div>
        <ul class="content">
          <li class="list-item"
              v-for="(list, lIdx) in listType.data"
              :key="lIdx"
              @click="$router.push({ path: '/playlist', query: { id: list.id } })"
          >
            <div class="cover">
              <img :src="list.cover" width="54" height="54">
            </div>
            <div class="detail border-1px">
              <div class="name">{{ list.name }}</div>
              <div class="count">
                <span class="songsNum">{{ list.countSong }}首</span>
                <span class="createdBy" v-if="listType.type === 'collection'">，by {{ list.username }}</span>
                <span class="times" v-if="list.countPlay">，播放{{ list.countPlay }}次</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
export default {
  name: 'UserPlaylist',
  computed: {
    playlistReady () {
      return this.$store.getters.initPlaylist
    },
    playlist () {
      return this.$store.state.playlist
    }
  },
  methods: {
    getNameByType (type) {
      let typeMap = {
        creation: '歌单',
        collection: '收藏的歌单'
      }
      return typeMap[type]
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../assets/stylus/mixin.styl'

.user-playlist
  font-size: 14px
  color: black
  .lists
    .title
      padding: 7px 14px 4px 11px
      background-color: rgba(0, 0, 0, 0.05)
      .text, .count
        font-size: 13px
        color: #666666
    .content
      .list-item
        display: flex
        .cover
          margin: 3px 0 3px 6px
          flex: 0 0 60px
          width: 54px
          height: 54px
          img
            border-radius: 3px
        &:last-child
          .detail
            border-none()
        .detail
          flex: 1
          margin-right: 13px
          font-size: 12px
          border-1px(rgba(0, 0, 0, 0.1))
          overflow: hidden
          .name
            margin-top: 13px
            overflow: hidden
            white-space: nowrap
            text-overflow: ellipsis
            font-size: 15px
            color: #333333
          .count
            margin: 6px 3px 0 0
            overflow: hidden
            white-space: nowrap
            text-overflow: ellipsis
            .songsNum, .createdBy, .times
              font-size: 14px
              color: #888888
            .createdBy, .times
              margin-left: 6px
</style>
