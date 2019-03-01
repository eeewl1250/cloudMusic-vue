<template>
  <div class="share-component">
    <span class="icon-share"
          @click="showContent"
    ></span>
    <popup :is-popped-up="isPoppedUp" v-on:hide="hideContent">
      <div class="share-content">
        <div class="internal-share border-1px">
          <div class="share-title">分享到云音乐：</div>
          <ul>
            <li v-for="(item, key) in shares.internal" :key="key">
              <div class="share-icon">
                <img :src="item.img" width="50" height="50"/>
              </div>
              <div class="share-name">{{ item.name }}</div>
            </li>
          </ul>
        </div>
        <div class="external-share">
          <div class="share-title">分享到站外：</div>
          <ul>
            <li v-for="(item, key) in shares.external" :key="key">
              <div class="share-icon">
                <img :src="item.img" width="50" height="50"/>
              </div>
              <div class="share-name">{{ item.name }}</div>
            </li>
          </ul>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import Popup from '@/components/Popup'

export default {
  name: 'Share',
  data () {
    return {
      isPoppedUp: false,
      shares: {
        internal: [
          {
            name: '云音乐动态',
            img: '../../static/img/share1.png'
          },
          {
            name: '私信',
            img: '../../static/img/share2.png'
          }
        ],
        external: [
          {
            name: '微信朋友圈',
            img: '../../static/img/share3.png'
          },
          {
            name: '微信好友',
            img: '../../static/img/share4.png'
          },
          {
            name: 'QQ空间',
            img: '../../static/img/share5.png'
          },
          {
            name: 'QQ好友',
            img: '../../static/img/share6.png'
          },
          {
            name: '微博',
            img: '../../static/img/share7.png'
          }
        ]
      }
    }
  },
  components: {
    popup: Popup
  },
  methods: {
    showContent () {
      this.isPoppedUp = true
      this.$util.stopBodyMove(this)
    },
    hideContent () {
      this.isPoppedUp = false
      this.$util.bodyMove(this)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../assets/stylus/mixin.styl'

.share-content
  height: 300px
  background-color: #f3f3f3
  border-top-left-radius: 10px
  border-top-right-radius: 10px
  .internal-share, .external-share
    padding-top: 22px
    font-size: 0
    .share-title
      margin-left: 15px
      font-size: 12px
      line-height: 12px
      text-align: left
      color: #929292
    ul
      display: flex
      margin: 0 2px
      li
        display: flex
        flex-direction: column
        align-items: center
        padding: 20px 0
        width: 72px
        text-align: center
        active-background()
        .share-icon
          width: 50px
          height: 50px
        .share-name
          margin-top: 9px
          font-size: 12px
          line-height: 12px
          color: #313131
          white-space: nowrap
  .internal-share
    border-1px(rgba(0, 0, 0, 0.1))
</style>