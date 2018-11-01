const path = require('path');

module.exports = {
    // mode: 'development',
    entry: {
        main: './scripts/main.js'
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
        minimize: false
    }
};