<template>
  <div class="playlist-detail-wrapper">
    <Spin size="large" fix v-if="loading"></Spin>
    <div class="base-info" v-if="playlistData">
      <div class="coverimg">
        <img v-lazy="playlistData.coverImgUrl" />
      </div>
      <div class="right-text">
        <p class="name">
          <span>歌单</span>
          {{playlistData.specialType === 5 ? '我喜欢的音乐' : playlistData.name}}
        </p>
        <p class="avatar-info">
          <Avatar :src="playlistData.creator.avatarUrl" />
          <span class="nickname">{{playlistData.creator.nickname}}</span>
          <span class="cratetime">{{playlistData.createTime | dateformat('YYYY-MM-DD')}}创建</span>
        </p>
        <p class="btn-wrapper">
          <ButtonGroup>
            <Button custom-icon="iconfont icon-play">播放全部</Button>
            <Button>+</Button>
          </ButtonGroup>
          <Button
            custom-icon="iconfont icon-shoucangjia"
            style="margin-left:15px"
            :disabled="userCreatePlaylistIds.indexOf(playlistData.id) >= 0&&!playlistData.subscribed"
            @click="subscr(playlistData.subscribed, playlistData.id)"
          >{{playlistData.subscribed ? '已收藏' : '收藏'}}({{playlistData.subscribedCount}})</Button>
          <Button
            custom-icon="iconfont icon-fenxiang2"
            style="margin-left:15px"
          >分享({{playlistData.shareCount}})</Button>
          <Button
            custom-icon="iconfont icon-xiazai1"
            style="margin-left:15px"
            @click="downloadAllSongs"
            :disabled="isDownloadAll"
          >{{isDownloadAll ? '正在下载，请稍后' : '下载全部'}}</Button>
        </p>
        <div class="tags" v-if="playlistData.tags.length>0">
          标签：
          <Breadcrumb>
            <BreadcrumbItem
              :to="'/find/playlist/hot?cat=' + value"
              v-for="(value, index) in playlistData.tags"
              :key="index"
            >{{value}}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div class="summary" v-if="playlistData.description">
          <pre :class="{unfold: !summaryCollapse}">简介：{{playlistData.description}}</pre>
          <span class="collapse" @click="summaryCollapse = !summaryCollapse"><Icon :type="summaryCollapse?'ios-arrow-down':'ios-arrow-up'" size="25"/></span>
        </div>
      </div>
      <!-- 歌曲数和播放次数 -->
      <div class="playlist-count-play">
        <div class="count">
          <div class="text">歌曲数</div>
          <div class="number">{{playlistData.trackCount}}</div>
        </div>
        <div class="playcount">
          <div class="text">播放数</div>
          <div class="number">{{playlistData.playCount}}</div>
        </div>
      </div>
    </div>
    <!-- Tab切换 -->
    <div class="tab">
      <div class="switch-tab">
        <span @click="curtab=0" :class="{active: curtab===0}">歌曲列表</span>
        <span @click="curtab=1" :class="{active: curtab===1}">评论({{comments.total}})</span>
        <span @click="curtab=2" :class="{active: curtab===2}">收藏者</span>
      </div>
      <div class="tab-content">
        <!-- 歌曲列表 -->
        <div class="songlist" v-show="curtab===0">
          <Songlist :songs="songlist" @refresh="refreshPlaylist"></Songlist>
        </div>
        <!-- 评论 -->
        <div class="comment" v-show="curtab===1">
          <Comment :comments="comments" @page-change="pageChange" :loading="commentLoading"></Comment>
        </div>
        <!-- 收藏者 -->
        <div class="subscr" v-show="curtab===2">
          <template v-if="subscribes.length">
            <Spin size="large" v-if="subLoading">
              <Icon type="ios-loading" size="18" class="load"></Icon>载入中...
            </Spin>
            <div class="wrapper" v-show="!subLoading">
              <ul class="subscribers">
                <li v-for="sub in subscribes" :key="sub.userId">
                  <Avatar :src="sub.avatarUrl" size="60" />
                  <span v-text="sub.nickname"></span>
                </li>
              </ul>
              <!-- 分页 -->
              <div class="page-wrapper">
                <Page :total="playlistData.subscribedCount" @on-change="subPageChange" :page-size="70" size="small" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Songlist from '../../components/Songlist';
