(function() {
    'use strict';

    angular
      .module('app.members')
      .controller('MembersController', MembersController)
    ;
      
    MembersController.$inject = ['$scope', 'Member', 'ngTableParams', 'ngTableLBService', 'SweetAlert', 'qrcodeService', 'dealService'];
    function MembersController($scope, Member, ngTableParams, ngTableLBService, SweetAlert, qrcodeService, dealService) {
      var vm = this;
      
      activate();
      
      function activate() {
        $scope.qrcodeService = qrcodeService;
        vm.keyword = "";
        vm.tableParams = new ngTableParams({count: 10}, {
          getData: function($defer, params) {
            var filter = {where:{status:{ne:'deleted'}}, include:['wxuser']}
            if(vm.keyword != '') {
              var qs = {regex: keyword};
              filter.where.or = [{"entities.sku.item.name":qs}];
              params.page(1);
            }
            ngTableLBService.getData($defer, params, Member, filter);
          }
        });
      }
      
      vm.sell = function (member) {
        dealService.openDeal(member);
        $scope.$state.go('app.sell');
      }
    }
})();