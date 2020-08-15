/* eslint-disable no-unused-vars */
import defLazyImg from '../assets/img/loading.jpg';

let timer = null;

// 创建一个监听器
const observer = new IntersectionObserver((entries) => {
  // entries是被监听的集合
  entries.forEach(entry => {
    // 判断当前元素是否于观察者相交，并且相交的距离大于0
    if (entry.isIntersecting || entry.intersectionRatio > 0) {
      !entry.target.load && showRealImage(entry.target, entry.target.data_src);
    }
  });
});

// 显示图片函数
function showRealImage (el, dataSrc) {
  const img = new Image();
  img.src = dataSrc;
  // 图片加载成功时
  img.onload = () => {
    el.src = dataSrc;
    el.load = true;
  };
};

export default {
  inserted (el, bind, vnode) {
    // 设置初始化默认图片
    el.src = defLazyImg;
    // 将需要加载的图片地址绑定在dom上
    el.data_src = bind.value;
    // 将这个元素放到observer的监听列表中
    observer.observe(el);

    // 防抖，在组件卸载的是否停止监听
    const vm = vnode.context;
    timer = setTimeout(() => {
      vm.$on('hook:beforeDestroy', () => {
        observer.disconnect();
      });
    }, 20);
  },
  // 图片更新时触发
  update (el, bind) {
    el.load = false;
    el.data_src = bind.value;
  }
};
