<template>
  <div class="avatar" @click="handleShowMoadl">
    <Poptip
      placement="bottom"
      width="273"
      :disabled="loginInfo.userData.code ? loginInfo.userData.code === 200 ? false : true: true"
      style="margin-right:150px"
      @click.native="handlePop"
    >
      <div class="poptipheader">
        <Avatar icon="ios-person" :src="userLoginInfo.avatarUrl"/>
        <span class="loginMessage">
          {{userLoginInfo.loginMessage}}
          <Icon type="md-arrow-dropdown" size="20" />
        </span>
      </div>
      <div class="userPanel" slot="content">
        <div class="userheader">
          <Avatar icon="ios-person" :src="userLoginInfo.avatarUrl" size="large"/>
          <span class="loginMessage">{{userLoginInfo.loginMessage}}</span>
        </div>
        <div class="userStatus">
          <div class="item">
            <h3>{{userData.djStatus}}</h3>
            <span>动态</span>
          </div>
          <div class="item">
            <h3>{{userData.follows}}</h3>
            <span>关注</span>
          </div>
          <div class="item">
            <h3>{{userData.followeds}}</h3>
            <span>粉丝</span>
          </div>
        </div>
      </div>
    </Poptip>
    <!-- 模态框 -->
    <Modal
      v-model="isShowLoginModal"
      width="360"
      :footer-hide="true"
      :mask-closable="false"
      @on-visible-change="closeModal"
    >
      <div class="modalForm">
        <div class="img">
          <img src="../../../assets/img/phone.jpg" alt style="width:100%" />
        </div>
        <Form ref="phoneLoginForm" :model="phoneLoginForm" :rules="phoneRuleLogin">
          <FormItem prop="username">
            <Input type="text" v-model="phoneLoginForm.username" placeholder="手机号">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="phoneLoginForm.password" placeholder="密码">
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button @click="handlePhoneSubmit('phoneLoginForm')" class="submitButton">登录</Button>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      isShowLoginModal: false,
      userData: {
        djStatus: '',
        follows: '',
        followeds: ''
      },
      // 手机登录表单的数据
      phoneLoginForm: {
        username: '',
        password: '',
        type: 'phone'
      },
      phoneRuleLogin: {
        username: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            type: 'string',
            min: 11,
            max: 11,
            message: '请输入11位数字的手机号',
            trigger: 'blur'
          }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
      // 手机登录表单的数据结束
    };
  },
  methods: {
    // 处理是否显示登录对话框
    handleShowMoadl () {
      if (this.loginInfo.userData.code !== 200) {
        // 需要登录
        this.isShowLoginModal = true;
      }
    },
    // 单击头像时
    async handlePop () {
      if (this.loginInfo.userData.code === 200) {
        await this.$store.dispatch('user/getUserDetail', this.loginInfo.userData.profile.userId);
        console.log('ok');
        this.userData = this.userDetail.profile;
        console.log(this.userData);
      }
    },
    // 处理手机登录
    handlePhoneSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch('login/login', this.phoneLoginForm);
          if (this.loginInfo.userData.code === 200) {
            this.isShowLoginModal = false;
            this.$Message.success('恭喜你，登录成功！');
          }
        } else {
          this.$Message.warning('请检查表单');
        }
      });
    },
    closeModal () {
      this.$refs.phoneLoginForm.resetFields();
    }
  },
  computed: {
    ...mapState('login', ['loginInfo', 'userDetail']),
    ...mapState('user', ['userDetail']),
    userLoginInfo () {
      if (this.loginInfo.userData.code === 200) {
        return {
          loginMessage: this.loginInfo.userData.profile.nickname,
          avatarUrl: this.loginInfo.userData.profile.avatarUrl
        };
      } else {
        return {
          loginMessage: '未登录',
          avatarUrl: ''
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  .poptipheader {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-top: 5px;
    &:hover {
      .loginMessage {
        color: #ffffff;
      }
    }
    .loginMessage {
      display: flex;
      align-items: center;
      margin-left: 10px;
      color: rgb(229, 196, 174);
    }
  }
  // 弹出框
  .userPanel{
    .userheader{
      padding: 20px 10px 10px 10px;
      text-align: left;
      .loginMessage{
        display: inline-block;
        margin-left: 15px;
      }
    }
    .userStatus{
      display: flex;
      padding: 10px 0px 30px 0px;
      justify-content: space-between;
      border-bottom: 1px solid #e1e1e2;
      .item{
        text-align: center;
        flex: 1;
        border-right: 1px solid #e1e1e2;
        &:last-child{
          border: none
        }
      }
    }
  }
}
.modalForm {
  margin: 60px 0;
  padding: 0 30px;
  width: 100%;
  box-sizing: border-box;
  .submitButton {
    box-sizing: content-box;
    background-color: rgb(233, 73, 72);
    width: 100%;
    border: none;
    padding: 5px 0;
    font-size: 16px;
    color: #ffffff;
  }
}
.ivu-poptip-body{
  padding: 0!important;
}
</style>
