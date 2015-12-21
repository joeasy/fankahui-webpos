(function() {
    'use strict';

    angular
      .module('app.sales', [])
      .controller('SellController', SellController);
      
    SellController.$inject = ['$scope', 'Deal', 'ngDialog', 'SweetAlert', 'Sku'];
    function SellController($scope, Deal, ngDialog, SweetAlert, Sku) {
      var vm = this;
      
      activate();
      
      function activate() {
        vm.entities = [];
        vm.selectedSku = undefined;
      }
      
      vm.register = function () {
        if(!vm.selectedSku) return;
        var entity = undefined;
        angular.forEach(vm.entities, function (e) {
          if(e.sku.barcode === vm.selectedSku.barcode){
            e.qty++;
            entity = e;
          }
        });
        if(!entity) {
          entity = {
            sku: vm.selectedSku,
            qty: 1
          };
          vm.entities.push(entity);
        }
        vm.selectedSku = undefined;
      }
      
      vm.fetchSkus = function (val) {
        return Sku.find({filter:{where:{barcode:{regex: val}}}, limit: 10})
        .$promise.then(function (skus) {
          return skus;
        });
      }
      
      vm.countTotal = function () {
        var total = 0;
        angular.forEach(vm.entities, function (entity) {
          total += entity.qty*entity.sku.price;
        });
        return total;
      }
    }
})();