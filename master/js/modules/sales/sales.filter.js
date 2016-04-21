/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.sales')
        .filter('deal_status', dealStatusFilter)
        .filter('payment_type', paymentTypeFilter)
    ;

    paymentTypeFilter.$inject = ['dealService'];
    function paymentTypeFilter(dealService) {
        return function(key) {
          return dealService.payType[key];
        }
    }

    // dealStatusFilter.$inject = [];
    function dealStatusFilter() {
      var dic = {
        closed: '已完成'
      }
      return function (key) {
        return dic[key];
      }
    }
})();