<template>
  <header class="hd">
    <div class="left">
      <!-- logo -->
      <div class="logo">
        <a href="">
          <img src="../../assets/logo.png" alt="">
        </a>
      </div>
      <!-- 前进后退按钮组 -->
      <ButtonGroup size="small">
          <Button ghost>
            <Icon type="ios-arrow-back" />
          </Button>
          <Button ghost>
            <Icon type="ios-arrow-forward" />
          </Button>
      </ButtonGroup>
      <!-- 搜索 -->
      <div class="search">
        <Input placeholder="搜索音乐,视频,歌词,电台" style="width: 250px" size="small">
          <Icon type="ios-search" slot="suffix" />
        </Input>
      </div>
    </div>
    <div class="right">
      <AvatarLogin></AvatarLogin>
    </div>
  </header>
</template>

<script>
import AvatarLogin from './Header/AvatarLogin';
export default {
  data () {
    return {
      searchKeywords: ''
    };
  },
  methods: {},
  components: {
    AvatarLogin
  }
};
</script>

<style lang="scss" scoped>
.hd{
  height: 50px;
  background-color: rgb(198, 47, 47);
  display: flex;
  justify-content: space-between;
  .left{
    display: flex;
    align-items: center;
    .logo{
      font-size: 0;
      width: 200px;
    }
    .search{
      display: flex;
      justify-content: center;
      margin-left: 35px;
    }
  }
  .right{
    display: flex;
    align-items: center;
    margin-right: 30px;
  }
}
</style>
