<template>
  <div class="toplist-wrap content-wrapper">
    <div class="offical-toplist">
      <div class="tl-title">
        官方榜
      </div>
      <div class="list">
        <div class="item" v-for="(toplist, index) in officialToplist" :key="toplist.id">
          <div class="header" :style="{backgroundImage: `url(${toplist.coverImgUrl}?param=1080x1080)`}">
          </div>
          <ul>
            <li v-for="(song, order) in topListShowSongs[index]" :key="song.id" :class="{active: active === order}" @click="handleClickSong" @dblclick="playMusic(topListShowSongs[index], order)">
              <div class="right">
                <span class="order" :class="{topthree: order <= 2}">{{order + 1}}</span>
                <span class="songname">{{song.name}}</span>
              </div>
              <div class="left">
                <span v-for="(item, order) in song.ar" :key="order">{{item.name}}</span>
              </div>
            </li>
            <!-- 当当前排行榜列表未加载出来时显示加载中 -->
            <Spin size="large" v-if="!topListShowSongs[index]" fix><Icon type="ios-loading" size=18 class="load"></Icon>拼命加载中</Spin>
          </ul>
          <div class="footer">
            <router-link :to="'/pldetail?id='+officialToplist[index].id">查看更多></router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="entries-toplist">
      <div class="tl-title">
        全球榜
      </div>
      <ul class="list">
        <li class="list-item" v-for="(data, index) in entrieToplist" :key="index" @click="$router.push('/pldetail?id=' + data.id)">
          <ThumbCover :src="data.coverImgUrl" :playCount="data.playCount"></ThumbCover>
          <p>{{data.name}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import unitySongList from '../../utils/unitySongList';
import mixinPlayMusic from '../../mixin/mixin_playMusic';
import ThumbCover from '../../components/public/ThumbCover';
import { mapState } from 'vuex';
export default {
  mixins: [mixinPlayMusic],
  data () {
    return {
      // 每个官方排行榜的歌曲信息
      officialTlSongs: [],
      active: ''
    };
  },
  async mounted () {
    if (!this.isToplist) {
      await this.getToplist();
    }
    await this.getOfficialDetail();
  },
  methods: {
    async getToplist () {
      const res = await this.$remoteInterface.getToplist();
      if (res.code === 200) {
        this.$store.commit('find/setToplist', res.list);
      }
    },
    async getOfficialDetail () {
      if (this.officialToplist) {
        const tasks = [];
        this.officialToplist.forEach((toplist) => {
          tasks.push(unitySongList(toplist.id));
        });
        const res = await Promise.all(tasks);
        this.officialTlSongs = res;
        console.log(res);
      }
    },
    handleClickSong (e) {
      Array.from(e.target.parentElement.children, (el) => {
        el.classList.remove('active');
      });
      e.target.classList.add('active');
    }
  },
  computed: {
    ...mapState('find', ['isToplist', 'entrieToplist', 'officialToplist']),
    topListShowSongs () {
      if (!this.officialTlSongs) {
        return Array.of(this.officialToplist.length);
      }
      return this.officialTlSongs.map(list => {
        return list.slice(0, 8);
      });
    }
  },
  components: {
    ThumbCover
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/sass/pages/Rankinglist.scss';
</style>
