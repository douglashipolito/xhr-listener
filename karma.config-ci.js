'use strict';

module.exports = function(config) {
  var grunt = require('grunt');

  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
    process.exit(1);
  }

  //Load sauce browsers
  var sauceBrowsers = grunt.file.readYAML('sauce_browsers.yml');

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    frameworks: ['jasmine'],

    //Files
    files: [
      //Lib
      'dist/xhr-listener.js',

      //Tests
      'test/spec/*.js',

      //Data
      {
        pattern:  'data/*',
        watched:  true,
        served:   true,
        included: false
      }
    ],

    reporters: ['dots', 'saucelabs'],
    port: 9876,

    htmlReporter: {
      outputDir: 'test/html/ci'
    },

    sauceLabs: {
      testName: 'XHR Listener - tests',
      recordScreenshots: false,
      startConnect: false
    },

    captureTimeout: 120000,
    browserDisconnectTimeout: 10000,
    browserNoActivityTimeout: 30000,

    customLaunchers: sauceBrowsers,
    browsers: Object.keys(sauceBrowsers)
  });
};
