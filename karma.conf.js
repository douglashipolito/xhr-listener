'use strict';

module.exports = function(config) {

  //Set configs
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

    runnerPort: 9876,
    browsers: ['PhantomJS', 'Chrome', 'Firefox'],
    reporters: ['mocha'],

    colors: true,

    singleRun: false
  });

};
