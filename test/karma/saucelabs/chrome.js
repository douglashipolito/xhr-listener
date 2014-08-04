'use strict';

module.exports = function(config) {
  var commonSauceLabsSetup = require('./_common.conf.js'),

      //Load sauce browsers
      sauceBrowsers = {
        'chrome.osx': {
          base: 'SauceLabs',
          browserName: 'chrome',
          plataform: 'OS X 10.9'
        },
        'chrome.windows': {
          base: 'SauceLabs',
          browserName: 'chrome',
          plataform: 'Windows 8.1'
        },
        'chrome.linux': {
          base: 'SauceLabs',
          browserName: 'chrome',
          plataform: 'Linux'
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

