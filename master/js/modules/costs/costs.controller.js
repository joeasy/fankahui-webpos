(function() {
    'use strict';

    angular
      .module('app.costs')
      .controller('CostsController', CostsController)
      .controller('CostCategoriesController', CostCategoriesController)
      .controller('costDialogController', costDialogController)
    ;
      
    CostsController.$inject = ['$scope', 'Cost', 'ngTableParams', 'ngTableLBService', 'SweetAlert', 'ngDialog'];
    function CostsController($scope, Cost, ngTableParams, ngTableLBService, SweetAlert, ngDialog) {
      var vm = this;

      activate();

      vm.dt = {
        options: { 
          formatYear: 'yy',
          maxDate: new Date(),
          minDate: new Date(2016,1,1),
          startingDay: 1
        },
        begin: {
          dt: new Date(moment().startOf('month')),
          open: false
        },
        end: {
          dt: new Date(),
          open: false
        }
      }
      
      function activate() {
        vm.tableParams = new ngTableParams({count: 10}, {
          getData: function($defer, params) {
            var filter = {where:{
              status:{ne:'deleted'},
              modified: {between: [
                moment(vm.dt.begin.dt).startOf('day'), 
                moment(vm.dt.end.dt).endOf('day')
              ]}
            }}
            ngTableLBService.getData($defer, params, Cost, filter);
          }
        });

      }

      vm.create = function () {
        ngDialog.open({ 
          template: 'costDialogId', 
          controller: 'costDialogController'
        }).closePromise.then(function (data) {
          vm.tableParams.reload();
        });
      }
      
      vm.edit = function (entity) {
        $scope.data = entity;
        ngDialog.open({ 
          template: 'costDialogId', 
          controller: 'costDialogController',
          scope: $scope
        }).closePromise.then(function (data) {
          vm.tableParams.reload();
        });
      }
      
      vm.delete = function (entity) {
        SweetAlert.swal({   
          title: '确认删除？',   
          text: '删除以后将恢复！',   
          type: 'warning',   
          showCancelButton: true,   
          confirmButtonColor: '#DD6B55',   
          confirmButtonText: '是的，删除！',
          cancelButtonText: '不，先不删!',
          // closeOnConfirm: false
        }, function (isConfirm) {
          if(isConfirm) {
            Cost.deleteById({id: entity.id});
            vm.tableParams.reload();
          }
        });
      }
    }
    
    CostCategoriesController.$inject = ['$scope', 'Costcategory', 'SweetAlert'];
    function CostCategoriesController($scope, Costcategory, SweetAlert) {
      var vm = this;

      activate();

      function activate() {

        vm.categories = Costcategory.find({filter: {
          order: "name DESC",
          where: {status:{ne:'deleted'}}
        }});

      }
      
      vm.reload = activate();
      
      function deleteAlert(callback) {
        SweetAlert.swal({   
          title: '确认删除？',   
          text: '删除以后将无法使用分类了！',   
          type: 'warning',   
          showCancelButton: true,   
          confirmButtonColor: '#DD6B55',   
          confirmButtonText: '是的，删除！',
          cancelButtonText: '不，先不删!',
          // closeOnConfirm: false
        }, callback);
      }
      
      vm.addCategory = function (category) {
        if(category && category != '') {
          Costcategory.create({name: category}).$promise.then(activate);
        }
      }
      
      vm.updateCategory = function (category) {
        Costcategory.prototype$updateAttributes({id: category.id}, {
          status: category.status,
          name: category.name,
          subs: category.subs
        }).$promise.then(activate);
      }
      
      vm.deleteCategory = function (category) {
        deleteAlert(function (isConfirm) {
          if(isConfirm) {
            category.status = 'deleted';
            vm.updateCategory(category);
          }
        })
      }
      
      vm.addSubCategory = function (category, subcategory) {
        if(subcategory && subcategory != '' && category.subs.indexOf(subcategory) === -1) {
          category.subs.push(subcategory);
          vm.updateCategory(category);
        }
      }
      
      vm.deleteSubcategory = function (category, index) {
        // var index = category.subs.indexOf(subcategory);
        deleteAlert(function (isConfirm) {
          if(isConfirm) {
            category.subs.splice(index, 1);
            vm.updateCategory(category);
          }
        });
      }
    }

    costDialogController.$inject = ['$scope', 'ngDialog', 'Cost', 'SweetAlert', 'Costcategory', 'toaster'];
    function costDialogController($scope, ngDialog, Cost, SweetAlert, Costcategory, toaster) {

        activate();

        ////////////////

        function activate() {
          $scope.categories = Costcategory.find({filter: {
            order: "name DESC",
            where: {status:{ne:'deleted'}}
          }});
          $scope.data = $scope.data || {
            category: '请选择',
            subcategory: '分类',
            amount: 0
          };
        }

        $scope.setCategory = function (c, s) {
          $scope.data.category = c;
          $scope.data.subcategory = s;
          $scope.isCollapsed = true;
        }
        
        $scope.confirm = function () {
          if($scope.data.amount === 0) {
            return;
          }
          delete $scope.data.merchantId;
          delete $scope.data.shopId;
          delete $scope.data.created;
          delete $scope.data.operator;
          Cost.upsert($scope.data).$promise.then(function (result) {
            $scope.submiting = false;
            ngDialog.close();
            toaster.pop('success', '成功', "完成支出登记");
          }, function (err) {
            $scope.submiting = false;
            toaster.pop('error', '失败', "支出登记未完成，请重试！")
          });
          $scope.submiting = true;
        }

    }
})();