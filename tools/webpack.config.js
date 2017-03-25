const path = require('path');

module.exports = {
    entry: './src/decoder.js',
    output: {
        path: `${path.dirname(__dirname)}/dist`,
        filename: 'deezerDecoder.js',
        library: 'deezerDecoder',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['env']
            }
        }]
    }
};
