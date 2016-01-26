(function() {
    'use strict';

    angular
      .module('app.sales')
      .controller('MembersController', MembersController)
    ;
      
    MembersController.$inject = ['$scope', 'Member', 'ngTableParams', 'ngTableLBService'];
    function MembersController($scope, Member, ngTableParams, ngTableLBService) {
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
            ngTableLBService.getData($defer, params, Member, filter);
          }
        });
      }
    }
})();