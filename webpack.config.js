const path = require('path');

module.exports = {
	mode: process.env.NODE_ENV, // development не сжатый а продакшн сжатый
	entry: ['./scripts/main.js'],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
				use: ['babel-loader']
			}
		]
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'www/scripts')
	}
};
