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
@import '../../assets/sass/components/Volume.scss';
</style>
