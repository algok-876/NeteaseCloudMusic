import neteaseApi from './axios_config';

function addTimeStamp (url) {
  return url + '/' + Date.now();
};

// 获取歌单评论
async function getPlaylistComment (id, offset = 0, limit = 40) {
  const res = await neteaseApi.get('/comment/playlist', {
    params: {
      id,
      limit,
      offset
    }
  });
  return res;
}

// 获取歌单收藏者
async function getPlaylistSubscribers (id, offset = 0, limit = 70) {
  const res = await neteaseApi.post(addTimeStamp('/playlist/subscribers'), {
    id,
    offset,
    limit
  });
  return res;
}
export default {
  getPlaylistComment,
  getPlaylistSubscribers
};
