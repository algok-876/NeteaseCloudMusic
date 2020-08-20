export default {
  namespaced: true,
  state: {
    // 当前播放的音乐的信息
    curAudioInfo: {
      playing: false
    },
    // 播放列表
    playlist: []
  },
  mutations: {
    // 设置当前歌曲播放信息
    setAudioData (state, payload) {
      // state.curAudioInfo.songurl = payload.songurl;
      // state.curAudioInfo.id = payload.id;
      // state.curAudioInfo.name = payload.name;
      // state.curAudioInfo.order = payload.order;
      state.curAudioInfo = { ...state.curAudioInfo, ...payload };
    },
    // 设置播放状态
    setPlayStatus (state, playing) {
      state.curAudioInfo.playing = playing;
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
