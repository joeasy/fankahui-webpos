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
        .filter('item_type', itemTypeFilter);

    function itemTypeFilter() {
        var type = {
          entity: "实体商品",
          service: "服务项目"
        }
        return function(key) {
          return type[key];
        }
    }

})();