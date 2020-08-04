<template>
  <div class="home">
    <slide-bar></slide-bar>
    <vue-scroll>
      <div class="main-container">
        <router-view></router-view>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
import SlideBar from '../components/SlideBar';
export default {
  name: 'Home',
  created () {
  },
  methods: {
  },
  components: {
    SlideBar
  }
};
</script>

<style lang="scss" scoped>
.home{
  height: calc(100vh - 100px);
  display: flex;
  .main-container{
    padding: 0 25px;
    flex: 1;
    height: 100%;
    overflow: hidden;
  }
}
</style>
