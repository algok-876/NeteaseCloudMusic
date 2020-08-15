<template>
  <div class="find">
    <div class="find-menu">
      <router-link to="/find/recommendation">个性推荐</router-link>
      <router-link to="/find/playlist">歌单</router-link>
      <router-link to="/find/radiohost">主播电台</router-link>
      <router-link to="/find/rankinglist">排行榜</router-link>
      <router-link to="/find/singer">歌手</router-link>
      <router-link to="/find/newmusic">最新音乐</router-link>
    </div>
    <div class="content-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
.find{
  padding: 0 25px;
  .find-menu{
    width: 100%;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #e1e1e2;
    a{
      width: 68px;
      display: block;
      color: #000;
      letter-spacing: 1px;
      font-size: 16px;
      line-height: 45px;
      margin-left: 20px;
      text-align: center;
      &:first-child{
        margin: 0;
      }
      &:hover{
        color: #c62f2f;
      }
    }
    .router-link-active{
      color: #c62f2f;
      border-bottom: 2px solid #c62f2f;
    }
  }
}
</style>