import Comment from '../../components/comment/comment';
import downloadMp3 from '../../func/download';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      playlistData: '',
      curtab: 0,
      songlist: [],
      loading: false,
      // 评论列表
      comments: {},
      // 简介折叠
      summaryCollapse: true,
      // 评论加载
      commentLoading: false,
      // 歌单收藏者
      subscribes: [],
      subLoading: false,
      // 是否在下载中
      isDownloadAll: false
    };
  },
  mounted () {
    this.getPlaylistData();
  },
  methods: {
    async getPlaylistData () {
      this.loading = true;
      await this.getDetail();
      await this.getSongData();
      await this.getSongUrl();
      // 隐藏加载
      this.loading = false;
      if (this.playlistData.specialType === 5) {
        this.$store.commit('player/setFavPlaylist', true);
      } else {
        this.$store.commit('player/setFavPlaylist', false);
      }
      await this.getComments();
      this.getSubscribers();
    },
    async getDetail () {
      const res = await this.$remoteInterface.getPlaylistDeteail(
        this.$route.query.id
      );
      if (res.code !== 200) return;
      this.playlistData = res.playlist;
    },
    async getSongData () {
      // 取得trackids
      const trackIds = this.playlistData.trackIds.map((item, index) => {
        return item.id;
      });
      // 请求所有歌曲详情
      const songs = await this.$remoteInterface.getSongDetail(
        trackIds.join(',')
      );
      if (songs.code !== 200) return;
      this.songlist = songs.songs;
    },
    async getSongUrl () {
      // 获得所有歌曲url
      const songids = this.songlist.map((value) => {
        return value.id;
      });
      const songUrls = await this.$remoteInterface.getSongUrl(
        songids.join(',')
      );
      if (songUrls.code !== 200) {
        return;
      };
      // 重组歌曲详情列表和每首歌对应的url
      this.songlist = this.songlist.map((item, index) => {
        return {
          order: index,
          id: item.id,
          op: '',
          name: item.name,
          ar: item.ar,
          al: item.al,
          mv: item.mv,
          dt: item.dt,
          pid: this.$route.query.id,
          source: 'playlist',
          songurl: songUrls.data.find((urlItem) => {
            return urlItem.id === item.id;
          }).url
        };
      });
    },
    // 取消和收藏歌单
    async subscr (sub, id) {
      sub = sub ? 2 : 1;
      const res = await this.$remoteInterface.subscribe(sub, id);
      console.log(res);
      this.getDetail();
      this.$store.dispatch(
        'user/getUserPlayList',
        this.$store.state.login.loginInfo.userData.profile.userId
      );
    },
    // 刷新歌单
    async refreshPlaylist (index) {
      this.songlist.splice(index, 1);
    },
    // 获取评论
    async getComments (offset = 0) {
      const res = await this.$remoteInterface.getPlaylistComment(this.$route.query.id, offset);
      this.comments = res;
    },
    // 评论翻页
    async pageChange (offset) {
      this.commentLoading = true;
      await this.getComments(offset);
      this.commentLoading = false;
    },
    // 获取所有歌单收藏者
    async getSubscribers (offset = 0) {
      const res = await this.$remoteInterface.getPlaylistSubscribers(this.$route.query.id, offset);
      if (res.code !== 200) return;
      this.subscribes = res.subscribers;
    },
    // 歌单收藏者翻页
    async subPageChange (newpage) {
      this.subLoading = true;
      await this.getSubscribers(newpage - 1);
      this.subLoading = false;
    },
    async downloadAllSongs (e) {
      const that = this;
      this.$Modal.confirm({
        title: '确认窗口',
        content: '<p>确认全部下载吗？</p>',
        cancelText: '不，再想想',
        onOk: async () => {
          this.isDownloadAll = true;
          const downlaodList = this.songlist.map(value => {
            const arNameList = value.ar.map(song => {
              return song.name;
            });
            const downloadname = value.name + '-' + arNameList.join('/');
            return {
              downloadname,
              url: value.songurl
            };
          });
          await downloadMp3(percent => {
            that.$Loading.update(percent);
            if (percent === 100) {
              that.$Loading.finish();
            }
          }, ...downlaodList);
          this.isDownloadAll = false;
        }
      });
    }
  },
  watch: {
    '$route.query.id': function () {
      this.getPlaylistData();
      this.curtab = 0;
    }
  },
  computed: {
    ...mapState('user', ['userCreatePlaylistIds', 'userLikePlaylistId'])
  },
  components: {
    Songlist,
    Comment
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/sass/components/Pldetail.scss';
</style>
