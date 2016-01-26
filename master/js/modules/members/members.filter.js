/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.members')
        .filter('wx_sex', wxsexFilter)
    ;

    function wxsexFilter() {
        // var type = {
        //   cash: "现金支付",
        //   bankcard: "刷卡支付",
        //   wxpay: "微信支付",
        //   alipay: "支付宝"
        // }
        var type = ['保密', '男', '女'];
        return function(key) {
          return type[key];
        }
    }

})();