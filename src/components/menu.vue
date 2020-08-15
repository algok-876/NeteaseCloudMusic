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
  .menu-wrapper{
    overflow: hidden;
    .header{
      margin: 20px 8px 8px;
      margin-right: 15px;
      display: flex;
      justify-content: space-between;
      i{
        cursor: pointer;
      }
      .title{
        color: #7d7d7d;
      }
      .btn-wrapper{
        position:relative;
      }
    }
    .menu{
      margin: 0;
      padding: 0;
      list-style-type: none;
      li{
        a{
          display: block;
          padding: 0 20px;
          color: #5c5c5c;
          line-height: 35px;
          box-sizing: border-box;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space:nowrap;
          &:hover{
            color: #000;
          }
          i{
            display: inline-block;
            margin-right: 8px;
          }
        }
      }
    }
  }
  // .router-link-active{
  //   padding-left: 15px!important;
  //   color: #000!important;
  //   background-color: #e6e7ea;
  //   border-left: 5px solid #c62f2f;
  // }
  .router-link-exact-active{
    padding-left: 15px!important;
    color: #000!important;
    background-color: #e6e7ea;
    border-left: 5px solid #c62f2f;
  }
</style>
