module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix for webpack-dev-server allowedHosts issue
      if (webpackConfig.devServer) {
        webpackConfig.devServer.allowedHosts = 'all';
      }
      return webpackConfig;
    },
  },
  devServer: {
    allowedHosts: 'all',
  },
};
