<template>
  <table class="song-table" cellspacing="0">
    <thead>
      <tr>
        <td></td>
        <td>操作</td>
        <td>音乐标题</td>
        <td>歌手</td>
        <td>专辑</td>
        <td>时长</td>
      </tr>
    </thead>
    <tbody @dblclick="delegation">
      <tr v-for="(song, index) in songs" :key="index" :class="{active: index === activeTr}" @click="activeTr = index">
        <td style="max-width:50px;text-align:center" :i="index">
          <span v-if="song.id!==curAudioInfo.id">
            {{index + 1 >= 10 ? index + 1: '0'+ (index + 1)}}
          </span>
          <div v-else>
            <Icon :custom="curAudioInfo.playing?'iconfont icon-laba': 'iconfont icon-wushengyinkuai'" size="18" style="color:#c62f2f"/>
          </div>
        </td>
        <td style="max-width:80px" :i="index">
          <span @click="likeSong(song.id, index)">
            <Icon :custom="likelist.indexOf(song.id) >= 0 ? 'iconfont icon-xihuan-wangyiicon' : 'iconfont icon-xihuan-kongpt'" :class="{like: likelist.indexOf(song.id) >= 0}"/>
          </span>
          <span>
            <Icon custom="iconfont icon-xiazai1" size="16" @click="download(song.name, song.songurl)"/>
          </span>
        </td>
        <td :title="song.name" :i="index">
          <span>{{song.name}}</span>
          <Icon v-if="song.mv" custom="iconfont icon-mv" style="display:inline-block;margin-left:10px;color:#cd2929"></Icon>
        </td>
        <td style="max-width:400px" class="songers" :i="index">
          <span v-for="(ar, index) in song.ar" :key="index">{{ar.name}}</span>
        </td>
        <td style="max-width:230px" :title="song.al.name" :i="index">
          <span>{{song.al.name}}</span>
        </td>
        <td style="max-width:100px" :i="index">
          <span>{{song.dt | duration(false)}}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import downloadMp3 from '../func/download';
import { mapState } from 'vuex';
export default {
  props: ['songs', 'type'],
  data () {
    return {
      activeTr: ''
    };
  },
  methods: {
    async likeSong (id, index) {
      // eslint-disable-next-line no-unneeded-ternary
      const like = this.likelist.indexOf(id) <= 0 ? true : false;
      let res = null;
      // 取消喜欢并且歌单类型为用户喜欢的歌曲歌单
      if (!like && this.type === 'like') {
        this.$Modal.confirm({
          title: '取消喜欢确认',
          content: '<p>确定将选中歌曲从我喜欢的音乐中删除?</p>',
          cancelText: '不，再想想',
          onOk: async () => {
            res = await this.$remoteInterface.likeSong(id, like);
            this.$store.dispatch('user/getLikelist', this.$store.state.login.loginInfo.userData.profile.userId);
            this.$Message.info('已删除');
            if (res.code === 200) {
              this.$emit('refresh', index);
            } else {
              this.$Message.warning('出错啦，请重试！');
            }
          }
        });
        return;
      }
      // 否则为普通歌单，普通歌单不用弹出取消确认对话框
      res = await this.$remoteInterface.likeSong(id, like);
      if (res.code === 200) {
        if (like) {
          this.$Message.success('已添加到我喜欢的音乐');
        } else {
          this.$Message.info('已取消了喜欢');
        }
      } else {
        this.$Message.warning('出错啦，请重试！');
      }
      this.$store.dispatch('user/getLikelist', this.$store.state.login.loginInfo.userData.profile.userId);
    },
    async download (name, url) {
      await downloadMp3(process => {
        this.$Loading.update(process);
        if (process === 100) {
          this.$Loading.finish();
        }
      }, { name, url });
    },
    delegation (e) {
      const index = Number(e.target.getAttribute('i') || e.target.parentElement.getAttribute('i'));
      this.$store.commit('player/setAudioData', this.songs[index]);
      // 将此歌单的所有歌曲做为播放列表
      this.$store.commit('player/setPlaylist', this.songs);
      console.log(e.target.offsetTop);
    }
  },
  computed: {
    ...mapState('user', ['likelist']),
    ...mapState('player', ['curAudioInfo'])
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/sass/components/Songlist.scss';
</style>
