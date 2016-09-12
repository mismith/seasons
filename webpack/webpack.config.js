const Path = require('path'),
      Webpack = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (options) => {
	const ExtractSASS = new ExtractTextPlugin(`/styles/${options.cssFileName}`);

	const webpackConfig = {
		devtool: options.devtool,
		entry: [
			Path.join(__dirname, '../src/app/index'),
		],
		output: {
			path: Path.join(__dirname, '../html'),
			filename: `/scripts/${options.jsFileName}`,
		},
		resolve: {
			extensions: ['', '.js', '.jsx'],
		},
		module: {
			loaders: [
				{test: /\.jsx?$/i, include: Path.join(__dirname, '../src/app'), loader: 'babel'},
				{test: /\.css$/i, loader: 'style!css'},
				{test: /\.(svg)(\?v=.+?)?$/i, loader: 'file?name=/images/[name].[ext]&mimetype=image/svg+xml'},
				{test: /\.(png|gif|jpe?g)(\?v=.+?)?$/i, loader: 'file?name=/images/[name].[ext]'},
			],
		},
		plugins: [
			new Webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify(options.isProduction ? 'production' : 'development'),
				},
			}),
			new HtmlWebpackPlugin({
				template: Path.join(__dirname, '../src/index.html'),
			}),
		],
	};

	if (options.isProduction) {
		webpackConfig.plugins.push(
			new Webpack.optimize.DedupePlugin(),
			new Webpack.optimize.OccurenceOrderPlugin(),
			new Webpack.optimize.UglifyJsPlugin({
				mangle: true,
				sourcemap: false,
				compressor: {
					warnings: false,
				},
			}),
			ExtractSASS
		);

		webpackConfig.module.loaders.push({
			test: /\.scss$/,
			loader: ExtractSASS.extract(['css', 'sass']),
		});
	} else {
		webpackConfig.entry = [
			`webpack-dev-server/client?http://localhost:${+options.port}`,
			'webpack/hot/dev-server',
			Path.join(__dirname, '../src/app/index'),
		];

		webpackConfig.plugins.push(
			new Webpack.HotModuleReplacementPlugin()
		);

		webpackConfig.module.loaders.push({
			test: /\.scss$/,
			loaders: ['style', 'css', 'sass'],
		});

		webpackConfig.devServer = {
			contentBase: Path.join(__dirname, '../'),
			hot: true,
			port: options.port,
			inline: true,
			progress: true,
			historyApiFallback: true,
		};
	}

	return webpackConfig;
};
