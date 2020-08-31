<template>
  <Drawer
    title="Basic Drawer"
    :closable="true"
    v-model="visible"
    @on-close="$emit('on-close')"
    width="600"
  >
  <template v-slot:header>
    <div class="tab-btn">
      <RadioGroup v-model="tab" type="button">
        <Radio label="0">播放列表</Radio>
        <Radio label="1">历史记录</Radio>
      </RadioGroup>
    </div>
  </template>
  <div class="tools">
    <span>共{{parseInt(tab) === 0 ? playlist.length : historyList.length}}首</span>
  </div>
  <vue-scroll style="height:calc(100% - 55px)">
    <div class="playlist" v-show='parseInt(tab) === 0'>
      <musicTable :theadItem="thead" :tbodyData="playlist" @on-dblclickSong="dblsongs" v-if="playlist.length>0">
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
      <div class="playlist-none-tip" v-else>
        <p>你还没有添加任何歌曲</p>
        <p>去首页<router-link to="/">发现音乐</router-link></p>
      </div>
    </div>
    <div class="history" v-show='parseInt(tab) === 1'>
      <musicTable :theadItem="historyHead" :tbodyData="historyList" @on-dblclickSong="dblsongs" v-if="historyList.length>0">
        <template v-slot:name="row">
          <div style="margin-left:25px">
            <span>{{row.rowData.name}}</span>
          </div>
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
    ...mapState('player', ['playlist', 'curAudioInfo', 'curPlayMode', 'historyList'])
  },
  data () {
    return {
      thead: [
        { label: '', field: 'playStatus' },
        { label: '', field: 'name' },
        { label: '', field: 'ar' },
        { label: '', field: 'dt' }
      ],
      historyHead: [
        { label: '', field: 'name' },
        { label: '', field: 'ar' },
        { label: '', field: 'dt' }
      ],
      tab: '0'
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
.tab-btn{
  display: flex;
  justify-content: center;
}
.tools{
  padding: 10px 25px;
  border-bottom: 1px solid #e1e1e2;
}
.plyalist{
}
.playlist-none-tip{
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
