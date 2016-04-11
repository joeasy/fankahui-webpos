(function () {
  'use strict';

  angular
      .module('app.settings')
      .controller('SettingController', SettingController)
  
  SettingController.$inject = ['$scope', '$rootScope', 'Merchant', 'Shop', 'Member', 'toaster'];
  function SettingController($scope, $rootScope, Merchant, Shop, Member, toaster) {
    var vm = this;

    activete();

    function activete() {

    }

    vm.update = function (isShop) {
      var model = Merchant;
      var data = $scope.user.merchant;
      if(isShop) {
        data = $scope.user.shop;
        model = Shop;
      }
      model.update({where: {id: data.id}}, data, function success(result, res) {
        toaster.pop('success', '成功', "设置已经保存");
      }, function error(res) {
        toaster.pop('error', '失败', "设置未成功，请重试！")
      });
    }
    
    vm.addMemberLevel = function () {
      var levels = $scope.user.merchant.memberLevels || [];
      var last = levels.length > 0 && levels[levels.length-1] || {upper: -1};
      levels.push({lower: last.upper+1, upper: last.upper+1000, discount:100, name: 'VIP'});
      if(!$scope.user.merchant.memberLevels) $scope.user.merchant.memberLevels = levels;
    }
    
    vm.updaeteMemberLevels = function () {
      $scope.user.merchant.memberLevels.forEach(function (level) {
        Member.update({
          where: {merchantId:$scope.user.merchant.id, bonus: {gte: level.lower, lte: level.upper}}
        }, {
          discount: level.discount, level: level.name
        }, function sucess(result, res) {
          toaster.pop('success', '成功', "更新全体会员等级完成");
        }, function error(res) {
          toaster.pop('error', '失败', "更新全体会员等级未成功，请重试！")
        });
      });
    }
  }
})();