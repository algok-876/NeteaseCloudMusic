<template>
  <div class="playlist-detail-wrapper">
    <Spin size="large" fix v-if="loading"></Spin>
    <div class="base-info">
      <div class="coverimg">
        <img v-lazy="playlistData.coverImgUrl" />
      </div>
      <div class="right-text">
        <p class="name">
          <span>歌单</span>
          {{playlistData.name}}
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
        </p>
        <div class="tags" v-if="playlistData.tags.length>0">
          标签：
          <Breadcrumb>
            <BreadcrumbItem
              to="/"
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
          <Songlist :songs="songlist" :type="userLikePlaylistId.toString()===$route.query.id ? 'like':''" @refresh="refreshPlaylist"></Songlist>
        </div>
        <!-- 评论 -->
        <div class="comment" v-show="curtab===1">
          <Comment :comments="comments" @page-change="pageChange" :loading="commentLoading"></Comment>
        </div>
        <!-- 收藏者 -->
        <div class="comment" v-show="curtab===2">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Songlist from '../../components/Songlist';
import Comment from '../../components/comment/comment';
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
      subLoading: false
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
      if (songUrls.code !== 200) return;
      // 重组歌曲详情列表和每首歌对应的url
      this.songlist = this.songlist.map((item, index) => {
        return {
          id: item.id,
          name: item.name,
          ar: item.ar,
          al: item.al,
          mv: item.mv,
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
.ivu-breadcrumb > span:last-child {
  font-weight: normal;
}
.playlist-detail-wrapper {
  position: relative;
  .base-info {
    padding: 25px;
    display: flex;
    position: relative;
    align-items: flex-start;
    .playlist-count-play {
      position: absolute;
      right: 25px;
      top: 25px;
      display: flex;
      color: #999999;
      .count {
        border-right: 1px solid #e1e1e2;
        padding-right: 15px;
        margin-right: 15px;
      }
      .number {
        font-weight: 600;
        text-align: right;
      }
    }
    .coverimg {
      border: 1px solid #e1e1e2;
      font-size: 0;
      width: 200px;
      img {
        width: 100%;
      }
    }
    .right-text {
      flex: 1;
      margin-left: 25px;
      p {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .name {
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          border: 1px solid #e03f40;
          font-size: 14px;
          color: #e03f40;
          padding: 0 5px;
          margin-right: 10px;
        }
        font-size: 20px;
        font-weight: 400;
      }
      .avatar-info {
        .nickname {
          display: inline-block;
          margin-left: 10px;
          color: rgb(97, 97, 97);
        }
        .cratetime {
          display: inline-block;
          margin-left: 20px;
          color: rgb(168, 168, 168);
        }
      }
      .tags {
        display: flex;
        margin-bottom: 10px;
      }
      .summary{
        position: relative;
        overflow: hidden;
        pre{
          display: -moz-box;
          display: -webkit-box;
          box-orient: vertical;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
          white-space: pre-wrap;
          &.unfold{
            -webkit-line-clamp:unset;
            line-clamp: unset;
          }
        }
        .collapse{
          position: absolute;
          right: 0;
          top: 0;
          color: rgb(112, 112, 112);
          cursor: pointer;
        }
      }
    }
  }
  /* tab切换 */
  .tab {
    .switch-tab {
      padding: 10px 25px;
      padding-bottom: 0;
      span {
        display: inline-block;
        margin-right: 25px;
        font-size: 15px;
        cursor: pointer;
        padding: 2px 5px;
        &.active {
          color: #e03f40;
          border-bottom: 4px solid #e03f40;
        }
      }
    }
  }
}
.subscribers{
  .ivu-avatar-circle{
    border: 1px solid #e1e1e2;
  }
  margin: 0;
  padding: 5px;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  li{
    // width: calc(100% / 11);
    width: 155px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 35px 0;
    color: rgb(116, 116, 116);
    span{
      font-size: 12px;
      display: block;
      margin-top: 8px;
    }
    &:last-child{
      margin-right: auto;
    }
  }
}
</style>
