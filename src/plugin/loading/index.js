import loadingComponent from './loading.vue';

let $vm;

export default {
  install (Vue, options) {
    if (!$vm) {
      const LaodingPlugin = Vue.extend(loadingComponent);
      $vm = new LaodingPlugin({
        el: document.createElement('div')
      });
    }
    $vm.show = false;
    const loading = {
      show (text) {
        $vm.show = true;
        $vm.text = text;
        document.body.appendChild($vm.$el);
      },
      hide () {
        $vm.show = false;
      }
    };
    if (!Vue.$loading) {
      Vue.$loading = loading;
    }
    Vue.mixin({
      created () {
        this.$loading = Vue.$loading;
      }
    });
  }
};
