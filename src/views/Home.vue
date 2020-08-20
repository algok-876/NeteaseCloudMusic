<template>
  <div>
    <div class="home">
      <slide-bar></slide-bar>
      <vue-scroll>
        <div class="main-container">
          <router-view></router-view>
        </div>
      </vue-scroll>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import SlideBar from '../components/SlideBar';
import Footer from '../components/Footer';
export default {
  name: 'Home',
  created () {
  },
  methods: {
  },
  components: {
    SlideBar,
    Footer
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/sass/layout/Home.scss';
</style>
