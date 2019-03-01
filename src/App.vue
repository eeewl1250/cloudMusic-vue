<template>
  <div id="app">
    <div class="main">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <div class="footer-player">
      <player></player>
    </div>
  </div>
</template>

<script>
import Player from '@/components/Player'

export default {
  name: 'app',
  components: {
    player: Player
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
#app
  display: flex
  flex-direction: column
  .main
    flex: 1
  .footer-player
    flex: 0 0 49px
</style>
