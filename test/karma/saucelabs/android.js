'use strict';

module.exports = function(config) {
  var commonSauceLabsSetup = require('./_common.conf.js'),

      //Load sauce browsers
      sauceBrowsers = {
        'android.4.3': {
          base: 'SauceLabs',
          browserName: 'android',
          plataform: 'Linux',
          version: '4.3'
        },
        'android.galaxy.4.2': {
          base: 'SauceLabs',
          browserName: 'android',
          plataform: 'Linux',
          version: '4.2'
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
