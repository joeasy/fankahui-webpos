/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.core')
        .filter('role', roleFilter)
        .filter('moment_unix', momentUnixFilter)
        .filter('moment_unix_from_now', momentUnixFromNowFilter)
    ;

    function roleFilter() {
        var role = {
          owner: "业主",
          shopManager: "店长",
          cashier: "收银员"
        };
        return function(key) {
          return role[key];
        }
    }
    
    function momentUnixFilter(input, format) {
      return moment.unix(input).format(format || 'YYYY-MM-DD HH:mm:ss');
    }
    
    function momentUnixFromNowFilter(input) {
      return moment.unix(input).fromNow();
    }

})();