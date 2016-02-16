/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .filter('moment_unix', momentUnixFilter)
        .filter('moment_from_now', momentFromNowFilter)
        .filter('moment_unix_from_now', momentUnixFromNowFilter)
    ;

    function momentUnixFilter(input, format) {
      return moment.unix(input).format(format || 'YYYY-MM-DD HH:mm:ss');
    }
    
    function momentFromNowFilter() {
      return function (input) {
        return moment(input).fromNow();
      };
    }

    function momentUnixFromNowFilter(input) {
      return moment.unix(input).fromNow();
    }

})();