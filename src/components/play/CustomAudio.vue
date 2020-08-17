<template>
  <div class="audio-wrapper">
    <audio
    :src="curAudioInfo.songurl"
    v-show="isVideo"
    ref="audio"
    @play="onPlay"
    @pause="onPause"
    @loadedmetadata="onLoadedmetadata"
    @timeupdate="onTimeupdate"
    @load="onLoad"
    ></audio>
    <!-- 控制区 -->
    <div class="audio-control">
      <div class="switch">
        <span class="switch-btn">
          <Icon custom="iconfont icon-shangyishou3" size="20"/>
        </span>
        <span class="switch-btn">
          <Icon :custom="playing?'iconfont icon-zantingtingzhi1':'iconfont icon-bofangfmbofangliebiao'" size="26" @click="pauseOrPlay" />
        </span>
        <span class="switch-btn">
          <Icon custom="iconfont icon-shangyishou2" size="20"/>
        </span>
      </div>
      <div class="process">
        <span class="time cur-time">{{curTime | duration}}</span>
        <!-- 轨道 -->
        <div class="track-bar" ref='trackBar' @click="onSeekBarClick">
          <!-- 进度条 -->
          <div class="play-bar" :style="{width: sliderWidth + '%'}">
            <!-- 小圆点 -->
            <span class="on-bar-point" @mousedown.prevent="onBarPointDown">
              <span class="inner-cricle"></span>
            </span>
          </div>
        </div>
        <span class="time total-time">{{totalTime | duration}}</span>
      </div>
      <div class="volume">
        <Volume :audio="$refs.audio"></Volume>
      </div>
    </div>
    <div class="assist">
      <span
      @click="drawerVisible = true"
      ><Icon custom="iconfont icon-bofangliebiao" size="18"/></span>
    </div>
    <!-- 播放列表 -->
    <playDrawer :visible="drawerVisible" @on-close="drawerVisible = false"></playDrawer>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Volume from './Volume';
import playDrawer from './playDrawer';
export default {
  props: {
    // 是否是视频，如果不则是音频
    isVideo: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      curTime: 0,
      totalTime: 0,
      playing: false,
      sliderWidth: '',
      drawerVisible: false,
      timer: null
    };
  },
  mounted () {
  },
  methods: {
    // 开始播放
    startPlay () {
      this.timer = clearInterval(this.timer);
      this.$refs.audio.play();
      this.playing = true;
      this.$store.commit('player/setPlayStatus', true);
    },
    // 暂停播放
    pausePlay () {
      this.timer = clearInterval(this.timer);
      this.$refs.audio.pause();
      this.playing = false;
      this.$store.commit('player/setPlayStatus', false);
    },
    // 开始播放
    onPlay () {
      this.playing = true;
    },
    // 暂停播放时
    onPause () {
      this.playing = false;
    },
    // 加载元数据时
    onLoadedmetadata (res) {
      this.curTime = res.target.currentTime;
      this.totalTime = res.target.duration;
      this.startPlay();
    },
    // 媒体播放时间发生变化时
    onTimeupdate (res) {
      this.curTime = res.target.currentTime;
      this.sliderWidth = parseInt(this.curTime) / parseInt(this.totalTime) * 100;
    },
    // 加载成功时
    onLoad () {
      console.log('开始播放了');
      this.startPlay();
    },
    // 单击播放/暂停按钮
    pauseOrPlay () {
      if (!this.$refs.audio.currentSrc) return;
      if (this.playing) {
        this.playing = false;
        setTimeout(() => {
          this.pausePlay();
          this.$refs.audio.volume = 1;
        }, 800);
        this.timer = setInterval(() => {
          if (this.$refs.audio.volume <= 0.015) {
            this.pausePlay();
            this.timer = clearInterval(this.timer);
            console.log(this.$refs.audio.volume);
            return;
          };
          this.$refs.audio.volume -= 0.0125;
        }, 10);
      } else {
        this.$refs.audio.volume = 1;
        this.startPlay();
      }
    },
    // 单击轨道时
    onSeekBarClick (e) {
      if (!this.curAudioInfo.playing) return;
      const left = this.$refs.trackBar.getBoundingClientRect().left;
      this.sliderWidth = (e.clientX - left) / this.$refs.trackBar.clientWidth * 100;
      this.$refs.audio.currentTime = (this.sliderWidth / 100) * this.$refs.audio.duration;
    },
    // 拖动进度条
    onBarPointDown (e) {
      if (!this.curAudioInfo.playing) return;
      window.addEventListener('mousemove', this.onDropIng);
      window.addEventListener('mouseup', this.onDropEnd);
    },
    onDropIng (e) {
      this.pausePlay();
      const left = this.$refs.trackBar.getBoundingClientRect().left;
      this.sliderWidth = (e.clientX - left) / this.$refs.trackBar.clientWidth * 100;
      this.$refs.audio.currentTime = (this.sliderWidth / 100) * this.$refs.audio.duration;
    },
    onDropEnd (e) {
      this.startPlay();
      window.removeEventListener('mousemove', this.onDropIng);
      window.removeEventListener('mouseup', this.onDropEnd);
    }
  },
  computed: {
    ...mapState('player', ['curAudioInfo'])
  },
  components: {
    Volume,
    playDrawer
  }
};
</script>

<style lang="scss">
.audio-wrapper{
  width: 100%;
  display: flex;
}
.audio-control{
  display: flex;
  margin-right: 15px;
  flex: 1;
  // 切换区域
  .switch{
    display: flex;
    width: 200px;
    justify-content: space-evenly;
    align-items: center;
    .switch-btn{
      display: inline-block;
      border-radius: 50%;
      background-color: RGB(232,60,60);
      padding: 5px;
      cursor: pointer;
      transition: all .3s;
      &:hover{
        background-color: #c62f2f;
      }
      i {
        color: #fff;
      }
    }
  }
  .volume{
    width: 100px;
    display: flex;
    align-items: center;
  }
  .process{
    display: flex;
    align-items: center;
    flex: 1;
    .time{
      display: inline-block;
      margin: 0 15px;
      &.cur-time{
        margin-right: 18px;
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
        width: 0;
        transition: width .4s ease;
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
  }
}
.assist{
  display: flex;
  align-items: center;
  margin-right: 15px;
  color: RGB(102,102,102);
  span{
    cursor: pointer;
  }
}
</style>
