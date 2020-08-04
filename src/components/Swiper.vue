<template>
  <div class="swiper-warpper">
    <swiper :options="options" ref="mySwiper">
      <swiper-slide  v-for="(banner, i) in banners" :key="i">
        <img :src="banner.imageUrl">
        <span class="typeTitle">{{banner.typeTitle}}</span>
      </swiper-slide>
    </swiper>
    <div class="swiper-pagination"></div>
    <div class="swiper-scrollbar" style="height: 4px;"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
export default {
  props: ['banners'],
  mounted () {
    this.$refs.mySwiper.$swiper.slideTo(1);
  },
  data () {
    return {
      options: {
        autoplay: true,
        speed: 800,
        delay: 5000,
        loop: true,
        effect: 'coverflow',
        slidesPerView: 2,
        centeredSlides: true,
        touchRatio: 0.1,
        pagination: {
          el: '.swiper-pagination',
          bulletClass: 'my-bullet'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        scrollbar: {
          el: '.swiper-scrollbar'
        },
        coverflowEffect: {
          rotate: 50,
          stretch: 140,
          depth: 300,
          modifier: 1,
          slideShadows: false
        }
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.swiper-warpper{
  position: relative;
  margin-top: 10px;
  .swiper-button-prev,.swiper-button-next{
    &::after{
      font-size: 20px;
    }
    outline: none;
  }
  .swiper-pagination{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .swiper-slide{
    cursor: pointer;
    .typeTitle{
      display: block;
      position: absolute;
      right: -4px;
      bottom: 20px;
      padding: 2px 10px 2px 15px;
      border-radius: 50px 0 0 50px;
      background-color: red;
      font-size: 12px;
      color: #fff;
    }
  }
  .my-bullet{
    width: 20px;
    height: 3px;
    background-color: #cccccc;
    margin: 0 5px;
  }
}
.swiper-slide{
  img{
    width: 100%;
  }
}
</style>
