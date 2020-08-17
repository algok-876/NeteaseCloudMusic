<template>
  <div class="cur-song-show">
    <div class="al-pic">
      <img :src="curSongInfo.al.picUrl+'?param=100y100'" alt />
    </div>
    <div class="text">
      <p class="name">{{curSongInfo.al.name}}</p>
      <p class="ar">
        <span v-for="(ar, index) in curSongInfo.ar" :key="index">{{ar.name}}</span>
      </p>
    </div>
    <div class="icon">
      <p @click="likeSong(curSongInfo.id)">
        <Icon
          :custom="likelist.indexOf(curSongInfo.id) >= 0 ? 'iconfont icon-xihuan-wangyiicon' : 'iconfont icon-xihuan-kongpt'"
          :class="{like: likelist.indexOf(curSongInfo.id) >= 0}"
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
    ...mapState('player', ['curSongInfo']),
    ...mapState('user', ['likelist'])
  }
};
</script>

<style lang="scss" scoped>
.like {
  color: #cd2929;
}
.cur-song-show {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 7px;
  border-top: 1px solid #e1e1e2;
  .al-pic {
    width: 50px;
    height: 50px;
    border: 1px solid #e1e1e2;
    img {
      width: 100%;
    }
  }
  .text {
    flex: 1;
    margin: 0 7px;
    overflow: hidden;
    p {
      font-size: 12px;
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .ar {
      color: rgb(185, 185, 185);
      span:nth-child(n + 2) {
        &::before {
          content: "  /  ";
        }
      }
    }
  }
}
</style>
