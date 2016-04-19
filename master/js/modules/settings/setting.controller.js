(function () {
  'use strict';

  angular
      .module('app.settings')
      .controller('SettingController', SettingController)
  
  SettingController.$inject = ['$scope', '$rootScope', 'Merchant', 'Shop', 'Member', 'toaster'];
  function SettingController($scope, $rootScope, Merchant, Shop, Member, toaster) {
    var vm = this;
    vm.industry = {
      "IT科技": {
        "互联网/电子商务": "1",
        "IT软件与服务": "2",
        "IT硬件与设备": "3",
        "电子技术": "4",
        "通信与运营商": "5",
        "网络游戏": "6"
      },
      "金融业": {
        "银行": "7",
        "基金|理财|信托": "8",
        "保险": "9"
      },
      "餐饮": {
        "餐饮": "10"
      },
      "酒店旅游": {
        "酒店": "11",
        "旅游": "12"
      },
      "运输与仓储": {
        "快递": "13",
        "物流": "14",
        "仓储": "15"
      },
      "教育": {
        "培训": "16",
        "院校": "17"
      },
      "政府与公共事业": {
        "学术科研": "18",
        "交警": "19",
        "博物馆": "20",
        "公共事业|非盈利机构": "21"
      },
      "医药护理": {
        "医药医疗": "22",
        "护理美容": "23",
        "保健与卫生": "24"
      },
      "交通工具": {
        "汽车相关": "25",
        "摩托车相关": "26",
        "火车相关": "27",
        "飞机相关": "28"
      },
      "房地产": {
        "建筑": "29",
        "物业": "30"
      },
      "消费品": {
        "消费品": "31"
      },
      "商业服务": {
        "法律": "32",
        "会展": "33",
        "中介服务": "34",
        "认证": "35",
        "审计": "36"
      },
      "文体娱乐": {
        "传媒": "37",
        "体育": "38",
        "娱乐休闲": "39"
      },
      "印刷": {
        "印刷": "40"
      },
      "其它": {
        "其它": "41"
      }
    };

    activete();

    function activete() {
      vm.wxgh = Merchant.prototype$__get__wxgh({id: $scope.user.merchantId, refresh: true});
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
          where: {merchantId:$scope.user.merchant.id, totalBonus: {gte: level.lower, lte: level.upper}}
        }, {
          discount: level.discount, level: level.name
        }, function sucess(result, res) {
          toaster.pop('success', '成功', "更新全体会员等级完成");
        }, function error(res) {
          toaster.pop('error', '失败', "更新全体会员等级未成功，请重试！")
        });
      });
    }
            
    vm.updateWxgh = function () {
      vm.update();
      Merchant.updateWxgh({
        id: vm.wxgh.id,
        appid: vm.wxgh.appid,
        appsecret: vm.wxgh.appsecret,
        industry: $scope.user.merchant.industry
      }, function (result) {
        toaster.pop('success', '成功', "微信公众号设置已经保存");
      }, function (reason) {
        toaster.pop('error', '失败', "设置未成功，请重试！")
      });
    } 
  }
})();