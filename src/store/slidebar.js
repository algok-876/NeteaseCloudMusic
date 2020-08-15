
export default {
  namespaced: true,
  state: {
    curPlaylistInfo: {}
  },
  mutations: {
    // 设置当前操作歌单项的id
    setPlayListId (state, payload) {
      state.curPlaylistInfo = payload;
    }
  }
};
