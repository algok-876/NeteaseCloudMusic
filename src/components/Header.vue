<template>
  <header class="hd">
    <div class="left">
      <!-- logo -->
      <div class="logo">
        <a href="">
          <img src="../assets/logo.png" alt="">
        </a>
      </div>
      <!-- 前进后退按钮组 -->
      <ButtonGroup size="small">
          <Button ghost @click="$router.back()">
            <Icon type="ios-arrow-back" />
          </Button>
          <Button ghost>
            <Icon type="ios-arrow-forward" @click="$router.go(-1)"/>
          </Button>
      </ButtonGroup>
      <!-- 搜索 -->
      <div class="search">
        <search></search>
      </div>
    </div>
    <div class="right">
      <AvatarLogin></AvatarLogin>
    </div>
  </header>
</template>

<script>
import AvatarLogin from './AvatarLogin';
import search from '../components/search/search';
export default {
  data () {
    return {
      searchKeywords: ''
    };
  },
  methods: {},
  components: {
    AvatarLogin,
    search
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/sass/layout/Header.scss';
</style>
