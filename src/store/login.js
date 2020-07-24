import funApi from '../service';

export default {
  namespaced: true,
  state: {
    loginInfo: {
      userData: {},
      status: false
    }
  },
  mutations: {
    setLoginInfo (state, payload) {
      state.loginInfo.userData = payload;
      if (payload.code === 200) {
        state.loginInfo.status = true;
      }
    }
  },
  actions: {
    // 登录（手机登录）
    async login (context, loginData) {
      if (loginData.type === 'phone') {
        const res = await funApi.callLogin(loginData.username, loginData.password);
        context.commit('setLoginInfo', res);
      }
    }
  }
};
