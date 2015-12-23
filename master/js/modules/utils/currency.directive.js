/**=========================================================
 * Module: currency.js
 * Currency format d
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('currency', currency);

    currency.$inject = ['$window'];
    function currency($window) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, ngModelController) {
          ngModelController.$parsers.push(function(data) {
            //convert data from view format to model format
            return data*100; //converted
          });

          ngModelController.$formatters.push(function(data) {
            //convert data from model format to view format
            return data/100; //converted
          });
        }
      };
    }

})();
