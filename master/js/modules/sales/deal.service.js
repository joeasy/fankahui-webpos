(function() {
    'use strict';

    angular
        .module('app.sales')
        .service('dealService', dealService);

    dealService.$inject = ['Deal', 'Sku', 'ngDialog', '$rootScope'];
    function dealService(Deal, Sku, ngDialog, $rootScope) {
      var self = this;

      this.openDeal = openDeal;
      this.querySkus = querySkus;
      this.register = register;
      this.substractOne = substractOne;
      this.countTotal = countTotal;
      this.checkout = checkout; 
      this.onChangePayType = onChangePayType;
      this.countChange = countChange;
      this.pay = pay;
      this.payType = {
        deposit: "会员储值",
        cash: "现金支付",
        bankcard: "刷卡支付",
        wxpay: "微信支付",
        alipay: "支付宝"
      };

      function openDeal(member) {
        self.deal = {
          entities: [],
          totalAmount: 0,
          totalQty: 0,
          member: member,
          status: 'opened',
          created: new Date()
        }
        self.selectedSku = undefined;
      }
      
      function querySkus (val) {
        return Sku.find({filter:{where:{barcode:{regex: val}}}, limit: 10})
        .$promise.then(function (skus) {
          return skus;
        });
      }
            
      function register () {
        if(self.selectedSku && self.selectedSku instanceof Sku) {
          var entity = undefined;
          angular.forEach(self.deal.entities, function (e) {
            if(e.sku.barcode === self.selectedSku.barcode){
              e.qty++;
              entity = e;
            }
          });
          if(!entity) {
            entity = {
              sku: self.selectedSku,
              qty: 1
            };
            self.deal.entities.push(entity);
          }
        }
        self.selectedSku = undefined;
      }
      
      function substractOne (entity, index) {
        entity.qty--;
        if(entity.qty === 0) {
          self.deal.entities.splice(index, 1);
        }
      }
            
      function countTotal () {
        self.deal.totalAmount = 0;
        self.deal.totalQty = 0;
        angular.forEach(self.deal.entities, function (entity) {
          self.deal.totalQty += entity.qty;
          self.deal.totalAmount += entity.qty*entity.sku.price;
        });
        return self.deal.totalAmount;
      }
      
      function checkout () {
        self.deal.payment = {type: 'cash'};
        if(self.deal.member) {
          self.deal.memberId = self.deal.member.id;
          self.deal.discountAmount = self.deal.totalAmount*(100-self.deal.member.discount)/100;
          if($rootScope.user.merchant.enableBonusBid) {
            self.deal.bonusVouchAmount = Math.round(self.deal.member.bonus/$rootScope.user.merchant.bonusBidRate);
          }
        } else {
          self.deal.discountAmount = 0;
        }
        self.deal.fee = self.deal.totalAmount-self.deal.discountAmount;
        if(self.deal.member) {
          if($rootScope.user.merchant.enableBonusBid) {
            if(self.deal.bonusVouchAmount > self.deal.fee) {
              self.deal.bonusVouchAmount = self.deal.fee;
            }
            self.deal.fee -= self.deal.bonusVouchAmount;
          }
          if(self.deal.member.balance >= self.deal.fee) {
            self.deal.payment.type = 'deposit';
          }
        } 
        
        onChangePayType();
        
        ngDialog.open({ 
          template: 'checkoutDialogId', 
          controller: 'checkoutDialogController'
        });
      }
      
      function onChangePayType() {
        self.deal.payment.amount = self.deal.fee;
        if(self.deal.payment.type === 'cash') {
          self.deal.payment.cost = 0-self.deal.fee%$rootScope.user.merchant.changeRate;
          self.deal.payment.amount += self.deal.payment.cost;
          countChange();
        } else if(self.deal.payment.type === 'deposit') {
          self.deal.payment.cost = 0;
          self.deal.payment.amount = 0-self.deal.fee;
        } else {
          self.deal.payment.cost = 0;
          self.deal.payment.amount = self.deal.fee;
        }
      }
      
      function countChange() {
        if(self.deal.payment.type === 'cash') {
          self.deal.payment.paid = self.deal.payment.paid || self.deal.payment.amount;
          self.deal.payment.change = self.deal.payment.amount - self.deal.payment.paid;
        }
      }
            
      function pay() {
        self.deal.status = 'closed';
        delete self.deal.member;
        return Deal.create(self.deal).$promise
      }
    }
})();
