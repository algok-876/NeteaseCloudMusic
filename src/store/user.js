import funApi from '../service';

export default {
  namespaced: true,
  state: {
    userDetail: {}
  },
  mutations: {
    // 设置用户详细信息
    setUserDetail (state, payload) {
      state.userDetail = payload;
    }
  },
  actions: {
    // 获取用户详细信息
    async getUserDetail (context, uid) {
      const res = await funApi.getUserDetail(uid);
      context.commit('setUserDetail', res);
    }
  }
};
