<template>
  <div class="boutique">
    <div class="header">
      <div class="title">精品歌单</div>
    </div>
    <ul class="list">
      <li class="item" v-for="playlist in boutiquePlaylist" :key="playlist.id">
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
  </div>
</template>

<script>
import _ from 'lodash';
import ThumbCover from '../../components/public/ThumbCover';
export default {
  data () {
    return {
      boutiquePlaylist: []
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
      }
      console.log(this.boutiquePlaylist);
    },
    handleReachBottom () {
      return new Promise(resolve => {
        this.getBoutiquePlaylist();
        resolve();
      });
    },
    handleScroll (data) {
      console.dir(data);
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
