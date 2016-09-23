module.exports = require('./webpack.config.js')({
  isProduction: true,
  devtool: 'source-map',
  jsFileName: 'app.[chunkhash].js',
  cssFileName: 'app.[chunkhash].css',
});
