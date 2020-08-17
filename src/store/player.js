export default {
  namespaced: true,
  state: {
    // 当前播放的音乐的信息
    curAudioInfo: {
      playing: false,
      songurl: '',
      id: ''
    },
    // 当前歌曲信息
    curSongInfo: '',
    // 播放列表
    playlist: []
  },
  mutations: {
    // 设置当前歌曲播放信息
    setAudioData (state, payload) {
      state.curAudioInfo.songurl = payload.songurl;
      state.curAudioInfo.id = payload.id;
    },
    // 设置播放状态
    setPlayStatus (state, playing) {
      state.curAudioInfo.playing = playing;
    },
    // 设置当前播放歌曲的信息
    setCurSongInfo (state, payload) {
      // this.$set('state.curSongInfo', payload);
      state.curSongInfo = payload;
    },
    // 设置播放列表
    setPlaylist (state, payload) {
      state.playlist = payload;
    },
    // 更新播放列表
    updatePlaylist (state, payload) {
      state.playlist = state.playlist.splice(payload.start, payload.delete, payload.update);
    }
  },
  actions: {
  }
};
