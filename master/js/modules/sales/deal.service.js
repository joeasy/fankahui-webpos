(function() {
    'use strict';

    angular
        .module('app.sales')
        .service('dealService', dealService);

    dealService.$inject = ['Deal', 'Sku', 'ngDialog'];
    function dealService(Deal, Sku, ngDialog) {
      var self = this;

      this.openDeal = openDeal;
      this.querySkus = querySkus;
      this.register = register;
      this.substractOne = substractOne;
      this.countTotal = countTotal;
      this.checkout = checkout; 
      this.pay = pay;
      this.payType = {
        deposit: "会员储值",
        cash: "现金支付",
        bankcard: "刷卡支付",
        wxpay: "微信支付",
        alipay: "支付宝"
      }

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
        if(self.deal.member) self.deal.memberId = self.deal.member.id;
        self.deal.fee = self.deal.totalAmount;
        self.deal.payment = {
          amount: self.deal.fee,
          type: !!self.deal.member? 'deposit':'cash'
        }
        ngDialog.open({ 
          template: 'checkoutDialogId', 
          controller: 'checkoutDialogController'
        });
      }
      
      function pay() {
        self.deal.status = 'closed';
        delete self.deal.member;
        return Deal.create(self.deal).$promise
      }
    }
})();
