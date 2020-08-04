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
  Notice,
  Spin,
  Page
} from 'view-design';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VueLazyLoad from 'vue-lazyload';
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';

import 'swiper/css/swiper.css';
// css
import 'view-design/dist/styles/iview.css';
import './assets/css/gobal.css';
import './assets/iconfont/iconfont.css';

import remoteInterface from './service';
store.dispatch('find/getBanners');
// 检查登录状态
remoteInterface.checkLoginStatus().then(async res => {
  if (res.code === 200) {
    store.commit('login/setLoginInfo', res);
    // 获取用户详细信息
    await store.dispatch('user/getUserDetail', store.state.login.loginInfo.userData.profile.userId);
  }
});
Vue.use(vuescroll);
Vue.use(VueAwesomeSwiper);
Vue.use(VueLazyLoad, {
  preLoad: 1,
  loading: require('./assets/img/loading.jpg'),
  attempt: 3
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
Vue.component('Spin', Spin);
Vue.component('Page', Page);

Vue.config.productionTip = false;

Vue.prototype.$vuescrollConfig = {
  vuescroll: {
    mode: 'native', // 选择一个模式, native 或者 slide(pc&app)
    sizeStrategy: 'percent', // 如果父容器不是固定高度，请设置为 number , 否则保持默认的percent即可
    detectResize: true// 是否检测内容尺寸发生变化
  },
  scrollPanel: {
    initialScrollY: false, // 只要组件mounted之后自动滚动的距离。 例如 100 or 10%
    initialScrollX: false,
    scrollingX: true, // 是否启用 x 或者 y 方向上的滚动
    scrollingY: true,
    speed: 300, // 多长时间内完成一次滚动。 数值越小滚动的速度越快
    easing: undefined, // 滚动动画 参数通animation
    verticalNativeBarPos: 'right'// 原生滚动条的位置
  },
  rail: { // 轨道
    background: '#c3c3c3', // 轨道的背景色
    opacity: 0,
    size: '11px',
    specifyBorderRadius: false, // 是否指定轨道的 borderRadius， 如果不那么将会自动设置
    gutterOfEnds: null,
    gutterOfSide: '0px', // 轨道距 x 和 y 轴两端的距离
    keepShow: false // 是否即使 bar 不存在的情况下也保持显示
  },
  bar: {
    showDelay: 500, // 在鼠标离开容器后多长时间隐藏滚动条
    onlyShowBarOnScroll: false, // 当页面滚动时显示
    keepShow: true, // 是否一直显示
    background: '#c3c3c3',
    opacity: 1,
    hoverStyle: false,
    specifyBorderRadius: false,
    minSize: false,
    size: '8px',
    disable: false// 是否禁用滚动条
  }, // 在这里设置全局默认配置
  name: 'vuescroll' // 在这里自定义组件名字，默认是vueScroll
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
