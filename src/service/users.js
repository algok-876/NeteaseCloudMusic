import neteaseApi from './axios_config';
import axios from 'axios';

function addTimeStamp (url) {
  return url + '/' + Date.now();
};

// 获取用户信息 , 歌单，收藏，mv, dj 数量
async function getUserSubCount () {
  const res = await neteaseApi.post(addTimeStamp('/user/subcount'));
  return res;
};

// 获取用户歌单
async function getUserPlayList (uid) {
  const res = await neteaseApi.post(addTimeStamp('/user/playlist'), {
    uid
  });
  return res;
};

// 用户新建歌单
async function createPlayList (query) {
  const res = await neteaseApi.post(addTimeStamp('/playlist/create'), query);
  return res;
};

// 删除用户歌单
async function deletePlaylist (id) {
  const res = await neteaseApi.post(addTimeStamp('/playlist/delete'), {
    id
  });
  return res;
}

// 获取歌单详情
async function getPlaylistDeteail (id) {
  const res = await neteaseApi.post(addTimeStamp('/playlist/detail'), {
    id
  });
  return res;
}

// 获取歌曲
async function getSongDetail (ids) {
  const res = await neteaseApi.post(addTimeStamp('/song/detail'), {
    ids
  });
  return res;
}

// 获取音乐url
async function getSongUrl (id) {
  const res = await neteaseApi.post(addTimeStamp('/song/url'), { id });
  return res;
}

// 返回心动播放列表
async function returnHeartBeatList (cursong, id, pid) {
  const res = await neteaseApi.post(addTimeStamp('/playmode/intelligence/list'), {
    id,
    pid
  });
  // 获取所有歌曲的id组成字符串
  const ids = res.data.map(song => {
    return song.id;
  }).join(',');
  const songUrls = await getSongUrl(ids);
  const heartbeat = res.data.map((song, index) => {
    return {
      al: song.songInfo.al,
      ar: song.songInfo.ar,
      dt: song.songInfo.dt,
      id: song.id,
      mv: song.songInfo.mv,
      name: song.songInfo.name,
      order: index + 1,
      songurl: songUrls.data.find((urlItem) => {
        return urlItem.id === song.id;
      }).url
    };
  });
  heartbeat.splice(0, 0, { ...cursong, order: 0 });
  return heartbeat;
}

// 获取音乐blob对象
async function getBlob (url) {
  const blob = await axios.get(url, {
    responseType: 'blob'
  });
  return blob;
};

// 获取用户喜欢的音乐列表
async function getLikelist (uid) {
  const res = await neteaseApi.post(addTimeStamp('/likelist'), {
    uid
  });
  return res;
}

// 喜欢音乐
async function likeSong (id, like) {
  const res = await neteaseApi.get('/like', {
    params: {
      id,
      like,
      time: +new Date()
    }
  });
  return res;
}

// 取消/收藏歌单
async function subscribe (t, id) {
  const res = await neteaseApi.get('/playlist/subscribe', {
    params: {
      t,
      id
    }
  });
  return res;
}

export default {
  getUserSubCount,
  getUserPlayList,
  createPlayList,
  deletePlaylist,
  getPlaylistDeteail,
  getSongDetail,
  getSongUrl,
  getLikelist,
  likeSong,
  subscribe,
  getBlob,
  returnHeartBeatList
};
