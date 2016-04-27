(function() {
    'use strict';

    angular
      .module('app.items', [])
      .controller('ItemsController', ItemsController)
      .controller('StockDialogController', StockDialogController)
      .controller('StocksController', StocksController)
      .controller('ItemAddController', ItemAddController);
    
    ItemsController.$inject = ['$scope', 'ngTableParams', 'Sku', 'ngDialog', 'SweetAlert', 'ngTableLBService'];
    function ItemsController($scope, ngTableParams, Sku, ngDialog, SweetAlert, ngTableLBService) {
      var vm = this;
      
      activate();
      
      function activate() {
        vm.keyword = "";
        vm.tableParams = new ngTableParams({count: 10}, {
          getData: function($defer, params) {
            var filter = {
              where:{status:{ne:'deleted'}}, 
              include:[
                {
                  relation:'inventories',
                  scope:{ where: {shopId: $scope.user.shop.id} }
                }
              ]
            };
            if(vm.keyword != '') {
              var qs = {regex: keyword};
              filter.where.or = [{"item.name":qs}, {model:qs}];
              params.page(1);
            }
            ngTableLBService.getData($defer, params, Sku, filter);
          }
        });
      }
            
      vm.stock = function (sku, type) {
        ngDialog.open({ 
          template: 'stockDialogId', 
          controller: 'StockDialogController', 
          data: {sku: sku, type: type} 
        });
      }
      
      vm.delete = function (sku) {
        SweetAlert.swal({   
          title: '确定删除商品'+sku.item.name,   
          text: '删除商品后将无法恢复，你确定要删除商品？',   
          type: 'warning',   
          showCancelButton: true,   
          confirmButtonColor: '#DD6B55',   
          confirmButtonText: '是的，删除！',
          cancelButtonText: '不，取消！',   
          closeOnConfirm: false
        },  function(isConfirm){  
          if(isConfirm) {
            sku.status = 'deleted';
            sku.$save(function () {
              SweetAlert.swal('已删除!','你的商品'+sku.item.name+'已经删除。', 'success');
            }, function (err) {
              SweetAlert.swal('失败!', '删除商品时发生错误，你的商品没有被删除。', 'error');
            });
          }
        });
      }
      
      vm.confirm = function (sku) {
        var qty = 0;
        var inventory = sku.inventories[0];
        if(inventory) {
          qty = inventory.balance;
        }
        Sku.stocks.create({id: sku.id}, {type: 'inventory', qty: qty}).$promise.then(function (data) {
          vm.tableParams.reload();
          SweetAlert.swal('盘点成功!','你的商品'+sku.item.name+'已经盘点确认。', 'success');
        });
      }
      
    }
    
    ItemAddController.$inject = ['$scope', 'Item'];
    function ItemAddController($scope, Item) {
      activate();
      
      window.ParsleyValidator.setLocale('zh_cn');
      
      function activate() {
        $scope.entity = {
          type: "entity",
          name: "iPhone6S Plus",
          skus: [{barcode: "456", price: 608800, model: "16GB", stockQty:3}]
        };
      }
      
      $scope.save = function () {
        Item.create($scope.entity).$promise
        .then(function (item) {
          $scope.$state.go('app.item');
        });
      }
      
      $scope.saveAndMore = function () {
        Item.create($scope.entity)
      }
    }
    
    StockDialogController.$inject = ['$scope', 'ngDialog', 'Stock', 'toaster', '$filter'];
    function StockDialogController($scope, ngDialog, Stock, toaster, $filter) {

        activate();

        ////////////////

        function activate() {
          $scope.stockQty = 0;
        }
        
        $scope.confirm = function () {
          var sku = $scope.ngDialogData.sku;
          var type = $scope.ngDialogData.type;
          var memo = $scope.ngDialogData.memo;
          Stock.create({skuId: sku.id, qty: $scope.stockQty, type: type, memo: memo});
          if(!sku.inventories[0]) {
            sku.inventories[0] = {qty: 0, modified: new Date()};
          }
          sku.inventories[0].qty += $scope.stockQty;
          ngDialog.close();
          toaster.pop('success', '成功',
           "完成"+$filter('stock_type')(type)+sku.item.name+": "+$scope.stockQty+"件");
        }
    }
    
    StocksController.$inject = ['$scope', 'Stock', 'ngTableParams'];
    function StocksController($scope, Stock, ngTableParams) {
      var vm = this;
      
      active();
      
      function active() {
        vm.filter = {text: ''}
        vm.tableParams = new ngTableParams({
          count: 10,
          filter: vm.filter.text
        }, {
          getData: function($defer, params) {
            var opt = {where:{}, include:['sku']}
            opt.limit = params.count()
            opt.skip = (params.page()-1)*opt.limit
            if(vm.filter.text != '') {
              opt.skip = 0;
            }
            Stock.count({where: opt.where}, function (result) {
              vm.tableParams.total(result.count)
              Stock.find({filter:opt}, $defer.resolve)
            })
          }
        });
      }
    }

})();