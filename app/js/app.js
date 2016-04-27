/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS
 * 
 * Version: 3.1.0
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 * 
 */

// APP START
// ----------------------------------- 

(function() {
    'use strict';

    angular
        .module('angle', [
            'app.core',
            'app.routes',
            'app.sidebar',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.dashboard',
            'app.notify',
            'app.elements',
            'app.panels',
            'app.charts',
            'app.forms',
            'app.locale',
            'app.pages',
            'app.tables',
            'app.utils',
            'app.items',
            'app.myshop',
            'app.sales',
            'app.members',
            'app.costs'
        ]);
})();


(function() {
    'use strict';

    angular
        .module('app.charts', []);
})();
(function() {
    'use strict';

    angular
        .module('app.colors', []);
})();
(function() {
    'use strict';

    angular
        .module('app.core', [
            'ngRoute',
            'ngAnimate',
            'ngStorage',
            'ngCookies',
            'pascalprecht.translate',
            'ui.bootstrap',
            'ui.router',
            'oc.lazyLoad',
            'cfp.loadingBar',
            'ngSanitize',
            'ngResource',
            'tmh.dynamicLocale',
            'ui.utils',
            'lbServices'
        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.costs', []);
})();
(function() {
    'use strict';

    angular
        .module('app.dashboard', []);
})();
(function() {
    'use strict';

    angular
        .module('app.elements', []);
})();
(function() {
    'use strict';

    angular
        .module('app.forms', []);
})();
(function() {
    'use strict';

    angular
        .module('app.items', []);
})();
(function() {
    'use strict';

    angular
        .module('app.lazyload', []);
})();
(function() {
    'use strict';

    angular
        .module('app.loadingbar', []);
})();
(function() {
    'use strict';

    angular
        .module('app.locale', []);
})();
(function() {
    'use strict';

    angular
        .module('app.members', []);
})();
(function() {
    'use strict';

    angular
        .module('app.myshop', []);
})();
(function() {
    'use strict';

    angular
        .module('app.notify', []);
})();
(function() {
    'use strict';

    angular
        .module('app.pages', []);
})();
(function() {
    'use strict';

    angular
        .module('app.panels', []);
})();
(function() {
    'use strict';

    angular
        .module('app.preloader', []);
})();


(function() {
    'use strict';

    angular
        .module('app.routes', [
            'app.lazyload'
        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.sales', []);
})();
(function() {
    'use strict';

    angular
        .module('app.settings', []);
})();
(function() {
    'use strict';

    angular
        .module('app.sidebar', []);
})();
(function() {
    'use strict';

    angular
        .module('app.tables', []);
})();
(function() {
    'use strict';

    angular
        .module('app.translate', []);
})();
(function() {
    'use strict';

    angular
        .module('app.utils', [
          'app.colors'
        ]);
})();

/**=========================================================
 * Module: chart.js
 * Wrapper directive for chartJS. 
 * Based on https://gist.github.com/AndreasHeiberg/9837868
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        /* Aliases for various chart types */
        .directive('linechart',     chartJS('Line')      )
        .directive('barchart',      chartJS('Bar')       )
        .directive('radarchart',    chartJS('Radar')     )
        .directive('polarchart',    chartJS('PolarArea') )
        .directive('piechart',      chartJS('Pie')       )
        .directive('doughnutchart', chartJS('Doughnut')  )
        .directive('donutchart',    chartJS('Doughnut')  )
        ;

    function chartJS(type) {
        return function() {
            return {
                restrict: 'A',
                scope: {
                    data: '=',
                    options: '=',
                    id: '@',
                    width: '=',
                    height: '=',
                    resize: '=',
                    chart: '@',
                    segments: '@',
                    responsive: '=',
                    tooltip: '=',
                    legend: '='
                },
                link: function ($scope, $elem) {
                    var ctx = $elem[0].getContext('2d');
                    var autosize = false;

                    $scope.size = function () {
                        if ($scope.width <= 0) {
                            $elem.width($elem.parent().width());
                            ctx.canvas.width = $elem.width();
                        } else {
                            ctx.canvas.width = $scope.width || ctx.canvas.width;
                            autosize = true;
                        }

                        if($scope.height <= 0){
                            $elem.height($elem.parent().height());
                            ctx.canvas.height = ctx.canvas.width / 2;
                        } else {
                            ctx.canvas.height = $scope.height || ctx.canvas.height;
                            autosize = true;
                        }
                    };

                    $scope.$watch('data', function (newVal) {
                        if(chartCreated)
                            chartCreated.destroy();

                        // if data not defined, exit
                        if (!newVal) {
                            return;
                        }
                        if ($scope.chart) { type = $scope.chart; }

                        if(autosize){
                            $scope.size();
                            chart = new Chart(ctx);
                        }

                        if($scope.responsive || $scope.resize)
                            $scope.options.responsive = true;

                        if($scope.responsive !== undefined)
                            $scope.options.responsive = $scope.responsive;

                        chartCreated = chart[type]($scope.data, $scope.options);
                        chartCreated.update();
                        if($scope.legend)
                            angular.element($elem[0]).parent().after( chartCreated.generateLegend() );
                    }, true);

                    $scope.$watch('tooltip', function (newVal) {
                        if (chartCreated)
                            chartCreated.draw();
                        if(newVal===undefined || !chartCreated.segments)
                            return;
                        if(!isFinite(newVal) || newVal >= chartCreated.segments.length || newVal < 0)
                            return;
                        var activeSegment = chartCreated.segments[newVal];
                        activeSegment.save();
                        activeSegment.fillColor = activeSegment.highlightColor;
                        chartCreated.showTooltip([activeSegment]);
                        activeSegment.restore();
                    }, true);

                    $scope.size();
                    var chart = new Chart(ctx);
                    var chartCreated;
                }
            };
        };
    }
})();





/**=========================================================
 * Module: classy-loader.js
 * Enable use of classyloader directly from data attributes
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        .directive('classyloader', classyloader);

    classyloader.$inject = ['$timeout', 'Utils', '$window'];
    function classyloader ($timeout, Utils, $window) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          var $scroller       = $($window),
              inViewFlagClass = 'js-is-in-view'; // a classname to detect when a chart has been triggered after scroll

          // run after interpolation  
          $timeout(function(){
      
            var $element = $(element),
                options  = $element.data();
            
            // At lease we need a data-percentage attribute
            if(options) {
              if( options.triggerInView ) {

                $scroller.scroll(function() {
                  checkLoaderInVIew($element, options);
                });
                // if the element starts already in view
                checkLoaderInVIew($element, options);
              }
              else
                startLoader($element, options);
            }

          }, 0);

          function checkLoaderInVIew(element, options) {
            var offset = -20;
            if( ! element.hasClass(inViewFlagClass) &&
                Utils.isInView(element, {topoffset: offset}) ) {
              startLoader(element, options);
            }
          }
          function startLoader(element, options) {
            element.ClassyLoader(options).addClass(inViewFlagClass);
          }
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.charts')
        .service('ChartData', ChartData);

    ChartData.$inject = ['$resource'];
    function ChartData($resource) {
        this.load = load;

        ////////////////
      
        var opts = {
            get: { method: 'GET', isArray: true }
          };
        function load(source) {
          return $resource(source, {}, opts).get();
        }
    }
})();

/**=========================================================
 * Module: flot.js
 * Initializes the Flot chart plugin and handles data refresh
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        .directive('flot', flot);

    flot.$inject = ['$http', '$timeout'];
    function flot ($http, $timeout) {

        var directive = {
          restrict: 'EA',
          template: '<div></div>',
          scope: {
            dataset: '=?',
            options: '=',
            series: '=',
            callback: '=',
            src: '='
          },
          link: link
        };
        return directive;

        function link(scope, element, attrs) {
          var height, plot, plotArea, width;
          var heightDefault = 220;

          plot = null;

          width = attrs.width || '100%';
          height = attrs.height || heightDefault;

          plotArea = $(element.children()[0]);
          plotArea.css({
            width: width,
            height: height
          });

          function init() {
            var plotObj;
            if(!scope.dataset || !scope.options) return;
            plotObj = $.plot(plotArea, scope.dataset, scope.options);
            scope.$emit('plotReady', plotObj);
            if (scope.callback) {
              scope.callback(plotObj, scope);
            }

            return plotObj;
          }

          function onDatasetChanged(dataset) {
            if (plot) {
              plot.setData(dataset);
              plot.setupGrid();
              return plot.draw();
            } else {
              plot = init();
              onSerieToggled(scope.series);
              return plot;
            }
          }
          scope.$watchCollection('dataset', onDatasetChanged, true);

          function onSerieToggled (series) {
            if( !plot || !series ) return;
            var someData = plot.getData();
            for(var sName in series) {
              angular.forEach(series[sName], toggleFor(sName));
            }
            
            plot.setData(someData);
            plot.draw();
            
            function toggleFor(sName) {
              return function (s, i){
                if(someData[i] && someData[i][sName])
                  someData[i][sName].show = s;
              };
            }
          }
          scope.$watch('series', onSerieToggled, true);
          
          function onSrcChanged(src) {

            if( src ) {

              $http.get(src)
                .success(function (data) {

                  $timeout(function(){
                    scope.dataset = data;
                  });

              }).error(function(){
                $.error('Flot chart: Bad request.');
              });
              
            }
          }
          scope.$watch('src', onSrcChanged);

        }
    }


})();

/**=========================================================
 * Module: morris.js
 * AngularJS Directives for Morris Charts
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        .directive('morrisBar',   morrisChart('Bar')   )
        .directive('morrisDonut', morrisChart('Donut') )
        .directive('morrisLine',  morrisChart('Line')  )
        .directive('morrisArea',  morrisChart('Area')  );

    function morrisChart(type) {
      return function () {
        return {
          restrict: 'EA',
          scope: {
            morrisData: '=',
            morrisOptions: '='
          },
          link: function($scope, element) {
            // start ready to watch for changes in data
            $scope.$watch('morrisData', function(newVal) {
              if (newVal) {
                $scope.morrisInstance.setData(newVal);
                $scope.morrisInstance.redraw();
              }
            }, true);
            // the element that contains the chart
            $scope.morrisOptions.element = element;
            // If data defined copy to options
            if($scope.morrisData)
              $scope.morrisOptions.data = $scope.morrisData;
            // Init chart
            $scope.morrisInstance = new Morris[type]($scope.morrisOptions);

          }
        };
      };
    }

})();

/**=========================================================
 * Module: sparkline.js
 * SparkLines Mini Charts
 =========================================================*/
 
(function() {
    'use strict';

    angular
        .module('app.charts')
        .directive('sparkline', sparkline);

    function sparkline () {
        var directive = {
            restrict: 'EA',
            scope: {
              'sparkline': '='
            },
            controller: Controller
        };
        return directive;

    }
    Controller.$inject = ['$scope', '$element', '$timeout', '$window'];
    function Controller($scope, $element, $timeout, $window) {
      var runSL = function(){
        initSparLine();
      };

      $timeout(runSL);
  
      function initSparLine() {
        var options = $scope.sparkline,
            data = $element.data();
        
        if(!options) // if no scope options, try with data attributes
          options = data;
        else
          if(data) // data attributes overrides scope options
            options = angular.extend({}, options, data);

        options.type = options.type || 'bar'; // default chart is bar
        options.disableHiddenCheck = true;

        $element.sparkline('html', options);

        if(options.resize) {
          $($window).resize(function(){
            $element.sparkline('html', options);
          });
        }
      }

    }
    

})();

(function() {
    'use strict';

    angular
        .module('app.colors')
        .constant('APP_COLORS', {
          'primary':                '#5d9cec',
          'success':                '#27c24c',
          'info':                   '#23b7e5',
          'warning':                '#ff902b',
          'danger':                 '#f05050',
          'inverse':                '#131e26',
          'green':                  '#37bc9b',
          'pink':                   '#f532e5',
          'purple':                 '#7266ba',
          'dark':                   '#3a3f51',
          'yellow':                 '#fad732',
          'gray-darker':            '#232735',
          'gray-dark':              '#3a3f51',
          'gray':                   '#dde6e9',
          'gray-light':             '#e4eaec',
          'gray-lighter':           '#edf1f2'
        })
        ;
})();
/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.colors')
        .service('Colors', Colors);

    Colors.$inject = ['APP_COLORS'];
    function Colors(APP_COLORS) {
        this.byName = byName;

        ////////////////

        function byName(name) {
          return (APP_COLORS[name] || '#fff');
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .config(coreConfig)
        .config(loopbackConfig)
    ;

    coreConfig.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider'];
    function coreConfig($controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider){
      
      var core = angular.module('app.core');
      // registering components after bootstrap
      core.controller = $controllerProvider.register;
      core.directive  = $compileProvider.directive;
      core.filter     = $filterProvider.register;
      core.factory    = $provide.factory;
      core.service    = $provide.service;
      core.constant   = $provide.constant;
      core.value      = $provide.value;

      $httpProvider.interceptors.push(["$q", "$location", "LoopBackAuth", function($q, $location, LoopBackAuth) {
        return {
          responseError: function(rejection) {
            if (rejection.status == 401) {
              LoopBackAuth.clearUser();
              LoopBackAuth.clearStorage();
              $location.path('/page/login')
            }
            return $q.reject(rejection);
          }
        };
      }]);     
    }
    
    loopbackConfig.$inject = ['LoopBackResourceProvider', 'urlBase'];
    function loopbackConfig(LoopBackResourceProvider, urlBase) {
      LoopBackResourceProvider.setUrlBase(urlBase);
    }

})();
/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('APP_MEDIAQUERY', {
          'desktopLG':             1200,
          'desktop':                992,
          'tablet':                 768,
          'mobile':                 480
        })
        .constant('urlBase', "http://0.0.0.0:3000/api")
        // .constant('urlBase', "http://api.fankahui.com:3000/api")
      ;

})();
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.core')
        .filter('role', roleFilter)
    ;

    function roleFilter() {
        var role = {
          owner: "老板",
          shopManager: "店长",
          cashier: "收银员"
        };
        return function(key) {
          return role[key];
        }
    }
    
})();
(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun)
        .run(currentUserRun)
    ;

    appRun.$inject = ['$rootScope', '$state', '$stateParams',  '$window', '$templateCache', 'Colors'];
    
    function appRun($rootScope, $state, $stateParams, $window, $templateCache, Colors) {
      
      // Set reference to access them from any scope
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.$storage = $window.localStorage;

      // Uncomment this to disable template cache
      /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          if (typeof(toState) !== 'undefined'){
            $templateCache.remove(toState.templateUrl);
          }
      });*/

      // Allows to use branding color with interpolation
      // {{ colorByName('primary') }}
      $rootScope.colorByName = Colors.byName;

      // cancel click event easily
      $rootScope.cancel = function($event) {
        $event.stopPropagation();
      };

      // Hooks Example
      // ----------------------------------- 

      // Hook not found
      $rootScope.$on('$stateNotFound',
        function(event, unfoundState/*, fromState, fromParams*/) {
            console.log(unfoundState.to); // "lazy.state"
            console.log(unfoundState.toParams); // {a:1, b:2}
            console.log(unfoundState.options); // {inherit:false} + default options
        });
      // Hook error
      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error){
          console.log(error);
        });
      // Hook success
      $rootScope.$on('$stateChangeSuccess',
        function(/*event, toState, toParams, fromState, fromParams*/) {
          // display new view from top
          $window.scrollTo(0, 0);
          // Save the route title
          $rootScope.currTitle = $state.current.title;
        });

      // Load a title dynamically
      $rootScope.currTitle = $state.current.title;
      $rootScope.pageTitle = function() {
        var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
        document.title = title;
        return title;
      };      

    }

    currentUserRun.$inject = ['$rootScope', 'User', '$filter'];
    
    function currentUserRun($rootScope, User, $filter) {
      
      userDidLogined();
      
      function userDidLogined() {
        if(User.isAuthenticated()) {
          User.findById({id: User.getCurrentId(), filter:{include:['shop', 'merchant']}})
          .$promise.then(function (user) {
            user.job = $filter('role')(user.role);
            user.name = user.name || user.username;
            user.picture = 'app/img/dummy.png';
            $rootScope.user = user;
          });
        }
      }
      
      $rootScope.$on('User.logined', userDidLogined);
      
    }
})();


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
(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', 'ChartData', '$timeout', 'Checkin', 'Deal', 'Payment'];
    function DashboardController($scope, ChartData, $timeout, Checkin, Deal, Payment) {
        var vm = this;

        // Set Moment locale
        moment.locale('zh-cn');

        activate();

        ////////////////

        function activate() {
          
          if(!$scope.user) return;

          // Statistic
          // ----------------------------------- 
          vm.statData = {amount: 0, qty: 0, deposit: 0};
          
          Deal.stat({filter:{where:{status: 'closed', "payment.amount": {$gt: 0}}}}, function (res) {
            if(res.length === 0) return;
            vm.statData.amount = res[0].amount;
            vm.statData.qty = res[0].qty;
          });
          
          Payment.stat({filter:{where:{status: 'closed', category: 'deposit'}}}, function (res) {
            if(res.length === 0) return;
            vm.statData.deposit = res[0].amount;
          })
          // CHECKIN
          // ----------------------------------- 
          vm.checkins = Checkin.find({filter:{
            where: {merchantId: $scope.user.shopId},
            include: [{member: 'wxuser'}],
            limit: 10, 
            order: 'created DESC'
          }});

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
                  min: 0,
                  max: 150, // optional: use it for a clear represetation
                  tickColor: '#eee',
                  position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                  tickFormatter: function (v) {
                      return v/* + ' visitors'*/;
                  }
              },
              shadowSize: 0
          };


          // PANEL REFRESH EVENTS
          // ----------------------------------- 

          $scope.$on('panel-refresh', function(event, id) {
            
            console.log('Simulating chart refresh during 3s on #'+id);

            // Instead of timeout you can request a chart data
            $timeout(function(){
              
              // directive listen for to remove the spinner 
              // after we end up to perform own operations
              $scope.$broadcast('removeSpinner', id);
              
              console.log('Refreshed #' + id);

            }, 3000);

          });


          // PANEL DISMISS EVENTS
          // ----------------------------------- 

          // Before remove panel
          $scope.$on('panel-remove', function(event, id, deferred){
            
            console.log('Panel #' + id + ' removing');
            
            // Here is obligatory to call the resolve() if we pretend to remove the panel finally
            // Not calling resolve() will NOT remove the panel
            // It's up to your app to decide if panel should be removed or not
            deferred.resolve();
          
          });

          // Panel removed ( only if above was resolved() )
          $scope.$on('panel-removed', function(event, id){

            console.log('Panel #' + id + ' removed');

          });

        }
        
        $scope.$on('User.logined', activate);
        
    }
})();
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .filter('moment_unix', momentUnixFilter)
        .filter('moment_from_now', momentFromNowFilter)
        .filter('moment_unix_from_now', momentUnixFromNowFilter)
    ;

    function momentUnixFilter(input, format) {
      return moment.unix(input).format(format || 'YYYY-MM-DD HH:mm:ss');
    }
    momentUnixFilter.$inject = ["input", "format"];
    
    function momentFromNowFilter() {
      return function (input) {
        return moment(input).fromNow();
      };
    }

    function momentUnixFromNowFilter(input) {
      return moment.unix(input).fromNow();
    }
    momentUnixFromNowFilter.$inject = ["input"];

})();
/**=========================================================
 * Module: scroll.js
 * Make a content box scrollable
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.elements')
        .directive('scrollable', scrollable);

    function scrollable () {
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attrs) {
          var defaultHeight = 250;
          element.slimScroll({
              height: (attrs.height || defaultHeight)
          });
        }
    }

})();

/**=========================================================
 * Module: filestyle.js
 * Initializes the fielstyle plugin
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('filestyle', filestyle);

    function filestyle () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          var options = element.data();
          
          // old usage support
          options.classInput = element.data('classinput') || options.classInput;
          
          element.filestyle(options);
        }
    }

})();

/**=========================================================
 * Module: form-wizard.js
 * Handles form wizard plugin and validation
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('formWizard', formWizard);

    formWizard.$inject = ['$parse'];
    function formWizard ($parse) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: true
        };
        return directive;

        function link(scope, element, attrs) {
          var validate = $parse(attrs.validateSteps)(scope),
              wiz = new Wizard(attrs.steps, !!validate, element);
          scope.wizard = wiz.init();
        }

        function Wizard (quantity, validate, element) {
          
          var self = this;
          self.quantity = parseInt(quantity,10);
          self.validate = validate;
          self.element = element;
          
          self.init = function() {
            self.createsteps(self.quantity);
            self.go(1); // always start at fist step
            return self;
          };

          self.go = function(step) {
            
            if ( angular.isDefined(self.steps[step]) ) {

              if(self.validate && step !== 1) {
                var form = $(self.element),
                    group = form.children().children('div').get(step - 2);

                if (false === form.parsley().validate( group.id )) {
                  return false;
                }
              }

              self.cleanall();
              self.steps[step] = true;
            }
          };

          self.active = function(step) {
            return !!self.steps[step];
          };

          self.cleanall = function() {
            for(var i in self.steps){
              self.steps[i] = false;
            }
          };

          self.createsteps = function(q) {
            self.steps = [];
            for(var i = 1; i <= q; i++) self.steps[i] = false;
          };

        }
    }


})();

/**=========================================================
 * Module: masked,js
 * Initializes the masked inputs
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('masked', masked);

    function masked () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          var $elem = $(element);
          if($.fn.inputmask)
            $elem.inputmask();
        }
    }

})();

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.forms')
        .filter('propsFilter', propsFilter);

    function propsFilter() {
        return filterFilter;

        ////////////////
        function filterFilter(items, props) {
          var out = [];

          if (angular.isArray(items)) {
            items.forEach(function(item) {
              var itemMatches = false;

              var keys = Object.keys(props);
              for (var i = 0; i < keys.length; i++) {
                var prop = keys[i];
                var text = props[prop].toLowerCase();
                if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                  itemMatches = true;
                  break;
                }
              }

              if (itemMatches) {
                out.push(item);
              }
            });
          } else {
            // Let the output be the input untouched
            out = items;
          }

          return out;
        }
    }

})();
/**=========================================================
 * Module: tags-input.js
 * Initializes the tag inputs plugin
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('tagsinput', tagsinput);

    tagsinput.$inject = ['$timeout'];
    function tagsinput ($timeout) {
        var directive = {
            link: link,
            require: 'ngModel',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
          element.on('itemAdded itemRemoved', function(){
            // check if view value is not empty and is a string
            // and update the view from string to an array of tags
            if(ngModel.$viewValue && ngModel.$viewValue.split) {
              ngModel.$setViewValue( ngModel.$viewValue.split(',') );
              ngModel.$render();
            }
          });

          $timeout(function(){
            element.tagsinput();
          });
        }
    }

})();

/**=========================================================
 * Module: validate-form.js
 * Initializes the validation plugin Parsley
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('validateForm', validateForm);

    function validateForm () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          var $elem = $(element);
          if($.fn.parsley)
            $elem.parsley();
        }
    }

})();

(function() {
    'use strict';

    angular
      .module('app.items', [])
      .controller('ItemsController', ItemsController)
      .controller('StockDialogController', StockDialogController)
      .controller('StocksController', StocksController)
      .controller('ItemAddController', ItemAddController);
    
    ItemsController.$inject = ['$scope', 'ngTableParams', 'Sku', 'ngDialog', 'SweetAlert', 'ngTableLBService'];
    function ItemsController($scope, ngTableParams, Sku, ngDialog, SweetAlert, ngTableLBService) {
      var vm = this;
      
      activate();
      
      function activate() {
        vm.keyword = "";
        vm.tableParams = new ngTableParams({count: 10}, {
          getData: function($defer, params) {
            var filter = {
              where:{status:{ne:'deleted'}}, 
              include:[
                {
                  relation:'inventories',
                  scope:{ where: {shopId: $scope.user.shop.id} }
                }
              ]
            };
            if(vm.keyword != '') {
              var qs = {regex: keyword};
              filter.where.or = [{"item.name":qs}, {model:qs}];
              params.page(1);
            }
            ngTableLBService.getData($defer, params, Sku, filter);
          }
        });
      }
            
      vm.stock = function (sku, type) {
        ngDialog.open({ 
          template: 'stockDialogId', 
          controller: 'StockDialogController', 
          data: {sku: sku, type: type} 
        });
      }
      
      vm.delete = function (sku) {
        SweetAlert.swal({   
          title: '确定删除商品'+sku.item.name,   
          text: '删除商品后将无法恢复，你确定要删除商品？',   
          type: 'warning',   
          showCancelButton: true,   
          confirmButtonColor: '#DD6B55',   
          confirmButtonText: '是的，删除！',
          cancelButtonText: '不，取消！',   
          closeOnConfirm: false
        },  function(isConfirm){  
          if(isConfirm) {
            sku.status = 'deleted';
            sku.$save(function () {
              SweetAlert.swal('已删除!','你的商品'+sku.item.name+'已经删除。', 'success');
            }, function (err) {
              SweetAlert.swal('失败!', '删除商品时发生错误，你的商品没有被删除。', 'error');
            });
          }
        });
      }
      
      vm.confirm = function (sku) {
        var qty = 0;
        var inventory = sku.inventories[0];
        if(inventory) {
          qty = inventory.balance;
        }
        Sku.stocks.create({id: sku.id}, {type: 'inventory', qty: qty}).$promise.then(function (data) {
          SweetAlert.swal('盘点成功!','你的商品'+sku.item.name+'已经盘点确认。', 'success');
        });
      }
      
    }
    
    ItemAddController.$inject = ['$scope', 'Item'];
    function ItemAddController($scope, Item) {
      activate();
      
      window.ParsleyValidator.setLocale('zh_cn');
      
      function activate() {
        $scope.entity = {
          type: "entity",
          name: "iPhone6S Plus",
          skus: [{barcode: "456", price: 608800, model: "16GB", stockQty:3}]
        };
      }
      
      $scope.save = function () {
        Item.create($scope.entity).$promise
        .then(function (item) {
          $scope.$state.go('app.item');
        });
      }
      
      $scope.saveAndMore = function () {
        Item.create($scope.entity)
      }
    }
    
    StockDialogController.$inject = ['$scope', 'ngDialog', 'Stock', 'toaster', '$filter'];
    function StockDialogController($scope, ngDialog, Stock, toaster, $filter) {

        activate();

        ////////////////

        function activate() {
          $scope.stockQty = 0;
        }
        
        $scope.confirm = function () {
          var sku = $scope.ngDialogData.sku;
          var type = $scope.ngDialogData.type;
          var memo = $scope.ngDialogData.memo;
          Stock.create({skuId: sku.id, qty: $scope.stockQty, type: type, memo: memo});
          sku.inventories[0].qty += $scope.stockQty;
          ngDialog.close();
          toaster.pop('success', '成功',
           "完成"+$filter('stock_type')(type)+sku.item.name+": "+$scope.stockQty+"件");
        }
    }
    
    StocksController.$inject = ['$scope', 'Stock', 'ngTableParams'];
    function StocksController($scope, Stock, ngTableParams) {
      var vm = this;
      
      active();
      
      function active() {
        vm.filter = {text: ''}
        vm.tableParams = new ngTableParams({
          count: 10,
          filter: vm.filter.text
        }, {
          getData: function($defer, params) {
            var opt = {where:{}, include:['sku']}
            opt.limit = params.count()
            opt.skip = (params.page()-1)*opt.limit
            if(vm.filter.text != '') {
              opt.skip = 0;
            }
            Stock.count({where: opt.where}, function (result) {
              vm.tableParams.total(result.count)
              Stock.find({filter:opt}, $defer.resolve)
            })
          }
        });
      }
    }

})();
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.items')
        .filter('item_type', itemTypeFilter)
        .filter('stock_type', stockTypeFilter)
        .filter('currency_cny', currencyCNYFilter)
    ;

    function itemTypeFilter() {
        var type = {
          entity: "实物商品",
          service: "服务项目"
        }
        return function(key) {
          return type[key];
        }
    }
    
    function currencyCNYFilter() {
      return function (val) {
        return "¥ "+val/100;
      }
    }
    
    function stockTypeFilter() {
      var type = {
        stock: "进货入库",
        sale: "销售出库",
        cancel: "核销出库",
        inventory: "盘点修正",
        transfer: "库存调货"
      }
      return function (key) {
        key = key || 'stock';
        return type[key];
      }
    }

})();
(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .config(lazyloadConfig);

    lazyloadConfig.$inject = ['$ocLazyLoadProvider', 'APP_REQUIRES'];
    function lazyloadConfig($ocLazyLoadProvider, APP_REQUIRES){

      // Lazy Load modules configuration
      $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: APP_REQUIRES.modules
      });

    }
})();
(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .constant('APP_REQUIRES', {
          // jQuery based and standalone scripts
          scripts: {
            'whirl':              ['vendor/whirl/dist/whirl.css'],
            'classyloader':       ['vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
            'animo':              ['vendor/animo.js/animo.js'],
            'fastclick':          ['vendor/fastclick/lib/fastclick.js'],
            'modernizr':          ['vendor/modernizr/modernizr.js'],
            'animate':            ['vendor/animate.css/animate.min.css'],
            'skycons':            ['vendor/skycons/skycons.js'],
            'icons':              ['vendor/fontawesome/css/font-awesome.min.css',
                                   'vendor/simple-line-icons/css/simple-line-icons.css'],
            'weather-icons':      ['vendor/weather-icons/css/weather-icons.min.css'],
            'sparklines':         ['app/vendor/sparklines/jquery.sparkline.min.js'],
            'wysiwyg':            ['vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                                   'vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
            'slimscroll':         ['vendor/slimScroll/jquery.slimscroll.min.js'],
            'screenfull':         ['vendor/screenfull/dist/screenfull.js'],
            'vector-map':         ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                                   'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'],
            'vector-map-maps':    ['vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                                   'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'],
            'loadGoogleMapsJS':   ['app/vendor/gmap/load-google-maps.js'],
            'flot-chart':         ['vendor/Flot/jquery.flot.js'],
            'flot-chart-plugins': ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                                   'vendor/Flot/jquery.flot.resize.js',
                                   'vendor/Flot/jquery.flot.pie.js',
                                   'vendor/Flot/jquery.flot.time.js',
                                   'vendor/Flot/jquery.flot.categories.js',
                                   'vendor/flot-spline/js/jquery.flot.spline.min.js'],
                                  // jquery core and widgets
            'jquery-ui':          ['vendor/jquery-ui/ui/core.js',
                                   'vendor/jquery-ui/ui/widget.js'],
                                   // loads only jquery required modules and touch support
            'jquery-ui-widgets':  ['vendor/jquery-ui/ui/core.js',
                                   'vendor/jquery-ui/ui/widget.js',
                                   'vendor/jquery-ui/ui/mouse.js',
                                   'vendor/jquery-ui/ui/draggable.js',
                                   'vendor/jquery-ui/ui/droppable.js',
                                   'vendor/jquery-ui/ui/sortable.js',
                                   'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'],
            'moment' :            ['vendor/moment/min/moment-with-locales.min.js'],
            'inputmask':          ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
            'flatdoc':            ['vendor/flatdoc/flatdoc.js'],
            'codemirror':         ['vendor/codemirror/lib/codemirror.js',
                                   'vendor/codemirror/lib/codemirror.css'],
            // modes for common web files
            'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
                                     'vendor/codemirror/mode/xml/xml.js',
                                     'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                                     'vendor/codemirror/mode/css/css.js'],
            'taginput' :          ['vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                                   'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'],
            'filestyle':          ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
            'parsley':            ['vendor/parsleyjs/src/i18n/zh_cn.extra.js',
                                   'vendor/parsleyjs/dist/parsley.min.js',
                                   'vendor/parsleyjs/src/i18n/zh_cn.js'],
            'fullcalendar':       ['vendor/fullcalendar/dist/fullcalendar.min.js',
                                   'vendor/fullcalendar/dist/fullcalendar.css'],
            'gcal':               ['vendor/fullcalendar/dist/gcal.js'],
            'chartjs':            ['vendor/Chart.js/Chart.js'],
            'morris':             ['vendor/raphael/raphael.js',
                                   'vendor/morris.js/morris.js',
                                   'vendor/morris.js/morris.css'],
            'loaders.css':          ['vendor/loaders.css/loaders.css'],
            'spinkit':              ['vendor/spinkit/css/spinkit.css']
          },
          // Angular based script (use the right module name)
          modules: [
            {name: 'toaster',                   files: ['vendor/angularjs-toaster/toaster.js',
                                                       'vendor/angularjs-toaster/toaster.css']},
            {name: 'localytics.directives',     files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js',
                                                       'vendor/chosen_v1.2.0/chosen.min.css',
                                                       'vendor/angular-chosen-localytics/chosen.js']},
            {name: 'ngDialog',                  files: ['vendor/ngDialog/js/ngDialog.min.js',
                                                       'vendor/ngDialog/css/ngDialog.min.css',
                                                       'vendor/ngDialog/css/ngDialog-theme-default.min.css'] },
            {name: 'ngWig',                     files: ['vendor/ngWig/dist/ng-wig.min.js'] },
            {name: 'ngTable',                   files: ['vendor/ng-table/dist/ng-table.min.js',
                                                        'vendor/ng-table/dist/ng-table.min.css']},
            {name: 'ngTableExport',             files: ['vendor/ng-table-export/ng-table-export.js']},
            {name: 'angularBootstrapNavTree',   files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                                                        'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']},
            {name: 'htmlSortable',              files: ['vendor/html.sortable/dist/html.sortable.js',
                                                        'vendor/html.sortable/dist/html.sortable.angular.js']},
            {name: 'xeditable',                 files: ['vendor/angular-xeditable/dist/js/xeditable.js',
                                                        'vendor/angular-xeditable/dist/css/xeditable.css']},
            {name: 'angularFileUpload',         files: ['vendor/angular-file-upload/angular-file-upload.js']},
            {name: 'ngImgCrop',                 files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                                                        'vendor/ng-img-crop/compile/unminified/ng-img-crop.css']},
            {name: 'ui.select',                 files: ['vendor/angular-ui-select/dist/select.js',
                                                        'vendor/angular-ui-select/dist/select.css']},
            {name: 'ui.codemirror',             files: ['vendor/angular-ui-codemirror/ui-codemirror.js']},
            {name: 'angular-carousel',          files: ['vendor/angular-carousel/dist/angular-carousel.css',
                                                        'vendor/angular-carousel/dist/angular-carousel.js']},
            {name: 'ngGrid',                    files: ['vendor/ng-grid/build/ng-grid.min.js',
                                                        'vendor/ng-grid/ng-grid.css' ]},
            {name: 'infinite-scroll',           files: ['vendor/ngInfiniteScroll/build/ng-infinite-scroll.js']},
            {name: 'ui.bootstrap-slider',       files: ['vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                                                        'vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
                                                        'vendor/angular-bootstrap-slider/slider.js']},
            {name: 'ui.grid',                   files: ['vendor/angular-ui-grid/ui-grid.min.css',
                                                        'vendor/angular-ui-grid/ui-grid.min.js']},
            {name: 'textAngular',               files: ['vendor/textAngular/dist/textAngular.css',
                                                        'vendor/textAngular/dist/textAngular-rangy.min.js',
                                                        'vendor/textAngular/dist/textAngular-sanitize.js',
                                                        'vendor/textAngular/src/globals.js',
                                                        'vendor/textAngular/src/factories.js',
                                                        'vendor/textAngular/src/DOM.js',
                                                        'vendor/textAngular/src/validators.js',
                                                        'vendor/textAngular/src/taBind.js',
                                                        'vendor/textAngular/src/main.js',
                                                        'vendor/textAngular/dist/textAngularSetup.js'
                                                        ], serie: true},
            {name: 'angular-rickshaw',          files: ['vendor/d3/d3.min.js',
                                                        'vendor/rickshaw/rickshaw.js',
                                                        'vendor/rickshaw/rickshaw.min.css',
                                                        'vendor/angular-rickshaw/rickshaw.js'], serie: true},
            {name: 'angular-chartist',          files: ['vendor/chartist/dist/chartist.min.css',
                                                        'vendor/chartist/dist/chartist.js',
                                                        'vendor/angular-chartist.js/dist/angular-chartist.js'], serie: true},
            {name: 'ui.map',                    files: ['vendor/angular-ui-map/ui-map.js']},
            {name: 'datatables',                files: ['vendor/datatables/media/css/jquery.dataTables.css',
                                                        'vendor/datatables/media/js/jquery.dataTables.js',
                                                        'vendor/angular-datatables/dist/angular-datatables.js'], serie: true},
            {name: 'angular-jqcloud',           files: ['vendor/jqcloud2/dist/jqcloud.css',
                                                        'vendor/jqcloud2/dist/jqcloud.js',
                                                        'vendor/angular-jqcloud/angular-jqcloud.js']},
            {name: 'angularGrid',               files: ['vendor/ag-grid/dist/angular-grid.css',
                                                        'vendor/ag-grid/dist/angular-grid.js',
                                                        'vendor/ag-grid/dist/theme-dark.css',
                                                        'vendor/ag-grid/dist/theme-fresh.css']},
            {name: 'ng-nestable',               files: ['vendor/ng-nestable/src/angular-nestable.js',
                                                        'vendor/nestable/jquery.nestable.js']},
            {name: 'akoenig.deckgrid',          files: ['vendor/angular-deckgrid/angular-deckgrid.js']},
            {name: 'oitozero.ngSweetAlert',     files: ['vendor/sweetalert/dist/sweetalert.css',
                                                        'vendor/sweetalert/dist/sweetalert.min.js',
                                                        'vendor/angular-sweetalert/SweetAlert.js']},
            {name: 'bm.bsTour',                 files: ['vendor/bootstrap-tour/build/css/bootstrap-tour.css',
                                                        'vendor/bootstrap-tour/build/js/bootstrap-tour-standalone.js',
                                                        'vendor/angular-bootstrap-tour/dist/angular-bootstrap-tour.js'], serie: true},
            {name: 'ui.knob',                   files: ['vendor/angular-knob/src/angular-knob.js',
                                                        'vendor/jquery-knob/dist/jquery.knob.min.js']},
            {name: 'easypiechart',              files: ['vendor/jquery.easy-pie-chart/dist/angular.easypiechart.min.js']},
            {name: 'colorpicker.module',        files: ['vendor/angular-bootstrap-colorpicker/css/colorpicker.css',
                                                        'vendor/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js']}
          ]
        })
        ;

})();

(function() {
    'use strict';

    angular
        .module('app.loadingbar')
        .config(loadingbarConfig)
        ;
    loadingbarConfig.$inject = ['cfpLoadingBarProvider'];
    function loadingbarConfig(cfpLoadingBarProvider){
      cfpLoadingBarProvider.includeBar = true;
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.latencyThreshold = 500;
      cfpLoadingBarProvider.parentSelector = '.wrapper > section';
    }
})();
(function() {
    'use strict';

    angular
        .module('app.loadingbar')
        .run(loadingbarRun)
        ;
    loadingbarRun.$inject = ['$rootScope', '$timeout', 'cfpLoadingBar'];
    function loadingbarRun($rootScope, $timeout, cfpLoadingBar){

      // Loading bar transition
      // ----------------------------------- 
      var thBar;
      $rootScope.$on('$stateChangeStart', function() {
          if($('.wrapper > section').length) // check if bar container exists
            thBar = $timeout(function() {
              cfpLoadingBar.start();
            }, 0); // sets a latency Threshold
      });
      $rootScope.$on('$stateChangeSuccess', function(event) {
          event.targetScope.$watch('$viewContentLoaded', function () {
            $timeout.cancel(thBar);
            cfpLoadingBar.complete();
          });
      });

    }

})();
(function() {
    'use strict';

    angular
        .module('app.locale')
        .config(localeConfig)
        ;
    localeConfig.$inject = ['tmhDynamicLocaleProvider'];
    function localeConfig(tmhDynamicLocaleProvider){
  
      tmhDynamicLocaleProvider.defaultLocale('zh');
      tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
      // tmhDynamicLocaleProvider.useStorage('$cookieStore');

    }
})();
/**=========================================================
 * Module: locale.js
 * Demo for locale settings
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.locale')
        .controller('LocalizationController', LocalizationController);

    LocalizationController.$inject = ['$rootScope', 'tmhDynamicLocale', '$locale'];
    function LocalizationController($rootScope, tmhDynamicLocale, $locale) {

        activate();

        ////////////////

        function activate() {
          $rootScope.availableLocales = {
            'en': 'English',
            'es': 'Spanish',
            'de': 'German',
            'fr': 'French',
            'ar': 'Arabic',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese'};
          
          $rootScope.model = {selectedLocale: 'zh'};
          
          $rootScope.$locale = $locale;
          
          $rootScope.changeLocale = tmhDynamicLocale.set;

        }
    }
})();

(function() {
    'use strict';

    angular
      .module('app.members')
      .controller('MembersController', MembersController)
      .controller('MemberController', MemberController)
      .controller('rechargeDialogController', rechargeDialogController)
      .controller('bonusDialogController', bonusDialogController)
    ;
      
    MembersController.$inject = ['$scope', 'Member', 'ngTableParams', 'ngTableLBService', 'SweetAlert', 'qrcodeService', 'dealService'];
    function MembersController($scope, Member, ngTableParams, ngTableLBService, SweetAlert, qrcodeService, dealService) {
      var vm = this;
      
      activate();
      
      function activate() {
        $scope.qrcodeService = qrcodeService;
        vm.keyword = "";
        vm.tableParams = new ngTableParams({count: 10}, {
          getData: function($defer, params) {
            var filter = {where:{status:{ne:'deleted'}}, include:['wxuser']}
            if(vm.keyword != '') {
              var qs = {regex: keyword};
              filter.where.or = [{"entities.sku.item.name":qs}];
              params.page(1);
            }
            ngTableLBService.getData($defer, params, Member, filter);
          }
        });
      }
      
      vm.sell = function (member) {
        dealService.openDeal(member);
        $scope.$state.go('app.sell');
      }
    }
    
    MemberController.$inject = ['$scope', 'Member', 'ngTableParams', 'ngTableLBService', 'SweetAlert', 'dealService', 'ngDialog'];
    function MemberController($scope, Member, ngTableParams, ngTableLBService, SweetAlert, dealService, ngDialog) {
      var vm = this;
      var memberId = $scope.$state.params.memberId;
            
      vm.dealTableParams = new ngTableParams({
        count: 10
      }, {
        getData: function($defer, params) {
          var opt = {where:{status:{ne:'deleted'}}}
          opt.limit = params.count()
          opt.skip = (params.page()-1)*opt.limit
          Member.deals.count({id: memberId, where: opt.where}, function (result) {
            vm.dealTableParams.total(result.count);
          });
          Member.deals({id: memberId, filter:opt}, $defer.resolve);
        }
      });     
      
      vm.depositTableParams = new ngTableParams({
        count: 10
      }, {
        getData: function($defer, params) {
          var opt = {
            where:{status:{ne:'deleted'}, or:[{type: 'deposit'}, {category: 'deposit'}]},
            include: ['shop']
          }
          opt.limit = params.count()
          opt.skip = (params.page()-1)*opt.limit
          Member.payments.count({id: memberId, where: opt.where}, function (result) {
            vm.depositTableParams.total(result.count);
          });
          Member.payments({id: memberId, filter:opt}, $defer.resolve);
        }
      });

      vm.bonusTableParams = new ngTableParams({
        count: 10
      }, {
        getData: function($defer, params) {
          var opt = {
            where:{status:{ne:'deleted'}},
            include: []
          }
          opt.limit = params.count()
          opt.skip = (params.page()-1)*opt.limit
          Member.bonuses.count({id: memberId, where: opt.where}, function (result) {
            vm.bonusTableParams.total(result.count);
          });
          Member.bonuses({id: memberId, filter:opt}, $defer.resolve);
        }
      });

      activate();
      
      function activate() {
        
        memberId = $scope.$state.params.memberId;

        vm.member = Member.findOne({filter: {
          where: {id: memberId}, 
          include:['wxuser']
        }});
        
        vm.dealTableParams.reload();
        vm.depositTableParams.reload();
        vm.bonusTableParams.reload();
      }

      vm.sell = function () {
        dealService.openDeal(vm.member);
        $scope.$state.go('app.sell');
      }
      
      vm.recharge = function () {
        ngDialog.open({ 
          template: 'rechargeDialogId', 
          controller: 'rechargeDialogController'
        }).closePromise.then(function (data) {
          activate();
        });
      }
      
      vm.setBonus = function () {
        ngDialog.open({ 
          template: 'bonusDialogId', 
          controller: 'bonusDialogController'
        }).closePromise.then(function (data) {
          activate();
        });
      }
    }
    
    rechargeDialogController.$inject = ['$scope', 'ngDialog', 'Member', 'toaster', 'dealService'];
    function rechargeDialogController($scope, ngDialog, Member, toaster, dealService) {

        activate();

        ////////////////

        var memberId = $scope.$state.params.memberId;
        function activate() {
          memberId = $scope.$state.params.memberId;
          $scope.member = Member.findById({id:memberId});
          $scope.data = {
            type: 'cash', 
            amount: 0,
            category: 'deposit'
          };
          $scope.payType = dealService.payType;
          $scope.cash = {
            paid: 0,
            change: 0,
          }
        }
        
        $scope.onChangePayType = function () {
          if(data.type === 'cash') {
            $scope.data.cost = $scope.data.amount%$scope.user.merchant.changeRate;
            $scope.data.amount -= $scope.data.cost;
            $scope.countChange();
          } else {
            $scope.data.cost = 0;
          }
        }
        
        $scope.countChange = function () {
          $scope.cash.paid =  $scope.cash.paid;
          $scope.cash.change = $scope.data.amount - $scope.cash.paid;
        }
        
        $scope.confirm = function () {
          if($scope.data.amount === 0) {
            return;
          }
          Member.payments.create({id: memberId}, $scope.data).$promise.then(function (result) {
            $scope.submiting = false;
            ngDialog.close();
            toaster.pop('success', '成功', "完成储值操作");
          }, function (err) {
            $scope.submiting = false;
            toaster.pop('error', '失败', "储值操作未完成，请重试！")
          });
          $scope.submiting = true;
        }
        
    }
    
    bonusDialogController.$inject = ['$scope', 'ngDialog', 'Member', 'toaster'];
    function bonusDialogController($scope, ngDialog, Member, toaster) {

        activate();

        ////////////////

        var memberId = $scope.$state.params.memberId;
        function activate() {
          memberId = $scope.$state.params.memberId;
          $scope.member = Member.findById({id:memberId});
          $scope.data = {
            amount: 0,
            memo: 'manual'
          };
        }
        
        $scope.confirm = function () {
          if($scope.data.amount === 0) {
            return;
          } else if($scope.data.amount > 0) {
            $scope.data.memo = 'manual';
          } else if($scope.data.amount < 0) {
            $scope.data.memo = 'writeoff';
          }
          Member.bonuses.create({id: memberId}, $scope.data).$promise.then(function (result) {
            $scope.submiting = false;
            ngDialog.close();
            toaster.pop('success', '成功', "完成储值操作");
          }, function (err) {
            $scope.submiting = false;
            toaster.pop('error', '失败', "储值操作未完成，请重试！")
          });
          $scope.submiting = true;
        }
    }
})();
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
(function() {
    'use strict';

    angular
        .module('app.members')
        .service('qrcodeService', qrcodeService);

    qrcodeService.$inject = ['ngDialog'];
    function qrcodeService(ngDialog) {
      var self = this;
      
      this.showQRCode = showQRCode;
      
      function showQRCode(imageurl) {
        imageurl = imageurl || 'app/img/qrcode-for-gh.jpg';
        ngDialog.open({
          template: "<img src="+imageurl+" class='img-responsive'>",
          plain: true,
          className: 'ngdialog-theme-default'
        });    
      }
    }

})();

(function() {
    'use strict';

    angular
      .module('app.myshop', [])
      .controller('MyShopController', MyShopController)
      .controller('ShopsController', ShopsController)
      .controller('ShopAddController', ShopAddController);
        
    MyShopController.$inject = ['$scope', 'editableOptions', 'editableThemes', 'Shop', 'Merchant'];
    function MyShopController($scope, editableOptions, editableThemes, Shop, Merchant) {
      var vm = this;

      AMap.service('AMap.DistrictSearch', function () {
        var districtSearch = new AMap.DistrictSearch({
          level : 'country',
          subdistrict : 3    
        });
    
        districtSearch.search('中国', function (status, result) {
          vm.provinces = result.districtList[0].districtList;
          // $scope.$apply();
        });
      });
      
      activate();
      
      function activate() {
        
        editableOptions.theme = 'bs3';
        
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-success"><span class="fa fa-check"></span></button>';
        editableThemes.bs3.cancelTpl = '<button type="button" class="btn btn-default" ng-click="$form.$cancel()">'+
                                         '<span class="fa fa-times text-muted"></span>'+
                                       '</button>';
        
        vm.shop = $scope.user.shop;
        vm.merchant = $scope.user.merchant;
      }
      
      vm.update = function (obj, key, data) {
        vm[obj][key] = data.name;
      }
      
      vm.saveShop = function () {
        Shop.upsert(vm.shop);
      }
      
      vm.saveMerchant = function () {
        Merchant.upsert(vm.merchant);
      }
    }
    
    ShopsController.$inject = ['$scope', 'ngTable', 'Shop'];
    function ShopsController($scope, ngTable, Shop) {
      var vm = this;
      
      activate();
      
      function activate() {
        
      }
      
      $scope.filter = {text: ''}
      $scope.tableParams = new ngTableParams({
        count: 10,
        filter: $scope.filter.text
      }, {
        getData: function($defer, params) {
          var opt = {order: 'subscribe_time DESC'}
          opt.limit = params.count()
          opt.skip = (params.page()-1)*opt.limit
          opt.where = {}
          if($scope.filter.text != '') {
            console.log($scope.filter.text);
            // var qs = {like: '%'+$scope.filter.text+'%'};
            var qs = {regex: $scope.filter.text};
            opt.where.or = [{nickname:qs}, {remark:qs}];
            opt.skip = 0;
          }
          Sku.count({where: opt.where}, function (result) {
            $scope.tableParams.total(result.count)
            Sku.find({filter:opt}, $defer.resolve)
          })
        }
      })   
    }
    
    ShopAddController.$inject = ['$scope', 'Shop'];
    function ShopAddController($scope, Shop) {
      activate();
      
      window.ParsleyValidator.setLocale('zh_cn');
      
      function activate() {
        $scope.entity = {
          type: "entity",
          name: "iPhone6S Plus",
          skus: [{barcode:"123", price: 5288, model: "16G"}]
        };
      }
      
      $scope.save = function () {
        
      }
      
      $scope.saveAndMore = function () {
      }
    }    
})();
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.myshop')
        .filter('item_type2', itemTypeFilter2);

    function itemTypeFilter2() {
        var type = {
          entity: "实体商品",
          service: "服务项目"
        }
        return function(key) {
          return type[key];
        }
    }

})();
/**=========================================================
 * Module: demo-notify.js
 * Provides a simple demo for notify
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.notify')
        .controller('NotifyDemoCtrl', NotifyDemoCtrl);

    NotifyDemoCtrl.$inject = ['Notify', '$timeout'];
    function NotifyDemoCtrl(Notify, $timeout) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
          vm.msgHtml = '<em class="fa fa-check"></em> Message with icon..';

          vm.notifyMsg = 'Some messages here..';
          vm.notifyOpts = {
            status: 'danger',
            pos: 'bottom-center'
          };

          // Service usage example
          $timeout(function(){
            
            Notify.alert( 
                'This is a custom message from notify..', 
                {status: 'success'}
            );
          
          }, 500);
        }
    }
})();

/**=========================================================
 * Module: notify.js
 * Directive for notify plugin
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.notify')
        .directive('notify', notify);

    notify.$inject = ['$window', 'Notify'];
    function notify ($window, Notify) {

        var directive = {
            link: link,
            restrict: 'A',
            scope: {
              options: '=',
              message: '='
            }
        };
        return directive;

        function link(scope, element) {

          element.on('click', function (e) {
            e.preventDefault();
            Notify.alert(scope.message, scope.options);
          });
        }

    }

})();


/**=========================================================
 * Module: notify.js
 * Create a notifications that fade out automatically.
 * Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
 =========================================================*/

(function() {
    'use strict';
    angular
        .module('app.notify')
        .service('Notify', Notify);

    Notify.$inject = ['$timeout'];
    function Notify($timeout) {

        this.alert = notifyAlert;

        ////////////////

        function notifyAlert(msg, opts) {
            if ( msg ) {
                $timeout(function(){
                    $.notify(msg, opts || {});
                });
            }
        }
    }

})();

/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */
(function($){
    'use strict';
    var containers = {},
        messages   = {},
        notify     =  function(options){
            if ($.type(options) === 'string') {
                options = { message: options };
            }
            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) === 'string' ? {status:arguments[1]} : arguments[1]);
            }
            return (new Message(options)).show();
        },
        closeAll  = function(group, instantly){
            var id;
            if(group) {
                for(id in messages) { if(group===messages[id].group) messages[id].close(instantly); }
            } else {
                for(id in messages) { messages[id].close(instantly); }
            }
        };
    var Message = function(options){
        // var $this = this;
        this.options = $.extend({}, Message.defaults, options);
        this.uuid    = 'ID'+(new Date().getTime())+'RAND'+(Math.ceil(Math.random() * 100000));
        this.element = $([
            // @geedmo: alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
                '<a class="close">&times;</a>',
                '<div>'+this.options.message+'</div>',
            '</div>'
        ].join('')).data('notifyMessage', this);
        // status
        if (this.options.status) {
            this.element.addClass('alert alert-'+this.options.status);
            this.currentstatus = this.options.status;
        }
        this.group = this.options.group;
        messages[this.uuid] = this;
        if(!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-'+this.options.pos+'"></div>').appendTo('body').on('click', '.uk-notify-message', function(){
                $(this).data('notifyMessage').close();
            });
        }
    };
    $.extend(Message.prototype, {
        uuid: false,
        element: false,
        timout: false,
        currentstatus: '',
        group: false,
        show: function() {
            if (this.element.is(':visible')) return;
            var $this = this;
            containers[this.options.pos].show().prepend(this.element);
            var marginbottom = parseInt(this.element.css('margin-bottom'), 10);
            this.element.css({'opacity':0, 'margin-top': -1*this.element.outerHeight(), 'margin-bottom':0}).animate({'opacity':1, 'margin-top': 0, 'margin-bottom':marginbottom}, function(){
                if ($this.options.timeout) {
                    var closefn = function(){ $this.close(); };
                    $this.timeout = setTimeout(closefn, $this.options.timeout);
                    $this.element.hover(
                        function() { clearTimeout($this.timeout); },
                        function() { $this.timeout = setTimeout(closefn, $this.options.timeout);  }
                    );
                }
            });
            return this;
        },
        close: function(instantly) {
            var $this    = this,
                finalize = function(){
                    $this.element.remove();
                    if(!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }
                    delete messages[$this.uuid];
                };
            if(this.timeout) clearTimeout(this.timeout);
            if(instantly) {
                finalize();
            } else {
                this.element.animate({'opacity':0, 'margin-top': -1* this.element.outerHeight(), 'margin-bottom':0}, function(){
                    finalize();
                });
            }
        },
        content: function(html){
            var container = this.element.find('>div');
            if(!html) {
                return container.html();
            }
            container.html(html);
            return this;
        },
        status: function(status) {
            if(!status) {
                return this.currentstatus;
            }
            this.element.removeClass('alert alert-'+this.currentstatus).addClass('alert alert-'+status);
            this.currentstatus = status;
            return this;
        }
    });
    Message.defaults = {
        message: '',
        status: 'normal',
        timeout: 5000,
        group: null,
        pos: 'top-center'
    };
    
    $.notify          = notify;
    $.notify.message  = Message;
    $.notify.closeAll = closeAll;
    
    return notify;
}(jQuery));

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
                  $rootScope.$broadcast('User.logined');
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

/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('RegisterFormController', RegisterFormController);

    RegisterFormController.$inject = ['$rootScope', '$state', 'User', '$filter'];
    function RegisterFormController($rootScope, $state, User, $filter) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
          // bind here all data from the form
          vm.account = {
            realm: 'merchant',
            role: 'owner'
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
                      $rootScope.$broadcast('User.logined');
                      $state.go('app.dashboard');
                    });
                }, function (error) {
                  vm.authMsg = $filter('register_error')(error.data.error.message);
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

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.pages')
        .filter('register_error', registerErrorFilter)
    ;
    
    function registerErrorFilter() {
        // "The `merchant` instance is not valid. Details: `name` name exist (value: "fankahui")."
      return function (msg) {
        if(/Merchant name exist/.test(msg)) return "商户名字已经存在";
        if(/User already exists/.test(msg)) return "用户名已经存在";
        else return msg;
      }
    }
})();
/**=========================================================
 * Collapse panels * [panel-collapse]
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('panelCollapse', panelCollapse);

    function panelCollapse () {
        var directive = {
            controller: Controller,
            restrict: 'A',
            scope: false
        };
        return directive;
    }

    Controller.$inject = ['$scope', '$element', '$timeout', '$localStorage'];
    function Controller ($scope, $element, $timeout, $localStorage) {
      var storageKeyName = 'panelState';

      // Prepare the panel to be collapsible
      var $elem   = $($element),
          parent  = $elem.closest('.panel'), // find the first parent panel
          panelId = parent.attr('id');

      // Load the saved state if exists
      var currentState = loadPanelState( panelId );
      if ( typeof currentState !== 'undefined') {
        $timeout(function(){
            $scope[panelId] = currentState; },
          10);
      }

      // bind events to switch icons
      $element.bind('click', function(e) {
        e.preventDefault();
        savePanelState( panelId, !$scope[panelId] );

      });
  
      // Controller helpers
      function savePanelState(id, state) {
        if(!id) return false;
        var data = angular.fromJson($localStorage[storageKeyName]);
        if(!data) { data = {}; }
        data[id] = state;
        $localStorage[storageKeyName] = angular.toJson(data);
      }
      function loadPanelState(id) {
        if(!id) return false;
        var data = angular.fromJson($localStorage[storageKeyName]);
        if(data) {
          return data[id];
        }
      }
    }

})();

/**=========================================================
 * Dismiss panels * [panel-dismiss]
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('panelDismiss', panelDismiss);

    function panelDismiss () {

        var directive = {
            controller: Controller,
            restrict: 'A'
        };
        return directive;

    }

    Controller.$inject = ['$scope', '$element', '$q', 'Utils'];
    function Controller ($scope, $element, $q, Utils) {
      var removeEvent   = 'panel-remove',
          removedEvent  = 'panel-removed';

      $element.on('click', function (e) {
        e.preventDefault();

        // find the first parent panel
        var parent = $(this).closest('.panel');

        removeElement();

        function removeElement() {
          var deferred = $q.defer();
          var promise = deferred.promise;
          
          // Communicate event destroying panel
          $scope.$emit(removeEvent, parent.attr('id'), deferred);
          promise.then(destroyMiddleware);
        }

        // Run the animation before destroy the panel
        function destroyMiddleware() {
          if(Utils.support.animation) {
            parent.animo({animation: 'bounceOut'}, destroyPanel);
          }
          else destroyPanel();
        }

        function destroyPanel() {

          var col = parent.parent();
          parent.remove();
          // remove the parent if it is a row and is empty and not a sortable (portlet)
          col
            .filter(function() {
            var el = $(this);
            return (el.is('[class*="col-"]:not(.sortable)') && el.children('*').length === 0);
          }).remove();

          // Communicate event destroyed panel
          $scope.$emit(removedEvent, parent.attr('id'));

        }

      });
    }
})();



/**=========================================================
 * Refresh panels
 * [panel-refresh] * [data-spinner="standard"]
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('panelRefresh', panelRefresh);

    function panelRefresh () {
        var directive = {
            controller: Controller,
            restrict: 'A',
            scope: false
        };
        return directive;

    }

    Controller.$inject = ['$scope', '$element'];
    function Controller ($scope, $element) {
      var refreshEvent   = 'panel-refresh',
          whirlClass     = 'whirl',
          defaultSpinner = 'standard';

      // catch clicks to toggle panel refresh
      $element.on('click', function (e) {
        e.preventDefault();

        var $this   = $(this),
            panel   = $this.parents('.panel').eq(0),
            spinner = $this.data('spinner') || defaultSpinner
            ;

        // start showing the spinner
        panel.addClass(whirlClass + ' ' + spinner);

        // Emit event when refresh clicked
        $scope.$emit(refreshEvent, panel.attr('id'));

      });

      // listen to remove spinner
      $scope.$on('removeSpinner', removeSpinner);

      // method to clear the spinner when done
      function removeSpinner (ev, id) {
        if (!id) return;
        var newid = id.charAt(0) === '#' ? id : ('#'+id);
        angular
          .element(newid)
          .removeClass(whirlClass);
      }
    }
})();



/**=========================================================
 * Module panel-tools.js
 * Directive tools to control panels. 
 * Allows collapse, refresh and dismiss (remove)
 * Saves panel state in browser storage
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('paneltool', paneltool);

    paneltool.$inject = ['$compile', '$timeout'];
    function paneltool ($compile, $timeout) {
        var directive = {
            link: link,
            restrict: 'E',
            scope: false
        };
        return directive;

        function link(scope, element, attrs) {

          var templates = {
            /* jshint multistr: true */
            collapse:'<a href="#" panel-collapse="" uib-tooltip="Collapse Panel" ng-click="{{panelId}} = !{{panelId}}"> \
                        <em ng-show="{{panelId}}" class="fa fa-plus"></em> \
                        <em ng-show="!{{panelId}}" class="fa fa-minus"></em> \
                      </a>',
            dismiss: '<a href="#" panel-dismiss="" uib-tooltip="Close Panel">\
                       <em class="fa fa-times"></em>\
                     </a>',
            refresh: '<a href="#" panel-refresh="" data-spinner="{{spinner}}" uib-tooltip="Refresh Panel">\
                       <em class="fa fa-refresh"></em>\
                     </a>'
          };

          var tools = scope.panelTools || attrs;
      
          $timeout(function() {
            element.html(getTemplate(element, tools )).show();
            $compile(element.contents())(scope);
            
            element.addClass('pull-right');
          });
  
          function getTemplate( elem, attrs ){
            var temp = '';
            attrs = attrs || {};
            if(attrs.toolCollapse)
              temp += templates.collapse.replace(/{{panelId}}/g, (elem.parent().parent().attr('id')) );
            if(attrs.toolDismiss)
              temp += templates.dismiss;
            if(attrs.toolRefresh)
              temp += templates.refresh.replace(/{{spinner}}/g, attrs.toolRefresh);
            return temp;
          }
        }// link
    } 

})();

/**=========================================================
 * Module: demo-panels.js
 * Provides a simple demo for panel actions
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .controller('PanelsCtrl', PanelsCtrl);

    PanelsCtrl.$inject = ['$scope', '$timeout'];
    function PanelsCtrl($scope, $timeout) {

        activate();

        ////////////////

        function activate() {

          // PANEL COLLAPSE EVENTS
          // ----------------------------------- 

          // We can use panel id name for the boolean flag to [un]collapse the panel
          $scope.$watch('panelDemo1',function(newVal){
              
              console.log('panelDemo1 collapsed: ' + newVal);

          });


          // PANEL DISMISS EVENTS
          // ----------------------------------- 

          // Before remove panel
          $scope.$on('panel-remove', function(event, id, deferred){
            
            console.log('Panel #' + id + ' removing');
            
            // Here is obligatory to call the resolve() if we pretend to remove the panel finally
            // Not calling resolve() will NOT remove the panel
            // It's up to your app to decide if panel should be removed or not
            deferred.resolve();
          
          });

          // Panel removed ( only if above was resolved() )
          $scope.$on('panel-removed', function(event, id){

            console.log('Panel #' + id + ' removed');

          });


          // PANEL REFRESH EVENTS
          // ----------------------------------- 

          $scope.$on('panel-refresh', function(event, id) {
            var secs = 3;
            
            console.log('Refreshing during ' + secs +'s #'+id);

            $timeout(function(){
              // directive listen for to remove the spinner 
              // after we end up to perform own operations
              $scope.$broadcast('removeSpinner', id);
              
              console.log('Refreshed #' + id);

            }, 3000);

          });

          // PANELS VIA NG-REPEAT
          // ----------------------------------- 

          $scope.panels = [
            {
              id: 'panelRepeat1',
              title: 'Panel Title 1',
              body: 'Nulla eget lorem leo, sit amet elementum lorem. '
            },
            {
              id: 'panelRepeat2',
              title: 'Panel Title 2',
              body: 'Nulla eget lorem leo, sit amet elementum lorem. '
            },
            {
              id: 'panelRepeat3',
              title: 'Panel Title 3',
              body: 'Nulla eget lorem leo, sit amet elementum lorem. '
            }
          ];
        }

    } //PanelsCtrl

})();


/**=========================================================
 * Drag and drop any panel based on jQueryUI portlets
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('portlet', portlet);

    portlet.$inject = ['$timeout', '$localStorage'];
    function portlet ($timeout, $localStorage) {
      var storageKeyName = 'portletState';

      return {
        restrict: 'A',
        link: link
      };

      /////////////

      function link(scope, element) {
          
        // not compatible with jquery sortable
        if(!$.fn.sortable) return;

        element.sortable({
          connectWith:          '[portlet]', // same like directive 
          items:                'div.panel',
          handle:               '.portlet-handler',
          opacity:              0.7,
          placeholder:          'portlet box-placeholder',
          cancel:               '.portlet-cancel',
          forcePlaceholderSize: true,
          iframeFix:            false,
          tolerance:            'pointer',
          helper:               'original',
          revert:               200,
          forceHelperSize:      true,
          update:               savePortletOrder,
          create:               loadPortletOrder
        });

      }


      function savePortletOrder(event/*, ui*/) {
        var self = event.target;
        var data = angular.fromJson($localStorage[storageKeyName]);
        
        if(!data) { data = {}; }

        data[self.id] = $(self).sortable('toArray');

        if(data) {
          $timeout(function() {
            $localStorage[storageKeyName] = angular.toJson(data);
          });
        }
      }

      function loadPortletOrder(event) {
        var self = event.target;
        var data = angular.fromJson($localStorage[storageKeyName]);

        if(data) {
          
          var porletId = self.id,
              panels   = data[porletId];

          if(panels) {
            var portlet = $('#'+porletId);
            
            $.each(panels, function(index, value) {
               $('#'+value).appendTo(portlet);
            });
          }

        }
      }

    }

})();
 
(function() {
    'use strict';

    angular
        .module('app.preloader')
        .directive('preloader', preloader);

    preloader.$inject = ['$animate', '$timeout', '$q'];
    function preloader ($animate, $timeout, $q) {

        var directive = {
            restrict: 'EAC',
            template: 
              '<div class="preloader-progress">' +
                  '<div class="preloader-progress-bar" ' +
                       'ng-style="{width: loadCounter + \'%\'}"></div>' +
              '</div>'
            ,
            link: link
        };
        return directive;

        ///////

        function link(scope, el) {

          scope.loadCounter = 0;

          var counter  = 0,
              timeout;

          // disables scrollbar
          angular.element('body').css('overflow', 'hidden');
          // ensure class is present for styling
          el.addClass('preloader');

          appReady().then(endCounter);

          timeout = $timeout(startCounter);

          ///////

          function startCounter() {

            var remaining = 100 - counter;
            counter = counter + (0.015 * Math.pow(1 - Math.sqrt(remaining), 2));

            scope.loadCounter = parseInt(counter, 10);

            timeout = $timeout(startCounter, 20);
          }

          function endCounter() {

            $timeout.cancel(timeout);

            scope.loadCounter = 100;

            $timeout(function(){
              // animate preloader hiding
              $animate.addClass(el, 'preloader-hidden');
              // retore scrollbar
              angular.element('body').css('overflow', '');
            }, 300);
          }

          function appReady() {
            var deferred = $q.defer();
            var viewsLoaded = 0;
            // if this doesn't sync with the real app ready
            // a custom event must be used instead
            var off = scope.$on('$viewContentLoaded', function () {
              viewsLoaded ++;
              // we know there are at least two views to be loaded 
              // before the app is ready (1-index.html 2-app*.html)
              if ( viewsLoaded === 2) {
                // with resolve this fires only once
                $timeout(function(){
                  deferred.resolve();
                }, 3000);

                off();
              }

            });

            return deferred.promise;
          }

        } //link
    }

})();
/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.routes')
        .provider('RouteHelpers', RouteHelpersProvider)
        ;

    RouteHelpersProvider.$inject = ['APP_REQUIRES'];
    function RouteHelpersProvider(APP_REQUIRES) {

      /* jshint validthis:true */
      return {
        // provider access level
        basepath: basepath,
        resolveFor: resolveFor,
        // controller access level
        $get: function() {
          return {
            basepath: basepath,
            resolveFor: resolveFor
          };
        }
      };

      // Set here the base of the relative path
      // for all app views
      function basepath(uri) {
        return 'app/views/' + uri;
      }

      // Generates a resolve object by passing script names
      // previously configured in constant.APP_REQUIRES
      function resolveFor() {
        var _args = arguments;
        return {
          deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
            // Creates a promise chain for each argument
            var promise = $q.when(1); // empty promise
            for(var i=0, len=_args.length; i < len; i ++){
              promise = andThen(_args[i]);
            }
            return promise;

            // creates promise to chain dynamically
            function andThen(_arg) {
              // also support a function that returns a promise
              if(typeof _arg === 'function')
                  return promise.then(_arg);
              else
                  return promise.then(function() {
                    // if is a module, pass the name. If not, pass the array
                    var whatToLoad = getRequired(_arg);
                    // simple error check
                    if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                    // finally, return a promise
                    return $ocLL.load( whatToLoad );
                  });
            }
            // check and returns required data
            // analyze module items with the form [name: '', files: []]
            // and also simple array of script files (for not angular js)
            function getRequired(name) {
              if (APP_REQUIRES.modules)
                  for(var m in APP_REQUIRES.modules)
                      if(APP_REQUIRES.modules[m].name && APP_REQUIRES.modules[m].name === name)
                          return APP_REQUIRES.modules[m];
              return APP_REQUIRES.scripts && APP_REQUIRES.scripts[name];
            }

          }]};
      } // resolveFor

    }


})();


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
              resolve: helper.resolveFor('flot-chart','flot-chart-plugins', 'weather-icons')
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


(function() {
    'use strict';

    angular
        .module('app.sales')
        .service('dealService', dealService)
        .service('returnService', returnService)
    ;

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
          self.deal.payment.change = self.deal.fee%$rootScope.user.merchant.changeRate;
          self.deal.payment.amount -= self.deal.payment.change;
          countChange();
        } else if(self.deal.payment.type === 'deposit') {
          self.deal.payment.amount = 0-self.deal.fee;
        } else {
          self.deal.payment.amount = self.deal.fee;
        }
      }
      
      function countChange() {
        if(self.deal.payment.type === 'cash') {
          self.cash = self.cash || {};
          self.cash.paid = self.cash.paid || self.deal.payment.amount;
          self.cash.change = self.deal.payment.amount - self.cash.paid;
        }
      }
            
      function pay() {
        self.deal.status = 'closed';
        delete self.deal.member;
        return Deal.create(self.deal).$promise;
      }
    }

    returnService.$inject = ['Deal', 'Sku', 'ngDialog', '$rootScope'];
    function returnService(Deal, Sku, ngDialog, $rootScope) {
      var self = this;

      this.openReturn = openReturn;
      this.checkout = checkout;
      this.doReturn = doReturn;
      this.count = count;
      
      function openReturn(deal) {
        self.deal = deal;
        self.postData = {
          entities: [],
          totalAmount: 0,
          totalQty: 0,
          status: 'opened',
          created: new Date()
        }
      }
      
      function count() {
        self.postData.totalAmount = 0;
        self.postData.totalQty = 0;
        self.postData.entities.forEach(function (entity) {
          self.postData.totalAmount += entity.qty*entity.sku.price;
          self.postData.totalQty += entity.qty;
        });

        self.postData.discountAmount = 0;
        if(self.deal.member) {
          self.postData.discountAmount = self.postData.totalAmount*(100-self.deal.member.discount)/100;           }
        self.postData.fee = self.postData.totalAmount - self.postData.discountAmount;
        self.postData.payment.amount = self.postData.fee;
        if(self.postData.payment.type === 'cash') {
          self.postData.payment.change = self.postData.fee%$rootScope.user.merchant.changeRate;
          self.postData.payment.amount -= self.postData.payment.change;
        }
      }
      
      function checkout(entity) {
        self.postData.payment = {type: self.deal.payment.type};
        
        var entities = self.deal.entities;
        if(entity) entities = [entity];
        
        self.postData.entities = [];
        entities.forEach(function (entity) {
          var e =  {
            sku: entity.sku,
            qty: entity.qty - entity.returnedQty
          }
          if(e.qty > 0) self.postData.entities.push(e);
        });
        
        count();
        
        return ngDialog.open({ 
          template: 'checkoutReturnDialogId', 
          controller: 'checkoutReturnDialogController'
        }).closePromise;
      }
      
      function doReturn() {
        self.postData.status = 'closed';
        return Deal.returns.create({id: self.deal.id}, self.postData).$promise;
      }
    }
})();

(function() {
    'use strict';

    angular
      .module('app.sales')
      .controller('SellController', SellController)
      .controller('checkoutDialogController', checkoutDialogController)
      .controller('DealsController', DealsController)
      .controller('DealController', DealController)
      .controller('checkoutReturnDialogController', checkoutReturnDialogController)
    ;
      
    SellController.$inject = ['$scope', 'dealService', 'Checkin'];
    function SellController($scope, dealService, Checkin) {
      var vm = this;
            
      activate();
      
      function activate() {
        $scope.dealService = dealService;
        if(!dealService.deal) {
          dealService.openDeal();
        }
        
        // CHECKIN
        // ----------------------------------- 
        vm.checkins = Checkin.find({filter:{
          where: {merchantId: $scope.user.shopId},
          include: [{member: 'wxuser'}],
          limit: 10, 
          order: 'created DESC'
        }});
        
        vm.templateUrl = 'checkinsTemplate.html';
      }
            
    }
    
    checkoutDialogController.$inject = ['$scope', 'ngDialog', 'dealService', 'toaster'];
    function checkoutDialogController($scope, ngDialog, dealService, toaster) {

        activate();

        ////////////////

        function activate() {
          $scope.dealService = dealService;
        }
        
        $scope.confirm = function () {
          dealService.pay().then(function (deal) {
            $scope.submiting = false;
            ngDialog.close();
            dealService.openDeal();
            toaster.pop('success', '成功', "完成交易");
          }, function (err) {
            $scope.submiting = false;
            toaster.pop('error', '失败', "交易未完成，请重试！")
          });
          $scope.submiting = true;
        }
        
    }
    
    DealsController.$inject = ['$scope', 'Deal', 'ngTableParams', 'ngTableLBService'];
    function DealsController($scope, Deal, ngTableParams, ngTableLBService) {
      var vm = this;
      
      activate();
      
      function activate() {
        vm.keyword = "";
        vm.tableParams = new ngTableParams({count: 10}, {
          getData: function($defer, params) {
            var filter = {where:{status:{ne:'deleted'}}, include:[]}
            if(vm.keyword != '') {
              var qs = {regex: keyword};
              filter.where.or = [{"entities.sku.item.name":qs}];
              params.page(1);
            }
            ngTableLBService.getData($defer, params, Deal, filter);
          }
        });
      }
    }
    
    DealController.$inject = ['$scope', 'Deal', 'ngTableParams', 'ngTableLBService', 'returnService'];
    function DealController($scope, Deal, ngTableParams, ngTableLBService, returnService) {
      var vm = this;
      
      activate();
      
      function activate() {
        vm.returnSku = {};
        vm.deal = Deal.findOne({filter:{
          where: {id: $scope.$state.params.dealId},
          include:['returns', 'bonuses']
        }});
        vm.deal.$promise.then(function (deal) {
          vm.deal.entities.forEach(function (entity) {
            entity.returnedQty = 0;
            vm.returnSku[entity.sku.id] = entity;
          });
          if(vm.deal.returns && vm.deal.returns.length > 0) {
            vm.deal.returns.forEach(function (ret) {
              ret.entities.forEach(function (returnEntity) {
                vm.returnSku[returnEntity.sku.id].returnedQty += returnEntity.qty;
              });
            });
            vm.return = vm.deal.returns[0];
          } else {
            vm.return = {entities:[]};
          }
          returnService.openReturn(vm.deal);
        });
      }
      
      vm.goReturn = function (entity) {
        returnService.checkout(entity).then(function (data) {
          activate();
        });
      }
    }

    checkoutReturnDialogController.$inject = ['$scope', 'ngDialog', 'returnService', 'toaster'];
    function checkoutReturnDialogController($scope, ngDialog, returnService, toaster) {

        activate();

        ////////////////

        function activate() {
          $scope.returnService = returnService;
        }
        
        $scope.confirm = function () {
          returnService.doReturn().then(function (ret) {
            $scope.submiting = false;
            ngDialog.close();
            toaster.pop('success', '成功', "完成退款退货");
          }, function (err) {
            $scope.submiting = false;
            toaster.pop('error', '失败', "退款退货未完成，请重试！")
          });
          $scope.submiting = true;
        }
        
    }

})();
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.sales')
        .filter('deal_status', dealStatusFilter)
        .filter('payment_type', paymentTypeFilter)
    ;

    paymentTypeFilter.$inject = ['dealService'];
    function paymentTypeFilter(dealService) {
        return function(key) {
          return dealService.payType[key];
        }
    }

    // dealStatusFilter.$inject = [];
    function dealStatusFilter() {
      var dic = {
        closed: '已完成'
      }
      return function (key) {
        return dic[key];
      }
    }
})();
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
(function() {
    'use strict';

    angular
        .module('app.settings')
        .run(settingsRun);

    settingsRun.$inject = ['$rootScope', '$localStorage'];

    function settingsRun($rootScope, $localStorage){

      // Global Settings
      // ----------------------------------- 
      $rootScope.app = {
        name: '泛卡汇WebPOS',
        description: '在线收银系统',
        year: ((new Date()).getFullYear()),
        layout: {
          isFixed: true,
          isCollapsed: false,
          isBoxed: false,
          isRTL: false,
          horizontal: false,
          isFloat: false,
          asideHover: false,
          theme: "app/css/theme-e.css"
        },
        useFullLayout: false,
        hiddenFooter: false,
        offsidebarOpen: false,
        asideToggled: false,
        viewAnimation: 'ng-fadeInUp'
      };

      // Setup the layout mode
      $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout === 'app-h') ;

      // Restore layout settings
      if( angular.isDefined($localStorage.layout) )
        $rootScope.app.layout = $localStorage.layout;
      else
        $localStorage.layout = $rootScope.app.layout;

      $rootScope.$watch('app.layout', function () {
        $localStorage.layout = $rootScope.app.layout;
      }, true);

      // Close submenu when sidebar change from collapsed to normal
      $rootScope.$watch('app.layout.isCollapsed', function(newValue) {
        if( newValue === false )
          $rootScope.$broadcast('closeSidebarMenu');
      });

    }

})();

/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$rootScope', '$scope', '$state', 'SidebarLoader', 'Utils'];
    function SidebarController($rootScope, $scope, $state, SidebarLoader,  Utils) {

        activate();

        ////////////////

        function activate() {
          var collapseList = [];

          // demo: when switch from collapse to hover, close all items
          $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal){
            if ( newVal === false && oldVal === true) {
              closeAllBut(-1);
            }
          });


          // Load menu from json file
          // ----------------------------------- 

          SidebarLoader.getMenu(sidebarReady);
          
          function sidebarReady(items) {
            $scope.menuItems = items;
          }

          // Handle sidebar and collapse items
          // ----------------------------------
          
          $scope.getMenuItemPropClasses = function(item) {
            return (item.heading ? 'nav-heading' : '') +
                   (isActive(item) ? ' active' : '') ;
          };

          $scope.addCollapse = function($index, item) {
            collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
          };

          $scope.isCollapse = function($index) {
            return (collapseList[$index]);
          };

          $scope.toggleCollapse = function($index, isParentItem) {

            // collapsed sidebar doesn't toggle drodopwn
            if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) return true;

            // make sure the item index exists
            if( angular.isDefined( collapseList[$index] ) ) {
              if ( ! $scope.lastEventFromChild ) {
                collapseList[$index] = !collapseList[$index];
                closeAllBut($index);
              }
            }
            else if ( isParentItem ) {
              closeAllBut(-1);
            }
            
            $scope.lastEventFromChild = isChild($index);

            return true;
          
          };

          // Controller helpers
          // ----------------------------------- 

            // Check item and children active state
            function isActive(item) {

              if(!item) return;

              if( !item.sref || item.sref === '#') {
                var foundActive = false;
                angular.forEach(item.submenu, function(value) {
                  if(isActive(value)) foundActive = true;
                });
                return foundActive;
              }
              else
                return $state.is(item.sref) || $state.includes(item.sref);
            }

            function closeAllBut(index) {
              index += '';
              for(var i in collapseList) {
                if(index < 0 || index.indexOf(i) < 0)
                  collapseList[i] = true;
              }
            }

            function isChild($index) {
              /*jshint -W018*/
              return (typeof $index === 'string') && !($index.indexOf('-') < 0);
            }
        
        } // activate
    }

})();

/**=========================================================
 * Module: sidebar.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .directive('sidebar', sidebar);

    sidebar.$inject = ['$rootScope', '$timeout', '$window', 'Utils'];
    function sidebar ($rootScope, $timeout, $window, Utils) {
        var $win = angular.element($window);
        var directive = {
            // bindToController: true,
            // controller: Controller,
            // controllerAs: 'vm',
            link: link,
            restrict: 'EA',
            template: '<nav class="sidebar" ng-transclude></nav>',
            transclude: true,
            replace: true
            // scope: {}
        };
        return directive;

        function link(scope, element, attrs) {

          var currentState = $rootScope.$state.current.name;
          var $sidebar = element;

          var eventName = Utils.isTouch() ? 'click' : 'mouseenter' ;
          var subNav = $();

          $sidebar.on( eventName, '.nav > li', function() {

            if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) {

              subNav.trigger('mouseleave');
              subNav = toggleMenuItem( $(this), $sidebar);

              // Used to detect click and touch events outside the sidebar          
              sidebarAddBackdrop();

            }

          });

          scope.$on('closeSidebarMenu', function() {
            removeFloatingNav();
          });

          // Normalize state when resize to mobile
          $win.on('resize', function() {
            if( ! Utils.isMobile() )
          	asideToggleOff();
          });

          // Adjustment on route changes
          $rootScope.$on('$stateChangeStart', function(event, toState) {
            currentState = toState.name;
            // Hide sidebar automatically on mobile
            asideToggleOff();

            $rootScope.$broadcast('closeSidebarMenu');
          });

      	  // Autoclose when click outside the sidebar
          if ( angular.isDefined(attrs.sidebarAnyclickClose) ) {
            
            var wrapper = $('.wrapper');
            var sbclickEvent = 'click.sidebar';
            
            $rootScope.$watch('app.asideToggled', watchExternalClicks);

          }

          //////

          function watchExternalClicks(newVal) {
            // if sidebar becomes visible
            if ( newVal === true ) {
              $timeout(function(){ // render after current digest cycle
                wrapper.on(sbclickEvent, function(e){
                  // if not child of sidebar
                  if( ! $(e.target).parents('.aside').length ) {
                    asideToggleOff();
                  }
                });
              });
            }
            else {
              // dettach event
              wrapper.off(sbclickEvent);
            }
          }

          function asideToggleOff() {
            $rootScope.app.asideToggled = false;
            if(!scope.$$phase) scope.$apply(); // anti-pattern but sometimes necessary
      	  }
        }
        
        ///////

        function sidebarAddBackdrop() {
          var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop'} );
          $backdrop.insertAfter('.aside-inner').on('click mouseenter', function () {
            removeFloatingNav();
          });
        }

        // Open the collapse sidebar submenu items when on touch devices 
        // - desktop only opens on hover
        function toggleTouchItem($element){
          $element
            .siblings('li')
            .removeClass('open')
            .end()
            .toggleClass('open');
        }

        // Handles hover to open items under collapsed menu
        // ----------------------------------- 
        function toggleMenuItem($listItem, $sidebar) {

          removeFloatingNav();

          var ul = $listItem.children('ul');
          
          if( !ul.length ) return $();
          if( $listItem.hasClass('open') ) {
            toggleTouchItem($listItem);
            return $();
          }

          var $aside = $('.aside');
          var $asideInner = $('.aside-inner'); // for top offset calculation
          // float aside uses extra padding on aside
          var mar = parseInt( $asideInner.css('padding-top'), 0) + parseInt( $aside.css('padding-top'), 0);
          var subNav = ul.clone().appendTo( $aside );
          
          toggleTouchItem($listItem);

          var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
          var vwHeight = $win.height();

          subNav
            .addClass('nav-floating')
            .css({
              position: $rootScope.app.layout.isFixed ? 'fixed' : 'absolute',
              top:      itemTop,
              bottom:   (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
            });

          subNav.on('mouseleave', function() {
            toggleTouchItem($listItem);
            subNav.remove();
          });

          return subNav;
        }

        function removeFloatingNav() {
          $('.dropdown-backdrop').remove();
          $('.sidebar-subnav.nav-floating').remove();
          $('.sidebar li.open').removeClass('open');
        }
    }


})();


(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);

    SidebarLoader.$inject = ['$http'];
    function SidebarLoader($http) {
        this.getMenu = getMenu;

        ////////////////

        function getMenu(onReady, onError) {
          var menuJson = 'server/sidebar-menu.json',
              menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache
            
          onError = onError || function() { alert('Failure loading menu'); };

          $http
            .get(menuURL)
            .success(onReady)
            .error(onError);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('UserBlockController', UserBlockController);

    UserBlockController.$inject = ['$rootScope'];
    function UserBlockController($rootScope) {

        activate();

        ////////////////

        function activate() {
          $rootScope.user = $rootScope.user || {
            name:     '李明',
            job:      '老板',
            picture:  'app/img/dummy.png'
          };

          // Hides/show user avatar on sidebar
          $rootScope.toggleUserBlock = function(){
            $rootScope.$broadcast('toggleUserBlock');
          };

          $rootScope.userBlockVisible = true;
          
          $rootScope.$on('toggleUserBlock', function(/*event, args*/) {

            $rootScope.userBlockVisible = ! $rootScope.userBlockVisible;
            
          });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.tables')
        .service('ngTableDataService', ngTableDataService);

    function ngTableDataService() {
        /* jshint validthis:true */
        var self = this;
        this.cache = null;
        this.getData = getData;

        ////////////////

        function getData($defer, params, api) {
          // if no cache, request data and filter
          if ( ! self.cache ) {
            if ( api ) {
              api.get(function(data){
                self.cache = data;
                filterdata($defer, params);
              });
            }
          }
          else {
            filterdata($defer, params);
          }
          
          function filterdata($defer, params) {
            var from = (params.page() - 1) * params.count();
            var to = params.page() * params.count();
            var filteredData = self.cache.result.slice(from, to);

            params.total(self.cache.total);
            $defer.resolve(filteredData);
          }

        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.tables')
        .service('ngTableLBService', ngTableLBService);

    function ngTableLBService() {
      var self = this;

      this.getData = getData;

      function getData($defer, params, Model, filter) {
        filter.limit = params.count();
        filter.skip = (params.page()-1)*filter.limit;
        
        Model.count({where: filter.where}, function (result) {
          params.total(result.count);
          Model.find({filter:filter}, $defer.resolve);
        });
      }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.translate')
        .config(translateConfig)
        ;
    translateConfig.$inject = ['$translateProvider'];
    function translateConfig($translateProvider){

      $translateProvider.useStaticFilesLoader({
          prefix : 'app/i18n/',
          suffix : '.json'
      });

      $translateProvider.preferredLanguage('zh_CN');
      $translateProvider.useLocalStorage();
      $translateProvider.usePostCompiling(true);
      $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

    }
})();
(function() {
    'use strict';

    angular
        .module('app.translate')
        .run(translateRun)
        ;
    translateRun.$inject = ['$rootScope', '$translate'];
    
    function translateRun($rootScope, $translate){

      // Internationalization
      // ----------------------

      $rootScope.language = {
        // Handles language dropdown
        listIsOpen: false,
        // list of available languages
        available: {
          'zh_CN':    '中文简体',
          'en':       'English',
          'es_AR':    'Español'
        },
        // display always the current ui language
        init: function () {
          var proposedLanguage = $translate.proposedLanguage() || $translate.use();
          var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
          $rootScope.language.selected = $rootScope.language.available[ (proposedLanguage || preferredLanguage) ];
        },
        set: function (localeId) {
          // Set the new idiom
          $translate.use(localeId);
          // save a reference for the current language
          $rootScope.language.selected = $rootScope.language.available[localeId];
          // finally toggle dropdown
          $rootScope.language.listIsOpen = ! $rootScope.language.listIsOpen;
        }
      };

      $rootScope.language.init();

    }
})();
/**=========================================================
 * Module: animate-enabled.js
 * Enable or disables ngAnimate for element with directive
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('animateEnabled', animateEnabled);

    animateEnabled.$inject = ['$animate'];
    function animateEnabled ($animate) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
          scope.$watch(function () {
            return scope.$eval(attrs.animateEnabled, scope);
          }, function (newValue) {
            $animate.enabled(!!newValue, element);
          });
        }
    }

})();

/**=========================================================
 * Module: browser.js
 * Browser detection
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .service('Browser', Browser);

    Browser.$inject = ['$window'];
    function Browser($window) {
      return $window.jQBrowser;
    }

})();

/**=========================================================
 * Module: clear-storage.js
 * Removes a key from the browser storage via element click
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('resetKey', resetKey);

    resetKey.$inject = ['$state', '$localStorage'];
    function resetKey ($state, $localStorage) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
              resetKey: '@'
            }
        };
        return directive;

        function link(scope, element) {
          element.on('click', function (e) {
              e.preventDefault();

              if(scope.resetKey) {
                delete $localStorage[scope.resetKey];
                $state.go($state.current, {}, {reload: true});
              }
              else {
                $.error('No storage key specified for reset.');
              }
          });
        }
    }

})();

/**=========================================================
 * Module: currency.js
 * Currency format d
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('currency', currency)
        .directive('bonus', bonus);

    currency.$inject = ['$window'];
    function currency($window) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, ngModelController) {
          ngModelController.$parsers.push(function(data) {
            //convert data from view format to model format
            return data*100; //converted
          });

          ngModelController.$formatters.push(function(data) {
            //convert data from model format to view format
            return data/100; //converted
          });
        }
      };
    }
    
    bonus.$inject = ['$window'];
    function bonus($window) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, ngModelController) {
          ngModelController.$parsers.push(function(data) {
            //convert data from view format to model format
            return data/100; //converted
          });

          ngModelController.$formatters.push(function(data) {
            //convert data from model format to view format
            return data*100; //converted
          });
        }
      };
    }

})();

/**=========================================================
 * Module: fullscreen.js
 * Toggle the fullscreen mode on/off
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('toggleFullscreen', toggleFullscreen);

    toggleFullscreen.$inject = ['Browser'];
    function toggleFullscreen (Browser) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          // Not supported under IE
          if( Browser.msie ) {
            element.addClass('hide');
          }
          else {
            element.on('click', function (e) {
                e.preventDefault();

                if (screenfull.enabled) {
                  
                  screenfull.toggle();
                  
                  // Switch icon indicator
                  if(screenfull.isFullscreen)
                    $(this).children('em').removeClass('fa-expand').addClass('fa-compress');
                  else
                    $(this).children('em').removeClass('fa-compress').addClass('fa-expand');

                } else {
                  $.error('Fullscreen not enabled');
                }

            });
          }
        }
    }


})();

/**=========================================================
 * Module: load-css.js
 * Request and load into the current page a css file
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('loadCss', loadCss);

    function loadCss () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
          element.on('click', function (e) {
              if(element.is('a')) e.preventDefault();
              var uri = attrs.loadCss,
                  link;

              if(uri) {
                link = createLink(uri);
                if ( !link ) {
                  $.error('Error creating stylesheet link element.');
                }
              }
              else {
                $.error('No stylesheet location defined.');
              }

          });
        }
        
        function createLink(uri) {
          var linkId = 'autoloaded-stylesheet',
              oldLink = $('#'+linkId).attr('id', linkId + '-old');

          $('head').append($('<link/>').attr({
            'id':   linkId,
            'rel':  'stylesheet',
            'href': uri
          }));

          if( oldLink.length ) {
            oldLink.remove();
          }

          return $('#'+linkId);
        }
    }

})();

/**=========================================================
 * Module: now.js
 * Provides a simple way to display the current time formatted
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('now', now);

    now.$inject = ['dateFilter', '$interval'];
    function now (dateFilter, $interval) {
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attrs) {
          var format = attrs.format;

          function updateTime() {
            var dt = dateFilter(new Date(), format);
            element.text(dt);
          }

          updateTime();
          var intervalPromise = $interval(updateTime, 1000);

          scope.$on('$destroy', function(){
            $interval.cancel(intervalPromise);
          });

        }
    }

})();

/**=========================================================
 * Module: table-checkall.js
 * Tables check all checkbox
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('checkAll', checkAll);

    function checkAll () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          element.on('change', function() {
            var $this = $(this),
                index= $this.index() + 1,
                checkbox = $this.find('input[type="checkbox"]'),
                table = $this.parents('table');
            // Make sure to affect only the correct checkbox column
            table.find('tbody > tr > td:nth-child('+index+') input[type="checkbox"]')
              .prop('checked', checkbox[0].checked);

          });
        }
    }

})();

/**=========================================================
 * Module: trigger-resize.js
 * Triggers a window resize event from any element
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('triggerResize', triggerResize);

    triggerResize.$inject = ['$window', '$timeout'];
    function triggerResize ($window, $timeout) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          element.on('click', function(){
            $timeout(function(){
              $window.dispatchEvent(new Event('resize'));
            });
          });
        }
    }

})();

/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .service('Utils', Utils);

    Utils.$inject = ['$window', 'APP_MEDIAQUERY'];
    function Utils($window, APP_MEDIAQUERY) {

        var $html = angular.element('html'),
            $win  = angular.element($window),
            $body = angular.element('body');

        return {
          // DETECTION
          support: {
            transition: (function() {
                    var transitionEnd = (function() {

                        var element = document.body || document.documentElement,
                            transEndEventNames = {
                                WebkitTransition: 'webkitTransitionEnd',
                                MozTransition: 'transitionend',
                                OTransition: 'oTransitionEnd otransitionend',
                                transition: 'transitionend'
                            }, name;

                        for (name in transEndEventNames) {
                            if (element.style[name] !== undefined) return transEndEventNames[name];
                        }
                    }());

                    return transitionEnd && { end: transitionEnd };
                })(),
            animation: (function() {

                var animationEnd = (function() {

                    var element = document.body || document.documentElement,
                        animEndEventNames = {
                            WebkitAnimation: 'webkitAnimationEnd',
                            MozAnimation: 'animationend',
                            OAnimation: 'oAnimationEnd oanimationend',
                            animation: 'animationend'
                        }, name;

                    for (name in animEndEventNames) {
                        if (element.style[name] !== undefined) return animEndEventNames[name];
                    }
                }());

                return animationEnd && { end: animationEnd };
            })(),
            requestAnimationFrame: window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame ||
                                   window.msRequestAnimationFrame ||
                                   window.oRequestAnimationFrame ||
                                   function(callback){ window.setTimeout(callback, 1000/60); },
            /*jshint -W069*/
            touch: (
                ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
                (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
                (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
                (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
                false
            ),
            mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
          },
          // UTILITIES
          isInView: function(element, options) {
              /*jshint -W106*/
              var $element = $(element);

              if (!$element.is(':visible')) {
                  return false;
              }

              var window_left = $win.scrollLeft(),
                  window_top  = $win.scrollTop(),
                  offset      = $element.offset(),
                  left        = offset.left,
                  top         = offset.top;

              options = $.extend({topoffset:0, leftoffset:0}, options);

              if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                  left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
                return true;
              } else {
                return false;
              }
          },
          
          langdirection: $html.attr('dir') === 'rtl' ? 'right' : 'left',

          isTouch: function () {
            return $html.hasClass('touch');
          },

          isSidebarCollapsed: function () {
            return $body.hasClass('aside-collapsed');
          },

          isSidebarToggled: function () {
            return $body.hasClass('aside-toggled');
          },

          isMobile: function () {
            return $win.width() < APP_MEDIAQUERY.tablet;
          }

        };
    }
})();

(function() {
    'use strict';

    angular
        .module('custom', [
            // request the the entire framework
            'angle',
            // or just modules
            'app.core',
            'app.sidebar'
            /*...*/
        ]);
})();

// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom')
        .controller('Controller', Controller);

    Controller.$inject = ['$log'];
    function Controller($log) {
        // for controllerAs syntax
        // var vm = this;

        activate();

        ////////////////

        function activate() {
          $log.log('I\'m a line from custom.js');
        }
    }
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjaGFydHMvY2hhcnRzLm1vZHVsZS5qcyIsImNvbG9ycy9jb2xvcnMubW9kdWxlLmpzIiwiY29yZS9jb3JlLm1vZHVsZS5qcyIsImNvc3RzL2Nvc3RzLm1vZHVsZS5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmQubW9kdWxlLmpzIiwiZWxlbWVudHMvZWxlbWVudHMubW9kdWxlLmpzIiwiZm9ybXMvZm9ybXMubW9kdWxlLmpzIiwiaXRlbXMvaXRlbXMubW9kdWxlLmpzIiwibGF6eWxvYWQvbGF6eWxvYWQubW9kdWxlLmpzIiwibG9hZGluZ2Jhci9sb2FkaW5nYmFyLm1vZHVsZS5qcyIsImxvY2FsZS9sb2NhbGUubW9kdWxlLmpzIiwibWVtYmVycy9tZW1iZXJzLm1vZHVsZS5qcyIsIm15c2hvcC9teXNob3AubW9kdWxlLmpzIiwibm90aWZ5L25vdGlmeS5tb2R1bGUuanMiLCJwYWdlcy9wYWdlcy5tb2R1bGUuanMiLCJwYW5lbHMvcGFuZWxzLm1vZHVsZS5qcyIsInByZWxvYWRlci9wcmVsb2FkZXIubW9kdWxlLmpzIiwicm91dGVzL3JvdXRlcy5tb2R1bGUuanMiLCJzYWxlcy9zYWxlcy5tb2R1bGUuanMiLCJzZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJzaWRlYmFyL3NpZGViYXIubW9kdWxlLmpzIiwidGFibGVzL3RhYmxlcy5tb2R1bGUuanMiLCJ0cmFuc2xhdGUvdHJhbnNsYXRlLm1vZHVsZS5qcyIsInV0aWxzL3V0aWxzLm1vZHVsZS5qcyIsImNoYXJ0cy9jaGFydGpzLmRpcmVjdGl2ZS5qcyIsImNoYXJ0cy9jbGFzc3lsb2FkZXIuZGlyZWN0aXZlLmpzIiwiY2hhcnRzL2Zsb3QtZGF0YS5zZXJ2aWNlLmpzIiwiY2hhcnRzL2Zsb3QuZGlyZWN0aXZlLmpzIiwiY2hhcnRzL21vcnJpcy5kaXJlY3RpdmUuanMiLCJjaGFydHMvc3BhcmtsaW5lcy5kaXJlY3RpdmUuanMiLCJjb2xvcnMvY29sb3JzLmNvbnRhbnQuanMiLCJjb2xvcnMvY29sb3JzLnNlcnZpY2UuanMiLCJjb3JlL2NvcmUuY29uZmlnLmpzIiwiY29yZS9jb3JlLmNvbnN0YW50cy5qcyIsImNvcmUvY29yZS5maWx0ZXIuanMiLCJjb3JlL2NvcmUucnVuLmpzIiwiY29zdHMvY29zdHMuY29udHJvbGxlci5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmQuY29udHJvbGxlci5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmQuZmlsdGVyLmpzIiwiZWxlbWVudHMvc2Nyb2xsLmRpcmVjdGl2ZS5qcyIsImZvcm1zL2ZpbGVzdHlsZS5kaXJlY3RpdmUuanMiLCJmb3Jtcy9mb3JtLXdpemFyZC5kaXJlY3RpdmUuanMiLCJmb3Jtcy9tYXNrZWQuZGlyZWN0aXZlLmpzIiwiZm9ybXMvcHJvcHMuZmlsdGVyLmpzIiwiZm9ybXMvdGFncy1pbnB1dC5kaXJlY3RpdmUuanMiLCJmb3Jtcy92YWxpZGF0ZS1mb3JtLmRpcmVjdGl2ZS5qcyIsIml0ZW1zL2l0ZW1zLmNvbnRyb2xsZXIuanMiLCJpdGVtcy9pdGVtcy5maWx0ZXIuanMiLCJsYXp5bG9hZC9sYXp5bG9hZC5jb25maWcuanMiLCJsYXp5bG9hZC9sYXp5bG9hZC5jb25zdGFudHMuanMiLCJsb2FkaW5nYmFyL2xvYWRpbmdiYXIuY29uZmlnLmpzIiwibG9hZGluZ2Jhci9sb2FkaW5nYmFyLnJ1bi5qcyIsImxvY2FsZS9sb2NhbGUuY29uZmlnLmpzIiwibG9jYWxlL2xvY2FsZS5jb250cm9sbGVyLmpzIiwibWVtYmVycy9tZW1iZXJzLmNvbnRyb2xsZXIuanMiLCJtZW1iZXJzL21lbWJlcnMuZmlsdGVyLmpzIiwibWVtYmVycy9tZW1iZXJzLnNlcnZpY2UuanMiLCJteXNob3AvbXlzaG9wLmNvbnRyb2xsZXIuanMiLCJteXNob3AvbXlzaG9wLmZpbHRlci5qcyIsIm5vdGlmeS9ub3RpZnkuY29udHJvbGxlci5qcyIsIm5vdGlmeS9ub3RpZnkuZGlyZWN0aXZlLmpzIiwibm90aWZ5L25vdGlmeS5zZXJ2aWNlLmpzIiwicGFnZXMvYWNjZXNzLWxvZ2luLmNvbnRyb2xsZXIuanMiLCJwYWdlcy9hY2Nlc3MtcmVnaXN0ZXIuY29udHJvbGxlci5qcyIsInBhZ2VzL3BhZ2VzLmZpbHRlci5qcyIsInBhbmVscy9wYW5lbC1jb2xsYXBzZS5kaXJlY3RpdmUuanMiLCJwYW5lbHMvcGFuZWwtZGlzbWlzcy5kaXJlY3RpdmUuanMiLCJwYW5lbHMvcGFuZWwtcmVmcmVzaC5kaXJlY3RpdmUuanMiLCJwYW5lbHMvcGFuZWwtdG9vbHMuZGlyZWN0aXZlLmpzIiwicGFuZWxzL3BhbmVscy5jb250cm9sbGVyLmpzIiwicGFuZWxzL3BvcnRsZXQuZGlyZWN0aXZlLmpzIiwicHJlbG9hZGVyL3ByZWxvYWRlci5kaXJlY3RpdmUuanMiLCJyb3V0ZXMvcm91dGUtaGVscGVycy5wcm92aWRlci5qcyIsInJvdXRlcy9yb3V0ZXMuY29uZmlnLmpzIiwic2FsZXMvZGVhbC5zZXJ2aWNlLmpzIiwic2FsZXMvc2FsZXMuY29udHJvbGxlci5qcyIsInNhbGVzL3NhbGVzLmZpbHRlci5qcyIsInNldHRpbmdzL3NldHRpbmcuY29udHJvbGxlci5qcyIsInNldHRpbmdzL3NldHRpbmdzLnJ1bi5qcyIsInNpZGViYXIvc2lkZWJhci5jb250cm9sbGVyLmpzIiwic2lkZWJhci9zaWRlYmFyLmRpcmVjdGl2ZS5qcyIsInNpZGViYXIvc2lkZWJhci5zZXJ2aWNlLmpzIiwic2lkZWJhci9zaWRlYmFyLnVzZXJibG9jay5jb250cm9sbGVyLmpzIiwidGFibGVzL25ndGFibGUtZGF0YS5zZXJ2aWNlLmpzIiwidGFibGVzL25ndGFibGUtbGIuc2VydmljZS5qcyIsInRyYW5zbGF0ZS90cmFuc2xhdGUuY29uZmlnLmpzIiwidHJhbnNsYXRlL3RyYW5zbGF0ZS5ydW4uanMiLCJ1dGlscy9hbmltYXRlLWVuYWJsZWQuZGlyZWN0aXZlLmpzIiwidXRpbHMvYnJvd3Nlci5zZXJ2aWNlLmpzIiwidXRpbHMvY2xlYXItc3RvcmFnZS5kaXJlY3RpdmUuanMiLCJ1dGlscy9jdXJyZW5jeS5kaXJlY3RpdmUuanMiLCJ1dGlscy9mdWxsc2NyZWVuLmRpcmVjdGl2ZS5qcyIsInV0aWxzL2xvYWQtY3NzLmRpcmVjdGl2ZS5qcyIsInV0aWxzL25vdy5kaXJlY3RpdmUuanMiLCJ1dGlscy90YWJsZS1jaGVja2FsbC5kaXJlY3RpdmUuanMiLCJ1dGlscy90cmlnZ2VyLXJlc2l6ZS5kaXJlY3RpdmUuanMiLCJ1dGlscy91dGlscy5zZXJ2aWNlLmpzIiwiY3VzdG9tLm1vZHVsZS5qcyIsImN1c3RvbS5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQWNBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxTQUFBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7Ozs7O0FDeENBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxjQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxjQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxZQUFBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTs7O0FDbEJBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxhQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxpQkFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsZ0JBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGFBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGFBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGdCQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxrQkFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsZUFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsYUFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsaUJBQUE7Ozs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTtZQUNBOzs7QUNMQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsYUFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsZ0JBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGVBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGNBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGlCQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxhQUFBO1VBQ0E7Ozs7Ozs7Ozs7QUNDQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7O1NBRUEsVUFBQSxpQkFBQSxRQUFBO1NBQ0EsVUFBQSxpQkFBQSxRQUFBO1NBQ0EsVUFBQSxpQkFBQSxRQUFBO1NBQ0EsVUFBQSxpQkFBQSxRQUFBO1NBQ0EsVUFBQSxpQkFBQSxRQUFBO1NBQ0EsVUFBQSxpQkFBQSxRQUFBO1NBQ0EsVUFBQSxpQkFBQSxRQUFBOzs7SUFHQSxTQUFBLFFBQUEsTUFBQTtRQUNBLE9BQUEsV0FBQTtZQUNBLE9BQUE7Z0JBQ0EsVUFBQTtnQkFDQSxPQUFBO29CQUNBLE1BQUE7b0JBQ0EsU0FBQTtvQkFDQSxJQUFBO29CQUNBLE9BQUE7b0JBQ0EsUUFBQTtvQkFDQSxRQUFBO29CQUNBLE9BQUE7b0JBQ0EsVUFBQTtvQkFDQSxZQUFBO29CQUNBLFNBQUE7b0JBQ0EsUUFBQTs7Z0JBRUEsTUFBQSxVQUFBLFFBQUEsT0FBQTtvQkFDQSxJQUFBLE1BQUEsTUFBQSxHQUFBLFdBQUE7b0JBQ0EsSUFBQSxXQUFBOztvQkFFQSxPQUFBLE9BQUEsWUFBQTt3QkFDQSxJQUFBLE9BQUEsU0FBQSxHQUFBOzRCQUNBLE1BQUEsTUFBQSxNQUFBLFNBQUE7NEJBQ0EsSUFBQSxPQUFBLFFBQUEsTUFBQTsrQkFDQTs0QkFDQSxJQUFBLE9BQUEsUUFBQSxPQUFBLFNBQUEsSUFBQSxPQUFBOzRCQUNBLFdBQUE7Ozt3QkFHQSxHQUFBLE9BQUEsVUFBQSxFQUFBOzRCQUNBLE1BQUEsT0FBQSxNQUFBLFNBQUE7NEJBQ0EsSUFBQSxPQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUE7K0JBQ0E7NEJBQ0EsSUFBQSxPQUFBLFNBQUEsT0FBQSxVQUFBLElBQUEsT0FBQTs0QkFDQSxXQUFBOzs7O29CQUlBLE9BQUEsT0FBQSxRQUFBLFVBQUEsUUFBQTt3QkFDQSxHQUFBOzRCQUNBLGFBQUE7Ozt3QkFHQSxJQUFBLENBQUEsUUFBQTs0QkFDQTs7d0JBRUEsSUFBQSxPQUFBLE9BQUEsRUFBQSxPQUFBLE9BQUE7O3dCQUVBLEdBQUEsU0FBQTs0QkFDQSxPQUFBOzRCQUNBLFFBQUEsSUFBQSxNQUFBOzs7d0JBR0EsR0FBQSxPQUFBLGNBQUEsT0FBQTs0QkFDQSxPQUFBLFFBQUEsYUFBQTs7d0JBRUEsR0FBQSxPQUFBLGVBQUE7NEJBQ0EsT0FBQSxRQUFBLGFBQUEsT0FBQTs7d0JBRUEsZUFBQSxNQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUE7d0JBQ0EsYUFBQTt3QkFDQSxHQUFBLE9BQUE7NEJBQ0EsUUFBQSxRQUFBLE1BQUEsSUFBQSxTQUFBLE9BQUEsYUFBQTt1QkFDQTs7b0JBRUEsT0FBQSxPQUFBLFdBQUEsVUFBQSxRQUFBO3dCQUNBLElBQUE7NEJBQ0EsYUFBQTt3QkFDQSxHQUFBLFNBQUEsYUFBQSxDQUFBLGFBQUE7NEJBQ0E7d0JBQ0EsR0FBQSxDQUFBLFNBQUEsV0FBQSxVQUFBLGFBQUEsU0FBQSxVQUFBLFNBQUE7NEJBQ0E7d0JBQ0EsSUFBQSxnQkFBQSxhQUFBLFNBQUE7d0JBQ0EsY0FBQTt3QkFDQSxjQUFBLFlBQUEsY0FBQTt3QkFDQSxhQUFBLFlBQUEsQ0FBQTt3QkFDQSxjQUFBO3VCQUNBOztvQkFFQSxPQUFBO29CQUNBLElBQUEsUUFBQSxJQUFBLE1BQUE7b0JBQ0EsSUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2xHQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGdCQUFBOztJQUVBLGFBQUEsVUFBQSxDQUFBLFlBQUEsU0FBQTtJQUNBLFNBQUEsY0FBQSxVQUFBLE9BQUEsU0FBQTtRQUNBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBOztRQUVBLE9BQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsU0FBQTtVQUNBLElBQUEsa0JBQUEsRUFBQTtjQUNBLGtCQUFBOzs7VUFHQSxTQUFBLFVBQUE7O1lBRUEsSUFBQSxXQUFBLEVBQUE7Z0JBQ0EsV0FBQSxTQUFBOzs7WUFHQSxHQUFBLFNBQUE7Y0FDQSxJQUFBLFFBQUEsZ0JBQUE7O2dCQUVBLFVBQUEsT0FBQSxXQUFBO2tCQUNBLGtCQUFBLFVBQUE7OztnQkFHQSxrQkFBQSxVQUFBOzs7Z0JBR0EsWUFBQSxVQUFBOzs7YUFHQTs7VUFFQSxTQUFBLGtCQUFBLFNBQUEsU0FBQTtZQUNBLElBQUEsU0FBQSxDQUFBO1lBQ0EsSUFBQSxFQUFBLFFBQUEsU0FBQTtnQkFDQSxNQUFBLFNBQUEsU0FBQSxDQUFBLFdBQUEsV0FBQTtjQUNBLFlBQUEsU0FBQTs7O1VBR0EsU0FBQSxZQUFBLFNBQUEsU0FBQTtZQUNBLFFBQUEsYUFBQSxTQUFBLFNBQUE7Ozs7Ozs7QUN0REEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxhQUFBOztJQUVBLFVBQUEsVUFBQSxDQUFBO0lBQ0EsU0FBQSxVQUFBLFdBQUE7UUFDQSxLQUFBLE9BQUE7Ozs7UUFJQSxJQUFBLE9BQUE7WUFDQSxLQUFBLEVBQUEsUUFBQSxPQUFBLFNBQUE7O1FBRUEsU0FBQSxLQUFBLFFBQUE7VUFDQSxPQUFBLFVBQUEsUUFBQSxJQUFBLE1BQUE7Ozs7Ozs7Ozs7QUNaQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFFBQUE7O0lBRUEsS0FBQSxVQUFBLENBQUEsU0FBQTtJQUNBLFNBQUEsTUFBQSxPQUFBLFVBQUE7O1FBRUEsSUFBQSxZQUFBO1VBQ0EsVUFBQTtVQUNBLFVBQUE7VUFDQSxPQUFBO1lBQ0EsU0FBQTtZQUNBLFNBQUE7WUFDQSxRQUFBO1lBQ0EsVUFBQTtZQUNBLEtBQUE7O1VBRUEsTUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTtVQUNBLElBQUEsUUFBQSxNQUFBLFVBQUE7VUFDQSxJQUFBLGdCQUFBOztVQUVBLE9BQUE7O1VBRUEsUUFBQSxNQUFBLFNBQUE7VUFDQSxTQUFBLE1BQUEsVUFBQTs7VUFFQSxXQUFBLEVBQUEsUUFBQSxXQUFBO1VBQ0EsU0FBQSxJQUFBO1lBQ0EsT0FBQTtZQUNBLFFBQUE7OztVQUdBLFNBQUEsT0FBQTtZQUNBLElBQUE7WUFDQSxHQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsTUFBQSxTQUFBO1lBQ0EsVUFBQSxFQUFBLEtBQUEsVUFBQSxNQUFBLFNBQUEsTUFBQTtZQUNBLE1BQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxNQUFBLFVBQUE7Y0FDQSxNQUFBLFNBQUEsU0FBQTs7O1lBR0EsT0FBQTs7O1VBR0EsU0FBQSxpQkFBQSxTQUFBO1lBQ0EsSUFBQSxNQUFBO2NBQ0EsS0FBQSxRQUFBO2NBQ0EsS0FBQTtjQUNBLE9BQUEsS0FBQTttQkFDQTtjQUNBLE9BQUE7Y0FDQSxlQUFBLE1BQUE7Y0FDQSxPQUFBOzs7VUFHQSxNQUFBLGlCQUFBLFdB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SUFDQTs7SUFFQTtPQUNBLE9BQUE7T0FDQSxXQUFBLG1CQUFBO09BQ0EsV0FBQSw0QkFBQTtPQUNBLFdBQUEsd0JBQUE7OztJQUdBLGdCQUFBLFVBQUEsQ0FBQSxVQUFBLFFBQUEsaUJBQUEsb0JBQUEsY0FBQTtJQUNBLFNBQUEsZ0JBQUEsUUFBQSxNQUFBLGVBQUEsa0JBQUEsWUFBQSxVQUFBO01BQ0EsSUFBQSxLQUFBOztNQUVBOztNQUVBLEdBQUEsS0FBQTtRQUNBLFNBQUE7VUFDQSxZQUFBO1VBQ0EsU0FBQSxJQUFBO1VBQ0EsU0FBQSxJQUFBLEtBQUEsS0FBQSxFQUFBO1VBQ0EsYUFBQTs7UUFFQSxPQUFBO1VBQ0EsSUFBQSxJQUFBLEtBQUEsU0FBQSxRQUFBO1VBQ0EsTUFBQTs7UUFFQSxLQUFBO1VBQ0EsSUFBQSxJQUFBO1VBQ0EsTUFBQTs7OztNQUlBLFNBQUEsV0FBQTtRQUNBLEdBQUEsY0FBQSxJQUFBLGNBQUEsQ0FBQSxPQUFBLEtBQUE7VUFDQSxTQUFBLFNBQUEsUUFBQSxRQUFBO1lBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQTtjQUNBLE9BQUEsQ0FBQSxHQUFBO2NBQ0EsVUFBQSxDQUFBLFNBQUE7Z0JBQ0EsT0FBQSxHQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUE7Z0JBQ0EsT0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLE1BQUE7OztZQUdBLGlCQUFBLFFBQUEsUUFBQSxRQUFBLE1BQUE7Ozs7OztNQU1BLEdBQUEsU0FBQSxZQUFBO1FBQ0EsU0FBQSxLQUFBO1VBQ0EsVUFBQTtVQUNBLFlBQUE7V0FDQSxhQUFBLEtBQUEsVUFBQSxNQUFBO1VBQ0EsR0FBQSxZQUFBOzs7O01BSUEsR0FBQSxPQUFBLFVBQUEsUUFBQTtRQUNBLE9BQUEsT0FBQTtRQUNBLFNBQUEsS0FBQTtVQUNBLFVBQUE7VUFDQSxZQUFBO1VBQ0EsT0FBQTtXQUNBLGFBQUEsS0FBQSxVQUFBLE1BQUE7VUFDQSxHQUFBLFlBQUE7Ozs7TUFJQSxHQUFBLFNBQUEsVUFBQSxRQUFBO1FBQ0EsV0FBQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0Esa0JBQUE7VUFDQSxvQkFBQTtVQUNBLG1CQUFBO1VBQ0Esa0JBQUE7O1dBRUEsVUFBQSxXQUFBO1VBQ0EsR0FBQSxXQUFBO1lBQ0EsS0FBQSxXQUFBLENBQUEsSUFBQSxPQUFBO1lBQ0EsR0FBQSxZQUFBOzs7Ozs7SUFNQSx5QkFBQSxVQUFBLENBQUEsVUFBQSxnQkFBQTtJQUNBLFNBQUEseUJBQUEsUUFBQSxjQUFBLFlBQUE7TUFDQSxJQUFBLEtBQUE7O01BRUE7O01BRUEsU0FBQSxXQUFBOztRQUVBLEdBQUEsYUFBQSxhQUFBLEtBQUEsQ0FBQSxRQUFBO1VBQ0EsT0FBQTtVQUNBLE9BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQTs7Ozs7TUFLQSxHQUFBLFNBQUE7O01BRUEsU0FBQSxZQUFBLFVBQUE7UUFDQSxXQUFBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxrQkFBQTtVQUNBLG9CQUFBO1VBQ0EsbUJBQUE7VUFDQSxrQkFBQTs7V0FFQTs7O01BR0EsR0FBQSxjQUFBLFVBQUEsVUFBQTtRQUNBLEdBQUEsWUFBQSxZQUFBLElBQUE7VUFDQSxhQUFBLE9BQUEsQ0FBQSxNQUFBLFdBQUEsU0FBQSxLQUFBOzs7O01BSUEsR0FBQSxpQkFBQSxVQUFBLFVBQUE7UUFDQSxhQUFBLDJCQUFBLENBQUEsSUFBQSxTQUFBLEtBQUE7VUFDQSxRQUFBLFNBQUE7VUFDQSxNQUFBLFNBQUE7VUFDQSxNQUFBLFNBQUE7V0FDQSxTQUFBLEtBQUE7OztNQUdBLEdBQUEsaUJBQUEsVUFBQSxVQUFBO1FBQ0EsWUFBQSxVQUFBLFdBQUE7VUFDQSxHQUFBLFdBQUE7WUFDQSxTQUFBLFNBQUE7WUFDQSxHQUFBLGVBQUE7Ozs7O01BS0EsR0FBQSxpQkFBQSxVQUFBLFVBQUEsYUFBQTtRQUNBLEdBQUEsZUFBQSxlQUFBLE1BQUEsU0FBQSxLQUFBLFFBQUEsaUJBQUEsQ0FBQSxHQUFBO1VBQ0EsU0FBQSxLQUFBLEtBQUE7VUFDQSxHQUFBLGVBQUE7Ozs7TUFJQSxHQUFBLG9CQUFBLFVBQUEsVUFBQSxPQUFBOztRQUVBLFlBQUEsVUFBQSxXQUFBO1VBQ0EsR0FBQSxXQUFBO1lBQ0EsU0FBQSxLQUFBLE9BQUEsT0FBQTtZQUNBLEdBQUEsZUFBQTs7Ozs7O0lBTUEscUJBQUEsVUFBQSxDQUFBLFVBQUEsWUFBQSxRQUFBLGNBQUEsZ0JBQUE7SUFDQSxTQUFBLHFCQUFBLFFBQUEsVUFBQSxNQUFBLFlBQUEsY0FBQSxTQUFBOztRQUVBOzs7O1FBSUEsU0FBQSxXQUFBO1VBQ0EsT0FBQSxhQUFBLGFBQUEsS0FBQSxDQUFBLFFBQUE7WUFDQSxPQUFBO1lBQ0EsT0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBOztVQUVBLE9BQUEsT0FBQSxPQUFBLFFBQUE7WUFDQSxVQUFBO1lBQ0EsYUFBQTtZQUNBLFFBQUE7Ozs7UUFJQSxPQUFBLGNBQUEsVUFBQSxHQUFBLEdBQUE7VUFDQSxPQUFBLEtBQUEsV0FBQTtVQUNBLE9BQUEsS0FBQSxjQUFBO1VBQ0EsT0FBQSxjQUFBOzs7UUFHQSxPQUFBLFVBQUEsWUFBQTtVQUNBLEdBQUEsT0FBQSxLQUFBLFdBQUEsR0FBQTtZQUNBOztVQUVBLE9BQUEsT0FBQSxLQUFBO1VBQ0EsT0FBQSxPQUFBLEtBQUE7VUFDQSxPQUFBLE9BQUEsS0FBQTtVQUNBLE9BQUEsT0FBQSxLQUFBO1VBQ0EsS0FBQSxPQUFBLE9BQUEsTUFBQSxTQUFBLEtBQUEsVUFBQSxRQUFBO1lBQ0EsT0FBQSxZQUFBO1lBQ0EsU0FBQTtZQUNBLFFBQUEsSUFBQSxXQUFBLE1BQUE7YUFDQSxVQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUE7WUFDQSxRQUFBLElBQUEsU0FBQSxNQUFBOztVQUVBLE9BQUEsWUFBQTs7Ozs7QUN4TUEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxvQkFBQSxVQUFBLENBQUEsVUFBQSxhQUFBLFlBQUEsV0FBQSxRQUFBO0lBQ0EsU0FBQSxvQkFBQSxRQUFBLFdBQUEsVUFBQSxTQUFBLE1BQUEsU0FBQTtRQUNB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VUFJQSxLQUFBLFNBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxDQUFBLENBQUEsS0FBQSxNQUFBOzs7VUFHQSxLQUFBLFdBQUEsV0FBQTtZQUNBLElBQUEsSUFBQSxLQUFBLEtBQUEsTUFBQTtjQUNBLEtBQUEsTUFBQSxLQUFBOzs7O1VBSUEsS0FBQSxjQUFBLFNBQUEsR0FBQTtZQUNBLEtBQUEsUUFBQTtZQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7O0FDbEVBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsVUFBQTs7SUFFQSxTQUFBLFVBQUE7UUFDQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUE7VUFDQSxJQUFBLFFBQUEsRUFBQTtVQUNBLEdBQUEsRUFBQSxHQUFBO1lBQ0EsTUFBQTs7Ozs7Ozs7Ozs7OztBQ2ZBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLE9BQUEsZUFBQTs7SUFFQSxTQUFBLGNBQUE7UUFDQSxPQUFBOzs7UUFHQSxTQUFBLGFBQUEsT0FBQSxPQUFBO1VBQ0EsSUFBQSxNQUFBOztVQUVBLElBQUEsUUFBQSxRQUFBLFFBQUE7WUFDQSxNQUFBLFFBQUEsU0FBQSxNQUFBO2NBQ0EsSUFBQSxjQUFBOztjQUVBLElBQUEsT0FBQSxPQUFBLEtBQUE7Y0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLEtBQUE7Z0JBQ0EsSUFBQSxPQUFBLEtBQUE7Z0JBQ0EsSUFBQSxPQUFBLE1BQUEsTUFBQTtnQkFDQSxJQUFBLEtBQUEsTUFBQSxXQUFBLGNBQUEsUUFBQSxVQUFBLENBQUEsR0FBQTtrQkFDQSxjQUFBO2tCQUNBOzs7O2NBSUEsSUFBQSxhQUFBO2dCQUNBLElBQUEsS0FBQTs7O2lCQUdBOztZQUVBLE1BQUE7OztVQUdBLE9BQUE7Ozs7Ozs7Ozs7QUN2Q0EsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxhQUFBOztJQUVBLFVBQUEsVUFBQSxDQUFBO0lBQ0EsU0FBQSxXQUFBLFVBQUE7UUFDQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsU0FBQTtZQUNBLFVBQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQTtVQUNBLFFBQUEsR0FBQSx5QkFBQSxVQUFBOzs7WUFHQSxHQUFBLFFBQUEsY0FBQSxRQUFBLFdBQUEsT0FBQTtjQUNBLFFBQUEsZUFBQSxRQUFBLFdBQUEsTUFBQTtjQUNBLFFBQUE7Ozs7VUFJQSxTQUFBLFVBQUE7WUFDQSxRQUFBOzs7Ozs7Ozs7Ozs7QUMzQkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxnQkFBQTs7SUFFQSxTQUFBLGdCQUFBO1FBQ0EsSUFBQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBO1VBQ0EsSUFBQSxRQUFBLEVBQUE7VUFDQSxHQUFBLEVBQUEsR0FBQTtZQUNBLE1BQUE7Ozs7OztBQ3RCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtPQUNBLE9BQUEsYUFBQTtPQUNBLFdBQUEsbUJBQUE7T0FDQSxXQUFBLHlCQUFBO09BQ0EsV0FBQSxvQkFBQTtPQUNBLFdBQUEscUJBQUE7O0lBRUEsZ0JBQUEsVUFBQSxDQUFBLFVBQUEsaUJBQUEsT0FBQSxZQUFBLGNBQUE7SUFDQSxTQUFBLGdCQUFBLFFBQUEsZUFBQSxLQUFBLFVBQUEsWUFBQSxrQkFBQTtNQUNBLElBQUEsS0FBQTs7TUFFQTs7TUFFQSxTQUFBLFdBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLGNBQUEsSUFBQSxjQUFBLENBQUEsT0FBQSxLQUFBO1VBQ0EsU0FBQSxTQUFBLFFBQUEsUUFBQTtZQUNBLElBQUEsU0FBQTtjQUNBLE1BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQTtjQUNBLFFBQUE7Z0JBQ0E7a0JBQ0EsU0FBQTtrQkFDQSxNQUFBLEVBQUEsT0FBQSxDQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUE7Ozs7WUFJQSxHQUFBLEdBQUEsV0FBQSxJQUFBO2NBQ0EsSUFBQSxLQUFBLENBQUEsT0FBQTtjQUNBLE9BQUEsTUFBQSxLQUFBLENBQUEsQ0FBQSxZQUFBLEtBQUEsQ0FBQSxNQUFBO2NBQ0EsT0FBQSxLQUFBOztZQUVBLGlCQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUE7Ozs7O01BS0EsR0FBQSxRQUFBLFVBQUEsS0FBQSxNQUFBO1FBQ0EsU0FBQSxLQUFBO1VBQ0EsVUFBQTtVQUNBLFlBQUE7VUFDQSxNQUFBLENBQUEsS0FBQSxLQUFBLE1BQUE7Ozs7TUFJQSxHQUFBLFNBQUEsVUFBQSxLQUFBO1FBQ0EsV0FBQSxLQUFBO1VBQ0EsT0FBQSxTQUFBLElBQUEsS0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0Esa0JBQUE7VUFDQSxvQkFBQTtVQUNBLG1CQUFBO1VBQ0Esa0JBQUE7VUFDQSxnQkFBQTtZQUNBLFNBQUEsVUFBQTtVQUNBLEdBQUEsV0FBQTtZQUNBLElBQUEsU0FBQTtZQUNBLElBQUEsTUFBQSxZQUFBO2NBQ0EsV0FBQSxLQUFBLE9BQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxTQUFBO2VBQ0EsVUFBQSxLQUFBO2NBQ0EsV0FBQSxLQUFBLE9BQUEsd0JBQUE7Ozs7OztNQU1BLEdBQUEsVUFBQSxVQUFBLEtBQUE7UUFDQSxJQUFBLE1BQUE7UUFDQSxJQUFBLFlBQUEsSUFBQSxZQUFBO1FBQ0EsR0FBQSxXQUFBO1VBQ0EsTUFBQSxVQUFBOztRQUVBLElBQUEsT0FBQSxPQUFBLENBQUEsSUFBQSxJQUFBLEtBQUEsQ0FBQSxNQUFBLGFBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxVQUFBLE1BQUE7VUFDQSxXQUFBLEtBQUEsUUFBQSxPQUFBLElBQUEsS0FBQSxLQUFBLFdBQUE7Ozs7OztJQU1BLGtCQUFBLFVBQUEsQ0FBQSxVQUFBO0lBQ0EsU0FBQSxrQkFBQSxRQUFBLE1BQUE7TUFDQTs7TUFFQSxPQUFBLGlCQUFBLFVBQUE7O01BRUEsU0FBQSxXQUFBO1FBQ0EsT0FBQSxTQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxNQUFBLENBQUEsQ0FBQSxTQUFBLE9BQUEsT0FBQSxRQUFBLE9BQUEsUUFBQSxTQUFBOzs7O01BSUEsT0FBQSxPQUFBLFlBQUE7UUFDQSxLQUFBLE9BQUEsT0FBQSxRQUFBO1NBQ0EsS0FBQSxVQUFBLE1BQUE7VUFDQSxPQUFBLE9BQUEsR0FBQTs7OztNQUlBLE9BQUEsY0FBQSxZQUFBO1FBQ0EsS0FBQSxPQUFBLE9BQUE7Ozs7SUFJQSxzQkFBQSxVQUFBLENBQUEsVUFBQSxZQUFBLFNBQUEsV0FBQTtJQUNBLFNBQUEsc0JBQUEsUUFBQSxVQUFBLE9BQUEsU0FBQSxTQUFBOztRQUVBOzs7O1FBSUEsU0FBQSxXQUFBO1VBQ0EsT0FBQSxXQUFBOzs7UUFHQSxPQUFBLFVBQUEsWUFBQTtVQUNBLElBQUEsTUFBQSxPQUFBLGFBQUE7VUFDQSxJQUFBLE9BQUEsT0FBQSxhQUFBO1VBQ0EsSUFBQSxPQUFBLE9BQUEsYUFBQTtVQUNBLE1BQUEsT0FBQSxDQUFBLE9BQUEsSUFBQSxJQUFBLEtBQUEsT0FBQSxVQUFBLE1BQUEsTUFBQSxNQUFBO1VBQ0EsSUFBQSxZQUFBLEdBQUEsT0FBQSxPQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUEsSUFBQSxXQUFBO1dBQ0EsS0FBQSxRQUFBLGNBQUEsTUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUEsU0FBQTs7OztJQUlBLGlCQUFBLFVBQUEsQ0FBQSxVQUFBLFNBQUE7SUFDQSxTQUFBLGlCQUFBLFFBQUEsT0FBQSxlQUFBO01BQ0EsSUFBQSxLQUFBOztNQUVBOztNQUVBLFNBQUEsU0FBQTtRQUNBLEdBQUEsU0FBQSxDQUFBLE1BQUE7UUFDQSxHQUFBLGNBQUEsSUFBQSxjQUFBO1VBQ0EsT0FBQTtVQUNBLFFBQUEsR0FBQSxPQUFBO1dBQ0E7VUFDQSxTQUFBLFNBQUEsUUFBQSxRQUFBO1lBQ0EsSUFBQSxNQUFBLENBQUEsTUFBQSxJQUFBLFFBQUEsQ0FBQTtZQUNBLElBQUEsUUFBQSxPQUFBO1lBQ0EsSUFBQSxPQUFBLENBQUEsT0FBQSxPQUFBLEdBQUEsSUFBQTtZQUNBLEdBQUEsR0FBQSxPQUFBLFFBQUEsSUFBQTtjQUNBLElBQUEsT0FBQTs7WUFFQSxNQUFBLE1BQUEsQ0FBQSxPQUFBLElBQUEsUUFBQSxVQUFBLFFBQUE7Y0FDQSxHQUFBLFlBQUEsTUFBQSxPQUFBO2NBQ0EsTUFBQSxLQUFBLENBQUEsT0FBQSxNQUFBLE9BQUE7Ozs7Ozs7Ozs7Ozs7OztBQ2pKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxPQUFBLGFBQUE7U0FDQSxPQUFBLGNBQUE7U0FDQSxPQUFBLGdCQUFBOzs7SUFHQSxTQUFBLGlCQUFBO1FBQ0EsSUFBQSxPQUFBO1VBQ0EsUUFBQTtVQUNBLFNBQUE7O1FBRUEsT0FBQSxTQUFBLEtBQUE7VUFDQSxPQUFBLEtBQUE7Ozs7SUFJQSxTQUFBLG9CQUFBO01BQ0EsT0FBQSxVQUFBLEtBQUE7UUFDQSxPQUFBLEtBQUEsSUFBQTs7OztJQUlBLFNBQUEsa0JBQUE7TUFDQSxJQUFBLE9BQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLFFBQUE7UUFDQSxXQUFBO1FBQ0EsVUFBQTs7TUFFQSxPQUFBLFVBQUEsS0FBQTtRQUNBLE1BQUEsT0FBQTtRQUNBLE9BQUEsS0FBQTs7Ozs7QUMzQ0EsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsT0FBQTs7SUFFQSxlQUFBLFVBQUEsQ0FBQSx1QkFBQTtJQUNBLFNBQUEsZUFBQSxxQkFBQSxhQUFBOzs7TUFHQSxvQkFBQSxPQUFBO1FBQ0EsT0FBQTtRQUNBLFFBQUE7UUFDQSxTQUFBLGFBQUE7Ozs7O0FDZEEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsU0FBQSxnQkFBQTs7VUFFQSxTQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7WUFDQSxzQkFBQSxDQUFBO21DQUNBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO21DQUNBO21DQUNBO21DQUNBO21DQUNBO21DQUNBOztZQUVBLHNCQUFBLENBQUE7bUNBQ0E7O1lBRUEsc0JBQUEsQ0FBQTttQ0FDQTttQ0FDQTttQ0FDQTttQ0FDQTttQ0FDQTttQ0FDQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7O1lBRUEsd0JBQUEsQ0FBQTtxQ0FDQTtxQ0FDQTtxQ0FDQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTttQ0FDQTttQ0FDQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7bUNBQ0E7WUFDQSx3QkFBQSxDQUFBO1lBQ0Esd0JBQUEsQ0FBQTs7O1VBR0EsU0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7dURBQ0E7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3VEQUNBO3VEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt1REFDQTt1REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7d0RBQ0E7d0RBQ0E7d0RBQ0E7d0RBQ0E7d0RBQ0E7d0RBQ0E7d0RBQ0E7d0RBQ0E7MkRBQ0EsT0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7d0RBQ0E7d0RBQ0Esd0NBQUEsT0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7d0RBQ0Esd0RBQUEsT0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO3dEQUNBLHlEQUFBLE9BQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTt3REFDQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFB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QUEsSUFBQSxjQUFBO1FBQ0EsT0FBQTtTQUNBO1FBQ0EsU0FBQSxTQUFBLFFBQUEsUUFBQTtVQUNBLElBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQTtVQUNBLElBQUEsUUFBQSxPQUFBO1VBQ0EsSUFBQSxPQUFBLENBQUEsT0FBQSxPQUFBLEdBQUEsSUFBQTtVQUNBLE9BQUEsTUFBQSxNQUFBLENBQUEsSUFBQSxVQUFBLE9BQUEsSUFBQSxRQUFBLFVBQUEsUUFBQTtZQUNBLEdBQUEsZ0JBQUEsTUFBQSxPQUFBOztVQUVBLE9BQUEsTUFBQSxDQUFBLElBQUEsVUFBQSxPQUFBLE1BQUEsT0FBQTs7OztNQUlBLEdBQUEscUJBQUEsSUFBQSxjQUFBO1FBQ0EsT0FBQTtTQUNBO1FBQ0EsU0FBQSxTQUFBLFFBQUEsUUFBQTtVQUNBLElBQUEsTUFBQTtZQUNBLE1BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxZQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsWUFBQSxDQUFBLFVBQUE7WUFDQSxTQUFBLENBQUE7O1VBRUEsSUFBQSxRQUFBLE9BQUE7VUFDQSxJQUFBLE9BQUEsQ0FBQSxPQUFBLE9BQUEsR0FBQSxJQUFBO1VBQ0EsT0FBQSxTQUFBLE1BQUEsQ0FBQSxJQUFBLFVBQUEsT0FBQSxJQUFBLFFBQUEsVUFBQSxRQUFBO1lBQ0EsR0FBQSxtQkFBQSxNQUFBLE9BQUE7O1VBRUEsT0FBQSxTQUFBLENBQUEsSUFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBOzs7O01BSUEsR0FBQSxtQkFBQSxJQUFBLGNBQUE7UUFDQSxPQUFBO1NBQ0E7UUFDQSxTQUFBLFNBQUEsUUFBQSxRQUFBO1VBQ0EsSUFBQSxNQUFBO1lBQ0EsTUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBO1lBQ0EsU0FBQTs7VUFFQSxJQUFBLFFBQUEsT0FBQTtVQUNBLElBQUEsT0FBQSxDQUFBLE9BQUEsT0FBQSxHQUFBLElBQUE7VUFDQSxPQUFBLFFBQUEsTUFBQSxDQUFBLElBQUEsVUFBQSxPQUFBLElBQUEsUUFBQSxVQUFBLFFBQUE7WUFDQSxHQUFBLGlCQUFBLE1BQUEsT0FBQTs7VUFFQSxPQUFBLFFBQUEsQ0FBQSxJQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUE7Ozs7TUFJQTs7TUFFQSxTQUFBLFdBQUE7O1FBRUEsV0FBQSxPQUFBLE9BQUEsT0FBQTs7UUFFQSxHQUFBLFNBQUEsT0FBQSxRQUFBLENBQUEsUUFBQTtVQUNBLE9BQUEsQ0FBQSxJQUFBO1VBQ0EsUUFBQSxDQUFBOzs7UUFHQSxHQUFBLGdCQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsaUJBQUE7OztNQUdBLEdBQUEsT0FBQSxZQUFBO1FBQ0EsWUFBQSxTQUFBLEdBQUE7UUFDQSxPQUFBLE9BQUEsR0FBQTs7O01BR0EsR0FBQSxXQUFBLFlBQUE7UUFDQSxTQUFBLEtBQUE7VUFDQSxVQUFBO1VBQ0EsWUFBQTtXQUNBLGFBQUEsS0FBQSxVQUFBLE1BQUE7VUFDQTs7OztNQUlBLEdBQUEsV0FBQSxZQUFBO1FBQ0EsU0FBQSxLQUFBO1VBQ0EsVUFBQTtVQUNBLFlBQUE7V0FDQSxhQUFBLEtBQUEsVUFBQSxNQUFBO1VBQ0E7Ozs7O0lBS0EseUJBQUEsVUFBQSxDQUFBLFVBQUEsWUFBQSxVQUFBLFdBQUE7SUFDQSxTQUFBLHlCQUFBLFFBQUEsVUFBQSxRQUFBLFNBQUEsYUFBQTs7UUFFQTs7OztRQUlBLElBQUEsV0FBQSxPQUFBLE9BQUEsT0FBQTtRQUNBLFNBQUEsV0FBQTtVQUNBLFdBQUEsT0FBQSxPQUFBLE9BQUE7VUFDQSxPQUFBLFNBQUEsT0FBQSxTQUFBLENBQUEsR0FBQTtVQUNBLE9BQUEsT0FBQTtZQUNBLE1BQUE7WUFDQSxRQUFBO1lBQ0EsVUFBQTs7VUFFQSxPQUFBLFVBQUEsWUFBQTtVQUNBLE9BQUEsT0FBQTtZQUNBLE1BQUE7WUFDQSxRQUFBOzs7O1FBSUEsT0FBQSxrQkFBQSxZQUFBO1VBQ0EsR0FBQSxLQUFBLFNBQUEsUUFBQTtZQUNBLE9BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxTQUFBO1lBQ0EsT0FBQSxLQUFBLFVBQUEsT0FBQSxLQUFBO1lBQ0EsT0FBQTtpQkFDQTtZQUNBLE9BQUEsS0FBQSxPQUFBOzs7O1FBSUEsT0FBQSxjQUFBLFlBQUE7VUFDQSxPQUFBLEtBQUEsUUFBQSxPQUFBLEtBQUE7VUFDQSxPQUFBLEtBQUEsU0FBQSxPQUFBLEtBQUEsU0FBQSxPQUFBLEtBQUE7OztRQUdBLE9BQUEsVUFBQSxZQUFBO1VBQ0EsR0FBQSxPQUFBLEtBQUEsV0FBQSxHQUFBO1lBQ0E7O1VBRUEsT0FBQSxTQUFBLE9BQUEsQ0FBQSxJQUFBLFdBQUEsT0FBQSxNQUFBLFNBQUEsS0FBQSxVQUFBLFFBQUE7WUFDQSxPQUFBLFlBQUE7WUFDQSxTQUFBO1lBQ0EsUUFBQSxJQUFBLFdBQUEsTUFBQTthQUNBLFVBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQTtZQUNBLFFBQUEsSUFBQSxTQUFBLE1BQUE7O1VBRUEsT0FBQSxZQUFBOzs7OztJQUtBLHNCQUFBLFVBQUEsQ0FBQSxVQUFBLFlBQUEsVUFBQTtJQUNBLFNBQUEsc0JBQUEsUUFBQSxVQUFBLFFBQUEsU0FBQTs7UUFFQTs7OztRQUlBLElBQUEsV0FBQSxPQUFBLE9BQUEsT0FBQTtRQUNBLFNBQUEsV0FBQTtVQUNBLFdBQUEsT0FBQSxPQUFBLE9BQUE7VUFDQSxPQUFBLFNBQUEsT0FBQSxTQUFBLENBQUEsR0FBQTtVQUNBLE9BQUEsT0FBQTtZQUNBLFFBQUE7WUFDQSxNQUFBOzs7O1FBSUEsT0FBQSxVQUFBLFlBQUE7VUFDQSxHQUFBLE9BQUEsS0FBQSxXQUFBLEdBQUE7WUFDQTtpQkFDQSxHQUFBLE9BQUEsS0FBQSxTQUFBLEdBQUE7WUFDQSxPQUFBLEtBQUEsT0FBQTtpQkFDQSxHQUFBLE9BQUEsS0FBQSxTQUFBLEdBQUE7WUFDQSxPQUFBLEtBQUEsT0FBQTs7VUFFQSxPQUFBLFFBQUEsT0FBQSxDQUFBLElBQUEsV0FBQSxPQUFBLE1BQUEsU0FBQSxLQUFBLFVBQUEsUUFBQTtZQUNBLE9BQUEsWUFBQTtZQUNBLFNBQUE7WUFDQSxRQUFBLElBQUEsV0FBQSxNQUFBO2FBQ0EsVUFBQSxLQUFB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LElBQUE7VUFDQSxJQUFBLFFBQUE7VUFDQSxHQUFBLE9BQUEsT0FBQSxRQUFBLElBQUE7WUFDQSxRQUFBLElBQUEsT0FBQSxPQUFBOztZQUVBLElBQUEsS0FBQSxDQUFBLE9BQUEsT0FBQSxPQUFBO1lBQ0EsSUFBQSxNQUFBLEtBQUEsQ0FBQSxDQUFBLFNBQUEsS0FBQSxDQUFBLE9BQUE7WUFDQSxJQUFBLE9BQUE7O1VBRUEsSUFBQSxNQUFBLENBQUEsT0FBQSxJQUFBLFFBQUEsVUFBQSxRQUFBO1lBQ0EsT0FBQSxZQUFBLE1BQUEsT0FBQTtZQUNBLElBQUEsS0FBQSxDQUFBLE9BQUEsTUFBQSxPQUFBOzs7Ozs7SUFNQSxrQkFBQSxVQUFBLENBQUEsVUFBQTtJQUNBLFNBQUEsa0JBQUEsUUFBQSxNQUFBO01BQ0E7O01BRUEsT0FBQSxpQkFBQSxVQUFBOztNQUVBLFNBQUEsV0FBQTtRQUNBLE9BQUEsU0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQSxDQUFBLENBQUEsUUFBQSxPQUFBLE9BQUEsTUFBQSxPQUFBOzs7O01BSUEsT0FBQSxPQUFBLFlBQUE7Ozs7TUFJQSxPQUFBLGNBQUEsWUFBQTs7Ozs7Ozs7Ozs7QUNyR0EsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsT0FBQSxjQUFBOztJQUVBLFNBQUEsa0JBQUE7UUFDQSxJQUFBLE9BQUE7VUFDQSxRQUFBO1VBQ0EsU0FBQTs7UUFFQSxPQUFBLFNBQUEsS0FBQTtVQUNBLE9BQUEsS0FBQTs7Ozs7Ozs7O0FDaEJBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7O0lBRUEsZUFBQSxVQUFBLENBQUEsVUFBQTtJQUNBLFNBQUEsZUFBQSxRQUFBLFVBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUE7Ozs7UUFJQSxTQUFBLFdBQUE7VUFDQSxHQUFBLFVBQUE7O1VBRUEsR0FBQSxZQUFBO1VBQ0EsR0FBQSxhQUFBO1lBQ0EsUUFBQTtZQUNBLEtBQUE7Ozs7VUFJQSxTQUFBLFVBQUE7O1lBRUEsT0FBQTtnQkFDQTtnQkFDQSxDQUFBLFFBQUE7OzthQUdBOzs7Ozs7Ozs7O0FDL0JBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsVUFBQTs7SUFFQSxPQUFBLFVBQUEsQ0FBQSxXQUFBO0lBQ0EsU0FBQSxRQUFBLFNBQUEsUUFBQTs7UUFFQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTtZQUNBLE9BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQTs7O1FBR0EsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBOztVQUVBLFFBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQTtZQUNBLEVBQUE7WUFDQSxPQUFBLE1BQUEsTUFBQSxTQUFBLE1BQUE7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCQSxDQUFBLFdBQUE7SUFDQTtJQUNBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsVUFBQTs7SUFFQSxPQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEsT0FBQSxVQUFBOztRQUVBLEtBQUEsUUFBQTs7OztRQUlBLFNBQUEsWUFBQSxLQUFBLE1BQUE7WUFDQSxLQUFBLE1BQUE7Z0JBQ0EsU0FBQSxVQUFBO29CQUNBLEVBQUEsT0FBQSxLQUFBLFFBQUE7Ozs7Ozs7Ozs7Ozs7QUFhQSxDQUFBLFNBQUEsRUFBQTtJQUNBO0lBQ0EsSUFBQSxhQUFBO1FBQ0EsYUFBQTtRQUNBLGNBQUEsU0FBQSxRQUFBO1lBQ0EsSUFBQSxFQUFBLEtBQUEsYUFBQSxVQUFBO2dCQUNBLFVBQUEsRUFBQSxTQUFBOztZQUVBLElBQUEsVUFBQSxJQUFBO2dCQUNBLFVBQUEsRUFBQSxPQUFBLFNBQUEsRUFBQSxLQUFBLFVBQUEsUUFBQSxXQUFBLENBQUEsT0FBQSxVQUFBLE1BQUEsVUFBQTs7WUFFQSxPQUFBLENBQUEsSUFBQSxRQUFBLFVBQUE7O1FBRUEsWUFBQSxTQUFBLE9BQUEsVUFBQTtZQUNBLElBQUE7WUFDQSxHQUFBLE9BQUE7Z0JBQ0EsSUFBQSxNQUFBLFVBQUEsRUFBQSxHQUFBLFFBQUEsU0FBQSxJQUFBLE9BQUEsU0FBQSxJQUFBLE1BQUE7bUJBQ0E7Z0JBQ0EsSUFBQSxNQUFBLFVBQUEsRUFBQSxTQUFBLElBQUEsTUFBQTs7O0lBR0EsSUFBQSxVQUFBLFNBQUEsUUFBQTs7UUFFQSxLQUFBLFVBQUEsRUFBQSxPQUFBLElBQUEsUUFBQSxVQUFBO1FBQ0EsS0FBQSxVQUFBLE1BQUEsSUFBQSxPQUFBLFdBQUEsUUFBQSxLQUFBLEtBQUEsS0FBQSxXQUFBO1FBQ0EsS0FBQSxVQUFBLEVBQUE7O1lBRUE7Z0JBQ0E7Z0JBQ0EsUUFBQSxLQUFBLFFBQUEsUUFBQTtZQUNBO1VBQ0EsS0FBQSxLQUFBLEtBQUEsaUJBQUE7O1FBRUEsSUFBQSxLQUFBLFFBQUEsUUFBQTtZQUNBLEtBQUEsUUFBQSxTQUFBLGVBQUEsS0FBQSxRQUFBO1lBQ0EsS0FBQSxnQkFBQSxLQUFBLFFBQUE7O1FBRUEsS0FBQSxRQUFBLEtBQUEsUUFBQTtRQUNBLFNBQUEsS0FBQSxRQUFBO1FBQ0EsR0FBQSxDQUFBLFdBQUEsS0FBQSxRQUFBLE1BQUE7WUFDQSxXQUFBLEtBQUEsUUFBQSxPQUFBLEVBQUEsbUNBQUEsS0FBQSxRQUFBLElBQUEsWUFBQSxTQUFBLFFBQUEsR0FBQSxTQUFBLHNCQUFBLFVBQUE7Z0JBQ0EsRUFBQSxNQUFBLEtBQUEsaUJBQUE7Ozs7SUFJQSxFQUFBLE9BQUEsUUFBQSxXQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7UUFDQSxRQUFBO1FBQ0EsZUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBLFdBQUE7WUFDQSxJQUFBLEtBQUEsUUFBQSxHQUFBLGFBQUE7WUFDQSxJQUFBLFFBQUE7WUFDQSxXQUFBLEtBQUEsUUFBQSxLQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxlQUFBLFNBQUEsS0FBQSxRQUFBLElBQUEsa0JBQUE7WUFDQSxLQUFBLFFBQUEsSUFBQSxDQUFBLFVBQUEsR0FBQSxjQUFBLENBQUEsRUFBQSxLQUFBLFFBQUEsZUFBQSxnQkFBQSxJQUFBLFFBQUEsQ0FBQSxVQUFBLEdBQUEsY0FBQSxHQUFBLGdCQUFBLGVBQUEsVUFBQTtnQkFDQSxJ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Q0EsVUFBQSxnQkFBQTs7SUFFQSxTQUFBLGdCQUFBO1FBQ0EsSUFBQSxZQUFBO1lBQ0EsWUFBQTtZQUNBLFVBQUE7WUFDQSxPQUFBOztRQUVBLE9BQUE7Ozs7SUFJQSxXQUFBLFVBQUEsQ0FBQSxVQUFBO0lBQ0EsU0FBQSxZQUFBLFFBQUEsVUFBQTtNQUNBLElBQUEsaUJBQUE7VUFDQSxpQkFBQTtVQUNBLGlCQUFBOzs7TUFHQSxTQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUE7UUFDQSxFQUFBOztRQUVBLElBQUEsVUFBQSxFQUFBO1lBQ0EsVUFBQSxNQUFBLFFBQUEsVUFBQSxHQUFBO1lBQ0EsVUFBQSxNQUFBLEtBQUEsY0FBQTs7OztRQUlBLE1BQUEsU0FBQSxhQUFBLE1BQUE7OztRQUdBLE9BQUEsTUFBQSxjQUFBLE1BQUEsS0FBQTs7Ozs7TUFLQSxPQUFBLElBQUEsaUJBQUE7OztNQUdBLFNBQUEsZUFBQSxJQUFBLElBQUE7UUFDQSxJQUFBLENBQUEsSUFBQTtRQUNBLElBQUEsUUFBQSxHQUFBLE9BQUEsT0FBQSxNQUFBLE1BQUEsSUFBQTtRQUNBO1dBQ0EsUUFBQTtXQUNBLFlBQUE7Ozs7Ozs7Ozs7Ozs7O0FDL0NBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsYUFBQTs7SUFFQSxVQUFBLFVBQUEsQ0FBQSxZQUFBO0lBQ0EsU0FBQSxXQUFBLFVBQUEsVUFBQTtRQUNBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBO1lBQ0EsT0FBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTs7VUFFQSxJQUFBLFlBQUE7O1lBRUEsU0FBQTs7OztZQUlBLFNBQUE7OztZQUdBLFNBQUE7Ozs7O1VBS0EsSUFBQSxRQUFBLE1BQUEsY0FBQTs7VUFFQSxTQUFBLFdBQUE7WUFDQSxRQUFBLEtBQUEsWUFBQSxTQUFBLFNBQUE7WUFDQSxTQUFBLFFBQUEsWUFBQTs7WUFFQSxRQUFBLFNBQUE7OztVQUdBLFNBQUEsYUFBQSxNQUFBLE9BQUE7WUFDQSxJQUFBLE9BQUE7WUFDQSxRQUFBLFNBQUE7WUFDQSxHQUFBLE1BQUE7Y0FDQSxRQUFBLFVBQUEsU0FBQSxRQUFBLGlCQUFBLEtBQUEsU0FBQSxTQUFBLEtBQUE7WUFDQSxHQUFBLE1BQUE7Y0FDQSxRQUFBLFVBQUE7WUFDQSxHQUFBLE1BQUE7Y0FDQSxRQUFBLFVBQUEsUUFBQSxRQUFBLGdCQUFBLE1BQUE7WUFDQSxPQUFBOzs7Ozs7Ozs7Ozs7QUNwREEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxjQUFBOztJQUVBLFdBQUEsVUFBQSxDQUFBLFVBQUE7SUFDQSxTQUFBLFdBQUEsUUFBQSxVQUFBOztRQUVBOzs7O1FBSUEsU0FBQSxXQUFBOzs7Ozs7VUFNQSxPQUFBLE9BQUEsYUFBQSxTQUFBLE9BQUE7O2NBRUEsUUFBQSxJQUFBLDJCQUFBOzs7Ozs7Ozs7VUFTQSxPQUFBLElBQUEsZ0JBQUEsU0FBQSxPQUFBLElBQUEsU0FBQTs7WUFFQSxRQUFBLElBQUEsWUFBQSxLQUFBOzs7OztZQUtBLFNBQUE7Ozs7O1VBS0EsT0FBQSxJQUFBLGlCQUFBLFNBQUEsT0FBQSxHQUFBOztZQUVBLFFBQUEsSUFBQSxZQUFBLEtBQUE7Ozs7Ozs7O1VBUUEsT0FBQSxJQUFBLGlCQUFBLFNBQUEsT0FBQSxJQUFBO1lBQ0EsSUFBQSxPQUFBOztZQUVBLFFBQUEsSUFBQSx1QkFBQSxNQUFBLE1BQUE7O1lBRUEsU0FBQSxVQUFBOzs7Y0FHQSxPQUFBLFdBQUEsaUJBQUE7O2NBRUEsUUFBQSxJQUFBLGdCQUFBOztlQUVBOzs7Ozs7O1VBT0EsT0FBQSxTQUFBO1lBQ0E7Y0FDQSxJQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7O1lBRUE7Y0FDQSxJQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7O1lBRUE7Y0FDQSxJQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Ozs7Ozs7Ozs7Ozs7O0FDdkZBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsV0FBQTs7SUFFQSxRQUFBLFVBQUEsQ0FBQSxZQUFBO0lBQ0EsU0FBQSxTQUFBLFVBQUEsZUFBQTtNQUNBLElBQUEsaUJBQUE7O01BRUEsT0FBQTtRQUNBLFVBQUE7UUFDQSxNQUFBOzs7OztNQUtBLFNBQUEsS0FBQSxPQUFBLFNBQUE7OztRQUdBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsVUFBQTs7UUFFQSxRQUFBLFNBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBOzs7Ozs7TUFNQSxTQUFBLGlCQUFBLGVBQUE7UUFDQSxJQUFBLE9BQUEsTUFBQTtRQUNBLElBQUEsT0FBQSxRQUFBLFNBQUEsY0FBQTs7UUFFQSxHQUFBLENBQUEsTUFBQSxFQUFBLE9BQUE7O1FBRUEsS0FBQSxLQUFBLE1BQUEsRUFBQSxNQUFBLFNBQUE7O1FBRUEsR0FBQSxNQUFBO1VBQ0EsU0FBQSxXQUFBO1lBQ0EsY0FBQSxrQkFBQSxRQUFBLE9BQUE7Ozs7O01BS0EsU0FBQSxpQkFBQSxPQUFBO1FBQ0EsSUFBQSxPQUFBLE1BQUE7UUFDQSxJQUFBLE9BQUEsUUFBQSxTQUFBLGNBQUE7O1FBRUEsR0FBQSxNQUFBOztVQUVBLElBQUEsV0FBQSxLQUFBO2NBQ0EsV0FBQSxLQUFBOztVQUVBLEdBQUEsUUFBQTtZQUNBLElBQUEsVUFBQSxFQUFBLElBQUE7O1lBRUEsRUFBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLE9BQUE7ZUFDQSxFQUFBLElBQUEsT0FBQSxTQUFBOzs7Ozs7Ozs7OztBQzNFQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGFBQUE7O0lBRUEsVUFBQSxVQUFBLENBQUEsWUFBQSxZQUFBO0lBQ0EsU0FBQSxXQUFBLFVBQUEsVUFBQSxJQUFBOztRQUVBLElBQUEsWUFBQTtZQUNBLFVBQUE7WUFDQTtjQUNBO2tCQUNB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QUFBO1FBQ0EsTUFBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsUUFBQTs7O01BR0EsU0FBQSxTQUFBLFFBQUE7UUFDQSxLQUFBLE9BQUE7VUFDQSxVQUFBO1VBQ0EsYUFBQTtVQUNBLFVBQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLFNBQUEsSUFBQTs7UUFFQSxLQUFBLGNBQUE7OztNQUdBLFNBQUEsV0FBQSxLQUFBO1FBQ0EsT0FBQSxJQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQSxPQUFBLFFBQUEsT0FBQTtTQUNBLFNBQUEsS0FBQSxVQUFBLE1BQUE7VUFDQSxPQUFBOzs7O01BSUEsU0FBQSxZQUFBO1FBQ0EsR0FBQSxLQUFBLGVBQUEsS0FBQSx1QkFBQSxLQUFBO1VBQ0EsSUFBQSxTQUFBO1VBQ0EsUUFBQSxRQUFBLEtBQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtZQUNBLEdBQUEsRUFBQSxJQUFBLFlBQUEsS0FBQSxZQUFBLFFBQUE7Y0FDQSxFQUFBO2NBQ0EsU0FBQTs7O1VBR0EsR0FBQSxDQUFBLFFBQUE7WUFDQSxTQUFBO2NBQ0EsS0FBQSxLQUFBO2NBQ0EsS0FBQTs7WUFFQSxLQUFBLEtBQUEsU0FBQSxLQUFBOzs7UUFHQSxLQUFBLGNBQUE7OztNQUdBLFNBQUEsY0FBQSxRQUFBLE9BQUE7UUFDQSxPQUFBO1FBQ0EsR0FBQSxPQUFBLFFBQUEsR0FBQTtVQUNBLEtBQUEsS0FBQSxTQUFBLE9BQUEsT0FBQTs7OztNQUlBLFNBQUEsY0FBQTtRQUNBLEtBQUEsS0FBQSxjQUFBO1FBQ0EsS0FBQSxLQUFBLFdBQUE7UUFDQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFVBQUEsVUFBQSxRQUFBO1VBQ0EsS0FBQSxLQUFBLFlBQUEsT0FBQTtVQUNBLEtBQUEsS0FBQSxlQUFBLE9BQUEsSUFBQSxPQUFBLElBQUE7O1FBRUEsT0FBQSxLQUFBLEtBQUE7OztNQUdBLFNBQUEsWUFBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLENBQUEsTUFBQTtRQUNBLEdBQUEsS0FBQSxLQUFBLFFBQUE7VUFDQSxLQUFBLEtBQUEsV0FBQSxLQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUEsS0FBQSxpQkFBQSxLQUFBLEtBQUEsYUFBQSxJQUFBLEtBQUEsS0FBQSxPQUFBLFVBQUE7VUFDQSxHQUFBLFdBQUEsS0FBQSxTQUFBLGdCQUFBO1lBQ0EsS0FBQSxLQUFBLG1CQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsT0FBQSxNQUFBLFdBQUEsS0FBQSxTQUFBOztlQUVBO1VBQ0EsS0FBQSxLQUFBLGlCQUFBOztRQUVBLEtBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxZQUFBLEtBQUEsS0FBQTtRQUNBLEdBQUEsS0FBQSxLQUFBLFFBQUE7VUFDQSxHQUFBLFdBQUEsS0FBQSxTQUFBLGdCQUFBO1lBQ0EsR0FBQSxLQUFBLEtBQUEsbUJBQUEsS0FBQSxLQUFBLEtBQUE7Y0FDQSxLQUFBLEtBQUEsbUJBQUEsS0FBQSxLQUFBOztZQUVBLEtBQUEsS0FBQSxPQUFBLEtBQUEsS0FBQTs7VUFFQSxHQUFBLEtBQUEsS0FBQSxPQUFBLFdBQUEsS0FBQSxLQUFBLEtBQUE7WUFDQSxLQUFBLEtBQUEsUUFBQSxPQUFBOzs7O1FBSUE7O1FBRUEsU0FBQSxLQUFBO1VBQ0EsVUFBQTtVQUNBLFlBQUE7Ozs7TUFJQSxTQUFBLGtCQUFBO1FBQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUE7UUFDQSxHQUFBLEtBQUEsS0FBQSxRQUFBLFNBQUEsUUFBQTtVQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUEsS0FBQSxLQUFBLElBQUEsV0FBQSxLQUFBLFNBQUE7VUFDQSxLQUFBLEtBQUEsUUFBQSxVQUFBLEtBQUEsS0FBQSxRQUFBO1VBQ0E7ZUFDQSxHQUFBLEtBQUEsS0FBQSxRQUFBLFNBQUEsV0FBQTtVQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUEsRUFBQSxLQUFBLEtBQUE7ZUFDQTtVQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUEsS0FBQSxLQUFBOzs7O01BSUEsU0FBQSxjQUFBO1FBQ0EsR0FBQSxLQUFBLEtBQUEsUUFBQSxTQUFBLFFBQUE7VUFDQSxLQUFBLE9BQUEsS0FBQSxRQUFBO1VBQ0EsS0FBQSxLQUFBLE9BQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxLQUFBLFFBQUE7VUFDQSxLQUFBLEtBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxTQUFBLEtBQUEsS0FBQTs7OztNQUlBLFNBQUEsTUFBQTtRQUNBLEtBQUEsS0FBQSxTQUFBO1FBQ0EsT0FBQSxLQUFBLEtBQUE7UUFDQSxPQUFBLEtBQUEsT0FBQSxLQUFBLE1BQUE7Ozs7SUFJQSxjQUFBLFVBQUEsQ0FBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLFNBQUEsY0FBQSxNQUFBLEtBQUEsVUFBQSxZQUFBO01BQ0EsSUFBQSxPQUFBOztNQUVBLEtBQUEsYUFBQTtNQUNBLEtBQUEsV0FBQTtNQUNBLEtBQUEsV0FBQTtNQUNBLEtBQUEsUUFBQTs7TUFFQSxTQUFBLFdBQUEsTUFBQTtRQUNBLEtBQUEsT0FBQTtRQUNBLEtBQUEsV0FBQTtVQUNBLFVBQUE7VUFDQSxhQUFBO1VBQ0EsVUFBQTtVQUNBLFFBQUE7VUFDQSxTQUFBLElBQUE7Ozs7TUFJQSxTQUFBLFFBQUE7UUFDQSxLQUFBLFNBQUEsY0FBQTtRQUNBLEtBQUEsU0FBQSxXQUFBO1FBQ0EsS0FBQSxTQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUE7VUFDQSxLQUFBLFNBQUEsZUFBQSxPQUFBLElBQUEsT0FBQSxJQUFBO1VBQ0EsS0FBQSxTQUFBLFlBQUEsT0FBQTs7O1FBR0EsS0FBQSxTQUFBLGlCQUFBO1FBQ0EsR0FBQSxLQUFBLEtBQUEsUUFBQTtVQUNBLEtBQUEsU0FBQSxpQkFBQSxLQUFBLFNBQUEsYUFBQSxJQUFBLEtBQUEsS0FBQSxPQUFBLFVBQUE7UUFDQSxLQUFBLFNBQUEsTUFBQSxLQUFBLFNBQUEsY0FBQSxLQUFBLFNBQUE7UUFDQSxLQUFBLFNBQUEsUUFBQSxTQUFBLEtBQUEsU0FBQTtRQUNBLEdBQUEsS0FBQSxTQUFBLFFBQUEsU0FBQSxRQUFBO1VBQ0EsS0FBQSxTQUFBLFFBQUEsU0FBQSxLQUFBLFNBQUEsSUFBQSxXQUFBLEtBQUEsU0FBQTtVQUNBLEtBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxTQUFBLFFBQUE7Ozs7TUFJQSxTQUFBLFNBQUEsUUFBQTtRQUNBLEtBQUEsU0FBQSxVQUFBLENBQUEsTUFBQSxLQUFBLEtBQUEsUUFBQTs7UUFFQSxJQUFBLFdBQUEsS0FBQSxLQUFBO1FBQ0EsR0FBQSxRQUFBLFdBQUEsQ0FBQTs7UUFFQSxLQUFBLFNBQUEsV0FBQTtRQUNBLFNBQUEsUUFBQSxVQUFBLFFBQUE7VUFDQSxJQUFBLEtBQUE7WUFDQSxLQUFBLE9BQUE7WUFDQSxLQUFBLE9BQUEsTUFBQSxPQUFBOztVQUVBLEdBQUEsRUFBQSxNQUFBLEdBQUEsS0FBQSxTQUFBLFNBQUEsS0FBQTs7O1FBR0E7O1FBRUEsT0FBQSxTQUFBLEtBQUE7VUFDQSxVQUFBO1VBQ0EsWUFBQTtXQUNBOzs7TUFHQSxTQUFBLFdBQUE7UUFDQSxLQUFBLFNBQUEsU0FBQTtRQUNBLE9BQUEsS0FBQSxRQUFBLE9BQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsVUFBQTs7Ozs7QUNsTkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7T0FDQSxPQUFBO09BQ0EsV0FBQSxrQkFBQTtPQUNBLFdBQUEsNEJBQUE7T0FDQSxXQUFBLG1CQUFBO09BQ0EsV0FBQSxrQkFBQTtPQUNBLFdBQUEsa0NBQUE7OztJQUdBLGVBQUEsVUFBQSxDQUFBLFVBQUEsZUFBQTtJQUNBLFNBQUEsZUFBQSxRQUFBLGFBQUEsU0FBQTtNQUNBLElBQUEsS0FBQTs7TUFFQTs7TUFFQSxTQUFBLFdBQUE7UUFDQSxPQUFBLGNBQUE7UUFDQSxHQUFBLENBQUEsWUFBQSxNQUFBO1VBQ0EsWUFBQTs7Ozs7UUFLQSxHQUFBLFdBQUEsUUFBQSxLQUFBLENBQUEsT0FBQTtVQUNBLE9BQUEsQ0FBQSxZQUFBLE9BQUEsS0FBQTtVQUNBLFNBQUEsQ0FBQSxDQUFBLFFBQUE7VUFDQSxPQUFBO1VBQ0EsT0FBQTs7O1FBR0EsR0FBQSxjQUFBOzs7OztJQUtBLHlCQUFBLFVBQUEsQ0FBQSxVQUFBLFlBQUEs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O01BRUEsT0FBQSxVQUFBLEtBQUE7UUFDQSxPQUFBLElBQUE7Ozs7QUM3QkEsQ0FBQSxZQUFBO0VBQ0E7O0VBRUE7T0FDQSxPQUFBO09BQ0EsV0FBQSxxQkFBQTs7RUFFQSxrQkFBQSxVQUFBLENBQUEsVUFBQSxjQUFBLFlBQUEsUUFBQSxVQUFBO0VBQ0EsU0FBQSxrQkFBQSxRQUFBLFlBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQTtJQUNBLElBQUEsS0FBQTtJQUNBLEdBQUEsV0FBQTtNQUNBLFFBQUE7UUFDQSxZQUFBO1FBQ0EsV0FBQTtRQUNBLFdBQUE7UUFDQSxRQUFBO1FBQ0EsVUFBQTtRQUNBLFFBQUE7O01BRUEsT0FBQTtRQUNBLE1BQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTs7TUFFQSxNQUFBO1FBQ0EsTUFBQTs7TUFFQSxRQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7O01BRUEsU0FBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTs7TUFFQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7O01BRUEsV0FBQTtRQUNBLFFBQUE7UUFDQSxNQUFBO1FBQ0EsT0FBQTtRQUNBLGNBQUE7O01BRUEsUUFBQTtRQUNBLFFBQUE7UUFDQSxRQUFBO1FBQ0EsU0FBQTs7TUFFQSxRQUFBO1FBQ0EsUUFBQTtRQUNBLFNBQUE7UUFDQSxRQUFBO1FBQ0EsUUFBQTs7TUFFQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7O01BRUEsT0FBQTtRQUNBLE9BQUE7O01BRUEsUUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsUUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBOztNQUVBLFFBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFFBQUE7O01BRUEsTUFBQTtRQUNBLE1BQUE7O01BRUEsTUFBQTtRQUNBLE1BQUE7Ozs7SUFJQTs7SUFFQSxTQUFBLFdBQUE7TUFDQSxHQUFBLE9BQUEsU0FBQSxzQkFBQSxDQUFBLElBQUEsT0FBQSxLQUFBLFlBQUEsU0FBQTs7O0lBR0EsR0FBQSxTQUFBLFVBQUEsUUFBQTtNQUNBLElBQUEsUUFBQTtNQUNBLElBQUEsT0FBQSxPQUFBLEtBQUE7TUFDQSxHQUFBLFFBQUE7UUFDQSxPQUFBLE9BQUEsS0FBQTtRQUNBLFFBQUE7O01BRUEsTUFBQSxPQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsS0FBQSxNQUFBLE1BQUEsU0FBQSxRQUFBLFFBQUEsS0FBQTtRQUNBLFFBQUEsSUFBQSxXQUFBLE1BQUE7U0FDQSxTQUFBLE1BQUEsS0FBQTtRQUNBLFFBQUEsSUFBQSxTQUFBLE1BQUE7Ozs7SUFJQSxHQUFBLGlCQUFBLFlBQUE7TUFDQSxJQUFBLFNBQUEsT0FBQSxLQUFBLFNBQUEsZ0JBQUE7TUFDQSxJQUFBLE9BQUEsT0FBQSxTQUFBLEtBQUEsT0FBQSxPQUFBLE9BQUEsTUFBQSxDQUFBLE9BQUEsQ0FBQTtNQUNBLE9BQUEsS0FBQSxDQUFBLE9BQUEsS0FBQSxNQUFBLEdBQUEsT0FBQSxLQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsTUFBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQSxjQUFBLE9BQUEsS0FBQSxTQUFBLGVBQUE7OztJQUdBLEdBQUEsc0JBQUEsWUFBQTtNQUNBLE9BQUEsS0FBQSxTQUFBLGFBQUEsUUFBQSxVQUFBLE9BQUE7UUFDQSxPQUFBLE9BQUE7VUFDQSxPQUFBLENBQUEsV0FBQSxPQUFBLEtBQUEsU0FBQSxJQUFBLFlBQUEsQ0FBQSxLQUFBLE1BQUEsT0FBQSxLQUFBLE1BQUE7V0FDQTtVQUNBLFVBQUEsTUFBQSxVQUFBLE9BQUEsTUFBQTtXQUNBLFNBQUEsT0FBQSxRQUFBLEtBQUE7VUFDQSxRQUFBLElBQUEsV0FBQSxNQUFBO1dBQ0EsU0FBQSxNQUFBLEtBQUE7VUFDQSxRQUFBLElBQUEsU0FBQSxNQUFBOzs7OztJQUtBLEdBQUEsYUFBQSxZQUFBO01BQ0EsR0FBQTtNQUNBLFNBQUEsV0FBQTtRQUNBLElBQUEsR0FBQSxLQUFBO1FBQ0EsT0FBQSxHQUFBLEtBQUE7UUFDQSxXQUFBLEdBQUEsS0FBQTtRQUNBLFVBQUEsT0FBQSxLQUFBLFNBQUE7U0FDQSxV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U0FDQSxRQUFBLGlCQUFBOztJQUVBLGNBQUEsVUFBQSxDQUFBO0lBQ0EsU0FBQSxjQUFBLE9BQUE7UUFDQSxLQUFBLFVBQUE7Ozs7UUFJQSxTQUFBLFFBQUEsU0FBQSxTQUFBO1VBQ0EsSUFBQSxXQUFBO2NBQ0EsV0FBQSxXQUFBLFNBQUEsSUFBQSxPQUFBOztVQUVBLFVBQUEsV0FBQSxXQUFBLEVBQUEsTUFBQTs7VUFFQTthQUNBLElBQUE7YUFDQSxRQUFBO2FBQ0EsTUFBQTs7OztBQ3RCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLG9CQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEsb0JBQUEsWUFBQTs7UUFFQTs7OztRQUlBLFNBQUEsV0FBQTtVQUNBLFdBQUEsT0FBQSxXQUFBLFFBQUE7WUFDQSxVQUFBO1lBQ0EsVUFBQTtZQUNBLFVBQUE7Ozs7VUFJQSxXQUFBLGtCQUFBLFVBQUE7WUFDQSxXQUFBLFdBQUE7OztVQUdBLFdBQUEsbUJBQUE7O1VBRUEsV0FBQSxJQUFBLG1CQUFBLDBCQUFBOztZQUVBLFdBQUEsbUJBQUEsRUFBQSxXQUFBOzs7Ozs7O0FDOUJBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsc0JBQUE7O0lBRUEsU0FBQSxxQkFBQTs7UUFFQSxJQUFBLE9BQUE7UUFDQSxLQUFBLFFBQUE7UUFDQSxLQUFBLFVBQUE7Ozs7UUFJQSxTQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUE7O1VBRUEsS0FBQSxFQUFBLEtBQUEsUUFBQTtZQUNBLEtBQUEsTUFBQTtjQUNBLElBQUEsSUFBQSxTQUFBLEtBQUE7Z0JBQ0EsS0FBQSxRQUFBO2dCQUNBLFdBQUEsUUFBQTs7OztlQUlBO1lBQ0EsV0FBQSxRQUFBOzs7VUFHQSxTQUFBLFdBQUEsUUFBQSxRQUFBO1lBQ0EsSUFBQSxPQUFBLENBQUEsT0FBQSxTQUFBLEtBQUEsT0FBQTtZQUNBLElBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTtZQUNBLElBQUEsZUFBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLE1BQUE7O1lBRUEsT0FBQSxNQUFBLEtBQUEsTUFBQTtZQUNBLE9BQUEsUUFBQTs7Ozs7OztBQ25DQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLG9CQUFBOztJQUVBLFNBQUEsbUJBQUE7TUFDQSxJQUFBLE9BQUE7O01BRUEsS0FBQSxVQUFBOztNQUVBLFNBQUEsUUFBQSxRQUFBLFFBQUEsT0FBQSxRQUFBO1FBQ0EsT0FBQSxRQUFBLE9BQUE7UUFDQSxPQUFBLE9BQUEsQ0FBQSxPQUFBLE9BQUEsR0FBQSxPQUFBOztRQUVBLE1BQUEsTUFBQSxDQUFBLE9BQUEsT0FBQSxRQUFBLFVBQUEsUUFBQTtVQUNBLE9BQUEsTUFBQSxPQUFBO1VBQ0EsTUFBQSxLQUFBLENBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7OztBQ2xCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxPQUFBOztJQUVBLGdCQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEsZ0JBQUEsbUJBQUE7O01BRUEsbUJBQUEscUJBQUE7VUFDQSxTQUFBO1VBQ0EsU0FBQTs7O01BR0EsbUJBQUEsa0JBQUE7TUFDQSxtQkFBQTtNQUNBLG1CQUFBLGlCQUFBO01BQ0EsbUJBQUEseUJBQUE7Ozs7QUNsQkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsSUFBQTs7SUFFQSxhQUFBLFVBQUEsQ0FBQSxjQUFBOztJQUVBLFNBQUEsYUFBQSxZQUFBLFdBQUE7Ozs7O01BS0EsV0FBQSxXQUFBOztRQUVBLFlBQUE7O1FBRUEsV0FBQTtVQUNBLFlBQUE7VUFDQSxZQUFBO1VBQ0EsWUFBQTs7O1FBR0EsTUFBQSxZQUFBO1VBQ0EsSUFBQSxtQkFBQSxXQUFBLHNCQUFBLFdBQUE7VUFDQSxJQUFBLG9CQUFBLFdBQUE7VUFDQSxXQUFBLFNBQUEsV0FBQSxXQUFBLFNBQUEsWUFBQSxvQkFBQTs7UUFFQSxLQUFBLFVBQUEsVUFBQTs7VUFFQSxXQUFBLElBQUE7O1VBRUEsV0FBQSxTQUFBLFdBQUEsV0FBQSxTQUFBLFVBQUE7O1VBRUEsV0FBQSxTQUFBLGFBQUEsRUFBQSxXQUFBLFNBQUE7Ozs7TUFJQSxXQUFBLFNBQUE7Ozs7Ozs7OztBQ2xDQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGtCQUFBOztJQUVBLGVBQUEsVUFBQSxDQUFBO0lBQ0EsU0FBQSxnQkFBQSxVQUFBO1FBQ0EsSUFBQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBLE9BQUE7VUFDQSxNQUFBLE9BQUEsWUFBQTtZQUNBLE9BQUEsTUFBQSxNQUFBLE1BQUEsZ0JBQUE7YUFDQSxVQUFBLFVBQUE7WUFDQSxTQUFBLFFBQUEsQ0FBQSxDQUFBLFVBQUE7Ozs7Ozs7Ozs7OztBQ25CQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFdBQUE7O0lBRUEsUUFBQSxVQUFBLENBQUE7SUFDQSxTQUFBLFFBQUEsU0FBQTtNQUNBLE9BQUEsUUFBQTs7Ozs7Ozs7OztBQ1RBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsWUFBQTs7SUFFQSxTQUFBLFVBQUEsQ0FBQSxVQUFBO0lBQ0EsU0FBQSxVQUFBLFFBQUEsZUFBQTtRQUNBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBO1lBQ0EsT0FBQTtjQUNBLFVBQUE7OztRQUdBLE9BQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsU0FBQTtVQUNBLFFBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQTtjQUNBLEVBQUE7O2NBRUEsR0FBQSxNQUFBLFVBQUE7Z0JBQ0EsT0FBQSxjQUFBLE1BQUE7Z0JBQ0EsT0FBQSxHQUFBLE9BQUEsU0FBQSxJQUFBLENBQUEsUUFBQTs7bUJBRUE7Z0JBQ0EsRUFBQSxNQUFBOzs7Ozs7Ozs7Ozs7O0FDM0JBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsWUFBQTtTQUNBLFVBQUEsU0FBQTs7SUFFQSxTQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEsU0FBQSxTQUFBO01BQ0EsT0FBQTtRQUNBLFNBQUE7UUFDQSxVQUFBO1FBQ0EsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBLG1CQUFBO1VBQ0Esa0JBQUEsU0FBQSxLQUFBLFNBQUEsTUFBQTs7WUFFQSxPQUFBLEtBQUE7OztVQUdBLGtCQUFBLFlBQUEsS0FBQSxTQUFBLE1BQUE7O1lBRUEsT0FBQSxLQUFBOzs7Ozs7SUFNQSxNQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEsTUFBQSxTQUFBO01BQ0EsT0FBQTtRQUNBLFNBQUE7UUFDQSxVQUFBO1FBQ0EsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBLG1CQUFBO1VBQ0Esa0JBQUEsU0FBQSxLQUFBLFNBQUEsTUFBQTs7WUFFQSxPQUFBLEtBQUE7OztVQUdBLGtCQUFBLFlBQUEsS0FBQSxTQUFBLE1BQUE7O1lBRUEsT0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7O0FDeENBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsb0JBQUE7O0lBRUEsaUJBQUEsVUFBQSxDQUFBO0lBQ0EsU0FBQSxrQkFBQSxTQUFBO1FBQ0EsSUFBQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBOztVQUVBLElBQUEsUUFBQSxPQUFBO1lBQ0EsUUFBQSxTQUFBOztlQUVBO1lBQ0EsUUFBQSxHQUFBLFNBQUEsVUFBQSxHQUFBO2dCQUNBLEVBQUE7O2dCQUVBLElBQUEsV0FBQSxTQUFBOztrQkFFQSxXQUFBOzs7a0JBR0EsR0FBQSxXQUFBO29CQUNBLEVBQUEsTUFBQSxTQUFBLE1BQUEsWUFBQSxhQUFBLFNBQUE7O29CQUVBLEVBQUEsTUFBQSxTQUFBLE1BQUEsWUFBQSxlQUFBLFNBQUE7O3VCQUVBO2tCQUNBLEVBQUEsTUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ25DQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7O0lBRUEsU0FBQSxXQUFBO1FBQ0EsSUFBQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBLE9BQUE7VUFDQSxRQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUE7Y0FDQSxHQUFBLFFBQUEsR0FBQSxNQUFBLEVBQUE7Y0FDQSxJQUFBLE1BQUEsTUFBQTtrQkFDQTs7Y0FFQSxHQUFBLEtBQUE7Z0JBQ0EsT0FBQSxXQUFBO2dCQUNBLEtBQUEsQ0FBQSxPQUFBO2tCQUNBLEVBQUEsTUFBQTs7O21CQUdBO2dCQUNBLEVBQUEsTUFBQTs7Ozs7O1FBTUEsU0FBQSxXQUFBLEtBQUE7VUFDQSxJQUFBLFNBQUE7Y0FDQSxVQUFBLEVBQUEsSUFBQSxRQUFBLEtBQUEsTUFBQSxTQUFBOztVQUVBLEVBQUEsUUFBQSxPQUFBLEVBQUEsV0FBQSxLQUFBO1lBQ0EsUUFBQTtZQUNBLFFBQUE7WUFDQSxRQUFBOzs7VUFHQSxJQUFBLFFBQUEsU0FBQTtZQUNBLFFBQUE7OztVQUdBLE9BQUEsRUFBQSxJQUFBOzs7Ozs7Ozs7OztBQy9DQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLE9BQUE7O0lBRUEsSUFBQSxVQUFBLENBQUEsY0FBQTtJQUNBLFNBQUEsS0FBQSxZQUFBLFdBQUE7UUFDQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTtVQUNBLElBQUEsU0FBQSxNQUFBOztVQUVBLFNBQUEsYUFBQTtZQUNBLElBQUEsS0FBQSxXQUFBLElBQUEsUUFBQTtZQUNBLFFBQUEsS0FBQTs7O1VBR0E7VUFDQSxJQUFBLGtCQUFBLFVBQUEsWUFBQTs7VUFFQSxNQUFBLElBQUEsWUFBQSxVQUFBO1lBQ0EsVUFBQSxPQUFBOzs7Ozs7Ozs7Ozs7QUM1QkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxZQUFBOztJQUVBLFNBQUEsWUFBQTtRQUNBLElBQUEsWUFB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Q0EsT0FBQTs7OztVQUlBLGVBQUEsTUFBQSxLQUFBLFdBQUEsUUFBQSxVQUFBOztVQUVBLFNBQUEsWUFBQTtZQUNBLE9BQUEsTUFBQSxTQUFBOzs7VUFHQSxvQkFBQSxZQUFBO1lBQ0EsT0FBQSxNQUFBLFNBQUE7OztVQUdBLGtCQUFBLFlBQUE7WUFDQSxPQUFBLE1BQUEsU0FBQTs7O1VBR0EsVUFBQSxZQUFBO1lBQ0EsT0FBQSxLQUFBLFVBQUEsZUFBQTs7Ozs7OztBQ25IQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsVUFBQTs7WUFFQTs7WUFFQTtZQUNBOzs7Ozs7Ozs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLGNBQUE7O0lBRUEsV0FBQSxVQUFBLENBQUE7SUFDQSxTQUFBLFdBQUEsTUFBQTs7OztRQUlBOzs7O1FBSUEsU0FBQSxXQUFBO1VBQ0EsS0FBQSxJQUFBOzs7O0FBSUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiAqIFxyXG4gKiBBbmdsZSAtIEJvb3RzdHJhcCBBZG1pbiBBcHAgKyBBbmd1bGFySlNcclxuICogXHJcbiAqIFZlcnNpb246IDMuMS4wXHJcbiAqIEF1dGhvcjogQHRoZW1pY29uX2NvXHJcbiAqIFdlYnNpdGU6IGh0dHA6Ly90aGVtaWNvbi5jb1xyXG4gKiBMaWNlbnNlOiBodHRwczovL3dyYXBib290c3RyYXAuY29tL2hlbHAvbGljZW5zZXNcclxuICogXHJcbiAqL1xyXG5cclxuLy8gQVBQIFNUQVJUXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhbmdsZScsIFtcclxuICAgICAgICAgICAgJ2FwcC5jb3JlJyxcclxuICAgICAgICAgICAgJ2FwcC5yb3V0ZXMnLFxyXG4gICAgICAgICAgICAnYXBwLnNpZGViYXInLFxyXG4gICAgICAgICAgICAnYXBwLnByZWxvYWRlcicsXHJcbiAgICAgICAgICAgICdhcHAubG9hZGluZ2JhcicsXHJcbiAgICAgICAgICAgICdhcHAudHJhbnNsYXRlJyxcclxuICAgICAgICAgICAgJ2FwcC5zZXR0aW5ncycsXHJcbiAgICAgICAgICAgICdhcHAuZGFzaGJvYXJkJyxcclxuICAgICAgICAgICAgJ2FwcC5ub3RpZnknLFxyXG4gICAgICAgICAgICAnYXBwLmVsZW1lbnRzJyxcclxuICAgICAgICAgICAgJ2FwcC5wYW5lbHMnLFxyXG4gICAgICAgICAgICAnYXBwLmNoYXJ0cycsXHJcbiAgICAgICAgICAgICdhcHAuZm9ybXMnLFxyXG4gICAgICAgICAgICAnYXBwLmxvY2FsZScsXHJcbiAgICAgICAgICAgICdhcHAucGFnZXMnLFxyXG4gICAgICAgICAgICAnYXBwLnRhYmxlcycsXHJcbiAgICAgICAgICAgICdhcHAudXRpbHMnLFxyXG4gICAgICAgICAgICAnYXBwLml0ZW1zJyxcclxuICAgICAgICAgICAgJ2FwcC5teXNob3AnLFxyXG4gICAgICAgICAgICAnYXBwLnNhbGVzJyxcclxuICAgICAgICAgICAgJ2FwcC5tZW1iZXJzJyxcclxuICAgICAgICAgICAgJ2FwcC5jb3N0cydcclxuICAgICAgICBdKTtcclxufSkoKTtcclxuXHJcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNoYXJ0cycsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb2xvcnMnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuY29yZScsIFtcclxuICAgICAgICAgICAgJ25nUm91dGUnLFxyXG4gICAgICAgICAgICAnbmdBbmltYXRlJyxcclxuICAgICAgICAgICAgJ25nU3RvcmFnZScsXHJcbiAgICAgICAgICAgICduZ0Nvb2tpZXMnLFxyXG4gICAgICAgICAgICAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZScsXHJcbiAgICAgICAgICAgICd1aS5ib290c3RyYXAnLFxyXG4gICAgICAgICAgICAndWkucm91dGVyJyxcclxuICAgICAgICAgICAgJ29jLmxhenlMb2FkJyxcclxuICAgICAgICAgICAgJ2NmcC5sb2FkaW5nQmFyJyxcclxuICAgICAgICAgICAgJ25nU2FuaXRpemUnLFxyXG4gICAgICAgICAgICAnbmdSZXNvdXJjZScsXHJcbiAgICAgICAgICAgICd0bWguZHluYW1pY0xvY2FsZScsXHJcbiAgICAgICAgICAgICd1aS51dGlscycsXHJcbiAgICAgICAgICAgICdsYlNlcnZpY2VzJ1xyXG4gICAgICAgIF0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb3N0cycsIFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuZGFzaGJvYXJkJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmVsZW1lbnRzJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZvcm1zJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5pdGVtcycsIFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubGF6eWxvYWQnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubG9hZGluZ2JhcicsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sb2NhbGUnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm1lbWJlcnMnLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5teXNob3AnLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm5vdGlmeScsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYWdlcycsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYW5lbHMnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucHJlbG9hZGVyJywgW10pO1xyXG59KSgpO1xyXG5cclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm91dGVzJywgW1xyXG4gICAgICAgICAgICAnYXBwLmxhenlsb2FkJ1xyXG4gICAgICAgIF0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5zYWxlcycsIFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuc2V0dGluZ3MnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuc2lkZWJhcicsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWJsZXMnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudHJhbnNsYXRlJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnV0aWxzJywgW1xyXG4gICAgICAgICAgJ2FwcC5jb2xvcnMnXHJcbiAgICAgICAgXSk7XHJcbn0pKCk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IGNoYXJ0LmpzXHJcbiAqIFdyYXBwZXIgZGlyZWN0aXZlIGZvciBjaGFydEpTLiBcclxuICogQmFzZWQgb24gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vQW5kcmVhc0hlaWJlcmcvOTgzNzg2OFxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNoYXJ0cycpXHJcbiAgICAgICAgLyogQWxpYXNlcyBmb3IgdmFyaW91cyBjaGFydCB0eXBlcyAqL1xyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2xpbmVjaGFydCcsICAgICBjaGFydEpTKCdMaW5lJykgICAgICApXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnYmFyY2hhcnQnLCAgICAgIGNoYXJ0SlMoJ0JhcicpICAgICAgIClcclxuICAgICAgICAuZGlyZWN0aXZlKCdyYWRhcmNoYXJ0JywgICAgY2hhcnRKUygnUmFkYXInKSAgICAgKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BvbGFyY2hhcnQnLCAgICBjaGFydEpTKCdQb2xhckFyZWEnKSApXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGllY2hhcnQnLCAgICAgIGNoYXJ0SlMoJ1BpZScpICAgICAgIClcclxuICAgICAgICAuZGlyZWN0aXZlKCdkb3VnaG51dGNoYXJ0JywgY2hhcnRKUygnRG91Z2hudXQnKSAgKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2RvbnV0Y2hhcnQnLCAgICBjaGFydEpTKCdEb3VnaG51dCcpICApXHJcbiAgICAgICAgO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNoYXJ0SlModHlwZSkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICc9JyxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiAnPScsXHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdAJyxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJz0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJz0nLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZTogJz0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiAnQCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6ICdAJyxcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zaXZlOiAnPScsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDogJz0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZDogJz0nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgJGVsZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3R4ID0gJGVsZW1bMF0uZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXV0b3NpemUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUud2lkdGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW0ud2lkdGgoJGVsZW0ucGFyZW50KCkud2lkdGgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguY2FudmFzLndpZHRoID0gJGVsZW0ud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5jYW52YXMud2lkdGggPSAkc2NvcGUud2lkdGggfHwgY3R4LmNhbnZhcy53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9zaXplID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLmhlaWdodCA8PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtLmhlaWdodCgkZWxlbS5wYXJlbnQoKS5oZWlnaHQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguY2FudmFzLmhlaWdodCA9IGN0eC5jYW52YXMud2lkdGggLyAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmNhbnZhcy5oZWlnaHQgPSAkc2NvcGUuaGVpZ2h0IHx8IGN0eC5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b3NpemUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2hhcnRDcmVhdGVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDcmVhdGVkLmRlc3Ryb3koKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGRhdGEgbm90IGRlZmluZWQsIGV4aXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFuZXdWYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmNoYXJ0KSB7IHR5cGUgPSAkc2NvcGUuY2hhcnQ7IH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGF1dG9zaXplKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydCA9IG5ldyBDaGFydChjdHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUucmVzcG9uc2l2ZSB8fCAkc2NvcGUucmVzaXplKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnMucmVzcG9uc2l2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUucmVzcG9uc2l2ZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnMucmVzcG9uc2l2ZSA9ICRzY29wZS5yZXNwb25zaXZlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDcmVhdGVkID0gY2hhcnRbdHlwZV0oJHNjb3BlLmRhdGEsICRzY29wZS5vcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDcmVhdGVkLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUubGVnZW5kKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCRlbGVtWzBdKS5wYXJlbnQoKS5hZnRlciggY2hhcnRDcmVhdGVkLmdlbmVyYXRlTGVnZW5kKCkgKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgndG9vbHRpcCcsIGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q3JlYXRlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q3JlYXRlZC5kcmF3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG5ld1ZhbD09PXVuZGVmaW5lZCB8fCAhY2hhcnRDcmVhdGVkLnNlZ21lbnRzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighaXNGaW5pdGUobmV3VmFsKSB8fCBuZXdWYWwgPj0gY2hhcnRDcmVhdGVkLnNlZ21lbnRzLmxlbmd0aCB8fCBuZXdWYWwgPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZlU2VnbWVudCA9IGNoYXJ0Q3JlYXRlZC5zZWdtZW50c1tuZXdWYWxdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVTZWdtZW50LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU2VnbWVudC5maWxsQ29sb3IgPSBhY3RpdmVTZWdtZW50LmhpZ2hsaWdodENvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENyZWF0ZWQuc2hvd1Rvb2x0aXAoW2FjdGl2ZVNlZ21lbnRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU2VnbWVudC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoYXJ0ID0gbmV3IENoYXJ0KGN0eCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoYXJ0Q3JlYXRlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuXHJcblxyXG5cclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogY2xhc3N5LWxvYWRlci5qc1xyXG4gKiBFbmFibGUgdXNlIG9mIGNsYXNzeWxvYWRlciBkaXJlY3RseSBmcm9tIGRhdGEgYXR0cmlidXRlc1xyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNoYXJ0cycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnY2xhc3N5bG9hZGVyJywgY2xhc3N5bG9hZGVyKTtcclxuXHJcbiAgICBjbGFzc3lsb2FkZXIuJGluamVjdCA9IFsnJHRpbWVvdXQnLCAnVXRpbHMnLCAnJHdpbmRvdyddO1xyXG4gICAgZnVuY3Rpb24gY2xhc3N5bG9hZGVyICgkdGltZW91dCwgVXRpbHMsICR3aW5kb3cpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICB2YXIgJHNjcm9sbGVyICAgICAgID0gJCgkd2luZG93KSxcclxuICAgICAgICAgICAgICBpblZpZXdGbGFnQ2xhc3MgPSAnanMtaXMtaW4tdmlldyc7IC8vIGEgY2xhc3NuYW1lIHRvIGRldGVjdCB3aGVuIGEgY2hhcnQgaGFzIGJlZW4gdHJpZ2dlcmVkIGFmdGVyIHNjcm9sbFxyXG5cclxuICAgICAgICAgIC8vIHJ1biBhZnRlciBpbnRlcnBvbGF0aW9uICBcclxuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgIFxyXG4gICAgICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyAgPSAkZWxlbWVudC5kYXRhKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBBdCBsZWFzZSB3ZSBuZWVkIGEgZGF0YS1wZXJjZW50YWdlIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICBpZihvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgaWYoIG9wdGlvbnMudHJpZ2dlckluVmlldyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2Nyb2xsZXIuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICBjaGVja0xvYWRlckluVklldygkZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IHN0YXJ0cyBhbHJlYWR5IGluIHZpZXdcclxuICAgICAgICAgICAgICAgIGNoZWNrTG9hZGVySW5WSWV3KCRlbGVtZW50LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgc3RhcnRMb2FkZXIoJGVsZW1lbnQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSwgMCk7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gY2hlY2tMb2FkZXJJblZJZXcoZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gLTIwO1xyXG4gICAgICAgICAgICBpZiggISBlbGVtZW50Lmhhc0NsYXNzKGluVmlld0ZsYWdDbGFzcykgJiZcclxuICAgICAgICAgICAgICAgIFV0aWxzLmlzSW5WaWV3KGVsZW1lbnQsIHt0b3BvZmZzZXQ6IG9mZnNldH0pICkge1xyXG4gICAgICAgICAgICAgIHN0YXJ0TG9hZGVyKGVsZW1lbnQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBmdW5jdGlvbiBzdGFydExvYWRlcihlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuQ2xhc3N5TG9hZGVyKG9wdGlvbnMpLmFkZENsYXNzKGluVmlld0ZsYWdDbGFzcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuY2hhcnRzJylcclxuICAgICAgICAuc2VydmljZSgnQ2hhcnREYXRhJywgQ2hhcnREYXRhKTtcclxuXHJcbiAgICBDaGFydERhdGEuJGluamVjdCA9IFsnJHJlc291cmNlJ107XHJcbiAgICBmdW5jdGlvbiBDaGFydERhdGEoJHJlc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkID0gbG9hZDtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICBcclxuICAgICAgICB2YXIgb3B0cyA9IHtcclxuICAgICAgICAgICAgZ2V0OiB7IG1ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWUgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICBmdW5jdGlvbiBsb2FkKHNvdXJjZSkge1xyXG4gICAgICAgICAgcmV0dXJuICRyZXNvdXJjZShzb3VyY2UsIHt9LCBvcHRzKS5nZXQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IGZsb3QuanNcclxuICogSW5pdGlhbGl6ZXMgdGhlIEZsb3QgY2hhcnQgcGx1Z2luIGFuZCBoYW5kbGVzIGRhdGEgcmVmcmVzaFxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNoYXJ0cycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZmxvdCcsIGZsb3QpO1xyXG5cclxuICAgIGZsb3QuJGluamVjdCA9IFsnJGh0dHAnLCAnJHRpbWVvdXQnXTtcclxuICAgIGZ1bmN0aW9uIGZsb3QgKCRodHRwLCAkdGltZW91dCkge1xyXG5cclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXY+PC9kaXY+JyxcclxuICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6ICc9PycsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6ICc9JyxcclxuICAgICAgICAgICAgc2VyaWVzOiAnPScsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiAnPScsXHJcbiAgICAgICAgICAgIHNyYzogJz0nXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbGluazogbGlua1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgIHZhciBoZWlnaHQsIHBsb3QsIHBsb3RBcmVhLCB3aWR0aDtcclxuICAgICAgICAgIHZhciBoZWlnaHREZWZhdWx0ID0gMjIwO1xyXG5cclxuICAgICAgICAgIHBsb3QgPSBudWxsO1xyXG5cclxuICAgICAgICAgIHdpZHRoID0gYXR0cnMud2lkdGggfHwgJzEwMCUnO1xyXG4gICAgICAgICAgaGVpZ2h0ID0gYXR0cnMuaGVpZ2h0IHx8IGhlaWdodERlZmF1bHQ7XHJcblxyXG4gICAgICAgICAgcGxvdEFyZWEgPSAkKGVsZW1lbnQuY2hpbGRyZW4oKVswXSk7XHJcbiAgICAgICAgICBwbG90QXJlYS5jc3Moe1xyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICB2YXIgcGxvdE9iajtcclxuICAgICAgICAgICAgaWYoIXNjb3BlLmRhdGFzZXQgfHwgIXNjb3BlLm9wdGlvbnMpIHJldHVybjtcclxuICAgICAgICAgICAgcGxvdE9iaiA9ICQucGxvdChwbG90QXJlYSwgc2NvcGUuZGF0YXNldCwgc2NvcGUub3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHNjb3BlLiRlbWl0KCdwbG90UmVhZHknLCBwbG90T2JqKTtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgc2NvcGUuY2FsbGJhY2socGxvdE9iaiwgc2NvcGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGxvdE9iajtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBvbkRhdGFzZXRDaGFuZ2VkKGRhdGFzZXQpIHtcclxuICAgICAgICAgICAgaWYgKHBsb3QpIHtcclxuICAgICAgICAgICAgICBwbG90LnNldERhdGEoZGF0YXNldCk7XHJcbiAgICAgICAgICAgICAgcGxvdC5zZXR1cEdyaWQoKTtcclxuICAgICAgICAgICAgICByZXR1cm4gcGxvdC5kcmF3KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcGxvdCA9IGluaXQoKTtcclxuICAgICAgICAgICAgICBvblNlcmllVG9nZ2xlZChzY29wZS5zZXJpZXMpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBwbG90O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKCdkYXRhc2V0Jywgb25EYXRhc2V0Q2hhbmdlZCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gb25TZXJpZVRvZ2dsZWQgKHNlcmllcykge1xyXG4gICAgICAgICAgICBpZiggIXBsb3QgfHwgIXNlcmllcyApIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHNvbWVEYXRhID0gcGxvdC5nZXREYXRhKCk7XHJcbiAgICAgICAgICAgIGZvcih2YXIgc05hbWUgaW4gc2VyaWVzKSB7XHJcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHNlcmllc1tzTmFtZV0sIHRvZ2dsZUZvcihzTmFtZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBwbG90LnNldERhdGEoc29tZURhdGEpO1xyXG4gICAgICAgICAgICBwbG90LmRyYXcoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUZvcihzTmFtZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAocywgaSl7XHJcbiAgICAgICAgICAgICAgICBpZihzb21lRGF0YVtpXSAmJiBzb21lRGF0YVtpXVtzTmFtZV0pXHJcbiAgICAgICAgICAgICAgICAgIHNvbWVEYXRhW2ldW3NOYW1lXS5zaG93ID0gcztcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzY29wZS4kd2F0Y2goJ3NlcmllcycsIG9uU2VyaWVUb2dnbGVkLCB0cnVlKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgZnVuY3Rpb24gb25TcmNDaGFuZ2VkKHNyYykge1xyXG5cclxuICAgICAgICAgICAgaWYoIHNyYyApIHtcclxuXHJcbiAgICAgICAgICAgICAgJGh0dHAuZ2V0KHNyYylcclxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmRhdGFzZXQgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICQuZXJyb3IoJ0Zsb3QgY2hhcnQ6IEJhZCByZXF1ZXN0LicpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzY29wZS4kd2F0Y2goJ3NyYycsIG9uU3JjQ2hhbmdlZCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBtb3JyaXMuanNcclxuICogQW5ndWxhckpTIERpcmVjdGl2ZXMgZm9yIE1vcnJpcyBDaGFydHNcclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jaGFydHMnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ21vcnJpc0JhcicsICAgbW9ycmlzQ2hhcnQoJ0JhcicpICAgKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ21vcnJpc0RvbnV0JywgbW9ycmlzQ2hhcnQoJ0RvbnV0JykgKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ21vcnJpc0xpbmUnLCAgbW9ycmlzQ2hhcnQoJ0xpbmUnKSAgKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ21vcnJpc0FyZWEnLCAgbW9ycmlzQ2hhcnQoJ0FyZWEnKSAgKTtcclxuXHJcbiAgICBmdW5jdGlvbiBtb3JyaXNDaGFydCh0eXBlKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgbW9ycmlzRGF0YTogJz0nLFxyXG4gICAgICAgICAgICBtb3JyaXNPcHRpb25zOiAnPSdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8gc3RhcnQgcmVhZHkgdG8gd2F0Y2ggZm9yIGNoYW5nZXMgaW4gZGF0YVxyXG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdtb3JyaXNEYXRhJywgZnVuY3Rpb24obmV3VmFsKSB7XHJcbiAgICAgICAgICAgICAgaWYgKG5ld1ZhbCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm1vcnJpc0luc3RhbmNlLnNldERhdGEobmV3VmFsKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5tb3JyaXNJbnN0YW5jZS5yZWRyYXcoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgICAgICAvLyB0aGUgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSBjaGFydFxyXG4gICAgICAgICAgICAkc2NvcGUubW9ycmlzT3B0aW9ucy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgLy8gSWYgZGF0YSBkZWZpbmVkIGNvcHkgdG8gb3B0aW9uc1xyXG4gICAgICAgICAgICBpZigkc2NvcGUubW9ycmlzRGF0YSlcclxuICAgICAgICAgICAgICAkc2NvcGUubW9ycmlzT3B0aW9ucy5kYXRhID0gJHNjb3BlLm1vcnJpc0RhdGE7XHJcbiAgICAgICAgICAgIC8vIEluaXQgY2hhcnRcclxuICAgICAgICAgICAgJHNjb3BlLm1vcnJpc0luc3RhbmNlID0gbmV3IE1vcnJpc1t0eXBlXSgkc2NvcGUubW9ycmlzT3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogc3BhcmtsaW5lLmpzXG4gKiBTcGFya0xpbmVzIE1pbmkgQ2hhcnRzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiBcbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jaGFydHMnKVxuICAgICAgICAuZGlyZWN0aXZlKCdzcGFya2xpbmUnLCBzcGFya2xpbmUpO1xuXG4gICAgZnVuY3Rpb24gc3BhcmtsaW5lICgpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgJ3NwYXJrbGluZSc6ICc9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IENvbnRyb2xsZXJcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIH1cbiAgICBDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckZWxlbWVudCcsICckdGltZW91dCcsICckd2luZG93J107XG4gICAgZnVuY3Rpb24gQ29udHJvbGxlcigkc2NvcGUsICRlbGVtZW50LCAkdGltZW91dCwgJHdpbmRvdykge1xuICAgICAgdmFyIHJ1blNMID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaW5pdFNwYXJMaW5lKCk7XG4gICAgICB9O1xuXG4gICAgICAkdGltZW91dChydW5TTCk7XG4gIFxuICAgICAgZnVuY3Rpb24gaW5pdFNwYXJMaW5lKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9ICRzY29wZS5zcGFya2xpbmUsXG4gICAgICAgICAgICBkYXRhID0gJGVsZW1lbnQuZGF0YSgpO1xuICAgICAgICBcbiAgICAgICAgaWYoIW9wdGlvbnMpIC8vIGlmIG5vIHNjb3BlIG9wdGlvbnMsIHRyeSB3aXRoIGRhdGEgYXR0cmlidXRlc1xuICAgICAgICAgIG9wdGlvbnMgPSBkYXRhO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYoZGF0YSkgLy8gZGF0YSBhdHRyaWJ1dGVzIG92ZXJyaWRlcyBzY29wZSBvcHRpb25zXG4gICAgICAgICAgICBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoe30sIG9wdGlvbnMsIGRhdGEpO1xuXG4gICAgICAgIG9wdGlvbnMudHlwZSA9IG9wdGlvbnMudHlwZSB8fCAnYmFyJzsgLy8gZGVmYXVsdCBjaGFydCBpcyBiYXJcbiAgICAgICAgb3B0aW9ucy5kaXNhYmxlSGlkZGVuQ2hlY2sgPSB0cnVlO1xuXG4gICAgICAgICRlbGVtZW50LnNwYXJrbGluZSgnaHRtbCcsIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmKG9wdGlvbnMucmVzaXplKSB7XG4gICAgICAgICAgJCgkd2luZG93KS5yZXNpemUoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRlbGVtZW50LnNwYXJrbGluZSgnaHRtbCcsIG9wdGlvbnMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG4gICAgXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb2xvcnMnKVxyXG4gICAgICAgIC5jb25zdGFudCgnQVBQX0NPTE9SUycsIHtcclxuICAgICAgICAgICdwcmltYXJ5JzogICAgICAgICAgICAgICAgJyM1ZDljZWMnLFxyXG4gICAgICAgICAgJ3N1Y2Nlc3MnOiAgICAgICAgICAgICAgICAnIzI3YzI0YycsXHJcbiAgICAgICAgICAnaW5mbyc6ICAgICAgICAgICAgICAgICAgICcjMjNiN2U1JyxcclxuICAgICAgICAgICd3YXJuaW5nJzogICAgICAgICAgICAgICAgJyNmZjkwMmInLFxyXG4gICAgICAgICAgJ2Rhbmdlcic6ICAgICAgICAgICAgICAgICAnI2YwNTA1MCcsXHJcbiAgICAgICAgICAnaW52ZXJzZSc6ICAgICAgICAgICAgICAgICcjMTMxZTI2JyxcclxuICAgICAgICAgICdncmVlbic6ICAgICAgICAgICAgICAgICAgJyMzN2JjOWInLFxyXG4gICAgICAgICAgJ3BpbmsnOiAgICAgICAgICAgICAgICAgICAnI2Y1MzJlNScsXHJcbiAgICAgICAgICAncHVycGxlJzogICAgICAgICAgICAgICAgICcjNzI2NmJhJyxcclxuICAgICAgICAgICdkYXJrJzogICAgICAgICAgICAgICAgICAgJyMzYTNmNTEnLFxyXG4gICAgICAgICAgJ3llbGxvdyc6ICAgICAgICAgICAgICAgICAnI2ZhZDczMicsXHJcbiAgICAgICAgICAnZ3JheS1kYXJrZXInOiAgICAgICAgICAgICcjMjMyNzM1JyxcclxuICAgICAgICAgICdncmF5LWRhcmsnOiAgICAgICAgICAgICAgJyMzYTNmNTEnLFxyXG4gICAgICAgICAgJ2dyYXknOiAgICAgICAgICAgICAgICAgICAnI2RkZTZlOScsXHJcbiAgICAgICAgICAnZ3JheS1saWdodCc6ICAgICAgICAgICAgICcjZTRlYWVjJyxcclxuICAgICAgICAgICdncmF5LWxpZ2h0ZXInOiAgICAgICAgICAgJyNlZGYxZjInXHJcbiAgICAgICAgfSlcclxuICAgICAgICA7XHJcbn0pKCk7IiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IGNvbG9ycy5qc1xuICogU2VydmljZXMgdG8gcmV0cmlldmUgZ2xvYmFsIGNvbG9yc1xuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb2xvcnMnKVxuICAgICAgICAuc2VydmljZSgnQ29sb3JzJywgQ29sb3JzKTtcblxuICAgIENvbG9ycy4kaW5qZWN0ID0gWydBUFBfQ09MT1JTJ107XG4gICAgZnVuY3Rpb24gQ29sb3JzKEFQUF9DT0xPUlMpIHtcbiAgICAgICAgdGhpcy5ieU5hbWUgPSBieU5hbWU7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGJ5TmFtZShuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIChBUFBfQ09MT1JTW25hbWVdIHx8ICcjZmZmJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb3JlJylcclxuICAgICAgICAuY29uZmlnKGNvcmVDb25maWcpXHJcbiAgICAgICAgLmNvbmZpZyhsb29wYmFja0NvbmZpZylcclxuICAgIDtcclxuXHJcbiAgICBjb3JlQ29uZmlnLiRpbmplY3QgPSBbJyRjb250cm9sbGVyUHJvdmlkZXInLCAnJGNvbXBpbGVQcm92aWRlcicsICckZmlsdGVyUHJvdmlkZXInLCAnJHByb3ZpZGUnLCAnJGh0dHBQcm92aWRlciddO1xyXG4gICAgZnVuY3Rpb24gY29yZUNvbmZpZygkY29udHJvbGxlclByb3ZpZGVyLCAkY29tcGlsZVByb3ZpZGVyLCAkZmlsdGVyUHJvdmlkZXIsICRwcm92aWRlLCAkaHR0cFByb3ZpZGVyKXtcclxuICAgICAgXHJcbiAgICAgIHZhciBjb3JlID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5jb3JlJyk7XHJcbiAgICAgIC8vIHJlZ2lzdGVyaW5nIGNvbXBvbmVudHMgYWZ0ZXIgYm9vdHN0cmFwXHJcbiAgICAgIGNvcmUuY29udHJvbGxlciA9ICRjb250cm9sbGVyUHJvdmlkZXIucmVnaXN0ZXI7XHJcbiAgICAgIGNvcmUuZGlyZWN0aXZlICA9ICRjb21waWxlUHJvdmlkZXIuZGlyZWN0aXZlO1xyXG4gICAgICBjb3JlLmZpbHRlciAgICAgPSAkZmlsdGVyUHJvdmlkZXIucmVnaXN0ZXI7XHJcbiAgICAgIGNvcmUuZmFjdG9yeSAgICA9ICRwcm92aWRlLmZhY3Rvcnk7XHJcbiAgICAgIGNvcmUuc2VydmljZSAgICA9ICRwcm92aWRlLnNlcnZpY2U7XHJcbiAgICAgIGNvcmUuY29uc3RhbnQgICA9ICRwcm92aWRlLmNvbnN0YW50O1xyXG4gICAgICBjb3JlLnZhbHVlICAgICAgPSAkcHJvdmlkZS52YWx1ZTtcclxuXHJcbiAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goZnVuY3Rpb24oJHEsICRsb2NhdGlvbiwgTG9vcEJhY2tBdXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uKHJlamVjdGlvbikge1xyXG4gICAgICAgICAgICBpZiAocmVqZWN0aW9uLnN0YXR1cyA9PSA0MDEpIHtcclxuICAgICAgICAgICAgICBMb29wQmFja0F1dGguY2xlYXJVc2VyKCk7XHJcbiAgICAgICAgICAgICAgTG9vcEJhY2tBdXRoLmNsZWFyU3RvcmFnZSgpO1xyXG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFnZS9sb2dpbicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0pOyAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGxvb3BiYWNrQ29uZmlnLiRpbmplY3QgPSBbJ0xvb3BCYWNrUmVzb3VyY2VQcm92aWRlcicsICd1cmxCYXNlJ107XHJcbiAgICBmdW5jdGlvbiBsb29wYmFja0NvbmZpZyhMb29wQmFja1Jlc291cmNlUHJvdmlkZXIsIHVybEJhc2UpIHtcclxuICAgICAgTG9vcEJhY2tSZXNvdXJjZVByb3ZpZGVyLnNldFVybEJhc2UodXJsQmFzZSk7XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IGNvbnN0YW50cy5qc1xyXG4gKiBEZWZpbmUgY29uc3RhbnRzIHRvIGluamVjdCBhY3Jvc3MgdGhlIGFwcGxpY2F0aW9uXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuY29yZScpXHJcbiAgICAgICAgLmNvbnN0YW50KCdBUFBfTUVESUFRVUVSWScsIHtcclxuICAgICAgICAgICdkZXNrdG9wTEcnOiAgICAgICAgICAgICAxMjAwLFxyXG4gICAgICAgICAgJ2Rlc2t0b3AnOiAgICAgICAgICAgICAgICA5OTIsXHJcbiAgICAgICAgICAndGFibGV0JzogICAgICAgICAgICAgICAgIDc2OCxcclxuICAgICAgICAgICdtb2JpbGUnOiAgICAgICAgICAgICAgICAgNDgwXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY29uc3RhbnQoJ3VybEJhc2UnLCBcImh0dHA6Ly8wLjAuMC4wOjMwMDAvYXBpXCIpXHJcbiAgICAgICAgLy8gLmNvbnN0YW50KCd1cmxCYXNlJywgXCJodHRwOi8vYXBpLmZhbmthaHVpLmNvbTozMDAwL2FwaVwiKVxyXG4gICAgICA7XHJcblxyXG59KSgpOyIsIi8qKlxuICogQW5ndWxhckpTIGRlZmF1bHQgZmlsdGVyIHdpdGggdGhlIGZvbGxvd2luZyBleHByZXNzaW9uOlxuICogXCJwZXJzb24gaW4gcGVvcGxlIHwgZmlsdGVyOiB7bmFtZTogJHNlbGVjdC5zZWFyY2gsIGFnZTogJHNlbGVjdC5zZWFyY2h9XCJcbiAqIHBlcmZvcm1zIGEgQU5EIGJldHdlZW4gJ25hbWU6ICRzZWxlY3Quc2VhcmNoJyBhbmQgJ2FnZTogJHNlbGVjdC5zZWFyY2gnLlxuICogV2Ugd2FudCB0byBwZXJmb3JtIGEgT1IuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvcmUnKVxuICAgICAgICAuZmlsdGVyKCdyb2xlJywgcm9sZUZpbHRlcilcbiAgICA7XG5cbiAgICBmdW5jdGlvbiByb2xlRmlsdGVyKCkge1xuICAgICAgICB2YXIgcm9sZSA9IHtcbiAgICAgICAgICBvd25lcjogXCLogIHmnb9cIixcbiAgICAgICAgICBzaG9wTWFuYWdlcjogXCLlupfplb9cIixcbiAgICAgICAgICBjYXNoaWVyOiBcIuaUtumTtuWRmFwiXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICByZXR1cm4gcm9sZVtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb3JlJylcclxuICAgICAgICAucnVuKGFwcFJ1bilcclxuICAgICAgICAucnVuKGN1cnJlbnRVc2VyUnVuKVxyXG4gICAgO1xyXG5cclxuICAgIGFwcFJ1bi4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAgJyR3aW5kb3cnLCAnJHRlbXBsYXRlQ2FjaGUnLCAnQ29sb3JzJ107XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGFwcFJ1bigkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJHdpbmRvdywgJHRlbXBsYXRlQ2FjaGUsIENvbG9ycykge1xyXG4gICAgICBcclxuICAgICAgLy8gU2V0IHJlZmVyZW5jZSB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBzY29wZVxyXG4gICAgICAkcm9vdFNjb3BlLiRzdGF0ZSA9ICRzdGF0ZTtcclxuICAgICAgJHJvb3RTY29wZS4kc3RhdGVQYXJhbXMgPSAkc3RhdGVQYXJhbXM7XHJcbiAgICAgICRyb290U2NvcGUuJHN0b3JhZ2UgPSAkd2luZG93LmxvY2FsU3RvcmFnZTtcclxuXHJcbiAgICAgIC8vIFVuY29tbWVudCB0aGlzIHRvIGRpc2FibGUgdGVtcGxhdGUgY2FjaGVcclxuICAgICAgLyokcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZih0b1N0YXRlKSAhPT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgICAgICAgICAkdGVtcGxhdGVDYWNoZS5yZW1vdmUodG9TdGF0ZS50ZW1wbGF0ZVVybCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0pOyovXHJcblxyXG4gICAgICAvLyBBbGxvd3MgdG8gdXNlIGJyYW5kaW5nIGNvbG9yIHdpdGggaW50ZXJwb2xhdGlvblxyXG4gICAgICAvLyB7eyBjb2xvckJ5TmFtZSgncHJpbWFyeScpIH19XHJcbiAgICAgICRyb290U2NvcGUuY29sb3JCeU5hbWUgPSBDb2xvcnMuYnlOYW1lO1xyXG5cclxuICAgICAgLy8gY2FuY2VsIGNsaWNrIGV2ZW50IGVhc2lseVxyXG4gICAgICAkcm9vdFNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uKCRldmVudCkge1xyXG4gICAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIEhvb2tzIEV4YW1wbGVcclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG4gICAgICAvLyBIb29rIG5vdCBmb3VuZFxyXG4gICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlTm90Rm91bmQnLFxyXG4gICAgICAgIGZ1bmN0aW9uKGV2ZW50LCB1bmZvdW5kU3RhdGUvKiwgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKi8pIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codW5mb3VuZFN0YXRlLnRvKTsgLy8gXCJsYXp5LnN0YXRlXCJcclxuICAgICAgICAgICAgY29uc29sZS5sb2codW5mb3VuZFN0YXRlLnRvUGFyYW1zKTsgLy8ge2E6MSwgYjoyfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1bmZvdW5kU3RhdGUub3B0aW9ucyk7IC8vIHtpbmhlcml0OmZhbHNlfSArIGRlZmF1bHQgb3B0aW9uc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAvLyBIb29rIGVycm9yXHJcbiAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VFcnJvcicsXHJcbiAgICAgICAgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMsIGVycm9yKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICB9KTtcclxuICAgICAgLy8gSG9vayBzdWNjZXNzXHJcbiAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJyxcclxuICAgICAgICBmdW5jdGlvbigvKmV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKi8pIHtcclxuICAgICAgICAgIC8vIGRpc3BsYXkgbmV3IHZpZXcgZnJvbSB0b3BcclxuICAgICAgICAgICR3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XHJcbiAgICAgICAgICAvLyBTYXZlIHRoZSByb3V0ZSB0aXRsZVxyXG4gICAgICAgICAgJHJvb3RTY29wZS5jdXJyVGl0bGUgPSAkc3RhdGUuY3VycmVudC50aXRsZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIC8vIExvYWQgYSB0aXRsZSBkeW5hbWljYWxseVxyXG4gICAgICAkcm9vdFNjb3BlLmN1cnJUaXRsZSA9ICRzdGF0ZS5jdXJyZW50LnRpdGxlO1xyXG4gICAgICAkcm9vdFNjb3BlLnBhZ2VUaXRsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0aXRsZSA9ICRyb290U2NvcGUuYXBwLm5hbWUgKyAnIC0gJyArICgkcm9vdFNjb3BlLmN1cnJUaXRsZSB8fCAkcm9vdFNjb3BlLmFwcC5kZXNjcmlwdGlvbik7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICByZXR1cm4gdGl0bGU7XHJcbiAgICAgIH07ICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGN1cnJlbnRVc2VyUnVuLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnVXNlcicsICckZmlsdGVyJ107XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGN1cnJlbnRVc2VyUnVuKCRyb290U2NvcGUsIFVzZXIsICRmaWx0ZXIpIHtcclxuICAgICAgXHJcbiAgICAgIHVzZXJEaWRMb2dpbmVkKCk7XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiB1c2VyRGlkTG9naW5lZCgpIHtcclxuICAgICAgICBpZihVc2VyLmlzQXV0aGVudGljYXRlZCgpKSB7XHJcbiAgICAgICAgICBVc2VyLmZpbmRCeUlkKHtpZDogVXNlci5nZXRDdXJyZW50SWQoKSwgZmlsdGVyOntpbmNsdWRlOlsnc2hvcCcsICdtZXJjaGFudCddfX0pXHJcbiAgICAgICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgICAgICB1c2VyLmpvYiA9ICRmaWx0ZXIoJ3JvbGUnKSh1c2VyLnJvbGUpO1xyXG4gICAgICAgICAgICB1c2VyLm5hbWUgPSB1c2VyLm5hbWUgfHwgdXNlci51c2VybmFtZTtcclxuICAgICAgICAgICAgdXNlci5waWN0dXJlID0gJ2FwcC9pbWcvZHVtbXkucG5nJztcclxuICAgICAgICAgICAgJHJvb3RTY29wZS51c2VyID0gdXNlcjtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgJHJvb3RTY29wZS4kb24oJ1VzZXIubG9naW5lZCcsIHVzZXJEaWRMb2dpbmVkKTtcclxuICAgICAgXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgLm1vZHVsZSgnYXBwLmNvc3RzJylcbiAgICAgIC5jb250cm9sbGVyKCdDb3N0c0NvbnRyb2xsZXInLCBDb3N0c0NvbnRyb2xsZXIpXG4gICAgICAuY29udHJvbGxlcignQ29zdENhdGVnb3JpZXNDb250cm9sbGVyJywgQ29zdENhdGVnb3JpZXNDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ2Nvc3REaWFsb2dDb250cm9sbGVyJywgY29zdERpYWxvZ0NvbnRyb2xsZXIpXG4gICAgO1xuICAgICAgXG4gICAgQ29zdHNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdDb3N0JywgJ25nVGFibGVQYXJhbXMnLCAnbmdUYWJsZUxCU2VydmljZScsICdTd2VldEFsZXJ0JywgJ25nRGlhbG9nJ107XG4gICAgZnVuY3Rpb24gQ29zdHNDb250cm9sbGVyKCRzY29wZSwgQ29zdCwgbmdUYWJsZVBhcmFtcywgbmdUYWJsZUxCU2VydmljZSwgU3dlZXRBbGVydCwgbmdEaWFsb2cpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgIHZtLmR0ID0ge1xuICAgICAgICBvcHRpb25zOiB7IFxuICAgICAgICAgIGZvcm1hdFllYXI6ICd5eScsXG4gICAgICAgICAgbWF4RGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZSgyMDE2LDEsMSksXG4gICAgICAgICAgc3RhcnRpbmdEYXk6IDFcbiAgICAgICAgfSxcbiAgICAgICAgYmVnaW46IHtcbiAgICAgICAgICBkdDogbmV3IERhdGUobW9tZW50KCkuc3RhcnRPZignbW9udGgnKSksXG4gICAgICAgICAgb3BlbjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgZW5kOiB7XG4gICAgICAgICAgZHQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgb3BlbjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgdm0udGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7Y291bnQ6IDEwfSwge1xuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCRkZWZlciwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyID0ge3doZXJlOntcbiAgICAgICAgICAgICAgc3RhdHVzOntuZTonZGVsZXRlZCd9LFxuICAgICAgICAgICAgICBtb2RpZmllZDoge2JldHdlZW46IFtcbiAgICAgICAgICAgICAgICBtb21lbnQodm0uZHQuYmVnaW4uZHQpLnN0YXJ0T2YoJ2RheScpLCBcbiAgICAgICAgICAgICAgICBtb21lbnQodm0uZHQuZW5kLmR0KS5lbmRPZignZGF5JylcbiAgICAgICAgICAgICAgXX1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBuZ1RhYmxlTEJTZXJ2aWNlLmdldERhdGEoJGRlZmVyLCBwYXJhbXMsIENvc3QsIGZpbHRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgfVxuXG4gICAgICB2bS5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG5nRGlhbG9nLm9wZW4oeyBcbiAgICAgICAgICB0ZW1wbGF0ZTogJ2Nvc3REaWFsb2dJZCcsIFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdjb3N0RGlhbG9nQ29udHJvbGxlcidcbiAgICAgICAgfSkuY2xvc2VQcm9taXNlLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICB2bS50YWJsZVBhcmFtcy5yZWxvYWQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmVkaXQgPSBmdW5jdGlvbiAoZW50aXR5KSB7XG4gICAgICAgICRzY29wZS5kYXRhID0gZW50aXR5O1xuICAgICAgICBuZ0RpYWxvZy5vcGVuKHsgXG4gICAgICAgICAgdGVtcGxhdGU6ICdjb3N0RGlhbG9nSWQnLCBcbiAgICAgICAgICBjb250cm9sbGVyOiAnY29zdERpYWxvZ0NvbnRyb2xsZXInLFxuICAgICAgICAgIHNjb3BlOiAkc2NvcGVcbiAgICAgICAgfSkuY2xvc2VQcm9taXNlLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICB2bS50YWJsZVBhcmFtcy5yZWxvYWQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmRlbGV0ZSA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICAgICAgU3dlZXRBbGVydC5zd2FsKHsgICBcbiAgICAgICAgICB0aXRsZTogJ+ehruiupOWIoOmZpO+8nycsICAgXG4gICAgICAgICAgdGV4dDogJ+WIoOmZpOS7peWQjuWwhuaBouWkje+8gScsICAgXG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLCAgIFxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsICAgXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiAnI0RENkI1NScsICAgXG4gICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICfmmK/nmoTvvIzliKDpmaTvvIEnLFxuICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6ICfkuI3vvIzlhYjkuI3liKAhJyxcbiAgICAgICAgICAvLyBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgfSwgZnVuY3Rpb24gKGlzQ29uZmlybSkge1xuICAgICAgICAgIGlmKGlzQ29uZmlybSkge1xuICAgICAgICAgICAgQ29zdC5kZWxldGVCeUlkKHtpZDogZW50aXR5LmlkfSk7XG4gICAgICAgICAgICB2bS50YWJsZVBhcmFtcy5yZWxvYWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBDb3N0Q2F0ZWdvcmllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0Nvc3RjYXRlZ29yeScsICdTd2VldEFsZXJ0J107XG4gICAgZnVuY3Rpb24gQ29zdENhdGVnb3JpZXNDb250cm9sbGVyKCRzY29wZSwgQ29zdGNhdGVnb3J5LCBTd2VldEFsZXJ0KSB7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuICAgICAgICB2bS5jYXRlZ29yaWVzID0gQ29zdGNhdGVnb3J5LmZpbmQoe2ZpbHRlcjoge1xuICAgICAgICAgIG9yZGVyOiBcIm5hbWUgREVTQ1wiLFxuICAgICAgICAgIHdoZXJlOiB7c3RhdHVzOntuZTonZGVsZXRlZCd9fVxuICAgICAgICB9fSk7XG5cbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0ucmVsb2FkID0gYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gZGVsZXRlQWxlcnQoY2FsbGJhY2spIHtcbiAgICAgICAgU3dlZXRBbGVydC5zd2FsKHsgICBcbiAgICAgICAgICB0aXRsZTogJ+ehruiupOWIoOmZpO+8nycsICAgXG4gICAgICAgICAgdGV4dDogJ+WIoOmZpOS7peWQjuWwhuaXoOazleS9v+eUqOWIhuexu+S6hu+8gScsICAgXG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLCAgIFxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsICAgXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiAnI0RENkI1NScsICAgXG4gICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICfmmK/nmoTvvIzliKDpmaTvvIEnLFxuICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6ICfkuI3vvIzlhYjkuI3liKAhJyxcbiAgICAgICAgICAvLyBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5hZGRDYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuICAgICAgICBpZihjYXRlZ29yeSAmJiBjYXRlZ29yeSAhPSAnJykge1xuICAgICAgICAgIENvc3RjYXRlZ29yeS5jcmVhdGUoe25hbWU6IGNhdGVnb3J5fSkuJHByb21pc2UudGhlbihhY3RpdmF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0udXBkYXRlQ2F0ZWdvcnkgPSBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcbiAgICAgICAgQ29zdGNhdGVnb3J5LnByb3RvdHlwZSR1cGRhdGVBdHRyaWJ1dGVzKHtpZDogY2F0ZWdvcnkuaWR9LCB7XG4gICAgICAgICAgc3RhdHVzOiBjYXRlZ29yeS5zdGF0dXMsXG4gICAgICAgICAgbmFtZTogY2F0ZWdvcnkubmFtZSxcbiAgICAgICAgICBzdWJzOiBjYXRlZ29yeS5zdWJzXG4gICAgICAgIH0pLiRwcm9taXNlLnRoZW4oYWN0aXZhdGUpO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5kZWxldGVDYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuICAgICAgICBkZWxldGVBbGVydChmdW5jdGlvbiAoaXNDb25maXJtKSB7XG4gICAgICAgICAgaWYoaXNDb25maXJtKSB7XG4gICAgICAgICAgICBjYXRlZ29yeS5zdGF0dXMgPSAnZGVsZXRlZCc7XG4gICAgICAgICAgICB2bS51cGRhdGVDYXRlZ29yeShjYXRlZ29yeSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5hZGRTdWJDYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSwgc3ViY2F0ZWdvcnkpIHtcbiAgICAgICAgaWYoc3ViY2F0ZWdvcnkgJiYgc3ViY2F0ZWdvcnkgIT0gJycgJiYgY2F0ZWdvcnkuc3Vicy5pbmRleE9mKHN1YmNhdGVnb3J5KSA9PT0gLTEpIHtcbiAgICAgICAgICBjYXRlZ29yeS5zdWJzLnB1c2goc3ViY2F0ZWdvcnkpO1xuICAgICAgICAgIHZtLnVwZGF0ZUNhdGVnb3J5KGNhdGVnb3J5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5kZWxldGVTdWJjYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSwgaW5kZXgpIHtcbiAgICAgICAgLy8gdmFyIGluZGV4ID0gY2F0ZWdvcnkuc3Vicy5pbmRleE9mKHN1YmNhdGVnb3J5KTtcbiAgICAgICAgZGVsZXRlQWxlcnQoZnVuY3Rpb24gKGlzQ29uZmlybSkge1xuICAgICAgICAgIGlmKGlzQ29uZmlybSkge1xuICAgICAgICAgICAgY2F0ZWdvcnkuc3Vicy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgdm0udXBkYXRlQ2F0ZWdvcnkoY2F0ZWdvcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29zdERpYWxvZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ25nRGlhbG9nJywgJ0Nvc3QnLCAnU3dlZXRBbGVydCcsICdDb3N0Y2F0ZWdvcnknLCAndG9hc3RlciddO1xuICAgIGZ1bmN0aW9uIGNvc3REaWFsb2dDb250cm9sbGVyKCRzY29wZSwgbmdEaWFsb2csIENvc3QsIFN3ZWV0QWxlcnQsIENvc3RjYXRlZ29yeSwgdG9hc3Rlcikge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICRzY29wZS5jYXRlZ29yaWVzID0gQ29zdGNhdGVnb3J5LmZpbmQoe2ZpbHRlcjoge1xuICAgICAgICAgICAgb3JkZXI6IFwibmFtZSBERVNDXCIsXG4gICAgICAgICAgICB3aGVyZToge3N0YXR1czp7bmU6J2RlbGV0ZWQnfX1cbiAgICAgICAgICB9fSk7XG4gICAgICAgICAgJHNjb3BlLmRhdGEgPSAkc2NvcGUuZGF0YSB8fCB7XG4gICAgICAgICAgICBjYXRlZ29yeTogJ+ivt+mAieaLqScsXG4gICAgICAgICAgICBzdWJjYXRlZ29yeTogJ+WIhuexuycsXG4gICAgICAgICAgICBhbW91bnQ6IDBcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNldENhdGVnb3J5ID0gZnVuY3Rpb24gKGMsIHMpIHtcbiAgICAgICAgICAkc2NvcGUuZGF0YS5jYXRlZ29yeSA9IGM7XG4gICAgICAgICAgJHNjb3BlLmRhdGEuc3ViY2F0ZWdvcnkgPSBzO1xuICAgICAgICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5jb25maXJtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmKCRzY29wZS5kYXRhLmFtb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxldGUgJHNjb3BlLmRhdGEubWVyY2hhbnRJZDtcbiAgICAgICAgICBkZWxldGUgJHNjb3BlLmRhdGEuc2hvcElkO1xuICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuZGF0YS5jcmVhdGVkO1xuICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuZGF0YS5vcGVyYXRvcjtcbiAgICAgICAgICBDb3N0LnVwc2VydCgkc2NvcGUuZGF0YSkuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBuZ0RpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAn5oiQ5YqfJywgXCLlrozmiJDmlK/lh7rnmbvorrBcIik7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgJ+Wksei0pScsIFwi5pSv5Ye655m76K6w5pyq5a6M5oiQ77yM6K+36YeN6K+V77yBXCIpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJHNjb3BlLnN1Ym1pdGluZyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuZGFzaGJvYXJkJylcclxuICAgICAgICAuY29udHJvbGxlcignRGFzaGJvYXJkQ29udHJvbGxlcicsIERhc2hib2FyZENvbnRyb2xsZXIpO1xyXG5cclxuICAgIERhc2hib2FyZENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0NoYXJ0RGF0YScsICckdGltZW91dCcsICdDaGVja2luJywgJ0RlYWwnLCAnUGF5bWVudCddO1xyXG4gICAgZnVuY3Rpb24gRGFzaGJvYXJkQ29udHJvbGxlcigkc2NvcGUsIENoYXJ0RGF0YSwgJHRpbWVvdXQsIENoZWNraW4sIERlYWwsIFBheW1lbnQpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBTZXQgTW9tZW50IGxvY2FsZVxyXG4gICAgICAgIG1vbWVudC5sb2NhbGUoJ3poLWNuJyk7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmKCEkc2NvcGUudXNlcikgcmV0dXJuO1xyXG5cclxuICAgICAgICAgIC8vIFN0YXRpc3RpY1xyXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICAgICAgICB2bS5zdGF0RGF0YSA9IHthbW91bnQ6IDAsIHF0eTogMCwgZGVwb3NpdDogMH07XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIERlYWwuc3RhdCh7ZmlsdGVyOnt3aGVyZTp7c3RhdHVzOiAnY2xvc2VkJywgXCJwYXltZW50LmFtb3VudFwiOiB7JGd0OiAwfX19fSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBpZihyZXMubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZtLnN0YXREYXRhLmFtb3VudCA9IHJlc1swXS5hbW91bnQ7XHJcbiAgICAgICAgICAgIHZtLnN0YXREYXRhLnF0eSA9IHJlc1swXS5xdHk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgUGF5bWVudC5zdGF0KHtmaWx0ZXI6e3doZXJlOntzdGF0dXM6ICdjbG9zZWQnLCBjYXRlZ29yeTogJ2RlcG9zaXQnfX19LCBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGlmKHJlcy5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgICAgICAgICAgdm0uc3RhdERhdGEuZGVwb3NpdCA9IHJlc1swXS5hbW91bnQ7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLy8gQ0hFQ0tJTlxyXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICAgICAgICB2bS5jaGVja2lucyA9IENoZWNraW4uZmluZCh7ZmlsdGVyOntcclxuICAgICAgICAgICAgd2hlcmU6IHttZXJjaGFudElkOiAkc2NvcGUudXNlci5zaG9wSWR9LFxyXG4gICAgICAgICAgICBpbmNsdWRlOiBbe21lbWJlcjogJ3d4dXNlcid9XSxcclxuICAgICAgICAgICAgbGltaXQ6IDEwLCBcclxuICAgICAgICAgICAgb3JkZXI6ICdjcmVhdGVkIERFU0MnXHJcbiAgICAgICAgICB9fSk7XHJcblxyXG4gICAgICAgICAgLy8gU1BMSU5FXHJcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuICAgICAgICAgIHZtLnNwbGluZURhdGEgPSBDaGFydERhdGEubG9hZCgnc2VydmVyL2NoYXJ0L3NwbGluZS5qc29uJyk7XHJcbiAgICAgICAgICB2bS5zcGxpbmVPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgIHNlcmllczoge1xyXG4gICAgICAgICAgICAgICAgICBsaW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgcG9pbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiA0XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIHNwbGluZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiAwLjQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICBmaWxsOiAwLjVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJyNlZWUnLFxyXG4gICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMSxcclxuICAgICAgICAgICAgICAgICAgaG92ZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmNmY2ZjJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDogdHJ1ZSxcclxuICAgICAgICAgICAgICB0b29sdGlwT3B0czoge1xyXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiBmdW5jdGlvbiAobGFiZWwsIHgsIHkpIHsgcmV0dXJuIHggKyAnIDogJyArIHk7IH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHhheGlzOiB7XHJcbiAgICAgICAgICAgICAgICAgIHRpY2tDb2xvcjogJyNmY2ZjZmMnLFxyXG4gICAgICAgICAgICAgICAgICBtb2RlOiAnY2F0ZWdvcmllcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHlheGlzOiB7XHJcbiAgICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgICAgbWF4OiAxNTAsIC8vIG9wdGlvbmFsOiB1c2UgaXQgZm9yIGEgY2xlYXIgcmVwcmVzZXRhdGlvblxyXG4gICAgICAgICAgICAgICAgICB0aWNrQ29sb3I6ICcjZWVlJyxcclxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICgkc2NvcGUuYXBwLmxheW91dC5pc1JUTCA/ICdyaWdodCcgOiAnbGVmdCcpLFxyXG4gICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0dGVyOiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHYvKiArICcgdmlzaXRvcnMnKi87XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHNoYWRvd1NpemU6IDBcclxuICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgIC8vIFBBTkVMIFJFRlJFU0ggRVZFTlRTXHJcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuXHJcbiAgICAgICAgICAkc2NvcGUuJG9uKCdwYW5lbC1yZWZyZXNoJywgZnVuY3Rpb24oZXZlbnQsIGlkKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2ltdWxhdGluZyBjaGFydCByZWZyZXNoIGR1cmluZyAzcyBvbiAjJytpZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBJbnN0ZWFkIG9mIHRpbWVvdXQgeW91IGNhbiByZXF1ZXN0IGEgY2hhcnQgZGF0YVxyXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIC8vIGRpcmVjdGl2ZSBsaXN0ZW4gZm9yIHRvIHJlbW92ZSB0aGUgc3Bpbm5lciBcclxuICAgICAgICAgICAgICAvLyBhZnRlciB3ZSBlbmQgdXAgdG8gcGVyZm9ybSBvd24gb3BlcmF0aW9uc1xyXG4gICAgICAgICAgICAgICRzY29wZS4kYnJvYWRjYXN0KCdyZW1vdmVTcGlubmVyJywgaWQpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZWZyZXNoZWQgIycgKyBpZCk7XHJcblxyXG4gICAgICAgICAgICB9LCAzMDAwKTtcclxuXHJcbiAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgLy8gUEFORUwgRElTTUlTUyBFVkVOVFNcclxuICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuICAgICAgICAgIC8vIEJlZm9yZSByZW1vdmUgcGFuZWxcclxuICAgICAgICAgICRzY29wZS4kb24oJ3BhbmVsLXJlbW92ZScsIGZ1bmN0aW9uKGV2ZW50LCBpZCwgZGVmZXJyZWQpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BhbmVsICMnICsgaWQgKyAnIHJlbW92aW5nJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBIZXJlIGlzIG9ibGlnYXRvcnkgdG8gY2FsbCB0aGUgcmVzb2x2ZSgpIGlmIHdlIHByZXRlbmQgdG8gcmVtb3ZlIHRoZSBwYW5lbCBmaW5hbGx5XHJcbiAgICAgICAgICAgIC8vIE5vdCBjYWxsaW5nIHJlc29sdmUoKSB3aWxsIE5PVCByZW1vdmUgdGhlIHBhbmVsXHJcbiAgICAgICAgICAgIC8vIEl0J3MgdXAgdG8geW91ciBhcHAgdG8gZGVjaWRlIGlmIHBhbmVsIHNob3VsZCBiZSByZW1vdmVkIG9yIG5vdFxyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIC8vIFBhbmVsIHJlbW92ZWQgKCBvbmx5IGlmIGFib3ZlIHdhcyByZXNvbHZlZCgpIClcclxuICAgICAgICAgICRzY29wZS4kb24oJ3BhbmVsLXJlbW92ZWQnLCBmdW5jdGlvbihldmVudCwgaWQpe1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BhbmVsICMnICsgaWQgKyAnIHJlbW92ZWQnKTtcclxuXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICRzY29wZS4kb24oJ1VzZXIubG9naW5lZCcsIGFjdGl2YXRlKTtcclxuICAgICAgICBcclxuICAgIH1cclxufSkoKTsiLCIvKipcbiAqIEFuZ3VsYXJKUyBkZWZhdWx0IGZpbHRlciB3aXRoIHRoZSBmb2xsb3dpbmcgZXhwcmVzc2lvbjpcbiAqIFwicGVyc29uIGluIHBlb3BsZSB8IGZpbHRlcjoge25hbWU6ICRzZWxlY3Quc2VhcmNoLCBhZ2U6ICRzZWxlY3Quc2VhcmNofVwiXG4gKiBwZXJmb3JtcyBhIEFORCBiZXR3ZWVuICduYW1lOiAkc2VsZWN0LnNlYXJjaCcgYW5kICdhZ2U6ICRzZWxlY3Quc2VhcmNoJy5cbiAqIFdlIHdhbnQgdG8gcGVyZm9ybSBhIE9SLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5kYXNoYm9hcmQnKVxuICAgICAgICAuZmlsdGVyKCdtb21lbnRfdW5peCcsIG1vbWVudFVuaXhGaWx0ZXIpXG4gICAgICAgIC5maWx0ZXIoJ21vbWVudF9mcm9tX25vdycsIG1vbWVudEZyb21Ob3dGaWx0ZXIpXG4gICAgICAgIC5maWx0ZXIoJ21vbWVudF91bml4X2Zyb21fbm93JywgbW9tZW50VW5peEZyb21Ob3dGaWx0ZXIpXG4gICAgO1xuXG4gICAgZnVuY3Rpb24gbW9tZW50VW5peEZpbHRlcihpbnB1dCwgZm9ybWF0KSB7XG4gICAgICByZXR1cm4gbW9tZW50LnVuaXgoaW5wdXQpLmZvcm1hdChmb3JtYXQgfHwgJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gbW9tZW50RnJvbU5vd0ZpbHRlcigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudChpbnB1dCkuZnJvbU5vdygpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRVbml4RnJvbU5vd0ZpbHRlcihpbnB1dCkge1xuICAgICAgcmV0dXJuIG1vbWVudC51bml4KGlucHV0KS5mcm9tTm93KCk7XG4gICAgfVxuXG59KSgpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBzY3JvbGwuanNcbiAqIE1ha2UgYSBjb250ZW50IGJveCBzY3JvbGxhYmxlXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmVsZW1lbnRzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnc2Nyb2xsYWJsZScsIHNjcm9sbGFibGUpO1xuXG4gICAgZnVuY3Rpb24gc2Nyb2xsYWJsZSAoKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIHZhciBkZWZhdWx0SGVpZ2h0ID0gMjUwO1xuICAgICAgICAgIGVsZW1lbnQuc2xpbVNjcm9sbCh7XG4gICAgICAgICAgICAgIGhlaWdodDogKGF0dHJzLmhlaWdodCB8fCBkZWZhdWx0SGVpZ2h0KVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogZmlsZXN0eWxlLmpzXHJcbiAqIEluaXRpYWxpemVzIHRoZSBmaWVsc3R5bGUgcGx1Z2luXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuZm9ybXMnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2ZpbGVzdHlsZScsIGZpbGVzdHlsZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gZmlsZXN0eWxlICgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICB2YXIgb3B0aW9ucyA9IGVsZW1lbnQuZGF0YSgpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBvbGQgdXNhZ2Ugc3VwcG9ydFxyXG4gICAgICAgICAgb3B0aW9ucy5jbGFzc0lucHV0ID0gZWxlbWVudC5kYXRhKCdjbGFzc2lucHV0JykgfHwgb3B0aW9ucy5jbGFzc0lucHV0O1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBlbGVtZW50LmZpbGVzdHlsZShvcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBmb3JtLXdpemFyZC5qc1xyXG4gKiBIYW5kbGVzIGZvcm0gd2l6YXJkIHBsdWdpbiBhbmQgdmFsaWRhdGlvblxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mb3JtcycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZm9ybVdpemFyZCcsIGZvcm1XaXphcmQpO1xyXG5cclxuICAgIGZvcm1XaXphcmQuJGluamVjdCA9IFsnJHBhcnNlJ107XHJcbiAgICBmdW5jdGlvbiBmb3JtV2l6YXJkICgkcGFyc2UpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZTogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgIHZhciB2YWxpZGF0ZSA9ICRwYXJzZShhdHRycy52YWxpZGF0ZVN0ZXBzKShzY29wZSksXHJcbiAgICAgICAgICAgICAgd2l6ID0gbmV3IFdpemFyZChhdHRycy5zdGVwcywgISF2YWxpZGF0ZSwgZWxlbWVudCk7XHJcbiAgICAgICAgICBzY29wZS53aXphcmQgPSB3aXouaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gV2l6YXJkIChxdWFudGl0eSwgdmFsaWRhdGUsIGVsZW1lbnQpIHtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgc2VsZi5xdWFudGl0eSA9IHBhcnNlSW50KHF1YW50aXR5LDEwKTtcclxuICAgICAgICAgIHNlbGYudmFsaWRhdGUgPSB2YWxpZGF0ZTtcclxuICAgICAgICAgIHNlbGYuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZWxmLmNyZWF0ZXN0ZXBzKHNlbGYucXVhbnRpdHkpO1xyXG4gICAgICAgICAgICBzZWxmLmdvKDEpOyAvLyBhbHdheXMgc3RhcnQgYXQgZmlzdCBzdGVwXHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBzZWxmLmdvID0gZnVuY3Rpb24oc3RlcCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCBhbmd1bGFyLmlzRGVmaW5lZChzZWxmLnN0ZXBzW3N0ZXBdKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgaWYoc2VsZi52YWxpZGF0ZSAmJiBzdGVwICE9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm9ybSA9ICQoc2VsZi5lbGVtZW50KSxcclxuICAgICAgICAgICAgICAgICAgICBncm91cCA9IGZvcm0uY2hpbGRyZW4oKS5jaGlsZHJlbignZGl2JykuZ2V0KHN0ZXAgLSAyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGZvcm0ucGFyc2xleSgpLnZhbGlkYXRlKCBncm91cC5pZCApKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHNlbGYuY2xlYW5hbGwoKTtcclxuICAgICAgICAgICAgICBzZWxmLnN0ZXBzW3N0ZXBdID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBzZWxmLmFjdGl2ZSA9IGZ1bmN0aW9uKHN0ZXApIHtcclxuICAgICAgICAgICAgcmV0dXJuICEhc2VsZi5zdGVwc1tzdGVwXTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgc2VsZi5jbGVhbmFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgaW4gc2VsZi5zdGVwcyl7XHJcbiAgICAgICAgICAgICAgc2VsZi5zdGVwc1tpXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHNlbGYuY3JlYXRlc3RlcHMgPSBmdW5jdGlvbihxKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RlcHMgPSBbXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMTsgaSA8PSBxOyBpKyspIHNlbGYuc3RlcHNbaV0gPSBmYWxzZTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogbWFza2VkLGpzXG4gKiBJbml0aWFsaXplcyB0aGUgbWFza2VkIGlucHV0c1xuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mb3JtcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ21hc2tlZCcsIG1hc2tlZCk7XG5cbiAgICBmdW5jdGlvbiBtYXNrZWQgKCkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgdmFyICRlbGVtID0gJChlbGVtZW50KTtcbiAgICAgICAgICBpZigkLmZuLmlucHV0bWFzaylcbiAgICAgICAgICAgICRlbGVtLmlucHV0bWFzaygpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXHJcbiAqIEFuZ3VsYXJKUyBkZWZhdWx0IGZpbHRlciB3aXRoIHRoZSBmb2xsb3dpbmcgZXhwcmVzc2lvbjpcclxuICogXCJwZXJzb24gaW4gcGVvcGxlIHwgZmlsdGVyOiB7bmFtZTogJHNlbGVjdC5zZWFyY2gsIGFnZTogJHNlbGVjdC5zZWFyY2h9XCJcclxuICogcGVyZm9ybXMgYSBBTkQgYmV0d2VlbiAnbmFtZTogJHNlbGVjdC5zZWFyY2gnIGFuZCAnYWdlOiAkc2VsZWN0LnNlYXJjaCcuXHJcbiAqIFdlIHdhbnQgdG8gcGVyZm9ybSBhIE9SLlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZvcm1zJylcclxuICAgICAgICAuZmlsdGVyKCdwcm9wc0ZpbHRlcicsIHByb3BzRmlsdGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBwcm9wc0ZpbHRlcigpIHtcclxuICAgICAgICByZXR1cm4gZmlsdGVyRmlsdGVyO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgZnVuY3Rpb24gZmlsdGVyRmlsdGVyKGl0ZW1zLCBwcm9wcykge1xyXG4gICAgICAgICAgdmFyIG91dCA9IFtdO1xyXG5cclxuICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoaXRlbXMpKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgIHZhciBpdGVtTWF0Y2hlcyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BzKTtcclxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wID0ga2V5c1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gcHJvcHNbcHJvcF0udG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtW3Byb3BdLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICBpdGVtTWF0Y2hlcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKGl0ZW1NYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICBvdXQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTGV0IHRoZSBvdXRwdXQgYmUgdGhlIGlucHV0IHVudG91Y2hlZFxyXG4gICAgICAgICAgICBvdXQgPSBpdGVtcztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IHRhZ3MtaW5wdXQuanNcbiAqIEluaXRpYWxpemVzIHRoZSB0YWcgaW5wdXRzIHBsdWdpblxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mb3JtcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3RhZ3NpbnB1dCcsIHRhZ3NpbnB1dCk7XG5cbiAgICB0YWdzaW5wdXQuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcbiAgICBmdW5jdGlvbiB0YWdzaW5wdXQgKCR0aW1lb3V0KSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XG4gICAgICAgICAgZWxlbWVudC5vbignaXRlbUFkZGVkIGl0ZW1SZW1vdmVkJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHZpZXcgdmFsdWUgaXMgbm90IGVtcHR5IGFuZCBpcyBhIHN0cmluZ1xuICAgICAgICAgICAgLy8gYW5kIHVwZGF0ZSB0aGUgdmlldyBmcm9tIHN0cmluZyB0byBhbiBhcnJheSBvZiB0YWdzXG4gICAgICAgICAgICBpZihuZ01vZGVsLiR2aWV3VmFsdWUgJiYgbmdNb2RlbC4kdmlld1ZhbHVlLnNwbGl0KSB7XG4gICAgICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZSggbmdNb2RlbC4kdmlld1ZhbHVlLnNwbGl0KCcsJykgKTtcbiAgICAgICAgICAgICAgbmdNb2RlbC4kcmVuZGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgZWxlbWVudC50YWdzaW5wdXQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiB2YWxpZGF0ZS1mb3JtLmpzXG4gKiBJbml0aWFsaXplcyB0aGUgdmFsaWRhdGlvbiBwbHVnaW4gUGFyc2xleVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mb3JtcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3ZhbGlkYXRlRm9ybScsIHZhbGlkYXRlRm9ybSk7XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZUZvcm0gKCkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgdmFyICRlbGVtID0gJChlbGVtZW50KTtcbiAgICAgICAgICBpZigkLmZuLnBhcnNsZXkpXG4gICAgICAgICAgICAkZWxlbS5wYXJzbGV5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgLm1vZHVsZSgnYXBwLml0ZW1zJywgW10pXG4gICAgICAuY29udHJvbGxlcignSXRlbXNDb250cm9sbGVyJywgSXRlbXNDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ1N0b2NrRGlhbG9nQ29udHJvbGxlcicsIFN0b2NrRGlhbG9nQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdTdG9ja3NDb250cm9sbGVyJywgU3RvY2tzQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdJdGVtQWRkQ29udHJvbGxlcicsIEl0ZW1BZGRDb250cm9sbGVyKTtcbiAgICBcbiAgICBJdGVtc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ25nVGFibGVQYXJhbXMnLCAnU2t1JywgJ25nRGlhbG9nJywgJ1N3ZWV0QWxlcnQnLCAnbmdUYWJsZUxCU2VydmljZSddO1xuICAgIGZ1bmN0aW9uIEl0ZW1zQ29udHJvbGxlcigkc2NvcGUsIG5nVGFibGVQYXJhbXMsIFNrdSwgbmdEaWFsb2csIFN3ZWV0QWxlcnQsIG5nVGFibGVMQlNlcnZpY2UpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICBcbiAgICAgIGFjdGl2YXRlKCk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICB2bS5rZXl3b3JkID0gXCJcIjtcbiAgICAgICAgdm0udGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7Y291bnQ6IDEwfSwge1xuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCRkZWZlciwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyID0ge1xuICAgICAgICAgICAgICB3aGVyZTp7c3RhdHVzOntuZTonZGVsZXRlZCd9fSwgXG4gICAgICAgICAgICAgIGluY2x1ZGU6W1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHJlbGF0aW9uOidpbnZlbnRvcmllcycsXG4gICAgICAgICAgICAgICAgICBzY29wZTp7IHdoZXJlOiB7c2hvcElkOiAkc2NvcGUudXNlci5zaG9wLmlkfSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYodm0ua2V5d29yZCAhPSAnJykge1xuICAgICAgICAgICAgICB2YXIgcXMgPSB7cmVnZXg6IGtleXdvcmR9O1xuICAgICAgICAgICAgICBmaWx0ZXIud2hlcmUub3IgPSBbe1wiaXRlbS5uYW1lXCI6cXN9LCB7bW9kZWw6cXN9XTtcbiAgICAgICAgICAgICAgcGFyYW1zLnBhZ2UoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZ1RhYmxlTEJTZXJ2aWNlLmdldERhdGEoJGRlZmVyLCBwYXJhbXMsIFNrdSwgZmlsdGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICB2bS5zdG9jayA9IGZ1bmN0aW9uIChza3UsIHR5cGUpIHtcbiAgICAgICAgbmdEaWFsb2cub3Blbih7IFxuICAgICAgICAgIHRlbXBsYXRlOiAnc3RvY2tEaWFsb2dJZCcsIFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdTdG9ja0RpYWxvZ0NvbnRyb2xsZXInLCBcbiAgICAgICAgICBkYXRhOiB7c2t1OiBza3UsIHR5cGU6IHR5cGV9IFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0uZGVsZXRlID0gZnVuY3Rpb24gKHNrdSkge1xuICAgICAgICBTd2VldEFsZXJ0LnN3YWwoeyAgIFxuICAgICAgICAgIHRpdGxlOiAn56Gu5a6a5Yig6Zmk5ZWG5ZOBJytza3UuaXRlbS5uYW1lLCAgIFxuICAgICAgICAgIHRleHQ6ICfliKDpmaTllYblk4HlkI7lsIbml6Dms5XmgaLlpI3vvIzkvaDnoa7lrpropoHliKDpmaTllYblk4HvvJ8nLCAgIFxuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJywgICBcbiAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLCAgIFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogJyNERDZCNTUnLCAgIFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAn5piv55qE77yM5Yig6Zmk77yBJyxcbiAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiAn5LiN77yM5Y+W5raI77yBJywgICBcbiAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgfSwgIGZ1bmN0aW9uKGlzQ29uZmlybSl7ICBcbiAgICAgICAgICBpZihpc0NvbmZpcm0pIHtcbiAgICAgICAgICAgIHNrdS5zdGF0dXMgPSAnZGVsZXRlZCc7XG4gICAgICAgICAgICBza3UuJHNhdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBTd2VldEFsZXJ0LnN3YWwoJ+W3suWIoOmZpCEnLCfkvaDnmoTllYblk4EnK3NrdS5pdGVtLm5hbWUrJ+W3sue7j+WIoOmZpOOAgicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgIFN3ZWV0QWxlcnQuc3dhbCgn5aSx6LSlIScsICfliKDpmaTllYblk4Hml7blj5HnlJ/plJnor6/vvIzkvaDnmoTllYblk4HmsqHmnInooqvliKDpmaTjgIInLCAnZXJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmNvbmZpcm0gPSBmdW5jdGlvbiAoc2t1KSB7XG4gICAgICAgIHZhciBxdHkgPSAwO1xuICAgICAgICB2YXIgaW52ZW50b3J5ID0gc2t1LmludmVudG9yaWVzWzBdO1xuICAgICAgICBpZihpbnZlbnRvcnkpIHtcbiAgICAgICAgICBxdHkgPSBpbnZlbnRvcnkuYmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICBTa3Uuc3RvY2tzLmNyZWF0ZSh7aWQ6IHNrdS5pZH0sIHt0eXBlOiAnaW52ZW50b3J5JywgcXR5OiBxdHl9KS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgU3dlZXRBbGVydC5zd2FsKCfnm5jngrnmiJDlip8hJywn5L2g55qE5ZWG5ZOBJytza3UuaXRlbS5uYW1lKyflt7Lnu4/nm5jngrnnoa7orqTjgIInLCAnc3VjY2VzcycpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgIH1cbiAgICBcbiAgICBJdGVtQWRkQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnSXRlbSddO1xuICAgIGZ1bmN0aW9uIEl0ZW1BZGRDb250cm9sbGVyKCRzY29wZSwgSXRlbSkge1xuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgd2luZG93LlBhcnNsZXlWYWxpZGF0b3Iuc2V0TG9jYWxlKCd6aF9jbicpO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgJHNjb3BlLmVudGl0eSA9IHtcbiAgICAgICAgICB0eXBlOiBcImVudGl0eVwiLFxuICAgICAgICAgIG5hbWU6IFwiaVBob25lNlMgUGx1c1wiLFxuICAgICAgICAgIHNrdXM6IFt7YmFyY29kZTogXCI0NTZcIiwgcHJpY2U6IDYwODgwMCwgbW9kZWw6IFwiMTZHQlwiLCBzdG9ja1F0eTozfV1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIEl0ZW0uY3JlYXRlKCRzY29wZS5lbnRpdHkpLiRwcm9taXNlXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgJHNjb3BlLiRzdGF0ZS5nbygnYXBwLml0ZW0nKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgICRzY29wZS5zYXZlQW5kTW9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgSXRlbS5jcmVhdGUoJHNjb3BlLmVudGl0eSlcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgU3RvY2tEaWFsb2dDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICduZ0RpYWxvZycsICdTdG9jaycsICd0b2FzdGVyJywgJyRmaWx0ZXInXTtcbiAgICBmdW5jdGlvbiBTdG9ja0RpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCBuZ0RpYWxvZywgU3RvY2ssIHRvYXN0ZXIsICRmaWx0ZXIpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAkc2NvcGUuc3RvY2tRdHkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY29uZmlybSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgc2t1ID0gJHNjb3BlLm5nRGlhbG9nRGF0YS5za3U7XG4gICAgICAgICAgdmFyIHR5cGUgPSAkc2NvcGUubmdEaWFsb2dEYXRhLnR5cGU7XG4gICAgICAgICAgdmFyIG1lbW8gPSAkc2NvcGUubmdEaWFsb2dEYXRhLm1lbW87XG4gICAgICAgICAgU3RvY2suY3JlYXRlKHtza3VJZDogc2t1LmlkLCBxdHk6ICRzY29wZS5zdG9ja1F0eSwgdHlwZTogdHlwZSwgbWVtbzogbWVtb30pO1xuICAgICAgICAgIHNrdS5pbnZlbnRvcmllc1swXS5xdHkgKz0gJHNjb3BlLnN0b2NrUXR5O1xuICAgICAgICAgIG5nRGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAn5oiQ5YqfJyxcbiAgICAgICAgICAgXCLlrozmiJBcIiskZmlsdGVyKCdzdG9ja190eXBlJykodHlwZSkrc2t1Lml0ZW0ubmFtZStcIjogXCIrJHNjb3BlLnN0b2NrUXR5K1wi5Lu2XCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIFN0b2Nrc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ1N0b2NrJywgJ25nVGFibGVQYXJhbXMnXTtcbiAgICBmdW5jdGlvbiBTdG9ja3NDb250cm9sbGVyKCRzY29wZSwgU3RvY2ssIG5nVGFibGVQYXJhbXMpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICBcbiAgICAgIGFjdGl2ZSgpO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBhY3RpdmUoKSB7XG4gICAgICAgIHZtLmZpbHRlciA9IHt0ZXh0OiAnJ31cbiAgICAgICAgdm0udGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7XG4gICAgICAgICAgY291bnQ6IDEwLFxuICAgICAgICAgIGZpbHRlcjogdm0uZmlsdGVyLnRleHRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCRkZWZlciwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgb3B0ID0ge3doZXJlOnt9LCBpbmNsdWRlOlsnc2t1J119XG4gICAgICAgICAgICBvcHQubGltaXQgPSBwYXJhbXMuY291bnQoKVxuICAgICAgICAgICAgb3B0LnNraXAgPSAocGFyYW1zLnBhZ2UoKS0xKSpvcHQubGltaXRcbiAgICAgICAgICAgIGlmKHZtLmZpbHRlci50ZXh0ICE9ICcnKSB7XG4gICAgICAgICAgICAgIG9wdC5za2lwID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFN0b2NrLmNvdW50KHt3aGVyZTogb3B0LndoZXJlfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICB2bS50YWJsZVBhcmFtcy50b3RhbChyZXN1bHQuY291bnQpXG4gICAgICAgICAgICAgIFN0b2NrLmZpbmQoe2ZpbHRlcjpvcHR9LCAkZGVmZXIucmVzb2x2ZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbn0pKCk7IiwiLyoqXG4gKiBBbmd1bGFySlMgZGVmYXVsdCBmaWx0ZXIgd2l0aCB0aGUgZm9sbG93aW5nIGV4cHJlc3Npb246XG4gKiBcInBlcnNvbiBpbiBwZW9wbGUgfCBmaWx0ZXI6IHtuYW1lOiAkc2VsZWN0LnNlYXJjaCwgYWdlOiAkc2VsZWN0LnNlYXJjaH1cIlxuICogcGVyZm9ybXMgYSBBTkQgYmV0d2VlbiAnbmFtZTogJHNlbGVjdC5zZWFyY2gnIGFuZCAnYWdlOiAkc2VsZWN0LnNlYXJjaCcuXG4gKiBXZSB3YW50IHRvIHBlcmZvcm0gYSBPUi5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuaXRlbXMnKVxuICAgICAgICAuZmlsdGVyKCdpdGVtX3R5cGUnLCBpdGVtVHlwZUZpbHRlcilcbiAgICAgICAgLmZpbHRlcignc3RvY2tfdHlwZScsIHN0b2NrVHlwZUZpbHRlcilcbiAgICAgICAgLmZpbHRlcignY3VycmVuY3lfY255JywgY3VycmVuY3lDTllGaWx0ZXIpXG4gICAgO1xuXG4gICAgZnVuY3Rpb24gaXRlbVR5cGVGaWx0ZXIoKSB7XG4gICAgICAgIHZhciB0eXBlID0ge1xuICAgICAgICAgIGVudGl0eTogXCLlrp7nianllYblk4FcIixcbiAgICAgICAgICBzZXJ2aWNlOiBcIuacjeWKoemhueebrlwiXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIHJldHVybiB0eXBlW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY3VycmVuY3lDTllGaWx0ZXIoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICByZXR1cm4gXCLCpSBcIit2YWwvMTAwO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzdG9ja1R5cGVGaWx0ZXIoKSB7XG4gICAgICB2YXIgdHlwZSA9IHtcbiAgICAgICAgc3RvY2s6IFwi6L+b6LSn5YWl5bqTXCIsXG4gICAgICAgIHNhbGU6IFwi6ZSA5ZSu5Ye65bqTXCIsXG4gICAgICAgIGNhbmNlbDogXCLmoLjplIDlh7rlupNcIixcbiAgICAgICAgaW52ZW50b3J5OiBcIuebmOeCueS/ruato1wiLFxuICAgICAgICB0cmFuc2ZlcjogXCLlupPlrZjosIPotKdcIlxuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAga2V5ID0ga2V5IHx8ICdzdG9jayc7XG4gICAgICAgIHJldHVybiB0eXBlW2tleV07XG4gICAgICB9XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmxhenlsb2FkJylcclxuICAgICAgICAuY29uZmlnKGxhenlsb2FkQ29uZmlnKTtcclxuXHJcbiAgICBsYXp5bG9hZENvbmZpZy4kaW5qZWN0ID0gWyckb2NMYXp5TG9hZFByb3ZpZGVyJywgJ0FQUF9SRVFVSVJFUyddO1xyXG4gICAgZnVuY3Rpb24gbGF6eWxvYWRDb25maWcoJG9jTGF6eUxvYWRQcm92aWRlciwgQVBQX1JFUVVJUkVTKXtcclxuXHJcbiAgICAgIC8vIExhenkgTG9hZCBtb2R1bGVzIGNvbmZpZ3VyYXRpb25cclxuICAgICAgJG9jTGF6eUxvYWRQcm92aWRlci5jb25maWcoe1xyXG4gICAgICAgIGRlYnVnOiBmYWxzZSxcclxuICAgICAgICBldmVudHM6IHRydWUsXHJcbiAgICAgICAgbW9kdWxlczogQVBQX1JFUVVJUkVTLm1vZHVsZXNcclxuICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmxhenlsb2FkJylcclxuICAgICAgICAuY29uc3RhbnQoJ0FQUF9SRVFVSVJFUycsIHtcclxuICAgICAgICAgIC8vIGpRdWVyeSBiYXNlZCBhbmQgc3RhbmRhbG9uZSBzY3JpcHRzXHJcbiAgICAgICAgICBzY3JpcHRzOiB7XHJcbiAgICAgICAgICAgICd3aGlybCc6ICAgICAgICAgICAgICBbJ3ZlbmRvci93aGlybC9kaXN0L3doaXJsLmNzcyddLFxyXG4gICAgICAgICAgICAnY2xhc3N5bG9hZGVyJzogICAgICAgWyd2ZW5kb3IvanF1ZXJ5LWNsYXNzeWxvYWRlci9qcy9qcXVlcnkuY2xhc3N5bG9hZGVyLm1pbi5qcyddLFxyXG4gICAgICAgICAgICAnYW5pbW8nOiAgICAgICAgICAgICAgWyd2ZW5kb3IvYW5pbW8uanMvYW5pbW8uanMnXSxcclxuICAgICAgICAgICAgJ2Zhc3RjbGljayc6ICAgICAgICAgIFsndmVuZG9yL2Zhc3RjbGljay9saWIvZmFzdGNsaWNrLmpzJ10sXHJcbiAgICAgICAgICAgICdtb2Rlcm5penInOiAgICAgICAgICBbJ3ZlbmRvci9tb2Rlcm5penIvbW9kZXJuaXpyLmpzJ10sXHJcbiAgICAgICAgICAgICdhbmltYXRlJzogICAgICAgICAgICBbJ3ZlbmRvci9hbmltYXRlLmNzcy9hbmltYXRlLm1pbi5jc3MnXSxcclxuICAgICAgICAgICAgJ3NreWNvbnMnOiAgICAgICAgICAgIFsndmVuZG9yL3NreWNvbnMvc2t5Y29ucy5qcyddLFxyXG4gICAgICAgICAgICAnaWNvbnMnOiAgICAgICAgICAgICAgWyd2ZW5kb3IvZm9udGF3ZXNvbWUvY3NzL2ZvbnQtYXdlc29tZS5taW4uY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3NpbXBsZS1saW5lLWljb25zL2Nzcy9zaW1wbGUtbGluZS1pY29ucy5jc3MnXSxcclxuICAgICAgICAgICAgJ3dlYXRoZXItaWNvbnMnOiAgICAgIFsndmVuZG9yL3dlYXRoZXItaWNvbnMvY3NzL3dlYXRoZXItaWNvbnMubWluLmNzcyddLFxyXG4gICAgICAgICAgICAnc3BhcmtsaW5lcyc6ICAgICAgICAgWydhcHAvdmVuZG9yL3NwYXJrbGluZXMvanF1ZXJ5LnNwYXJrbGluZS5taW4uanMnXSxcclxuICAgICAgICAgICAgJ3d5c2l3eWcnOiAgICAgICAgICAgIFsndmVuZG9yL2Jvb3RzdHJhcC13eXNpd3lnL2Jvb3RzdHJhcC13eXNpd3lnLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2Jvb3RzdHJhcC13eXNpd3lnL2V4dGVybmFsL2pxdWVyeS5ob3RrZXlzLmpzJ10sXHJcbiAgICAgICAgICAgICdzbGltc2Nyb2xsJzogICAgICAgICBbJ3ZlbmRvci9zbGltU2Nyb2xsL2pxdWVyeS5zbGltc2Nyb2xsLm1pbi5qcyddLFxyXG4gICAgICAgICAgICAnc2NyZWVuZnVsbCc6ICAgICAgICAgWyd2ZW5kb3Ivc2NyZWVuZnVsbC9kaXN0L3NjcmVlbmZ1bGwuanMnXSxcclxuICAgICAgICAgICAgJ3ZlY3Rvci1tYXAnOiAgICAgICAgIFsndmVuZG9yL2lrYS5qdmVjdG9ybWFwL2pxdWVyeS1qdmVjdG9ybWFwLTEuMi4yLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9pa2EuanZlY3Rvcm1hcC9qcXVlcnktanZlY3Rvcm1hcC0xLjIuMi5jc3MnXSxcclxuICAgICAgICAgICAgJ3ZlY3Rvci1tYXAtbWFwcyc6ICAgIFsndmVuZG9yL2lrYS5qdmVjdG9ybWFwL2pxdWVyeS1qdmVjdG9ybWFwLXdvcmxkLW1pbGwtZW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvaWthLmp2ZWN0b3JtYXAvanF1ZXJ5LWp2ZWN0b3JtYXAtdXMtbWlsbC1lbi5qcyddLFxyXG4gICAgICAgICAgICAnbG9hZEdvb2dsZU1hcHNKUyc6ICAgWydhcHAvdmVuZG9yL2dtYXAvbG9hZC1nb29nbGUtbWFwcy5qcyddLFxyXG4gICAgICAgICAgICAnZmxvdC1jaGFydCc6ICAgICAgICAgWyd2ZW5kb3IvRmxvdC9qcXVlcnkuZmxvdC5qcyddLFxyXG4gICAgICAgICAgICAnZmxvdC1jaGFydC1wbHVnaW5zJzogWyd2ZW5kb3IvZmxvdC50b29sdGlwL2pzL2pxdWVyeS5mbG90LnRvb2x0aXAubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL0Zsb3QvanF1ZXJ5LmZsb3QucmVzaXplLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL0Zsb3QvanF1ZXJ5LmZsb3QucGllLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL0Zsb3QvanF1ZXJ5LmZsb3QudGltZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9GbG90L2pxdWVyeS5mbG90LmNhdGVnb3JpZXMuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvZmxvdC1zcGxpbmUvanMvanF1ZXJ5LmZsb3Quc3BsaW5lLm1pbi5qcyddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ganF1ZXJ5IGNvcmUgYW5kIHdpZGdldHNcclxuICAgICAgICAgICAgJ2pxdWVyeS11aSc6ICAgICAgICAgIFsndmVuZG9yL2pxdWVyeS11aS91aS9jb3JlLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2pxdWVyeS11aS91aS93aWRnZXQuanMnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsb2FkcyBvbmx5IGpxdWVyeSByZXF1aXJlZCBtb2R1bGVzIGFuZCB0b3VjaCBzdXBwb3J0XHJcbiAgICAgICAgICAgICdqcXVlcnktdWktd2lkZ2V0cyc6ICBbJ3ZlbmRvci9qcXVlcnktdWkvdWkvY29yZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9qcXVlcnktdWkvdWkvd2lkZ2V0LmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2pxdWVyeS11aS91aS9tb3VzZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9qcXVlcnktdWkvdWkvZHJhZ2dhYmxlLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2pxdWVyeS11aS91aS9kcm9wcGFibGUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvanF1ZXJ5LXVpL3VpL3NvcnRhYmxlLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2pxdWVyeXVpLXRvdWNoLXB1bmNoL2pxdWVyeS51aS50b3VjaC1wdW5jaC5taW4uanMnXSxcclxuICAgICAgICAgICAgJ21vbWVudCcgOiAgICAgICAgICAgIFsndmVuZG9yL21vbWVudC9taW4vbW9tZW50LXdpdGgtbG9jYWxlcy5taW4uanMnXSxcclxuICAgICAgICAgICAgJ2lucHV0bWFzayc6ICAgICAgICAgIFsndmVuZG9yL2pxdWVyeS5pbnB1dG1hc2svZGlzdC9qcXVlcnkuaW5wdXRtYXNrLmJ1bmRsZS5taW4uanMnXSxcclxuICAgICAgICAgICAgJ2ZsYXRkb2MnOiAgICAgICAgICAgIFsndmVuZG9yL2ZsYXRkb2MvZmxhdGRvYy5qcyddLFxyXG4gICAgICAgICAgICAnY29kZW1pcnJvcic6ICAgICAgICAgWyd2ZW5kb3IvY29kZW1pcnJvci9saWIvY29kZW1pcnJvci5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9jb2RlbWlycm9yL2xpYi9jb2RlbWlycm9yLmNzcyddLFxyXG4gICAgICAgICAgICAvLyBtb2RlcyBmb3IgY29tbW9uIHdlYiBmaWxlc1xyXG4gICAgICAgICAgICAnY29kZW1pcnJvci1tb2Rlcy13ZWInOiBbJ3ZlbmRvci9jb2RlbWlycm9yL21vZGUvamF2YXNjcmlwdC9qYXZhc2NyaXB0LmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvY29kZW1pcnJvci9tb2RlL3htbC94bWwuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9jb2RlbWlycm9yL21vZGUvaHRtbG1peGVkL2h0bWxtaXhlZC5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2NvZGVtaXJyb3IvbW9kZS9jc3MvY3NzLmpzJ10sXHJcbiAgICAgICAgICAgICd0YWdpbnB1dCcgOiAgICAgICAgICBbJ3ZlbmRvci9ib290c3RyYXAtdGFnc2lucHV0L2Rpc3QvYm9vdHN0cmFwLXRhZ3NpbnB1dC5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYm9vdHN0cmFwLXRhZ3NpbnB1dC9kaXN0L2Jvb3RzdHJhcC10YWdzaW5wdXQubWluLmpzJ10sXHJcbiAgICAgICAgICAgICdmaWxlc3R5bGUnOiAgICAgICAgICBbJ3ZlbmRvci9ib290c3RyYXAtZmlsZXN0eWxlL3NyYy9ib290c3RyYXAtZmlsZXN0eWxlLmpzJ10sXHJcbiAgICAgICAgICAgICdwYXJzbGV5JzogICAgICAgICAgICBbJ3ZlbmRvci9wYXJzbGV5anMvc3JjL2kxOG4vemhfY24uZXh0cmEuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvcGFyc2xleWpzL2Rpc3QvcGFyc2xleS5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvcGFyc2xleWpzL3NyYy9pMThuL3poX2NuLmpzJ10sXHJcbiAgICAgICAgICAgICdmdWxsY2FsZW5kYXInOiAgICAgICBbJ3ZlbmRvci9mdWxsY2FsZW5kYXIvZGlzdC9mdWxsY2FsZW5kYXIubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2Z1bGxjYWxlbmRhci9kaXN0L2Z1bGxjYWxlbmRhci5jc3MnXSxcclxuICAgICAgICAgICAgJ2djYWwnOiAgICAgICAgICAgICAgIFsndmVuZG9yL2Z1bGxjYWxlbmRhci9kaXN0L2djYWwuanMnXSxcclxuICAgICAgICAgICAgJ2NoYXJ0anMnOiAgICAgICAgICAgIFsndmVuZG9yL0NoYXJ0LmpzL0NoYXJ0LmpzJ10sXHJcbiAgICAgICAgICAgICdtb3JyaXMnOiAgICAgICAgICAgICBbJ3ZlbmRvci9yYXBoYWVsL3JhcGhhZWwuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvbW9ycmlzLmpzL21vcnJpcy5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9tb3JyaXMuanMvbW9ycmlzLmNzcyddLFxyXG4gICAgICAgICAgICAnbG9hZGVycy5jc3MnOiAgICAgICAgICBbJ3ZlbmRvci9sb2FkZXJzLmNzcy9sb2FkZXJzLmNzcyddLFxyXG4gICAgICAgICAgICAnc3BpbmtpdCc6ICAgICAgICAgICAgICBbJ3ZlbmRvci9zcGlua2l0L2Nzcy9zcGlua2l0LmNzcyddXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgLy8gQW5ndWxhciBiYXNlZCBzY3JpcHQgKHVzZSB0aGUgcmlnaHQgbW9kdWxlIG5hbWUpXHJcbiAgICAgICAgICBtb2R1bGVzOiBbXHJcbiAgICAgICAgICAgIHtuYW1lOiAndG9hc3RlcicsICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyanMtdG9hc3Rlci90b2FzdGVyLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhcmpzLXRvYXN0ZXIvdG9hc3Rlci5jc3MnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnbG9jYWx5dGljcy5kaXJlY3RpdmVzJywgICAgIGZpbGVzOiBbJ3ZlbmRvci9jaG9zZW5fdjEuMi4wL2Nob3Nlbi5qcXVlcnkubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvY2hvc2VuX3YxLjIuMC9jaG9zZW4ubWluLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FuZ3VsYXItY2hvc2VuLWxvY2FseXRpY3MvY2hvc2VuLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ25nRGlhbG9nJywgICAgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvbmdEaWFsb2cvanMvbmdEaWFsb2cubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvbmdEaWFsb2cvY3NzL25nRGlhbG9nLm1pbi5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9uZ0RpYWxvZy9jc3MvbmdEaWFsb2ctdGhlbWUtZGVmYXVsdC5taW4uY3NzJ10gfSxcclxuICAgICAgICAgICAge25hbWU6ICduZ1dpZycsICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL25nV2lnL2Rpc3Qvbmctd2lnLm1pbi5qcyddIH0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnbmdUYWJsZScsICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9uZy10YWJsZS9kaXN0L25nLXRhYmxlLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9uZy10YWJsZS9kaXN0L25nLXRhYmxlLm1pbi5jc3MnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnbmdUYWJsZUV4cG9ydCcsICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9uZy10YWJsZS1leHBvcnQvbmctdGFibGUtZXhwb3J0LmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2FuZ3VsYXJCb290c3RyYXBOYXZUcmVlJywgICBmaWxlczogWyd2ZW5kb3IvYW5ndWxhci1ib290c3RyYXAtbmF2LXRyZWUvZGlzdC9hYm5fdHJlZV9kaXJlY3RpdmUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1ib290c3RyYXAtbmF2LXRyZWUvZGlzdC9hYm5fdHJlZS5jc3MnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnaHRtbFNvcnRhYmxlJywgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9odG1sLnNvcnRhYmxlL2Rpc3QvaHRtbC5zb3J0YWJsZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9odG1sLnNvcnRhYmxlL2Rpc3QvaHRtbC5zb3J0YWJsZS5hbmd1bGFyLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ3hlZGl0YWJsZScsICAgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvYW5ndWxhci14ZWRpdGFibGUvZGlzdC9qcy94ZWRpdGFibGUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci14ZWRpdGFibGUvZGlzdC9jc3MveGVkaXRhYmxlLmNzcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICdhbmd1bGFyRmlsZVVwbG9hZCcsICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2FuZ3VsYXItZmlsZS11cGxvYWQvYW5ndWxhci1maWxlLXVwbG9hZC5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICduZ0ltZ0Nyb3AnLCAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL25nLWltZy1jcm9wL2NvbXBpbGUvdW5taW5pZmllZC9uZy1pbWctY3JvcC5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9uZy1pbWctY3JvcC9jb21waWxlL3VubWluaWZpZWQvbmctaW1nLWNyb3AuY3NzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ3VpLnNlbGVjdCcsICAgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvYW5ndWxhci11aS1zZWxlY3QvZGlzdC9zZWxlY3QuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci11aS1zZWxlY3QvZGlzdC9zZWxlY3QuY3NzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ3VpLmNvZGVtaXJyb3InLCAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvYW5ndWxhci11aS1jb2RlbWlycm9yL3VpLWNvZGVtaXJyb3IuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnYW5ndWxhci1jYXJvdXNlbCcsICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLWNhcm91c2VsL2Rpc3QvYW5ndWxhci1jYXJvdXNlbC5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1jYXJvdXNlbC9kaXN0L2FuZ3VsYXItY2Fyb3VzZWwuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnbmdHcmlkJywgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9uZy1ncmlkL2J1aWxkL25nLWdyaWQubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL25nLWdyaWQvbmctZ3JpZC5jc3MnIF19LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2luZmluaXRlLXNjcm9sbCcsICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvbmdJbmZpbml0ZVNjcm9sbC9idWlsZC9uZy1pbmZpbml0ZS1zY3JvbGwuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAndWkuYm9vdHN0cmFwLXNsaWRlcicsICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9zZWl5cmlhLWJvb3RzdHJhcC1zbGlkZXIvZGlzdC9ib290c3RyYXAtc2xpZGVyLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9zZWl5cmlhLWJvb3RzdHJhcC1zbGlkZXIvZGlzdC9jc3MvYm9vdHN0cmFwLXNsaWRlci5taW4uY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FuZ3VsYXItYm9vdHN0cmFwLXNsaWRlci9zbGlkZXIuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAndWkuZ3JpZCcsICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLXVpLWdyaWQvdWktZ3JpZC5taW4uY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FuZ3VsYXItdWktZ3JpZC91aS1ncmlkLm1pbi5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICd0ZXh0QW5ndWxhcicsICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL3RleHRBbmd1bGFyL2Rpc3QvdGV4dEFuZ3VsYXIuY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3RleHRBbmd1bGFyL2Rpc3QvdGV4dEFuZ3VsYXItcmFuZ3kubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3RleHRBbmd1bGFyL2Rpc3QvdGV4dEFuZ3VsYXItc2FuaXRpemUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvdGV4dEFuZ3VsYXIvc3JjL2dsb2JhbHMuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvdGV4dEFuZ3VsYXIvc3JjL2ZhY3Rvcmllcy5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci90ZXh0QW5ndWxhci9zcmMvRE9NLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3RleHRBbmd1bGFyL3NyYy92YWxpZGF0b3JzLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3RleHRBbmd1bGFyL3NyYy90YUJpbmQuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvdGV4dEFuZ3VsYXIvc3JjL21haW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvdGV4dEFuZ3VsYXIvZGlzdC90ZXh0QW5ndWxhclNldHVwLmpzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHNlcmllOiB0cnVlfSxcclxuICAgICAgICAgICAge25hbWU6ICdhbmd1bGFyLXJpY2tzaGF3JywgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2QzL2QzLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9yaWNrc2hhdy9yaWNrc2hhdy5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9yaWNrc2hhdy9yaWNrc2hhdy5taW4uY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FuZ3VsYXItcmlja3NoYXcvcmlja3NoYXcuanMnXSwgc2VyaWU6IHRydWV9LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2FuZ3VsYXItY2hhcnRpc3QnLCAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvY2hhcnRpc3QvZGlzdC9jaGFydGlzdC5taW4uY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2NoYXJ0aXN0L2Rpc3QvY2hhcnRpc3QuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1jaGFydGlzdC5qcy9kaXN0L2FuZ3VsYXItY2hhcnRpc3QuanMnXSwgc2VyaWU6IHRydWV9LFxyXG4gICAgICAgICAgICB7bmFtZTogJ3VpLm1hcCcsICAgICAgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvYW5ndWxhci11aS1tYXAvdWktbWFwLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2RhdGF0YWJsZXMnLCAgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvZGF0YXRhYmxlcy9tZWRpYS9jc3MvanF1ZXJ5LmRhdGFUYWJsZXMuY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2RhdGF0YWJsZXMvbWVkaWEvanMvanF1ZXJ5LmRhdGFUYWJsZXMuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1kYXRhdGFibGVzL2Rpc3QvYW5ndWxhci1kYXRhdGFibGVzLmpzJ10sIHNlcmllOiB0cnVlfSxcclxuICAgICAgICAgICAge25hbWU6ICdhbmd1bGFyLWpxY2xvdWQnLCAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2pxY2xvdWQyL2Rpc3QvanFjbG91ZC5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvanFjbG91ZDIvZGlzdC9qcWNsb3VkLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FuZ3VsYXItanFjbG91ZC9hbmd1bGFyLWpxY2xvdWQuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnYW5ndWxhckdyaWQnLCAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hZy1ncmlkL2Rpc3QvYW5ndWxhci1ncmlkLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hZy1ncmlkL2Rpc3QvYW5ndWxhci1ncmlkLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FnLWdyaWQvZGlzdC90aGVtZS1kYXJrLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hZy1ncmlkL2Rpc3QvdGhlbWUtZnJlc2guY3NzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ25nLW5lc3RhYmxlJywgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvbmctbmVzdGFibGUvc3JjL2FuZ3VsYXItbmVzdGFibGUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvbmVzdGFibGUvanF1ZXJ5Lm5lc3RhYmxlLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2Frb2VuaWcuZGVja2dyaWQnLCAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvYW5ndWxhci1kZWNrZ3JpZC9hbmd1bGFyLWRlY2tncmlkLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ29pdG96ZXJvLm5nU3dlZXRBbGVydCcsICAgICBmaWxlczogWyd2ZW5kb3Ivc3dlZXRhbGVydC9kaXN0L3N3ZWV0YWxlcnQuY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3N3ZWV0YWxlcnQvZGlzdC9zd2VldGFsZXJ0Lm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLXN3ZWV0YWxlcnQvU3dlZXRBbGVydC5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICdibS5ic1RvdXInLCAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2Jvb3RzdHJhcC10b3VyL2J1aWxkL2Nzcy9ib290c3RyYXAtdG91ci5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYm9vdHN0cmFwLXRvdXIvYnVpbGQvanMvYm9vdHN0cmFwLXRvdXItc3RhbmRhbG9uZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLWJvb3RzdHJhcC10b3VyL2Rpc3QvYW5ndWxhci1ib290c3RyYXAtdG91ci5qcyddLCBzZXJpZTogdHJ1ZX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAndWkua25vYicsICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLWtub2Ivc3JjL2FuZ3VsYXIta25vYi5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9qcXVlcnkta25vYi9kaXN0L2pxdWVyeS5rbm9iLm1pbi5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICdlYXN5cGllY2hhcnQnLCAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2pxdWVyeS5lYXN5LXBpZS1jaGFydC9kaXN0L2FuZ3VsYXIuZWFzeXBpZWNoYXJ0Lm1pbi5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICdjb2xvcnBpY2tlci5tb2R1bGUnLCAgICAgICAgZmlsZXM6IFsndmVuZG9yL2FuZ3VsYXItYm9vdHN0cmFwLWNvbG9ycGlja2VyL2Nzcy9jb2xvcnBpY2tlci5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1ib290c3RyYXAtY29sb3JwaWNrZXIvanMvYm9vdHN0cmFwLWNvbG9ycGlja2VyLW1vZHVsZS5qcyddfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubG9hZGluZ2JhcicpXHJcbiAgICAgICAgLmNvbmZpZyhsb2FkaW5nYmFyQ29uZmlnKVxyXG4gICAgICAgIDtcclxuICAgIGxvYWRpbmdiYXJDb25maWcuJGluamVjdCA9IFsnY2ZwTG9hZGluZ0JhclByb3ZpZGVyJ107XHJcbiAgICBmdW5jdGlvbiBsb2FkaW5nYmFyQ29uZmlnKGNmcExvYWRpbmdCYXJQcm92aWRlcil7XHJcbiAgICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlQmFyID0gdHJ1ZTtcclxuICAgICAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2U7XHJcbiAgICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5sYXRlbmN5VGhyZXNob2xkID0gNTAwO1xyXG4gICAgICBjZnBMb2FkaW5nQmFyUHJvdmlkZXIucGFyZW50U2VsZWN0b3IgPSAnLndyYXBwZXIgPiBzZWN0aW9uJztcclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sb2FkaW5nYmFyJylcclxuICAgICAgICAucnVuKGxvYWRpbmdiYXJSdW4pXHJcbiAgICAgICAgO1xyXG4gICAgbG9hZGluZ2JhclJ1bi4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgJ2NmcExvYWRpbmdCYXInXTtcclxuICAgIGZ1bmN0aW9uIGxvYWRpbmdiYXJSdW4oJHJvb3RTY29wZSwgJHRpbWVvdXQsIGNmcExvYWRpbmdCYXIpe1xyXG5cclxuICAgICAgLy8gTG9hZGluZyBiYXIgdHJhbnNpdGlvblxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuICAgICAgdmFyIHRoQmFyO1xyXG4gICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGlmKCQoJy53cmFwcGVyID4gc2VjdGlvbicpLmxlbmd0aCkgLy8gY2hlY2sgaWYgYmFyIGNvbnRhaW5lciBleGlzdHNcclxuICAgICAgICAgICAgdGhCYXIgPSAkdGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICBjZnBMb2FkaW5nQmFyLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIH0sIDApOyAvLyBzZXRzIGEgbGF0ZW5jeSBUaHJlc2hvbGRcclxuICAgICAgfSk7XHJcbiAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgIGV2ZW50LnRhcmdldFNjb3BlLiR3YXRjaCgnJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGhCYXIpO1xyXG4gICAgICAgICAgICBjZnBMb2FkaW5nQmFyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sb2NhbGUnKVxyXG4gICAgICAgIC5jb25maWcobG9jYWxlQ29uZmlnKVxyXG4gICAgICAgIDtcclxuICAgIGxvY2FsZUNvbmZpZy4kaW5qZWN0ID0gWyd0bWhEeW5hbWljTG9jYWxlUHJvdmlkZXInXTtcclxuICAgIGZ1bmN0aW9uIGxvY2FsZUNvbmZpZyh0bWhEeW5hbWljTG9jYWxlUHJvdmlkZXIpe1xyXG4gIFxyXG4gICAgICB0bWhEeW5hbWljTG9jYWxlUHJvdmlkZXIuZGVmYXVsdExvY2FsZSgnemgnKTtcclxuICAgICAgdG1oRHluYW1pY0xvY2FsZVByb3ZpZGVyLmxvY2FsZUxvY2F0aW9uUGF0dGVybigndmVuZG9yL2FuZ3VsYXItaTE4bi9hbmd1bGFyLWxvY2FsZV97e2xvY2FsZX19LmpzJyk7XHJcbiAgICAgIC8vIHRtaER5bmFtaWNMb2NhbGVQcm92aWRlci51c2VTdG9yYWdlKCckY29va2llU3RvcmUnKTtcclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogbG9jYWxlLmpzXHJcbiAqIERlbW8gZm9yIGxvY2FsZSBzZXR0aW5nc1xyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubG9jYWxlJylcclxuICAgICAgICAuY29udHJvbGxlcignTG9jYWxpemF0aW9uQ29udHJvbGxlcicsIExvY2FsaXphdGlvbkNvbnRyb2xsZXIpO1xyXG5cclxuICAgIExvY2FsaXphdGlvbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICd0bWhEeW5hbWljTG9jYWxlJywgJyRsb2NhbGUnXTtcclxuICAgIGZ1bmN0aW9uIExvY2FsaXphdGlvbkNvbnRyb2xsZXIoJHJvb3RTY29wZSwgdG1oRHluYW1pY0xvY2FsZSwgJGxvY2FsZSkge1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgJHJvb3RTY29wZS5hdmFpbGFibGVMb2NhbGVzID0ge1xyXG4gICAgICAgICAgICAnZW4nOiAnRW5nbGlzaCcsXHJcbiAgICAgICAgICAgICdlcyc6ICdTcGFuaXNoJyxcclxuICAgICAgICAgICAgJ2RlJzogJ0dlcm1hbicsXHJcbiAgICAgICAgICAgICdmcic6ICdGcmVuY2gnLFxyXG4gICAgICAgICAgICAnYXInOiAnQXJhYmljJyxcclxuICAgICAgICAgICAgJ2phJzogJ0phcGFuZXNlJyxcclxuICAgICAgICAgICAgJ2tvJzogJ0tvcmVhbicsXHJcbiAgICAgICAgICAgICd6aCc6ICdDaGluZXNlJ307XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICRyb290U2NvcGUubW9kZWwgPSB7c2VsZWN0ZWRMb2NhbGU6ICd6aCd9O1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAkcm9vdFNjb3BlLiRsb2NhbGUgPSAkbG9jYWxlO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAkcm9vdFNjb3BlLmNoYW5nZUxvY2FsZSA9IHRtaER5bmFtaWNMb2NhbGUuc2V0O1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAubW9kdWxlKCdhcHAubWVtYmVycycpXG4gICAgICAuY29udHJvbGxlcignTWVtYmVyc0NvbnRyb2xsZXInLCBNZW1iZXJzQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdNZW1iZXJDb250cm9sbGVyJywgTWVtYmVyQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdyZWNoYXJnZURpYWxvZ0NvbnRyb2xsZXInLCByZWNoYXJnZURpYWxvZ0NvbnRyb2xsZXIpXG4gICAgICAuY29udHJvbGxlcignYm9udXNEaWFsb2dDb250cm9sbGVyJywgYm9udXNEaWFsb2dDb250cm9sbGVyKVxuICAgIDtcbiAgICAgIFxuICAgIE1lbWJlcnNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdNZW1iZXInLCAnbmdUYWJsZVBhcmFtcycsICduZ1RhYmxlTEJTZXJ2aWNlJywgJ1N3ZWV0QWxlcnQnLCAncXJjb2RlU2VydmljZScsICdkZWFsU2VydmljZSddO1xuICAgIGZ1bmN0aW9uIE1lbWJlcnNDb250cm9sbGVyKCRzY29wZSwgTWVtYmVyLCBuZ1RhYmxlUGFyYW1zLCBuZ1RhYmxlTEJTZXJ2aWNlLCBTd2VldEFsZXJ0LCBxcmNvZGVTZXJ2aWNlLCBkZWFsU2VydmljZSkge1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIFxuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICRzY29wZS5xcmNvZGVTZXJ2aWNlID0gcXJjb2RlU2VydmljZTtcbiAgICAgICAgdm0ua2V5d29yZCA9IFwiXCI7XG4gICAgICAgIHZtLnRhYmxlUGFyYW1zID0gbmV3IG5nVGFibGVQYXJhbXMoe2NvdW50OiAxMH0sIHtcbiAgICAgICAgICBnZXREYXRhOiBmdW5jdGlvbigkZGVmZXIsIHBhcmFtcykge1xuICAgICAgICAgICAgdmFyIGZpbHRlciA9IHt3aGVyZTp7c3RhdHVzOntuZTonZGVsZXRlZCd9fSwgaW5jbHVkZTpbJ3d4dXNlciddfVxuICAgICAgICAgICAgaWYodm0ua2V5d29yZCAhPSAnJykge1xuICAgICAgICAgICAgICB2YXIgcXMgPSB7cmVnZXg6IGtleXdvcmR9O1xuICAgICAgICAgICAgICBmaWx0ZXIud2hlcmUub3IgPSBbe1wiZW50aXRpZXMuc2t1Lml0ZW0ubmFtZVwiOnFzfV07XG4gICAgICAgICAgICAgIHBhcmFtcy5wYWdlKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmdUYWJsZUxCU2VydmljZS5nZXREYXRhKCRkZWZlciwgcGFyYW1zLCBNZW1iZXIsIGZpbHRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0uc2VsbCA9IGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICAgICAgZGVhbFNlcnZpY2Uub3BlbkRlYWwobWVtYmVyKTtcbiAgICAgICAgJHNjb3BlLiRzdGF0ZS5nbygnYXBwLnNlbGwnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgTWVtYmVyQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnTWVtYmVyJywgJ25nVGFibGVQYXJhbXMnLCAnbmdUYWJsZUxCU2VydmljZScsICdTd2VldEFsZXJ0JywgJ2RlYWxTZXJ2aWNlJywgJ25nRGlhbG9nJ107XG4gICAgZnVuY3Rpb24gTWVtYmVyQ29udHJvbGxlcigkc2NvcGUsIE1lbWJlciwgbmdUYWJsZVBhcmFtcywgbmdUYWJsZUxCU2VydmljZSwgU3dlZXRBbGVydCwgZGVhbFNlcnZpY2UsIG5nRGlhbG9nKSB7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdmFyIG1lbWJlcklkID0gJHNjb3BlLiRzdGF0ZS5wYXJhbXMubWVtYmVySWQ7XG4gICAgICAgICAgICBcbiAgICAgIHZtLmRlYWxUYWJsZVBhcmFtcyA9IG5ldyBuZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgY291bnQ6IDEwXG4gICAgICB9LCB7XG4gICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCRkZWZlciwgcGFyYW1zKSB7XG4gICAgICAgICAgdmFyIG9wdCA9IHt3aGVyZTp7c3RhdHVzOntuZTonZGVsZXRlZCd9fX1cbiAgICAgICAgICBvcHQubGltaXQgPSBwYXJhbXMuY291bnQoKVxuICAgICAgICAgIG9wdC5za2lwID0gKHBhcmFtcy5wYWdlKCktMSkqb3B0LmxpbWl0XG4gICAgICAgICAgTWVtYmVyLmRlYWxzLmNvdW50KHtpZDogbWVtYmVySWQsIHdoZXJlOiBvcHQud2hlcmV9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB2bS5kZWFsVGFibGVQYXJhbXMudG90YWwocmVzdWx0LmNvdW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBNZW1iZXIuZGVhbHMoe2lkOiBtZW1iZXJJZCwgZmlsdGVyOm9wdH0sICRkZWZlci5yZXNvbHZlKTtcbiAgICAgICAgfVxuICAgICAgfSk7ICAgICBcbiAgICAgIFxuICAgICAgdm0uZGVwb3NpdFRhYmxlUGFyYW1zID0gbmV3IG5nVGFibGVQYXJhbXMoe1xuICAgICAgICBjb3VudDogMTBcbiAgICAgIH0sIHtcbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJGRlZmVyLCBwYXJhbXMpIHtcbiAgICAgICAgICB2YXIgb3B0ID0ge1xuICAgICAgICAgICAgd2hlcmU6e3N0YXR1czp7bmU6J2RlbGV0ZWQnfSwgb3I6W3t0eXBlOiAnZGVwb3NpdCd9LCB7Y2F0ZWdvcnk6ICdkZXBvc2l0J31dfSxcbiAgICAgICAgICAgIGluY2x1ZGU6IFsnc2hvcCddXG4gICAgICAgICAgfVxuICAgICAgICAgIG9wdC5saW1pdCA9IHBhcmFtcy5jb3VudCgpXG4gICAgICAgICAgb3B0LnNraXAgPSAocGFyYW1zLnBhZ2UoKS0xKSpvcHQubGltaXRcbiAgICAgICAgICBNZW1iZXIucGF5bWVudHMuY291bnQoe2lkOiBtZW1iZXJJZCwgd2hlcmU6IG9wdC53aGVyZX0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHZtLmRlcG9zaXRUYWJsZVBhcmFtcy50b3RhbChyZXN1bHQuY291bnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIE1lbWJlci5wYXltZW50cyh7aWQ6IG1lbWJlcklkLCBmaWx0ZXI6b3B0fSwgJGRlZmVyLnJlc29sdmUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdm0uYm9udXNUYWJsZVBhcmFtcyA9IG5ldyBuZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgY291bnQ6IDEwXG4gICAgICB9LCB7XG4gICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCRkZWZlciwgcGFyYW1zKSB7XG4gICAgICAgICAgdmFyIG9wdCA9IHtcbiAgICAgICAgICAgIHdoZXJlOntzdGF0dXM6e25lOidkZWxldGVkJ319LFxuICAgICAgICAgICAgaW5jbHVkZTogW11cbiAgICAgICAgICB9XG4gICAgICAgICAgb3B0LmxpbWl0ID0gcGFyYW1zLmNvdW50KClcbiAgICAgICAgICBvcHQuc2tpcCA9IChwYXJhbXMucGFnZSgpLTEpKm9wdC5saW1pdFxuICAgICAgICAgIE1lbWJlci5ib251c2VzLmNvdW50KHtpZDogbWVtYmVySWQsIHdoZXJlOiBvcHQud2hlcmV9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB2bS5ib251c1RhYmxlUGFyYW1zLnRvdGFsKHJlc3VsdC5jb3VudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgTWVtYmVyLmJvbnVzZXMoe2lkOiBtZW1iZXJJZCwgZmlsdGVyOm9wdH0sICRkZWZlci5yZXNvbHZlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFjdGl2YXRlKCk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBcbiAgICAgICAgbWVtYmVySWQgPSAkc2NvcGUuJHN0YXRlLnBhcmFtcy5tZW1iZXJJZDtcblxuICAgICAgICB2bS5tZW1iZXIgPSBNZW1iZXIuZmluZE9uZSh7ZmlsdGVyOiB7XG4gICAgICAgICAgd2hlcmU6IHtpZDogbWVtYmVySWR9LCBcbiAgICAgICAgICBpbmNsdWRlOlsnd3h1c2VyJ11cbiAgICAgICAgfX0pO1xuICAgICAgICBcbiAgICAgICAgdm0uZGVhbFRhYmxlUGFyYW1zLnJlbG9hZCgpO1xuICAgICAgICB2bS5kZXBvc2l0VGFibGVQYXJhbXMucmVsb2FkKCk7XG4gICAgICAgIHZtLmJvbnVzVGFibGVQYXJhbXMucmVsb2FkKCk7XG4gICAgICB9XG5cbiAgICAgIHZtLnNlbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlYWxTZXJ2aWNlLm9wZW5EZWFsKHZtLm1lbWJlcik7XG4gICAgICAgICRzY29wZS4kc3RhdGUuZ28oJ2FwcC5zZWxsJyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLnJlY2hhcmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBuZ0RpYWxvZy5vcGVuKHsgXG4gICAgICAgICAgdGVtcGxhdGU6ICdyZWNoYXJnZURpYWxvZ0lkJywgXG4gICAgICAgICAgY29udHJvbGxlcjogJ3JlY2hhcmdlRGlhbG9nQ29udHJvbGxlcidcbiAgICAgICAgfSkuY2xvc2VQcm9taXNlLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBhY3RpdmF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0uc2V0Qm9udXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG5nRGlhbG9nLm9wZW4oeyBcbiAgICAgICAgICB0ZW1wbGF0ZTogJ2JvbnVzRGlhbG9nSWQnLCBcbiAgICAgICAgICBjb250cm9sbGVyOiAnYm9udXNEaWFsb2dDb250cm9sbGVyJ1xuICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGFjdGl2YXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZWNoYXJnZURpYWxvZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ25nRGlhbG9nJywgJ01lbWJlcicsICd0b2FzdGVyJywgJ2RlYWxTZXJ2aWNlJ107XG4gICAgZnVuY3Rpb24gcmVjaGFyZ2VEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgbmdEaWFsb2csIE1lbWJlciwgdG9hc3RlciwgZGVhbFNlcnZpY2UpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICB2YXIgbWVtYmVySWQgPSAkc2NvcGUuJHN0YXRlLnBhcmFtcy5tZW1iZXJJZDtcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgbWVtYmVySWQgPSAkc2NvcGUuJHN0YXRlLnBhcmFtcy5tZW1iZXJJZDtcbiAgICAgICAgICAkc2NvcGUubWVtYmVyID0gTWVtYmVyLmZpbmRCeUlkKHtpZDptZW1iZXJJZH0pO1xuICAgICAgICAgICRzY29wZS5kYXRhID0ge1xuICAgICAgICAgICAgdHlwZTogJ2Nhc2gnLCBcbiAgICAgICAgICAgIGFtb3VudDogMCxcbiAgICAgICAgICAgIGNhdGVnb3J5OiAnZGVwb3NpdCdcbiAgICAgICAgICB9O1xuICAgICAgICAgICRzY29wZS5wYXlUeXBlID0gZGVhbFNlcnZpY2UucGF5VHlwZTtcbiAgICAgICAgICAkc2NvcGUuY2FzaCA9IHtcbiAgICAgICAgICAgIHBhaWQ6IDAsXG4gICAgICAgICAgICBjaGFuZ2U6IDAsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUub25DaGFuZ2VQYXlUeXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmKGRhdGEudHlwZSA9PT0gJ2Nhc2gnKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YS5jb3N0ID0gJHNjb3BlLmRhdGEuYW1vdW50JSRzY29wZS51c2VyLm1lcmNoYW50LmNoYW5nZVJhdGU7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YS5hbW91bnQgLT0gJHNjb3BlLmRhdGEuY29zdDtcbiAgICAgICAgICAgICRzY29wZS5jb3VudENoYW5nZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YS5jb3N0ID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5jb3VudENoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkc2NvcGUuY2FzaC5wYWlkID0gICRzY29wZS5jYXNoLnBhaWQ7XG4gICAgICAgICAgJHNjb3BlLmNhc2guY2hhbmdlID0gJHNjb3BlLmRhdGEuYW1vdW50IC0gJHNjb3BlLmNhc2gucGFpZDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmNvbmZpcm0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYoJHNjb3BlLmRhdGEuYW1vdW50ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIE1lbWJlci5wYXltZW50cy5jcmVhdGUoe2lkOiBtZW1iZXJJZH0sICRzY29wZS5kYXRhKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIG5nRGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICfmiJDlip8nLCBcIuWujOaIkOWCqOWAvOaTjeS9nFwiKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCAn5aSx6LSlJywgXCLlgqjlgLzmk43kvZzmnKrlrozmiJDvvIzor7fph43or5XvvIFcIilcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgYm9udXNEaWFsb2dDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICduZ0RpYWxvZycsICdNZW1iZXInLCAndG9hc3RlciddO1xuICAgIGZ1bmN0aW9uIGJvbnVzRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsIG5nRGlhbG9nLCBNZW1iZXIsIHRvYXN0ZXIpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICB2YXIgbWVtYmVySWQgPSAkc2NvcGUuJHN0YXRlLnBhcmFtcy5tZW1iZXJJZDtcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgbWVtYmVySWQgPSAkc2NvcGUuJHN0YXRlLnBhcmFtcy5tZW1iZXJJZDtcbiAgICAgICAgICAkc2NvcGUubWVtYmVyID0gTWVtYmVyLmZpbmRCeUlkKHtpZDptZW1iZXJJZH0pO1xuICAgICAgICAgICRzY29wZS5kYXRhID0ge1xuICAgICAgICAgICAgYW1vdW50OiAwLFxuICAgICAgICAgICAgbWVtbzogJ21hbnVhbCdcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY29uZmlybSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZigkc2NvcGUuZGF0YS5hbW91bnQgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYoJHNjb3BlLmRhdGEuYW1vdW50ID4gMCkge1xuICAgICAgICAgICAgJHNjb3BlLmRhdGEubWVtbyA9ICdtYW51YWwnO1xuICAgICAgICAgIH0gZWxzZSBpZigkc2NvcGUuZGF0YS5hbW91bnQgPCAwKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YS5tZW1vID0gJ3dyaXRlb2ZmJztcbiAgICAgICAgICB9XG4gICAgICAgICAgTWVtYmVyLmJvbnVzZXMuY3JlYXRlKHtpZDogbWVtYmVySWR9LCAkc2NvcGUuZGF0YSkuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBuZ0RpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAn5oiQ5YqfJywgXCLlrozmiJDlgqjlgLzmk43kvZxcIik7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgJ+Wksei0pScsIFwi5YKo5YC85pON5L2c5pyq5a6M5oiQ77yM6K+36YeN6K+V77yBXCIpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJHNjb3BlLnN1Ym1pdGluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIi8qKlxuICogQW5ndWxhckpTIGRlZmF1bHQgZmlsdGVyIHdpdGggdGhlIGZvbGxvd2luZyBleHByZXNzaW9uOlxuICogXCJwZXJzb24gaW4gcGVvcGxlIHwgZmlsdGVyOiB7bmFtZTogJHNlbGVjdC5zZWFyY2gsIGFnZTogJHNlbGVjdC5zZWFyY2h9XCJcbiAqIHBlcmZvcm1zIGEgQU5EIGJldHdlZW4gJ25hbWU6ICRzZWxlY3Quc2VhcmNoJyBhbmQgJ2FnZTogJHNlbGVjdC5zZWFyY2gnLlxuICogV2Ugd2FudCB0byBwZXJmb3JtIGEgT1IuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm1lbWJlcnMnKVxuICAgICAgICAuZmlsdGVyKCd3eF9zZXgnLCB3eHNleEZpbHRlcilcbiAgICAgICAgLmZpbHRlcignd3hfc3Vic2NyaWJlJywgd3hzdWJzY3JpYmVGaWx0ZXIpXG4gICAgICAgIC5maWx0ZXIoJ2RlcG9zaXRfY2F0ZWdvcnknLCBkZXBvc2l0Y2F0ZWdvcnlGaWx0ZXIpXG4gICAgICAgIC5maWx0ZXIoJ2JvbnVzX21lbW8nLCBib251c01lbW9GaWx0ZXIpXG4gICAgO1xuXG4gICAgZnVuY3Rpb24gd3hzZXhGaWx0ZXIoKSB7XG4gICAgICAgIHZhciB0eXBlID0gWyfkv53lr4YnLCAn55S3JywgJ+WlsyddO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiB3eHN1YnNjcmliZUZpbHRlcigpIHtcbiAgICAgIHZhciBzdGF0ZSA9IFsn5pyq5YWz5rOoJywgJ+W3suWFs+azqCddO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGRlcG9zaXRjYXRlZ29yeUZpbHRlcigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZGVwb3NpdCkge1xuICAgICAgICBpZihkZXBvc2l0LnR5cGUgPT09ICdkZXBvc2l0Jykge1xuICAgICAgICAgIHJldHVybiBkZXBvc2l0LmFtb3VudCA8IDAgPyAn5YKo5YC85raI6LS5Jzon5YKo5YC86YCA5qy+JztcbiAgICAgICAgfSBlbHNlIGlmKGRlcG9zaXQuY2F0ZWdvcnkgPT09ICdkZXBvc2l0Jykge1xuICAgICAgICAgIHJldHVybiBkZXBvc2l0LmFtb3VudCA8IDAgPyAn5o+Q546wJzon5YWF5YC8JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJ+acquefpSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBib251c01lbW9GaWx0ZXIoKSB7XG4gICAgICB2YXIgbWVtbyA9IHtcbiAgICAgICAgcmV3YXJkOiAn5raI6LS556ev5YiGJyxcbiAgICAgICAgdm91Y2g6ICfmtojotLnmirXmiaMnLFxuICAgICAgICBtYW51YWw6ICfmiYvliqjnp6/liIYnLFxuICAgICAgICB3cml0ZW9mZjogJ+aJi+WKqOWHj+iuoScsXG4gICAgICAgIGV4Y2hhbmdlOiAn5YWR5o2iJ1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIG1lbW9ba2V5XTtcbiAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5tZW1iZXJzJylcbiAgICAgICAgLnNlcnZpY2UoJ3FyY29kZVNlcnZpY2UnLCBxcmNvZGVTZXJ2aWNlKTtcblxuICAgIHFyY29kZVNlcnZpY2UuJGluamVjdCA9IFsnbmdEaWFsb2cnXTtcbiAgICBmdW5jdGlvbiBxcmNvZGVTZXJ2aWNlKG5nRGlhbG9nKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBcbiAgICAgIHRoaXMuc2hvd1FSQ29kZSA9IHNob3dRUkNvZGU7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHNob3dRUkNvZGUoaW1hZ2V1cmwpIHtcbiAgICAgICAgaW1hZ2V1cmwgPSBpbWFnZXVybCB8fCAnYXBwL2ltZy9xcmNvZGUtZm9yLWdoLmpwZyc7XG4gICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgIHRlbXBsYXRlOiBcIjxpbWcgc3JjPVwiK2ltYWdldXJsK1wiIGNsYXNzPSdpbWctcmVzcG9uc2l2ZSc+XCIsXG4gICAgICAgICAgcGxhaW46IHRydWUsXG4gICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCdcbiAgICAgICAgfSk7ICAgIFxuICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAubW9kdWxlKCdhcHAubXlzaG9wJywgW10pXG4gICAgICAuY29udHJvbGxlcignTXlTaG9wQ29udHJvbGxlcicsIE15U2hvcENvbnRyb2xsZXIpXG4gICAgICAuY29udHJvbGxlcignU2hvcHNDb250cm9sbGVyJywgU2hvcHNDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ1Nob3BBZGRDb250cm9sbGVyJywgU2hvcEFkZENvbnRyb2xsZXIpO1xuICAgICAgICBcbiAgICBNeVNob3BDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdlZGl0YWJsZU9wdGlvbnMnLCAnZWRpdGFibGVUaGVtZXMnLCAnU2hvcCcsICdNZXJjaGFudCddO1xuICAgIGZ1bmN0aW9uIE15U2hvcENvbnRyb2xsZXIoJHNjb3BlLCBlZGl0YWJsZU9wdGlvbnMsIGVkaXRhYmxlVGhlbWVzLCBTaG9wLCBNZXJjaGFudCkge1xuICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgQU1hcC5zZXJ2aWNlKCdBTWFwLkRpc3RyaWN0U2VhcmNoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGlzdHJpY3RTZWFyY2ggPSBuZXcgQU1hcC5EaXN0cmljdFNlYXJjaCh7XG4gICAgICAgICAgbGV2ZWwgOiAnY291bnRyeScsXG4gICAgICAgICAgc3ViZGlzdHJpY3QgOiAzICAgIFxuICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgZGlzdHJpY3RTZWFyY2guc2VhcmNoKCfkuK3lm70nLCBmdW5jdGlvbiAoc3RhdHVzLCByZXN1bHQpIHtcbiAgICAgICAgICB2bS5wcm92aW5jZXMgPSByZXN1bHQuZGlzdHJpY3RMaXN0WzBdLmRpc3RyaWN0TGlzdDtcbiAgICAgICAgICAvLyAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGFjdGl2YXRlKCk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBcbiAgICAgICAgZWRpdGFibGVPcHRpb25zLnRoZW1lID0gJ2JzMyc7XG4gICAgICAgIFxuICAgICAgICBlZGl0YWJsZVRoZW1lcy5iczMuaW5wdXRDbGFzcyA9ICdpbnB1dC1zbSc7XG4gICAgICAgIGVkaXRhYmxlVGhlbWVzLmJzMy5idXR0b25zQ2xhc3MgPSAnYnRuLXNtJztcbiAgICAgICAgZWRpdGFibGVUaGVtZXMuYnMzLnN1Ym1pdFRwbCA9ICc8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiPjxzcGFuIGNsYXNzPVwiZmEgZmEtY2hlY2tcIj48L3NwYW4+PC9idXR0b24+JztcbiAgICAgICAgZWRpdGFibGVUaGVtZXMuYnMzLmNhbmNlbFRwbCA9ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIG5nLWNsaWNrPVwiJGZvcm0uJGNhbmNlbCgpXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZmEgZmEtdGltZXMgdGV4dC1tdXRlZFwiPjwvc3Bhbj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvYnV0dG9uPic7XG4gICAgICAgIFxuICAgICAgICB2bS5zaG9wID0gJHNjb3BlLnVzZXIuc2hvcDtcbiAgICAgICAgdm0ubWVyY2hhbnQgPSAkc2NvcGUudXNlci5tZXJjaGFudDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0udXBkYXRlID0gZnVuY3Rpb24gKG9iaiwga2V5LCBkYXRhKSB7XG4gICAgICAgIHZtW29ial1ba2V5XSA9IGRhdGEubmFtZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0uc2F2ZVNob3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFNob3AudXBzZXJ0KHZtLnNob3ApO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5zYXZlTWVyY2hhbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIE1lcmNoYW50LnVwc2VydCh2bS5tZXJjaGFudCk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIFNob3BzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnbmdUYWJsZScsICdTaG9wJ107XG4gICAgZnVuY3Rpb24gU2hvcHNDb250cm9sbGVyKCRzY29wZSwgbmdUYWJsZSwgU2hvcCkge1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIFxuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIFxuICAgICAgfVxuICAgICAgXG4gICAgICAkc2NvcGUuZmlsdGVyID0ge3RleHQ6ICcnfVxuICAgICAgJHNjb3BlLnRhYmxlUGFyYW1zID0gbmV3IG5nVGFibGVQYXJhbXMoe1xuICAgICAgICBjb3VudDogMTAsXG4gICAgICAgIGZpbHRlcjogJHNjb3BlLmZpbHRlci50ZXh0XG4gICAgICB9LCB7XG4gICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCRkZWZlciwgcGFyYW1zKSB7XG4gICAgICAgICAgdmFyIG9wdCA9IHtvcmRlcjogJ3N1YnNjcmliZV90aW1lIERFU0MnfVxuICAgICAgICAgIG9wdC5saW1pdCA9IHBhcmFtcy5jb3VudCgpXG4gICAgICAgICAgb3B0LnNraXAgPSAocGFyYW1zLnBhZ2UoKS0xKSpvcHQubGltaXRcbiAgICAgICAgICBvcHQud2hlcmUgPSB7fVxuICAgICAgICAgIGlmKCRzY29wZS5maWx0ZXIudGV4dCAhPSAnJykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmZpbHRlci50ZXh0KTtcbiAgICAgICAgICAgIC8vIHZhciBxcyA9IHtsaWtlOiAnJScrJHNjb3BlLmZpbHRlci50ZXh0KyclJ307XG4gICAgICAgICAgICB2YXIgcXMgPSB7cmVnZXg6ICRzY29wZS5maWx0ZXIudGV4dH07XG4gICAgICAgICAgICBvcHQud2hlcmUub3IgPSBbe25pY2tuYW1lOnFzfSwge3JlbWFyazpxc31dO1xuICAgICAgICAgICAgb3B0LnNraXAgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBTa3UuY291bnQoe3doZXJlOiBvcHQud2hlcmV9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAkc2NvcGUudGFibGVQYXJhbXMudG90YWwocmVzdWx0LmNvdW50KVxuICAgICAgICAgICAgU2t1LmZpbmQoe2ZpbHRlcjpvcHR9LCAkZGVmZXIucmVzb2x2ZSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KSAgIFxuICAgIH1cbiAgICBcbiAgICBTaG9wQWRkQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnU2hvcCddO1xuICAgIGZ1bmN0aW9uIFNob3BBZGRDb250cm9sbGVyKCRzY29wZSwgU2hvcCkge1xuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgd2luZG93LlBhcnNsZXlWYWxpZGF0b3Iuc2V0TG9jYWxlKCd6aF9jbicpO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgJHNjb3BlLmVudGl0eSA9IHtcbiAgICAgICAgICB0eXBlOiBcImVudGl0eVwiLFxuICAgICAgICAgIG5hbWU6IFwiaVBob25lNlMgUGx1c1wiLFxuICAgICAgICAgIHNrdXM6IFt7YmFyY29kZTpcIjEyM1wiLCBwcmljZTogNTI4OCwgbW9kZWw6IFwiMTZHXCJ9XVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgXG4gICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICB9XG4gICAgICBcbiAgICAgICRzY29wZS5zYXZlQW5kTW9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIH1cbiAgICB9ICAgIFxufSkoKTsiLCIvKipcbiAqIEFuZ3VsYXJKUyBkZWZhdWx0IGZpbHRlciB3aXRoIHRoZSBmb2xsb3dpbmcgZXhwcmVzc2lvbjpcbiAqIFwicGVyc29uIGluIHBlb3BsZSB8IGZpbHRlcjoge25hbWU6ICRzZWxlY3Quc2VhcmNoLCBhZ2U6ICRzZWxlY3Quc2VhcmNofVwiXG4gKiBwZXJmb3JtcyBhIEFORCBiZXR3ZWVuICduYW1lOiAkc2VsZWN0LnNlYXJjaCcgYW5kICdhZ2U6ICRzZWxlY3Quc2VhcmNoJy5cbiAqIFdlIHdhbnQgdG8gcGVyZm9ybSBhIE9SLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5teXNob3AnKVxuICAgICAgICAuZmlsdGVyKCdpdGVtX3R5cGUyJywgaXRlbVR5cGVGaWx0ZXIyKTtcblxuICAgIGZ1bmN0aW9uIGl0ZW1UeXBlRmlsdGVyMigpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB7XG4gICAgICAgICAgZW50aXR5OiBcIuWunuS9k+WVhuWTgVwiLFxuICAgICAgICAgIHNlcnZpY2U6IFwi5pyN5Yqh6aG555uuXCJcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVba2V5XTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTsiLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBkZW1vLW5vdGlmeS5qc1xyXG4gKiBQcm92aWRlcyBhIHNpbXBsZSBkZW1vIGZvciBub3RpZnlcclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm5vdGlmeScpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ05vdGlmeURlbW9DdHJsJywgTm90aWZ5RGVtb0N0cmwpO1xyXG5cclxuICAgIE5vdGlmeURlbW9DdHJsLiRpbmplY3QgPSBbJ05vdGlmeScsICckdGltZW91dCddO1xyXG4gICAgZnVuY3Rpb24gTm90aWZ5RGVtb0N0cmwoTm90aWZ5LCAkdGltZW91dCkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICB2bS5tc2dIdG1sID0gJzxlbSBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9lbT4gTWVzc2FnZSB3aXRoIGljb24uLic7XHJcblxyXG4gICAgICAgICAgdm0ubm90aWZ5TXNnID0gJ1NvbWUgbWVzc2FnZXMgaGVyZS4uJztcclxuICAgICAgICAgIHZtLm5vdGlmeU9wdHMgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1czogJ2RhbmdlcicsXHJcbiAgICAgICAgICAgIHBvczogJ2JvdHRvbS1jZW50ZXInXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIC8vIFNlcnZpY2UgdXNhZ2UgZXhhbXBsZVxyXG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIE5vdGlmeS5hbGVydCggXHJcbiAgICAgICAgICAgICAgICAnVGhpcyBpcyBhIGN1c3RvbSBtZXNzYWdlIGZyb20gbm90aWZ5Li4nLCBcclxuICAgICAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJ31cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBub3RpZnkuanNcbiAqIERpcmVjdGl2ZSBmb3Igbm90aWZ5IHBsdWdpblxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5ub3RpZnknKVxuICAgICAgICAuZGlyZWN0aXZlKCdub3RpZnknLCBub3RpZnkpO1xuXG4gICAgbm90aWZ5LiRpbmplY3QgPSBbJyR3aW5kb3cnLCAnTm90aWZ5J107XG4gICAgZnVuY3Rpb24gbm90aWZ5ICgkd2luZG93LCBOb3RpZnkpIHtcblxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICBvcHRpb25zOiAnPScsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICc9J1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQpIHtcblxuICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIE5vdGlmeS5hbGVydChzY29wZS5tZXNzYWdlLCBzY29wZS5vcHRpb25zKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KSgpO1xuXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBub3RpZnkuanNcclxuICogQ3JlYXRlIGEgbm90aWZpY2F0aW9ucyB0aGF0IGZhZGUgb3V0IGF1dG9tYXRpY2FsbHkuXHJcbiAqIEJhc2VkIG9uIE5vdGlmeSBhZGRvbiBmcm9tIFVJS2l0IChodHRwOi8vZ2V0dWlraXQuY29tL2RvY3MvYWRkb25zX25vdGlmeS5odG1sKVxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubm90aWZ5JylcclxuICAgICAgICAuc2VydmljZSgnTm90aWZ5JywgTm90aWZ5KTtcclxuXHJcbiAgICBOb3RpZnkuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcclxuICAgIGZ1bmN0aW9uIE5vdGlmeSgkdGltZW91dCkge1xyXG5cclxuICAgICAgICB0aGlzLmFsZXJ0ID0gbm90aWZ5QWxlcnQ7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbm90aWZ5QWxlcnQobXNnLCBvcHRzKSB7XHJcbiAgICAgICAgICAgIGlmICggbXNnICkge1xyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAkLm5vdGlmeShtc2csIG9wdHMgfHwge30pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG5cclxuLyoqXHJcbiAqIE5vdGlmeSBBZGRvbiBkZWZpbml0aW9uIGFzIGpRdWVyeSBwbHVnaW5cclxuICogQWRhcHRlZCB2ZXJzaW9uIHRvIHdvcmsgd2l0aCBCb290c3RyYXAgY2xhc3Nlc1xyXG4gKiBNb3JlIGluZm9ybWF0aW9uIGh0dHA6Ly9nZXR1aWtpdC5jb20vZG9jcy9hZGRvbnNfbm90aWZ5Lmh0bWxcclxuICovXHJcbihmdW5jdGlvbigkKXtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBjb250YWluZXJzID0ge30sXHJcbiAgICAgICAgbWVzc2FnZXMgICA9IHt9LFxyXG4gICAgICAgIG5vdGlmeSAgICAgPSAgZnVuY3Rpb24ob3B0aW9ucyl7XHJcbiAgICAgICAgICAgIGlmICgkLnR5cGUob3B0aW9ucykgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zID0geyBtZXNzYWdlOiBvcHRpb25zIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50c1sxXSkge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKG9wdGlvbnMsICQudHlwZShhcmd1bWVudHNbMV0pID09PSAnc3RyaW5nJyA/IHtzdGF0dXM6YXJndW1lbnRzWzFdfSA6IGFyZ3VtZW50c1sxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIChuZXcgTWVzc2FnZShvcHRpb25zKSkuc2hvdygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xvc2VBbGwgID0gZnVuY3Rpb24oZ3JvdXAsIGluc3RhbnRseSl7XHJcbiAgICAgICAgICAgIHZhciBpZDtcclxuICAgICAgICAgICAgaWYoZ3JvdXApIHtcclxuICAgICAgICAgICAgICAgIGZvcihpZCBpbiBtZXNzYWdlcykgeyBpZihncm91cD09PW1lc3NhZ2VzW2lkXS5ncm91cCkgbWVzc2FnZXNbaWRdLmNsb3NlKGluc3RhbnRseSk7IH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvcihpZCBpbiBtZXNzYWdlcykgeyBtZXNzYWdlc1tpZF0uY2xvc2UoaW5zdGFudGx5KTsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIHZhciBNZXNzYWdlID0gZnVuY3Rpb24ob3B0aW9ucyl7XHJcbiAgICAgICAgLy8gdmFyICR0aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgTWVzc2FnZS5kZWZhdWx0cywgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy51dWlkICAgID0gJ0lEJysobmV3IERhdGUoKS5nZXRUaW1lKCkpKydSQU5EJysoTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiAxMDAwMDApKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKFtcclxuICAgICAgICAgICAgLy8gQGdlZWRtbzogYWxlcnQtZGlzbWlzc2FibGUgZW5hYmxlcyBicyBjbG9zZSBpY29uXHJcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwidWstbm90aWZ5LW1lc3NhZ2UgYWxlcnQtZGlzbWlzc2FibGVcIj4nLFxyXG4gICAgICAgICAgICAgICAgJzxhIGNsYXNzPVwiY2xvc2VcIj4mdGltZXM7PC9hPicsXHJcbiAgICAgICAgICAgICAgICAnPGRpdj4nK3RoaXMub3B0aW9ucy5tZXNzYWdlKyc8L2Rpdj4nLFxyXG4gICAgICAgICAgICAnPC9kaXY+J1xyXG4gICAgICAgIF0uam9pbignJykpLmRhdGEoJ25vdGlmeU1lc3NhZ2UnLCB0aGlzKTtcclxuICAgICAgICAvLyBzdGF0dXNcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN0YXR1cykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ2FsZXJ0IGFsZXJ0LScrdGhpcy5vcHRpb25zLnN0YXR1cyk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudHN0YXR1cyA9IHRoaXMub3B0aW9ucy5zdGF0dXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JvdXAgPSB0aGlzLm9wdGlvbnMuZ3JvdXA7XHJcbiAgICAgICAgbWVzc2FnZXNbdGhpcy51dWlkXSA9IHRoaXM7XHJcbiAgICAgICAgaWYoIWNvbnRhaW5lcnNbdGhpcy5vcHRpb25zLnBvc10pIHtcclxuICAgICAgICAgICAgY29udGFpbmVyc1t0aGlzLm9wdGlvbnMucG9zXSA9ICQoJzxkaXYgY2xhc3M9XCJ1ay1ub3RpZnkgdWstbm90aWZ5LScrdGhpcy5vcHRpb25zLnBvcysnXCI+PC9kaXY+JykuYXBwZW5kVG8oJ2JvZHknKS5vbignY2xpY2snLCAnLnVrLW5vdGlmeS1tZXNzYWdlJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICQodGhpcykuZGF0YSgnbm90aWZ5TWVzc2FnZScpLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAkLmV4dGVuZChNZXNzYWdlLnByb3RvdHlwZSwge1xyXG4gICAgICAgIHV1aWQ6IGZhbHNlLFxyXG4gICAgICAgIGVsZW1lbnQ6IGZhbHNlLFxyXG4gICAgICAgIHRpbW91dDogZmFsc2UsXHJcbiAgICAgICAgY3VycmVudHN0YXR1czogJycsXHJcbiAgICAgICAgZ3JvdXA6IGZhbHNlLFxyXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LmlzKCc6dmlzaWJsZScpKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcnNbdGhpcy5vcHRpb25zLnBvc10uc2hvdygpLnByZXBlbmQodGhpcy5lbGVtZW50KTtcclxuICAgICAgICAgICAgdmFyIG1hcmdpbmJvdHRvbSA9IHBhcnNlSW50KHRoaXMuZWxlbWVudC5jc3MoJ21hcmdpbi1ib3R0b20nKSwgMTApO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKHsnb3BhY2l0eSc6MCwgJ21hcmdpbi10b3AnOiAtMSp0aGlzLmVsZW1lbnQub3V0ZXJIZWlnaHQoKSwgJ21hcmdpbi1ib3R0b20nOjB9KS5hbmltYXRlKHsnb3BhY2l0eSc6MSwgJ21hcmdpbi10b3AnOiAwLCAnbWFyZ2luLWJvdHRvbSc6bWFyZ2luYm90dG9tfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5vcHRpb25zLnRpbWVvdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2xvc2VmbiA9IGZ1bmN0aW9uKCl7ICR0aGlzLmNsb3NlKCk7IH07XHJcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoY2xvc2VmbiwgJHRoaXMub3B0aW9ucy50aW1lb3V0KTtcclxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lbGVtZW50LmhvdmVyKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHsgY2xlYXJUaW1lb3V0KCR0aGlzLnRpbWVvdXQpOyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHsgJHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoY2xvc2VmbiwgJHRoaXMub3B0aW9ucy50aW1lb3V0KTsgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbG9zZTogZnVuY3Rpb24oaW5zdGFudGx5KSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyAgICA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBmaW5hbGl6ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZighY29udGFpbmVyc1skdGhpcy5vcHRpb25zLnBvc10uY2hpbGRyZW4oKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyc1skdGhpcy5vcHRpb25zLnBvc10uaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbWVzc2FnZXNbJHRoaXMudXVpZF07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZih0aGlzLnRpbWVvdXQpIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xyXG4gICAgICAgICAgICBpZihpbnN0YW50bHkpIHtcclxuICAgICAgICAgICAgICAgIGZpbmFsaXplKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYW5pbWF0ZSh7J29wYWNpdHknOjAsICdtYXJnaW4tdG9wJzogLTEqIHRoaXMuZWxlbWVudC5vdXRlckhlaWdodCgpLCAnbWFyZ2luLWJvdHRvbSc6MH0sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgZmluYWxpemUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb250ZW50OiBmdW5jdGlvbihodG1sKXtcclxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudC5maW5kKCc+ZGl2Jyk7XHJcbiAgICAgICAgICAgIGlmKCFodG1sKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVyLmh0bWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb250YWluZXIuaHRtbChodG1sKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdGF0dXM6IGZ1bmN0aW9uKHN0YXR1cykge1xyXG4gICAgICAgICAgICBpZighc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50c3RhdHVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnYWxlcnQgYWxlcnQtJyt0aGlzLmN1cnJlbnRzdGF0dXMpLmFkZENsYXNzKCdhbGVydCBhbGVydC0nK3N0YXR1cyk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudHN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBNZXNzYWdlLmRlZmF1bHRzID0ge1xyXG4gICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgIHN0YXR1czogJ25vcm1hbCcsXHJcbiAgICAgICAgdGltZW91dDogNTAwMCxcclxuICAgICAgICBncm91cDogbnVsbCxcclxuICAgICAgICBwb3M6ICd0b3AtY2VudGVyJ1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgJC5ub3RpZnkgICAgICAgICAgPSBub3RpZnk7XHJcbiAgICAkLm5vdGlmeS5tZXNzYWdlICA9IE1lc3NhZ2U7XHJcbiAgICAkLm5vdGlmeS5jbG9zZUFsbCA9IGNsb3NlQWxsO1xyXG4gICAgXHJcbiAgICByZXR1cm4gbm90aWZ5O1xyXG59KGpRdWVyeSkpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogYWNjZXNzLWxvZ2luLmpzXG4gKiBEZW1vIGZvciBsb2dpbiBhcGlcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAucGFnZXMnKVxuICAgICAgICAuY29udHJvbGxlcignTG9naW5Gb3JtQ29udHJvbGxlcicsIExvZ2luRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgTG9naW5Gb3JtQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc3RhdGUnLCAnVXNlcicsICckcm9vdFNjb3BlJ107XG4gICAgZnVuY3Rpb24gTG9naW5Gb3JtQ29udHJvbGxlcigkc3RhdGUsIFVzZXIsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAvLyBiaW5kIGhlcmUgYWxsIGRhdGEgZnJvbSB0aGUgZm9ybVxuICAgICAgICAgIHZtLmFjY291bnQgPSB7XG4gICAgICAgICAgICByZWFsbTogJ21lcmNoYW50JyxcbiAgICAgICAgICAgIHJlbWVtYmVyOiB0cnVlXG4gICAgICAgICAgfTtcbiAgICAgICAgICAvLyBwbGFjZSB0aGUgbWVzc2FnZSBpZiBzb21ldGhpbmcgZ29lcyB3cm9uZ1xuICAgICAgICAgIHZtLmF1dGhNc2cgPSAnJztcblxuICAgICAgICAgIHZtLmxvZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5hdXRoTXNnID0gJyc7XG5cbiAgICAgICAgICAgIGlmKHZtLmxvZ2luRm9ybS4kdmFsaWQpIHtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIFVzZXJcbiAgICAgICAgICAgICAgICAubG9naW4odm0uYWNjb3VudCwgZnVuY3Rpb24gKGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ1VzZXIubG9naW5lZCcpO1xuICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICB2bS5hdXRoTXNnID0gZXJyb3IuZGF0YS5lcnJvci5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gc2V0IGFzIGRpcnR5IGlmIHRoZSB1c2VyIGNsaWNrIGRpcmVjdGx5IHRvIGxvZ2luIHNvIHdlIHNob3cgdGhlIHZhbGlkYXRpb24gbWVzc2FnZXNcbiAgICAgICAgICAgICAgLypqc2hpbnQgLVcxMDYqL1xuICAgICAgICAgICAgICB2bS5sb2dpbkZvcm0uYWNjb3VudF91c2VybmFtZS4kZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICB2bS5sb2dpbkZvcm0uYWNjb3VudF9wYXNzd29yZC4kZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IGFjY2Vzcy1yZWdpc3Rlci5qc1xuICogRGVtbyBmb3IgcmVnaXN0ZXIgYWNjb3VudCBhcGlcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAucGFnZXMnKVxuICAgICAgICAuY29udHJvbGxlcignUmVnaXN0ZXJGb3JtQ29udHJvbGxlcicsIFJlZ2lzdGVyRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgUmVnaXN0ZXJGb3JtQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsICdVc2VyJywgJyRmaWx0ZXInXTtcbiAgICBmdW5jdGlvbiBSZWdpc3RlckZvcm1Db250cm9sbGVyKCRyb290U2NvcGUsICRzdGF0ZSwgVXNlciwgJGZpbHRlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgIC8vIGJpbmQgaGVyZSBhbGwgZGF0YSBmcm9tIHRoZSBmb3JtXG4gICAgICAgICAgdm0uYWNjb3VudCA9IHtcbiAgICAgICAgICAgIHJlYWxtOiAnbWVyY2hhbnQnLFxuICAgICAgICAgICAgcm9sZTogJ293bmVyJ1xuICAgICAgICAgIH07XG4gICAgICAgICAgdm0uYWdyZWVkID0gdHJ1ZTtcbiAgICAgICAgICAvLyBwbGFjZSB0aGUgbWVzc2FnZSBpZiBzb21ldGhpbmcgZ29lcyB3cm9uZ1xuICAgICAgICAgIHZtLmF1dGhNc2cgPSAnJztcbiAgICAgICAgICAgIFxuICAgICAgICAgIHZtLnJlZ2lzdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5hdXRoTXNnID0gJyc7XG5cbiAgICAgICAgICAgIGlmKHZtLnJlZ2lzdGVyRm9ybS4kdmFsaWQpIHtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIHZtLmFjY291bnQuZW1haWwgPSB2bS5hY2NvdW50LnVzZXJuYW1lK1wiQGZhbmthaHVpLmNvbVwiO1xuICAgICAgICAgICAgICB2bS5hY2NvdW50LnBob25lID0gdm0uYWNjb3VudC51c2VybmFtZTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIFVzZXJcbiAgICAgICAgICAgICAgICAuY3JlYXRlKHZtLmFjY291bnQsIGZ1bmN0aW9uIChhY2NvdW50KSB7XG4gICAgICAgICAgICAgICAgICBVc2VyXG4gICAgICAgICAgICAgICAgICAgIC5sb2dpbih7dXNlcm5hbWU6IHZtLmFjY291bnQudXNlcm5hbWUsIHBhc3N3b3JkOiB2bS5hY2NvdW50LnBhc3N3b3JkfSlcbiAgICAgICAgICAgICAgICAgICAgLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdVc2VyLmxvZ2luZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICB2bS5hdXRoTXNnID0gJGZpbHRlcigncmVnaXN0ZXJfZXJyb3InKShlcnJvci5kYXRhLmVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gc2V0IGFzIGRpcnR5IGlmIHRoZSB1c2VyIGNsaWNrIGRpcmVjdGx5IHRvIGxvZ2luIHNvIHdlIHNob3cgdGhlIHZhbGlkYXRpb24gbWVzc2FnZXNcbiAgICAgICAgICAgICAgLypqc2hpbnQgLVcxMDYqL1xuICAgICAgICAgICAgICB2bS5yZWdpc3RlckZvcm0uYWNjb3VudF91c2VybmFtZS4kZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICB2bS5yZWdpc3RlckZvcm0uYWNjb3VudF9wYXNzd29yZC4kZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICB2bS5yZWdpc3RlckZvcm0uYWNjb3VudF9hZ3JlZWQuJGRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG4iLCIvKipcbiAqIEFuZ3VsYXJKUyBkZWZhdWx0IGZpbHRlciB3aXRoIHRoZSBmb2xsb3dpbmcgZXhwcmVzc2lvbjpcbiAqIFwicGVyc29uIGluIHBlb3BsZSB8IGZpbHRlcjoge25hbWU6ICRzZWxlY3Quc2VhcmNoLCBhZ2U6ICRzZWxlY3Quc2VhcmNofVwiXG4gKiBwZXJmb3JtcyBhIEFORCBiZXR3ZWVuICduYW1lOiAkc2VsZWN0LnNlYXJjaCcgYW5kICdhZ2U6ICRzZWxlY3Quc2VhcmNoJy5cbiAqIFdlIHdhbnQgdG8gcGVyZm9ybSBhIE9SLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYWdlcycpXG4gICAgICAgIC5maWx0ZXIoJ3JlZ2lzdGVyX2Vycm9yJywgcmVnaXN0ZXJFcnJvckZpbHRlcilcbiAgICA7XG4gICAgXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJFcnJvckZpbHRlcigpIHtcbiAgICAgICAgLy8gXCJUaGUgYG1lcmNoYW50YCBpbnN0YW5jZSBpcyBub3QgdmFsaWQuIERldGFpbHM6IGBuYW1lYCBuYW1lIGV4aXN0ICh2YWx1ZTogXCJmYW5rYWh1aVwiKS5cIlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgaWYoL01lcmNoYW50IG5hbWUgZXhpc3QvLnRlc3QobXNnKSkgcmV0dXJuIFwi5ZWG5oi35ZCN5a2X5bey57uP5a2Y5ZyoXCI7XG4gICAgICAgIGlmKC9Vc2VyIGFscmVhZHkgZXhpc3RzLy50ZXN0KG1zZykpIHJldHVybiBcIueUqOaIt+WQjeW3sue7j+WtmOWcqFwiO1xuICAgICAgICBlbHNlIHJldHVybiBtc2c7XG4gICAgICB9XG4gICAgfVxufSkoKTsiLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogQ29sbGFwc2UgcGFuZWxzICogW3BhbmVsLWNvbGxhcHNlXVxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucGFuZWxzJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdwYW5lbENvbGxhcHNlJywgcGFuZWxDb2xsYXBzZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gcGFuZWxDb2xsYXBzZSAoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogQ29udHJvbGxlcixcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG4gICAgfVxyXG5cclxuICAgIENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyR0aW1lb3V0JywgJyRsb2NhbFN0b3JhZ2UnXTtcclxuICAgIGZ1bmN0aW9uIENvbnRyb2xsZXIgKCRzY29wZSwgJGVsZW1lbnQsICR0aW1lb3V0LCAkbG9jYWxTdG9yYWdlKSB7XHJcbiAgICAgIHZhciBzdG9yYWdlS2V5TmFtZSA9ICdwYW5lbFN0YXRlJztcclxuXHJcbiAgICAgIC8vIFByZXBhcmUgdGhlIHBhbmVsIHRvIGJlIGNvbGxhcHNpYmxlXHJcbiAgICAgIHZhciAkZWxlbSAgID0gJCgkZWxlbWVudCksXHJcbiAgICAgICAgICBwYXJlbnQgID0gJGVsZW0uY2xvc2VzdCgnLnBhbmVsJyksIC8vIGZpbmQgdGhlIGZpcnN0IHBhcmVudCBwYW5lbFxyXG4gICAgICAgICAgcGFuZWxJZCA9IHBhcmVudC5hdHRyKCdpZCcpO1xyXG5cclxuICAgICAgLy8gTG9hZCB0aGUgc2F2ZWQgc3RhdGUgaWYgZXhpc3RzXHJcbiAgICAgIHZhciBjdXJyZW50U3RhdGUgPSBsb2FkUGFuZWxTdGF0ZSggcGFuZWxJZCApO1xyXG4gICAgICBpZiAoIHR5cGVvZiBjdXJyZW50U3RhdGUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJHNjb3BlW3BhbmVsSWRdID0gY3VycmVudFN0YXRlOyB9LFxyXG4gICAgICAgICAgMTApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBiaW5kIGV2ZW50cyB0byBzd2l0Y2ggaWNvbnNcclxuICAgICAgJGVsZW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHNhdmVQYW5lbFN0YXRlKCBwYW5lbElkLCAhJHNjb3BlW3BhbmVsSWRdICk7XHJcblxyXG4gICAgICB9KTtcclxuICBcclxuICAgICAgLy8gQ29udHJvbGxlciBoZWxwZXJzXHJcbiAgICAgIGZ1bmN0aW9uIHNhdmVQYW5lbFN0YXRlKGlkLCBzdGF0ZSkge1xyXG4gICAgICAgIGlmKCFpZCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBkYXRhID0gYW5ndWxhci5mcm9tSnNvbigkbG9jYWxTdG9yYWdlW3N0b3JhZ2VLZXlOYW1lXSk7XHJcbiAgICAgICAgaWYoIWRhdGEpIHsgZGF0YSA9IHt9OyB9XHJcbiAgICAgICAgZGF0YVtpZF0gPSBzdGF0ZTtcclxuICAgICAgICAkbG9jYWxTdG9yYWdlW3N0b3JhZ2VLZXlOYW1lXSA9IGFuZ3VsYXIudG9Kc29uKGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICAgIGZ1bmN0aW9uIGxvYWRQYW5lbFN0YXRlKGlkKSB7XHJcbiAgICAgICAgaWYoIWlkKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBhbmd1bGFyLmZyb21Kc29uKCRsb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleU5hbWVdKTtcclxuICAgICAgICBpZihkYXRhKSB7XHJcbiAgICAgICAgICByZXR1cm4gZGF0YVtpZF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogRGlzbWlzcyBwYW5lbHMgKiBbcGFuZWwtZGlzbWlzc11cclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYW5lbHMnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BhbmVsRGlzbWlzcycsIHBhbmVsRGlzbWlzcyk7XHJcblxyXG4gICAgZnVuY3Rpb24gcGFuZWxEaXNtaXNzICgpIHtcclxuXHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogQ29udHJvbGxlcixcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHEnLCAnVXRpbHMnXTtcclxuICAgIGZ1bmN0aW9uIENvbnRyb2xsZXIgKCRzY29wZSwgJGVsZW1lbnQsICRxLCBVdGlscykge1xyXG4gICAgICB2YXIgcmVtb3ZlRXZlbnQgICA9ICdwYW5lbC1yZW1vdmUnLFxyXG4gICAgICAgICAgcmVtb3ZlZEV2ZW50ICA9ICdwYW5lbC1yZW1vdmVkJztcclxuXHJcbiAgICAgICRlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAvLyBmaW5kIHRoZSBmaXJzdCBwYXJlbnQgcGFuZWxcclxuICAgICAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcucGFuZWwnKTtcclxuXHJcbiAgICAgICAgcmVtb3ZlRWxlbWVudCgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiByZW1vdmVFbGVtZW50KCkge1xyXG4gICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gQ29tbXVuaWNhdGUgZXZlbnQgZGVzdHJveWluZyBwYW5lbFxyXG4gICAgICAgICAgJHNjb3BlLiRlbWl0KHJlbW92ZUV2ZW50LCBwYXJlbnQuYXR0cignaWQnKSwgZGVmZXJyZWQpO1xyXG4gICAgICAgICAgcHJvbWlzZS50aGVuKGRlc3Ryb3lNaWRkbGV3YXJlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJ1biB0aGUgYW5pbWF0aW9uIGJlZm9yZSBkZXN0cm95IHRoZSBwYW5lbFxyXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lNaWRkbGV3YXJlKCkge1xyXG4gICAgICAgICAgaWYoVXRpbHMuc3VwcG9ydC5hbmltYXRpb24pIHtcclxuICAgICAgICAgICAgcGFyZW50LmFuaW1vKHthbmltYXRpb246ICdib3VuY2VPdXQnfSwgZGVzdHJveVBhbmVsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgZGVzdHJveVBhbmVsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZXN0cm95UGFuZWwoKSB7XHJcblxyXG4gICAgICAgICAgdmFyIGNvbCA9IHBhcmVudC5wYXJlbnQoKTtcclxuICAgICAgICAgIHBhcmVudC5yZW1vdmUoKTtcclxuICAgICAgICAgIC8vIHJlbW92ZSB0aGUgcGFyZW50IGlmIGl0IGlzIGEgcm93IGFuZCBpcyBlbXB0eSBhbmQgbm90IGEgc29ydGFibGUgKHBvcnRsZXQpXHJcbiAgICAgICAgICBjb2xcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgcmV0dXJuIChlbC5pcygnW2NsYXNzKj1cImNvbC1cIl06bm90KC5zb3J0YWJsZSknKSAmJiBlbC5jaGlsZHJlbignKicpLmxlbmd0aCA9PT0gMCk7XHJcbiAgICAgICAgICB9KS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAvLyBDb21tdW5pY2F0ZSBldmVudCBkZXN0cm95ZWQgcGFuZWxcclxuICAgICAgICAgICRzY29wZS4kZW1pdChyZW1vdmVkRXZlbnQsIHBhcmVudC5hdHRyKCdpZCcpKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5cclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIFJlZnJlc2ggcGFuZWxzXHJcbiAqIFtwYW5lbC1yZWZyZXNoXSAqIFtkYXRhLXNwaW5uZXI9XCJzdGFuZGFyZFwiXVxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnBhbmVscycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGFuZWxSZWZyZXNoJywgcGFuZWxSZWZyZXNoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBwYW5lbFJlZnJlc2ggKCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IENvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIHNjb3BlOiBmYWxzZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGVsZW1lbnQnXTtcclxuICAgIGZ1bmN0aW9uIENvbnRyb2xsZXIgKCRzY29wZSwgJGVsZW1lbnQpIHtcclxuICAgICAgdmFyIHJlZnJlc2hFdmVudCAgID0gJ3BhbmVsLXJlZnJlc2gnLFxyXG4gICAgICAgICAgd2hpcmxDbGFzcyAgICAgPSAnd2hpcmwnLFxyXG4gICAgICAgICAgZGVmYXVsdFNwaW5uZXIgPSAnc3RhbmRhcmQnO1xyXG5cclxuICAgICAgLy8gY2F0Y2ggY2xpY2tzIHRvIHRvZ2dsZSBwYW5lbCByZWZyZXNoXHJcbiAgICAgICRlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB2YXIgJHRoaXMgICA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIHBhbmVsICAgPSAkdGhpcy5wYXJlbnRzKCcucGFuZWwnKS5lcSgwKSxcclxuICAgICAgICAgICAgc3Bpbm5lciA9ICR0aGlzLmRhdGEoJ3NwaW5uZXInKSB8fCBkZWZhdWx0U3Bpbm5lclxyXG4gICAgICAgICAgICA7XHJcblxyXG4gICAgICAgIC8vIHN0YXJ0IHNob3dpbmcgdGhlIHNwaW5uZXJcclxuICAgICAgICBwYW5lbC5hZGRDbGFzcyh3aGlybENsYXNzICsgJyAnICsgc3Bpbm5lcik7XHJcblxyXG4gICAgICAgIC8vIEVtaXQgZXZlbnQgd2hlbiByZWZyZXNoIGNsaWNrZWRcclxuICAgICAgICAkc2NvcGUuJGVtaXQocmVmcmVzaEV2ZW50LCBwYW5lbC5hdHRyKCdpZCcpKTtcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gbGlzdGVuIHRvIHJlbW92ZSBzcGlubmVyXHJcbiAgICAgICRzY29wZS4kb24oJ3JlbW92ZVNwaW5uZXInLCByZW1vdmVTcGlubmVyKTtcclxuXHJcbiAgICAgIC8vIG1ldGhvZCB0byBjbGVhciB0aGUgc3Bpbm5lciB3aGVuIGRvbmVcclxuICAgICAgZnVuY3Rpb24gcmVtb3ZlU3Bpbm5lciAoZXYsIGlkKSB7XHJcbiAgICAgICAgaWYgKCFpZCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBuZXdpZCA9IGlkLmNoYXJBdCgwKSA9PT0gJyMnID8gaWQgOiAoJyMnK2lkKTtcclxuICAgICAgICBhbmd1bGFyXHJcbiAgICAgICAgICAuZWxlbWVudChuZXdpZClcclxuICAgICAgICAgIC5yZW1vdmVDbGFzcyh3aGlybENsYXNzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuXHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlIHBhbmVsLXRvb2xzLmpzXG4gKiBEaXJlY3RpdmUgdG9vbHMgdG8gY29udHJvbCBwYW5lbHMuIFxuICogQWxsb3dzIGNvbGxhcHNlLCByZWZyZXNoIGFuZCBkaXNtaXNzIChyZW1vdmUpXG4gKiBTYXZlcyBwYW5lbCBzdGF0ZSBpbiBicm93c2VyIHN0b3JhZ2VcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAucGFuZWxzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgncGFuZWx0b29sJywgcGFuZWx0b29sKTtcblxuICAgIHBhbmVsdG9vbC4kaW5qZWN0ID0gWyckY29tcGlsZScsICckdGltZW91dCddO1xuICAgIGZ1bmN0aW9uIHBhbmVsdG9vbCAoJGNvbXBpbGUsICR0aW1lb3V0KSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHNjb3BlOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgICB2YXIgdGVtcGxhdGVzID0ge1xuICAgICAgICAgICAgLyoganNoaW50IG11bHRpc3RyOiB0cnVlICovXG4gICAgICAgICAgICBjb2xsYXBzZTonPGEgaHJlZj1cIiNcIiBwYW5lbC1jb2xsYXBzZT1cIlwiIHVpYi10b29sdGlwPVwiQ29sbGFwc2UgUGFuZWxcIiBuZy1jbGljaz1cInt7cGFuZWxJZH19ID0gIXt7cGFuZWxJZH19XCI+IFxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZW0gbmctc2hvdz1cInt7cGFuZWxJZH19XCIgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9lbT4gXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxlbSBuZy1zaG93PVwiIXt7cGFuZWxJZH19XCIgY2xhc3M9XCJmYSBmYS1taW51c1wiPjwvZW0+IFxcXG4gICAgICAgICAgICAgICAgICAgICAgPC9hPicsXG4gICAgICAgICAgICBkaXNtaXNzOiAnPGEgaHJlZj1cIiNcIiBwYW5lbC1kaXNtaXNzPVwiXCIgdWliLXRvb2x0aXA9XCJDbG9zZSBQYW5lbFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgIDxlbSBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9lbT5cXFxuICAgICAgICAgICAgICAgICAgICAgPC9hPicsXG4gICAgICAgICAgICByZWZyZXNoOiAnPGEgaHJlZj1cIiNcIiBwYW5lbC1yZWZyZXNoPVwiXCIgZGF0YS1zcGlubmVyPVwie3tzcGlubmVyfX1cIiB1aWItdG9vbHRpcD1cIlJlZnJlc2ggUGFuZWxcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICA8ZW0gY2xhc3M9XCJmYSBmYS1yZWZyZXNoXCI+PC9lbT5cXFxuICAgICAgICAgICAgICAgICAgICAgPC9hPidcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIHRvb2xzID0gc2NvcGUucGFuZWxUb29scyB8fCBhdHRycztcbiAgICAgIFxuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWxlbWVudC5odG1sKGdldFRlbXBsYXRlKGVsZW1lbnQsIHRvb2xzICkpLnNob3coKTtcbiAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdwdWxsLXJpZ2h0Jyk7XG4gICAgICAgICAgfSk7XG4gIFxuICAgICAgICAgIGZ1bmN0aW9uIGdldFRlbXBsYXRlKCBlbGVtLCBhdHRycyApe1xuICAgICAgICAgICAgdmFyIHRlbXAgPSAnJztcbiAgICAgICAgICAgIGF0dHJzID0gYXR0cnMgfHwge307XG4gICAgICAgICAgICBpZihhdHRycy50b29sQ29sbGFwc2UpXG4gICAgICAgICAgICAgIHRlbXAgKz0gdGVtcGxhdGVzLmNvbGxhcHNlLnJlcGxhY2UoL3t7cGFuZWxJZH19L2csIChlbGVtLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoJ2lkJykpICk7XG4gICAgICAgICAgICBpZihhdHRycy50b29sRGlzbWlzcylcbiAgICAgICAgICAgICAgdGVtcCArPSB0ZW1wbGF0ZXMuZGlzbWlzcztcbiAgICAgICAgICAgIGlmKGF0dHJzLnRvb2xSZWZyZXNoKVxuICAgICAgICAgICAgICB0ZW1wICs9IHRlbXBsYXRlcy5yZWZyZXNoLnJlcGxhY2UoL3t7c3Bpbm5lcn19L2csIGF0dHJzLnRvb2xSZWZyZXNoKTtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wO1xuICAgICAgICAgIH1cbiAgICAgICAgfS8vIGxpbmtcbiAgICB9IFxuXG59KSgpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IGRlbW8tcGFuZWxzLmpzXG4gKiBQcm92aWRlcyBhIHNpbXBsZSBkZW1vIGZvciBwYW5lbCBhY3Rpb25zXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnBhbmVscycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQYW5lbHNDdHJsJywgUGFuZWxzQ3RybCk7XG5cbiAgICBQYW5lbHNDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckdGltZW91dCddO1xuICAgIGZ1bmN0aW9uIFBhbmVsc0N0cmwoJHNjb3BlLCAkdGltZW91dCkge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG4gICAgICAgICAgLy8gUEFORUwgQ09MTEFQU0UgRVZFTlRTXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG5cbiAgICAgICAgICAvLyBXZSBjYW4gdXNlIHBhbmVsIGlkIG5hbWUgZm9yIHRoZSBib29sZWFuIGZsYWcgdG8gW3VuXWNvbGxhcHNlIHRoZSBwYW5lbFxuICAgICAgICAgICRzY29wZS4kd2F0Y2goJ3BhbmVsRGVtbzEnLGZ1bmN0aW9uKG5ld1ZhbCl7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygncGFuZWxEZW1vMSBjb2xsYXBzZWQ6ICcgKyBuZXdWYWwpO1xuXG4gICAgICAgICAgfSk7XG5cblxuICAgICAgICAgIC8vIFBBTkVMIERJU01JU1MgRVZFTlRTXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG5cbiAgICAgICAgICAvLyBCZWZvcmUgcmVtb3ZlIHBhbmVsXG4gICAgICAgICAgJHNjb3BlLiRvbigncGFuZWwtcmVtb3ZlJywgZnVuY3Rpb24oZXZlbnQsIGlkLCBkZWZlcnJlZCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQYW5lbCAjJyArIGlkICsgJyByZW1vdmluZycpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBIZXJlIGlzIG9ibGlnYXRvcnkgdG8gY2FsbCB0aGUgcmVzb2x2ZSgpIGlmIHdlIHByZXRlbmQgdG8gcmVtb3ZlIHRoZSBwYW5lbCBmaW5hbGx5XG4gICAgICAgICAgICAvLyBOb3QgY2FsbGluZyByZXNvbHZlKCkgd2lsbCBOT1QgcmVtb3ZlIHRoZSBwYW5lbFxuICAgICAgICAgICAgLy8gSXQncyB1cCB0byB5b3VyIGFwcCB0byBkZWNpZGUgaWYgcGFuZWwgc2hvdWxkIGJlIHJlbW92ZWQgb3Igbm90XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBQYW5lbCByZW1vdmVkICggb25seSBpZiBhYm92ZSB3YXMgcmVzb2x2ZWQoKSApXG4gICAgICAgICAgJHNjb3BlLiRvbigncGFuZWwtcmVtb3ZlZCcsIGZ1bmN0aW9uKGV2ZW50LCBpZCl7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQYW5lbCAjJyArIGlkICsgJyByZW1vdmVkJyk7XG5cbiAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgLy8gUEFORUwgUkVGUkVTSCBFVkVOVFNcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuICAgICAgICAgICRzY29wZS4kb24oJ3BhbmVsLXJlZnJlc2gnLCBmdW5jdGlvbihldmVudCwgaWQpIHtcbiAgICAgICAgICAgIHZhciBzZWNzID0gMztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlZnJlc2hpbmcgZHVyaW5nICcgKyBzZWNzICsncyAjJytpZCk7XG5cbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIC8vIGRpcmVjdGl2ZSBsaXN0ZW4gZm9yIHRvIHJlbW92ZSB0aGUgc3Bpbm5lciBcbiAgICAgICAgICAgICAgLy8gYWZ0ZXIgd2UgZW5kIHVwIHRvIHBlcmZvcm0gb3duIG9wZXJhdGlvbnNcbiAgICAgICAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ3JlbW92ZVNwaW5uZXInLCBpZCk7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVmcmVzaGVkICMnICsgaWQpO1xuXG4gICAgICAgICAgICB9LCAzMDAwKTtcblxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gUEFORUxTIFZJQSBORy1SRVBFQVRcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuICAgICAgICAgICRzY29wZS5wYW5lbHMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiAncGFuZWxSZXBlYXQxJyxcbiAgICAgICAgICAgICAgdGl0bGU6ICdQYW5lbCBUaXRsZSAxJyxcbiAgICAgICAgICAgICAgYm9keTogJ051bGxhIGVnZXQgbG9yZW0gbGVvLCBzaXQgYW1ldCBlbGVtZW50dW0gbG9yZW0uICdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiAncGFuZWxSZXBlYXQyJyxcbiAgICAgICAgICAgICAgdGl0bGU6ICdQYW5lbCBUaXRsZSAyJyxcbiAgICAgICAgICAgICAgYm9keTogJ051bGxhIGVnZXQgbG9yZW0gbGVvLCBzaXQgYW1ldCBlbGVtZW50dW0gbG9yZW0uICdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiAncGFuZWxSZXBlYXQzJyxcbiAgICAgICAgICAgICAgdGl0bGU6ICdQYW5lbCBUaXRsZSAzJyxcbiAgICAgICAgICAgICAgYm9keTogJ051bGxhIGVnZXQgbG9yZW0gbGVvLCBzaXQgYW1ldCBlbGVtZW50dW0gbG9yZW0uICdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdO1xuICAgICAgICB9XG5cbiAgICB9IC8vUGFuZWxzQ3RybFxuXG59KSgpO1xuXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIERyYWcgYW5kIGRyb3AgYW55IHBhbmVsIGJhc2VkIG9uIGpRdWVyeVVJIHBvcnRsZXRzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnBhbmVscycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BvcnRsZXQnLCBwb3J0bGV0KTtcblxuICAgIHBvcnRsZXQuJGluamVjdCA9IFsnJHRpbWVvdXQnLCAnJGxvY2FsU3RvcmFnZSddO1xuICAgIGZ1bmN0aW9uIHBvcnRsZXQgKCR0aW1lb3V0LCAkbG9jYWxTdG9yYWdlKSB7XG4gICAgICB2YXIgc3RvcmFnZUtleU5hbWUgPSAncG9ydGxldFN0YXRlJztcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogbGlua1xuICAgICAgfTtcblxuICAgICAgLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgXG4gICAgICAgIC8vIG5vdCBjb21wYXRpYmxlIHdpdGgganF1ZXJ5IHNvcnRhYmxlXG4gICAgICAgIGlmKCEkLmZuLnNvcnRhYmxlKSByZXR1cm47XG5cbiAgICAgICAgZWxlbWVudC5zb3J0YWJsZSh7XG4gICAgICAgICAgY29ubmVjdFdpdGg6ICAgICAgICAgICdbcG9ydGxldF0nLCAvLyBzYW1lIGxpa2UgZGlyZWN0aXZlIFxuICAgICAgICAgIGl0ZW1zOiAgICAgICAgICAgICAgICAnZGl2LnBhbmVsJyxcbiAgICAgICAgICBoYW5kbGU6ICAgICAgICAgICAgICAgJy5wb3J0bGV0LWhhbmRsZXInLFxuICAgICAgICAgIG9wYWNpdHk6ICAgICAgICAgICAgICAwLjcsXG4gICAgICAgICAgcGxhY2Vob2xkZXI6ICAgICAgICAgICdwb3J0bGV0IGJveC1wbGFjZWhvbGRlcicsXG4gICAgICAgICAgY2FuY2VsOiAgICAgICAgICAgICAgICcucG9ydGxldC1jYW5jZWwnLFxuICAgICAgICAgIGZvcmNlUGxhY2Vob2xkZXJTaXplOiB0cnVlLFxuICAgICAgICAgIGlmcmFtZUZpeDogICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICB0b2xlcmFuY2U6ICAgICAgICAgICAgJ3BvaW50ZXInLFxuICAgICAgICAgIGhlbHBlcjogICAgICAgICAgICAgICAnb3JpZ2luYWwnLFxuICAgICAgICAgIHJldmVydDogICAgICAgICAgICAgICAyMDAsXG4gICAgICAgICAgZm9yY2VIZWxwZXJTaXplOiAgICAgIHRydWUsXG4gICAgICAgICAgdXBkYXRlOiAgICAgICAgICAgICAgIHNhdmVQb3J0bGV0T3JkZXIsXG4gICAgICAgICAgY3JlYXRlOiAgICAgICAgICAgICAgIGxvYWRQb3J0bGV0T3JkZXJcbiAgICAgICAgfSk7XG5cbiAgICAgIH1cblxuXG4gICAgICBmdW5jdGlvbiBzYXZlUG9ydGxldE9yZGVyKGV2ZW50LyosIHVpKi8pIHtcbiAgICAgICAgdmFyIHNlbGYgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIHZhciBkYXRhID0gYW5ndWxhci5mcm9tSnNvbigkbG9jYWxTdG9yYWdlW3N0b3JhZ2VLZXlOYW1lXSk7XG4gICAgICAgIFxuICAgICAgICBpZighZGF0YSkgeyBkYXRhID0ge307IH1cblxuICAgICAgICBkYXRhW3NlbGYuaWRdID0gJChzZWxmKS5zb3J0YWJsZSgndG9BcnJheScpO1xuXG4gICAgICAgIGlmKGRhdGEpIHtcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRsb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleU5hbWVdID0gYW5ndWxhci50b0pzb24oZGF0YSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbG9hZFBvcnRsZXRPcmRlcihldmVudCkge1xuICAgICAgICB2YXIgc2VsZiA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgdmFyIGRhdGEgPSBhbmd1bGFyLmZyb21Kc29uKCRsb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleU5hbWVdKTtcblxuICAgICAgICBpZihkYXRhKSB7XG4gICAgICAgICAgXG4gICAgICAgICAgdmFyIHBvcmxldElkID0gc2VsZi5pZCxcbiAgICAgICAgICAgICAgcGFuZWxzICAgPSBkYXRhW3BvcmxldElkXTtcblxuICAgICAgICAgIGlmKHBhbmVscykge1xuICAgICAgICAgICAgdmFyIHBvcnRsZXQgPSAkKCcjJytwb3JsZXRJZCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQuZWFjaChwYW5lbHMsIGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgJCgnIycrdmFsdWUpLmFwcGVuZFRvKHBvcnRsZXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cblxufSkoKTtcbiAiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wcmVsb2FkZXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3ByZWxvYWRlcicsIHByZWxvYWRlcik7XHJcblxyXG4gICAgcHJlbG9hZGVyLiRpbmplY3QgPSBbJyRhbmltYXRlJywgJyR0aW1lb3V0JywgJyRxJ107XHJcbiAgICBmdW5jdGlvbiBwcmVsb2FkZXIgKCRhbmltYXRlLCAkdGltZW91dCwgJHEpIHtcclxuXHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogXHJcbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwcmVsb2FkZXItcHJvZ3Jlc3NcIj4nICtcclxuICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwcmVsb2FkZXItcHJvZ3Jlc3MtYmFyXCIgJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJ25nLXN0eWxlPVwie3dpZHRoOiBsb2FkQ291bnRlciArIFxcJyVcXCd9XCI+PC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgJzwvZGl2PidcclxuICAgICAgICAgICAgLFxyXG4gICAgICAgICAgICBsaW5rOiBsaW5rXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICAvLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsKSB7XHJcblxyXG4gICAgICAgICAgc2NvcGUubG9hZENvdW50ZXIgPSAwO1xyXG5cclxuICAgICAgICAgIHZhciBjb3VudGVyICA9IDAsXHJcbiAgICAgICAgICAgICAgdGltZW91dDtcclxuXHJcbiAgICAgICAgICAvLyBkaXNhYmxlcyBzY3JvbGxiYXJcclxuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLmNzcygnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XHJcbiAgICAgICAgICAvLyBlbnN1cmUgY2xhc3MgaXMgcHJlc2VudCBmb3Igc3R5bGluZ1xyXG4gICAgICAgICAgZWwuYWRkQ2xhc3MoJ3ByZWxvYWRlcicpO1xyXG5cclxuICAgICAgICAgIGFwcFJlYWR5KCkudGhlbihlbmRDb3VudGVyKTtcclxuXHJcbiAgICAgICAgICB0aW1lb3V0ID0gJHRpbWVvdXQoc3RhcnRDb3VudGVyKTtcclxuXHJcbiAgICAgICAgICAvLy8vLy8vXHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gc3RhcnRDb3VudGVyKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlbWFpbmluZyA9IDEwMCAtIGNvdW50ZXI7XHJcbiAgICAgICAgICAgIGNvdW50ZXIgPSBjb3VudGVyICsgKDAuMDE1ICogTWF0aC5wb3coMSAtIE1hdGguc3FydChyZW1haW5pbmcpLCAyKSk7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5sb2FkQ291bnRlciA9IHBhcnNlSW50KGNvdW50ZXIsIDEwKTtcclxuXHJcbiAgICAgICAgICAgIHRpbWVvdXQgPSAkdGltZW91dChzdGFydENvdW50ZXIsIDIwKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBlbmRDb3VudGVyKCkge1xyXG5cclxuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVvdXQpO1xyXG5cclxuICAgICAgICAgICAgc2NvcGUubG9hZENvdW50ZXIgPSAxMDA7XHJcblxyXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgIC8vIGFuaW1hdGUgcHJlbG9hZGVyIGhpZGluZ1xyXG4gICAgICAgICAgICAgICRhbmltYXRlLmFkZENsYXNzKGVsLCAncHJlbG9hZGVyLWhpZGRlbicpO1xyXG4gICAgICAgICAgICAgIC8vIHJldG9yZSBzY3JvbGxiYXJcclxuICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKS5jc3MoJ292ZXJmbG93JywgJycpO1xyXG4gICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGFwcFJlYWR5KCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICB2YXIgdmlld3NMb2FkZWQgPSAwO1xyXG4gICAgICAgICAgICAvLyBpZiB0aGlzIGRvZXNuJ3Qgc3luYyB3aXRoIHRoZSByZWFsIGFwcCByZWFkeVxyXG4gICAgICAgICAgICAvLyBhIGN1c3RvbSBldmVudCBtdXN0IGJlIHVzZWQgaW5zdGVhZFxyXG4gICAgICAgICAgICB2YXIgb2ZmID0gc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgdmlld3NMb2FkZWQgKys7XHJcbiAgICAgICAgICAgICAgLy8gd2Uga25vdyB0aGVyZSBhcmUgYXQgbGVhc3QgdHdvIHZpZXdzIHRvIGJlIGxvYWRlZCBcclxuICAgICAgICAgICAgICAvLyBiZWZvcmUgdGhlIGFwcCBpcyByZWFkeSAoMS1pbmRleC5odG1sIDItYXBwKi5odG1sKVxyXG4gICAgICAgICAgICAgIGlmICggdmlld3NMb2FkZWQgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIC8vIHdpdGggcmVzb2x2ZSB0aGlzIGZpcmVzIG9ubHkgb25jZVxyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSwgMzAwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgb2ZmKCk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSAvL2xpbmtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogaGVscGVycy5qc1xyXG4gKiBQcm92aWRlcyBoZWxwZXIgZnVuY3Rpb25zIGZvciByb3V0ZXMgZGVmaW5pdGlvblxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdXRlcycpXHJcbiAgICAgICAgLnByb3ZpZGVyKCdSb3V0ZUhlbHBlcnMnLCBSb3V0ZUhlbHBlcnNQcm92aWRlcilcclxuICAgICAgICA7XHJcblxyXG4gICAgUm91dGVIZWxwZXJzUHJvdmlkZXIuJGluamVjdCA9IFsnQVBQX1JFUVVJUkVTJ107XHJcbiAgICBmdW5jdGlvbiBSb3V0ZUhlbHBlcnNQcm92aWRlcihBUFBfUkVRVUlSRVMpIHtcclxuXHJcbiAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIHByb3ZpZGVyIGFjY2VzcyBsZXZlbFxyXG4gICAgICAgIGJhc2VwYXRoOiBiYXNlcGF0aCxcclxuICAgICAgICByZXNvbHZlRm9yOiByZXNvbHZlRm9yLFxyXG4gICAgICAgIC8vIGNvbnRyb2xsZXIgYWNjZXNzIGxldmVsXHJcbiAgICAgICAgJGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBiYXNlcGF0aDogYmFzZXBhdGgsXHJcbiAgICAgICAgICAgIHJlc29sdmVGb3I6IHJlc29sdmVGb3JcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gU2V0IGhlcmUgdGhlIGJhc2Ugb2YgdGhlIHJlbGF0aXZlIHBhdGhcclxuICAgICAgLy8gZm9yIGFsbCBhcHAgdmlld3NcclxuICAgICAgZnVuY3Rpb24gYmFzZXBhdGgodXJpKSB7XHJcbiAgICAgICAgcmV0dXJuICdhcHAvdmlld3MvJyArIHVyaTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gR2VuZXJhdGVzIGEgcmVzb2x2ZSBvYmplY3QgYnkgcGFzc2luZyBzY3JpcHQgbmFtZXNcclxuICAgICAgLy8gcHJldmlvdXNseSBjb25maWd1cmVkIGluIGNvbnN0YW50LkFQUF9SRVFVSVJFU1xyXG4gICAgICBmdW5jdGlvbiByZXNvbHZlRm9yKCkge1xyXG4gICAgICAgIHZhciBfYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgZGVwczogWyckb2NMYXp5TG9hZCcsJyRxJywgZnVuY3Rpb24gKCRvY0xMLCAkcSkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGVzIGEgcHJvbWlzZSBjaGFpbiBmb3IgZWFjaCBhcmd1bWVudFxyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLndoZW4oMSk7IC8vIGVtcHR5IHByb21pc2VcclxuICAgICAgICAgICAgZm9yKHZhciBpPTAsIGxlbj1fYXJncy5sZW5ndGg7IGkgPCBsZW47IGkgKyspe1xyXG4gICAgICAgICAgICAgIHByb21pc2UgPSBhbmRUaGVuKF9hcmdzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZXMgcHJvbWlzZSB0byBjaGFpbiBkeW5hbWljYWxseVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBhbmRUaGVuKF9hcmcpIHtcclxuICAgICAgICAgICAgICAvLyBhbHNvIHN1cHBvcnQgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlXHJcbiAgICAgICAgICAgICAgaWYodHlwZW9mIF9hcmcgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oX2FyZyk7XHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGlzIGEgbW9kdWxlLCBwYXNzIHRoZSBuYW1lLiBJZiBub3QsIHBhc3MgdGhlIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdoYXRUb0xvYWQgPSBnZXRSZXF1aXJlZChfYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaW1wbGUgZXJyb3IgY2hlY2tcclxuICAgICAgICAgICAgICAgICAgICBpZighd2hhdFRvTG9hZCkgcmV0dXJuICQuZXJyb3IoJ1JvdXRlIHJlc29sdmU6IEJhZCByZXNvdXJjZSBuYW1lIFsnICsgX2FyZyArICddJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZmluYWxseSwgcmV0dXJuIGEgcHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMTC5sb2FkKCB3aGF0VG9Mb2FkICk7XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGFuZCByZXR1cm5zIHJlcXVpcmVkIGRhdGFcclxuICAgICAgICAgICAgLy8gYW5hbHl6ZSBtb2R1bGUgaXRlbXMgd2l0aCB0aGUgZm9ybSBbbmFtZTogJycsIGZpbGVzOiBbXV1cclxuICAgICAgICAgICAgLy8gYW5kIGFsc28gc2ltcGxlIGFycmF5IG9mIHNjcmlwdCBmaWxlcyAoZm9yIG5vdCBhbmd1bGFyIGpzKVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRSZXF1aXJlZChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgaWYgKEFQUF9SRVFVSVJFUy5tb2R1bGVzKVxyXG4gICAgICAgICAgICAgICAgICBmb3IodmFyIG0gaW4gQVBQX1JFUVVJUkVTLm1vZHVsZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICBpZihBUFBfUkVRVUlSRVMubW9kdWxlc1ttXS5uYW1lICYmIEFQUF9SRVFVSVJFUy5tb2R1bGVzW21dLm5hbWUgPT09IG5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFQUF9SRVFVSVJFUy5tb2R1bGVzW21dO1xyXG4gICAgICAgICAgICAgIHJldHVybiBBUFBfUkVRVUlSRVMuc2NyaXB0cyAmJiBBUFBfUkVRVUlSRVMuc2NyaXB0c1tuYW1lXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH1dfTtcclxuICAgICAgfSAvLyByZXNvbHZlRm9yXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbn0pKCk7XHJcblxyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBjb25maWcuanNcclxuICogQXBwIHJvdXRlcyBhbmQgcmVzb3VyY2VzIGNvbmZpZ3VyYXRpb25cclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm91dGVzJylcclxuICAgICAgICAuY29uZmlnKHJvdXRlc0NvbmZpZyk7XHJcblxyXG4gICAgcm91dGVzQ29uZmlnLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICdSb3V0ZUhlbHBlcnNQcm92aWRlciddO1xyXG4gICAgZnVuY3Rpb24gcm91dGVzQ29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCBoZWxwZXIpe1xyXG5cclxuICAgICAgICAvLyBTZXQgdGhlIGZvbGxvd2luZyB0byB0cnVlIHRvIGVuYWJsZSB0aGUgSFRNTDUgTW9kZVxyXG4gICAgICAgIC8vIFlvdSBtYXkgaGF2ZSB0byBzZXQgPGJhc2U+IHRhZyBpbiBpbmRleCBhbmQgYSByb3V0aW5nIGNvbmZpZ3VyYXRpb24gaW4geW91ciBzZXJ2ZXJcclxuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoZmFsc2UpO1xyXG5cclxuICAgICAgICAvLyBkZWZhdWx0cyB0byBkYXNoYm9hcmRcclxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvYXBwL2Rhc2hib2FyZCcpO1xyXG5cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIEFwcGxpY2F0aW9uIFJvdXRlc1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwJywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9hcHAnLFxyXG4gICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBoZWxwZXIuYmFzZXBhdGgoJ2FwcC5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ2Zhc3RjbGljaycsICdtb2Rlcm5penInLCAnaWNvbnMnLCAnc2NyZWVuZnVsbCcsICdhbmltbycsICdzcGFya2xpbmVzJywgJ3NsaW1zY3JvbGwnLCAnY2xhc3N5bG9hZGVyJywgJ3RvYXN0ZXInLCAnd2hpcmwnLCAnbW9tZW50JylcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ2FwcC5kYXNoYm9hcmQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2Rhc2hib2FyZCcsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdEYXNoYm9hcmQnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBoZWxwZXIuYmFzZXBhdGgoJ2Rhc2hib2FyZC5odG1sJyksXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Rhc2hib2FyZENvbnRyb2xsZXIgYXMgZGFzaCcsXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ2Zsb3QtY2hhcnQnLCdmbG90LWNoYXJ0LXBsdWdpbnMnLCAnd2VhdGhlci1pY29ucycpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAuc2VsbCcsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvc2VsbCcsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdzZWxsJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdzZWxsLmh0bWwnKSxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2VsbENvbnRyb2xsZXIgYXMgc2VsbCcsXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdEaWFsb2cnLCAnb2l0b3plcm8ubmdTd2VldEFsZXJ0JywgJ2xvYWRlcnMuY3NzJywgJ3NwaW5raXQnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLm1lbWJlcnMnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL21lbWJlcnMnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnTWVtYmVycycsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnbWVtYmVycy5odG1sJyksXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01lbWJlcnNDb250cm9sbGVyIGFzIG1lbWJlcnMnLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCduZ1RhYmxlJywgJ25nVGFibGVFeHBvcnQnLCAnbmdEaWFsb2cnLCAnb2l0b3plcm8ubmdTd2VldEFsZXJ0JywgJ3NwaW5raXQnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLm1lbWJlcicsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvbWVtYmVycy86bWVtYmVySWQnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnTWVtYmVyIERldGFpbCcsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnbWVtYmVyLmh0bWwnKSxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWVtYmVyQ29udHJvbGxlciBhcyBtZW1iZXInLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCduZ1RhYmxlJywgJ25nRGlhbG9nJywgJ29pdG96ZXJvLm5nU3dlZXRBbGVydCcsICdzcGlua2l0JylcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ2FwcC5kZWFscycsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvZGVhbHMnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnRGVhbHMnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBoZWxwZXIuYmFzZXBhdGgoJ2RlYWxzLmh0bWwnKSxcclxuICAgICAgICAgICAgICByZXNvbHZlOiBoZWxwZXIucmVzb2x2ZUZvcignbmdUYWJsZScsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAuZGVhbCcsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvZGVhbHMvOmRlYWxJZCcsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdEZWFsJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdkZWFsLmh0bWwnKSxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGVhbENvbnRyb2xsZXIgYXMgZGMnLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCduZ1RhYmxlJywgJ25nRGlhbG9nJywgJ29pdG96ZXJvLm5nU3dlZXRBbGVydCcsICdzcGlua2l0JylcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ2FwcC5jb3N0Jywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9jb3N0JyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0Nvc3QnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBoZWxwZXIuYmFzZXBhdGgoJ2Nvc3QuaHRtbCcpLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCduZ1RhYmxlJywgJ25nVGFibGVFeHBvcnQnLCAnbmdEaWFsb2cnLCAnb2l0b3plcm8ubmdTd2VldEFsZXJ0JywgJ3NwaW5raXQnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLml0ZW0nLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2l0ZW0nLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnSXRlbScsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnaXRlbS5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdUYWJsZUV4cG9ydCcsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAuaXRlbS1hZGQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2l0ZW0tYWRkJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0l0ZW0gQWRkJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdpdGVtLWFkZC5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ3BhcnNsZXknKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLmNhcmQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2NhcmQnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnQ2FyZCcsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnY2FyZC5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdUYWJsZUV4cG9ydCcsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAuY2FtcGFpZ24nLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2NhbXBhaWduJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0NhbXBhaWduJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdjYW1wYWlnbi5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdUYWJsZUV4cG9ydCcsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAubXlzaG9wJywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9teXNob3AnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnTXlTaG9wJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdteXNob3AuaHRtbCcpLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCd4ZWRpdGFibGUnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLnNldHRpbmcnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3NldHRpbmcnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnU2V0dGluZycsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnc2V0dGluZy5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdUYWJsZUV4cG9ydCcsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLy9cclxuICAgICAgICAgIC8vIFNpbmdsZSBQYWdlIFJvdXRlc1xyXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgIC5zdGF0ZSgncGFnZScsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZScsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvcGFnZS5odG1sJyxcclxuICAgICAgICAgICAgICByZXNvbHZlOiBoZWxwZXIucmVzb2x2ZUZvcignbW9kZXJuaXpyJywgJ2ljb25zJyksXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogWyckcm9vdFNjb3BlJywgZnVuY3Rpb24oJHJvb3RTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmFwcC5sYXlvdXQuaXNCb3hlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdwYWdlLmxvZ2luJywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdMb2dpbicsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvbG9naW4uaHRtbCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ3BhZ2UucmVnaXN0ZXInLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ1JlZ2lzdGVyJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy9yZWdpc3Rlci5odG1sJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgncGFnZS5yZWNvdmVyJywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9yZWNvdmVyJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ1JlY292ZXInLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BhZ2VzL3JlY292ZXIuaHRtbCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ3BhZ2UuNDA0Jywge1xyXG4gICAgICAgICAgICAgIHVybDogJy80MDQnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnTm90IEZvdW5kJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy80MDQuaHRtbCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAvL1xyXG4gICAgICAgICAgLy8gQ1VTVE9NIFJFU09MVkVTXHJcbiAgICAgICAgICAvLyAgIEFkZCB5b3VyIG93biByZXNvbHZlcyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAvLyAgIGZvbGxvd2luZyB0aGlzIG9iamVjdCBleHRlbmRcclxuICAgICAgICAgIC8vICAgbWV0aG9kXHJcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgLy8gLnN0YXRlKCdhcHAuc29tZXJvdXRlJywge1xyXG4gICAgICAgICAgLy8gICB1cmw6ICcvc29tZV91cmwnLFxyXG4gICAgICAgICAgLy8gICB0ZW1wbGF0ZVVybDogJ3BhdGhfdG9fdGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAvLyAgIGNvbnRyb2xsZXI6ICdzb21lQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAvLyAgIHJlc29sdmU6IGFuZ3VsYXIuZXh0ZW5kKFxyXG4gICAgICAgICAgLy8gICAgIGhlbHBlci5yZXNvbHZlRm9yKCksIHtcclxuICAgICAgICAgIC8vICAgICAvLyBZT1VSIFJFU09MVkVTIEdPIEhFUkVcclxuICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAvLyAgIClcclxuICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICA7XHJcblxyXG4gICAgfSAvLyByb3V0ZXNDb25maWdcclxuXHJcbn0pKCk7XHJcblxyXG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuc2FsZXMnKVxuICAgICAgICAuc2VydmljZSgnZGVhbFNlcnZpY2UnLCBkZWFsU2VydmljZSlcbiAgICAgICAgLnNlcnZpY2UoJ3JldHVyblNlcnZpY2UnLCByZXR1cm5TZXJ2aWNlKVxuICAgIDtcblxuICAgIGRlYWxTZXJ2aWNlLiRpbmplY3QgPSBbJ0RlYWwnLCAnU2t1JywgJ25nRGlhbG9nJywgJyRyb290U2NvcGUnXTtcbiAgICBmdW5jdGlvbiBkZWFsU2VydmljZShEZWFsLCBTa3UsIG5nRGlhbG9nLCAkcm9vdFNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHRoaXMub3BlbkRlYWwgPSBvcGVuRGVhbDtcbiAgICAgIHRoaXMucXVlcnlTa3VzID0gcXVlcnlTa3VzO1xuICAgICAgdGhpcy5yZWdpc3RlciA9IHJlZ2lzdGVyO1xuICAgICAgdGhpcy5zdWJzdHJhY3RPbmUgPSBzdWJzdHJhY3RPbmU7XG4gICAgICB0aGlzLmNvdW50VG90YWwgPSBjb3VudFRvdGFsO1xuICAgICAgdGhpcy5jaGVja291dCA9IGNoZWNrb3V0OyBcbiAgICAgIHRoaXMub25DaGFuZ2VQYXlUeXBlID0gb25DaGFuZ2VQYXlUeXBlO1xuICAgICAgdGhpcy5jb3VudENoYW5nZSA9IGNvdW50Q2hhbmdlO1xuICAgICAgdGhpcy5wYXkgPSBwYXk7XG4gICAgICB0aGlzLnBheVR5cGUgPSB7XG4gICAgICAgIGRlcG9zaXQ6IFwi5Lya5ZGY5YKo5YC8XCIsXG4gICAgICAgIGNhc2g6IFwi546w6YeR5pSv5LuYXCIsXG4gICAgICAgIGJhbmtjYXJkOiBcIuWIt+WNoeaUr+S7mFwiLFxuICAgICAgICB3eHBheTogXCLlvq7kv6HmlK/ku5hcIixcbiAgICAgICAgYWxpcGF5OiBcIuaUr+S7mOWunVwiXG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBvcGVuRGVhbChtZW1iZXIpIHtcbiAgICAgICAgc2VsZi5kZWFsID0ge1xuICAgICAgICAgIGVudGl0aWVzOiBbXSxcbiAgICAgICAgICB0b3RhbEFtb3VudDogMCxcbiAgICAgICAgICB0b3RhbFF0eTogMCxcbiAgICAgICAgICBtZW1iZXI6IG1lbWJlcixcbiAgICAgICAgICBzdGF0dXM6ICdvcGVuZWQnLFxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKClcbiAgICAgICAgfVxuICAgICAgICBzZWxmLnNlbGVjdGVkU2t1ID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBxdWVyeVNrdXMgKHZhbCkge1xuICAgICAgICByZXR1cm4gU2t1LmZpbmQoe2ZpbHRlcjp7d2hlcmU6e2JhcmNvZGU6e3JlZ2V4OiB2YWx9fX0sIGxpbWl0OiAxMH0pXG4gICAgICAgIC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChza3VzKSB7XG4gICAgICAgICAgcmV0dXJuIHNrdXM7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICBmdW5jdGlvbiByZWdpc3RlciAoKSB7XG4gICAgICAgIGlmKHNlbGYuc2VsZWN0ZWRTa3UgJiYgc2VsZi5zZWxlY3RlZFNrdSBpbnN0YW5jZW9mIFNrdSkge1xuICAgICAgICAgIHZhciBlbnRpdHkgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHNlbGYuZGVhbC5lbnRpdGllcywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmKGUuc2t1LmJhcmNvZGUgPT09IHNlbGYuc2VsZWN0ZWRTa3UuYmFyY29kZSl7XG4gICAgICAgICAgICAgIGUucXR5Kys7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYoIWVudGl0eSkge1xuICAgICAgICAgICAgZW50aXR5ID0ge1xuICAgICAgICAgICAgICBza3U6IHNlbGYuc2VsZWN0ZWRTa3UsXG4gICAgICAgICAgICAgIHF0eTogMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHNlbGYuZGVhbC5lbnRpdGllcy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNlbGYuc2VsZWN0ZWRTa3UgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHN1YnN0cmFjdE9uZSAoZW50aXR5LCBpbmRleCkge1xuICAgICAgICBlbnRpdHkucXR5LS07XG4gICAgICAgIGlmKGVudGl0eS5xdHkgPT09IDApIHtcbiAgICAgICAgICBzZWxmLmRlYWwuZW50aXRpZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICBmdW5jdGlvbiBjb3VudFRvdGFsICgpIHtcbiAgICAgICAgc2VsZi5kZWFsLnRvdGFsQW1vdW50ID0gMDtcbiAgICAgICAgc2VsZi5kZWFsLnRvdGFsUXR5ID0gMDtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHNlbGYuZGVhbC5lbnRpdGllcywgZnVuY3Rpb24gKGVudGl0eSkge1xuICAgICAgICAgIHNlbGYuZGVhbC50b3RhbFF0eSArPSBlbnRpdHkucXR5O1xuICAgICAgICAgIHNlbGYuZGVhbC50b3RhbEFtb3VudCArPSBlbnRpdHkucXR5KmVudGl0eS5za3UucHJpY2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc2VsZi5kZWFsLnRvdGFsQW1vdW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBjaGVja291dCAoKSB7XG4gICAgICAgIHNlbGYuZGVhbC5wYXltZW50ID0ge3R5cGU6ICdjYXNoJ307XG4gICAgICAgIGlmKHNlbGYuZGVhbC5tZW1iZXIpIHtcbiAgICAgICAgICBzZWxmLmRlYWwubWVtYmVySWQgPSBzZWxmLmRlYWwubWVtYmVyLmlkO1xuICAgICAgICAgIHNlbGYuZGVhbC5kaXNjb3VudEFtb3VudCA9IHNlbGYuZGVhbC50b3RhbEFtb3VudCooMTAwLXNlbGYuZGVhbC5tZW1iZXIuZGlzY291bnQpLzEwMDtcbiAgICAgICAgICBpZigkcm9vdFNjb3BlLnVzZXIubWVyY2hhbnQuZW5hYmxlQm9udXNCaWQpIHtcbiAgICAgICAgICAgIHNlbGYuZGVhbC5ib251c1ZvdWNoQW1vdW50ID0gTWF0aC5yb3VuZChzZWxmLmRlYWwubWVtYmVyLmJvbnVzLyRyb290U2NvcGUudXNlci5tZXJjaGFudC5ib251c0JpZFJhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLmRlYWwuZGlzY291bnRBbW91bnQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuZGVhbC5mZWUgPSBzZWxmLmRlYWwudG90YWxBbW91bnQtc2VsZi5kZWFsLmRpc2NvdW50QW1vdW50O1xuICAgICAgICBpZihzZWxmLmRlYWwubWVtYmVyKSB7XG4gICAgICAgICAgaWYoJHJvb3RTY29wZS51c2VyLm1lcmNoYW50LmVuYWJsZUJvbnVzQmlkKSB7XG4gICAgICAgICAgICBpZihzZWxmLmRlYWwuYm9udXNWb3VjaEFtb3VudCA+IHNlbGYuZGVhbC5mZWUpIHtcbiAgICAgICAgICAgICAgc2VsZi5kZWFsLmJvbnVzVm91Y2hBbW91bnQgPSBzZWxmLmRlYWwuZmVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5kZWFsLmZlZSAtPSBzZWxmLmRlYWwuYm9udXNWb3VjaEFtb3VudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoc2VsZi5kZWFsLm1lbWJlci5iYWxhbmNlID49IHNlbGYuZGVhbC5mZWUpIHtcbiAgICAgICAgICAgIHNlbGYuZGVhbC5wYXltZW50LnR5cGUgPSAnZGVwb3NpdCc7XG4gICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICBcbiAgICAgICAgb25DaGFuZ2VQYXlUeXBlKCk7XG4gICAgICAgIFxuICAgICAgICBuZ0RpYWxvZy5vcGVuKHsgXG4gICAgICAgICAgdGVtcGxhdGU6ICdjaGVja291dERpYWxvZ0lkJywgXG4gICAgICAgICAgY29udHJvbGxlcjogJ2NoZWNrb3V0RGlhbG9nQ29udHJvbGxlcidcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIG9uQ2hhbmdlUGF5VHlwZSgpIHtcbiAgICAgICAgc2VsZi5kZWFsLnBheW1lbnQuYW1vdW50ID0gc2VsZi5kZWFsLmZlZTtcbiAgICAgICAgaWYoc2VsZi5kZWFsLnBheW1lbnQudHlwZSA9PT0gJ2Nhc2gnKSB7XG4gICAgICAgICAgc2VsZi5kZWFsLnBheW1lbnQuY2hhbmdlID0gc2VsZi5kZWFsLmZlZSUkcm9vdFNjb3BlLnVzZXIubWVyY2hhbnQuY2hhbmdlUmF0ZTtcbiAgICAgICAgICBzZWxmLmRlYWwucGF5bWVudC5hbW91bnQgLT0gc2VsZi5kZWFsLnBheW1lbnQuY2hhbmdlO1xuICAgICAgICAgIGNvdW50Q2hhbmdlKCk7XG4gICAgICAgIH0gZWxzZSBpZihzZWxmLmRlYWwucGF5bWVudC50eXBlID09PSAnZGVwb3NpdCcpIHtcbiAgICAgICAgICBzZWxmLmRlYWwucGF5bWVudC5hbW91bnQgPSAwLXNlbGYuZGVhbC5mZWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5kZWFsLnBheW1lbnQuYW1vdW50ID0gc2VsZi5kZWFsLmZlZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBjb3VudENoYW5nZSgpIHtcbiAgICAgICAgaWYoc2VsZi5kZWFsLnBheW1lbnQudHlwZSA9PT0gJ2Nhc2gnKSB7XG4gICAgICAgICAgc2VsZi5jYXNoID0gc2VsZi5jYXNoIHx8IHt9O1xuICAgICAgICAgIHNlbGYuY2FzaC5wYWlkID0gc2VsZi5jYXNoLnBhaWQgfHwgc2VsZi5kZWFsLnBheW1lbnQuYW1vdW50O1xuICAgICAgICAgIHNlbGYuY2FzaC5jaGFuZ2UgPSBzZWxmLmRlYWwucGF5bWVudC5hbW91bnQgLSBzZWxmLmNhc2gucGFpZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXkoKSB7XG4gICAgICAgIHNlbGYuZGVhbC5zdGF0dXMgPSAnY2xvc2VkJztcbiAgICAgICAgZGVsZXRlIHNlbGYuZGVhbC5tZW1iZXI7XG4gICAgICAgIHJldHVybiBEZWFsLmNyZWF0ZShzZWxmLmRlYWwpLiRwcm9taXNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVyblNlcnZpY2UuJGluamVjdCA9IFsnRGVhbCcsICdTa3UnLCAnbmdEaWFsb2cnLCAnJHJvb3RTY29wZSddO1xuICAgIGZ1bmN0aW9uIHJldHVyblNlcnZpY2UoRGVhbCwgU2t1LCBuZ0RpYWxvZywgJHJvb3RTY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB0aGlzLm9wZW5SZXR1cm4gPSBvcGVuUmV0dXJuO1xuICAgICAgdGhpcy5jaGVja291dCA9IGNoZWNrb3V0O1xuICAgICAgdGhpcy5kb1JldHVybiA9IGRvUmV0dXJuO1xuICAgICAgdGhpcy5jb3VudCA9IGNvdW50O1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBvcGVuUmV0dXJuKGRlYWwpIHtcbiAgICAgICAgc2VsZi5kZWFsID0gZGVhbDtcbiAgICAgICAgc2VsZi5wb3N0RGF0YSA9IHtcbiAgICAgICAgICBlbnRpdGllczogW10sXG4gICAgICAgICAgdG90YWxBbW91bnQ6IDAsXG4gICAgICAgICAgdG90YWxRdHk6IDAsXG4gICAgICAgICAgc3RhdHVzOiAnb3BlbmVkJyxcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gY291bnQoKSB7XG4gICAgICAgIHNlbGYucG9zdERhdGEudG90YWxBbW91bnQgPSAwO1xuICAgICAgICBzZWxmLnBvc3REYXRhLnRvdGFsUXR5ID0gMDtcbiAgICAgICAgc2VsZi5wb3N0RGF0YS5lbnRpdGllcy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICAgICAgICBzZWxmLnBvc3REYXRhLnRvdGFsQW1vdW50ICs9IGVudGl0eS5xdHkqZW50aXR5LnNrdS5wcmljZTtcbiAgICAgICAgICBzZWxmLnBvc3REYXRhLnRvdGFsUXR5ICs9IGVudGl0eS5xdHk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYucG9zdERhdGEuZGlzY291bnRBbW91bnQgPSAwO1xuICAgICAgICBpZihzZWxmLmRlYWwubWVtYmVyKSB7XG4gICAgICAgICAgc2VsZi5wb3N0RGF0YS5kaXNjb3VudEFtb3VudCA9IHNlbGYucG9zdERhdGEudG90YWxBbW91bnQqKDEwMC1zZWxmLmRlYWwubWVtYmVyLmRpc2NvdW50KS8xMDA7ICAgICAgICAgICB9XG4gICAgICAgIHNlbGYucG9zdERhdGEuZmVlID0gc2VsZi5wb3N0RGF0YS50b3RhbEFtb3VudCAtIHNlbGYucG9zdERhdGEuZGlzY291bnRBbW91bnQ7XG4gICAgICAgIHNlbGYucG9zdERhdGEucGF5bWVudC5hbW91bnQgPSBzZWxmLnBvc3REYXRhLmZlZTtcbiAgICAgICAgaWYoc2VsZi5wb3N0RGF0YS5wYXltZW50LnR5cGUgPT09ICdjYXNoJykge1xuICAgICAgICAgIHNlbGYucG9zdERhdGEucGF5bWVudC5jaGFuZ2UgPSBzZWxmLnBvc3REYXRhLmZlZSUkcm9vdFNjb3BlLnVzZXIubWVyY2hhbnQuY2hhbmdlUmF0ZTtcbiAgICAgICAgICBzZWxmLnBvc3REYXRhLnBheW1lbnQuYW1vdW50IC09IHNlbGYucG9zdERhdGEucGF5bWVudC5jaGFuZ2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gY2hlY2tvdXQoZW50aXR5KSB7XG4gICAgICAgIHNlbGYucG9zdERhdGEucGF5bWVudCA9IHt0eXBlOiBzZWxmLmRlYWwucGF5bWVudC50eXBlfTtcbiAgICAgICAgXG4gICAgICAgIHZhciBlbnRpdGllcyA9IHNlbGYuZGVhbC5lbnRpdGllcztcbiAgICAgICAgaWYoZW50aXR5KSBlbnRpdGllcyA9IFtlbnRpdHldO1xuICAgICAgICBcbiAgICAgICAgc2VsZi5wb3N0RGF0YS5lbnRpdGllcyA9IFtdO1xuICAgICAgICBlbnRpdGllcy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICAgICAgICB2YXIgZSA9ICB7XG4gICAgICAgICAgICBza3U6IGVudGl0eS5za3UsXG4gICAgICAgICAgICBxdHk6IGVudGl0eS5xdHkgLSBlbnRpdHkucmV0dXJuZWRRdHlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoZS5xdHkgPiAwKSBzZWxmLnBvc3REYXRhLmVudGl0aWVzLnB1c2goZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgY291bnQoKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBuZ0RpYWxvZy5vcGVuKHsgXG4gICAgICAgICAgdGVtcGxhdGU6ICdjaGVja291dFJldHVybkRpYWxvZ0lkJywgXG4gICAgICAgICAgY29udHJvbGxlcjogJ2NoZWNrb3V0UmV0dXJuRGlhbG9nQ29udHJvbGxlcidcbiAgICAgICAgfSkuY2xvc2VQcm9taXNlO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBkb1JldHVybigpIHtcbiAgICAgICAgc2VsZi5wb3N0RGF0YS5zdGF0dXMgPSAnY2xvc2VkJztcbiAgICAgICAgcmV0dXJuIERlYWwucmV0dXJucy5jcmVhdGUoe2lkOiBzZWxmLmRlYWwuaWR9LCBzZWxmLnBvc3REYXRhKS4kcHJvbWlzZTtcbiAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgIC5tb2R1bGUoJ2FwcC5zYWxlcycpXG4gICAgICAuY29udHJvbGxlcignU2VsbENvbnRyb2xsZXInLCBTZWxsQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdjaGVja291dERpYWxvZ0NvbnRyb2xsZXInLCBjaGVja291dERpYWxvZ0NvbnRyb2xsZXIpXG4gICAgICAuY29udHJvbGxlcignRGVhbHNDb250cm9sbGVyJywgRGVhbHNDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ0RlYWxDb250cm9sbGVyJywgRGVhbENvbnRyb2xsZXIpXG4gICAgICAuY29udHJvbGxlcignY2hlY2tvdXRSZXR1cm5EaWFsb2dDb250cm9sbGVyJywgY2hlY2tvdXRSZXR1cm5EaWFsb2dDb250cm9sbGVyKVxuICAgIDtcbiAgICAgIFxuICAgIFNlbGxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdkZWFsU2VydmljZScsICdDaGVja2luJ107XG4gICAgZnVuY3Rpb24gU2VsbENvbnRyb2xsZXIoJHNjb3BlLCBkZWFsU2VydmljZSwgQ2hlY2tpbikge1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgIFxuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICRzY29wZS5kZWFsU2VydmljZSA9IGRlYWxTZXJ2aWNlO1xuICAgICAgICBpZighZGVhbFNlcnZpY2UuZGVhbCkge1xuICAgICAgICAgIGRlYWxTZXJ2aWNlLm9wZW5EZWFsKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIENIRUNLSU5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG4gICAgICAgIHZtLmNoZWNraW5zID0gQ2hlY2tpbi5maW5kKHtmaWx0ZXI6e1xuICAgICAgICAgIHdoZXJlOiB7bWVyY2hhbnRJZDogJHNjb3BlLnVzZXIuc2hvcElkfSxcbiAgICAgICAgICBpbmNsdWRlOiBbe21lbWJlcjogJ3d4dXNlcid9XSxcbiAgICAgICAgICBsaW1pdDogMTAsIFxuICAgICAgICAgIG9yZGVyOiAnY3JlYXRlZCBERVNDJ1xuICAgICAgICB9fSk7XG4gICAgICAgIFxuICAgICAgICB2bS50ZW1wbGF0ZVVybCA9ICdjaGVja2luc1RlbXBsYXRlLmh0bWwnO1xuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIGNoZWNrb3V0RGlhbG9nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnbmdEaWFsb2cnLCAnZGVhbFNlcnZpY2UnLCAndG9hc3RlciddO1xuICAgIGZ1bmN0aW9uIGNoZWNrb3V0RGlhbG9nQ29udHJvbGxlcigkc2NvcGUsIG5nRGlhbG9nLCBkZWFsU2VydmljZSwgdG9hc3Rlcikge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICRzY29wZS5kZWFsU2VydmljZSA9IGRlYWxTZXJ2aWNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY29uZmlybSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBkZWFsU2VydmljZS5wYXkoKS50aGVuKGZ1bmN0aW9uIChkZWFsKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBuZ0RpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgICAgZGVhbFNlcnZpY2Uub3BlbkRlYWwoKTtcbiAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ+aIkOWKnycsIFwi5a6M5oiQ5Lqk5piTXCIpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsICflpLHotKUnLCBcIuS6pOaYk+acquWujOaIkO+8jOivt+mHjeivle+8gVwiKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICBEZWFsc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0RlYWwnLCAnbmdUYWJsZVBhcmFtcycsICduZ1RhYmxlTEJTZXJ2aWNlJ107XG4gICAgZnVuY3Rpb24gRGVhbHNDb250cm9sbGVyKCRzY29wZSwgRGVhbCwgbmdUYWJsZVBhcmFtcywgbmdUYWJsZUxCU2VydmljZSkge1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIFxuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIHZtLmtleXdvcmQgPSBcIlwiO1xuICAgICAgICB2bS50YWJsZVBhcmFtcyA9IG5ldyBuZ1RhYmxlUGFyYW1zKHtjb3VudDogMTB9LCB7XG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJGRlZmVyLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXIgPSB7d2hlcmU6e3N0YXR1czp7bmU6J2RlbGV0ZWQnfX0sIGluY2x1ZGU6W119XG4gICAgICAgICAgICBpZih2bS5rZXl3b3JkICE9ICcnKSB7XG4gICAgICAgICAgICAgIHZhciBxcyA9IHtyZWdleDoga2V5d29yZH07XG4gICAgICAgICAgICAgIGZpbHRlci53aGVyZS5vciA9IFt7XCJlbnRpdGllcy5za3UuaXRlbS5uYW1lXCI6cXN9XTtcbiAgICAgICAgICAgICAgcGFyYW1zLnBhZ2UoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZ1RhYmxlTEJTZXJ2aWNlLmdldERhdGEoJGRlZmVyLCBwYXJhbXMsIERlYWwsIGZpbHRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgRGVhbENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0RlYWwnLCAnbmdUYWJsZVBhcmFtcycsICduZ1RhYmxlTEJTZXJ2aWNlJywgJ3JldHVyblNlcnZpY2UnXTtcbiAgICBmdW5jdGlvbiBEZWFsQ29udHJvbGxlcigkc2NvcGUsIERlYWwsIG5nVGFibGVQYXJhbXMsIG5nVGFibGVMQlNlcnZpY2UsIHJldHVyblNlcnZpY2UpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICBcbiAgICAgIGFjdGl2YXRlKCk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICB2bS5yZXR1cm5Ta3UgPSB7fTtcbiAgICAgICAgdm0uZGVhbCA9IERlYWwuZmluZE9uZSh7ZmlsdGVyOntcbiAgICAgICAgICB3aGVyZToge2lkOiAkc2NvcGUuJHN0YXRlLnBhcmFtcy5kZWFsSWR9LFxuICAgICAgICAgIGluY2x1ZGU6WydyZXR1cm5zJywgJ2JvbnVzZXMnXVxuICAgICAgICB9fSk7XG4gICAgICAgIHZtLmRlYWwuJHByb21pc2UudGhlbihmdW5jdGlvbiAoZGVhbCkge1xuICAgICAgICAgIHZtLmRlYWwuZW50aXRpZXMuZm9yRWFjaChmdW5jdGlvbiAoZW50aXR5KSB7XG4gICAgICAgICAgICBlbnRpdHkucmV0dXJuZWRRdHkgPSAwO1xuICAgICAgICAgICAgdm0ucmV0dXJuU2t1W2VudGl0eS5za3UuaWRdID0gZW50aXR5O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmKHZtLmRlYWwucmV0dXJucyAmJiB2bS5kZWFsLnJldHVybnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdm0uZGVhbC5yZXR1cm5zLmZvckVhY2goZnVuY3Rpb24gKHJldCkge1xuICAgICAgICAgICAgICByZXQuZW50aXRpZXMuZm9yRWFjaChmdW5jdGlvbiAocmV0dXJuRW50aXR5KSB7XG4gICAgICAgICAgICAgICAgdm0ucmV0dXJuU2t1W3JldHVybkVudGl0eS5za3UuaWRdLnJldHVybmVkUXR5ICs9IHJldHVybkVudGl0eS5xdHk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2bS5yZXR1cm4gPSB2bS5kZWFsLnJldHVybnNbMF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLnJldHVybiA9IHtlbnRpdGllczpbXX07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVyblNlcnZpY2Uub3BlblJldHVybih2bS5kZWFsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmdvUmV0dXJuID0gZnVuY3Rpb24gKGVudGl0eSkge1xuICAgICAgICByZXR1cm5TZXJ2aWNlLmNoZWNrb3V0KGVudGl0eSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGFjdGl2YXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrb3V0UmV0dXJuRGlhbG9nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnbmdEaWFsb2cnLCAncmV0dXJuU2VydmljZScsICd0b2FzdGVyJ107XG4gICAgZnVuY3Rpb24gY2hlY2tvdXRSZXR1cm5EaWFsb2dDb250cm9sbGVyKCRzY29wZSwgbmdEaWFsb2csIHJldHVyblNlcnZpY2UsIHRvYXN0ZXIpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAkc2NvcGUucmV0dXJuU2VydmljZSA9IHJldHVyblNlcnZpY2U7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5jb25maXJtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVyblNlcnZpY2UuZG9SZXR1cm4oKS50aGVuKGZ1bmN0aW9uIChyZXQpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIG5nRGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICfmiJDlip8nLCBcIuWujOaIkOmAgOasvumAgOi0p1wiKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCAn5aSx6LSlJywgXCLpgIDmrL7pgIDotKfmnKrlrozmiJDvvIzor7fph43or5XvvIFcIilcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbn0pKCk7IiwiLyoqXG4gKiBBbmd1bGFySlMgZGVmYXVsdCBmaWx0ZXIgd2l0aCB0aGUgZm9sbG93aW5nIGV4cHJlc3Npb246XG4gKiBcInBlcnNvbiBpbiBwZW9wbGUgfCBmaWx0ZXI6IHtuYW1lOiAkc2VsZWN0LnNlYXJjaCwgYWdlOiAkc2VsZWN0LnNlYXJjaH1cIlxuICogcGVyZm9ybXMgYSBBTkQgYmV0d2VlbiAnbmFtZTogJHNlbGVjdC5zZWFyY2gnIGFuZCAnYWdlOiAkc2VsZWN0LnNlYXJjaCcuXG4gKiBXZSB3YW50IHRvIHBlcmZvcm0gYSBPUi5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuc2FsZXMnKVxuICAgICAgICAuZmlsdGVyKCdkZWFsX3N0YXR1cycsIGRlYWxTdGF0dXNGaWx0ZXIpXG4gICAgICAgIC5maWx0ZXIoJ3BheW1lbnRfdHlwZScsIHBheW1lbnRUeXBlRmlsdGVyKVxuICAgIDtcblxuICAgIHBheW1lbnRUeXBlRmlsdGVyLiRpbmplY3QgPSBbJ2RlYWxTZXJ2aWNlJ107XG4gICAgZnVuY3Rpb24gcGF5bWVudFR5cGVGaWx0ZXIoZGVhbFNlcnZpY2UpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIHJldHVybiBkZWFsU2VydmljZS5wYXlUeXBlW2tleV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkZWFsU3RhdHVzRmlsdGVyLiRpbmplY3QgPSBbXTtcbiAgICBmdW5jdGlvbiBkZWFsU3RhdHVzRmlsdGVyKCkge1xuICAgICAgdmFyIGRpYyA9IHtcbiAgICAgICAgY2xvc2VkOiAn5bey5a6M5oiQJ1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIGRpY1trZXldO1xuICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAgIC5tb2R1bGUoJ2FwcC5zZXR0aW5ncycpXG4gICAgICAuY29udHJvbGxlcignU2V0dGluZ0NvbnRyb2xsZXInLCBTZXR0aW5nQ29udHJvbGxlcilcbiAgXG4gIFNldHRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ01lcmNoYW50JywgJ1Nob3AnLCAnTWVtYmVyJywgJ3RvYXN0ZXInXTtcbiAgZnVuY3Rpb24gU2V0dGluZ0NvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCBNZXJjaGFudCwgU2hvcCwgTWVtYmVyLCB0b2FzdGVyKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5pbmR1c3RyeSA9IHtcbiAgICAgIFwiSVTnp5HmioBcIjoge1xuICAgICAgICBcIuS6kuiBlOe9kS/nlLXlrZDllYbliqFcIjogXCIxXCIsXG4gICAgICAgIFwiSVTova/ku7bkuI7mnI3liqFcIjogXCIyXCIsXG4gICAgICAgIFwiSVTnoazku7bkuI7orr7lpIdcIjogXCIzXCIsXG4gICAgICAgIFwi55S15a2Q5oqA5pyvXCI6IFwiNFwiLFxuICAgICAgICBcIumAmuS/oeS4jui/kOiQpeWVhlwiOiBcIjVcIixcbiAgICAgICAgXCLnvZHnu5zmuLjmiI9cIjogXCI2XCJcbiAgICAgIH0sXG4gICAgICBcIumHkeiejeS4mlwiOiB7XG4gICAgICAgIFwi6ZO26KGMXCI6IFwiN1wiLFxuICAgICAgICBcIuWfuumHkXznkIbotKJ85L+h5omYXCI6IFwiOFwiLFxuICAgICAgICBcIuS/nemZqVwiOiBcIjlcIlxuICAgICAgfSxcbiAgICAgIFwi6aSQ6aWuXCI6IHtcbiAgICAgICAgXCLppJDppa5cIjogXCIxMFwiXG4gICAgICB9LFxuICAgICAgXCLphZLlupfml4XmuLhcIjoge1xuICAgICAgICBcIumFkuW6l1wiOiBcIjExXCIsXG4gICAgICAgIFwi5peF5ri4XCI6IFwiMTJcIlxuICAgICAgfSxcbiAgICAgIFwi6L+Q6L6T5LiO5LuT5YKoXCI6IHtcbiAgICAgICAgXCLlv6vpgJJcIjogXCIxM1wiLFxuICAgICAgICBcIueJqea1gVwiOiBcIjE0XCIsXG4gICAgICAgIFwi5LuT5YKoXCI6IFwiMTVcIlxuICAgICAgfSxcbiAgICAgIFwi5pWZ6IKyXCI6IHtcbiAgICAgICAgXCLln7norq1cIjogXCIxNlwiLFxuICAgICAgICBcIumZouagoVwiOiBcIjE3XCJcbiAgICAgIH0sXG4gICAgICBcIuaUv+W6nOS4juWFrOWFseS6i+S4mlwiOiB7XG4gICAgICAgIFwi5a2m5pyv56eR56CUXCI6IFwiMThcIixcbiAgICAgICAgXCLkuqToraZcIjogXCIxOVwiLFxuICAgICAgICBcIuWNmueJqemmhlwiOiBcIjIwXCIsXG4gICAgICAgIFwi5YWs5YWx5LqL5LiafOmdnuebiOWIqeacuuaehFwiOiBcIjIxXCJcbiAgICAgIH0sXG4gICAgICBcIuWMu+iNr+aKpOeQhlwiOiB7XG4gICAgICAgIFwi5Yy76I2v5Yy755aXXCI6IFwiMjJcIixcbiAgICAgICAgXCLmiqTnkIbnvo7lrrlcIjogXCIyM1wiLFxuICAgICAgICBcIuS/neWBpeS4juWNq+eUn1wiOiBcIjI0XCJcbiAgICAgIH0sXG4gICAgICBcIuS6pOmAmuW3peWFt1wiOiB7XG4gICAgICAgIFwi5rG96L2m55u45YWzXCI6IFwiMjVcIixcbiAgICAgICAgXCLmkanmiZjovabnm7jlhbNcIjogXCIyNlwiLFxuICAgICAgICBcIueBq+i9puebuOWFs1wiOiBcIjI3XCIsXG4gICAgICAgIFwi6aOe5py655u45YWzXCI6IFwiMjhcIlxuICAgICAgfSxcbiAgICAgIFwi5oi/5Zyw5LqnXCI6IHtcbiAgICAgICAgXCLlu7rnrZFcIjogXCIyOVwiLFxuICAgICAgICBcIueJqeS4mlwiOiBcIjMwXCJcbiAgICAgIH0sXG4gICAgICBcIua2iOi0ueWTgVwiOiB7XG4gICAgICAgIFwi5raI6LS55ZOBXCI6IFwiMzFcIlxuICAgICAgfSxcbiAgICAgIFwi5ZWG5Lia5pyN5YqhXCI6IHtcbiAgICAgICAgXCLms5XlvotcIjogXCIzMlwiLFxuICAgICAgICBcIuS8muWxlVwiOiBcIjMzXCIsXG4gICAgICAgIFwi5Lit5LuL5pyN5YqhXCI6IFwiMzRcIixcbiAgICAgICAgXCLorqTor4FcIjogXCIzNVwiLFxuICAgICAgICBcIuWuoeiuoVwiOiBcIjM2XCJcbiAgICAgIH0sXG4gICAgICBcIuaWh+S9k+WoseS5kFwiOiB7XG4gICAgICAgIFwi5Lyg5aqSXCI6IFwiMzdcIixcbiAgICAgICAgXCLkvZPogrJcIjogXCIzOFwiLFxuICAgICAgICBcIuWoseS5kOS8kemXslwiOiBcIjM5XCJcbiAgICAgIH0sXG4gICAgICBcIuWNsOWIt1wiOiB7XG4gICAgICAgIFwi5Y2w5Yi3XCI6IFwiNDBcIlxuICAgICAgfSxcbiAgICAgIFwi5YW25a6DXCI6IHtcbiAgICAgICAgXCLlhbblroNcIjogXCI0MVwiXG4gICAgICB9XG4gICAgfTtcblxuICAgIGFjdGl2ZXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmV0ZSgpIHtcbiAgICAgIHZtLnd4Z2ggPSBNZXJjaGFudC5wcm90b3R5cGUkX19nZXRfX3d4Z2goe2lkOiAkc2NvcGUudXNlci5tZXJjaGFudElkLCByZWZyZXNoOiB0cnVlfSk7XG4gICAgfVxuXG4gICAgdm0udXBkYXRlID0gZnVuY3Rpb24gKGlzU2hvcCkge1xuICAgICAgdmFyIG1vZGVsID0gTWVyY2hhbnQ7XG4gICAgICB2YXIgZGF0YSA9ICRzY29wZS51c2VyLm1lcmNoYW50O1xuICAgICAgaWYoaXNTaG9wKSB7XG4gICAgICAgIGRhdGEgPSAkc2NvcGUudXNlci5zaG9wO1xuICAgICAgICBtb2RlbCA9IFNob3A7XG4gICAgICB9XG4gICAgICBtb2RlbC51cGRhdGUoe3doZXJlOiB7aWQ6IGRhdGEuaWR9fSwgZGF0YSwgZnVuY3Rpb24gc3VjY2VzcyhyZXN1bHQsIHJlcykge1xuICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICfmiJDlip8nLCBcIuiuvue9ruW3sue7j+S/neWtmFwiKTtcbiAgICAgIH0sIGZ1bmN0aW9uIGVycm9yKHJlcykge1xuICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCAn5aSx6LSlJywgXCLorr7nva7mnKrmiJDlip/vvIzor7fph43or5XvvIFcIilcbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICB2bS5hZGRNZW1iZXJMZXZlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBsZXZlbHMgPSAkc2NvcGUudXNlci5tZXJjaGFudC5tZW1iZXJMZXZlbHMgfHwgW107XG4gICAgICB2YXIgbGFzdCA9IGxldmVscy5sZW5ndGggPiAwICYmIGxldmVsc1tsZXZlbHMubGVuZ3RoLTFdIHx8IHt1cHBlcjogLTF9O1xuICAgICAgbGV2ZWxzLnB1c2goe2xvd2VyOiBsYXN0LnVwcGVyKzEsIHVwcGVyOiBsYXN0LnVwcGVyKzEwMDAsIGRpc2NvdW50OjEwMCwgbmFtZTogJ1ZJUCd9KTtcbiAgICAgIGlmKCEkc2NvcGUudXNlci5tZXJjaGFudC5tZW1iZXJMZXZlbHMpICRzY29wZS51c2VyLm1lcmNoYW50Lm1lbWJlckxldmVscyA9IGxldmVscztcbiAgICB9XG4gICAgXG4gICAgdm0udXBkYWV0ZU1lbWJlckxldmVscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS51c2VyLm1lcmNoYW50Lm1lbWJlckxldmVscy5mb3JFYWNoKGZ1bmN0aW9uIChsZXZlbCkge1xuICAgICAgICBNZW1iZXIudXBkYXRlKHtcbiAgICAgICAgICB3aGVyZToge21lcmNoYW50SWQ6JHNjb3BlLnVzZXIubWVyY2hhbnQuaWQsIHRvdGFsQm9udXM6IHtndGU6IGxldmVsLmxvd2VyLCBsdGU6IGxldmVsLnVwcGVyfX1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGRpc2NvdW50OiBsZXZlbC5kaXNjb3VudCwgbGV2ZWw6IGxldmVsLm5hbWVcbiAgICAgICAgfSwgZnVuY3Rpb24gc3VjZXNzKHJlc3VsdCwgcmVzKSB7XG4gICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAn5oiQ5YqfJywgXCLmm7TmlrDlhajkvZPkvJrlkZjnrYnnuqflrozmiJBcIik7XG4gICAgICAgIH0sIGZ1bmN0aW9uIGVycm9yKHJlcykge1xuICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsICflpLHotKUnLCBcIuabtOaWsOWFqOS9k+S8muWRmOetiee6p+acquaIkOWKn++8jOivt+mHjeivle+8gVwiKVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAgICAgICAgIFxuICAgIHZtLnVwZGF0ZVd4Z2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2bS51cGRhdGUoKTtcbiAgICAgIE1lcmNoYW50LnVwZGF0ZVd4Z2goe1xuICAgICAgICBpZDogdm0ud3hnaC5pZCxcbiAgICAgICAgYXBwaWQ6IHZtLnd4Z2guYXBwaWQsXG4gICAgICAgIGFwcHNlY3JldDogdm0ud3hnaC5hcHBzZWNyZXQsXG4gICAgICAgIGluZHVzdHJ5OiAkc2NvcGUudXNlci5tZXJjaGFudC5pbmR1c3RyeVxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICfmiJDlip8nLCBcIuW+ruS/oeWFrOS8l+WPt+iuvue9ruW3sue7j+S/neWtmFwiKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgJ+Wksei0pScsIFwi6K6+572u5pyq5oiQ5Yqf77yM6K+36YeN6K+V77yBXCIpXG4gICAgICB9KTtcbiAgICB9IFxuICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnNldHRpbmdzJylcclxuICAgICAgICAucnVuKHNldHRpbmdzUnVuKTtcclxuXHJcbiAgICBzZXR0aW5nc1J1bi4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyRsb2NhbFN0b3JhZ2UnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBzZXR0aW5nc1J1bigkcm9vdFNjb3BlLCAkbG9jYWxTdG9yYWdlKXtcclxuXHJcbiAgICAgIC8vIEdsb2JhbCBTZXR0aW5nc1xyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuICAgICAgJHJvb3RTY29wZS5hcHAgPSB7XHJcbiAgICAgICAgbmFtZTogJ+azm+WNoeaxh1dlYlBPUycsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICflnKjnur/mlLbpk7bns7vnu58nLFxyXG4gICAgICAgIHllYXI6ICgobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSksXHJcbiAgICAgICAgbGF5b3V0OiB7XHJcbiAgICAgICAgICBpc0ZpeGVkOiB0cnVlLFxyXG4gICAgICAgICAgaXNDb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgaXNCb3hlZDogZmFsc2UsXHJcbiAgICAgICAgICBpc1JUTDogZmFsc2UsXHJcbiAgICAgICAgICBob3Jpem9udGFsOiBmYWxzZSxcclxuICAgICAgICAgIGlzRmxvYXQ6IGZhbHNlLFxyXG4gICAgICAgICAgYXNpZGVIb3ZlcjogZmFsc2UsXHJcbiAgICAgICAgICB0aGVtZTogXCJhcHAvY3NzL3RoZW1lLWUuY3NzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVzZUZ1bGxMYXlvdXQ6IGZhbHNlLFxyXG4gICAgICAgIGhpZGRlbkZvb3RlcjogZmFsc2UsXHJcbiAgICAgICAgb2Zmc2lkZWJhck9wZW46IGZhbHNlLFxyXG4gICAgICAgIGFzaWRlVG9nZ2xlZDogZmFsc2UsXHJcbiAgICAgICAgdmlld0FuaW1hdGlvbjogJ25nLWZhZGVJblVwJ1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gU2V0dXAgdGhlIGxheW91dCBtb2RlXHJcbiAgICAgICRyb290U2NvcGUuYXBwLmxheW91dC5ob3Jpem9udGFsID0gKCAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcy5sYXlvdXQgPT09ICdhcHAtaCcpIDtcclxuXHJcbiAgICAgIC8vIFJlc3RvcmUgbGF5b3V0IHNldHRpbmdzXHJcbiAgICAgIGlmKCBhbmd1bGFyLmlzRGVmaW5lZCgkbG9jYWxTdG9yYWdlLmxheW91dCkgKVxyXG4gICAgICAgICRyb290U2NvcGUuYXBwLmxheW91dCA9ICRsb2NhbFN0b3JhZ2UubGF5b3V0O1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgJGxvY2FsU3RvcmFnZS5sYXlvdXQgPSAkcm9vdFNjb3BlLmFwcC5sYXlvdXQ7XHJcblxyXG4gICAgICAkcm9vdFNjb3BlLiR3YXRjaCgnYXBwLmxheW91dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkbG9jYWxTdG9yYWdlLmxheW91dCA9ICRyb290U2NvcGUuYXBwLmxheW91dDtcclxuICAgICAgfSwgdHJ1ZSk7XHJcblxyXG4gICAgICAvLyBDbG9zZSBzdWJtZW51IHdoZW4gc2lkZWJhciBjaGFuZ2UgZnJvbSBjb2xsYXBzZWQgdG8gbm9ybWFsXHJcbiAgICAgICRyb290U2NvcGUuJHdhdGNoKCdhcHAubGF5b3V0LmlzQ29sbGFwc2VkJywgZnVuY3Rpb24obmV3VmFsdWUpIHtcclxuICAgICAgICBpZiggbmV3VmFsdWUgPT09IGZhbHNlIClcclxuICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnY2xvc2VTaWRlYmFyTWVudScpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBzaWRlYmFyLW1lbnUuanNcclxuICogSGFuZGxlIHNpZGViYXIgY29sbGFwc2libGUgZWxlbWVudHNcclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5zaWRlYmFyJylcclxuICAgICAgICAuY29udHJvbGxlcignU2lkZWJhckNvbnRyb2xsZXInLCBTaWRlYmFyQ29udHJvbGxlcik7XHJcblxyXG4gICAgU2lkZWJhckNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckc2NvcGUnLCAnJHN0YXRlJywgJ1NpZGViYXJMb2FkZXInLCAnVXRpbHMnXTtcclxuICAgIGZ1bmN0aW9uIFNpZGViYXJDb250cm9sbGVyKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCBTaWRlYmFyTG9hZGVyLCAgVXRpbHMpIHtcclxuXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgIHZhciBjb2xsYXBzZUxpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgICAvLyBkZW1vOiB3aGVuIHN3aXRjaCBmcm9tIGNvbGxhcHNlIHRvIGhvdmVyLCBjbG9zZSBhbGwgaXRlbXNcclxuICAgICAgICAgICRyb290U2NvcGUuJHdhdGNoKCdhcHAubGF5b3V0LmFzaWRlSG92ZXInLCBmdW5jdGlvbihvbGRWYWwsIG5ld1ZhbCl7XHJcbiAgICAgICAgICAgIGlmICggbmV3VmFsID09PSBmYWxzZSAmJiBvbGRWYWwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICBjbG9zZUFsbEJ1dCgtMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAvLyBMb2FkIG1lbnUgZnJvbSBqc29uIGZpbGVcclxuICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuICAgICAgICAgIFNpZGViYXJMb2FkZXIuZ2V0TWVudShzaWRlYmFyUmVhZHkpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBmdW5jdGlvbiBzaWRlYmFyUmVhZHkoaXRlbXMpIHtcclxuICAgICAgICAgICAgJHNjb3BlLm1lbnVJdGVtcyA9IGl0ZW1zO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIEhhbmRsZSBzaWRlYmFyIGFuZCBjb2xsYXBzZSBpdGVtc1xyXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAkc2NvcGUuZ2V0TWVudUl0ZW1Qcm9wQ2xhc3NlcyA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIChpdGVtLmhlYWRpbmcgPyAnbmF2LWhlYWRpbmcnIDogJycpICtcclxuICAgICAgICAgICAgICAgICAgIChpc0FjdGl2ZShpdGVtKSA/ICcgYWN0aXZlJyA6ICcnKSA7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICRzY29wZS5hZGRDb2xsYXBzZSA9IGZ1bmN0aW9uKCRpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICBjb2xsYXBzZUxpc3RbJGluZGV4XSA9ICRyb290U2NvcGUuYXBwLmxheW91dC5hc2lkZUhvdmVyID8gdHJ1ZSA6ICFpc0FjdGl2ZShpdGVtKTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgJHNjb3BlLmlzQ29sbGFwc2UgPSBmdW5jdGlvbigkaW5kZXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChjb2xsYXBzZUxpc3RbJGluZGV4XSk7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICRzY29wZS50b2dnbGVDb2xsYXBzZSA9IGZ1bmN0aW9uKCRpbmRleCwgaXNQYXJlbnRJdGVtKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBjb2xsYXBzZWQgc2lkZWJhciBkb2Vzbid0IHRvZ2dsZSBkcm9kb3B3blxyXG4gICAgICAgICAgICBpZiggVXRpbHMuaXNTaWRlYmFyQ29sbGFwc2VkKCkgfHwgJHJvb3RTY29wZS5hcHAubGF5b3V0LmFzaWRlSG92ZXIgKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgaXRlbSBpbmRleCBleGlzdHNcclxuICAgICAgICAgICAgaWYoIGFuZ3VsYXIuaXNEZWZpbmVkKCBjb2xsYXBzZUxpc3RbJGluZGV4XSApICkge1xyXG4gICAgICAgICAgICAgIGlmICggISAkc2NvcGUubGFzdEV2ZW50RnJvbUNoaWxkICkge1xyXG4gICAgICAgICAgICAgICAgY29sbGFwc2VMaXN0WyRpbmRleF0gPSAhY29sbGFwc2VMaXN0WyRpbmRleF07XHJcbiAgICAgICAgICAgICAgICBjbG9zZUFsbEJ1dCgkaW5kZXgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICggaXNQYXJlbnRJdGVtICkge1xyXG4gICAgICAgICAgICAgIGNsb3NlQWxsQnV0KC0xKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJHNjb3BlLmxhc3RFdmVudEZyb21DaGlsZCA9IGlzQ2hpbGQoJGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIC8vIENvbnRyb2xsZXIgaGVscGVyc1xyXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBpdGVtIGFuZCBjaGlsZHJlbiBhY3RpdmUgc3RhdGVcclxuICAgICAgICAgICAgZnVuY3Rpb24gaXNBY3RpdmUoaXRlbSkge1xyXG5cclxuICAgICAgICAgICAgICBpZighaXRlbSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICBpZiggIWl0ZW0uc3JlZiB8fCBpdGVtLnNyZWYgPT09ICcjJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaXRlbS5zdWJtZW51LCBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICBpZihpc0FjdGl2ZSh2YWx1ZSkpIGZvdW5kQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kQWN0aXZlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHN0YXRlLmlzKGl0ZW0uc3JlZikgfHwgJHN0YXRlLmluY2x1ZGVzKGl0ZW0uc3JlZik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsb3NlQWxsQnV0KGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgaW5kZXggKz0gJyc7XHJcbiAgICAgICAgICAgICAgZm9yKHZhciBpIGluIGNvbGxhcHNlTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYoaW5kZXggPCAwIHx8IGluZGV4LmluZGV4T2YoaSkgPCAwKVxyXG4gICAgICAgICAgICAgICAgICBjb2xsYXBzZUxpc3RbaV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaXNDaGlsZCgkaW5kZXgpIHtcclxuICAgICAgICAgICAgICAvKmpzaGludCAtVzAxOCovXHJcbiAgICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgJGluZGV4ID09PSAnc3RyaW5nJykgJiYgISgkaW5kZXguaW5kZXhPZignLScpIDwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB9IC8vIGFjdGl2YXRlXHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBzaWRlYmFyLmpzXHJcbiAqIFdyYXBzIHRoZSBzaWRlYmFyIGFuZCBoYW5kbGVzIGNvbGxhcHNlZCBzdGF0ZVxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnNpZGViYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NpZGViYXInLCBzaWRlYmFyKTtcclxuXHJcbiAgICBzaWRlYmFyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnLCAnJHdpbmRvdycsICdVdGlscyddO1xyXG4gICAgZnVuY3Rpb24gc2lkZWJhciAoJHJvb3RTY29wZSwgJHRpbWVvdXQsICR3aW5kb3csIFV0aWxzKSB7XHJcbiAgICAgICAgdmFyICR3aW4gPSBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdyk7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgLy8gYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcclxuICAgICAgICAgICAgLy8gY29udHJvbGxlcjogQ29udHJvbGxlcixcclxuICAgICAgICAgICAgLy8gY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8bmF2IGNsYXNzPVwic2lkZWJhclwiIG5nLXRyYW5zY2x1ZGU+PC9uYXY+JyxcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZVxyXG4gICAgICAgICAgICAvLyBzY29wZToge31cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcblxyXG4gICAgICAgICAgdmFyIGN1cnJlbnRTdGF0ZSA9ICRyb290U2NvcGUuJHN0YXRlLmN1cnJlbnQubmFtZTtcclxuICAgICAgICAgIHZhciAkc2lkZWJhciA9IGVsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgdmFyIGV2ZW50TmFtZSA9IFV0aWxzLmlzVG91Y2goKSA/ICdjbGljaycgOiAnbW91c2VlbnRlcicgO1xyXG4gICAgICAgICAgdmFyIHN1Yk5hdiA9ICQoKTtcclxuXHJcbiAgICAgICAgICAkc2lkZWJhci5vbiggZXZlbnROYW1lLCAnLm5hdiA+IGxpJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICBpZiggVXRpbHMuaXNTaWRlYmFyQ29sbGFwc2VkKCkgfHwgJHJvb3RTY29wZS5hcHAubGF5b3V0LmFzaWRlSG92ZXIgKSB7XHJcblxyXG4gICAgICAgICAgICAgIHN1Yk5hdi50cmlnZ2VyKCdtb3VzZWxlYXZlJyk7XHJcbiAgICAgICAgICAgICAgc3ViTmF2ID0gdG9nZ2xlTWVudUl0ZW0oICQodGhpcyksICRzaWRlYmFyKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gVXNlZCB0byBkZXRlY3QgY2xpY2sgYW5kIHRvdWNoIGV2ZW50cyBvdXRzaWRlIHRoZSBzaWRlYmFyICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIHNpZGViYXJBZGRCYWNrZHJvcCgpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHNjb3BlLiRvbignY2xvc2VTaWRlYmFyTWVudScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZW1vdmVGbG9hdGluZ05hdigpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgLy8gTm9ybWFsaXplIHN0YXRlIHdoZW4gcmVzaXplIHRvIG1vYmlsZVxyXG4gICAgICAgICAgJHdpbi5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmKCAhIFV0aWxzLmlzTW9iaWxlKCkgKVxyXG4gICAgICAgICAgXHRhc2lkZVRvZ2dsZU9mZigpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgLy8gQWRqdXN0bWVudCBvbiByb3V0ZSBjaGFuZ2VzXHJcbiAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSkge1xyXG4gICAgICAgICAgICBjdXJyZW50U3RhdGUgPSB0b1N0YXRlLm5hbWU7XHJcbiAgICAgICAgICAgIC8vIEhpZGUgc2lkZWJhciBhdXRvbWF0aWNhbGx5IG9uIG1vYmlsZVxyXG4gICAgICAgICAgICBhc2lkZVRvZ2dsZU9mZigpO1xyXG5cclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdjbG9zZVNpZGViYXJNZW51Jyk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgIFx0ICAvLyBBdXRvY2xvc2Ugd2hlbiBjbGljayBvdXRzaWRlIHRoZSBzaWRlYmFyXHJcbiAgICAgICAgICBpZiAoIGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLnNpZGViYXJBbnljbGlja0Nsb3NlKSApIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciB3cmFwcGVyID0gJCgnLndyYXBwZXInKTtcclxuICAgICAgICAgICAgdmFyIHNiY2xpY2tFdmVudCA9ICdjbGljay5zaWRlYmFyJztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJHdhdGNoKCdhcHAuYXNpZGVUb2dnbGVkJywgd2F0Y2hFeHRlcm5hbENsaWNrcyk7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vLy8vL1xyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIHdhdGNoRXh0ZXJuYWxDbGlja3MobmV3VmFsKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIHNpZGViYXIgYmVjb21lcyB2aXNpYmxlXHJcbiAgICAgICAgICAgIGlmICggbmV3VmFsID09PSB0cnVlICkge1xyXG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7IC8vIHJlbmRlciBhZnRlciBjdXJyZW50IGRpZ2VzdCBjeWNsZVxyXG4gICAgICAgICAgICAgICAgd3JhcHBlci5vbihzYmNsaWNrRXZlbnQsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgICAvLyBpZiBub3QgY2hpbGQgb2Ygc2lkZWJhclxyXG4gICAgICAgICAgICAgICAgICBpZiggISAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuYXNpZGUnKS5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNpZGVUb2dnbGVPZmYoKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gZGV0dGFjaCBldmVudFxyXG4gICAgICAgICAgICAgIHdyYXBwZXIub2ZmKHNiY2xpY2tFdmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBhc2lkZVRvZ2dsZU9mZigpIHtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5hcHAuYXNpZGVUb2dnbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmKCFzY29wZS4kJHBoYXNlKSBzY29wZS4kYXBwbHkoKTsgLy8gYW50aS1wYXR0ZXJuIGJ1dCBzb21ldGltZXMgbmVjZXNzYXJ5XHJcbiAgICAgIFx0ICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2lkZWJhckFkZEJhY2tkcm9wKCkge1xyXG4gICAgICAgICAgdmFyICRiYWNrZHJvcCA9ICQoJzxkaXYvPicsIHsgJ2NsYXNzJzogJ2Ryb3Bkb3duLWJhY2tkcm9wJ30gKTtcclxuICAgICAgICAgICRiYWNrZHJvcC5pbnNlcnRBZnRlcignLmFzaWRlLWlubmVyJykub24oJ2NsaWNrIG1vdXNlZW50ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUZsb2F0aW5nTmF2KCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE9wZW4gdGhlIGNvbGxhcHNlIHNpZGViYXIgc3VibWVudSBpdGVtcyB3aGVuIG9uIHRvdWNoIGRldmljZXMgXHJcbiAgICAgICAgLy8gLSBkZXNrdG9wIG9ubHkgb3BlbnMgb24gaG92ZXJcclxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVUb3VjaEl0ZW0oJGVsZW1lbnQpe1xyXG4gICAgICAgICAgJGVsZW1lbnRcclxuICAgICAgICAgICAgLnNpYmxpbmdzKCdsaScpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpXHJcbiAgICAgICAgICAgIC5lbmQoKVxyXG4gICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEhhbmRsZXMgaG92ZXIgdG8gb3BlbiBpdGVtcyB1bmRlciBjb2xsYXBzZWQgbWVudVxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZU1lbnVJdGVtKCRsaXN0SXRlbSwgJHNpZGViYXIpIHtcclxuXHJcbiAgICAgICAgICByZW1vdmVGbG9hdGluZ05hdigpO1xyXG5cclxuICAgICAgICAgIHZhciB1bCA9ICRsaXN0SXRlbS5jaGlsZHJlbigndWwnKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgaWYoICF1bC5sZW5ndGggKSByZXR1cm4gJCgpO1xyXG4gICAgICAgICAgaWYoICRsaXN0SXRlbS5oYXNDbGFzcygnb3BlbicpICkge1xyXG4gICAgICAgICAgICB0b2dnbGVUb3VjaEl0ZW0oJGxpc3RJdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuICQoKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB2YXIgJGFzaWRlID0gJCgnLmFzaWRlJyk7XHJcbiAgICAgICAgICB2YXIgJGFzaWRlSW5uZXIgPSAkKCcuYXNpZGUtaW5uZXInKTsgLy8gZm9yIHRvcCBvZmZzZXQgY2FsY3VsYXRpb25cclxuICAgICAgICAgIC8vIGZsb2F0IGFzaWRlIHVzZXMgZXh0cmEgcGFkZGluZyBvbiBhc2lkZVxyXG4gICAgICAgICAgdmFyIG1hciA9IHBhcnNlSW50KCAkYXNpZGVJbm5lci5jc3MoJ3BhZGRpbmctdG9wJyksIDApICsgcGFyc2VJbnQoICRhc2lkZS5jc3MoJ3BhZGRpbmctdG9wJyksIDApO1xyXG4gICAgICAgICAgdmFyIHN1Yk5hdiA9IHVsLmNsb25lKCkuYXBwZW5kVG8oICRhc2lkZSApO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB0b2dnbGVUb3VjaEl0ZW0oJGxpc3RJdGVtKTtcclxuXHJcbiAgICAgICAgICB2YXIgaXRlbVRvcCA9ICgkbGlzdEl0ZW0ucG9zaXRpb24oKS50b3AgKyBtYXIpIC0gJHNpZGViYXIuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICB2YXIgdndIZWlnaHQgPSAkd2luLmhlaWdodCgpO1xyXG5cclxuICAgICAgICAgIHN1Yk5hdlxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ25hdi1mbG9hdGluZycpXHJcbiAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAkcm9vdFNjb3BlLmFwcC5sYXlvdXQuaXNGaXhlZCA/ICdmaXhlZCcgOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgICAgICAgIHRvcDogICAgICBpdGVtVG9wLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogICAoc3ViTmF2Lm91dGVySGVpZ2h0KHRydWUpICsgaXRlbVRvcCA+IHZ3SGVpZ2h0KSA/IDAgOiAnYXV0bydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgc3ViTmF2Lm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVRvdWNoSXRlbSgkbGlzdEl0ZW0pO1xyXG4gICAgICAgICAgICBzdWJOYXYucmVtb3ZlKCk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gc3ViTmF2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlRmxvYXRpbmdOYXYoKSB7XHJcbiAgICAgICAgICAkKCcuZHJvcGRvd24tYmFja2Ryb3AnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICQoJy5zaWRlYmFyLXN1Ym5hdi5uYXYtZmxvYXRpbmcnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICQoJy5zaWRlYmFyIGxpLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59KSgpO1xyXG5cclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuc2lkZWJhcicpXHJcbiAgICAgICAgLnNlcnZpY2UoJ1NpZGViYXJMb2FkZXInLCBTaWRlYmFyTG9hZGVyKTtcclxuXHJcbiAgICBTaWRlYmFyTG9hZGVyLiRpbmplY3QgPSBbJyRodHRwJ107XHJcbiAgICBmdW5jdGlvbiBTaWRlYmFyTG9hZGVyKCRodHRwKSB7XHJcbiAgICAgICAgdGhpcy5nZXRNZW51ID0gZ2V0TWVudTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRNZW51KG9uUmVhZHksIG9uRXJyb3IpIHtcclxuICAgICAgICAgIHZhciBtZW51SnNvbiA9ICdzZXJ2ZXIvc2lkZWJhci1tZW51Lmpzb24nLFxyXG4gICAgICAgICAgICAgIG1lbnVVUkwgID0gbWVudUpzb24gKyAnP3Y9JyArIChuZXcgRGF0ZSgpLmdldFRpbWUoKSk7IC8vIGp1bXBzIGNhY2hlXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgb25FcnJvciA9IG9uRXJyb3IgfHwgZnVuY3Rpb24oKSB7IGFsZXJ0KCdGYWlsdXJlIGxvYWRpbmcgbWVudScpOyB9O1xyXG5cclxuICAgICAgICAgICRodHRwXHJcbiAgICAgICAgICAgIC5nZXQobWVudVVSTClcclxuICAgICAgICAgICAgLnN1Y2Nlc3Mob25SZWFkeSlcclxuICAgICAgICAgICAgLmVycm9yKG9uRXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuc2lkZWJhcicpXG4gICAgICAgIC5jb250cm9sbGVyKCdVc2VyQmxvY2tDb250cm9sbGVyJywgVXNlckJsb2NrQ29udHJvbGxlcik7XG5cbiAgICBVc2VyQmxvY2tDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnXTtcbiAgICBmdW5jdGlvbiBVc2VyQmxvY2tDb250cm9sbGVyKCRyb290U2NvcGUpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLnVzZXIgPSAkcm9vdFNjb3BlLnVzZXIgfHwge1xuICAgICAgICAgICAgbmFtZTogICAgICfmnY7mmI4nLFxuICAgICAgICAgICAgam9iOiAgICAgICfogIHmnb8nLFxuICAgICAgICAgICAgcGljdHVyZTogICdhcHAvaW1nL2R1bW15LnBuZydcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgLy8gSGlkZXMvc2hvdyB1c2VyIGF2YXRhciBvbiBzaWRlYmFyXG4gICAgICAgICAgJHJvb3RTY29wZS50b2dnbGVVc2VyQmxvY2sgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd0b2dnbGVVc2VyQmxvY2snKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgJHJvb3RTY29wZS51c2VyQmxvY2tWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICBcbiAgICAgICAgICAkcm9vdFNjb3BlLiRvbigndG9nZ2xlVXNlckJsb2NrJywgZnVuY3Rpb24oLypldmVudCwgYXJncyovKSB7XG5cbiAgICAgICAgICAgICRyb290U2NvcGUudXNlckJsb2NrVmlzaWJsZSA9ICEgJHJvb3RTY29wZS51c2VyQmxvY2tWaXNpYmxlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudGFibGVzJylcclxuICAgICAgICAuc2VydmljZSgnbmdUYWJsZURhdGFTZXJ2aWNlJywgbmdUYWJsZURhdGFTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBuZ1RhYmxlRGF0YVNlcnZpY2UoKSB7XHJcbiAgICAgICAgLyoganNoaW50IHZhbGlkdGhpczp0cnVlICovXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZ2V0RGF0YSA9IGdldERhdGE7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGF0YSgkZGVmZXIsIHBhcmFtcywgYXBpKSB7XHJcbiAgICAgICAgICAvLyBpZiBubyBjYWNoZSwgcmVxdWVzdCBkYXRhIGFuZCBmaWx0ZXJcclxuICAgICAgICAgIGlmICggISBzZWxmLmNhY2hlICkge1xyXG4gICAgICAgICAgICBpZiAoIGFwaSApIHtcclxuICAgICAgICAgICAgICBhcGkuZ2V0KGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jYWNoZSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJkYXRhKCRkZWZlciwgcGFyYW1zKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZpbHRlcmRhdGEoJGRlZmVyLCBwYXJhbXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBmdW5jdGlvbiBmaWx0ZXJkYXRhKCRkZWZlciwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgIHZhciBmcm9tID0gKHBhcmFtcy5wYWdlKCkgLSAxKSAqIHBhcmFtcy5jb3VudCgpO1xyXG4gICAgICAgICAgICB2YXIgdG8gPSBwYXJhbXMucGFnZSgpICogcGFyYW1zLmNvdW50KCk7XHJcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZERhdGEgPSBzZWxmLmNhY2hlLnJlc3VsdC5zbGljZShmcm9tLCB0byk7XHJcblxyXG4gICAgICAgICAgICBwYXJhbXMudG90YWwoc2VsZi5jYWNoZS50b3RhbCk7XHJcbiAgICAgICAgICAgICRkZWZlci5yZXNvbHZlKGZpbHRlcmVkRGF0YSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudGFibGVzJylcclxuICAgICAgICAuc2VydmljZSgnbmdUYWJsZUxCU2VydmljZScsIG5nVGFibGVMQlNlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG5nVGFibGVMQlNlcnZpY2UoKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgIHRoaXMuZ2V0RGF0YSA9IGdldERhdGE7XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXREYXRhKCRkZWZlciwgcGFyYW1zLCBNb2RlbCwgZmlsdGVyKSB7XHJcbiAgICAgICAgZmlsdGVyLmxpbWl0ID0gcGFyYW1zLmNvdW50KCk7XHJcbiAgICAgICAgZmlsdGVyLnNraXAgPSAocGFyYW1zLnBhZ2UoKS0xKSpmaWx0ZXIubGltaXQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgTW9kZWwuY291bnQoe3doZXJlOiBmaWx0ZXIud2hlcmV9LCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICBwYXJhbXMudG90YWwocmVzdWx0LmNvdW50KTtcclxuICAgICAgICAgIE1vZGVsLmZpbmQoe2ZpbHRlcjpmaWx0ZXJ9LCAkZGVmZXIucmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudHJhbnNsYXRlJylcclxuICAgICAgICAuY29uZmlnKHRyYW5zbGF0ZUNvbmZpZylcclxuICAgICAgICA7XHJcbiAgICB0cmFuc2xhdGVDb25maWcuJGluamVjdCA9IFsnJHRyYW5zbGF0ZVByb3ZpZGVyJ107XHJcbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVDb25maWcoJHRyYW5zbGF0ZVByb3ZpZGVyKXtcclxuXHJcbiAgICAgICR0cmFuc2xhdGVQcm92aWRlci51c2VTdGF0aWNGaWxlc0xvYWRlcih7XHJcbiAgICAgICAgICBwcmVmaXggOiAnYXBwL2kxOG4vJyxcclxuICAgICAgICAgIHN1ZmZpeCA6ICcuanNvbidcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkdHJhbnNsYXRlUHJvdmlkZXIucHJlZmVycmVkTGFuZ3VhZ2UoJ3poX0NOJyk7XHJcbiAgICAgICR0cmFuc2xhdGVQcm92aWRlci51c2VMb2NhbFN0b3JhZ2UoKTtcclxuICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnVzZVBvc3RDb21waWxpbmcodHJ1ZSk7XHJcbiAgICAgICR0cmFuc2xhdGVQcm92aWRlci51c2VTYW5pdGl6ZVZhbHVlU3RyYXRlZ3koJ3Nhbml0aXplUGFyYW1ldGVycycpO1xyXG5cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50cmFuc2xhdGUnKVxyXG4gICAgICAgIC5ydW4odHJhbnNsYXRlUnVuKVxyXG4gICAgICAgIDtcclxuICAgIHRyYW5zbGF0ZVJ1bi4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyR0cmFuc2xhdGUnXTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlUnVuKCRyb290U2NvcGUsICR0cmFuc2xhdGUpe1xyXG5cclxuICAgICAgLy8gSW50ZXJuYXRpb25hbGl6YXRpb25cclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgJHJvb3RTY29wZS5sYW5ndWFnZSA9IHtcclxuICAgICAgICAvLyBIYW5kbGVzIGxhbmd1YWdlIGRyb3Bkb3duXHJcbiAgICAgICAgbGlzdElzT3BlbjogZmFsc2UsXHJcbiAgICAgICAgLy8gbGlzdCBvZiBhdmFpbGFibGUgbGFuZ3VhZ2VzXHJcbiAgICAgICAgYXZhaWxhYmxlOiB7XHJcbiAgICAgICAgICAnemhfQ04nOiAgICAn5Lit5paH566A5L2TJyxcclxuICAgICAgICAgICdlbic6ICAgICAgICdFbmdsaXNoJyxcclxuICAgICAgICAgICdlc19BUic6ICAgICdFc3Bhw7FvbCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIGRpc3BsYXkgYWx3YXlzIHRoZSBjdXJyZW50IHVpIGxhbmd1YWdlXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIHByb3Bvc2VkTGFuZ3VhZ2UgPSAkdHJhbnNsYXRlLnByb3Bvc2VkTGFuZ3VhZ2UoKSB8fCAkdHJhbnNsYXRlLnVzZSgpO1xyXG4gICAgICAgICAgdmFyIHByZWZlcnJlZExhbmd1YWdlID0gJHRyYW5zbGF0ZS5wcmVmZXJyZWRMYW5ndWFnZSgpOyAvLyB3ZSBrbm93IHdlIGhhdmUgc2V0IGEgcHJlZmVycmVkIG9uZSBpbiBhcHAuY29uZmlnXHJcbiAgICAgICAgICAkcm9vdFNjb3BlLmxhbmd1YWdlLnNlbGVjdGVkID0gJHJvb3RTY29wZS5sYW5ndWFnZS5hdmFpbGFibGVbIChwcm9wb3NlZExhbmd1YWdlIHx8IHByZWZlcnJlZExhbmd1YWdlKSBdO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobG9jYWxlSWQpIHtcclxuICAgICAgICAgIC8vIFNldCB0aGUgbmV3IGlkaW9tXHJcbiAgICAgICAgICAkdHJhbnNsYXRlLnVzZShsb2NhbGVJZCk7XHJcbiAgICAgICAgICAvLyBzYXZlIGEgcmVmZXJlbmNlIGZvciB0aGUgY3VycmVudCBsYW5ndWFnZVxyXG4gICAgICAgICAgJHJvb3RTY29wZS5sYW5ndWFnZS5zZWxlY3RlZCA9ICRyb290U2NvcGUubGFuZ3VhZ2UuYXZhaWxhYmxlW2xvY2FsZUlkXTtcclxuICAgICAgICAgIC8vIGZpbmFsbHkgdG9nZ2xlIGRyb3Bkb3duXHJcbiAgICAgICAgICAkcm9vdFNjb3BlLmxhbmd1YWdlLmxpc3RJc09wZW4gPSAhICRyb290U2NvcGUubGFuZ3VhZ2UubGlzdElzT3BlbjtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkcm9vdFNjb3BlLmxhbmd1YWdlLmluaXQoKTtcclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IGFuaW1hdGUtZW5hYmxlZC5qc1xuICogRW5hYmxlIG9yIGRpc2FibGVzIG5nQW5pbWF0ZSBmb3IgZWxlbWVudCB3aXRoIGRpcmVjdGl2ZVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC51dGlscycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2FuaW1hdGVFbmFibGVkJywgYW5pbWF0ZUVuYWJsZWQpO1xuXG4gICAgYW5pbWF0ZUVuYWJsZWQuJGluamVjdCA9IFsnJGFuaW1hdGUnXTtcbiAgICBmdW5jdGlvbiBhbmltYXRlRW5hYmxlZCAoJGFuaW1hdGUpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlLiRldmFsKGF0dHJzLmFuaW1hdGVFbmFibGVkLCBzY29wZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5lbmFibGVkKCEhbmV3VmFsdWUsIGVsZW1lbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogYnJvd3Nlci5qc1xyXG4gKiBCcm93c2VyIGRldGVjdGlvblxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnV0aWxzJylcclxuICAgICAgICAuc2VydmljZSgnQnJvd3NlcicsIEJyb3dzZXIpO1xyXG5cclxuICAgIEJyb3dzZXIuJGluamVjdCA9IFsnJHdpbmRvdyddO1xyXG4gICAgZnVuY3Rpb24gQnJvd3Nlcigkd2luZG93KSB7XHJcbiAgICAgIHJldHVybiAkd2luZG93LmpRQnJvd3NlcjtcclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBjbGVhci1zdG9yYWdlLmpzXG4gKiBSZW1vdmVzIGEga2V5IGZyb20gdGhlIGJyb3dzZXIgc3RvcmFnZSB2aWEgZWxlbWVudCBjbGlja1xuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC51dGlscycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3Jlc2V0S2V5JywgcmVzZXRLZXkpO1xuXG4gICAgcmVzZXRLZXkuJGluamVjdCA9IFsnJHN0YXRlJywgJyRsb2NhbFN0b3JhZ2UnXTtcbiAgICBmdW5jdGlvbiByZXNldEtleSAoJHN0YXRlLCAkbG9jYWxTdG9yYWdlKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgIHJlc2V0S2V5OiAnQCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgaWYoc2NvcGUucmVzZXRLZXkpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgJGxvY2FsU3RvcmFnZVtzY29wZS5yZXNldEtleV07XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCRzdGF0ZS5jdXJyZW50LCB7fSwge3JlbG9hZDogdHJ1ZX0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICQuZXJyb3IoJ05vIHN0b3JhZ2Uga2V5IHNwZWNpZmllZCBmb3IgcmVzZXQuJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBjdXJyZW5jeS5qc1xuICogQ3VycmVuY3kgZm9ybWF0IGRcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudXRpbHMnKVxuICAgICAgICAuZGlyZWN0aXZlKCdjdXJyZW5jeScsIGN1cnJlbmN5KVxuICAgICAgICAuZGlyZWN0aXZlKCdib251cycsIGJvbnVzKTtcblxuICAgIGN1cnJlbmN5LiRpbmplY3QgPSBbJyR3aW5kb3cnXTtcbiAgICBmdW5jdGlvbiBjdXJyZW5jeSgkd2luZG93KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbENvbnRyb2xsZXIpIHtcbiAgICAgICAgICBuZ01vZGVsQ29udHJvbGxlci4kcGFyc2Vycy5wdXNoKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIC8vY29udmVydCBkYXRhIGZyb20gdmlldyBmb3JtYXQgdG8gbW9kZWwgZm9ybWF0XG4gICAgICAgICAgICByZXR1cm4gZGF0YSoxMDA7IC8vY29udmVydGVkXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBuZ01vZGVsQ29udHJvbGxlci4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIC8vY29udmVydCBkYXRhIGZyb20gbW9kZWwgZm9ybWF0IHRvIHZpZXcgZm9ybWF0XG4gICAgICAgICAgICByZXR1cm4gZGF0YS8xMDA7IC8vY29udmVydGVkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGJvbnVzLiRpbmplY3QgPSBbJyR3aW5kb3cnXTtcbiAgICBmdW5jdGlvbiBib251cygkd2luZG93KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbENvbnRyb2xsZXIpIHtcbiAgICAgICAgICBuZ01vZGVsQ29udHJvbGxlci4kcGFyc2Vycy5wdXNoKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIC8vY29udmVydCBkYXRhIGZyb20gdmlldyBmb3JtYXQgdG8gbW9kZWwgZm9ybWF0XG4gICAgICAgICAgICByZXR1cm4gZGF0YS8xMDA7IC8vY29udmVydGVkXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBuZ01vZGVsQ29udHJvbGxlci4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIC8vY29udmVydCBkYXRhIGZyb20gbW9kZWwgZm9ybWF0IHRvIHZpZXcgZm9ybWF0XG4gICAgICAgICAgICByZXR1cm4gZGF0YSoxMDA7IC8vY29udmVydGVkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IGZ1bGxzY3JlZW4uanNcbiAqIFRvZ2dsZSB0aGUgZnVsbHNjcmVlbiBtb2RlIG9uL29mZlxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC51dGlscycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3RvZ2dsZUZ1bGxzY3JlZW4nLCB0b2dnbGVGdWxsc2NyZWVuKTtcblxuICAgIHRvZ2dsZUZ1bGxzY3JlZW4uJGluamVjdCA9IFsnQnJvd3NlciddO1xuICAgIGZ1bmN0aW9uIHRvZ2dsZUZ1bGxzY3JlZW4gKEJyb3dzZXIpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgIC8vIE5vdCBzdXBwb3J0ZWQgdW5kZXIgSUVcbiAgICAgICAgICBpZiggQnJvd3Nlci5tc2llICkge1xuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnaGlkZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2NyZWVuZnVsbC5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIHNjcmVlbmZ1bGwudG9nZ2xlKCk7XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIC8vIFN3aXRjaCBpY29uIGluZGljYXRvclxuICAgICAgICAgICAgICAgICAgaWYoc2NyZWVuZnVsbC5pc0Z1bGxzY3JlZW4pXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY2hpbGRyZW4oJ2VtJykucmVtb3ZlQ2xhc3MoJ2ZhLWV4cGFuZCcpLmFkZENsYXNzKCdmYS1jb21wcmVzcycpO1xuICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKCdlbScpLnJlbW92ZUNsYXNzKCdmYS1jb21wcmVzcycpLmFkZENsYXNzKCdmYS1leHBhbmQnKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAkLmVycm9yKCdGdWxsc2NyZWVuIG5vdCBlbmFibGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBsb2FkLWNzcy5qc1xuICogUmVxdWVzdCBhbmQgbG9hZCBpbnRvIHRoZSBjdXJyZW50IHBhZ2UgYSBjc3MgZmlsZVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC51dGlscycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2xvYWRDc3MnLCBsb2FkQ3NzKTtcblxuICAgIGZ1bmN0aW9uIGxvYWRDc3MgKCkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgaWYoZWxlbWVudC5pcygnYScpKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIHZhciB1cmkgPSBhdHRycy5sb2FkQ3NzLFxuICAgICAgICAgICAgICAgICAgbGluaztcblxuICAgICAgICAgICAgICBpZih1cmkpIHtcbiAgICAgICAgICAgICAgICBsaW5rID0gY3JlYXRlTGluayh1cmkpO1xuICAgICAgICAgICAgICAgIGlmICggIWxpbmsgKSB7XG4gICAgICAgICAgICAgICAgICAkLmVycm9yKCdFcnJvciBjcmVhdGluZyBzdHlsZXNoZWV0IGxpbmsgZWxlbWVudC4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgJC5lcnJvcignTm8gc3R5bGVzaGVldCBsb2NhdGlvbiBkZWZpbmVkLicpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTGluayh1cmkpIHtcbiAgICAgICAgICB2YXIgbGlua0lkID0gJ2F1dG9sb2FkZWQtc3R5bGVzaGVldCcsXG4gICAgICAgICAgICAgIG9sZExpbmsgPSAkKCcjJytsaW5rSWQpLmF0dHIoJ2lkJywgbGlua0lkICsgJy1vbGQnKTtcblxuICAgICAgICAgICQoJ2hlYWQnKS5hcHBlbmQoJCgnPGxpbmsvPicpLmF0dHIoe1xuICAgICAgICAgICAgJ2lkJzogICBsaW5rSWQsXG4gICAgICAgICAgICAncmVsJzogICdzdHlsZXNoZWV0JyxcbiAgICAgICAgICAgICdocmVmJzogdXJpXG4gICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgaWYoIG9sZExpbmsubGVuZ3RoICkge1xuICAgICAgICAgICAgb2xkTGluay5yZW1vdmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gJCgnIycrbGlua0lkKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBub3cuanNcbiAqIFByb3ZpZGVzIGEgc2ltcGxlIHdheSB0byBkaXNwbGF5IHRoZSBjdXJyZW50IHRpbWUgZm9ybWF0dGVkXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnV0aWxzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnbm93Jywgbm93KTtcblxuICAgIG5vdy4kaW5qZWN0ID0gWydkYXRlRmlsdGVyJywgJyRpbnRlcnZhbCddO1xuICAgIGZ1bmN0aW9uIG5vdyAoZGF0ZUZpbHRlciwgJGludGVydmFsKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIHZhciBmb3JtYXQgPSBhdHRycy5mb3JtYXQ7XG5cbiAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVUaW1lKCkge1xuICAgICAgICAgICAgdmFyIGR0ID0gZGF0ZUZpbHRlcihuZXcgRGF0ZSgpLCBmb3JtYXQpO1xuICAgICAgICAgICAgZWxlbWVudC50ZXh0KGR0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB1cGRhdGVUaW1lKCk7XG4gICAgICAgICAgdmFyIGludGVydmFsUHJvbWlzZSA9ICRpbnRlcnZhbCh1cGRhdGVUaW1lLCAxMDAwKTtcblxuICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbChpbnRlcnZhbFByb21pc2UpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogdGFibGUtY2hlY2thbGwuanNcbiAqIFRhYmxlcyBjaGVjayBhbGwgY2hlY2tib3hcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnV0aWxzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnY2hlY2tBbGwnLCBjaGVja0FsbCk7XG5cbiAgICBmdW5jdGlvbiBjaGVja0FsbCAoKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICBlbGVtZW50Lm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgaW5kZXg9ICR0aGlzLmluZGV4KCkgKyAxLFxuICAgICAgICAgICAgICAgIGNoZWNrYm94ID0gJHRoaXMuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyksXG4gICAgICAgICAgICAgICAgdGFibGUgPSAkdGhpcy5wYXJlbnRzKCd0YWJsZScpO1xuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRvIGFmZmVjdCBvbmx5IHRoZSBjb3JyZWN0IGNoZWNrYm94IGNvbHVtblxuICAgICAgICAgICAgdGFibGUuZmluZCgndGJvZHkgPiB0ciA+IHRkOm50aC1jaGlsZCgnK2luZGV4KycpIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpXG4gICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJywgY2hlY2tib3hbMF0uY2hlY2tlZCk7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IHRyaWdnZXItcmVzaXplLmpzXHJcbiAqIFRyaWdnZXJzIGEgd2luZG93IHJlc2l6ZSBldmVudCBmcm9tIGFueSBlbGVtZW50XHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC51dGlscycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgndHJpZ2dlclJlc2l6ZScsIHRyaWdnZXJSZXNpemUpO1xyXG5cclxuICAgIHRyaWdnZXJSZXNpemUuJGluamVjdCA9IFsnJHdpbmRvdycsICckdGltZW91dCddO1xyXG4gICAgZnVuY3Rpb24gdHJpZ2dlclJlc2l6ZSAoJHdpbmRvdywgJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgJHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncmVzaXplJykpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiB1dGlscy5qc1xuICogVXRpbGl0eSBsaWJyYXJ5IHRvIHVzZSBhY3Jvc3MgdGhlIHRoZW1lXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnV0aWxzJylcbiAgICAgICAgLnNlcnZpY2UoJ1V0aWxzJywgVXRpbHMpO1xuXG4gICAgVXRpbHMuJGluamVjdCA9IFsnJHdpbmRvdycsICdBUFBfTUVESUFRVUVSWSddO1xuICAgIGZ1bmN0aW9uIFV0aWxzKCR3aW5kb3csIEFQUF9NRURJQVFVRVJZKSB7XG5cbiAgICAgICAgdmFyICRodG1sID0gYW5ndWxhci5lbGVtZW50KCdodG1sJyksXG4gICAgICAgICAgICAkd2luICA9IGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KSxcbiAgICAgICAgICAgICRib2R5ID0gYW5ndWxhci5lbGVtZW50KCdib2R5Jyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAvLyBERVRFQ1RJT05cbiAgICAgICAgICBzdXBwb3J0OiB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uRW5kID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2Via2l0VHJhbnNpdGlvbjogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNb3pUcmFuc2l0aW9uOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9UcmFuc2l0aW9uOiAnb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAndHJhbnNpdGlvbmVuZCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBuYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKG5hbWUgaW4gdHJhbnNFbmRFdmVudE5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHRyYW5zRW5kRXZlbnROYW1lc1tuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSgpKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNpdGlvbkVuZCAmJiB7IGVuZDogdHJhbnNpdGlvbkVuZCB9O1xuICAgICAgICAgICAgICAgIH0pKCksXG4gICAgICAgICAgICBhbmltYXRpb246IChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHZhciBhbmltYXRpb25FbmQgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1FbmRFdmVudE5hbWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdlYmtpdEFuaW1hdGlvbjogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTW96QW5pbWF0aW9uOiAnYW5pbWF0aW9uZW5kJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPQW5pbWF0aW9uOiAnb0FuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246ICdhbmltYXRpb25lbmQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBuYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobmFtZSBpbiBhbmltRW5kRXZlbnROYW1lcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIGFuaW1FbmRFdmVudE5hbWVzW25hbWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSgpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25FbmQgJiYgeyBlbmQ6IGFuaW1hdGlvbkVuZCB9O1xuICAgICAgICAgICAgfSkoKSxcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZTogd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGNhbGxiYWNrKXsgd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAvNjApOyB9LFxuICAgICAgICAgICAgLypqc2hpbnQgLVcwNjkqL1xuICAgICAgICAgICAgdG91Y2g6IChcbiAgICAgICAgICAgICAgICAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvbW9iaWxlfHRhYmxldC8pKSB8fFxuICAgICAgICAgICAgICAgICh3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIHdpbmRvdy5Eb2N1bWVudFRvdWNoKSAgfHxcbiAgICAgICAgICAgICAgICAod2luZG93Lm5hdmlnYXRvclsnbXNQb2ludGVyRW5hYmxlZCddICYmIHdpbmRvdy5uYXZpZ2F0b3JbJ21zTWF4VG91Y2hQb2ludHMnXSA+IDApIHx8IC8vSUUgMTBcbiAgICAgICAgICAgICAgICAod2luZG93Lm5hdmlnYXRvclsncG9pbnRlckVuYWJsZWQnXSAmJiB3aW5kb3cubmF2aWdhdG9yWydtYXhUb3VjaFBvaW50cyddID4gMCkgfHwgLy9JRSA+PTExXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBtdXRhdGlvbm9ic2VydmVyOiAod2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93Lk1vek11dGF0aW9uT2JzZXJ2ZXIgfHwgbnVsbClcbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIFVUSUxJVElFU1xuICAgICAgICAgIGlzSW5WaWV3OiBmdW5jdGlvbihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgICAgICAgIC8qanNoaW50IC1XMTA2Ki9cbiAgICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KTtcblxuICAgICAgICAgICAgICBpZiAoISRlbGVtZW50LmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgd2luZG93X2xlZnQgPSAkd2luLnNjcm9sbExlZnQoKSxcbiAgICAgICAgICAgICAgICAgIHdpbmRvd190b3AgID0gJHdpbi5zY3JvbGxUb3AoKSxcbiAgICAgICAgICAgICAgICAgIG9mZnNldCAgICAgID0gJGVsZW1lbnQub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgICBsZWZ0ICAgICAgICA9IG9mZnNldC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgdG9wICAgICAgICAgPSBvZmZzZXQudG9wO1xuXG4gICAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7dG9wb2Zmc2V0OjAsIGxlZnRvZmZzZXQ6MH0sIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgIGlmICh0b3AgKyAkZWxlbWVudC5oZWlnaHQoKSA+PSB3aW5kb3dfdG9wICYmIHRvcCAtIG9wdGlvbnMudG9wb2Zmc2V0IDw9IHdpbmRvd190b3AgKyAkd2luLmhlaWdodCgpICYmXG4gICAgICAgICAgICAgICAgICBsZWZ0ICsgJGVsZW1lbnQud2lkdGgoKSA+PSB3aW5kb3dfbGVmdCAmJiBsZWZ0IC0gb3B0aW9ucy5sZWZ0b2Zmc2V0IDw9IHdpbmRvd19sZWZ0ICsgJHdpbi53aWR0aCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcbiAgICAgICAgICBsYW5nZGlyZWN0aW9uOiAkaHRtbC5hdHRyKCdkaXInKSA9PT0gJ3J0bCcgPyAncmlnaHQnIDogJ2xlZnQnLFxuXG4gICAgICAgICAgaXNUb3VjaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodG1sLmhhc0NsYXNzKCd0b3VjaCcpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBpc1NpZGViYXJDb2xsYXBzZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkYm9keS5oYXNDbGFzcygnYXNpZGUtY29sbGFwc2VkJyk7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIGlzU2lkZWJhclRvZ2dsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkYm9keS5oYXNDbGFzcygnYXNpZGUtdG9nZ2xlZCcpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBpc01vYmlsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICR3aW4ud2lkdGgoKSA8IEFQUF9NRURJQVFVRVJZLnRhYmxldDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdjdXN0b20nLCBbXHJcbiAgICAgICAgICAgIC8vIHJlcXVlc3QgdGhlIHRoZSBlbnRpcmUgZnJhbWV3b3JrXHJcbiAgICAgICAgICAgICdhbmdsZScsXHJcbiAgICAgICAgICAgIC8vIG9yIGp1c3QgbW9kdWxlc1xyXG4gICAgICAgICAgICAnYXBwLmNvcmUnLFxyXG4gICAgICAgICAgICAnYXBwLnNpZGViYXInXHJcbiAgICAgICAgICAgIC8qLi4uKi9cclxuICAgICAgICBdKTtcclxufSkoKTsiLCJcclxuLy8gVG8gcnVuIHRoaXMgY29kZSwgZWRpdCBmaWxlIGluZGV4Lmh0bWwgb3IgaW5kZXguamFkZSBhbmQgY2hhbmdlXHJcbi8vIGh0bWwgZGF0YS1uZy1hcHAgYXR0cmlidXRlIGZyb20gYW5nbGUgdG8gbXlBcHBOYW1lXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnY3VzdG9tJylcclxuICAgICAgICAuY29udHJvbGxlcignQ29udHJvbGxlcicsIENvbnRyb2xsZXIpO1xyXG5cclxuICAgIENvbnRyb2xsZXIuJGluamVjdCA9IFsnJGxvZyddO1xyXG4gICAgZnVuY3Rpb24gQ29udHJvbGxlcigkbG9nKSB7XHJcbiAgICAgICAgLy8gZm9yIGNvbnRyb2xsZXJBcyBzeW50YXhcclxuICAgICAgICAvLyB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgJGxvZy5sb2coJ0lcXCdtIGEgbGluZSBmcm9tIGN1c3RvbS5qcycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
