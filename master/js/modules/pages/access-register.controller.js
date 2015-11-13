/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('RegisterFormController', RegisterFormController);

    RegisterFormController.$inject = ['$rootScope', '$state', 'User'];
    function RegisterFormController($rootScope, $state, User) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
          // bind here all data from the form
          vm.account = {
            realm: 'merchant'
          };
          vm.agreed = true;
          // place the message if something goes wrong
          vm.authMsg = '';
            
          vm.register = function() {
            vm.authMsg = '';

            if(vm.registerForm.$valid) {
              
              vm.account.email = vm.account.username+"@fankahui.com";
              vm.account.phone = vm.account.username;
              
              User
                .create(vm.account, function (account) {
                  User
                    .login({username: vm.account.username, password: vm.account.password})
                    .$promise.then(function (accessToken) {
                      $rootScope.user = accessToken.user;
                      $state.go('app.dashboard');
                    });
                }, function (error) {
                  vm.authMsg = error.data.error.message;
                });

            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.registerForm.account_username.$dirty = true;
              vm.registerForm.account_password.$dirty = true;
              vm.registerForm.account_agreed.$dirty = true;
              
            }
          };
        }
    }
})();
