export default {
  methods: {
    playMusic (songlist, curIndex) {
      this.$store.commit('player/setAudioData', songlist[curIndex]);
      // 将此歌单的所有歌曲做为播放列表
      this.$store.commit('player/setPlaylist', songlist);
    }
  }
};
