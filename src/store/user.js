import funApi from '../service';

export default {
  namespaced: true,
  state: {
    userDetail: {},
    userPlayList: [],
    userLikePlaylistId: '',
    userCreatePlaylistIds: [],
    likelist: []
  },
  mutations: {
    // 设置用户详细信息
    setUserDetail (state, payload) {
      state.userDetail = payload;
    },
    // 设置用户歌单信息
    setUserPlayList (state, payload) {
      state.userPlayList = payload.playlist;
      state.userLikePlaylistId = payload.playlist[0].id;
      payload.playlist.map((playlist) => {
        if (!playlist.subscribed) {
          state.userCreatePlaylistIds.push(playlist.id);
        }
      });
    },
    // 设置喜欢音乐列表
    setLikelist (state, payload) {
      state.likelist = payload;
    }
  },
  actions: {
    // 获取用户详细信息
    async getUserDetail (context, uid) {
      const res = await funApi.getUserDetail(uid);
      context.commit('setUserDetail', res);
    },
    // 获取用户歌单
    async getUserPlayList (context, uid) {
      const res = await funApi.getUserPlayList(uid);
      context.commit('setUserPlayList', res);
    },
    // 获取喜欢的音乐列表
    async getLikelist (context, uid) {
      const res = await funApi.getLikelist(uid);
      if (res.code === 200) {
        context.commit('setLikelist', res.ids);
      }
    }
  }
};
