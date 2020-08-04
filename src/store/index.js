import Vue from 'vue';
import Vuex from 'vuex';
import login from './login';
import user from './user';
import find from './find';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    login,
    user,
    find
  }
});
