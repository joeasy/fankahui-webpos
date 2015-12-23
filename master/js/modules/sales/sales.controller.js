(function() {
    'use strict';

    angular
      .module('app.sales', [])
      .controller('SellController', SellController)
      .controller('checkoutDialogController', checkoutDialogController)
    ;
      
    SellController.$inject = ['$scope', 'Deal', 'ngDialog', 'SweetAlert', 'Sku'];
    function SellController($scope, Deal, ngDialog, SweetAlert, Sku) {
      var vm = this;
      
      vm.openDeal = function () {
        vm.deal = {
          entities: [],
          totalAmount: 0,
          totalQty: 0,
          created: new Date()
        }
        vm.selectedSku = undefined;
      }

      activate();
      
      function activate() {
        vm.openDeal();
      }
      
      vm.register = function () {
        if(vm.selectedSku && vm.selectedSku instanceof Sku) {
          var entity = undefined;
          angular.forEach(vm.deal.entities, function (e) {
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
            vm.deal.entities.push(entity);
          }
        }
        vm.selectedSku = undefined;
      }
      
      vm.fetchSkus = function (val) {
        return Sku.find({filter:{where:{barcode:{regex: val}}}, limit: 10})
        .$promise.then(function (skus) {
          return skus;
        });
      }
      
      vm.substractOne = function (entity, index) {
        entity.qty--;
        if(entity.qty === 0) {
          vm.deal.entities.splice(index, 1);
        }
      }
            
      vm.countTotal = function () {
        vm.deal.totalAmount = 0;
        vm.deal.totalQty = 0;
        angular.forEach(vm.deal.entities, function (entity) {
          vm.deal.totalQty += entity.qty;
          vm.deal.totalAmount += entity.qty*entity.sku.price;
        });
        return vm.deal.totalAmount;
      }
      
      vm.checkout = function () {
        ngDialog.open({ 
          template: 'checkoutDialogId', 
          controller: 'checkoutDialogController', 
          data: vm.deal 
        });
      }
    }
    
    checkoutDialogController.$inject = ['$scope', 'ngDialog', 'Deal', 'toaster', '$filter'];
    function checkoutDialogController($scope, ngDialog, Deal, toaster, $filter) {

        activate();

        ////////////////

        function activate() {
          $scope.ngDialogData.payment = {
            amount: $scope.ngDialogData.totalAmount,
            type: 'cash'
          }          
        }
        
        $scope.confirm = function () {
          Deal.create($scope.ngDialogData)
          .$promise.then(function (deal) {
            $scope.submiting = false;
            ngDialog.close();
            toaster.pop('success', '成功', "完成交易");
          }, function (err) {
            $scope.submiting = false;
            toaster.pop('error', '失败', "交易未完成，请重试！")
          });
          $scope.submiting = true;
        }
    }
    
})();