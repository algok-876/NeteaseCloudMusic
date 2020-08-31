module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: 'https://api.geekde.club/',
        changeOrigin: true,
        pathRewrite: { '^/': '' }
      }
    }
  }
};
