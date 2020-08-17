<template>
  <div class="volume-control">
    <Icon custom="iconfont icon-laba" />
    <!-- 轨道 -->
    <div class="track-bar" ref='volumetrackBar' @click="onSeekBarClick" @mouseenter="pointVisible = true" @mouseleave="pointVisible = false">
      <!-- 进度条 -->
      <div class="play-bar" :style="{width: sliderWidth + '%'}">
        <!-- 小圆点 -->
        <span class="on-bar-point" @mousedown.prevent="onBarPointDown" v-show="pointVisible">
          <span class="inner-cricle"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['audio'],
  data () {
    return {
      sliderWidth: '',
      pointVisible: false
    };
  },
  methods: {
    // 单击轨道时
    onSeekBarClick (e) {
      if (!this.audio.currentSrc) return;
      const left = this.$refs.volumetrackBar.getBoundingClientRect().left;
      this.sliderWidth = (e.clientX - left) / this.$refs.volumetrackBar.clientWidth * 100;
      this.audio.volume = this.sliderWidth / 100;
    },
    // 拖动进度条
    onBarPointDown (e) {
      window.addEventListener('mousemove', this.onDropIng);
      window.addEventListener('mouseup', this.onDropEnd);
    },
    onDropIng (e) {
      this.pointVisible = true;
      const left = this.$refs.volumetrackBar.getBoundingClientRect().left;
      if (e.clientX - left >= 0 && e.clientX - left < this.$refs.volumetrackBar.clientWidth) {
        this.onSeekBarClick(e);
      }
    },
    onDropEnd (e) {
      this.pointVisible = false;
      window.removeEventListener('mousemove', this.onDropIng);
      window.removeEventListener('mouseup', this.onDropEnd);
    }
  }
};
</script>

<style lang="scss" scoped>
.volume-control{
  display: flex;
  width: 100%;
  align-items: center;
  i{
    color: RGB(102,102,102);
    margin-right: 10px;
  }
}
.track-bar{
  position: relative;
  width: 100%;
  height: 5px;
  border-radius: 50px;
  background-color: #C2C2C4;
  .play-bar{
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50px;
    background-color: RGB(232,60,60);
    left: 0;
    top: 0;
    .on-bar-point{
      position: absolute;
      right: -4px;
      top: -4px;
      width: 13px;
      height: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      border-radius: 50%;
      border: 1px solid #e1e1e2;
      cursor: pointer;
      &:hover{
        box-shadow: 0px 0px 5px 2px rgb(165, 165, 165);
      }
      .inner-cricle{
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: RGB(232,60,60);
      }
    }
  }
}
</style>
