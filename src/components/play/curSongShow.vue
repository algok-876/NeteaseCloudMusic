<template>
  <div class="cur-song-show" v-if="curAudioInfo">
    <div class="al-pic">
      <img :src="curAudioInfo.al.picUrl+'?param=100y100'" alt />
    </div>
    <div class="text">
      <p class="name">{{curAudioInfo.name}}</p>
      <p class="ar">
        <span v-for="(ar, index) in curAudioInfo.ar" :key="index">{{ar.name}}</span>
      </p>
    </div>
    <div class="icon">
      <p @click="likeSong(curAudioInfo.id)">
        <Icon
          :custom="likelist.indexOf(curAudioInfo.id) >= 0 ? 'iconfont icon-xihuan-wangyiicon' : 'iconfont icon-xihuan-kongpt'"
          :class="{like: likelist.indexOf(curAudioInfo.id) >= 0}"
        />
      </p>
      <p>
        <Icon custom="iconfont icon-fenxiang" />
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  methods: {
    async likeSong (id) {
      // eslint-disable-next-line no-unneeded-ternary
      const like = this.likelist.indexOf(id) <= 0 ? true : false;
      const res = await this.$remoteInterface.likeSong(id, like);
      if (res.code === 200) {
        if (like) {
          this.$Message.success('已添加到我喜欢的音乐');
        } else {
          this.$Message.info('已取消了喜欢');
        }
      } else {
        this.$Message.warning('出错啦，请重试！');
      }
      this.$store.dispatch(
        'user/getLikelist',
        this.$store.state.login.loginInfo.userData.profile.userId
      );
    }
  },
  computed: {
    ...mapState('player', ['curAudioInfo']),
    ...mapState('user', ['likelist'])
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/sass/components/curSongShow.scss';
</style>
