(function() {
    'use strict';

    angular
      .module('app.items', [])
      .controller('ItemsController', ItemsController)
      .controller('StockDialogController', StockDialogController)
      .controller('StocksController', StocksController)
      .controller('ItemAddController', ItemAddController);
        
    ItemsController.$inject = ['$scope', 'ngTableParams', 'Sku', 'ngDialog', 'toaster'];
    function ItemsController($scope, ngTableParams, Sku, ngDialog, toaster) {
      var vm = this;
      
      activate();
      
      function activate() {
        vm.filter = {text: ''}
        vm.tableParams = new ngTableParams({
          count: 10,
          filter: vm.filter.text
        }, {
          getData: function($defer, params) {
            var opt = {where:{}, include:['shopstocks']}
            opt.limit = params.count()
            opt.skip = (params.page()-1)*opt.limit
            if(vm.filter.text != '') {
              var qs = {regex: vm.filter.text};
              opt.where.or = [{nickname:qs}, {remark:qs}];
              opt.skip = 0;
            }
            Sku.count({where: opt.where}, function (result) {
              vm.tableParams.total(result.count)
              Sku.find({filter:opt}, $defer.resolve)
            })
          }
        });
      }
            
      vm.stock = function (sku) {
        ngDialog.open({ 
          template: 'stockDialogId', 
          controller: 'StockDialogController', 
          data: {sku: sku} 
        });
        // $scope.tableParams.reload();
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
    
    StockDialogController.$inject = ['$scope', 'ngDialog', 'Stock', 'toaster'];
    function StockDialogController($scope, ngDialog, Stock, toaster) {

        activate();

        ////////////////

        function activate() {
          $scope.stockQty = 0;
        }
        
        $scope.confirm = function () {
          var sku = $scope.ngDialogData.sku
          Stock.create({skuId: sku.id, qty: $scope.stockQty, type: 'stock'});
          sku.shopstocks[0].qty += $scope.stockQty;
          ngDialog.close();
          toaster.pop('success', '进货成功', '成功入库'+sku.item.name+":"+$scope.stockQty+"件");
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
              // var qs = {regex: vm.filter.text};
              // opt.where.or = [{nickname:qs}, {remark:qs}];
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