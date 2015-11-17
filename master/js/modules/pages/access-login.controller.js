/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('LoginFormController', LoginFormController);

    LoginFormController.$inject = ['$state', 'User', '$rootScope'];
    function LoginFormController($state, User, $rootScope) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
          // bind here all data from the form
          vm.account = {
            realm: 'merchant',
            remember: true
          };
          // place the message if something goes wrong
          vm.authMsg = '';

          vm.login = function() {
            vm.authMsg = '';

            if(vm.loginForm.$valid) {
              
              User
                .login(vm.account, function (accessToken) {
                  $rootScope.user = accessToken.user;
                  $state.go('app.dashboard');
                }, function (error) {
                  vm.authMsg = error.data.error.message;
                });

            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.loginForm.account_username.$dirty = true;
              vm.loginForm.account_password.$dirty = true;
            }
          };
        }
    }
})();
