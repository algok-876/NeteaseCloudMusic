import axios from 'axios';

export default async function downloadMp3 (progress, ...files) {
  // 下载列表
  const downloadTasks = [];
  // 任务总数
  // 为下载列表中添加任务
  files.forEach(file => {
    if (file.url) {
      const task = axios.get(file.url, {
        responseType: 'blob',
        songname: file.downloadname,
        // 监听原生的进度条事件
        onDownloadProgress: function (progressEvent) {
          // 进度为
          const percent = Math.floor(progressEvent.loaded / progressEvent.total * 100);
          // 触发进度回调函数
          progress(percent);
        }
      });
      downloadTasks.push(task);
    }
  });
  // 将所有请求并发处理
  const results = await Promise.all(downloadTasks);
  // 循环结果，挨个下载
  results.forEach(res => {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(res.data);
    link.download = res.config.songname;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  });
};
