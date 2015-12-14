(function() {
    'use strict';

    angular
      .module('app.myshop', [])
      .controller('MyShopController', MyShopController)
      .controller('ShopsController', ShopsController)
      .controller('ShopAddController', ShopAddController);
        
    MyShopController.$inject = ['$scope', 'editableOptions', 'editableThemes', 'Shop', 'Merchant'];
    function MyShopController($scope, editableOptions, editableThemes, Shop, Merchant) {
      var vm = this;

      AMap.service('AMap.DistrictSearch', function () {
        var districtSearch = new AMap.DistrictSearch({
          level : 'country',
          subdistrict : 3    
        });
    
        districtSearch.search('中国', function (status, result) {
          vm.provinces = result.districtList[0].districtList;
          // $scope.$apply();
        });
      });
      
      activate();
      
      function activate() {
        
        editableOptions.theme = 'bs3';
        
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-success"><span class="fa fa-check"></span></button>';
        editableThemes.bs3.cancelTpl = '<button type="button" class="btn btn-default" ng-click="$form.$cancel()">'+
                                         '<span class="fa fa-times text-muted"></span>'+
                                       '</button>';
        
        vm.shop = $scope.user.shop;
        vm.merchant = $scope.user.merchant;
      }
      
      vm.update = function (obj, key, data) {
        vm[obj][key] = data.name;
      }
      
      vm.saveShop = function () {
        Shop.upsert(vm.shop);
      }
      
      vm.saveMerchant = function () {
        Merchant.upsert(vm.merchant);
      }
    }
    
    ShopsController.$inject = ['$scope', 'ngTable', 'moment', 'Shop'];
    function ShopsController($scope, ngTable, moment, Shop) {
      var vm = this;
      
      activate();
      
      function activate() {
        
      }
      
      $scope.filter = {text: ''}
      $scope.tableParams = new ngTableParams({
        count: 10,
        filter: $scope.filter.text
      }, {
        getData: function($defer, params) {
          var opt = {order: 'subscribe_time DESC'}
          opt.limit = params.count()
          opt.skip = (params.page()-1)*opt.limit
          opt.where = {}
          if($scope.filter.text != '') {
            console.log($scope.filter.text);
            // var qs = {like: '%'+$scope.filter.text+'%'};
            var qs = {regex: $scope.filter.text};
            opt.where.or = [{nickname:qs}, {remark:qs}];
            opt.skip = 0;
          }
          Sku.count({where: opt.where}, function (result) {
            $scope.tableParams.total(result.count)
            Sku.find({filter:opt}, $defer.resolve)
          })
        }
      })   
    }
    
    ShopAddController.$inject = ['$scope', 'Shop'];
    function ShopAddController($scope, Shop) {
      activate();
      
      window.ParsleyValidator.setLocale('zh_cn');
      
      function activate() {
        $scope.entity = {
          type: "entity",
          name: "iPhone6S Plus",
          skus: [{barcode:"123", price: 5288, model: "16G"}]
        };
      }
      
      $scope.save = function () {
        
      }
      
      $scope.saveAndMore = function () {
      }
    }    
})();