<template>
  <Drawer
    title="Basic Drawer"
    :closable="true"
    v-model="visible"
    @on-close="$emit('on-close')"
    width="600"
  >
  <vue-scroll>
    <div class="playlist">
      <musicTable :theadItem="thead" :tbodyData="playlist" @on-dblclickSong="dblsongs">
        <template v-slot:playStatus="row">
          <div v-if="row.rowData.id===curAudioInfo.id">
            <Icon :custom="curAudioInfo.playing?'iconfont icon-bofang5': 'iconfont icon-bofang4'" size="18" style="color:#c62f2f"/>
          </div>
        </template>
        <template v-slot:name="row">
          <span>{{row.rowData.name}}</span>
          <Icon v-if="row.rowData.mv" custom="iconfont icon-mv" style="display:inline-block;margin-left:10px;color:#cd2929"></Icon>
        </template>
        <template v-slot:ar="row">
          <div class="ar">
            {{row.rowData.ar | parseArists}}
          </div>
        </template>
        <template v-slot:dt="row">
          <div style="margin-right:25px">
            {{row.rowData.dt | duration(false)}}
          </div>
        </template>
      </musicTable>
    </div>
  </vue-scroll>
  </Drawer>
</template>

<script>
import musicTable from '../../components/table/musicTable';
import { mapState } from 'vuex';
export default {
  props: ['visible'],
  computed: {
    ...mapState('player', ['playlist', 'curAudioInfo', 'curPlayMode'])
  },
  data () {
    return {
      thead: [
        { label: '', field: 'playStatus' },
        { label: '', field: 'name' },
        { label: '', field: 'ar' },
        { label: '', field: 'dt' }
      ]
    };
  },
  methods: {
    async dblsongs (index) {
      if (!this.playlist[index].songurl) {
        this.$Notice.warning({
          title: '暂无音源',
          desc: `暂无歌曲《${this.playlist[index].name}》的音源，无法播放`
        });
        return;
      };
      this.$store.commit('player/setAudioData', this.playlist[index]);
    }
  },
  components: {
    musicTable
  }
};
</script>

<style lang="scss" scoped>
::v-deep .ivu-drawer-body{
  padding: 0;
}
.ar{
  width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
}
</style>
