<template>
  <div id="app">
    <!-- 头部 -->
    <Header></Header>
    <router-view/>
  </div>
</template>

<script>
import Header from './components/Header';
export default {
  components: {
    Header
  }
};
</script>

<style lang="scss">
#app {
  font-family: 'Chinese Quote', 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
