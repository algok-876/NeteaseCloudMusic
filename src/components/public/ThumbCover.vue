<template>
  <div class="cover">
    <div class="playCount">
      <Icon custom="iconfont icon-erji" />
      <span>{{Math.trunc(playCount / 10000)}}万</span>
    </div>
    <div class="img-box">
      <img v-lazy="src">
    </div>
    <div class="playBtn" v-if="playBtn">
      <Icon custom="iconfont icon-bofang2" size="33" />
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      required: true,
      type: String
    },
    playCount: {
      required: true,
      type: Number
    },
    playBtn: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="scss" scoped>
.cover{
  position: relative;
  border: 1px solid #e1e1e2;
  cursor: pointer;
  &:hover{
    .playBtn{
      opacity: 1;
    }
  }
  .playCount{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: right;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.8), transparent 50%);
    padding: 0 5px;
    color: #fff;
  }
  .img-box{
    width: 100%;
    img{
      display: block;
      width: 100%;
    }
  }
  .playBtn{
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: #fff;
    opacity: 0;
    border-radius: 50%;
    transition: all .4s;
    background-color: rgba(0, 0, 0, .3);
    i{
      display: block;
    }
  }
}
</style>
