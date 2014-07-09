'use strict';

module.exports = function(config) {

  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
    process.exit(1);
  }

  // https://saucelabs.com/platforms
  var customLaunchers = {
    'SL_ANDROID_4.3': {
      base: 'SauceLabs',
      browserName: 'android',
      deviceName: 'LG Nexus 4 Emulator',
      plataform: 'Linux',
      version: '4.3'
    },
    'SL_ANDROID_GALAXY_2': {
      base: 'SauceLabs',
      browserName: 'android',
      plataform: 'Linux',
      deviceName: 'Samsung Galaxy S2 Emulator',
      version: '4.2'
    },
    'SL_IOS_7': {
      base: 'SauceLabs',
      browserName: 'iphone',
      deviceName: 'iPhone',
      plataform: 'OS X 10.9',
      version: '7.0'
    },
    'SL_IOS_6': {
      base: 'SauceLabs',
      browserName: 'iphone',
      deviceName: 'iPhone',
      plataform: 'OS X 10.8',
      version: '6.0'
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    'SL_Firefox': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '26'
    },
    'SL_IE_8': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2007',
      version: '8'
    },
    'SL_IE_9': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2008',
      version: '9'
    },
    'SL_IE_10': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2012',
      version: '10'
    },
    'SL_IE_11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    }
  };

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

    sauceLabs: {
      testName: 'XHR Listener - Continuous integration test',
      recordScreenshots: false
    },

    captureTimeout: 120000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    singleRun: true
  });
};
