/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper){

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/app/dashboard');

        //
        // Application Routes
        // -----------------------------------
        $stateProvider
          .state('app', {
              url: '/app',
              abstract: true,
              templateUrl: helper.basepath('app.html'),
              resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'moment')
          })
          .state('app.dashboard', {
              url: '/dashboard',
              title: 'Dashboard',
              templateUrl: helper.basepath('dashboard.html'),
              controller: 'DashboardController as dash',
              resolve: helper.resolveFor('flot-chart','flot-chart-plugins', 'ngDialog')
          })
          .state('app.sell', {
              url: '/sell',
              title: 'sell',
              templateUrl: helper.basepath('sell.html'),
              controller: 'SellController as sell',
              resolve: helper.resolveFor('ngTable', 'ngDialog', 'oitozero.ngSweetAlert', 'loaders.css', 'spinkit')
          })
          .state('app.members', {
              url: '/members',
              title: 'Members',
              templateUrl: helper.basepath('members.html'),
              controller: 'MembersController as members',
              resolve: helper.resolveFor('ngTable', 'ngTableExport', 'ngDialog', 'oitozero.ngSweetAlert', 'spinkit')
          })
          .state('app.member', {
              url: '/members/:memberId',
              title: 'Member Detail',
              templateUrl: helper.basepath('member.html'),
              controller: 'MemberController as member',
              resolve: helper.resolveFor('ngTable', 'ngDialog', 'oitozero.ngSweetAlert', 'spinkit')
          })
          .state('app.deals', {
              url: '/deals',
              title: 'Deals',
              templateUrl: helper.basepath('deals.html'),
              resolve: helper.resolveFor('ngTable', 'ngDialog', 'oitozero.ngSweetAlert', 'spinkit')
          })
          .state('app.deal', {
              url: '/deals/:dealId',
              title: 'Deal',
              templateUrl: helper.basepath('deal.html'),
              controller: 'DealController as dc',
              resolve: helper.resolveFor('ngTable', 'ngDialog', 'oitozero.ngSweetAlert', 'spinkit')
          })
          .state('app.cost', {
              url: '/cost',
              title: 'Cost',
              templateUrl: helper.basepath('cost.html'),
              resolve: helper.resolveFor('ngTable', 'ngTableExport', 'ngDialog', 'oitozero.ngSweetAlert', 'spinkit')
          })
          .state('app.item', {
              url: '/item',
              title: 'Item',
              templateUrl: helper.basepath('item.html'),
              resolve: helper.resolveFor('ngTable', 'ngTableExport', 'ngDialog', 'oitozero.ngSweetAlert', 'spinkit')
          })
          .state('app.item-add', {
              url: '/item-add',
              title: 'Item Add',
              templateUrl: helper.basepath('item-add.html'),
              resolve: helper.resolveFor('parsley')
          })
          .state('app.card', {
              url: '/card',
              title: 'Card',
              templateUrl: helper.basepath('card.html'),
              resolve: helper.resolveFor('ngTable', 'ngTableExport', 'ngDialog', 'oitozero.ngSweetAlert', 'spinkit')
          })
          .state('app.campaign', {
              url: '/campaign',
              title: 'Campaign',
              templateUrl: helper.basepath('campaign.html'),
              resolve: helper.resolveFor('ngTable', 'ngTableExport', 'ngDialog', 'oitozero.ngSweetAlert', 'spinkit')
          })
          .state('app.myshop', {
              url: '/myshop',
              title: 'MyShop',
              templateUrl: helper.basepath('myshop.html'),
              resolve: helper.resolveFor('xeditable')
          })
          .state('app.setting', {
              url: '/setting',
              title: 'Setting',
              templateUrl: helper.basepath('setting.html'),
              resolve: helper.resolveFor('ngTable', 'ngTableExport', 'ngDialog', 'oitozero.ngSweetAlert', 'spinkit')
          })
          //
          // Single Page Routes
          // -----------------------------------
          .state('page', {
              url: '/page',
              templateUrl: 'app/pages/page.html',
              resolve: helper.resolveFor('modernizr', 'icons'),
              controller: ['$rootScope', function($rootScope) {
                  $rootScope.app.layout.isBoxed = false;
              }]
          })
          .state('page.login', {
              url: '/login',
              title: 'Login',
              templateUrl: 'app/pages/login.html'
          })
          .state('page.register', {
              url: '/register',
              title: 'Register',
              templateUrl: 'app/pages/register.html'
          })
          .state('page.recover', {
              url: '/recover',
              title: 'Recover',
              templateUrl: 'app/pages/recover.html'
          })
          .state('page.404', {
              url: '/404',
              title: 'Not Found',
              templateUrl: 'app/pages/404.html'
          })
          //
          // CUSTOM RESOLVES
          //   Add your own resolves properties
          //   following this object extend
          //   method
          // -----------------------------------
          // .state('app.someroute', {
          //   url: '/some_url',
          //   templateUrl: 'path_to_template.html',
          //   controller: 'someController',
          //   resolve: angular.extend(
          //     helper.resolveFor(), {
          //     // YOUR RESOLVES GO HERE
          //     }
          //   )
          // })
          ;

    } // routesConfig

})();

