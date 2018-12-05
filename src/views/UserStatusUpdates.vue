<template>
  <div class="status">
    <ul v-if="userReady">
      <!--<li v-for=""></li>-->
    </ul>
  </div>
</template>

<script>
export default {
  name: 'StatusUpdates',
  computed: {
    userReady () {
      return this.$store.state.userReady
    },
    user () {
      return this.$store.state.user
    }
  }
}
</script>

<style scoped>

</style>