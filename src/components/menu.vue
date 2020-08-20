<template>
  <div class="menu-wrapper">
    <div class="header">
      <p class="title">{{title}}</p>
      <div class="btn-wrapper" v-show="isCollapse">
        <slot></slot>
        <Icon :type="visible ? 'ios-arrow-down': 'ios-arrow-forward'" :size="16" @click="visible = !visible"/>
      </div>
    </div>
    <ul class="menu" v-show="visible">
      <li v-for="(item, index) in menulist" :key="index">
        <router-link :to="item.href" :title="item.name" @click.native.right="handleMenuItem($event, {playlistId: item.id, index})" @mouseleave.native="removeEvent">
          <Icon :custom="item.icon" :size="item.size"/>
          {{item.name}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['title', 'menulist', 'isCollapse', 'type', 'menuType'],
  data () {
    return {
      visible: true
    };
  },
  methods: {
    disableTextMenu (e) {
      e.preventDefault();
    },
    handleMenuItem (e, item) {
      if (this.type === 'playlist') {
        // 单击右键时屏蔽默认菜单
        window.addEventListener('contextmenu', this.disableTextMenu);
        // 触发父组件的事件
        this.$emit('right-click', {
          top: e.clientY + 'px',
          left: e.clientX + 'px'
        });
        // 设置开启右键菜单的歌单项的id
        this.$store.commit('slidebar/setPlayListId', {
          id: item.playlistId,
          type: this.menuType ? this.menuType : item.index === 0 ? 'fav' : ''
        });
      }
    },
    removeEvent () {
      // 离开歌单菜单时，移除屏蔽事件
      if (this.type === 'playlist') {
        window.removeEventListener('contextmenu', this.disableTextMenu);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/sass/components/menu.scss';
</style>
