import playlist from '../service/playlist';
export default {
  namespaced: true,
  state: {
    // 当前播放的音乐的信息
    curAudioInfo: {
      playing: false
    },
    // 播放列表
    playlist: [],
    // 当前播放模式 0表示顺序，1表示单曲循环，2表示随机，3表示心动模式
    curPlayMode: 0,
    // 备份之前的播放列表
    copyBeforePlayList: [],
    // 用户的历史播放记录
    historyList: []
  },
  mutations: {
    // 设置当前歌曲播放信息
    setAudioData (state, payload) {
      // 如果是心动模式，不管该歌曲之前的序号是多少，直接设置为第一个
      if (state.curPlayMode === 3 && payload.source === 'playlist') {
        payload.order = 0;
      }
      state.curAudioInfo = { ...state.curAudioInfo, ...payload };
    },
    // 设置播放状态
    setPlayStatus (state, playing) {
      state.curAudioInfo.playing = playing;
    },
    // 设置播放列表
    setPlaylist (state, payload) {
      state.playlist = payload;
      state.copyBeforePlayList = [];
    },
    // 设置历史播放列表
    setHistoryList (state, payload) {
      state.historyList = payload;
    },
    // 更新播放列表
    updatePlaylist (state, payload) {
      state.playlist = state.playlist.splice(payload.start, payload.delete, payload.update);
    },
    // 设置播放模式
    setPlayMode (state, { mode, heartbeatList }) {
      state.curPlayMode = mode;
      if (mode === 3) {
        state.curAudioInfo.order = 0;
        state.copyBeforePlayList = state.playlist;
        state.playlist = heartbeatList || [];
      }
    },
    // 先判断备份列表是否有东西，如果有就将备份列表还原到播放列表中，一般用于从心动模式切换回其他模式
    restorePlayList (state) {
      if (state.copyBeforePlayList.length) {
        state.playlist = state.copyBeforePlayList;
      }
    }
  },
  actions: {
    async curAndhistory (context) {
      let historyList = await playlist.getPlayHistory(this.state.user.userDetail.profile.userId);
      historyList = historyList.weekData.map(his => {
        return {
          name: his.song.name,
          ar: his.song.ar,
          dt: his.song.dt
        };
      });
      context.commit('setHistoryList', historyList);
    }
  }
};
