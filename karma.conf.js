var webpackConfig = require('./webpack/test.config.js');

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        plugins: ['karma-mocha', 'karma-mocha-reporter', 'karma-coverage', 'karma-coverage-istanbul-reporter', 'karma-html-reporter',
            'karma-chrome-launcher', 'karma-phantomjs-launcher', 'karma-webpack', 'karma-sinon', 'karma-chai'
        ],
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'sinon', 'chai'],

        // list of files / patterns to load in the browser
        files: [
            'example/site.css',
            'example/template.html.js',
            'spec/**/*.spec.js'
        ],

        // list of files to exclude
        exclude: [],


        // pre-process matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
             "spec/**/*.spec.js": ['webpack']   
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [ 'mocha', 'coverage-istanbul', 'html' ],

        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly', 'text-summary'],
            dir: 'tests/coverage',
            fixWebpackSourcePaths: true
        },

        coverageReporter: {
            // specify a common output directory
            dir: 'tests/coverage/',
            type: 'html'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,

        htmlReporter: {
            outputDir: 'tests/reports/report'
        },
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        webpack: webpackConfig,
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    })
};
