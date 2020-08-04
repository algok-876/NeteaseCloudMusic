<template>
  <div class="slidebar">
    <vue-scroll>
      <div class="wrapper">
        <slidemenu title="推荐" :menulist="recMenu"></slidemenu>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
import slidemenu from '../components/menu';
export default {
  data () {
    return {
      // 推荐菜单
      recMenu: [
        { href: '/find', icon: 'iconfont icon-yinyue', name: '发现音乐' },
        { href: '/fm', icon: 'iconfont icon-FM', name: '私人FM' },
        { href: '/broadcast', icon: 'iconfont icon-zhibobofangshexiangjiguankanxianxing', name: 'LOOK直播' },
        { href: '/video', icon: 'iconfont icon-shipin2', name: '视频' },
        { href: '/friend', icon: 'iconfont icon-pengyou', name: '朋友' }
      ]
    };
  },
  components: {
    slidemenu
  }
};
</script>

<style lang="scss" scoped>
.slidebar{
  width: 200px;
  height: 100%;
  background-color: rgb(245, 245, 246);
  box-sizing: content-box;
  border-right: 1px solid rgb(225, 225, 226);
}
.wrapper{
  width: 200px;
  // padding-right: 8px;
}
</style>
