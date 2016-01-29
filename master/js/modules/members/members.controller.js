(function() {
    'use strict';

    angular
      .module('app.members')
      .controller('MembersController', MembersController)
    ;
      
    MembersController.$inject = ['$scope', 'Member', 'ngTableParams', 'ngTableLBService', 'SweetAlert', 'qrcodeService'];
    function MembersController($scope, Member, ngTableParams, ngTableLBService, SweetAlert, qrcodeService) {
      var vm = this;
      
      activate();
      
      function activate() {
        $scope.qrcodeService = qrcodeService;
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