'use strict';

module.exports = function(config) {
  var commonSauceLabsSetup = require('./_common.conf.js'),

      //Load sauce browsers
      sauceBrowsers = {
        'ios.7': {
          base: 'SauceLabs',
          browserName: 'iphone',
          plataform: 'OS X 10.9',
          version: '7.0'
        }/*,
        'ios.6.1': {
          base: 'SauceLabs',
          browserName: 'iphone',
          plataform: 'OS X 10.8',
          version: '6.1'
        }*/
      };

  //Start common setup
  commonSauceLabsSetup(config);

  //Set the karmaConfig
  config.set({
    customLaunchers: sauceBrowsers,
    browsers : Object.keys(sauceBrowsers)
  });
};


