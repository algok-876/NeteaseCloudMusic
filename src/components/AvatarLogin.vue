<template>
  <div class="avatar" @click="handleShowMoadl">
    <Poptip
      placement="bottom"
      width="273"
      :disabled="loginInfo.userData.code ? loginInfo.userData.code === 200 ? false : true: true"
      style="margin-right:150px"
      @click.native="handlePop"
      v-model="visible"
    >
      <div class="poptipheader">
        <Avatar icon="ios-person" :src="userLoginInfo.avatarUrl"/>
        <span class="loginMessage">
          {{userLoginInfo.loginMessage}}
        </span>
        <Icon type="md-arrow-dropdown" size="20" />
      </div>
      <template v-if="visible">
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
        <!-- 用户基本信息列表 -->
        <ul class="datalist">
          <li>
            <div class="left">
              <Icon custom="iconfont icon-huiyuanzhongxin" />
              <span class="text">会员中心</span>
            </div>
            <div class="right">
              <span class="text">{{userDetail.profile.vipType === 0? '未订购':'已订购'}}</span>
              <Icon type="ios-arrow-forward" />
            </div>
          </li>
          <li>
            <div class="left">
              <Icon custom="iconfont icon-dengji" />
              <span class="text">等级</span>
            </div>
            <div class="right">
              <span class="text">LV.{{userDetail.level}}</span>
              <Icon type="ios-arrow-forward" />
            </div>
          </li>
          <li style="border-bottom: 1px solid #e8e8e8" @click="openUrl('https://music.163.com/store/product', '_blank')">
            <div class="left">
              <Icon custom="iconfont icon-shangcheng" />
              <span class="text">商城</span>
            </div>
            <div class="right">
              <Icon type="ios-arrow-forward" />
            </div>
          </li>
          <li>
            <div class="left">
              <Icon custom="iconfont icon-shezhi" />
              <span class="text">个人信息设置</span>
            </div>
            <div class="right">
              <Icon type="ios-arrow-forward" />
            </div>
          </li>
          <li style="border-bottom: 1px solid #e8e8e8">
            <div class="left">
              <Icon custom="iconfont icon-shouji" />
              <span class="text">绑定社交账号</span>
            </div>
            <div class="right">
              <Icon type="ios-arrow-forward" />
            </div>
          </li>
          <li @click="logout">
            <div class="left">
              <Icon custom="iconfont icon-guanbi_dianyuan" />
              <span class="text">退出登录</span>
            </div>
          </li>
        </ul>
      </div>
      </template>
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
        <a class="back" v-if="curFormType==='callReg'" @click.prevent="backLog">
          <Icon type="ios-arrow-back" />返回登录</a>
        <div class="img">
          <img src="../assets/img/phone.jpg" alt style="width:100%" />
        </div>
        <Form ref="publicForm" :model="publicForm" :rules="publicRules">

          <template v-if="regStep===''">
            <FormItem prop="username">
              <Input type="text" v-model="publicForm.username" placeholder="手机号">
                <Icon custom="iconfont icon-shouji" slot="prepend" style="color:#515a6e"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="publicForm.password" :placeholder="curFormType==='callReg'?'设置登录密码，不少于6位':'密码'">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
          </template>
          <template v-if="regStep==='sms'">
            <p class="reg-tip">为了安全，我们会向你的手机发送短信验证码</p>
            <FormItem prop="SMS">
              <div class="smsFormItem">
                <Input type="text" v-model="publicForm.sms" placeholder="短信验证码">
                  <Icon custom="iconfont icon-mess" slot="prepend"></Icon>
                </Input>
                <button class="time" @click.prevent="repSendSMS" :disabled="cooldown!==0">{{cooldown === 0 ? '重新发送' : cooldown + 's'}}</button>
              </div>
            </FormItem>
          </template>
          <template v-if="regStep==='nickname'">
            <p class="reg-tip">取一个昵称，让大家记得您！</p>
            <FormItem prop="nickname">
            <Input type="text" v-model="publicForm.nickname" placeholder="昵称不少于4个英文或汉字">
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
            </FormItem>
          </template>
          <FormItem>
            <Button @click="handlePhoneSubmit('publicForm')" class="submitButton" v-if="curFormType!=='callReg'&&curFormType!==''">登录</Button>
            <Button @click="nextSMS('publicForm')" class="submitButton" v-if="curFormType==='callReg'&&curFormType!==''">注册</Button>
            <Button @click="nextNickName('publicForm')" class="submitButton" v-if="regStep==='sms'">下一步</Button>
            <Button @click="reg('publicForm')" class="submitButton" v-if="regStep==='nickname'">开启云音乐</Button>
          </FormItem>
        </Form>
        <p class="jump">
          <a @click.prevent="caseRegForm" v-if="curFormType!=='callReg'&&curFormType!==''">注册</a>
        </p>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data () {
    const validateSMS = async (rule, value, callback) => {
      if (this.publicForm.sms.length !== 4) {
        callback(new Error('验证码为四位数'));
        return;
      }
      const res = await this.$remoteInterface.verifySMS(this.publicForm.username, this.publicForm.sms);
      if (res.code === 503) {
        callback(new Error('验证码错误'));
      }
    };
    const validateNick = async (rule, value, callback) => {
      const partten = /([\u4e00-\u9fa5]{2})|([a-zA-Z]{4})/g;
      const flag = partten.test(value);
      console.log(flag);
      if (!flag) {
        callback(new Error('至少四个字母或两个汉字'));
      } else {
        const res = await this.$remoteInterface.reg(this.publicForm.username, this.publicForm.password, this.publicForm.sms, this.publicForm.nickname);
        if (res.code === 505) {
          callback(new Error(res.msg));
        } else {
          return true;
        }
      }
    };
    return {
      isShowLoginModal: false,
      visible: false,
      curFormType: 'callLog',
      regStep: '',
      userData: {
        djStatus: '',
        follows: '',
        followeds: ''
      },
      cooldown: 0,
      // 手机登录表单的数据
      publicForm: {
        username: '',
        password: '',
        sms: '',
        nickname: '',
        type: 'phone'
      },
      publicRules: {
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
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '密码不少于6位',
            trigger: 'blur'
          }],
        SMS: [{ validator: validateSMS, trigger: 'blur' }],
        nickname: [{ validator: validateNick, trigger: 'blur' }]
      }
      // 手机登录表单的数据结束
    };
  },
  async created () {
    await this.$remoteInterface.refreshLogStatus();
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
      // 登录后才可以获取1用户详细信息
      if (this.loginInfo.userData.code === 200) {
        this.userData = this.userDetail.profile;
      }
    },
    // 处理手机登录
    handlePhoneSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch('login/login', this.publicForm);
          if (this.loginInfo.userData.code === 200) {
            this.isShowLoginModal = false;
            await this.$store.dispatch('user/getUserDetail', this.loginInfo.userData.profile.userId);
            this.$Notice.success({
              desc: '恭喜你，登录成功！'
            });
            // 登录成功后需要获取用户歌单
            this.$store.dispatch('user/getUserPlayList', this.$store.state.login.loginInfo.userData.profile.userId);
            this.$store.dispatch('user/getLikelist', this.$store.state.login.loginInfo.userData.profile.userId);
          }
        } else {
          this.$Message.warning('请检查表单');
        }
      });
    },
    // 退出登录
    async logout () {
      const res = await this.$remoteInterface.logout();
      await this.$remoteInterface.refreshLogStatus();
      if (res.code === 200) {
        this.visible = false;
        this.$Notice.info({
          desc: '已退出登录'
        });
        this.$store.commit('login/setLoginInfo', {});
        this.$store.commit('user/setUserDetail', {});
        this.$router.push('/');
      }
    },
    // 打开一个新窗口
    openUrl (url, name) {
      window.open(url, name);
    },
    closeModal () {
      setTimeout(() => {
        this.$refs.publicForm.resetFields();
        this.publicForm.username = '';
        this.curFormType = 'callLog';
        this.regStep = '';
      }, 500);
    },
    // 切换注册表单
    caseRegForm () {
      this.curFormType = 'callReg';
      this.$refs.publicForm.resetFields();
    },
    // 返回登录界面
    backLog () {
      this.curFormType = 'callLog';
      this.regStep = '';
      this.$refs.publicForm.resetFields();
    },
    // 验证注册表单，通过则进入短信验证码界面
    nextSMS (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          // 先判断改手机号是否注册过
          const check = await this.$remoteInterface.checkExistReg(this.publicForm.username);
          if (check.exist === 1) {
            this.$Notice.warning({
              desc: '该手机号已经被注册了 ',
              duration: 5
            });
            return;
          }
          this.regStep = 'sms';
          this.curFormType = '';
          // 发送验证码
          const res = await this.$remoteInterface.sendSMS(this.publicForm.username);
          if (res.code === 200) {
            this.$Notice.success({
              desc: '发送短信验证码成功'
            });
            this.cool();
          } else if (res.code === 400) {
            this.$Notice.warning({
              desc: res.message,
              duration: 7
            });
          }
          this.cool();
        }
      });
    },
    cool () {
      this.cooldown = 60;
      const timer = setInterval(() => {
        if (this.cooldown === 0) {
          clearInterval(timer);
          return;
        }
        this.cooldown -= 1;
      }, 1000);
    },
    // 重新发送
    async repSendSMS () {
      const res = await this.$remoteInterface.sendSMS(this.publicForm.username);
      if (res.code === 200) {
        this.$Notice.success({
          desc: '发送短信验证码成功'
        });
      } else if (res.code === 400) {
        this.$Notice.warning({
          desc: res.message,
          duration: 7
        });
      }
      this.cool();
    },
    nextNickName (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 短信验证码正确
          this.$Notice.success({
            desc: '短信验证通过'
          });
          this.regStep = 'nickname';
        };
      });
    },
    reg (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const res = await this.$remoteInterface.activeateNick(this.publicForm.nickname);
          if (res.code === 408) {
            this.$Notice.success({
              desc: res.message + ',注册成功',
              duration: 10
            });
            this.isShowLoginModal = false;
          }
        };
      });
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
    color: rgb(229, 196, 174);
    &:hover {
      .loginMessage, i{
        color: #ffffff;
      }
    }
    i{
      transition: all .3s;
    }
    .loginMessage {
      transition: all .3s;
      width: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 10px;
      color: rgb(229, 196, 174);
    }
  }
  // 弹出框
  .userPanel{
    .userheader{
      padding: 20px 20px 10px 20px;
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
    .datalist{
      margin: 0;
      padding: 0;
      list-style-type: none;
      li{
        &:hover{
          background-color: #ebeced;
        }
        padding: 0 20px;
        line-height: 36px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        // font-weight: 100;
        font-size: 13px;
        .left{
          i{
            color: #c1c1c2;
          }
          .text{
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
            color: #000;
          }
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
  .back{
    display: block;
    position: absolute;
    top: 15px;
    left: 15px;
    font-size: 14px;
    text-decoration: none;
    color: #000;
    font-weight: 200;
  }
  .submitButton {
    box-sizing: content-box;
    background-color: rgb(233, 73, 72);
    width: 100%;
    border: none;
    padding: 5px 0;
    font-size: 16px;
    color: #ffffff;
  }
  .smsFormItem{
    display: flex;
    justify-content: space-between;
    .time{
      display: inline-block;
      height: 32px;
      min-width: 120px;
      border-radius: 3px;
      cursor: pointer;
      border: none;
      outline: none;
      color: #ffffff;
      background-color: #c62f2f;
      margin-left: 20px;
    }
  }
  .reg-tip{
    text-align: center;
    margin: 15px 0;
  }
  .jump{
    text-align: center;
    a{
      color: #000;
      border-bottom: 1px solid #000;
      font-size: 16px;
    }
  }
}
.ivu-poptip-body{
  padding: 0!important;
}
</style>
