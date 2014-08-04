'use strict';

module.exports = function(config) {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
    process.exit(1);
  }

  //Set the karmaConfig
  config.set({
    //base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../../..',

    //frameworks to use
    frameworks: ['jasmine'],

    //files
    files: [
      //lib
      'dist/xhr-listener.js',

      //tests
      'test/spec/*.js',

      //data
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
      connectOptions: {
        port: 5757
      }
    },

    browserDisconnectTimeout : 10000,
    browserDisconnectTolerance : 1,
    browserNoActivityTimeout : 4*60*1000,
    captureTimeout : 4*60*1000,

    singleRun: true
  });
};
