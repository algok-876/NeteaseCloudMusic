import axios from 'axios';

const neteaseApi = axios.create({
  // baseURL: 'http://localhost:4000',
  timeout: 10000
});

// 添加响应拦截器
neteaseApi.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return error.response.data;
});

export default neteaseApi;
