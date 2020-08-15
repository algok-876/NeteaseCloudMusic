<template>
  <div class="slidebar">
    <vue-scroll>
      <div class="wrapper">
        <slidemenu title="推荐" :menulist="recMenu"></slidemenu>
        <template v-if="loginInfo.status">
          <slidemenu title="创建的歌单" :menulist="createPlayList" :isCollapse="true" type="playlist" @right-click="rightclick">
            <Poptip placement="right" width="300" :transfer="true" v-model="visibleAdd" @on-popper-hide="addPlayListForm.name='';addPlayListForm.private=false">
              <Icon type="md-add-circle" size="16" style="color: #666; cursor: pointer;"/>
              <div class="add-play-list" slot="content">
                <h2 class="title">添加歌单</h2>
                <div class="form">
                  <Input v-model="addPlayListForm.name" placeholder="请输入新歌单标题" style="margin-bottom:10px"/>
                  <Checkbox v-model="addPlayListForm.private"> 设为隐私歌单</Checkbox></p>
                </div>
                <div class="footer">
                  <Button type="primary" :disabled="addPlayListForm.name.trim()===''" style="margin-right: 10px;" @click="add">创建</Button>
                  <Button @click="visibleAdd=false">取消</Button>
                </div>
              </div>
            </Poptip>
          </slidemenu>
          <slidemenu title="收藏的歌单" :menulist="subscribedPlayList" :isCollapse="true" type="playlist" @right-click="rightclick" menuType="subscribe"></slidemenu>
        </template>
      </div>
    </vue-scroll>
    <textMenu width="200px" :top="menuOffset.top" :left="menuOffset.left" v-if="textMenuVisible"></textMenu>
  </div>
</template>

<script>
import slidemenu from '../components/menu';
import { mapState } from 'vuex';
import textMenu from '../components/textMenu';
export default {
  data () {
    return {
      // 推荐菜单
      recMenu: [
        { href: '/find/recommendation', icon: 'iconfont icon-yinyue', name: '发现音乐', size: 20 },
        { href: '/fm', icon: 'iconfont icon-FM', name: '私人FM', size: 20 },
        { href: '/broadcast', icon: 'iconfont icon-zhibobofangshexiangjiguankanxianxing', name: 'LOOK直播', size: 20 },
        { href: '/video', icon: 'iconfont icon-shipin2', name: '视频', size: 20 },
        { href: '/friend', icon: 'iconfont icon-pengyou', name: '朋友', size: 20 }
      ],
      addPlayListForm: {
        name: '',
        private: false
      },
      // 控制弹框
      visibleAdd: false,
      menuOffset: {
        top: '',
        left: ''
      },
      textMenuVisible: false
    };
  },
  mounted () {
    document.addEventListener('click', (e) => {
      this.textMenuVisible = false;
    });
  },
  methods: {
    async add () {
      const res = await this.$remoteInterface.createPlayList({
        name: this.addPlayListForm.name.trim(),
        privacy: this.addPlayListForm.private ? 10 : ''
      });
      if (res.code === 200) {
        this.visibleAdd = false;
        this.$store.dispatch('user/getUserPlayList', this.$store.state.login.loginInfo.userData.profile.userId);
      }
    },
    // 右击歌单项
    rightclick (offset) {
      this.textMenuVisible = true;
      this.menuOffset = offset;
    }
  },
  computed: {
    ...mapState('user', ['userPlayList']),
    ...mapState('login', ['loginInfo']),
    createPlayList () {
      const arr = this.userPlayList.map((value, index) => {
        if (!value.subscribed) {
          return {
            href: '/pldetail?id=' + value.id,
            icon: index === 0 ? 'iconfont icon-xinaixin' : value.privacy === 10 ? 'iconfont icon-suo' : 'iconfont icon-yinfu_',
            name: index === 0 ? '我喜欢的音乐' : value.name,
            size: index === 0 ? 14 : 16,
            id: value.id
          };
        }
      }).filter(value => {
        return value !== undefined;
      });
      return arr;
    },
    subscribedPlayList () {
      const arr = this.userPlayList.map((value, index) => {
        if (value.subscribed) {
          return {
            href: '/pldetail?id=' + value.id,
            icon: 'iconfont icon-yinfu_',
            name: value.name,
            size: 16,
            id: value.id
          };
        }
      }).filter(value => {
        return value !== undefined;
      });
      return arr;
    }
  },
  components: {
    slidemenu,
    textMenu
  }
};
</script>

<style lang="scss" scoped>
.slidebar{
  width: 200px;
  height: 100%;
  background-color: rgb(245, 245, 246);
  box-sizing: content-box;
  border-right: 1px solid rgb(225, 225, 226);
}
.wrapper{
  width: 200px;
  // padding-right: 8px;
}
.add-play-list{
  padding: 20px 15px;
  .title{
    font-weight: 400;
    font-size: 20px;
    letter-spacing: 2px;
  }
  .form{
    margin: 25px 0;
    display: flex;
    flex-direction: column;
  }
  .footer{
    display: flex;
    justify-content: center;
  }
}
</style>
