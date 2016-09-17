module.exports = require('./webpack.config.js')({
  isProduction: true,
  devtool: 'source-map',
  jsFileName: 'app.js?v=[hash]',
  cssFileName: 'app.css?v=[hash]',
});
