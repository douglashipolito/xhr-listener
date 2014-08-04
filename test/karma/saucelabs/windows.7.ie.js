'use strict';

module.exports = function(config) {
  var commonSauceLabsSetup = require('./_common.conf.js'),

      //Load sauce browsers
      sauceBrowsers = {
        'ie.8': {
          base: 'SauceLabs',
          browserName: 'internet explorer',
          platform: 'Windows 7',
          version: '8'
        },
        'ie.9': {
          base: 'SauceLabs',
          browserName: 'internet explorer',
          platform: 'Windows 7',
          version: '9'
        }
      };

  //Start common setup
  commonSauceLabsSetup(config);

  //Set the karmaConfig
  config.set({
    customLaunchers: sauceBrowsers,
    browsers : Object.keys(sauceBrowsers)
  });
};


