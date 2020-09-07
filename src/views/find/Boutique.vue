<template>
  <div class="boutique">
    <div class="header">
      <div class="title">精品歌单</div>
    </div>
    <ul class="list">
      <li class="item" v-for="(playlist, index) in boutiquePlaylist" :key="index">
        <div class="thumb">
          <ThumbCover
          :src="playlist.coverImgUrl"
          :playCount="playlist.playCount"
          @click.native="$router.push('/pldetail?id='+playlist.id)"></ThumbCover>
        </div>
        <div class="info">
          <p class="name">
            <span class="tag">{{playlist.tag}}</span>
            <span>{{playlist.name}}</span>
          </p>
          <p class="creator">
            <span>by </span>
            <span class="nickname">{{playlist.creator.nickname}}</span>
          </p>
          <p class="copywriter">{{playlist.copywriter}}</p>
        </div>
      </li>
    </ul>
    <Spin size="large" v-if="loading">
      <Icon type="ios-loading" size=18 class="load"></Icon>
      载入中...
    </Spin>
  </div>
</template>

<script>
import _ from 'lodash';
import ThumbCover from '../../components/public/ThumbCover';
export default {
  data () {
    return {
      boutiquePlaylist: [],
      // 是否还有更多歌单数据
      more: true,
      // 歌单加载更多
      loading: false
    };
  },
  mounted () {
    this.getBoutiquePlaylist();
    this.$bus.$on('scroll', this.handleScroll);
  },
  methods: {
    async getBoutiquePlaylist (cat = '', limit = 30) {
      let before = '';
      if (this.boutiquePlaylist.length) {
        const arr = _.cloneDeep(this.boutiquePlaylist);
        before = arr.pop().updateTime;
      }
      const res = await this.$remoteInterface.getBoutiquePlaylist(before, cat, limit);
      if (res.code === 200) {
        this.boutiquePlaylist.push(...res.playlists);
        this.more = res.more;
      }
    },
    handleReachBottom () {
      return new Promise(resolve => {
        this.getBoutiquePlaylist();
        resolve();
      });
    },
    async handleScroll (data) {
      if (!this.more) return;
      if (document.querySelector('.find').offsetHeight - (window.innerHeight - 100) === data.vertical.scrollTop) {
        this.loading = true;
        await this.getBoutiquePlaylist();
        this.loading = false;
      }
    }
  },
  components: {
    ThumbCover
  },
  beforeDestroy () {
    this.$bus.$off('scroll', this.handleScroll);
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/sass/components/Boutique.scss';
</style>
