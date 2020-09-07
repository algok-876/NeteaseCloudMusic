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
    @ended="onEnded"
    ></audio>
    <!-- 控制区 -->
    <div class="audio-control">
      <div class="switch">
        <span class="switch-btn" @click="lastSong">
          <Icon custom="iconfont icon-shangyishou3" size="20"/>
        </span>
        <span class="switch-btn">
          <Icon :custom="playing?'iconfont icon-zantingtingzhi1':'iconfont icon-bofangfmbofangliebiao'" size="26" @click="pauseOrPlay" />
        </span>
        <span class="switch-btn" @click="nextSong">
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
      <span class="playMode"
      @click="switchMode"
      :title="modeTip"
      >
        <Icon :custom="icons[curPlayMode]" size="20"/>
      </span>
      <span
      @click="drawerVisible = true"
      ><Icon custom="iconfont icon-bofangliebiao" size="18"/></span>
    </div>
    <!-- 播放列表 -->
    <playDrawer :visible="drawerVisible" @on-close="drawerVisible = false"></playDrawer>
    <div class="mode-tip" :style="{left: modeTipLeft + 'px'}" ref="modetip" v-show="modeTipVisible">{{modeTip}}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Volume from './Volume';
import playDrawer from './playDrawer';
import _ from 'lodash';
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
      timer: null,
      titleTimer: null,
      // 模式提示
      modeTipVisible: false,
      modeTipLeft: '',
      debounceFunc: _.debounce(() => { this.modeTipVisible = false; }, 1000),
      randomSongs: [],
      randomSongOrder: ''
    };
  },
  mounted () {
  },
  methods: {
    clearTitleTimer () {
      clearInterval(this.titleTimer);
      this.titleTimer = null;
    },
    // 开始播放
    startPlay () {
      document.title = `正在播放：《${this.curAudioInfo.name}》`;
      this.titleTimer = setInterval(() => {
        document.title = document.title.slice(1, document.title.length) + document.title.slice(0, 1);
      }, 1000);
      this.timer = clearInterval(this.timer);
      this.$refs.audio.play();
      this.playing = true;
      this.$store.commit('player/setPlayStatus', true);
    },
    // 暂停播放
    pausePlay () {
      document.title = '稻田音乐';
      this.clearTitleTimer();
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
      this.$store.dispatch('player/curAndhistory');
      this.clearTitleTimer();
      this.curTime = res.target.currentTime;
      this.totalTime = res.target.duration;
      this.startPlay();
    },
    // 媒体播放时间发生变化时
    onTimeupdate (res) {
      this.curTime = res.target.currentTime;
      this.sliderWidth = parseInt(this.curTime) / parseInt(this.totalTime) * 100;
    },
    // 播放结束
    onEnded () {
      document.title = '稻田音乐';
      this.clearTitleTimer();
      // 根据播放模式自动播放下一首歌曲
      if (this.curPlayMode === 1) {
        this.clearTitleTimer();
        this.startPlay();
      } else {
        this.nextSong();
      }
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
        this.clearTitleTimer();
        this.playing = false;
        setTimeout(() => {
          this.pausePlay();
          this.$refs.audio.volume = 1;
        }, 800);
        this.timer = setInterval(() => {
          if (this.$refs.audio.volume <= 0.015) {
            this.pausePlay();
            this.timer = clearInterval(this.timer);
            this.titleTimer = clearInterval(this.titleTimer);
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
      this.$refs.audio.pause();
      this.playing = false;
      const left = this.$refs.trackBar.getBoundingClientRect().left;
      this.sliderWidth = (e.clientX - left) / this.$refs.trackBar.clientWidth * 100;
      this.$refs.audio.currentTime = (this.sliderWidth / 100) * this.$refs.audio.duration;
    },
    onDropEnd (e) {
      this.$refs.audio.play();
      window.removeEventListener('mousemove', this.onDropIng);
      window.removeEventListener('mouseup', this.onDropEnd);
    },
    // 切换播放模式
    async switchMode (e) {
      this.modeTipVisible = true;
      this.modeTipLeft = e.target.getBoundingClientRect().left - 48;
      let mode = this.curPlayMode + 1;
      if (mode >= this.icons.length) {
        mode = 0;
      }
      let heartList = [];
      if (mode === 3) {
        heartList = await this.$remoteInterface.returnHeartBeatList(this.curAudioInfo, this.curAudioInfo.id, this.curAudioInfo.pid);
      } else {
        // 恢复播放列表
        this.$store.commit('player/restorePlayList');
      }
      this.$store.commit('player/setPlayMode', { mode, heartbeatList: heartList });
      this.debounceFunc();
    },
    // 上一首
    lastSong () {
      this.clearTitleTimer();
      let lastSongOrder = '';
      if (this.curPlayMode === 0 || this.curPlayMode === 3) {
        lastSongOrder = this.curAudioInfo.order - 1;
        if (lastSongOrder < 0) {
          lastSongOrder = this.playlist.length - 1;
        }
        this.$store.commit('player/setAudioData', this.playlist[lastSongOrder]);
      } else if (this.curPlayMode === 2) {
        lastSongOrder = this.randomSongOrder--;
        // 如果当前随机播放的歌曲序号小于0,那么随机播放，将播放歌曲插入随机播放记录列表的第一位
        if (this.randomSongOrder < 0) {
          lastSongOrder = _.random(0, this.playlist.length - 1);
          this.randomSongs.splice(0, 0, this.playlist[lastSongOrder]);
          this.$store.commit('player/setAudioData', this.randomSongs[0]);
          this.randomSongOrder = 0;
          return;
        }
        this.$store.commit('player/setAudioData', this.randomSongs[lastSongOrder]);
      }
    },
    nextSong () {
      // 清除标题滚动定时器
      this.clearTitleTimer();
      let nextSongOrder = '';
      if (this.curPlayMode === 0 || this.curPlayMode === 1 || this.curPlayMode === 3) {
        nextSongOrder = this.curAudioInfo.order + 1;
        console.log(nextSongOrder);
        if (nextSongOrder > this.playlist.length - 1) {
          nextSongOrder = 0;
        }
      } else if (this.curPlayMode === 2) {
        // 如果当前随机播放的歌曲序号小于随机歌曲记录列表，按顺序往下继续播放
        if (this.randomSongOrder <= this.randomSongs.length - 1) {
          nextSongOrder = this.randomSongOrder++;
          this.$store.commit('player/setAudioData', this.randomSongs[nextSongOrder]);
          return;
        }
        // 否则往下继续随机播放，并加入随机歌曲记录列表
        nextSongOrder = _.random(0, this.playlist.length - 1);
        this.randomSongs.push(this.playlist[nextSongOrder]);
        this.randomSongOrder = this.randomSongs.length - 1;
      }
      this.$store.commit('player/setAudioData', this.playlist[nextSongOrder]);
    }
  },
  computed: {
    ...mapState('player', ['curAudioInfo', 'playlist', 'curPlayMode', 'favoritePlaylist']),
    ...mapState('login', ['loginInfo']),
    modeTip () {
      let modetext = '';
      switch (this.curPlayMode) {
        case 0:
          modetext = '顺序播放';
          break;
        case 1:
          modetext = '单曲循环';
          break;
        case 2:
          modetext = '随机播放';
          break;
        case 3:
          modetext = '心动模式';
          break;
      }
      return modetext;
    },
    // 播放模式图标
    icons () {
      const defaultIcons = [
        'iconfont icon-xunhuan-wangyiicon',
        'iconfont icon-loop',
        'iconfont icon-suijibofang-wangyiicon'
      ];
      if (this.loginInfo.status && this.curAudioInfo.id && this.favoritePlaylist) {
        defaultIcons.push('iconfont icon-xindong');
      }
      return defaultIcons;
    }
  },
  components: {
    Volume,
    playDrawer
  },
  watch: {
    curPlayMode (newValue, oldValue) {
      if (oldValue === 3) {
        this.$store.commit('player/setAudioData', this.playlist[0]);
      }
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/sass/components/CustomAudio.scss';
</style>
