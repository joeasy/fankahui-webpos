(function() {
    'use strict';

    angular
      .module('app.items', [])
      .controller('ItemsController', ItemsController)
      .controller('ItemAddController', ItemAddController);
        
    ItemsController.$inject = ['$scope', 'ngTable', 'moment', 'Sku'];
    function ItemsController($scope, ngTable, moment, Sku) {
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
    
    ItemAddController.$inject = ['$scope', 'Item'];
    function ItemAddController($scope, Item) {
      activate();
      
      window.ParsleyValidator.setLocale('zh_cn');
      function activate() {
        $scope.entity = {};
      }
    }    
})();