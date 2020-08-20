<template>
  <div class="textMenu" :style="menuStyles" ref="list">
    <ul class="menu">
      <li>
        <Icon custom="iconfont icon-play" :size="18"/>
        <span>播放</span>
      </li>
      <li  style="border-bottom:1px solid #e1e1e2">
        <Icon custom="iconfont icon-xiayishoubofang" :size="18"/>
        <span>下一首播放</span>
      </li>
      <li>
        <Icon custom="iconfont icon-fenxiang2" :size="18"/>
        <span>分享</span>
      </li>
      <li>
        <Icon custom="iconfont icon-fuzhilianjie" :size="18"/>
        <span>复制链接</span>
      </li>
      <li>
        <Icon custom="iconfont icon-play" :size="18"/>
        <span>下载全部</span>
      </li>
      <li style="border-bottom:1px solid #e1e1e2">
        <Icon custom="iconfont icon-fuzhi" :size="18"/>
        <span>复制已下载的mp3文件</span>
      </li>
      <li v-if="curPlaylistInfo.type!=='fav' && curPlaylistInfo.type!=='subscribe'">
        <Icon custom="iconfont icon-bianji" :size="18"/>
        <span>编辑歌单信息</span>
      </li>
      <li @click="deletePlaylist" v-if="curPlaylistInfo.type!=='fav'">
        <Icon custom="iconfont icon-shanchu" :size="20"/>
        <span>删除歌单</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    width: {
      type: String,
      default: '200px'
    },
    top: {
      required: true,
      type: String,
      default: '0'
    },
    left: {
      required: true,
      type: String,
      default: '0'
    }
  },
  mounted () {
    this.menuStyles = {
      width: this.width,
      top: parseInt(this.top) + this.$refs.list.clientHeight > document.body.clientHeight ? parseInt(this.top) - this.$refs.list.clientHeight + 'px' : this.top,
      left: this.left
    };
  },
  updated () {
    this.menuStyles.top = parseInt(this.top) + this.$refs.list.clientHeight > document.body.clientHeight ? parseInt(this.top) - this.$refs.list.clientHeight + 'px' : this.top;
    this.menuStyles.left = this.left;
  },
  data () {
    return {
      menuStyles: {}
    };
  },
  methods: {
    // 删除歌单
    deletePlaylist () {
      console.log('delete');
      this.$Modal.confirm({
        title: '删除用户歌单',
        content: '<p>确认删除该歌单吗？</p>',
        onOk: async () => {
          const res = await this.$remoteInterface.deletePlaylist(this.curPlaylistInfo.id);
          if (res.code === 200) {
            // 删除成功后需要获取用户歌单
            this.$store.dispatch('user/getUserPlayList', this.$store.state.login.loginInfo.userData.profile.userId);
          }
        }
      });
    }
  },
  computed: {
    ...mapState('slidebar', ['curPlaylistInfo'])
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/sass/components/ContextMenu.scss';
</style>
