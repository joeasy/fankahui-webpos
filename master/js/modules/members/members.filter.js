/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.members')
        .filter('wx_sex', wxsexFilter)
        .filter('wx_subscribe', wxsubscribeFilter)
        .filter('deposit_category', depositcategoryFilter)
        .filter('bonus_memo', bonusMemoFilter)
    ;

    function wxsexFilter() {
        var type = ['保密', '男', '女'];
        return function(key) {
          return type[key];
        }
    }
    
    function wxsubscribeFilter() {
      var state = ['未关注', '已关注'];
      return function (key) {
        return state[key];
      }
    }
    
    function depositcategoryFilter() {
      return function (deposit) {
        if(deposit.type === 'deposit') {
          return deposit.amount < 0 ? '储值消费':'储值退款';
        } else if(deposit.category === 'deposit') {
          return deposit.amount < 0 ? '提现':'充值';
        } else {
          return '未知';
        }
      }
    }

    function bonusMemoFilter() {
      var memo = {
        reward: '消费积分',
        vouch: '消费抵扣',
        manual: '手动积分',
        writeoff: '手动减计',
        exchange: '兑换'
      }
      return function (key) {
        return memo[key];
      }
    }
})();