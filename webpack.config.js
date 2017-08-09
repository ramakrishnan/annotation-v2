var path = require('path');
var webpack = require('webpack');
var isTest = (process.env.NODE_ENV === 'test');

var ModuleLoaders = {
    'babel-loader': {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
            presets: ['es2015']
        }
    },
    'handlebar-loader': {
        test: /\.hbs/,
        loader: 'handlebars-loader'
    }
}

var devModuleLoaders = [
    ModuleLoaders['babel-loader'],
    ModuleLoaders['handlebar-loader']
];

module.exports = {
    environment: process.env.NODE_ENV,
    entry: {
        'annotator': ['./src/index.js']
    },
    output: {
        path: __dirname + '/public',
        filename: '[name].js',
        library: ['Annotator']
    },
    module: {
        loaders: devModuleLoaders
    },
    watch: false
};
