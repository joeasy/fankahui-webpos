(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', 'ChartData', '$timeout', 'Checkin', 'Deal', 'Payment', 'dealService'];
    function DashboardController($scope, ChartData, $timeout, Checkin, Deal, Payment, dealService) {
        var vm = this;

        // Set Moment locale
        moment.locale('zh-cn');

        activate();

        ////////////////

        function activate() {
          
          if(!$scope.user) return;

          // Statistic
          // ----------------------------------- 
          vm.statData = [
            {label: "销售收入", color: "#2f80e7", data: []},
            {label: "销售数量", color: "#564aa3", data: []},
            {label: "会员储值", color: "#2b957a", data: []}
          ];
          var days = 7;
          var now = moment();
          var from = moment().subtract(days, 'days').startOf('day');
          for (var i = 0; i < days; i++) {
            var d = moment().subtract(i, 'days').date();
            vm.statData[0].data.push([d, 0]);
            vm.statData[1].data.push([d, 0]);
            vm.statData[2].data.push([d, 0]);
          }
          var getDataByDate = function (res, dt) {
            var result = null;
            res.some(function (data) {
              if(data._id.year === dt.year() 
              && data._id.month === dt.month()+1 
              && data._id.dayOfMonth === dt.date()) {
                result = data;
                return true;
              } else {
                return false;
              }
            });
            return result;
          };
          Deal.stat({filter:{
            where:{
              status: 'closed', 
              "payment.amount": {$gt: 0},
              modified: {$gte: from, $lte: now}
            }
          }}, function (res) {
            for (var i = 0; i < days; i++) {
              var m = moment().subtract(i, 'days');
              var data = getDataByDate(res, m);
              if(!data) continue;
              var d = m.date();
              vm.statData[0].data[i] = [d, Math.round(data.amount/100)];
              vm.statData[1].data[i] = [d, data.qty];
            }
            vm.splineData[0] = vm.statData[0];
          });
          
          Payment.stat({filter:{
            where:{
              status: 'closed', 
              category: 'deposit',
              modified: {$gte: from, $lte: now}
            }
          }}, function (res) {
            for (var i = 0; i < days; i++) {
              var m = moment().subtract(i, 'days');
              var data = getDataByDate(res, m);
              if(!data) continue;
              var d = m.date();
              vm.statData[2].data[i] = [d, Math.round(data.amount/100)];
            }
            vm.splineData[1] = vm.statData[2];
          });
          
          // CHECKIN
          // ----------------------------------- 
          vm.checkins = Checkin.find({filter:{
            where: {merchantId: $scope.user.shopId},
            include: [{member: 'wxuser'}],
            limit: 10, 
            order: 'created DESC'
          }});
          
          vm.sell = function (member) {
            dealService.openDeal(member);
            $scope.$state.go('app.sell');
          }

          // SPLINE
          // ----------------------------------- 
          vm.splineData = ChartData.load('server/chart/spline.json');
          vm.splineOptions = {
              series: {
                  lines: {
                      show: false
                  },
                  points: {
                      show: true,
                      radius: 4
                  },
                  splines: {
                      show: true,
                      tension: 0.4,
                      lineWidth: 1,
                      fill: 0.5
                  }
              },
              grid: {
                  borderColor: '#eee',
                  borderWidth: 1,
                  hoverable: true,
                  backgroundColor: '#fcfcfc'
              },
              tooltip: true,
              tooltipOpts: {
                  content: function (label, x, y) { return x + ' : ' + y; }
              },
              xaxis: {
                  tickColor: '#fcfcfc',
                  mode: 'categories'
              },
              yaxis: {
                  // min: 0,
                  // max: 50000, // optional: use it for a clear represetation
                  tickColor: '#eee',
                  position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                  tickFormatter: function (v) {
                      return v;
                  }
              },
              shadowSize: 0
          };

        }
        
        $scope.$on('User.logined', activate);
        
    }
})();