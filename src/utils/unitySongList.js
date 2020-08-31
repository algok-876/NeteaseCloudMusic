import api from '../service/index';

/**
 * 返回统一的歌单歌曲列表详情，包括歌曲的基本信息，和播放地址；
 * @param {*} playlistId 歌单id
 * @param {object} appendResult 需要追加到返回结果中的每一个对象中的属性
 */
export default async function unitySongList (playlistId, appendResult) {
  // 首先获取歌单详情
  const playlistDetail = await api.getPlaylistDeteail(playlistId);
  // 提取trackIds
  const trackIds = playlistDetail.playlist.trackIds.map((item, index) => {
    return item.id;
  });
  // 获取所有歌曲详情
  const songlist = await api.getSongDetail(
    trackIds.join(',')
  );
  if (songlist.code !== 200) {
    console.error('获取歌曲列表出错');
    return;
  };
  // 获取歌曲的播放url
  const songsIds = songlist.songs.map((value) => {
    return value.id;
  });
  const songUrls = await api.getSongUrl(
    songsIds.join(',')
  );
  if (songUrls.code !== 200) {
    console.error('获取播放地址失败');
    return;
  };
  return songlist.songs.map((item, index) => {
    return {
      order: index,
      id: item.id,
      name: item.name,
      ar: item.ar,
      al: item.al,
      mv: item.mv,
      dt: item.dt,
      songurl: songUrls.data.find((urlItem) => {
        return urlItem.id === item.id;
      }).url,
      ...appendResult
    };
  });
}
