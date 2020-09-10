import neteaseApi from './axios_config';

// 获取热搜列表（详细）
async function getSearchHotDetail () {
  const res = await neteaseApi.get('/search/hot/detail');
  return res;
}

// 获得搜索建议
async function searchSuggest (keywords) {
  const res = await neteaseApi.get('/search/suggest?keywords=' + keywords);
  return res;
};

export default {
  getSearchHotDetail,
  searchSuggest
};
