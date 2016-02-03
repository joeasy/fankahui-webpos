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

})();