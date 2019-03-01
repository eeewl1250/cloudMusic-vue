<template>
  <span class="back-component icon-left-arrow"
        @click="goBack"
  ></span>
</template>

<script>
export default {
  name: 'Back',
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
