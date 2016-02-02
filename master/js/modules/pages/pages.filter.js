/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.pages')
        .filter('register_error', registerErrorFilter)
    ;
    
    function registerErrorFilter() {
        // "The `merchant` instance is not valid. Details: `name` name exist (value: "fankahui")."
      return function (msg) {
        if(/Merchant name exist/.test(msg)) return "商户名字已经存在";
        if(/User already exists/.test(msg)) return "用户名已经存在";
        else return msg;
      }
    }
})();