'use strict';

module.exports = function(config) {
  var commonSauceLabsSetup = require('./_common.conf.js'),

      //Load sauce browsers
      sauceBrowsers = {
        'ie.10': {
          base: 'SauceLabs',
          browserName: 'internet explorer',
          platform: 'Windows 8',
          version: '10'
        },
        'ie.11': {
          base: 'SauceLabs',
          browserName: 'internet explorer',
          platform: 'Windows 8.1',
          version: '11'
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


