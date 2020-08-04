<template>
  <div id="app">
    <!-- 头部 -->
    <Header></Header>
    <router-view/>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './components/Header';
import Footer from './components/Footer';
export default {
  components: {
    Header,
    Footer
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
