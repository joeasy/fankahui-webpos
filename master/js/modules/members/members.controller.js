(function() {
    'use strict';

    angular
      .module('app.members')
      .controller('MembersController', MembersController)
      .controller('MemberController', MemberController)
      .controller('rechargeDialogController', rechargeDialogController)
      .controller('bonusDialogController', bonusDialogController)
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
    
    MemberController.$inject = ['$scope', 'Member', 'ngTableParams', 'ngTableLBService', 'SweetAlert', 'dealService', 'ngDialog'];
    function MemberController($scope, Member, ngTableParams, ngTableLBService, SweetAlert, dealService, ngDialog) {
      var vm = this;
      var memberId = $scope.$state.params.memberId;
            
      vm.dealTableParams = new ngTableParams({
        count: 10
      }, {
        getData: function($defer, params) {
          var opt = {where:{status:{ne:'deleted'}}}
          opt.limit = params.count()
          opt.skip = (params.page()-1)*opt.limit
          Member.deals.count({id: memberId, where: opt.where}, function (result) {
            vm.dealTableParams.total(result.count);
          });
          Member.deals({id: memberId, filter:opt}, $defer.resolve);
        }
      });     
      
      vm.depositTableParams = new ngTableParams({
        count: 10
      }, {
        getData: function($defer, params) {
          var opt = {
            where:{status:{ne:'deleted'}, or:[{type: 'deposit'}, {category: 'deposit'}]},
            include: ['shop']
          }
          opt.limit = params.count()
          opt.skip = (params.page()-1)*opt.limit
          Member.payments.count({id: memberId, where: opt.where}, function (result) {
            vm.depositTableParams.total(result.count);
          });
          Member.payments({id: memberId, filter:opt}, $defer.resolve);
        }
      });

      vm.bonusTableParams = new ngTableParams({
        count: 10
      }, {
        getData: function($defer, params) {
          var opt = {
            where:{status:{ne:'deleted'}},
            include: []
          }
          opt.limit = params.count()
          opt.skip = (params.page()-1)*opt.limit
          Member.bonuses.count({id: memberId, where: opt.where}, function (result) {
            vm.bonusTableParams.total(result.count);
          });
          Member.bonuses({id: memberId, filter:opt}, $defer.resolve);
        }
      });

      activate();
      
      function activate() {
        
        memberId = $scope.$state.params.memberId;

        vm.member = Member.findOne({filter: {
          where: {id: memberId}, 
          include:['wxuser']
        }});
        
        vm.dealTableParams.reload();
        vm.depositTableParams.reload();
        vm.bonusTableParams.reload();
      }

      vm.sell = function () {
        dealService.openDeal(vm.member);
        $scope.$state.go('app.sell');
      }
      
      vm.recharge = function () {
        ngDialog.open({ 
          template: 'rechargeDialogId', 
          controller: 'rechargeDialogController'
        }).closePromise.then(function (data) {
          activate();
        });
      }
      
      vm.setBonus = function () {
        ngDialog.open({ 
          template: 'bonusDialogId', 
          controller: 'bonusDialogController'
        }).closePromise.then(function (data) {
          activate();
        });
      }
    }
    
    rechargeDialogController.$inject = ['$scope', 'ngDialog', 'Member', 'toaster', 'dealService'];
    function rechargeDialogController($scope, ngDialog, Member, toaster, dealService) {

        activate();

        ////////////////

        var memberId = $scope.$state.params.memberId;
        function activate() {
          memberId = $scope.$state.params.memberId;
          $scope.member = Member.findById({id:memberId});
          $scope.data = {
            type: 'cash', 
            amount: 0,
            category: 'deposit'
          };
          $scope.payType = dealService.payType;
          $scope.cash = {
            paid: 0,
            change: 0,
          }
        }
        
        $scope.onChangePayType = function () {
          if(data.type === 'cash') {
            $scope.data.cost = $scope.data.amount%$scope.user.merchant.changeRate;
            $scope.data.amount -= $scope.data.cost;
            $scope.countChange();
          } else {
            $scope.data.cost = 0;
          }
        }
        
        $scope.countChange = function () {
          $scope.cash.paid =  $scope.cash.paid;
          $scope.cash.change = $scope.data.amount - $scope.cash.paid;
        }
        
        $scope.confirm = function () {
          if($scope.data.amount === 0) {
            return;
          }
          Member.payments.create({id: memberId}, $scope.data).$promise.then(function (result) {
            $scope.submiting = false;
            ngDialog.close();
            toaster.pop('success', '成功', "完成储值操作");
          }, function (err) {
            $scope.submiting = false;
            toaster.pop('error', '失败', "储值操作未完成，请重试！")
          });
          $scope.submiting = true;
        }
        
    }
    
    bonusDialogController.$inject = ['$scope', 'ngDialog', 'Member', 'toaster'];
    function bonusDialogController($scope, ngDialog, Member, toaster) {

        activate();

        ////////////////

        var memberId = $scope.$state.params.memberId;
        function activate() {
          memberId = $scope.$state.params.memberId;
          $scope.member = Member.findById({id:memberId});
          $scope.data = {
            amount: 0,
            memo: 'manual'
          };
        }
        
        $scope.confirm = function () {
          if($scope.data.amount === 0) {
            return;
          } else if($scope.data.amount > 0) {
            $scope.data.memo = 'manual';
          } else if($scope.data.amount < 0) {
            $scope.data.memo = 'writeoff';
          }
          Member.bonuses.create({id: memberId}, $scope.data).$promise.then(function (result) {
            $scope.submiting = false;
            ngDialog.close();
            toaster.pop('success', '成功', "完成储值操作");
          }, function (err) {
            $scope.submiting = false;
            toaster.pop('error', '失败', "储值操作未完成，请重试！")
          });
          $scope.submiting = true;
        }
    }
})();