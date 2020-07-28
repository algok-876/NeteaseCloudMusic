import neteaseApi from './axios_config';

function addTimeStamp (url) {
  return url + '/' + Date.now();
};

// 发送验证码
async function sendSMS (phone) {
  const res = await neteaseApi.post(addTimeStamp('/captcha/sent'), {
    phone: phone
  });
  return res;
};

// 验证短信验证码
async function verifySMS (phone, captcha) {
  const res = await neteaseApi.post(addTimeStamp('/captcha/verify'), {
    phone: phone,
    captcha: captcha
  });
  return res;
}

// 检查改手机号是否注册过
async function checkExistReg (phone) {
  const res = await neteaseApi.post(addTimeStamp('/cellphone/existence/check'), {
    phone
  });
  return res;
}

// 注册
async function reg (phone, password, captcha, nickname) {
  const res = await neteaseApi.post(addTimeStamp('/register/cellphone'), {
    phone,
    password,
    captcha,
    nickname
  });
  return res;
}

// 初始化昵称
async function activeateNick (nick) {
  const res = await neteaseApi.post('/activate/init/profile', {
    nickname: nick
  });
  return res;
}

export default {
  sendSMS,
  verifySMS,
  checkExistReg,
  reg,
  activeateNick
};
