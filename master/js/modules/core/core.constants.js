/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('APP_MEDIAQUERY', {
          'desktopLG':             1200,
          'desktop':                992,
          'tablet':                 768,
          'mobile':                 480
        })
        // .constant('urlBase', "http://0.0.0.0:3000/api")
        .constant('urlBase', "http://api.fankahui.com:3000/api")
      ;

})();
