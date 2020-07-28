import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import {
  Button,
  ButtonGroup,
  Icon,
  Input,
  Avatar,
  Modal,
  Form,
  FormItem,
  Message,
  Poptip,
  Notice
} from 'view-design';
// css
import 'view-design/dist/styles/iview.css';
import './assets/css/gobal.css';
import './assets/iconfont/iconfont.css';

import remoteInterface from './service';
// 检查登录状态
remoteInterface.checkLoginStatus().then(async res => {
  if (res.code === 200) {
    store.commit('login/setLoginInfo', res);
    // 获取用户详细信息
    await store.dispatch('user/getUserDetail', store.state.login.loginInfo.userData.profile.userId);
  }
});

// 将远程接口函数添加到Vue原型中
Vue.prototype.$remoteInterface = remoteInterface;
Vue.prototype.$Message = Message;
Vue.prototype.$Notice = Notice;
Vue.prototype.$Notice.config({
  duration: 2.5,
  top: 60
});
// 注册全局组件
Vue.component('Button', Button);
Vue.component('ButtonGroup', ButtonGroup);
Vue.component('Icon', Icon);
Vue.component('Input', Input);
Vue.component('Avatar', Avatar);
Vue.component('Modal', Modal);
Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Poptip', Poptip);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
