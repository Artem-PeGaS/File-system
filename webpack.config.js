const path = require('path');

module.exports = {
    // mode: 'development',
    context: path.resolve(__dirname, 'scripts'),
    entry: {
        main: './main.js',
        script: './script.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
                use: {
                    loader: 'babel-loader'
                }
            },
        ]
    },
    output: {
        path: path.resolve(__dirname, 'www/scripts'),
        filename: '[name].js'
    },
    optimization: {
        runtimeChunk: { name: 'common' },
        splitChunks: {
            cacheGroups: {
                default: false,
                commons: {
                    test: /\.js$/,
                    name: 'common',
                    chunks: 'all',
                    minChunks: 2, // Выносить модули которые минимум в 2 входных точках.
                    enforce: true
                }
            }
        },
        minimize: false
    }
};