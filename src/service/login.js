import neteaseApi from './axios_config';

function addTimeStamp (url) {
  return url + '/' + Date.now();
};
// 手机登录
async function callLogin (phoneNumber, password) {
  console.log(neteaseApi);
  const res = await neteaseApi.post(addTimeStamp('/login/cellphone'), {
    phone: phoneNumber,
    password: password
  });
  return res;
};

// 检查登录状态,自动携带cookie
async function checkLoginStatus () {
  const res = await neteaseApi.post('/login/status');
  return res;
};

// 退出登录
async function logout () {
  const res = await neteaseApi.post('/logout');
  return res;
}
// 刷新登录状态
async function refreshLogStatus () {
  const res = await neteaseApi.post('/login/refresh');
  return res;
}

// 获取用户详细信息
async function getUserDetail (uid) {
  const res = await neteaseApi.post(addTimeStamp('/user/detail'), {
    uid
  });
  return res;
}

export default {
  callLogin,
  checkLoginStatus,
  logout,
  getUserDetail,
  refreshLogStatus
};
