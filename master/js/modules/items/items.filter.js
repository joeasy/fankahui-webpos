/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.items')
        .filter('item_type', itemTypeFilter)
        .filter('stock_type', stockTypeFilter)
        .filter('currency_cny', currencyCNYFilter)
    ;

    function itemTypeFilter() {
        var type = {
          entity: "实物商品",
          service: "服务项目"
        }
        return function(key) {
          return type[key];
        }
    }
    
    function currencyCNYFilter() {
      return function (val) {
        return "¥ "+val/100;
      }
    }
    
    function stockTypeFilter() {
      var type = {
        stock: "进货入库",
        sale: "销售出库",
        cancel: "核销出库",
        inventory: "盘点修正"
      }
      return function (key) {
        key = key || 'stock';
        return type[key];
      }
    }

})();