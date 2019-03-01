<template>
  <div class="popup-component" v-if="isShowed">
    <div class="background" @click="hideContent"></div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    isPoppedUp: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShowed: false
    }
  },
  watch: {
    isPoppedUp (val) {
      this.isShowed = val
    }
  },
  methods: {
    hideContent () {
      this.isShowed = false
      this.$emit('hide')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.popup-component
  .background
    position: fixed
    z-index: 100
    left: 0
    right: 0
    top: 0
    bottom: 0
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, 0.3)
  .content
    position: fixed
    z-index: 100
    left: 0
    right: 0
    bottom: 0
    width: 100%
</style>