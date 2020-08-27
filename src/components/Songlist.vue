<template>
  <musicTable :theadItem="thead" :tbodyData="songs" @on-dblclickSong="dblsongs">
    <template v-slot:order="row">
      <span v-if="row.rowData.id!==curAudioInfo.id">
        {{row.rowData.order + 1 >= 10 ? row.rowData.order + 1: '0'+ (row.rowData.order + 1)}}
      </span>
      <div v-else>
        <Icon :custom="curAudioInfo.playing?'iconfont icon-laba': 'iconfont icon-wushengyinkuai'" size="18" style="color:#c62f2f"/>
      </div>
    </template>
    <template v-slot:op="row">
      <span @click="likeSong(row.rowData.id, row.rowData.order)">
        <Icon :custom="likelist.indexOf(row.rowData.id) >= 0 ? 'iconfont icon-xihuan-wangyiicon' : 'iconfont icon-xihuan-kongpt'" :class="{like: likelist.indexOf(row.rowData.id) >= 0}"/>
      </span>
      <span>
        <Icon custom="iconfont icon-xiazai1" size="16" @click="download(row.rowData, row.rowData.songurl)"/>
      </span>
    </template>
    <template v-slot:name="row">
      <span>{{row.rowData.name}}</span>
      <Icon v-if="row.rowData.mv" custom="iconfont icon-mv" style="display:inline-block;margin-left:10px;color:#cd2929"></Icon>
    </template>
    <template v-slot:ar="row">
      {{row.rowData.ar | parseArists}}
    </template>
    <template v-slot:al="row">
      {{row.rowData.al.name}}
    </template>
    <template v-slot:dt="row">
      {{row.rowData.dt | duration(false)}}
    </template>
  </musicTable>
</template>

<script>
import downloadMp3 from '../func/download';
import musicTable from '../components/table/musicTable';
import { mapState } from 'vuex';
export default {
  props: ['songs'],
  data () {
    return {
      activeTr: '',
      thead: [
        { label: '', field: 'order' },
        { label: '操作', field: 'op' },
        { label: '音乐标题', field: 'name' },
        { label: '歌手', field: 'ar' },
        { label: '专辑', field: 'al' },
        { label: '时长', field: 'dt' }
      ]
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
    async download (songinfo, url) {
      const arNameList = songinfo.ar.map(song => {
        return song.name;
      });
      const downloadname = songinfo.name + '-' + arNameList.join('/');
      await downloadMp3(process => {
        this.$Loading.update(process);
        if (process === 100) {
          this.$Loading.finish();
        }
      }, { downloadname, url });
    },
    async dblsongs (index) {
      if (!this.songs[index].songurl) {
        this.$Notice.warning({
          title: '暂无音源',
          desc: `暂无歌曲《${this.songs[index].name}》的音源，无法播放`
        });
        return;
      };
      this.$store.commit('player/setAudioData', this.songs[index]);
      // 如果当前处于心动播放模式，则要请求心动列表然后作为播放列表，否则直接将该歌单的作为播放列表
      this.$store.commit('player/setPlaylist', this.songs);
      if (this.curPlayMode === 3) {
        const heartbeatList = await this.$remoteInterface.returnHeartBeatList(this.songs[index], this.songs[index].id, this.$route.query.id);
        this.$store.commit('player/setPlayMode', { mode: this.curPlayMode, heartbeatList });
      }
      // console.log(e.target.offsetTop);
    }
  },
  computed: {
    ...mapState('user', ['likelist']),
    ...mapState('player', ['curAudioInfo', 'curPlayMode'])
  },
  components: {
    musicTable
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/sass/components/Songlist.scss';
</style>
