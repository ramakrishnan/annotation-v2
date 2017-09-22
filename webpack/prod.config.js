var webpackConfig = require('./base.config');
const Merge = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Over ride base config to meet prod settings
module.exports = Merge(webpackConfig, {
    plugins: [
        new ExtractTextPlugin('[name].min.css')
    ],
    output: {
        filename: '[name].min.js'
    },
    externals: ''
});
