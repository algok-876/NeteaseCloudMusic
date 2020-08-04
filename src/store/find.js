import funApi from '../service';

export default {
  namespaced: true,
  state: {
    // banner
    banners: []
  },
  mutations: {
    // 设置banner数组
    setBanners (state, payload) {
      state.banners = payload.banners;
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
