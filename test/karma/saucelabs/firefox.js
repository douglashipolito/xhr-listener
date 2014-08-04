'use strict';

module.exports = function(config) {
  var commonSauceLabsSetup = require('./_common.conf.js'),

      //Load sauce browsers
      sauceBrowsers = {
        'firefox.osx': {
          base: 'SauceLabs',
          browserName: 'firefox',
          plataform: 'OS X 10.9'
        },
        'firefox.windows': {
          base: 'SauceLabs',
          browserName: 'firefox',
          plataform: 'Windows 8.1'
        },
        'firefox.linux': {
          base: 'SauceLabs',
          browserName: 'firefox',
          platform: 'Linux'
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

