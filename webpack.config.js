const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'v-check.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
            }
        ]
    }
};