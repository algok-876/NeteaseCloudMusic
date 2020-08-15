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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
