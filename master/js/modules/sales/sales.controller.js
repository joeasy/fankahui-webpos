(function() {
    'use strict';

    angular
      .module('app.sales')
      .controller('SellController', SellController)
      .controller('checkoutDialogController', checkoutDialogController)
      .controller('DealsController', DealsController)
      .controller('DealController', DealController)
      .controller('checkoutReturnDialogController', checkoutReturnDialogController)
    ;
      
    SellController.$inject = ['$scope', 'dealService', 'Checkin'];
    function SellController($scope, dealService, Checkin) {
      var vm = this;
            
      activate();
      
      function activate() {
        $scope.dealService = dealService;
        if(!dealService.deal) {
          dealService.openDeal();
        }
        
        // CHECKIN
        // ----------------------------------- 
        vm.checkins = Checkin.find({filter:{
          where: {merchantId: $scope.user.shopId},
          include: [{member: 'wxuser'}],
          limit: 10, 
          order: 'created DESC'
        }});
        
        vm.templateUrl = 'checkinsTemplate.html';
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
    
    DealController.$inject = ['$scope', 'Deal', 'ngTableParams', 'ngTableLBService', 'returnService'];
    function DealController($scope, Deal, ngTableParams, ngTableLBService, returnService) {
      var vm = this;
      
      activate();
      
      function activate() {
        vm.returnSku = {};
        vm.deal = Deal.findOne({filter:{
          where: {id: $scope.$state.params.dealId},
          include:['returns', 'bonuses']
        }});
        vm.deal.$promise.then(function (deal) {
          vm.deal.entities.forEach(function (entity) {
            entity.returnedQty = 0;
            vm.returnSku[entity.sku.id] = entity;
          });
          if(vm.deal.returns && vm.deal.returns.length > 0) {
            vm.deal.returns.forEach(function (ret) {
              ret.entities.forEach(function (returnEntity) {
                vm.returnSku[returnEntity.sku.id].returnedQty += returnEntity.qty;
              });
            });
            vm.return = vm.deal.returns[0];
          } else {
            vm.return = {entities:[]};
          }
          returnService.openReturn(vm.deal);
        });
      }
      
      vm.goReturn = function (entity) {
        returnService.checkout(entity).then(function (data) {
          activate();
        });
      }
    }

    checkoutReturnDialogController.$inject = ['$scope', 'ngDialog', 'returnService', 'toaster'];
    function checkoutReturnDialogController($scope, ngDialog, returnService, toaster) {

        activate();

        ////////////////

        function activate() {
          $scope.returnService = returnService;
        }
        
        $scope.confirm = function () {
          returnService.doReturn().then(function (ret) {
            $scope.submiting = false;
            ngDialog.close();
            toaster.pop('success', '成功', "完成退款退货");
          }, function (err) {
            $scope.submiting = false;
            toaster.pop('error', '失败', "退款退货未完成，请重试！")
          });
          $scope.submiting = true;
        }
        
    }

})();