var path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var isTest = (process.env.NODE_ENV === 'test');

module.exports = {
    entry: {
        'annotator': ['./src/index.js']
    },
    output: {
        path: __dirname + '/public',
        filename: '[name].js',
        libraryTarget: 'var',
        library: 'Annotator'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }, {
            test: /\.hbs/,
            exclude: /node_modules/,
            use: ['handlebars-template-loader']
        }, {
            test: /\.css$/,
            use: ['style-loader', {
                loader: 'css-loader',
                options: {
                    importLoaders: 1 // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                }
            }, ]
        }, {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }, {
            enforce: 'pre',
            test: /\.js$/, // include .js files
            exclude: /node_modules/, // exclude any and all files in the node_modules folder
            include: [
                path.join(__dirname, 'src')
            ]
            // loader: 'eslint-loader',
        }]
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ],
    watch: false
};