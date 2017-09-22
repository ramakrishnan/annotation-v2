var webpackConfig = require('./base.config');
const Merge = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Over ride base config to meet dev settings
module.exports = Merge(webpackConfig, {
    devtool: '#inline-source-map',
    plugins: [
        new ExtractTextPlugin('[name].css')
    ],
    externals: ''
});