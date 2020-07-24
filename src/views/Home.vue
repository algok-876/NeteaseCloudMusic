<template>
  <div class="home">
    <slide-bar></slide-bar>
  </div>
</template>

<script>
import SlideBar from '../components/Home/SlideBar';
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
}
</style>
