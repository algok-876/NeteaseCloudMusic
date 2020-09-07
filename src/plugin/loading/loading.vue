<template>
  <div class="mask" v-show="show">
    <div>
      <div class="amin">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="text">{{text}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '加载中...'
    },
    show: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin amin($name, $time, $delay) {
  animation: $name $time $delay alternate infinite;
}
.mask{
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, .5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  .amin{
    display: flex;
    align-items: center;
    height: 50px;
    span{
      display: inline-block;
      width: 4px;
      height: 20px;
      margin: 15px 2px;
      background-color: #fff;
      &:nth-child(1){
        @include amin(amin-1, .4s, 0s);
      }
      &:nth-child(2){
        @include amin(amin-2, .4s, .1s);
      }
      &:nth-child(3){
        @include amin(amin-3, .4s, .2s);
      }
      &:nth-child(4){
        @include amin(amin-4, .4s, .3s);
      }
      &:nth-child(5){
        @include amin(amin-5, .4s, .4s);
      }
      &:nth-child(6){
        @include amin(amin-6, .4s, .5s);
      }
      @keyframes amin-1 {
        from {
          height: 20px;
        } to {
          height: 33px;
        }
      }
      @keyframes amin-2 {
        from {
          height: 20px;
        } to {
          height: 33px;
        }
      }
      @keyframes amin-3 {
        from {
          height: 20px;
        } to {
          height: 33px;
        }
      }
      @keyframes amin-4 {
        from {
          height: 20px;
        } to {
          height: 33px;
        }
      }
      @keyframes amin-5 {
        from {
          height: 20px;
        } to {
          height: 33px;
        }
      }
      @keyframes amin-6 {
        from {
          height: 20px;
        } to {
          height: 33px;
        }
      }
    }
  }
  .text{
    text-align: center;
    font-size: 18px;
  }
}
</style>
