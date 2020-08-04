import neteaseApi from './axios_config';

function addTimeStamp (url) {
  return url + '/' + Date.now();
};

// 获取banner
async function getBanners () {
  const res = await neteaseApi.post(addTimeStamp('/banner'));
  return res;
}

// 每日推荐歌单
async function getSongList () {
  const res = await neteaseApi.post(addTimeStamp('/recommend/resource'));
  return res;
}

// 最新音乐
async function getNewSongs () {
  const res = await neteaseApi.post(addTimeStamp('/personalized/newsong'));
  return res;
}

// 推荐电台
async function getDjprogram () {
  const res = await neteaseApi.post(addTimeStamp('/personalized/djprogram'));
  return res;
}

// 推荐mv
async function getRecMv () {
  const res = await neteaseApi.post(addTimeStamp('/personalized/mv'));
  return res;
}

// 独家放送
async function getPrivatecontent () {
  const res = await neteaseApi.post(addTimeStamp('/personalized/privatecontent'));
  return res;
}

export default {
  getBanners,
  getSongList,
  getNewSongs,
  getDjprogram,
  getRecMv,
  getPrivatecontent
};
