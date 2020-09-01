import funApi from '../service';

export default {
  namespaced: true,
  state: {
    // banner
    banners: [],
    // 全球排行榜
    entrieToplist: [],
    // 官方排行榜
    officialToplist: [],
    isToplist: false
  },
  mutations: {
    // 设置banner数组
    setBanners (state, payload) {
      state.banners = payload.banners;
    },
    // 排行榜信息
    setToplist (state, payload) {
      payload.forEach(toplist => {
        if (toplist.ToplistType) {
          state.officialToplist.push(toplist);
        } else {
          state.entrieToplist.push(toplist);
        }
      });
      state.isToplist = true;
    }
  },
  actions: {
    // 从接口获取banenr
    async getBanners (context) {
      const res = await funApi.getBanners();
      context.commit('setBanners', res);
    }
  }
};
