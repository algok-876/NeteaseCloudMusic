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
    <tbody>
      <tr v-for="(song, index) in songs" :key="song.id" :class="{active: index === activeTr}" @click="activeTr = index">
        <td style="max-width:30px;text-align:center">{{index + 1 >= 10 ? index + 1: '0'+ (index + 1)}}</td>
        <td style="max-width:80px">
          <span @click="likeSong(song.id, index)">
            <Icon :custom="likelist.indexOf(song.id) >= 0 ? 'iconfont icon-xihuan-wangyiicon' : 'iconfont icon-xihuan-kongpt'" :class="{like: likelist.indexOf(song.id) >= 0}"/>
          </span>
          <span>
            <Icon type="ios-cloud-download-outline" size="16"/>
          </span>
        </td>
        <td :title="song.name">
          <span>{{song.name}}</span>
          <Icon v-if="song.mv" custom="iconfont icon-mv" style="display:inline-block;margin-left:10px;color:#cd2929"></Icon>
        </td>
        <td style="max-width:400px" class="songers">
          <span v-for="ar in song.ar" :key="ar.id">{{ar.name}}</span>
        </td>
        <td style="max-width:230px" :title="song.al.name">
          <span>{{song.al.name}}</span>
        </td>
        <td style="max-width:100px">
          <span></span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
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
    }
  },
  computed: {
    ...mapState('user', ['likelist'])
  }
};
</script>

<style lang="scss" scoped>
.like{
  color: #cd2929;
}
.song-table{
  width: 100%;
  tr{
    height: 30px;
    &.active{
      background-color: #cecece!important;
      color: #000!important;
    }
  }
  td{
    font-size: 14px;
    padding-left: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    i{
      cursor: pointer;
    }
    span{
      font-size: 14px;
    }
  }
  thead{
    tr{
      td{
        &:nth-child(1){
          border-left: 0;
        }
        border: 1px solid #e1e1e2;
        border-right: 0;
      }
    }
  }
  tbody{
    tr{
      color: #666;
      td{
        &:nth-child(2) {
          span{
            cursor: pointer;
            display: inline-block;
            margin-right: 5px;
          }
        }
        &:nth-child(3) {
          color: #000;
        }
      }
      &:nth-of-type(even) {
        background-color: #f5f5f7;
      }
      &:hover{
        background-color: #cecece;
        color: #000;
      }
      .songers{
        span:nth-child(n + 2){
          &::before{
            content: "  /  ";
          }
        }
      }
    }
  }
}
</style>
