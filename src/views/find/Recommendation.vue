<template>
  <div class="content-wrapper">
    <Swiper :banners="banners"></Swiper>
    <recList
      title="推荐歌单"
      :data="recSongList"
      rowCount="5"
      type="songlist"
      more="/find/playlist/hot"
      :loading="loading"
      v-if="loginInfo.status"
    ></recList>
    <recList title="最新音乐" more="/">
      <ul class="newSongs">
        <li v-for="(item, index) in songlist" :key="item.id" @dblclick="playMusic(item)" @click="liActive = index" :class="{active: liActive === index}">
          <div style="width:20px">
            <!-- eslint-disable-next-line vue/no-parsing-error -->
            <span class="order" v-if="item.id!==curAudioInfo.id">{{ index + 1 < 10 ? '0' + (index + 1) :index + 1 }}</span>
            <div v-else>
              <Icon :custom="curAudioInfo.playing?'iconfont icon-laba': 'iconfont icon-wushengyinkuai'" size="18" style="color:#c62f2f"/>
            </div>
          </div>
          <div class="img-box" v-lazy:background-image="item.picUrl + '?param=40y40'" @click="playMusic(item)">
            <Icon custom="iconfont icon-icon-test" size="28"/>
          </div>
          <div class="songmsg">
            <p class="name">{{item.name}}</p>
            <p class="avarat">
              <Icon custom="iconfont icon-ttpodicon" size="20" style="color:#f1672e" />
              <Icon
                custom="iconfont icon-mv"
                size="17"
                style="color:#c62f2f"
                v-if="item.mv"
              />
              <span>{{item.ar[0].name}}</span>
            </p>
          </div>
        </li>
      </ul>
    </recList>
    <recList title="推荐MV" :data="recMv" rowCount="4" type="mv" more="/" :loading="loading"></recList>
    <recList title="主播电台" :data="djprogram" rowCount="6" more="/" :loading="loading"></recList>
    <recList title="独家放送" :data="privatecontent" rowCount="3" more="/" :loading="loading"></recList>
  </div>
</template>

<script>
import Swiper from '../../components/Swiper';
import recList from '../../components/recList';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      recSongList: [],
      newSong: [],
      djprogram: [],
      recMv: [],
      privatecontent: [],
      loading: false,
      songlist: [],
      liActive: ''
    };
  },
  async mounted () {
    await this.setSongList();
    this.integrateSongList();
  },
  methods: {
    async setSongList () {
      // 显示加载动画
      this.loading = true;
      const res = await this.$remoteInterface.getSongList();
      if (res.code === 200) {
        this.recSongList = res.recommend.slice(0, 10);
      }
      const NewSongs = this.$remoteInterface.getNewSongs();
      const Djprogram = this.$remoteInterface.getDjprogram();
      const RecMv = this.$remoteInterface.getRecMv();
      const Privatecontent = this.$remoteInterface.getPrivatecontent();
      const result = await Promise.all([
        NewSongs,
        RecMv,
        Djprogram,
        Privatecontent
      ]);
      // 关闭加载动画
      this.loading = false;
      this.newSong = result[0].result;
      this.recMv = result[1].result;
      this.djprogram = result[2].result;
      this.privatecontent = result[3].result;
    },
    async integrateSongList () {
      const songIds = [];
      this.newSong.forEach(value => {
        songIds.push(value.id);
      });
      const songUrls = await this.$remoteInterface.getSongUrl(
        songIds.join(',')
      );
      this.songlist = this.newSong.map((item, index) => {
        return {
          order: index,
          id: item.id,
          name: item.name,
          ar: item.song.album.artists,
          al: { ...item.song.album.artist, picUrl: item.picUrl },
          mv: item.song.mvid,
          dt: item.duration,
          picUrl: item.picUrl,
          songurl: songUrls.data.find((urlItem) => {
            return urlItem.id === item.id;
          }).url
        };
      });
    },
    playMusic (song) {
      this.$store.commit('player/setAudioData', song);
      // 将此歌单的所有歌曲做为播放列表
      this.$store.commit('player/setPlaylist', this.songlist);
    }
  },
  computed: {
    ...mapState('find', ['banners']),
    ...mapState('login', ['loginInfo']),
    ...mapState('player', ['curAudioInfo'])
  },
  components: {
    Swiper,
    recList
  }
};
</script>

<style lang="scss" scoped>
/* order
img-box
songmsg
name
avarat */
.newSongs {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #e1e1e2;
  .click {
    background-color: #e3e3e5;
  }
  li {
    display: flex;
    align-items: center;
    width: 50%;
    padding: 10px;
    &.active{
      background-color: RGB(227,227,229)!important;
    }
    &:nth-of-type(odd) {
      border-right: 1px solid #e1e1e2;
    }
    &:nth-child(4n) {
      background-color: #f5f5f7;
    }
    &:nth-child(4n-1) {
      background-color: #f5f5f7;
    }
    &:hover {
      background-color: #ebeced;
    }
    .img-box {
      width: 40px;
      height: 40px;
      display: flex;
      margin: 0 8px;
      justify-content: center;
      align-items: center;
      border: 1px solid #e1e1e2;
      i {
        &::before {
          width: 100%;
          border-radius: 50%;
          padding: 2px;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.7);
          background-clip: content-box;
        }
      }
    }
    .songmsg {
      i {
        display: block;
        margin-right: 5px;
      }
      .avarat {
        display: flex;
        align-items: flex-end;
        span {
          line-height: 1.3;
        }
      }
    }
  }
}
</style>
