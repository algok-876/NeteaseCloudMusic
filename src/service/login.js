import neteaseApi from './axios_config';

// 手机登录
async function callLogin (phoneNumber, password) {
  const res = await neteaseApi.get(encodeURI(`/login/cellphone?phone=${phoneNumber}&password=${password}`));
  return res;
};

// 检查登录状态,自动携带cookie
async function checkLoginStatus () {
  const res = await neteaseApi.get('/login/status');
  return res;
};

// 退出登录
async function logout () {
  const res = await neteaseApi.get('/logout');
  return res;
}

// 获取用户详细信息
async function getUserDetail (uid) {
  const res = await neteaseApi.get('/user/detail?uid=' + uid);
  return res;
}

export default {
  callLogin,
  checkLoginStatus,
  logout,
  getUserDetail
};
