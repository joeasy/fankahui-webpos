(function () {
  'use strict';

  angular
      .module('app.settings')
      .controller('SettingController', SettingController)

  SettingController.$inject = ['$scope', 'Merchant', 'Setting', 'toaster'];
  function SettingController($scope, Merchant, Setting, toaster) {
    var vm = angular.extend(this, Setting);

    activete();

    function activete() {
      vm.wxgh = vm.getWxgh();
    }

    Setting.success = function (value) {
      toaster.pop('success', '成功', "设置已经保存");
    }

    Setting.error = function (reason) {
      toaster.pop('error', '失败', "设置未成功，请重试！");
    }
  }
})();
