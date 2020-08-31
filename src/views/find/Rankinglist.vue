<template>
  <div class="toplist-wrap">
    <div class="offical-toplist">
      <div class="tl-title">
        官方榜
      </div>
      <div class="list">
        <div class="item" v-for="(songs, index) in officialTlSongs" :key="officialToplist[index].id">
          <div class="header" :style="{backgroundImage: `url(${officialToplist[index].coverImgUrl}?param=1080x1080)`}">
          </div>
          <ul>
            <li v-for="(song, index) in songs.slice(0, 8)" :key="song.id" :class="{active: active === index}" @click="handleClickSong">
              <div class="right">
                <span class="order" :class="{topthree: index <= 2}">{{index + 1}}</span>
                <span class="songname">{{song.name}}</span>
              </div>
              <div class="left">
                <span v-for="(item, index) in song.ar" :key="index">{{item.name}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import unitySongList from '../../utils/unitySongList';
export default {
  data () {
    return {
      // 全球排行榜
      entrieToplist: [],
      // 官方排行榜
      officialToplist: [],
      // 每个官方排行榜的歌曲信息
      officialTlSongs: [],
      active: ''
    };
  },
  async mounted () {
    await this.getToplist();
    await this.getOfficialDetail();
  },
  methods: {
    async getToplist () {
      const res = await this.$remoteInterface.getToplist();
      if (res.code === 200) {
        res.list.forEach(toplist => {
          if (toplist.ToplistType) {
            this.officialToplist.push(toplist);
          } else {
            this.entrieToplist.push(toplist);
          }
        });
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
      }
    },
    handleClickSong (e) {
      Array.from(e.target.parentElement.children, (el) => {
        el.classList.remove('active');
      });
      e.target.classList.add('active');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/sass/pages/Rankinglist.scss';
</style>
