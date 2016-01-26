(function() {
    'use strict';

    angular
      .module('app.sales')
      .controller('SellController', SellController)
      .controller('checkoutDialogController', checkoutDialogController)
      .controller('DealsController', DealsController)
    ;
      
    SellController.$inject = ['$scope', 'dealService'];
    function SellController($scope, dealService) {
      var vm = this;
      
      activate();
      
      function activate() {
        $scope.dealService = dealService;
        dealService.openDeal();
      }
            
    }
    
    checkoutDialogController.$inject = ['$scope', 'ngDialog', 'dealService', 'toaster'];
    function checkoutDialogController($scope, ngDialog, dealService, toaster) {

        activate();

        ////////////////

        function activate() {
          $scope.dealService = dealService;
        }
        
        $scope.confirm = function () {
          dealService.pay().then(function (deal) {
            $scope.submiting = false;
            ngDialog.close();
            dealService.openDeal();
            toaster.pop('success', '成功', "完成交易");
          }, function (err) {
            $scope.submiting = false;
            toaster.pop('error', '失败', "交易未完成，请重试！")
          });
          $scope.submiting = true;
        }
    }
    
    DealsController.$inject = ['$scope', 'Deal', 'ngTableParams', 'ngTableLBService'];
    function DealsController($scope, Deal, ngTableParams, ngTableLBService) {
      var vm = this;
      
      activate();
      
      function activate() {
        vm.keyword = "";
        vm.tableParams = new ngTableParams({count: 10}, {
          getData: function($defer, params) {
            var filter = {where:{status:{ne:'deleted'}}, include:[]}
            if(vm.keyword != '') {
              var qs = {regex: keyword};
              filter.where.or = [{"entities.sku.item.name":qs}];
              params.page(1);
            }
            ngTableLBService.getData($defer, params, Deal, filter);
          }
        });
      }
    }
})();