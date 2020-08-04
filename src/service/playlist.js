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
async function getHotPlaylist (before, cat = '', limit = 15) {
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

export default {
  getCatList,
  getHotPlaylist,
  getPlaylist,
  getHotCat
};
