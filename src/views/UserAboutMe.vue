<template>
  <div class="about-me">
    <dl class="info">
      <dt class="title">个人信息</dt>
      <dd class="content level">等级：0</dd>
      <dd class="content address">地区：浙江省 杭州市</dd>
    </dl>
    <dl class="intro">
      <dt class="title">个人介绍</dt>
      <dd class="content">我有一头小毛驴，我从来也不骑</dd>
    </dl>
  </div>
</template>

<script>

const ERR_OK = 0

export default {
  name: 'AboutMe'
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../assets/stylus/mixin.styl'

.about-me
  .info, .intro, .comments
    padding: 0 11px
    .title
      margin: 20px 0 4px
      font-size: 15px
      font-weight: 700
      color: #333333
    .content
      margin-top: 13px
      font-size: 14px
      color: #818181
  .info
    margin-bottom: 39px
  .intro
    margin-bottom: 47px
  .comments
    .content
      margin-top: 0
      .comment
        padding: 15px 0 16px
        border-1px(rgba(0, 0, 0, 0.1))
        .object
          font-size: 13px
          color: #989898
        .content
          margin-top: 14px
          font-size: 15px
          color: #333333
        .create-at
          margin-top: 20px
          font-size: 12px
          color: #989898
</style>