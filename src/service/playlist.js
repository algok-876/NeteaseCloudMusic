import neteaseApi from './axios_config';

function addTimeStamp (url) {
  return url + '/' + Date.now();
};

// 获取歌单分类
async function getCatList () {
  const res = await neteaseApi.post(addTimeStamp('/playlist/catlist'));
  return res;
};

// 获取精品歌单
async function getBoutiquePlaylist (before, cat = '', limit = 15) {
  const res = await neteaseApi.post(addTimeStamp('/top/playlist/highquality'), {
    before,
    limit,
    cat
  });
  return res;
}

// 获取歌单
async function getPlaylist (offset = 1, cat = '', limit = 100) {
  const res = await neteaseApi.post(addTimeStamp('/top/playlist'), {
    offset,
    cat,
    limit
  });
  return res;
}

// 获取热门歌单分类
async function getHotCat () {
  const res = await neteaseApi.get('/playlist/hot');
  return res;
}

// 获取用户播放记录
/**
 * @param {*} uid 用户id
 * @param {*} type 类型，1表示一周内，0表示所有历史记录
 */
async function getPlayHistory (uid, type = 1) {
  const res = await neteaseApi.post(addTimeStamp('user/record'), {
    uid,
    type
  });
  return res;
}
/**
 * 获取所有榜单
 */
async function getToplist () {
  const res = await neteaseApi.get('/toplist');
  return res;
}

export default {
  getCatList,
  getBoutiquePlaylist,
  getPlaylist,
  getHotCat,
  getPlayHistory,
  getToplist
};
