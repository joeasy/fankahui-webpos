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
        .module('app.colors', []);
})();
(function() {
    'use strict';

    angular
        .module('app.charts', []);
})();
(function() {
    'use strict';

    angular
        .module('app.costs', []);
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
        .module('app.sales', []);
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
          vm.tableParams.reload();
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
          if(!sku.inventories[0]) {
            sku.inventories[0] = {qty: 0, modified: new Date()};
          }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb2xvcnMvY29sb3JzLm1vZHVsZS5qcyIsImNoYXJ0cy9jaGFydHMubW9kdWxlLmpzIiwiY29zdHMvY29zdHMubW9kdWxlLmpzIiwiY29yZS9jb3JlLm1vZHVsZS5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmQubW9kdWxlLmpzIiwiZWxlbWVudHMvZWxlbWVudHMubW9kdWxlLmpzIiwiZm9ybXMvZm9ybXMubW9kdWxlLmpzIiwiaXRlbXMvaXRlbXMubW9kdWxlLmpzIiwibGF6eWxvYWQvbGF6eWxvYWQubW9kdWxlLmpzIiwibG9hZGluZ2Jhci9sb2FkaW5nYmFyLm1vZHVsZS5qcyIsImxvY2FsZS9sb2NhbGUubW9kdWxlLmpzIiwibWVtYmVycy9tZW1iZXJzLm1vZHVsZS5qcyIsIm15c2hvcC9teXNob3AubW9kdWxlLmpzIiwibm90aWZ5L25vdGlmeS5tb2R1bGUuanMiLCJwYWdlcy9wYWdlcy5tb2R1bGUuanMiLCJwYW5lbHMvcGFuZWxzLm1vZHVsZS5qcyIsInByZWxvYWRlci9wcmVsb2FkZXIubW9kdWxlLmpzIiwic2FsZXMvc2FsZXMubW9kdWxlLmpzIiwicm91dGVzL3JvdXRlcy5tb2R1bGUuanMiLCJzZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJzaWRlYmFyL3NpZGViYXIubW9kdWxlLmpzIiwidGFibGVzL3RhYmxlcy5tb2R1bGUuanMiLCJ0cmFuc2xhdGUvdHJhbnNsYXRlLm1vZHVsZS5qcyIsInV0aWxzL3V0aWxzLm1vZHVsZS5qcyIsImNvbG9ycy9jb2xvcnMuY29udGFudC5qcyIsImNvbG9ycy9jb2xvcnMuc2VydmljZS5qcyIsImNoYXJ0cy9jaGFydGpzLmRpcmVjdGl2ZS5qcyIsImNoYXJ0cy9jbGFzc3lsb2FkZXIuZGlyZWN0aXZlLmpzIiwiY2hhcnRzL2Zsb3QtZGF0YS5zZXJ2aWNlLmpzIiwiY2hhcnRzL2Zsb3QuZGlyZWN0aXZlLmpzIiwiY2hhcnRzL21vcnJpcy5kaXJlY3RpdmUuanMiLCJjaGFydHMvc3BhcmtsaW5lcy5kaXJlY3RpdmUuanMiLCJjb3N0cy9jb3N0cy5jb250cm9sbGVyLmpzIiwiY29yZS9jb3JlLmNvbmZpZy5qcyIsImNvcmUvY29yZS5jb25zdGFudHMuanMiLCJjb3JlL2NvcmUuZmlsdGVyLmpzIiwiY29yZS9jb3JlLnJ1bi5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmQuY29udHJvbGxlci5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmQuZmlsdGVyLmpzIiwiZWxlbWVudHMvc2Nyb2xsLmRpcmVjdGl2ZS5qcyIsImZvcm1zL2ZpbGVzdHlsZS5kaXJlY3RpdmUuanMiLCJmb3Jtcy9mb3JtLXdpemFyZC5kaXJlY3RpdmUuanMiLCJmb3Jtcy9tYXNrZWQuZGlyZWN0aXZlLmpzIiwiZm9ybXMvcHJvcHMuZmlsdGVyLmpzIiwiZm9ybXMvdGFncy1pbnB1dC5kaXJlY3RpdmUuanMiLCJmb3Jtcy92YWxpZGF0ZS1mb3JtLmRpcmVjdGl2ZS5qcyIsIml0ZW1zL2l0ZW1zLmNvbnRyb2xsZXIuanMiLCJpdGVtcy9pdGVtcy5maWx0ZXIuanMiLCJsYXp5bG9hZC9sYXp5bG9hZC5jb25maWcuanMiLCJsYXp5bG9hZC9sYXp5bG9hZC5jb25zdGFudHMuanMiLCJsb2FkaW5nYmFyL2xvYWRpbmdiYXIuY29uZmlnLmpzIiwibG9hZGluZ2Jhci9sb2FkaW5nYmFyLnJ1bi5qcyIsImxvY2FsZS9sb2NhbGUuY29uZmlnLmpzIiwibG9jYWxlL2xvY2FsZS5jb250cm9sbGVyLmpzIiwibWVtYmVycy9tZW1iZXJzLmNvbnRyb2xsZXIuanMiLCJtZW1iZXJzL21lbWJlcnMuZmlsdGVyLmpzIiwibWVtYmVycy9tZW1iZXJzLnNlcnZpY2UuanMiLCJteXNob3AvbXlzaG9wLmNvbnRyb2xsZXIuanMiLCJteXNob3AvbXlzaG9wLmZpbHRlci5qcyIsIm5vdGlmeS9ub3RpZnkuY29udHJvbGxlci5qcyIsIm5vdGlmeS9ub3RpZnkuZGlyZWN0aXZlLmpzIiwibm90aWZ5L25vdGlmeS5zZXJ2aWNlLmpzIiwicGFnZXMvYWNjZXNzLWxvZ2luLmNvbnRyb2xsZXIuanMiLCJwYWdlcy9hY2Nlc3MtcmVnaXN0ZXIuY29udHJvbGxlci5qcyIsInBhZ2VzL3BhZ2VzLmZpbHRlci5qcyIsInBhbmVscy9wYW5lbC1jb2xsYXBzZS5kaXJlY3RpdmUuanMiLCJwYW5lbHMvcGFuZWwtZGlzbWlzcy5kaXJlY3RpdmUuanMiLCJwYW5lbHMvcGFuZWwtcmVmcmVzaC5kaXJlY3RpdmUuanMiLCJwYW5lbHMvcGFuZWwtdG9vbHMuZGlyZWN0aXZlLmpzIiwicGFuZWxzL3BhbmVscy5jb250cm9sbGVyLmpzIiwicGFuZWxzL3BvcnRsZXQuZGlyZWN0aXZlLmpzIiwicHJlbG9hZGVyL3ByZWxvYWRlci5kaXJlY3RpdmUuanMiLCJzYWxlcy9kZWFsLnNlcnZpY2UuanMiLCJzYWxlcy9zYWxlcy5jb250cm9sbGVyLmpzIiwic2FsZXMvc2FsZXMuZmlsdGVyLmpzIiwicm91dGVzL3JvdXRlLWhlbHBlcnMucHJvdmlkZXIuanMiLCJyb3V0ZXMvcm91dGVzLmNvbmZpZy5qcyIsInNldHRpbmdzL3NldHRpbmcuY29udHJvbGxlci5qcyIsInNldHRpbmdzL3NldHRpbmdzLnJ1bi5qcyIsInNpZGViYXIvc2lkZWJhci5jb250cm9sbGVyLmpzIiwic2lkZWJhci9zaWRlYmFyLmRpcmVjdGl2ZS5qcyIsInNpZGViYXIvc2lkZWJhci5zZXJ2aWNlLmpzIiwic2lkZWJhci9zaWRlYmFyLnVzZXJibG9jay5jb250cm9sbGVyLmpzIiwidGFibGVzL25ndGFibGUtZGF0YS5zZXJ2aWNlLmpzIiwidGFibGVzL25ndGFibGUtbGIuc2VydmljZS5qcyIsInRyYW5zbGF0ZS90cmFuc2xhdGUuY29uZmlnLmpzIiwidHJhbnNsYXRlL3RyYW5zbGF0ZS5ydW4uanMiLCJ1dGlscy9hbmltYXRlLWVuYWJsZWQuZGlyZWN0aXZlLmpzIiwidXRpbHMvYnJvd3Nlci5zZXJ2aWNlLmpzIiwidXRpbHMvY2xlYXItc3RvcmFnZS5kaXJlY3RpdmUuanMiLCJ1dGlscy9jdXJyZW5jeS5kaXJlY3RpdmUuanMiLCJ1dGlscy9mdWxsc2NyZWVuLmRpcmVjdGl2ZS5qcyIsInV0aWxzL2xvYWQtY3NzLmRpcmVjdGl2ZS5qcyIsInV0aWxzL25vdy5kaXJlY3RpdmUuanMiLCJ1dGlscy90YWJsZS1jaGVja2FsbC5kaXJlY3RpdmUuanMiLCJ1dGlscy90cmlnZ2VyLXJlc2l6ZS5kaXJlY3RpdmUuanMiLCJ1dGlscy91dGlscy5zZXJ2aWNlLmpzIiwiY3VzdG9tLm1vZHVsZS5qcyIsImN1c3RvbS5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQWNBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxTQUFBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7Ozs7O0FDeENBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxjQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxjQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxhQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxZQUFBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTs7O0FDbEJBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxpQkFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsZ0JBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGFBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGFBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGdCQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxrQkFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsZUFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsYUFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsaUJBQUE7Ozs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsYUFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTtZQUNBOzs7QUNMQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsZ0JBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGVBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGNBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGlCQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxhQUFBO1VBQ0E7Ozs7QUNMQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxTQUFBLGNBQUE7VUFDQSwwQkFBQTtVQUNBLDBCQUFBO1VBQ0EsMEJBQUE7VUFDQSwwQkFBQTtVQUNBLDBCQUFBO1VBQ0EsMEJBQUE7VUFDQSwwQkFBQTtVQUNBLDBCQUFBO1VBQ0EsMEJBQUE7VUFDQSwwQkFBQTtVQUNBLDBCQUFBO1VBQ0EsMEJBQUE7VUFDQSwwQkFBQTtVQUNBLDBCQUFBO1VBQ0EsMEJBQUE7VUFDQSwwQkFBQTs7Ozs7Ozs7O0FDaEJBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsVUFBQTs7SUFFQSxPQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEsT0FBQSxZQUFBO1FBQ0EsS0FBQSxTQUFBOzs7O1FBSUEsU0FBQSxPQUFBLE1BQUE7VUFDQSxRQUFBLFdBQUEsU0FBQTs7Ozs7Ozs7Ozs7O0FDYkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBOztTQUVBLFVBQUEsaUJBQUEsUUFBQTtTQUNBLFVBQUEsaUJBQUEsUUFBQTtTQUNBLFVBQUEsaUJBQUEsUUFBQTtTQUNBLFVBQUEsaUJBQUEsUUFBQTtTQUNBLFVBQUEsaUJBQUEsUUFBQTtTQUNBLFVBQUEsaUJBQUEsUUFBQTtTQUNBLFVBQUEsaUJBQUEsUUFBQTs7O0lBR0EsU0FBQSxRQUFBLE1BQUE7UUFDQSxPQUFBLFdBQUE7WUFDQSxPQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxNQUFBO29CQUNBLFNBQUE7b0JBQ0EsSUFBQTtvQkFDQSxPQUFBO29CQUNBLFFBQUE7b0JBQ0EsUUFBQTtvQkFDQSxPQUFBO29CQUNBLFVBQUE7b0JBQ0EsWUFBQTtvQkFDQSxTQUFBO29CQUNBLFFBQUE7O2dCQUVBLE1BQUEsVUFBQSxRQUFBLE9BQUE7b0JBQ0EsSUFBQSxNQUFBLE1BQUEsR0FBQSxXQUFBO29CQUNBLElBQUEsV0FBQTs7b0JBRUEsT0FBQSxPQUFBLFlBQUE7d0JBQ0EsSUFBQSxPQUFBLFNBQUEsR0FBQTs0QkFDQSxNQUFBLE1BQUEsTUFBQSxTQUFBOzRCQUNBLElBQUEsT0FBQSxRQUFBLE1BQUE7K0JBQ0E7NEJBQ0EsSUFBQSxPQUFBLFFBQUEsT0FBQSxTQUFBLElBQUEsT0FBQTs0QkFDQSxXQUFBOzs7d0JBR0EsR0FBQSxPQUFBLFVBQUEsRUFBQTs0QkFDQSxNQUFBLE9BQUEsTUFBQSxTQUFBOzRCQUNBLElBQUEsT0FBQSxTQUFBLElBQUEsT0FBQSxRQUFBOytCQUNBOzRCQUNBLElBQUEsT0FBQSxTQUFBLE9BQUEsVUFBQSxJQUFBLE9BQUE7NEJBQ0EsV0FBQTs7OztvQkFJQSxPQUFBLE9BQUEsUUFBQSxVQUFBLFFBQUE7d0JBQ0EsR0FBQTs0QkFDQSxhQUFBOzs7d0JBR0EsSUFBQSxDQUFBLFFBQUE7NEJBQ0E7O3dCQUVBLElBQUEsT0FBQSxPQUFBLEVBQUEsT0FBQSxPQUFBOzt3QkFFQSxHQUFBLFNBQUE7NEJBQ0EsT0FBQTs0QkFDQSxRQUFBLElBQUEsTUFBQTs7O3dCQUdBLEdBQUEsT0FBQSxjQUFBLE9BQUE7NEJBQ0EsT0FBQSxRQUFBLGFBQUE7O3dCQUVBLEdBQUEsT0FBQSxlQUFBOzRCQUNBLE9BQUEsUUFBQSxhQUFBLE9BQUE7O3dCQUVBLGVBQUEsTUFBQSxNQUFBLE9BQUEsTUFBQSxPQUFBO3dCQUNBLGFBQUE7d0JBQ0EsR0FBQSxPQUFBOzRCQUNBLFFBQUEsUUFBQSxNQUFBLElBQUEsU0FBQSxPQUFBLGFBQUE7dUJBQ0E7O29CQUVBLE9BQUEsT0FBQSxXQUFBLFVBQUEsUUFBQTt3QkFDQSxJQUFBOzRCQUNBLGFBQUE7d0JBQ0EsR0FBQSxTQUFBLGFBQUEsQ0FBQSxhQUFBOzRCQUNBO3dCQUNBLEdBQUEsQ0FBQSxTQUFBLFdBQUEsVUFBQSxhQUFBLFNBQUEsVUFBQSxTQUFBOzRCQUNBO3dCQUNBLElBQUEsZ0JBQUEsYUFBQSxTQUFBO3dCQUNBLGNBQUE7d0JBQ0EsY0FBQSxZQUFBLGNBQUE7d0JBQ0EsYUFBQSxZQUFBLENBQUE7d0JBQ0EsY0FBQTt1QkFDQTs7b0JBRUEsT0FBQTtvQkFDQSxJQUFBLFFBQUEsSUFBQSxNQUFBO29CQUNBLElBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsR0EsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxnQkFBQTs7SUFFQSxhQUFBLFVBQUEsQ0FBQSxZQUFBLFNBQUE7SUFDQSxTQUFBLGNBQUEsVUFBQSxPQUFBLFNBQUE7UUFDQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUE7VUFDQSxJQUFBLGtCQUFBLEVBQUE7Y0FDQSxrQkFBQTs7O1VBR0EsU0FBQSxVQUFBOztZQUVBLElBQUEsV0FBQSxFQUFBO2dCQUNBLFdBQUEsU0FBQTs7O1lBR0EsR0FBQSxTQUFBO2NBQ0EsSUFBQSxRQUFBLGdCQUFBOztnQkFFQSxVQUFBLE9BQUEsV0FBQTtrQkFDQSxrQkFBQSxVQUFBOzs7Z0JBR0Esa0JBQUEsVUFBQTs7O2dCQUdBLFlBQUEsVUFBQTs7O2FBR0E7O1VBRUEsU0FBQSxrQkFBQSxTQUFBLFNBQUE7WUFDQSxJQUFBLFNBQUEsQ0FBQTtZQUNBLElBQUEsRUFBQSxRQUFBLFNBQUE7Z0JBQ0EsTUFBQSxTQUFBLFNBQUEsQ0FBQSxXQUFBLFdBQUE7Y0FDQSxZQUFBLFNBQUE7OztVQUdBLFNBQUEsWUFBQSxTQUFBLFNBQUE7WUFDQSxRQUFBLGFBQUEsU0FBQSxTQUFBOzs7Ozs7O0FDdERBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsYUFBQTs7SUFFQSxVQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEsVUFBQSxXQUFBO1FBQ0EsS0FBQSxPQUFBOzs7O1FBSUEsSUFBQSxPQUFBO1lBQ0EsS0FBQSxFQUFBLFFBQUEsT0FBQSxTQUFBOztRQUVBLFNBQUEsS0FBQSxRQUFBO1VBQ0EsT0FBQSxVQUFBLFFBQUEsSUFBQSxNQUFBOzs7Ozs7Ozs7O0FDWkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxRQUFBOztJQUVBLEtBQUEsVUFBQSxDQUFBLFNBQUE7SUFDQSxTQUFBLE1BQUEsT0FBQSxVQUFBOztRQUVBLElBQUEsWUFBQTtVQUNBLFVBQUE7VUFDQSxVQUFBO1VBQ0EsT0FBQTtZQUNBLFNBQUE7WUFDQSxTQUFBO1lBQ0EsUUFBQTtZQUNBLFVBQUE7WUFDQSxLQUFBOztVQUVBLE1BQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBLE9BQUE7VUFDQSxJQUFBLFFBQUEsTUFBQSxVQUFBO1VBQ0EsSUFBQSxnQkFBQTs7VUFFQSxPQUFBOztVQUVBLFFBQUEsTUFBQSxTQUFBO1VBQ0EsU0FBQSxNQUFBLFVBQUE7O1VBRUEsV0FBQSxFQUFBLFFBQUEsV0FBQTtVQUNBLFNBQUEsSUFBQTtZQUNBLE9BQUE7WUFDQSxRQUFBOzs7VUFHQSxTQUFBLE9BQUE7WUFDQSxJQUFBO1lBQ0EsR0FBQSxDQUFBLE1BQUEsV0FBQSxDQUFBLE1BQUEsU0FBQTtZQUNBLFVBQUEsRUFBQSxLQUFBLFVBQUEsTUFBQSxTQUFBLE1BQUE7WUFDQSxNQUFBLE1BQUEsYUFBQTtZQUNBLElBQUEsTUFBQSxVQUFBO2NBQ0EsTUFBQSxTQUFBLFNBQUE7OztZQUdBLE9BQUE7OztVQUdBLFNBQUEsaUJBQUEsU0FBQTtZQUNBLElBQUEsTUFBQTtjQUNBLEtBQUEsUUFBQTtjQUNBLEtBQUE7Y0FDQSxPQUFBLEtBQUE7bUJBQ0E7Y0FDQSxPQUFBO2NBQ0EsZUFBQSxNQUFBO2NBQ0EsT0FBQTs7O1VBR0EsTUFBQSxpQkFBQSxXQUFBLGtCQUFBOztVQUVBLFNBQUEsZ0JBQUEsUUFBQTtZQUNBLElBQUEsQ0FBQSxRQUFBLENBQUEsU0FBQTtZQUNBLElBQUEsV0FBQSxLQUFBO1lBQ0EsSUFBQSxJQUFBLFNBQUEsUUFBQTtjQUNBLFFBQUEsUUFBQSxPQUFBLFFBQUEsVUFBQTs7O1lBR0EsS0FBQSxRQUFBO1lBQ0EsS0FBQTs7WUFFQSxTQUFBLFVBQUEsT0FBQTtjQUNBLE9BQUEsVUFBQSxHQUFBLEVBQUE7Z0JBQ0EsR0FBQSxTQUFBLE1BQUEsU0FBQSxHQUFBO2tCQUNBLFNBQUEsR0FBQSxPQUFBLE9BQUE7Ozs7VUFJQSxNQUFBLE9BQUEsVUFBQSxnQkFBQTs7VUFFQSxTQUFBLGFBQUEsS0FBQTs7WUFFQSxJQUFBLE1BQUE7O2NBRUEsTUFBQSxJQUFBO2lCQUNBLFFBQUEsVUFBQSxNQUFBOztrQkFFQSxTQUFBLFVBQUE7b0JBQ0EsTUFBQSxVQUFBOzs7aUJBR0EsTUFBQSxVQUFBO2dCQUNBLEVBQUEsTUFBQTs7Ozs7VUFLQSxNQUFBLE9BQUEsT0FBQTs7Ozs7Ozs7Ozs7OztBQ3BHQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGVBQUEsWUFBQTtTQUNBLFVBQUEsZUFBQSxZQUFBO1NBQ0EsVUFBQSxlQUFBLFlBQUE7U0FDQSxVQUFBLGVBQUEsWUFBQTs7SUFFQSxTQUFBLFlBQUEsTUFBQTtNQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUE7VUFDQSxVQUFBO1VBQ0EsT0FBQTtZQUNBLFlBQUE7WUFDQSxlQUFBOztVQUVBLE1BQUEsU0FBQSxRQUFBLFNBQUE7O1lBRUEsT0FBQSxPQUFBLGNBQUEsU0FBQSxRQUFBO2NBQ0EsSUFBQSxRQUFBO2dCQUNBLE9BQUEsZUFBQSxRQUFBO2dCQUNBLE9BQUEsZUFBQTs7ZUFFQTs7WUFFQSxPQUFBLGNBQUEsVUFBQTs7WUFFQSxHQUFBLE9BQUE7Y0FDQSxPQUFBLGNBQUEsT0FBQSxPQUFBOztZQUVBLE9BQUEsaUJBQUEsSUFBQSxPQUFBLE1BQUEsT0FBQTs7Ozs7Ozs7Ozs7Ozs7QUNoQ0EsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxhQUFBOztJQUVBLFNBQUEsYUFBQTtRQUNBLElBQUEsWUFBQTtZQUNBLFVBQUE7WUFDQSxPQUFBO2NBQ0EsYUFBQTs7WUFFQSxZQUFBOztRQUVBLE9BQUE7OztJQUdBLFdBQUEsVUFBQSxDQUFBLFVBQUEsWUFBQSxZQUFBO0lBQ0EsU0FBQSxXQUFBLFFBQUEsVUFBQSxVQUFBLFNBQUE7TUFDQSxJQUFBLFFBQUEsVUFBQTtRQUNBOzs7TUFHQSxTQUFBOztNQUVBLFNBQUEsZUFBQTtRQUNBLElBQUEsVUFBQSxPQUFBO1lBQ0EsT0FBQSxTQUFBOztRQUVBLEdBQUEsQ0FBQTtVQUNBLFVBQUE7O1VBRUEsR0FBQTtZQUNBLFVBQUEsUUFBQSxPQUFBLElBQUEsU0FBQTs7UUFFQSxRQUFBLE9BQUEsUUFBQSxRQUFBO1FBQ0EsUUFBQSxxQkFBQTs7UUFFQSxTQUFBLFVBQUEsUUFBQTs7UUFFQSxHQUFBLFFBQUEsUUFBQTtVQUNBLEVBQUEsU0FBQSxPQUFBLFVBQUE7WUFDQSxTQUFBLFVBQUEsUUFBQTs7Ozs7Ozs7OztBQ2hEQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtPQUNBLE9BQUE7T0FDQSxXQUFBLG1CQUFBO09BQ0EsV0FBQSw0QkFBQTtPQUNBLFdBQUEsd0JBQUE7OztJQUdBLGdCQUFBLFVBQUEsQ0FBQSxVQUFBLFFBQUEsaUJBQUEsb0JBQUEsY0FBQTtJQUNBLFNBQUEsZ0JBQUEsUUFBQSxNQUFBLGVBQUEsa0JBQUEsWUFBQSxVQUFBO01BQ0EsSUFBQSxLQUFBOztNQUVBOztNQUVBLEdBQUEsS0FBQTtRQUNBLFNBQUE7VUFDQSxZQUFBO1VBQ0EsU0FBQSxJQUFBO1VBQ0EsU0FBQSxJQUFBLEtBQUEsS0FBQSxFQUFBO1VBQ0EsYUFBQTs7UUFFQSxPQUFBO1VBQ0EsSUFBQSxJQUFBLEtBQUEsU0FBQSxRQUFBO1VBQ0EsTUFBQTs7UUFFQSxLQUFBO1VBQ0EsSUFBQSxJQUFBO1VBQ0EsTUFBQTs7OztNQUlBLFNBQUEsV0FBQTtRQUNBLEdBQUEsY0FBQSxJQUFBLGNBQUEsQ0FBQSxPQUFBLEtBQUE7VUFDQSxTQUFBLFNBQUEsUUFBQSxRQUFBO1lBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQTtjQUNBLE9BQUEsQ0FBQSxHQUFBO2NBQ0EsVUFBQSxDQUFBLFNBQUE7Z0JBQ0EsT0FBQSxHQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUE7Z0JBQ0EsT0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLE1BQUE7OztZQUdBLGlCQUFBLFFBQUEsUUFBQSxRQUFBLE1BQUE7Ozs7OztNQU1BLEdBQUEsU0FBQSxZQUFBO1FBQ0EsU0FBQSxLQUFBO1VBQ0EsVUFBQTtVQUNBLFlBQUE7V0FDQSxhQUFBLEtBQUEsVUFBQSxNQUFBO1VBQ0EsR0FBQSxZQUFBOzs7O01BSUEsR0FBQSxPQUFBLFVBQUEsUUFBQTtRQUNBLE9BQUEsT0FBQTtRQUNBLFNBQUEsS0FBQTtVQUNBLFVBQUE7VUFDQSxZQUFBO1VBQ0EsT0FBQTtXQUNBLGFBQUEsS0FBQSxVQUFBLE1BQUE7VUFDQSxHQUFBLFlBQUE7Ozs7TUFJQSxHQUFBLFNBQUEsVUFBQSxRQUFBO1FBQ0EsV0FBQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0Esa0JBQUE7VUFDQSxvQkFBQTtVQUNBLG1CQUFBO1VBQ0Esa0JBQUE7O1dBRUEsVUFBQSxXQUFBO1VBQ0EsR0FBQSxXQUFBO1lBQ0EsS0FBQSxXQUFBLENBQUEsSUFBQSxPQUFBO1lBQ0EsR0FBQSxZQUFBOzs7Ozs7SUFNQSx5QkFBQSxVQUFBLENBQUEsVUFBQSxnQkFBQTtJQUNBLFNBQUEseUJBQUEsUUFBQSxjQUFBLFlBQUE7TUFDQSxJQUFBLEtBQUE7O01BRUE7O01BRUEsU0FBQSxXQUFBOztRQUVBLEdBQUEsYUFBQSxhQUFBLEtBQUEsQ0FBQSxRQUFBO1VBQ0EsT0FBQTtVQUNBLE9BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQTs7Ozs7TUFLQSxHQUFBLFNBQUE7O01BRUEsU0FBQSxZQUFBLFVBQUE7UUFDQSxXQUFBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxrQkFBQTtVQUNBLG9CQUFBO1VBQ0EsbUJBQUE7VUFDQSxrQkFBQTs7V0FFQTs7O01BR0EsR0FBQSxjQUFBLFVBQUEsVUFBQTtRQUNBLEdBQUEsWUFBQSxZQUFBLElBQUE7VUFDQSxhQUFBLE9BQUEsQ0FBQSxNQUFBLFdBQUEsU0FBQSxLQUFBOzs7O01BSUEsR0FBQSxpQkFBQSxVQUFBLFVBQUE7UUFDQSxhQUFBLDJCQUFBLENBQUEsSUFBQSxTQUFBLEtBQUE7VUFDQSxRQUFBLFNBQUE7VUFDQSxNQUFBLFNBQUE7VUFDQSxNQUFBLFNBQUE7V0FDQSxTQUFBLEtBQUE7OztNQUdBLEdBQUEsaUJBQUEsVUFBQSxVQUFBO1FBQ0EsWUFBQSxVQUFBLFdBQUE7VUFDQSxHQUFBLFdBQUE7WUFDQSxTQUFBLFNBQUE7WUFDQSxHQUFBLGVBQUE7Ozs7O01BS0EsR0FBQSxpQkFBQSxVQUFBLFVBQUEsYUFBQTtRQUNBLEdBQUEsZUFBQSxlQUFBLE1BQUEsU0FBQSxLQUFBLFFBQUEsaUJBQUEsQ0FBQSxHQUFBO1VBQ0EsU0FBQSxLQUFBLEtBQUE7VUFDQSxHQUFBLGVBQUE7Ozs7TUFJQSxHQUFBLG9CQUFBLFVBQUEsVUFBQSxPQUFBOztRQUVBLFlBQUEsVUFBQSxXQUFBO1VBQ0EsR0FBQSxXQUFBO1lBQ0EsU0FBQSxLQUFBLE9BQUEsT0FBQTtZQUNBLEdBQUEsZUFBQTs7Ozs7O0lBTUEscUJBQUEsVUFBQSxDQUFBLFVBQUEsWUFBQSxRQUFBLGNBQUEsZ0JBQUE7SUFDQSxTQUFBLHFCQUFBLFFBQUEsVUFBQSxNQUFBLFlBQUEsY0FBQSxTQUFBOztRQUVBOzs7O1FBSUEsU0FBQSxXQUFBO1VBQ0EsT0FBQSxhQUFBLGFBQUEsS0FBQSxDQUFBLFFBQUE7WUFDQSxPQUFBO1lBQ0EsT0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBOztVQUVBLE9BQUEsT0FBQSxPQUFBLFFBQUE7WUFDQSxVQUFBO1lBQ0EsYUFBQTtZQUNBLFFBQUE7Ozs7UUFJQSxPQUFBLGNBQUEsVUFBQSxHQUFBLEdBQUE7VUFDQSxPQUFBLEtBQUEsV0FBQTtVQUNBLE9BQUEsS0FBQSxjQUFBO1VBQ0EsT0FBQSxjQUFBOzs7UUFHQSxPQUFBLFVBQUEsWUFBQTtVQUNBLEdBQUEsT0FBQSxLQUFBLFdBQUEsR0FBQTtZQUNBOztVQUVBLE9BQUEsT0FBQSxLQUFBO1VBQ0EsT0FBQSxPQUFBLEtBQUE7VUFDQSxPQUFBLE9BQUEsS0FBQTtVQUNBLE9BQUEsT0FBQSxLQUFBO1VBQ0EsS0FBQSxPQUFBLE9BQUEsTUFBQSxTQUFBLEtBQUEsVUFBQSxRQUFBO1lBQ0EsT0FBQSxZQUFBO1lBQ0EsU0FBQTtZQUNBLFFBQUEsSUFBQSxXQUFBLE1BQUE7YUFDQSxVQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUE7WUFDQSxRQUFBLElBQUEsU0FBQSxNQUFBOztVQUVBLE9BQUEsWUFBQTs7Ozs7QUN4TUEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsT0FBQTtTQUNBLE9BQUE7OztJQUdBLFdBQUEsVUFBQSxDQUFBLHVCQUFBLG9CQUFBLG1CQUFBLFlBQUE7SUFDQSxTQUFBLFdBQUEscUJBQUEsa0JBQUEsaUJBQUEsVUFBQSxjQUFBOztNQUVBLElBQUEsT0FBQSxRQUFBLE9BQUE7O01BRUEsS0FBQSxhQUFBLG9CQUFBO01BQ0EsS0FBQSxhQUFBLGlCQUFBO01BQ0EsS0FBQSxhQUFBLGdCQUFBO01BQ0EsS0FBQSxhQUFBLFNBQUE7TUFDQSxLQUFBLGFBQUEsU0FBQTtNQUNBLEtBQUEsYUFBQSxTQUFBO01BQ0EsS0FBQSxhQUFBLFNBQUE7O01BRUEsY0FBQSxhQUFBLHlDQUFBLFNBQUEsSUFBQSxXQUFBLGNBQUE7UUFDQSxPQUFBO1VBQ0EsZUFBQSxTQUFBLFdBQUE7WUFDQSxJQUFBLFVBQUEsVUFBQSxLQUFBO2NBQ0EsYUFBQTtjQUNBLGFBQUE7Y0FDQSxVQUFBLEtBQUE7O1lBRUEsT0FBQSxHQUFBLE9BQUE7Ozs7OztJQU1BLGVBQUEsVUFBQSxDQUFBLDRCQUFBO0lBQ0EsU0FBQSxlQUFBLDBCQUFBLFNBQUE7TUFDQSx5QkFBQSxXQUFBOzs7Ozs7Ozs7QUNqQ0EsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsU0FBQSxrQkFBQTtVQUNBLHlCQUFBO1VBQ0EsMEJBQUE7VUFDQSwwQkFBQTtVQUNBLDBCQUFBOztTQUVBLFNBQUEsV0FBQTs7Ozs7Ozs7Ozs7O0FDVEEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsT0FBQSxRQUFBOzs7SUFHQSxTQUFBLGFBQUE7UUFDQSxJQUFBLE9BQUE7VUFDQSxPQUFBO1VBQ0EsYUFBQTtVQUNBLFNBQUE7O1FBRUEsT0FBQSxTQUFBLEtBQUE7VUFDQSxPQUFBLEtBQUE7Ozs7O0FDdEJBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLElBQUE7U0FDQSxJQUFBOzs7SUFHQSxPQUFBLFVBQUEsQ0FBQSxjQUFBLFVBQUEsaUJBQUEsV0FBQSxrQkFBQTs7SUFFQSxTQUFBLE9BQUEsWUFBQSxRQUFBLGNBQUEsU0FBQSxnQkFBQSxRQUFBOzs7TUFHQSxXQUFBLFNBQUE7TUFDQSxXQUFBLGVBQUE7TUFDQSxXQUFBLFdBQUEsUUFBQTs7Ozs7Ozs7Ozs7TUFXQSxXQUFBLGNBQUEsT0FBQTs7O01BR0EsV0FBQSxTQUFBLFNBQUEsUUFBQTtRQUNBLE9BQUE7Ozs7Ozs7TUFPQSxXQUFBLElBQUE7UUFDQSxTQUFBLE9BQUEseUNBQUE7WUFDQSxRQUFBLElBQUEsYUFBQTtZQUNBLFFBQUEsSUFBQSxhQUFBO1lBQ0EsUUFBQSxJQUFBLGFBQUE7OztNQUdBLFdBQUEsSUFBQTtRQUNBLFNBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxZQUFBLE1BQUE7VUFDQSxRQUFBLElBQUE7OztNQUdBLFdBQUEsSUFBQTtRQUNBLDhEQUFBOztVQUVBLFFBQUEsU0FBQSxHQUFBOztVQUVBLFdBQUEsWUFBQSxPQUFBLFFBQUE7Ozs7TUFJQSxXQUFBLFlBQUEsT0FBQSxRQUFBO01BQ0EsV0FBQSxZQUFBLFdBQUE7UUFDQSxJQUFBLFFBQUEsV0FBQSxJQUFBLE9BQUEsU0FBQSxXQUFBLGFBQUEsV0FBQSxJQUFBO1FBQ0EsU0FBQSxRQUFBO1FBQ0EsT0FBQTs7Ozs7SUFLQSxlQUFBLFVBQUEsQ0FBQSxjQUFBLFFBQUE7O0lBRUEsU0FBQSxlQUFBLFlBQUEsTUFBQSxTQUFBOztNQUVBOztNQUVBLFNBQUEsaUJBQUE7UUFDQSxHQUFBLEtBQUEsbUJBQUE7VUFDQSxLQUFBLFNBQUEsQ0FBQSxJQUFBLEtBQUEsZ0JBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxRQUFBO1dBQ0EsU0FBQSxLQUFBLFVBQUEsTUFBQTtZQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTtZQUNBLFdBQUEsT0FBQTs7Ozs7TUFLQSxXQUFBLElBQUEsZ0JBQUE7Ozs7OztBQ3RGQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLG9CQUFBLFVBQUEsQ0FBQSxVQUFBLGFBQUEsWUFBQSxXQUFBLFFBQUE7SUFDQSxTQUFBLG9CQUFBLFFBQUEsV0FBQSxVQUFBLFNBQUEsTUFBQSxTQUFBO1FBQ0Es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QUlBLEtBQUEsU0FBQSxTQUFBLE1BQUE7WUFDQSxPQUFBLENBQUEsQ0FBQSxLQUFBLE1BQUE7OztVQUdBLEtBQUEsV0FBQSxXQUFBO1lBQ0EsSUFBQSxJQUFBLEtBQUEsS0FBQSxNQUFBO2NBQ0EsS0FBQSxNQUFBLEtBQUE7Ozs7VUFJQSxLQUFBLGNBQUEsU0FBQSxHQUFBO1lBQ0EsS0FBQSxRQUFBO1lBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQTs7Ozs7Ozs7Ozs7Ozs7QUNsRUEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxVQUFBOztJQUVBLFNBQUEsVUFBQTtRQUNBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBOztRQUVBLE9BQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsU0FBQTtVQUNBLElBQUEsUUFBQSxFQUFBO1VBQ0EsR0FBQSxFQUFBLEdBQUE7WUFDQSxNQUFBOzs7Ozs7Ozs7Ozs7O0FDZkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsT0FBQSxlQUFBOztJQUVBLFNBQUEsY0FBQTtRQUNBLE9BQUE7OztRQUdBLFNBQUEsYUFBQSxPQUFBLE9BQUE7VUFDQSxJQUFBLE1BQUE7O1VBRUEsSUFBQSxRQUFBLFFBQUEsUUFBQTtZQUNBLE1BQUEsUUFBQSxTQUFBLE1BQUE7Y0FDQSxJQUFBLGNBQUE7O2NBRUEsSUFBQSxPQUFBLE9BQUEsS0FBQTtjQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUEsS0FBQTtnQkFDQSxJQUFBLE9BQUEsS0FBQTtnQkFDQSxJQUFBLE9BQUEsTUFBQSxNQUFBO2dCQUNBLElBQUEsS0FBQSxNQUFBLFdBQUEsY0FBQSxRQUFBLFVBQUEsQ0FBQSxHQUFBO2tCQUNBLGNBQUE7a0JBQ0E7Ozs7Y0FJQSxJQUFBLGFBQUE7Z0JBQ0EsSUFBQSxLQUFBOzs7aUJBR0E7O1lBRUEsTUFBQTs7O1VBR0EsT0FBQTs7Ozs7Ozs7OztBQ3ZDQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGFBQUE7O0lBRUEsVUFBQSxVQUFBLENBQUE7SUFDQSxTQUFBLFdBQUEsVUFBQTtRQUNBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxTQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQSxTQUFBO1VBQ0EsUUFBQSxHQUFBLHlCQUFBLFVBQUE7OztZQUdBLEdBQUEsUUFBQSxjQUFBLFFBQUEsV0FBQSxPQUFBO2NBQ0EsUUFBQSxlQUFBLFFBQUEsV0FBQSxNQUFBO2NBQ0EsUUFBQTs7OztVQUlBLFNBQUEsVUFBQTtZQUNBLFFBQUE7Ozs7Ozs7Ozs7OztBQzNCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGdCQUFBOztJQUVBLFNBQUEsZ0JBQUE7UUFDQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUE7VUFDQSxJQUFBLFFBQUEsRUFBQTtVQUNBLEdBQUEsRUFBQSxHQUFBO1lBQ0EsTUFBQTs7Ozs7O0FDdEJBLENBQUEsV0FBQTtJQUNBOztJQUVBO09BQ0EsT0FBQSxhQUFBO09BQ0EsV0FBQSxtQkFBQTtPQUNBLFdBQUEseUJBQUE7T0FDQSxXQUFBLG9CQUFBO09BQ0EsV0FBQSxxQkFBQTs7SUFFQSxnQkFBQSxVQUFBLENBQUEsVUFBQSxpQkFBQSxPQUFBLFlBQUEsY0FBQTtJQUNBLFNBQUEsZ0JBQUEsUUFBQSxlQUFBLEtBQUEsVUFBQSxZQUFBLGtCQUFBO01BQ0EsSUFBQSxLQUFBOztNQUVBOztNQUVBLFNBQUEsV0FBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsY0FBQSxJQUFBLGNBQUEsQ0FBQSxPQUFBLEtBQUE7VUFDQSxTQUFBLFNBQUEsUUFBQSxRQUFBO1lBQ0EsSUFBQSxTQUFBO2NBQ0EsTUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBO2NBQ0EsUUFBQTtnQkFDQTtrQkFDQSxTQUFBO2tCQUNBLE1BQUEsRUFBQSxPQUFBLENBQUEsUUFBQSxPQUFBLEtBQUEsS0FBQTs7OztZQUlBLEdBQUEsR0FBQSxXQUFBLElBQUE7Y0FDQSxJQUFBLEtBQUEsQ0FBQSxPQUFBO2NBQ0EsT0FBQSxNQUFBLEtBQUEsQ0FBQSxDQUFBLFlBQUEsS0FBQSxDQUFBLE1BQUE7Y0FDQSxPQUFBLEtBQUE7O1lBRUEsaUJBQUEsUUFBQSxRQUFBLFFBQUEsS0FBQTs7Ozs7TUFLQSxHQUFBLFFBQUEsVUFBQSxLQUFBLE1BQUE7UUFDQSxTQUFBLEtBQUE7VUFDQSxVQUFBO1VBQ0EsWUFBQTtVQUNBLE1BQUEsQ0FBQSxLQUFBLEtBQUEsTUFBQTs7OztNQUlBLEdBQUEsU0FBQSxVQUFBLEtBQUE7UUFDQSxXQUFBLEtBQUE7VUFDQSxPQUFBLFNBQUEsSUFBQSxLQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxrQkFBQTtVQUNBLG9CQUFBO1VBQ0EsbUJBQUE7VUFDQSxrQkFBQTtVQUNBLGdCQUFBO1lBQ0EsU0FBQSxVQUFBO1VBQ0EsR0FBQSxXQUFBO1lBQ0EsSUFBQSxTQUFBO1lBQ0EsSUFBQSxNQUFBLFlBQUE7Y0FDQSxXQUFBLEtBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLFNBQUE7ZUFDQSxVQUFBLEtBQUE7Y0FDQSxXQUFBLEtBQUEsT0FBQSx3QkFBQTs7Ozs7O01BTUEsR0FBQSxVQUFBLFVBQUEsS0FBQTtRQUNBLElBQUEsTUFBQTtRQUNBLElBQUEsWUFBQSxJQUFBLFlBQUE7UUFDQSxHQUFBLFdBQUE7VUFDQSxNQUFBLFVBQUE7O1FBRUEsSUFBQSxPQUFBLE9BQUEsQ0FBQSxJQUFBLElBQUEsS0FBQSxDQUFBLE1BQUEsYUFBQSxLQUFBLE1BQUEsU0FBQSxLQUFBLFVBQUEsTUFBQTtVQUNBLEdBQUEsWUFBQTtVQUNBLFdBQUEsS0FBQSxRQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsV0FBQTs7Ozs7O0lBTUEsa0JBQUEsVUFBQSxDQUFBLFVBQUE7SUFDQSxTQUFBLGtCQUFBLFFBQUEsTUFBQTtNQUNBOztNQUVBLE9BQUEsaUJBQUEsVUFBQTs7TUFFQSxTQUFBLFdBQUE7UUFDQSxPQUFBLFNBQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUEsQ0FBQSxDQUFBLFNBQUEsT0FBQSxPQUFBLFFBQUEsT0FBQSxRQUFBLFNBQUE7Ozs7TUFJQSxPQUFBLE9BQUEsWUFBQTtRQUNBLEtBQUEsT0FBQSxPQUFBLFFBQUE7U0FDQSxLQUFBLFVBQUEsTUFBQTtVQUNBLE9BQUEsT0FBQSxHQUFBOzs7O01BSUEsT0FBQSxjQUFBLFlBQUE7UUFDQSxLQUFBLE9BQUEsT0FBQTs7OztJQUlBLHNCQUFBLFVBQUEsQ0FBQSxVQUFBLFlBQUEsU0FBQSxXQUFBO0lBQ0EsU0FBQSxzQkFBQSxRQUFBLFVBQUEsT0FBQSxTQUFBLFNBQUE7O1FBRUE7Ozs7UUFJQSxTQUFBLFdBQUE7VUFDQSxPQUFBLFdBQUE7OztRQUdBLE9BQUEsVUFBQSxZQUFBO1VBQ0EsSUFBQSxNQUFBLE9BQUEsYUFBQTtVQUNBLElBQUEsT0FBQSxPQUFBLGFBQUE7VUFDQSxJQUFBLE9BQUEsT0FBQSxhQUFBO1VBQ0EsTUFBQSxPQUFBLENBQUEsT0FBQSxJQUFBLElBQUEsS0FBQSxPQUFBLFVBQUEsTUFBQSxNQUFBLE1BQUE7VUFDQSxHQUFBLENBQUEsSUFBQSxZQUFBLElBQUE7WUFDQSxJQUFBLFlBQUEsS0FBQSxDQUFBLEtBQUEsR0FBQSxVQUFBLElBQUE7O1VBRUEsSUFBQSxZQUFBLEdBQUEsT0FBQSxPQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUEsSUFBQSxXQUFBO1dBQ0EsS0FBQSxRQUFBLGNBQUEsTUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUEsU0FBQTs7OztJQUlBLGlCQUFBLFVBQUEsQ0FBQSxVQUFBLFNBQUE7SUFDQSxTQUFBLGlCQUFBLFFBQUEsT0FBQSxlQUFBO01BQ0EsSUFBQSxLQUFBOztNQUVBOztNQUVBLFNBQUEsU0FBQTtRQUNBLEdBQUEsU0FBQSxDQUFBLE1BQUE7UUFDQSxHQUFBLGNBQUEsSUFBQSxjQUFBO1VBQ0EsT0FBQTtVQUNBLFFBQUEsR0FBQSxPQUFBO1dBQ0E7VUFDQSxTQUFBLFNBQUEsUUFBQSxRQUFBO1lBQ0EsSUFBQSxNQUFBLENBQUEsTUFBQSxJQUFBLFFBQUEsQ0FBQTtZQUNBLElBQUEsUUFBQSxPQUFBO1lBQ0EsSUFBQSxPQUFBLENBQUEsT0FBQSxPQUFBLEdBQUEsSUFBQTtZQUNBLEdBQUEsR0FBQSxPQUFBLFFBQUEsSUFBQTtjQUNBLElBQUEsT0FBQTs7WUFFQSxNQUFBLE1BQUEsQ0FBQSxPQUFBLElBQUEsUUFBQSxVQUFBLFFBQUE7Y0FDQSxHQUFBLFlBQUEsTUFBQSxPQUFBO2NBQ0EsTUFBQSxLQUFBLENBQUEsT0FBQSxNQUFBLE9BQUE7Ozs7Ozs7Ozs7Ozs7OztBQ3JKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxPQUFBLGFBQUE7U0FDQSxPQUFBLGNBQUE7U0FDQSxPQUFBLGdCQUFBOzs7SUFHQSxTQUFBLGlCQUFBO1FBQ0EsSUFBQSxPQUFBO1VBQ0EsUUFBQTtVQUNBLFNBQUE7O1FBRUEsT0FBQSxTQUFBLEtBQUE7VUFDQSxPQUFBLEtBQUE7Ozs7SUFJQSxTQUFBLG9CQUFBO01BQ0EsT0FBQSxVQUFBLEtBQUE7UUFDQSxPQUFBLEtBQUEsSUFBQTs7OztJQUlBLFNBQUEsa0JBQUE7TUFDQSxJQUFBLE9BQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLFFBQUE7UUFDQSxXQUFBO1FBQ0EsVUFBQTs7TUFFQSxPQUFBLFVBQUEsS0FBQTtRQUNBLE1BQUEsT0FBQTtRQUNBLE9BQUEsS0FBQTs7Ozs7QUMzQ0EsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsT0FBQTs7SUFFQSxlQUFBLFVBQUEsQ0FBQSx1QkFBQTtJQUNBLFNBQUEsZUFBQSxxQkFBQSxhQUFBOzs7TUFHQSxvQkFBQSxPQUFBO1FBQ0EsT0FBQTtRQUNBLFFBQUE7UUFDQSxTQUFBLGFBQUE7Ozs7O0FDZEEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsU0FBQSxnQkFBQTs7VUFFQSxTQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7WUFDQSxzQkFBQSxDQUFBO21DQUNBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO21DQUNBO21DQUNBO21DQUNBO21DQUNBO21DQUNBOztZQUVBLHNCQUFBLENBQUE7bUNBQ0E7O1lBRUEsc0JBQUEsQ0FBQTttQ0FDQTttQ0FDQTttQ0FDQTttQ0FDQTttQ0FDQTttQ0FDQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7O1lBRUEsd0JBQUEsQ0FBQTtxQ0FDQTtxQ0FDQTtxQ0FDQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTttQ0FDQTttQ0FDQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7bUNBQ0E7WUFDQSx3QkFBQSxDQUFBO1lBQ0Esd0JBQUEsQ0FBQTs7O1VBR0EsU0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7dURBQ0E7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3VEQUNBO3VEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt1REFDQTt1REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7d0RBQ0E7d0RBQ0E7d0RBQ0E7d0RBQ0E7d0RBQ0E7d0RBQ0E7d0RBQ0E7d0RBQ0E7MkRBQ0EsT0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7d0RBQ0E7d0RBQ0Esd0NBQUEsT0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7d0RBQ0Esd0RBQUEsT0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO3dEQUNBLHlEQUFBLE9BQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTt3REFDQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7WUFDQSxDQUFB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UUFBQSxlQUFBLGtCQUFBLFlBQUEsYUFBQSxVQUFBO01BQ0EsSUFBQSxLQUFBO01BQ0EsSUFBQSxXQUFBLE9BQUEsT0FBQSxPQUFBOztNQUVBLEdBQUEsa0JBQUEsSUFBQSxjQUFBO1FBQ0EsT0FBQTtTQUNBO1FBQ0EsU0FBQSxTQUFBLFFBQUEsUUFBQTtVQUNBLElBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQTtVQUNBLElBQUEsUUFBQSxPQUFBO1VBQ0EsSUFBQSxPQUFBLENBQUEsT0FBQSxPQUFBLEdBQUEsSUFBQTtVQUNBLE9BQUEsTUFBQSxNQUFBLENBQUEsSUFBQSxVQUFBLE9BQUEsSUFBQSxRQUFBLFVBQUEsUUFBQTtZQUNBLEdBQUEsZ0JBQUEsTUFBQSxPQUFBOztVQUVBLE9BQUEsTUFBQSxDQUFBLElBQUEsVUFBQSxPQUFBLE1BQUEsT0FBQTs7OztNQUlBLEdBQUEscUJBQUEsSUFBQSxjQUFBO1FBQ0EsT0FBQTtTQUNBO1FBQ0EsU0FBQSxTQUFBLFFBQUEsUUFBQTtVQUNBLElBQUEsTUFBQTtZQUNBLE1BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxZQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsWUFBQSxDQUFBLFVBQUE7WUFDQSxTQUFBLENBQUE7O1VBRUEsSUFBQSxRQUFBLE9BQUE7VUFDQSxJQUFBLE9BQUEsQ0FBQSxPQUFBLE9BQUEsR0FBQSxJQUFBO1VBQ0EsT0FBQSxTQUFBLE1BQUEsQ0FBQSxJQUFBLFVBQUEsT0FBQSxJQUFBLFFBQUEsVUFBQSxRQUFBO1lBQ0EsR0FBQSxtQkFBQSxNQUFBLE9BQUE7O1VBRUEsT0FBQSxTQUFBLENBQUEsSUFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBOzs7O01BSUEsR0FBQSxtQkFBQSxJQUFBLGNBQUE7UUFDQSxPQUFBO1NBQ0E7UUFDQSxTQUFBLFNBQUEsUUFBQSxRQUFBO1VBQ0EsSUFBQSxNQUFBO1lBQ0EsTUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBO1lBQ0EsU0FBQTs7VUFFQSxJQUFBLFFBQUEsT0FBQTtVQUNBLElBQUEsT0FBQSxDQUFBLE9BQUEsT0FBQSxHQUFBLElBQUE7VUFDQSxPQUFBLFFBQUEsTUFBQSxDQUFBLElBQUEsVUFBQSxPQUFBLElBQUEsUUFBQSxVQUFBLFFBQUE7WUFDQSxHQUFBLGlCQUFBLE1BQUEsT0FBQTs7VUFFQSxPQUFBLFFBQUEsQ0FBQSxJQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUE7Ozs7TUFJQTs7TUFFQSxTQUFBLFdBQUE7O1FBRUEsV0FBQSxPQUFBLE9BQUEsT0FBQTs7UUFFQSxHQUFBLFNBQUEsT0FBQSxRQUFBLENBQUEsUUFBQTtVQUNBLE9BQUEsQ0FBQSxJQUFBO1VBQ0EsUUFBQSxDQUFBOzs7UUFHQSxHQUFBLGdCQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsaUJBQUE7OztNQUdBLEdBQUEsT0FBQSxZQUFBO1FBQ0EsWUFBQSxTQUFBLEdBQUE7UUFDQSxPQUFBLE9BQUEsR0FBQTs7O01BR0EsR0FBQSxXQUFBLFlBQUE7UUFDQSxTQUFBLEtBQUE7VUFDQSxVQUFBO1VBQ0EsWUFBQTtXQUNBLGFBQUEsS0FBQSxVQUFBLE1BQUE7VUFDQTs7OztNQUlBLEdBQUEsV0FBQSxZQUFBO1FBQ0EsU0FBQSxLQUFBO1VBQ0EsVUFBQTtVQUNBLFlBQUE7V0FDQSxhQUFBLEtBQUEsVUFBQSxNQUFBO1VBQ0E7Ozs7O0lBS0EseUJBQUEsVUFBQSxDQUFBLFVBQUEsWUFBQSxVQUFBLFdBQUE7SUFDQSxTQUFBLHlCQUFBLFFBQUEsVUFBQSxRQUFBLFNBQUEsYUFBQTs7UUFFQTs7OztRQUlBLElBQUEsV0FBQSxPQUFBLE9BQUEsT0FBQTtRQUNBLFNBQUEsV0FBQTtVQUNBLFdBQUEsT0FBQSxPQUFBLE9BQUE7VUFDQSxPQUFBLFNBQUEsT0FBQSxTQUFBLENBQUEsR0FBQTtVQUNBLE9BQUEsT0FBQTtZQUNBLE1BQUE7WUFDQSxRQUFBO1lBQ0EsVUFBQTs7VUFFQSxPQUFBLFVBQUEsWUFBQTtVQUNBLE9BQUEsT0FBQTtZQUNBLE1BQUE7WUFDQSxRQUFBOzs7O1FBSUEsT0FBQSxrQkFBQSxZQUFBO1VBQ0EsR0FBQSxLQUFBLFNBQUEsUUFBQTtZQUNBLE9BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxTQUFBO1lBQ0EsT0FBQSxLQUFBLFVBQUEsT0FBQSxLQUFBO1lBQ0EsT0FBQTtpQkFDQTtZQUNBLE9BQUEsS0FBQSxPQUFBOzs7O1FBSUEsT0FBQSxjQUFBLFlBQUE7VUFDQSxPQUFBLEtBQUEsUUFBQSxPQUFBLEtBQUE7VUFDQSxPQUFBLEtBQUEsU0FBQSxPQUFBLEtBQUEsU0FBQSxPQUFBLEtBQUE7OztRQUdBLE9BQUEsVUFBQSxZQUFBO1VBQ0EsR0FBQSxPQUFBLEtBQUEsV0FBQSxHQUFBO1lBQ0E7O1VBRUEsT0FBQSxTQUFBLE9BQUEsQ0FBQSxJQUFBLFdBQUEsT0FBQSxNQUFBLFNBQUEsS0FBQSxVQUFBLFFBQUE7WUFDQSxPQUFBLFlBQUE7WUFDQSxTQUFBO1lBQ0EsUUFBQSxJQUFBLFdBQUEsTUFBQTthQUNBLFVBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQTtZQUNBLFFBQUEsSUFBQSxTQUFBLE1BQUE7O1VBRUEsT0FBQSxZQUFBOzs7OztJQUtBLHNCQUFBLFVBQUEsQ0FBQSxVQUFBLFlBQUEsVUFBQTtJQUNBLFNBQUEsc0JBQUEsUUFBQSxVQUFBLFFBQUEsU0FBQTs7UUFFQTs7OztRQUlBLElBQUEsV0FBQSxPQUFBLE9BQUEsT0FBQTtRQUNBLFNBQUEsV0FBQTtVQUNBLFdBQUEsT0FBQSxPQUFBLE9BQUE7VUFDQSxPQUFBLFNBQUEsT0FBQSxTQUFBLENBQUEsR0FBQTtVQUNBLE9BQUEsT0FBQTtZQUNBLFFBQUE7WUFDQSxNQUFBOzs7O1FBSUEsT0FBQSxVQUFBLFlBQUE7VUFDQSxHQUFBLE9BQUEsS0FBQSxXQUFBLEdBQUE7WUFDQTtpQkFDQSxHQUFBLE9BQUEsS0FBQSxTQUFBLEdBQUE7WUFDQSxPQUFBLEtBQUEsT0FBQTtpQkFDQSxHQUFBLE9BQUEsS0FBQSxTQUFBLEdBQUE7WUFDQSxPQUFBLEtBQUEsT0FBQTs7VUFFQSxPQUFBLFFBQUEsT0FBQSxDQUFBLElBQUEsV0FBQSxPQUFB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LFFBQUEsUUFBQTtVQUNBLElBQUEsTUFBQSxDQUFBLE9BQUE7VUFDQSxJQUFBLFFBQUEsT0FBQTtVQUNBLElBQUEsT0FBQSxDQUFBLE9BQUEsT0FBQSxHQUFBLElBQUE7VUFDQSxJQUFBLFFBQUE7VUFDQSxHQUFBLE9BQUEsT0FBQSxRQUFBLElBQUE7WUFDQSxRQUFBLElBQUEsT0FBQSxPQUFBOztZQUVBLElBQUEsS0FBQSxDQUFBLE9BQUEsT0FBQSxPQUFBO1lBQ0EsSUFBQSxNQUFBLEtBQUEsQ0FBQSxDQUFBLFNBQUEsS0FBQSxDQUFBLE9BQUE7WUFDQSxJQUFBLE9BQUE7O1VBRUEsSUFBQSxNQUFBLENBQUEsT0FBQSxJQUFBLFFBQUEsVUFBQSxRQUFBO1lBQ0EsT0FBQSxZQUFBLE1BQUEsT0FBQTtZQUNBLElBQUEsS0FBQSxDQUFBLE9BQUEsTUFBQSxPQUFBOzs7Ozs7SUFNQSxrQkFBQSxVQUFBLENBQUEsVUFBQTtJQUNBLFNBQUEsa0JBQUEsUUFBQSxNQUFBO01BQ0E7O01BRUEsT0FBQSxpQkFBQSxVQUFBOztNQUVBLFNBQUEsV0FBQTtRQUNBLE9BQUEsU0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQSxDQUFBLENBQUEsUUFBQSxPQUFBLE9BQUEsTUFBQSxPQUFBOzs7O01BSUEsT0FBQSxPQUFBLFlBQUE7Ozs7TUFJQSxPQUFBLGNBQUEsWUFBQTs7Ozs7Ozs7Ozs7QUNyR0EsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsT0FBQSxjQUFBOztJQUVBLFNBQUEsa0JBQUE7UUFDQSxJQUFBLE9BQUE7VUFDQSxRQUFBO1VBQ0EsU0FBQTs7UUFFQSxPQUFBLFNBQUEsS0FBQTtVQUNBLE9BQUEsS0FBQTs7Ozs7Ozs7O0FDaEJBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7O0lBRUEsZUFBQSxVQUFBLENBQUEsVUFBQTtJQUNBLFNBQUEsZUFBQSxRQUFBLFVBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUE7Ozs7UUFJQSxTQUFBLFdBQUE7VUFDQSxHQUFBLFVBQUE7O1VBRUEsR0FBQSxZQUFBO1VBQ0EsR0FBQSxhQUFBO1lBQ0EsUUFBQTtZQUNBLEtBQUE7Ozs7VUFJQSxTQUFBLFVBQUE7O1lBRUEsT0FBQTtnQkFDQTtnQkFDQSxDQUFBLFFBQUE7OzthQUdBOzs7Ozs7Ozs7O0FDL0JBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsVUFBQTs7SUFFQSxPQUFBLFVBQUEsQ0FBQSxXQUFBO0lBQ0EsU0FBQSxRQUFBLFNBQUEsUUFBQTs7UUFFQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTtZQUNBLE9BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQTs7O1FBR0EsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBOztVQUVBLFFBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQTtZQUNBLEVBQUE7WUFDQSxPQUFBLE1BQUEsTUFBQSxTQUFBLE1BQUE7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCQSxDQUFBLFdBQUE7SUFDQTtJQUNBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsVUFBQTs7SUFFQSxPQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEsT0FBQSxVQUFBOztRQUVBLEtBQUEsUUFBQTs7OztRQUlBLFNBQUEsWUFBQSxLQUFBLE1BQUE7WUFDQSxLQUFBLE1BQUE7Z0JBQ0EsU0FBQSxVQUFBO29CQUNBLEVBQUEsT0FBQSxLQUFBLFFBQUE7Ozs7Ozs7Ozs7Ozs7QUFhQSxDQUFBLFNBQUEsRUFBQTtJQUNBO0lBQ0EsSUFBQSxhQUFBO1FBQ0EsYUFBQTtRQUNBLGNBQUEsU0FBQSxRQUFBO1lBQ0EsSUFBQSxFQUFBLEtBQUEsYUFBQSxVQUFBO2dCQUNBLFVBQUEsRUFBQSxTQUFBOztZQUVBLElBQUEsVUFBQSxJQUFBO2dCQUNBLFVBQUEsRUFBQSxPQUFBLFNBQUEsRUFBQSxLQUFBLFVBQUEsUUFBQSxXQUFBLENBQUEsT0FBQSxVQUFBLE1BQUEsVUFBQTs7WUFFQSxPQUFBLENBQUEsSUFBQSxRQUFBLFVBQUE7O1FBRUEsWUFBQSxTQUFBLE9BQUEsVUFBQTtZQUNBLElBQUE7WUFDQSxHQUFBLE9BQUE7Z0JBQ0EsSUFBQSxNQUFBLFVBQUEsRUFBQSxHQUFBLFFBQUEsU0FBQSxJQUFBLE9BQUEsU0FBQSxJQUFBLE1BQUE7bUJBQ0E7Z0JBQ0EsSUFBQSxNQUFBLFVBQUEsRUFBQSxTQUFBLElBQUEsTUFBQTs7O0lBR0EsSUFBQSxVQUFBLFNBQUEsUUFBQTs7UUFFQSxLQUFBLFVBQUEsRUFBQSxPQUFBLElBQUEsUUFBQSxVQUFBO1FBQ0EsS0FBQSxVQUFBLE1BQUEsSUFBQSxPQUFBLFdBQUEsUUFBQSxLQUFBLEtBQUEsS0FBQSxXQUFBO1FBQ0EsS0FBQSxVQUFBLEVBQUE7O1lBRUE7Z0JBQ0E7Z0JBQ0EsUUFBQSxLQUFBLFFBQUEsUUFBQTtZQUNBO1VBQ0EsS0FBQSxLQUFBLEtBQUEsaUJBQUE7O1FBRUEsSUFBQSxLQUFBLFFBQUEsUUFBQTtZQUNBLEtBQUEsUUFBQSxTQUFBLGVBQUEsS0FBQSxRQUFBO1lBQ0EsS0FBQSxnQkFBQSxLQUFBLFFBQUE7O1FBRUEsS0FBQSxRQUFBLEtBQUEsUUFBQTtRQUNBLFNBQUEsS0FBQSxRQUFBO1FBQ0EsR0FBQSxDQUFBLFdBQUEsS0FBQSxRQUFBLE1BQUE7WUFDQSxXQUFBLEtBQUEsUUFBQSxPQUFBLEVBQUEsbUNBQUEsS0FBQSxRQUFBLElBQUEsWUFBQSxTQUFBLFFBQUEsR0FBQSxTQUFBLHNCQUFBLFVBQUE7Z0JBQ0EsRUFBQSxNQUFBLEtBQUEsaUJBQUE7Ozs7SUFJQSxFQUFBLE9BQUEsUUFBQSxXQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7UUFDQSxRQUFBO1FBQ0EsZUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBLFdBQUE7WUFDQSxJQUFBLEtBQUEsUUFBQSxHQUFBLGFBQUE7WUFDQSxJQUFBLFFBQUE7WUFDQSxXQUFBLEtBQUEsUUFBQSxLQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxlQUFBLFNBQUEsS0FBQSxRQUFBLElBQUEsa0JBQUE7WUFDQSxLQUFBLFFBQUEsSUFBQSxDQUFBLFVBQUEsR0FBQSxjQUFBLENBQUEsRUFBQSxLQUFBLFFBQUEsZUFBQSxnQkFBQSxJQUFBLFFBQUEsQ0FBQSxVQUFBLEdBQUEsY0FBQSxHQUFBLGdCQUFBLGVBQUEsVUFBQTtnQkFDQSxJQUFBLE1BQUEsUUFBQSxTQUFBO29CQUNBLElBQUEsVUFBQSxVQUFBLEVBQUEsTUFBQTtvQkFDQSxNQUFBLFVBQUEsV0FBQSxTQUFBLE1BQUEsUUFBQTtvQkFDQSxNQUFBLFFBQUE7d0JBQ0EsV0FBQSxFQUFBLGFBQUEsTUFBQTt3QkFDQSxXQUFBLEVBQUEsTUFBQSxVQUFBLFdBQUEsU0FBQSxNQUFBLFFBQUE7Ozs7WUFJQSxPQUFBOztRQUVBLE9BQUEsU0FBQSxXQUFBO1lBQ0EsSUFBQSxXQUFBO2dCQUNBLFdBQUEsVUFBQTtvQkFDQSxNQUFBLFFBQUE7b0JBQ0EsR0FBQSxDQUFBLFdBQUEsTUFBQSxRQUFBLEtBQUEsV0FBQSxRQUFBO3dCQUNBLFdBQUEsTUFBQSxRQUFBLEtBQUE7O29CQUVBLE9BQUEsU0FBQSxNQUFBOztZQUVBLEdBQUEsS0FBQSxTQUFBLGFBQUEsS0FBQTtZQUNBLEdBQUEsV0FBQTtnQkFDQTttQkFDQTtnQkFDQSxLQUFBLFFBQUEsUUFBQSxDQUFBLFVBQUEsR0FBQSxjQUFBLENBQUEsR0FBQSxLQUFBLFFBQUEsZUFBQSxnQkFBQSxJQUFBLFVBQUE7b0JBQ0E7Ozs7UUFJQSxTQUFBLFNBQUEsS0FBQTtZQUNBLElBQUEsWUFBQSxLQUFBLFFBQUEsS0FBQTtZQUNBLEdBQUEsQ0FBQSxNQUFBO2dCQUNBLE9BQUEsVUFBQTs7WUFFQSxVQUFBLEtBQUE7WUFDQSxPQUFBOztRQUVBLFFBQUEsU0FBQSxRQUFBO1lBQ0EsR0FBQSxDQUFBLFFBQUE7Z0JBQ0EsT0FBQSxLQUFBOztZQUVBLEtBQUEsUUFBQSxZQUFBLGVBQUEsS0FBQSxlQUFBLFNBQUEsZUFBQTtZQUNBLEtBQUEsZ0JBQUE7WUFDQSxPQUFBOzs7SUFHQSxRQUFBLFdBQUE7UUFDQSxTQUFBO1FBQ0EsUUFBQTtRQUNBLFNBQUE7UUFDQSxPQUFBO1FBQ0EsS0FBQTs7O0lB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QUFBLE9BQUE7Ozs7O01BS0EsU0FBQSxlQUFBLElBQUEsT0FBQTtRQUNBLEdBQUEsQ0FBQSxJQUFBLE9BQUE7UUFDQSxJQUFBLE9BQUEsUUFBQSxTQUFBLGNBQUE7UUFDQSxHQUFBLENBQUEsTUFBQSxFQUFBLE9BQUE7UUFDQSxLQUFBLE1BQUE7UUFDQSxjQUFBLGtCQUFBLFFBQUEsT0FBQTs7TUFFQSxTQUFBLGVBQUEsSUFBQTtRQUNBLEdBQUEsQ0FBQSxJQUFBLE9BQUE7UUFDQSxJQUFBLE9BQUEsUUFBQSxTQUFBLGNBQUE7UUFDQSxHQUFBLE1BQUE7VUFDQSxPQUFBLEtBQUE7Ozs7Ozs7Ozs7O0FDbkRBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsZ0JBQUE7O0lBRUEsU0FBQSxnQkFBQTs7UUFFQSxJQUFBLFlBQUE7WUFDQSxZQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOzs7O0lBSUEsV0FBQSxVQUFBLENBQUEsVUFBQSxZQUFBLE1BQUE7SUFDQSxTQUFBLFlBQUEsUUFBQSxVQUFBLElBQUEsT0FBQTtNQUNBLElBQUEsZ0JBQUE7VUFDQSxnQkFBQTs7TUFFQSxTQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUE7UUFDQSxFQUFBOzs7UUFHQSxJQUFBLFNBQUEsRUFBQSxNQUFBLFFBQUE7O1FBRUE7O1FBRUEsU0FBQSxnQkFBQTtVQUNBLElBQUEsV0FBQSxHQUFBO1VBQ0EsSUFBQSxVQUFBLFNBQUE7OztVQUdBLE9BQUEsTUFBQSxhQUFBLE9BQUEsS0FBQSxPQUFBO1VBQ0EsUUFBQSxLQUFBOzs7O1FBSUEsU0FBQSxvQkFBQTtVQUNBLEdBQUEsTUFBQSxRQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsQ0FBQSxXQUFBLGNBQUE7O2VBRUE7OztRQUdBLFNBQUEsZUFBQTs7VUFFQSxJQUFBLE1BQUEsT0FBQTtVQUNBLE9BQUE7O1VBRUE7YUFDQSxPQUFBLFdBQUE7WUFDQSxJQUFBLEtBQUEsRUFBQTtZQUNBLFFBQUEsR0FBQSxHQUFBLHFDQUFBLEdBQUEsU0FBQSxLQUFBLFdBQUE7YUFDQTs7O1VBR0EsT0FBQSxNQUFBLGNBQUEsT0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUMxREEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxnQkFBQTs7SUFFQSxTQUFBLGdCQUFBO1FBQ0EsSUFBQSxZQUFBO1lBQ0EsWUFBQTtZQUNBLFVBQUE7WUFDQSxPQUFBOztRQUVBLE9BQUE7Ozs7SUFJQSxXQUFBLFVBQUEsQ0FBQSxVQUFBO0lBQ0EsU0FBQSxZQUFBLFFBQUEsVUFBQTtNQUNBLElBQUEsaUJBQUE7VUFDQSxpQkFBQTtVQUNBLGlCQUFBOzs7TUFHQSxTQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUE7UUFDQSxFQUFBOztRQUVBLElBQUEsVUFBQSxFQUFBO1lBQ0EsVUFBQSxNQUFBLFFBQUEsVUFBQSxHQUFBO1lBQ0EsVUFBQSxNQUFBLEtBQUEsY0FBQTs7OztRQUlBLE1BQUEsU0FBQSxhQUFBLE1BQUE7OztRQUdBLE9BQUEsTUFBQSxjQUFBLE1BQUEsS0FBQTs7Ozs7TUFLQSxPQUFBLElBQUEsaUJBQUE7OztNQUdBLFNBQUEsZUFBQSxJQUFBLElBQUE7UUFDQSxJQUFBLENBQUEsSUFBQTtRQUNBLElBQUEsUUFBQSxHQUFBLE9BQUEsT0FBQSxNQUFBLE1BQUEsSUFBQTtRQUNBO1dBQ0EsUUFBQTtXQUNBLFlBQUE7Ozs7Ozs7Ozs7Ozs7O0FDL0NBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsYUFBQTs7SUFFQSxVQUFBLFVBQUEsQ0FBQSxZQUFBO0lBQ0EsU0FBQSxXQUFBLFVBQUEsVUFBQTtRQUNBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBO1lBQ0EsT0FBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTs7VUFFQSxJQUFBLFlBQUE7O1lBRUEsU0FBQTs7OztZQUlBLFNBQUE7OztZQUdBLFNBQUE7Ozs7O1VBS0EsSUFBQSxRQUFBLE1BQUEsY0FBQTs7VUFFQSxTQUFBLFdBQUE7WUFDQSxRQUFBLEtBQUEsWUFBQSxTQUFBLFNBQUE7WUFDQSxTQUFBLFFBQUEsWUFBQTs7WUFFQSxRQUFBLFNBQUE7OztVQUdBLFNBQUEsYUFBQSxNQUFBLE9BQUE7WUFDQSxJQUFBLE9BQUE7WUFDQSxRQUFBLFNBQUE7WUFDQSxHQUFBLE1BQUE7Y0FDQSxRQUFBLFVBQUEsU0FBQSxRQUFBLGlCQUFBLEtBQUEsU0FBQSxTQUFBLEtBQUE7WUFDQSxHQUFBLE1BQUE7Y0FDQSxRQUFBLFVBQUE7WUFDQSxHQUFBLE1BQUE7Y0FDQSxRQUFBLFVBQUEsUUFBQSxRQUFBLGdCQUFBLE1BQUE7WUFDQSxPQUFBOzs7Ozs7Ozs7Ozs7QUNwREEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxjQUFBOztJQUVBLFdBQUEsVUFBQSxDQUFBLFVBQUE7SUFDQSxTQUFBLFdBQUEsUUFBQSxVQUFBOztRQUVBOzs7O1FBSUEsU0FBQSxXQUFBOzs7Ozs7VUFNQSxPQUFBLE9BQUEsYUFBQSxTQUFBLE9BQUE7O2NBRUEsUUFBQSxJQUFBLDJCQUFBOzs7Ozs7Ozs7VUFTQSxPQUFBLElBQUEsZ0JBQUEsU0FBQSxPQUFBLElBQUEsU0FBQTs7WUFFQSxRQUFBLElBQUEsWUFBQSxLQUFBOzs7OztZQUtBLFNBQUE7Ozs7O1VBS0EsT0FBQSxJQUFBLGlCQUFBLFNBQUEsT0FBQSxHQUFBOztZQUVBLFFBQUEsSUFBQSxZQUFBLEtBQUE7Ozs7Ozs7O1VBUUEsT0FBQSxJQUFBLGlCQUFBLFNBQUEsT0FBQSxJQUFBO1lBQ0EsSUFBQSxPQUFBOztZQUVBLFFBQUEsSUFBQSx1QkFBQSxNQUFBLE1BQUE7O1lBRUEsU0FBQSxVQUFBOzs7Y0FHQSxPQUFBLFdBQUEsaUJBQUE7O2NBRUEsUUFBQSxJQUFBLGdCQUFBOztlQUVBOzs7Ozs7O1VBT0EsT0FBQSxTQUFBO1lBQ0E7Y0FDQSxJQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7O1lBRUE7Y0FDQSxJQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7O1lBRUE7Y0FDQSxJQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Ozs7Ozs7Ozs7Ozs7O0FDdkZBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsV0FBQTs7SUFFQSxRQUFBLFVBQUEsQ0FBQSxZQUFBO0lBQ0EsU0FBQSxTQUFBLFVBQUEsZUFBQTtNQUNBLElBQUEsaUJBQUE7O01BRUEsT0FBQTtRQUNBLFVBQUE7UUFDQSxNQUFBOzs7OztNQUtBLFNBQUEsS0FBQSxPQUFBLFNBQUE7OztRQUdBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsVUFBQTs7UUFFQSxRQUFBLFNBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBOzs7Ozs7TUFNQSxTQUFBLGlCQUFBLGVBQUE7UUFDQSxJQUFBLE9BQUEsTUFBQTtRQUNBLElBQUEsT0FBQSxRQUFBLFNBQUEsY0FBQTs7UUFFQSxHQUFBLENBQUEsTUFBQSxFQUFBLE9BQUE7O1FBRUEsS0FBQSxLQUFBLE1BQUEsRUFBQSxNQUFBLFNBQUE7O1FBRUEsR0FBQSxNQUFBO1VBQ0EsU0FBQSxXQUFBO1lBQ0EsY0FBQSxrQkFBQSxRQUFBLE9BQUE7Ozs7O01BS0EsU0FBQSxpQkFBQSxPQUFBO1FBQ0EsSUFBQSxPQUFBLE1BQUE7UUFDQSxJQUFBLE9BQUEsUUFBQSxTQUFBLGNBQUE7O1FBRUEsR0FBQSxNQUFBOztVQUVBLElBQUEsV0FBQSxLQUFBO2NBQ0EsV0FBQSxLQUFBOztVQUVBLEdBQUEsUUFBQTtZQUNBLElBQUEsVUFBQSxFQUFBLElBQUE7O1lBRUEsRUFBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLE9BQUE7ZUFDQSxFQUFBLElBQUEsT0FBQSxTQUFBOzs7Ozs7Ozs7OztBQzNFQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGFBQUE7O0lBRUEsVUFBQSxVQUFBLENBQUEsWUFBQSxZQUFBO0lBQ0EsU0FBQSxXQUFBLFVBQUEsVUFBQSxJQUFBOztRQUVBLElBQUEsWUFBQTtZQUNBLFVBQUE7WUFDQTtjQUNBO2tCQUNBO3VCQUNBO2NBQ0E7O1lBRUEsTUFBQTs7UUFFQSxPQUFBOzs7O1FBSUEsU0FBQSxLQUFBLE9BQUEsSUFBQTs7VUFFQSxNQUFBLGNBQUE7O1VBRUEsSUFBQSxXQUFBO2NBQ0E7OztVQUdBLFFBQUEsUUFBQSxRQUFBLElBQUEsWUFBQTs7VUFFQSxHQUFBLFNBQUE7O1VBRUEsV0FBQSxLQUFBOztVQUVBLFVBQUEsU0FBQTs7OztVQUlBLFNBQUEsZUFBQTs7WUFFQSxJQUFBLFlBQUEsTUFBQTtZQUNBLFVBQUEsV0FBQSxRQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxZQUFBOztZQUVBLE1BQUEsY0FBQSxTQUFBLFNBQUE7O1lBRUEsVUFBQSxTQUFBLGNBQUE7OztVQUdBLFNBQUEsYUFBQTs7WUFFQSxTQUFBLE9BQUE7O1lBRUEsTUFBQSxjQUFBOztZQUVBLFNBQUEsVUFBQTs7Y0FFQSxTQUFBLFNBQUEsSUFBQTs7Y0FFQSxRQUFBLFFBQUEsUUFBQSxJQUFBLFlBQUE7ZUFDQTs7O1VBR0EsU0FBQSxXQUFBO1lBQ0EsSUFBQSxXQUFBLEdBQUE7WUFDQSxJQUFBLGNBQUE7OztZQUdBLElBQUEsTUFBQSxNQUFBLElBQUEsc0JBQUEsWUFBQTtjQUNBOzs7Y0FHQSxLQUFBLGdCQUFBLEdBQUE7O2dCQUVBLFNBQUEsVUFBQTtrQkFDQSxTQUFBO21CQUNBOztnQkFFQTs7Ozs7WUFLQSxPQUFBLFNBQUE7Ozs7Ozs7QUN0RkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxlQUFBO1NBQ0EsUUFBQSxpQkFBQTs7O0lBR0EsWUFBQSxVQUFBLENBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxTQUFBLFlBQUEsTUFBQSxLQUFBLFVBQUEsWUFBQTtNQUNBLElBQUEsT0FBQTs7TUFFQSxLQUFBLFdBQUE7TUFDQSxLQUFBLFlBQUE7TUFDQSxLQUFBLFdBQUE7TUFDQSxLQUFBLGVBQUE7TUFDQSxLQUFBLGFBQUE7TUFDQSxLQUFBLFdBQUE7TUFDQSxLQUFBLGtCQUFBO01BQ0EsS0FBQSxjQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBO1FBQ0EsU0FBQTtRQUNBLE1BQUE7UUFDQSxVQUFBO1FBQ0EsT0FBQTtRQUNBLFFBQUE7OztNQUdBLFNBQUEsU0FBQSxRQUFBO1FBQ0EsS0FBQSxPQUFBO1VBQ0EsVUFBQTtVQUNBLGFBQUE7VUFDQSxVQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7VUFDQSxTQUFBLElBQUE7O1FBRUEsS0FBQSxjQUFBOzs7TUFHQSxTQUFBLFdBQUEsS0FBQTtRQUNBLE9BQUEsSUFBQSxLQUFBLENBQUEsT0FBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsT0FBQSxRQUFBLE9BQUE7U0FDQSxTQUFBLEtBQUEsVUFBQSxNQUFBO1VBQ0EsT0FBQTs7OztNQUlBLFNBQUEsWUFBQTtRQUNBLEdBQUEsS0FBQSxlQUFBLEtBQUEsdUJBQUEsS0FBQTtVQUNBLElBQUEsU0FBQTtVQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLEdBQUE7WUFDQSxHQUFBLEVBQUEsSUFBQSxZQUFBLEtBQUEsWUFBQSxRQUFBO2NBQ0EsRUFBQTtjQUNBLFNBQUE7OztVQUdBLEdBQUEsQ0FBQSxRQUFBO1lBQ0EsU0FBQTtjQUNBLEtBQUEsS0FBQTtjQUNBLEtBQUE7O1lBRUEsS0FBQSxLQUFBLFNBQUEsS0FBQTs7O1FBR0EsS0FBQSxjQUFBOzs7TUFHQSxTQUFBLGNBQUEsUUFBQSxPQUFBO1FBQ0EsT0FBQTtRQUNBLEdBQUEsT0FBQSxRQUFBLEdBQUE7VUFDQSxLQUFBLEtBQUEsU0FBQSxPQUFBLE9BQUE7Ozs7TUFJQSxTQUFBLGNBQUE7UUFDQSxLQUFBLEtBQUEsY0FBQTtRQUNBLEtBQUEsS0FBQSxXQUFBO1FBQ0EsUUFBQSxRQUFBLEtBQUEsS0FBQSxVQUFBLFVBQUEsUUFBQTtVQUNBLEtBQUEsS0FBQSxZQUFBLE9BQUE7VUFDQSxLQUFBLEtBQUEsZUFBQSxPQUFBLElBQUEsT0FBQSxJQUFBOztRQUVBLE9BQUEsS0FBQSxLQUFBOzs7TUFHQSxTQUFBLFlBQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxDQUFBLE1BQUE7UUFDQSxHQUFBLEtBQUEsS0FBQSxRQUFBO1VBQ0EsS0FBQSxLQUFBLFdBQUEsS0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBLEtBQUEsaUJBQUEsS0FBQSxLQUFBLGFBQUEsSUFBQSxLQUFBLEtBQUEsT0FBQSxVQUFBO1VBQ0EsR0FBQSxXQUFBLEtBQUEsU0FBQSxnQkFBQTtZQUNBLEtBQUEsS0FBQSxtQkFBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE9BQUEsTUFBQSxXQUFBLEtBQUEsU0FBQTs7ZUFFQTtVQUNBLEtBQUEsS0FBQSxpQkFBQTs7UUFFQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsWUFBQSxLQUFBLEtBQUE7UUFDQSxHQUFBLEtBQUEsS0FBQSxRQUFBO1VBQ0EsR0FBQSxXQUFBLEtBQUEsU0FBQSxnQkFBQTtZQUNBLEdBQUEsS0FBQSxLQUFBLG1CQUFBLEtBQUEsS0FBQSxLQUFBO2NBQ0EsS0FBQSxLQUFBLG1CQUFBLEtBQUEsS0FBQTs7WUFFQSxLQUFBLEtBQUEsT0FBQSxLQUFBLEtBQUE7O1VBRUEsR0FBQSxLQUFBLEtBQUEsT0FBQSxXQUFBLEtBQUEsS0FBQSxLQUFBO1lBQ0EsS0FBQSxLQUFBLFFBQUEsT0FBQTs7OztRQUlBOztRQUVBLFNBQUEsS0FBQTtVQUNBLFVBQUE7VUFDQSxZQUFBOzs7O01BSUEsU0FBQSxrQkFBQTtRQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUEsS0FBQSxLQUFBO1FBQ0EsR0FBQSxLQUFBLEtBQUEsUUFBQSxTQUFBLFFBQUE7VUFDQSxLQUFBLEtBQUEsUUFBQSxTQUFBLEtBQUEsS0FBQSxJQUFBLFdBQUEsS0FBQSxTQUFBO1VBQ0EsS0FBQSxLQUFBLFFBQUEsVUFBQSxLQUFBLEtBQUEsUUFBQTtVQUNBO2VBQ0EsR0FBQSxLQUFBLEtBQUEsUUFBQSxTQUFBLFdBQUE7VUFDQSxLQUFBLEtBQUEsUUFBQSxTQUFBLEVBQUEsS0FBQSxLQUFBO2VBQ0E7VUFDQSxLQUFBLEtBQUEsUUFBQSxTQUFBLEtBQUEsS0FBQTs7OztNQUlBLFNBQUEsY0FBQTtRQUNBLEdBQUEsS0FBQSxLQUFBLFFBQUEsU0FBQSxRQUFBO1VBQ0EsS0FBQSxPQUFBLEtBQUEsUUFBQTtVQUNBLEtBQUEsS0FBQSxPQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsS0FBQSxRQUFBO1VBQ0EsS0FBQSxLQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUE7Ozs7TUFJQSxTQUFBLE1BQUE7UUFDQSxLQUFBLEtBQUEsU0FBQTtRQUNBLE9BQUEsS0FBQSxLQUFBO1FBQ0EsT0FBQSxLQUFBLE9BQUEsS0FBQSxNQUFBOzs7O0lBSUEsY0FBQSxVQUFBLENBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxTQUFBLGNBQUEsTUFBQSxLQUFBLFVBQUEsWUFBQTtNQUNBLElBQUEsT0FBQTs7TUFFQSxLQUFBLGFBQUE7TUFDQSxLQUFBLFdBQUE7TUFDQSxLQUFBLFdBQUE7TUFDQSxLQUFBLFFBQUE7O01BRUEsU0FBQSxXQUFBLE1BQUE7UUFDQSxLQUFBLE9BQUE7UUFDQSxLQUFBLFdBQUE7VUFDQSxVQUFBO1VBQ0EsYUFBQTtVQUNBLFVBQUE7VUFDQSxRQUFBO1VBQ0EsU0FBQSxJQUFBOzs7O01BSUEsU0FBQSxRQUFBO1FBQ0EsS0FBQSxTQUFBLGNBQUE7UUFDQSxLQUFBLFNBQUEsV0FBQTtRQUNBLEtBQUEsU0FBQSxTQUFBLFFBQUEsVUFBQSxRQUFBO1VBQ0EsS0FBQSxTQUFBLGVBQUEsT0FBQSxJQUFBLE9BQUEsSUFBQTtVQUNBLEtBQUEsU0FBQSxZQUFBLE9BQUE7OztRQUdBLEtBQUEsU0FBQSxpQkFBQTtRQUNBLEdBQUEsS0FBQSxLQUFBLFFBQUE7VUFDQSxLQUFBLFNBQUEsaUJBQUEsS0FBQSxTQUFBLGFBQUEsSUFBQSxLQUFBLEtBQUEsT0FBQSxVQUFBO1FBQ0EsS0FBQSxTQUFBLE1BQUEsS0FBQSxTQUFBLGNBQUEsS0FBQSxTQUFBO1FBQ0EsS0FBQSxTQUFBLFFBQUEsU0FBQSxLQUFBLFNBQUE7UUFDQSxHQUFBLEtBQUEsU0FBQSxRQUFBLFNBQUEsUUFBQTtVQUNBLEtBQUEsU0FBQSxRQUFBLFNBQUEsS0FBQSxTQUFBLElBQUEsV0FBQSxLQUFBLFNBQUE7VUFDQSxLQUFBLFNBQUEsUUFBQSxVQUFBLEtBQUEsU0FBQSxRQUFBOzs7O01BSUEsU0FBQSxTQUFBLFFBQUE7UUFDQSxLQUFBLFNBQUEsVUFBQSxDQUFBLE1BQUEsS0FBQSxLQUFBLFFBQUE7O1FBRUEsSUFBQSxXQUFBLEtBQUEsS0FBQTtRQUNBLEdBQUEsUUFBQSxXQUFBLENBQUE7O1FBRUEsS0FBQSxTQUFBLFdBQUE7UUFDQSxTQUFBLFFBQUEsVUFBQSxRQUFBO1VBQ0EsSUFBQSxLQUFBO1lBQ0EsS0FBQSxPQUFBO1lBQ0EsS0FBQSxPQUFBLE1BQUEsT0FBQTs7VUFFQSxHQUFBLEVBQUEsTUFBQSxHQUFBLEtBQUEsU0FBQSxTQUFBLEtBQUE7OztRQUdBOztRQUVBLE9BQUEsU0FBQSxLQUFBO1VBQ0EsVUFBQTtVQUNBLFlBQUE7V0FDQTs7O01BR0EsU0FBQSxXQUFBO1FBQ0EsS0FBQSxTQUFBLFNBQUE7UUFDQSxPQUFBLEtBQUEsUUFBQSxPQUFBLENBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLFVBQUE7Ozs7O0FDbE5BLENBQUEsV0FBQTtJQUNBOztJQUVBO09BQ0EsT0FBQTtPQUNBLFdBQUEsa0JBQUE7T0FDQSxXQUFBLDRCQUFBO09BQ0EsV0FBQSxtQkFBQTtPQUNBLFdBQUEsa0JBQUE7T0FDQSxXQUFBLGtDQUFBOzs7SUFHQSxlQUFBLFVBQUEsQ0FBQSxVQUFBLGVBQUE7SUFDQSxTQUFBLGVBQUEsUUFBQSxhQUFBLFNBQUE7TUFDQSxJQUFBLEtBQUE7O01BRUE7O01BRUEsU0FBQSxXQUFBO1FBQ0EsT0FBQSxjQUFBO1FBQ0EsR0FBQSxDQUFBLFlBQUEsTUFBQTtVQUNBLFlBQUE7Ozs7O1FBS0EsR0FBQSxXQUFBLFFBQUEsS0FBQSxDQUFBLE9BQUE7VUFD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QTtjQUNBLGFBQUE7O1dBRUEsTUFBQSxnQkFBQTtjQUNBLEtBQUE7Y0FDQSxPQUFBO2NBQ0EsYUFBQTs7V0FFQSxNQUFBLFlBQUE7Y0FDQSxLQUFBO2NBQ0EsT0FBQTtjQUNBLGFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqSkEsQ0FBQSxZQUFBO0VBQ0E7O0VBRUE7T0FDQSxPQUFBO09BQ0EsV0FBQSxxQkFBQTs7RUFFQSxrQkFBQSxVQUFBLENBQUEsVUFBQSxjQUFBLFlBQUEsUUFBQSxVQUFBO0VBQ0EsU0FBQSxrQkFBQSxRQUFBLFlBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQTtJQUNBLElBQUEsS0FBQTtJQUNBLEdBQUEsV0FBQTtNQUNBLFFBQUE7UUFDQSxZQUFBO1FBQ0EsV0FBQTtRQUNBLFdBQUE7UUFDQSxRQUFBO1FBQ0EsVUFBQTtRQUNBLFFBQUE7O01BRUEsT0FBQTtRQUNBLE1BQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTs7TUFFQSxNQUFBO1FBQ0EsTUFBQTs7TUFFQSxRQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7O01BRUEsU0FBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTs7TUFFQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7O01BRUEsV0FBQTtRQUNBLFFBQUE7UUFDQSxNQUFBO1FBQ0EsT0FBQTtRQUNBLGNBQUE7O01BRUEsUUFBQTtRQUNBLFFBQUE7UUFDQSxRQUFBO1FBQ0EsU0FBQTs7TUFFQSxRQUFBO1FBQ0EsUUFBQTtRQUNBLFNBQUE7UUFDQSxRQUFBO1FBQ0EsUUFBQTs7TUFFQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7O01BRUEsT0FBQTtRQUNBLE9BQUE7O01BRUEsUUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsUUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBOztNQUVBLFFBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFFBQUE7O01BRUEsTUFBQTtRQUNBLE1BQUE7O01BRUEsTUFBQTtRQUNBLE1BQUE7Ozs7SUFJQTs7SUFFQSxTQUFBLFdBQUE7TUFDQSxHQUFBLE9BQUEsU0FBQSxzQkFBQSxDQUFBLElBQUEsT0FBQSxLQUFBLFlBQUEsU0FBQTs7O0lBR0EsR0FBQSxTQUFBLFVBQUEsUUFBQTtNQUNBLElBQUEsUUFBQTtNQUNBLElBQUEsT0FBQSxPQUFBLEtBQUE7TUFDQSxHQUFBLFFBQUE7UUFDQSxPQUFBLE9BQUEsS0FBQTtRQUNBLFFBQUE7O01BRUEsTUFBQSxPQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsS0FBQSxNQUFBLE1BQUEsU0FBQSxRQUFBLFFBQUEsS0FBQTtRQUNBLFFBQUEsSUFBQSxXQUFBLE1BQUE7U0FDQSxTQUFBLE1BQUEsS0FBQTtRQUNBLFFBQUEsSUFBQSxTQUFBLE1BQUE7Ozs7SUFJQSxHQUFBLGlCQUFBLFlBQUE7TUFDQSxJQUFBLFNBQUEsT0FBQSxLQUFBLFNBQUEsZ0JBQUE7TUFDQSxJQUFBLE9BQUEsT0FBQSxTQUFBLEtBQUEsT0FBQSxPQUFBLE9BQUEsTUFBQSxDQUFBLE9BQUEsQ0FBQTtNQUNBLE9BQUEsS0FBQSxDQUFBLE9BQUEsS0FBQSxNQUFBLEdBQUEsT0FBQSxLQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsTUFBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQSxjQUFBLE9BQUEsS0FBQSxTQUFBLGVBQUE7OztJQUdBLEdBQUEsc0JBQUEsWUFBQTtNQUNBLE9BQUEsS0FBQSxTQUFBLGFBQUEsUUFBQSxVQUFBLE9BQUE7UUFDQSxPQUFBLE9BQUE7VUFDQSxPQUFBLENBQUEsV0FBQSxPQUFBLEtBQUEsU0FBQSxJQUFBLFlBQUEsQ0FBQSxLQUFBLE1BQUEsT0FBQSxLQUFBLE1BQUE7V0FDQTtVQUNBLFVBQUEsTUFBQSxVQUFBLE9BQUEsTUFBQTtXQUNBLFNBQUEsT0FBQSxRQUFBLEtBQUE7VUFDQSxRQUFBLElBQUEsV0FBQSxNQUFBO1dBQ0EsU0FBQSxNQUFBLEtBQUE7VUFDQSxRQUFBLElBQUEsU0FBQSxNQUFBOzs7OztJQUtBLEdBQUEsYUFBQSxZQUFBO01BQ0EsR0FBQTtNQUNBLFNBQUEsV0FBQTtR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LFNBQUEsV0FBQSxXQUFBLFNBQUEsWUFBQSxvQkFBQTs7UUFFQSxLQUFBLFVBQUEsVUFBQTs7VUFFQSxXQUFBLElBQUE7O1VBRUEsV0FBQSxTQUFBLFdBQUEsV0FBQSxTQUFBLFVBQUE7O1VBRUEsV0FBQSxTQUFBLGFBQUEsRUFBQSxXQUFBLFNBQUE7Ozs7TUFJQSxXQUFBLFNBQUE7Ozs7Ozs7OztBQ2xDQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGtCQUFBOztJQUVBLGVBQUEsVUFBQSxDQUFBO0lBQ0EsU0FBQSxnQkFBQSxVQUFBO1FBQ0EsSUFBQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBLE9BQUE7VUFDQSxNQUFBLE9BQUEsWUFBQTtZQUNBLE9BQUEsTUFBQSxNQUFBLE1BQUEsZ0JBQUE7YUFDQSxVQUFBLFVBQUE7WUFDQSxTQUFBLFFBQUEsQ0FBQSxDQUFBLFVBQUE7Ozs7Ozs7Ozs7OztBQ25CQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFdBQUE7O0lBRUEsUUFBQSxVQUFBLENBQUE7SUFDQSxTQUFBLFFBQUEsU0FBQTtNQUNBLE9BQUEsUUFBQTs7Ozs7Ozs7OztBQ1RBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsWUFBQTs7SUFFQSxTQUFBLFVBQUEsQ0FBQSxVQUFBO0lBQ0EsU0FBQSxVQUFBLFFBQUEsZUFBQTtRQUNBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBO1lBQ0EsT0FBQTtjQUNBLFVBQUE7OztRQUdBLE9BQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsU0FBQTtVQUNBLFFBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQTtjQUNBLEVBQUE7O2NBRUEsR0FBQSxNQUFBLFVBQUE7Z0JBQ0EsT0FBQSxjQUFBLE1BQUE7Z0JBQ0EsT0FBQSxHQUFBLE9BQUEsU0FBQSxJQUFBLENBQUEsUUFBQTs7bUJBRUE7Z0JBQ0EsRUFBQSxNQUFBOzs7Ozs7Ozs7Ozs7O0FDM0JBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsWUFBQTtTQUNBLFVBQUEsU0FBQTs7SUFFQSxTQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEsU0FBQSxTQUFBO01BQ0EsT0FBQTtRQUNBLFNBQUE7UUFDQSxVQUFBO1FBQ0EsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBLG1CQUFBO1VBQ0Esa0JBQUEsU0FBQSxLQUFBLFNBQUEsTUFBQTs7WUFFQSxPQUFBLEtBQUE7OztVQUdBLGtCQUFBLFlBQUEsS0FBQSxTQUFBLE1BQUE7O1lBRUEsT0FBQSxLQUFBOzs7Ozs7SUFNQSxNQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEsTUFBQSxTQUFBO01BQ0EsT0FBQTtRQUNBLFNBQUE7UUFDQSxVQUFBO1FBQ0EsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBLG1CQUFBO1VBQ0Esa0JBQUEsU0FBQSxLQUFBLFNBQUEsTUFBQTs7WUFFQSxPQUFBLEtBQUE7OztVQUdBLGtCQUFBLFlBQUEsS0FBQSxTQUFBLE1BQUE7O1lBRUEsT0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7O0FDeENBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsb0JBQUE7O0lBRUEsaUJBQUEsVUFBQSxDQUFBO0lBQ0EsU0FBQSxrQkFBQSxTQUFBO1FBQ0EsSUFBQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBOztVQUVBLElBQUEsUUFBQSxPQUFBO1lBQ0EsUUFBQSxTQUFBOztlQUVBO1lBQ0EsUUFBQSxHQUFBLFNBQUEsVUFBQSxHQUFBO2dCQUNBLEVBQUE7O2dCQUVBLElBQUEsV0FBQSxTQUFBOztrQkFFQSxXQUFBOzs7a0JBR0EsR0FBQSxXQUFBO29CQUNBLEVBQUEsTUFBQSxTQUFBLE1BQUEsWUFBQSxhQUFBLFNBQUE7O29CQUVBLEVBQUEsTUFBQSxTQUFBLE1BQUEsWUFBQSxlQUFBLFNBQUE7O3VCQUVBO2tCQUNBLEVBQUEsTUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ25DQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7O0lBRUEsU0FBQSxXQUFBO1FBQ0EsSUFBQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBLE9BQUE7VUFDQSxRQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUE7Y0FDQSxHQUFBLFFBQUEsR0FBQSxNQUFBLEVBQUE7Y0FDQSxJQUFBLE1BQUEsTUFBQTtrQkFDQTs7Y0FFQSxHQUFBLEtBQUE7Z0JBQ0EsT0FBQSxXQUFBO2dCQUNBLEtBQUEsQ0FBQSxPQUFBO2tCQUNBLEVBQUEsTUFBQTs7O21CQUdBO2dCQUNBLEVBQUEsTUFBQTs7Ozs7O1FBTUEsU0FBQSxXQUFBLEtBQUE7VUFDQSxJQUFBLFNBQUE7Y0FDQSxVQUFBLEVBQUEsSUFBQSxRQUFBLEtBQUEsTUFBQSxTQUFBOztVQUVBLEVBQUEsUUFBQSxPQUFBLEVBQUEsV0FBQSxLQUFBO1lBQ0EsUUFBQTtZQUNBLFFBQUE7WUFDQSxRQUFBOzs7VUFHQSxJQUFBLFFBQUEsU0FBQTtZQUNBLFFBQUE7OztVQUdBLE9BQUEsRUFBQSxJQUFBOzs7Ozs7Ozs7OztBQy9DQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLE9BQUE7O0lBRUEsSUFBQSxVQUFBLENBQUEsY0FBQTtJQUNBLFNBQUEsS0FBQSxZQUFBLFdBQUE7UUFDQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTtVQUNBLElBQUEsU0FBQSxNQUFBOztVQUVBLFNBQUEsYUFBQTtZQUNBLElBQUEsS0FBQSxXQUFBLElBQUEsUUFBQTtZQUNBLFFBQUEsS0FBQTs7O1VBR0E7VUFDQSxJQUFBLGtCQUFBLFVBQUEsWUFBQTs7VUFFQSxNQUFBLElBQUEsWUFBQSxVQUFBO1lBQ0EsVUFBQSxPQUFBOzs7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QUFBLGFBQUEsS0FBQTtrQkFDQSxPQUFBLFNBQUEsV0FBQSxlQUFBLE9BQUEsUUFBQSxjQUFBLGNBQUEsS0FBQSxTQUFBO2dCQUNBLE9BQUE7cUJBQ0E7Z0JBQ0EsT0FBQTs7OztVQUlBLGVBQUEsTUFBQSxLQUFBLFdBQUEsUUFBQSxVQUFBOztVQUVBLFNBQUEsWUFBQTtZQUNBLE9BQUEsTUFBQSxTQUFBOzs7VUFHQSxvQkFBQSxZQUFBO1lBQ0EsT0FBQSxNQUFBLFNBQUE7OztVQUdBLGtCQUFBLFlBQUE7WUFDQSxPQUFBLE1BQUEsU0FBQTs7O1VBR0EsVUFBQSxZQUFBO1lBQ0EsT0FBQSxLQUFBLFVBQUEsZUFBQTs7Ozs7OztBQ25IQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsVUFBQTs7WUFFQTs7WUFFQTtZQUNBOzs7Ozs7Ozs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLGNBQUE7O0lBRUEsV0FBQSxVQUFBLENBQUE7SUFDQSxTQUFBLFdBQUEsTUFBQTs7OztRQUlBOzs7O1FBSUEsU0FBQSxXQUFBO1VBQ0EsS0FBQSxJQUFBOzs7O0FBSUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiAqIFxyXG4gKiBBbmdsZSAtIEJvb3RzdHJhcCBBZG1pbiBBcHAgKyBBbmd1bGFySlNcclxuICogXHJcbiAqIFZlcnNpb246IDMuMS4wXHJcbiAqIEF1dGhvcjogQHRoZW1pY29uX2NvXHJcbiAqIFdlYnNpdGU6IGh0dHA6Ly90aGVtaWNvbi5jb1xyXG4gKiBMaWNlbnNlOiBodHRwczovL3dyYXBib290c3RyYXAuY29tL2hlbHAvbGljZW5zZXNcclxuICogXHJcbiAqL1xyXG5cclxuLy8gQVBQIFNUQVJUXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhbmdsZScsIFtcclxuICAgICAgICAgICAgJ2FwcC5jb3JlJyxcclxuICAgICAgICAgICAgJ2FwcC5yb3V0ZXMnLFxyXG4gICAgICAgICAgICAnYXBwLnNpZGViYXInLFxyXG4gICAgICAgICAgICAnYXBwLnByZWxvYWRlcicsXHJcbiAgICAgICAgICAgICdhcHAubG9hZGluZ2JhcicsXHJcbiAgICAgICAgICAgICdhcHAudHJhbnNsYXRlJyxcclxuICAgICAgICAgICAgJ2FwcC5zZXR0aW5ncycsXHJcbiAgICAgICAgICAgICdhcHAuZGFzaGJvYXJkJyxcclxuICAgICAgICAgICAgJ2FwcC5ub3RpZnknLFxyXG4gICAgICAgICAgICAnYXBwLmVsZW1lbnRzJyxcclxuICAgICAgICAgICAgJ2FwcC5wYW5lbHMnLFxyXG4gICAgICAgICAgICAnYXBwLmNoYXJ0cycsXHJcbiAgICAgICAgICAgICdhcHAuZm9ybXMnLFxyXG4gICAgICAgICAgICAnYXBwLmxvY2FsZScsXHJcbiAgICAgICAgICAgICdhcHAucGFnZXMnLFxyXG4gICAgICAgICAgICAnYXBwLnRhYmxlcycsXHJcbiAgICAgICAgICAgICdhcHAudXRpbHMnLFxyXG4gICAgICAgICAgICAnYXBwLml0ZW1zJyxcclxuICAgICAgICAgICAgJ2FwcC5teXNob3AnLFxyXG4gICAgICAgICAgICAnYXBwLnNhbGVzJyxcclxuICAgICAgICAgICAgJ2FwcC5tZW1iZXJzJyxcclxuICAgICAgICAgICAgJ2FwcC5jb3N0cydcclxuICAgICAgICBdKTtcclxufSkoKTtcclxuXHJcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbG9ycycsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jaGFydHMnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvc3RzJywgW10pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb3JlJywgW1xyXG4gICAgICAgICAgICAnbmdSb3V0ZScsXHJcbiAgICAgICAgICAgICduZ0FuaW1hdGUnLFxyXG4gICAgICAgICAgICAnbmdTdG9yYWdlJyxcclxuICAgICAgICAgICAgJ25nQ29va2llcycsXHJcbiAgICAgICAgICAgICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJyxcclxuICAgICAgICAgICAgJ3VpLmJvb3RzdHJhcCcsXHJcbiAgICAgICAgICAgICd1aS5yb3V0ZXInLFxyXG4gICAgICAgICAgICAnb2MubGF6eUxvYWQnLFxyXG4gICAgICAgICAgICAnY2ZwLmxvYWRpbmdCYXInLFxyXG4gICAgICAgICAgICAnbmdTYW5pdGl6ZScsXHJcbiAgICAgICAgICAgICduZ1Jlc291cmNlJyxcclxuICAgICAgICAgICAgJ3RtaC5keW5hbWljTG9jYWxlJyxcclxuICAgICAgICAgICAgJ3VpLnV0aWxzJyxcclxuICAgICAgICAgICAgJ2xiU2VydmljZXMnXHJcbiAgICAgICAgXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuZGFzaGJvYXJkJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmVsZW1lbnRzJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZvcm1zJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5pdGVtcycsIFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubGF6eWxvYWQnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubG9hZGluZ2JhcicsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sb2NhbGUnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm1lbWJlcnMnLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5teXNob3AnLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm5vdGlmeScsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYWdlcycsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYW5lbHMnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucHJlbG9hZGVyJywgW10pO1xyXG59KSgpO1xyXG5cclxuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnNhbGVzJywgW10pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbXHJcbiAgICAgICAgICAgICdhcHAubGF6eWxvYWQnXHJcbiAgICAgICAgXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuc2V0dGluZ3MnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuc2lkZWJhcicsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWJsZXMnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudHJhbnNsYXRlJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnV0aWxzJywgW1xyXG4gICAgICAgICAgJ2FwcC5jb2xvcnMnXHJcbiAgICAgICAgXSk7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbG9ycycpXHJcbiAgICAgICAgLmNvbnN0YW50KCdBUFBfQ09MT1JTJywge1xyXG4gICAgICAgICAgJ3ByaW1hcnknOiAgICAgICAgICAgICAgICAnIzVkOWNlYycsXHJcbiAgICAgICAgICAnc3VjY2Vzcyc6ICAgICAgICAgICAgICAgICcjMjdjMjRjJyxcclxuICAgICAgICAgICdpbmZvJzogICAgICAgICAgICAgICAgICAgJyMyM2I3ZTUnLFxyXG4gICAgICAgICAgJ3dhcm5pbmcnOiAgICAgICAgICAgICAgICAnI2ZmOTAyYicsXHJcbiAgICAgICAgICAnZGFuZ2VyJzogICAgICAgICAgICAgICAgICcjZjA1MDUwJyxcclxuICAgICAgICAgICdpbnZlcnNlJzogICAgICAgICAgICAgICAgJyMxMzFlMjYnLFxyXG4gICAgICAgICAgJ2dyZWVuJzogICAgICAgICAgICAgICAgICAnIzM3YmM5YicsXHJcbiAgICAgICAgICAncGluayc6ICAgICAgICAgICAgICAgICAgICcjZjUzMmU1JyxcclxuICAgICAgICAgICdwdXJwbGUnOiAgICAgICAgICAgICAgICAgJyM3MjY2YmEnLFxyXG4gICAgICAgICAgJ2RhcmsnOiAgICAgICAgICAgICAgICAgICAnIzNhM2Y1MScsXHJcbiAgICAgICAgICAneWVsbG93JzogICAgICAgICAgICAgICAgICcjZmFkNzMyJyxcclxuICAgICAgICAgICdncmF5LWRhcmtlcic6ICAgICAgICAgICAgJyMyMzI3MzUnLFxyXG4gICAgICAgICAgJ2dyYXktZGFyayc6ICAgICAgICAgICAgICAnIzNhM2Y1MScsXHJcbiAgICAgICAgICAnZ3JheSc6ICAgICAgICAgICAgICAgICAgICcjZGRlNmU5JyxcclxuICAgICAgICAgICdncmF5LWxpZ2h0JzogICAgICAgICAgICAgJyNlNGVhZWMnLFxyXG4gICAgICAgICAgJ2dyYXktbGlnaHRlcic6ICAgICAgICAgICAnI2VkZjFmMidcclxuICAgICAgICB9KVxyXG4gICAgICAgIDtcclxufSkoKTsiLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogY29sb3JzLmpzXG4gKiBTZXJ2aWNlcyB0byByZXRyaWV2ZSBnbG9iYWwgY29sb3JzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbG9ycycpXG4gICAgICAgIC5zZXJ2aWNlKCdDb2xvcnMnLCBDb2xvcnMpO1xuXG4gICAgQ29sb3JzLiRpbmplY3QgPSBbJ0FQUF9DT0xPUlMnXTtcbiAgICBmdW5jdGlvbiBDb2xvcnMoQVBQX0NPTE9SUykge1xuICAgICAgICB0aGlzLmJ5TmFtZSA9IGJ5TmFtZTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gYnlOYW1lKG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gKEFQUF9DT0xPUlNbbmFtZV0gfHwgJyNmZmYnKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IGNoYXJ0LmpzXHJcbiAqIFdyYXBwZXIgZGlyZWN0aXZlIGZvciBjaGFydEpTLiBcclxuICogQmFzZWQgb24gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vQW5kcmVhc0hlaWJlcmcvOTgzNzg2OFxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNoYXJ0cycpXHJcbiAgICAgICAgLyogQWxpYXNlcyBmb3IgdmFyaW91cyBjaGFydCB0eXBlcyAqL1xyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2xpbmVjaGFydCcsICAgICBjaGFydEpTKCdMaW5lJykgICAgICApXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnYmFyY2hhcnQnLCAgICAgIGNoYXJ0SlMoJ0JhcicpICAgICAgIClcclxuICAgICAgICAuZGlyZWN0aXZlKCdyYWRhcmNoYXJ0JywgICAgY2hhcnRKUygnUmFkYXInKSAgICAgKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BvbGFyY2hhcnQnLCAgICBjaGFydEpTKCdQb2xhckFyZWEnKSApXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGllY2hhcnQnLCAgICAgIGNoYXJ0SlMoJ1BpZScpICAgICAgIClcclxuICAgICAgICAuZGlyZWN0aXZlKCdkb3VnaG51dGNoYXJ0JywgY2hhcnRKUygnRG91Z2hudXQnKSAgKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2RvbnV0Y2hhcnQnLCAgICBjaGFydEpTKCdEb3VnaG51dCcpICApXHJcbiAgICAgICAgO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNoYXJ0SlModHlwZSkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICc9JyxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiAnPScsXHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdAJyxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJz0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJz0nLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZTogJz0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiAnQCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6ICdAJyxcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zaXZlOiAnPScsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDogJz0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZDogJz0nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgJGVsZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3R4ID0gJGVsZW1bMF0uZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXV0b3NpemUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUud2lkdGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW0ud2lkdGgoJGVsZW0ucGFyZW50KCkud2lkdGgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguY2FudmFzLndpZHRoID0gJGVsZW0ud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5jYW52YXMud2lkdGggPSAkc2NvcGUud2lkdGggfHwgY3R4LmNhbnZhcy53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9zaXplID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLmhlaWdodCA8PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtLmhlaWdodCgkZWxlbS5wYXJlbnQoKS5oZWlnaHQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguY2FudmFzLmhlaWdodCA9IGN0eC5jYW52YXMud2lkdGggLyAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmNhbnZhcy5oZWlnaHQgPSAkc2NvcGUuaGVpZ2h0IHx8IGN0eC5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b3NpemUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2hhcnRDcmVhdGVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDcmVhdGVkLmRlc3Ryb3koKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGRhdGEgbm90IGRlZmluZWQsIGV4aXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFuZXdWYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmNoYXJ0KSB7IHR5cGUgPSAkc2NvcGUuY2hhcnQ7IH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGF1dG9zaXplKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydCA9IG5ldyBDaGFydChjdHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUucmVzcG9uc2l2ZSB8fCAkc2NvcGUucmVzaXplKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnMucmVzcG9uc2l2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUucmVzcG9uc2l2ZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnMucmVzcG9uc2l2ZSA9ICRzY29wZS5yZXNwb25zaXZlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDcmVhdGVkID0gY2hhcnRbdHlwZV0oJHNjb3BlLmRhdGEsICRzY29wZS5vcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDcmVhdGVkLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUubGVnZW5kKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCRlbGVtWzBdKS5wYXJlbnQoKS5hZnRlciggY2hhcnRDcmVhdGVkLmdlbmVyYXRlTGVnZW5kKCkgKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgndG9vbHRpcCcsIGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q3JlYXRlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q3JlYXRlZC5kcmF3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG5ld1ZhbD09PXVuZGVmaW5lZCB8fCAhY2hhcnRDcmVhdGVkLnNlZ21lbnRzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighaXNGaW5pdGUobmV3VmFsKSB8fCBuZXdWYWwgPj0gY2hhcnRDcmVhdGVkLnNlZ21lbnRzLmxlbmd0aCB8fCBuZXdWYWwgPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZlU2VnbWVudCA9IGNoYXJ0Q3JlYXRlZC5zZWdtZW50c1tuZXdWYWxdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVTZWdtZW50LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU2VnbWVudC5maWxsQ29sb3IgPSBhY3RpdmVTZWdtZW50LmhpZ2hsaWdodENvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENyZWF0ZWQuc2hvd1Rvb2x0aXAoW2FjdGl2ZVNlZ21lbnRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU2VnbWVudC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoYXJ0ID0gbmV3IENoYXJ0KGN0eCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoYXJ0Q3JlYXRlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuXHJcblxyXG5cclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogY2xhc3N5LWxvYWRlci5qc1xyXG4gKiBFbmFibGUgdXNlIG9mIGNsYXNzeWxvYWRlciBkaXJlY3RseSBmcm9tIGRhdGEgYXR0cmlidXRlc1xyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNoYXJ0cycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnY2xhc3N5bG9hZGVyJywgY2xhc3N5bG9hZGVyKTtcclxuXHJcbiAgICBjbGFzc3lsb2FkZXIuJGluamVjdCA9IFsnJHRpbWVvdXQnLCAnVXRpbHMnLCAnJHdpbmRvdyddO1xyXG4gICAgZnVuY3Rpb24gY2xhc3N5bG9hZGVyICgkdGltZW91dCwgVXRpbHMsICR3aW5kb3cpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICB2YXIgJHNjcm9sbGVyICAgICAgID0gJCgkd2luZG93KSxcclxuICAgICAgICAgICAgICBpblZpZXdGbGFnQ2xhc3MgPSAnanMtaXMtaW4tdmlldyc7IC8vIGEgY2xhc3NuYW1lIHRvIGRldGVjdCB3aGVuIGEgY2hhcnQgaGFzIGJlZW4gdHJpZ2dlcmVkIGFmdGVyIHNjcm9sbFxyXG5cclxuICAgICAgICAgIC8vIHJ1biBhZnRlciBpbnRlcnBvbGF0aW9uICBcclxuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgIFxyXG4gICAgICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyAgPSAkZWxlbWVudC5kYXRhKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBBdCBsZWFzZSB3ZSBuZWVkIGEgZGF0YS1wZXJjZW50YWdlIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICBpZihvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgaWYoIG9wdGlvbnMudHJpZ2dlckluVmlldyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2Nyb2xsZXIuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICBjaGVja0xvYWRlckluVklldygkZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IHN0YXJ0cyBhbHJlYWR5IGluIHZpZXdcclxuICAgICAgICAgICAgICAgIGNoZWNrTG9hZGVySW5WSWV3KCRlbGVtZW50LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgc3RhcnRMb2FkZXIoJGVsZW1lbnQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSwgMCk7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gY2hlY2tMb2FkZXJJblZJZXcoZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gLTIwO1xyXG4gICAgICAgICAgICBpZiggISBlbGVtZW50Lmhhc0NsYXNzKGluVmlld0ZsYWdDbGFzcykgJiZcclxuICAgICAgICAgICAgICAgIFV0aWxzLmlzSW5WaWV3KGVsZW1lbnQsIHt0b3BvZmZzZXQ6IG9mZnNldH0pICkge1xyXG4gICAgICAgICAgICAgIHN0YXJ0TG9hZGVyKGVsZW1lbnQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBmdW5jdGlvbiBzdGFydExvYWRlcihlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuQ2xhc3N5TG9hZGVyKG9wdGlvbnMpLmFkZENsYXNzKGluVmlld0ZsYWdDbGFzcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuY2hhcnRzJylcclxuICAgICAgICAuc2VydmljZSgnQ2hhcnREYXRhJywgQ2hhcnREYXRhKTtcclxuXHJcbiAgICBDaGFydERhdGEuJGluamVjdCA9IFsnJHJlc291cmNlJ107XHJcbiAgICBmdW5jdGlvbiBDaGFydERhdGEoJHJlc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkID0gbG9hZDtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICBcclxuICAgICAgICB2YXIgb3B0cyA9IHtcclxuICAgICAgICAgICAgZ2V0OiB7IG1ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWUgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICBmdW5jdGlvbiBsb2FkKHNvdXJjZSkge1xyXG4gICAgICAgICAgcmV0dXJuICRyZXNvdXJjZShzb3VyY2UsIHt9LCBvcHRzKS5nZXQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IGZsb3QuanNcclxuICogSW5pdGlhbGl6ZXMgdGhlIEZsb3QgY2hhcnQgcGx1Z2luIGFuZCBoYW5kbGVzIGRhdGEgcmVmcmVzaFxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNoYXJ0cycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZmxvdCcsIGZsb3QpO1xyXG5cclxuICAgIGZsb3QuJGluamVjdCA9IFsnJGh0dHAnLCAnJHRpbWVvdXQnXTtcclxuICAgIGZ1bmN0aW9uIGZsb3QgKCRodHRwLCAkdGltZW91dCkge1xyXG5cclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXY+PC9kaXY+JyxcclxuICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6ICc9PycsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6ICc9JyxcclxuICAgICAgICAgICAgc2VyaWVzOiAnPScsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiAnPScsXHJcbiAgICAgICAgICAgIHNyYzogJz0nXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbGluazogbGlua1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgIHZhciBoZWlnaHQsIHBsb3QsIHBsb3RBcmVhLCB3aWR0aDtcclxuICAgICAgICAgIHZhciBoZWlnaHREZWZhdWx0ID0gMjIwO1xyXG5cclxuICAgICAgICAgIHBsb3QgPSBudWxsO1xyXG5cclxuICAgICAgICAgIHdpZHRoID0gYXR0cnMud2lkdGggfHwgJzEwMCUnO1xyXG4gICAgICAgICAgaGVpZ2h0ID0gYXR0cnMuaGVpZ2h0IHx8IGhlaWdodERlZmF1bHQ7XHJcblxyXG4gICAgICAgICAgcGxvdEFyZWEgPSAkKGVsZW1lbnQuY2hpbGRyZW4oKVswXSk7XHJcbiAgICAgICAgICBwbG90QXJlYS5jc3Moe1xyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICB2YXIgcGxvdE9iajtcclxuICAgICAgICAgICAgaWYoIXNjb3BlLmRhdGFzZXQgfHwgIXNjb3BlLm9wdGlvbnMpIHJldHVybjtcclxuICAgICAgICAgICAgcGxvdE9iaiA9ICQucGxvdChwbG90QXJlYSwgc2NvcGUuZGF0YXNldCwgc2NvcGUub3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHNjb3BlLiRlbWl0KCdwbG90UmVhZHknLCBwbG90T2JqKTtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgc2NvcGUuY2FsbGJhY2socGxvdE9iaiwgc2NvcGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGxvdE9iajtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBvbkRhdGFzZXRDaGFuZ2VkKGRhdGFzZXQpIHtcclxuICAgICAgICAgICAgaWYgKHBsb3QpIHtcclxuICAgICAgICAgICAgICBwbG90LnNldERhdGEoZGF0YXNldCk7XHJcbiAgICAgICAgICAgICAgcGxvdC5zZXR1cEdyaWQoKTtcclxuICAgICAgICAgICAgICByZXR1cm4gcGxvdC5kcmF3KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcGxvdCA9IGluaXQoKTtcclxuICAgICAgICAgICAgICBvblNlcmllVG9nZ2xlZChzY29wZS5zZXJpZXMpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBwbG90O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKCdkYXRhc2V0Jywgb25EYXRhc2V0Q2hhbmdlZCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gb25TZXJpZVRvZ2dsZWQgKHNlcmllcykge1xyXG4gICAgICAgICAgICBpZiggIXBsb3QgfHwgIXNlcmllcyApIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHNvbWVEYXRhID0gcGxvdC5nZXREYXRhKCk7XHJcbiAgICAgICAgICAgIGZvcih2YXIgc05hbWUgaW4gc2VyaWVzKSB7XHJcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHNlcmllc1tzTmFtZV0sIHRvZ2dsZUZvcihzTmFtZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBwbG90LnNldERhdGEoc29tZURhdGEpO1xyXG4gICAgICAgICAgICBwbG90LmRyYXcoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUZvcihzTmFtZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAocywgaSl7XHJcbiAgICAgICAgICAgICAgICBpZihzb21lRGF0YVtpXSAmJiBzb21lRGF0YVtpXVtzTmFtZV0pXHJcbiAgICAgICAgICAgICAgICAgIHNvbWVEYXRhW2ldW3NOYW1lXS5zaG93ID0gcztcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzY29wZS4kd2F0Y2goJ3NlcmllcycsIG9uU2VyaWVUb2dnbGVkLCB0cnVlKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgZnVuY3Rpb24gb25TcmNDaGFuZ2VkKHNyYykge1xyXG5cclxuICAgICAgICAgICAgaWYoIHNyYyApIHtcclxuXHJcbiAgICAgICAgICAgICAgJGh0dHAuZ2V0KHNyYylcclxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmRhdGFzZXQgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICQuZXJyb3IoJ0Zsb3QgY2hhcnQ6IEJhZCByZXF1ZXN0LicpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzY29wZS4kd2F0Y2goJ3NyYycsIG9uU3JjQ2hhbmdlZCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBtb3JyaXMuanNcclxuICogQW5ndWxhckpTIERpcmVjdGl2ZXMgZm9yIE1vcnJpcyBDaGFydHNcclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jaGFydHMnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ21vcnJpc0JhcicsICAgbW9ycmlzQ2hhcnQoJ0JhcicpICAgKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ21vcnJpc0RvbnV0JywgbW9ycmlzQ2hhcnQoJ0RvbnV0JykgKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ21vcnJpc0xpbmUnLCAgbW9ycmlzQ2hhcnQoJ0xpbmUnKSAgKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ21vcnJpc0FyZWEnLCAgbW9ycmlzQ2hhcnQoJ0FyZWEnKSAgKTtcclxuXHJcbiAgICBmdW5jdGlvbiBtb3JyaXNDaGFydCh0eXBlKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgbW9ycmlzRGF0YTogJz0nLFxyXG4gICAgICAgICAgICBtb3JyaXNPcHRpb25zOiAnPSdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8gc3RhcnQgcmVhZHkgdG8gd2F0Y2ggZm9yIGNoYW5nZXMgaW4gZGF0YVxyXG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdtb3JyaXNEYXRhJywgZnVuY3Rpb24obmV3VmFsKSB7XHJcbiAgICAgICAgICAgICAgaWYgKG5ld1ZhbCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm1vcnJpc0luc3RhbmNlLnNldERhdGEobmV3VmFsKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5tb3JyaXNJbnN0YW5jZS5yZWRyYXcoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgICAgICAvLyB0aGUgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSBjaGFydFxyXG4gICAgICAgICAgICAkc2NvcGUubW9ycmlzT3B0aW9ucy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgLy8gSWYgZGF0YSBkZWZpbmVkIGNvcHkgdG8gb3B0aW9uc1xyXG4gICAgICAgICAgICBpZigkc2NvcGUubW9ycmlzRGF0YSlcclxuICAgICAgICAgICAgICAkc2NvcGUubW9ycmlzT3B0aW9ucy5kYXRhID0gJHNjb3BlLm1vcnJpc0RhdGE7XHJcbiAgICAgICAgICAgIC8vIEluaXQgY2hhcnRcclxuICAgICAgICAgICAgJHNjb3BlLm1vcnJpc0luc3RhbmNlID0gbmV3IE1vcnJpc1t0eXBlXSgkc2NvcGUubW9ycmlzT3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogc3BhcmtsaW5lLmpzXG4gKiBTcGFya0xpbmVzIE1pbmkgQ2hhcnRzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiBcbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jaGFydHMnKVxuICAgICAgICAuZGlyZWN0aXZlKCdzcGFya2xpbmUnLCBzcGFya2xpbmUpO1xuXG4gICAgZnVuY3Rpb24gc3BhcmtsaW5lICgpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgJ3NwYXJrbGluZSc6ICc9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IENvbnRyb2xsZXJcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIH1cbiAgICBDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckZWxlbWVudCcsICckdGltZW91dCcsICckd2luZG93J107XG4gICAgZnVuY3Rpb24gQ29udHJvbGxlcigkc2NvcGUsICRlbGVtZW50LCAkdGltZW91dCwgJHdpbmRvdykge1xuICAgICAgdmFyIHJ1blNMID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaW5pdFNwYXJMaW5lKCk7XG4gICAgICB9O1xuXG4gICAgICAkdGltZW91dChydW5TTCk7XG4gIFxuICAgICAgZnVuY3Rpb24gaW5pdFNwYXJMaW5lKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9ICRzY29wZS5zcGFya2xpbmUsXG4gICAgICAgICAgICBkYXRhID0gJGVsZW1lbnQuZGF0YSgpO1xuICAgICAgICBcbiAgICAgICAgaWYoIW9wdGlvbnMpIC8vIGlmIG5vIHNjb3BlIG9wdGlvbnMsIHRyeSB3aXRoIGRhdGEgYXR0cmlidXRlc1xuICAgICAgICAgIG9wdGlvbnMgPSBkYXRhO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYoZGF0YSkgLy8gZGF0YSBhdHRyaWJ1dGVzIG92ZXJyaWRlcyBzY29wZSBvcHRpb25zXG4gICAgICAgICAgICBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoe30sIG9wdGlvbnMsIGRhdGEpO1xuXG4gICAgICAgIG9wdGlvbnMudHlwZSA9IG9wdGlvbnMudHlwZSB8fCAnYmFyJzsgLy8gZGVmYXVsdCBjaGFydCBpcyBiYXJcbiAgICAgICAgb3B0aW9ucy5kaXNhYmxlSGlkZGVuQ2hlY2sgPSB0cnVlO1xuXG4gICAgICAgICRlbGVtZW50LnNwYXJrbGluZSgnaHRtbCcsIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmKG9wdGlvbnMucmVzaXplKSB7XG4gICAgICAgICAgJCgkd2luZG93KS5yZXNpemUoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRlbGVtZW50LnNwYXJrbGluZSgnaHRtbCcsIG9wdGlvbnMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG4gICAgXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgLm1vZHVsZSgnYXBwLmNvc3RzJylcbiAgICAgIC5jb250cm9sbGVyKCdDb3N0c0NvbnRyb2xsZXInLCBDb3N0c0NvbnRyb2xsZXIpXG4gICAgICAuY29udHJvbGxlcignQ29zdENhdGVnb3JpZXNDb250cm9sbGVyJywgQ29zdENhdGVnb3JpZXNDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ2Nvc3REaWFsb2dDb250cm9sbGVyJywgY29zdERpYWxvZ0NvbnRyb2xsZXIpXG4gICAgO1xuICAgICAgXG4gICAgQ29zdHNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdDb3N0JywgJ25nVGFibGVQYXJhbXMnLCAnbmdUYWJsZUxCU2VydmljZScsICdTd2VldEFsZXJ0JywgJ25nRGlhbG9nJ107XG4gICAgZnVuY3Rpb24gQ29zdHNDb250cm9sbGVyKCRzY29wZSwgQ29zdCwgbmdUYWJsZVBhcmFtcywgbmdUYWJsZUxCU2VydmljZSwgU3dlZXRBbGVydCwgbmdEaWFsb2cpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgIHZtLmR0ID0ge1xuICAgICAgICBvcHRpb25zOiB7IFxuICAgICAgICAgIGZvcm1hdFllYXI6ICd5eScsXG4gICAgICAgICAgbWF4RGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZSgyMDE2LDEsMSksXG4gICAgICAgICAgc3RhcnRpbmdEYXk6IDFcbiAgICAgICAgfSxcbiAgICAgICAgYmVnaW46IHtcbiAgICAgICAgICBkdDogbmV3IERhdGUobW9tZW50KCkuc3RhcnRPZignbW9udGgnKSksXG4gICAgICAgICAgb3BlbjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgZW5kOiB7XG4gICAgICAgICAgZHQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgb3BlbjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgdm0udGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7Y291bnQ6IDEwfSwge1xuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCRkZWZlciwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyID0ge3doZXJlOntcbiAgICAgICAgICAgICAgc3RhdHVzOntuZTonZGVsZXRlZCd9LFxuICAgICAgICAgICAgICBtb2RpZmllZDoge2JldHdlZW46IFtcbiAgICAgICAgICAgICAgICBtb21lbnQodm0uZHQuYmVnaW4uZHQpLnN0YXJ0T2YoJ2RheScpLCBcbiAgICAgICAgICAgICAgICBtb21lbnQodm0uZHQuZW5kLmR0KS5lbmRPZignZGF5JylcbiAgICAgICAgICAgICAgXX1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBuZ1RhYmxlTEJTZXJ2aWNlLmdldERhdGEoJGRlZmVyLCBwYXJhbXMsIENvc3QsIGZpbHRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgfVxuXG4gICAgICB2bS5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG5nRGlhbG9nLm9wZW4oeyBcbiAgICAgICAgICB0ZW1wbGF0ZTogJ2Nvc3REaWFsb2dJZCcsIFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdjb3N0RGlhbG9nQ29udHJvbGxlcidcbiAgICAgICAgfSkuY2xvc2VQcm9taXNlLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICB2bS50YWJsZVBhcmFtcy5yZWxvYWQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmVkaXQgPSBmdW5jdGlvbiAoZW50aXR5KSB7XG4gICAgICAgICRzY29wZS5kYXRhID0gZW50aXR5O1xuICAgICAgICBuZ0RpYWxvZy5vcGVuKHsgXG4gICAgICAgICAgdGVtcGxhdGU6ICdjb3N0RGlhbG9nSWQnLCBcbiAgICAgICAgICBjb250cm9sbGVyOiAnY29zdERpYWxvZ0NvbnRyb2xsZXInLFxuICAgICAgICAgIHNjb3BlOiAkc2NvcGVcbiAgICAgICAgfSkuY2xvc2VQcm9taXNlLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICB2bS50YWJsZVBhcmFtcy5yZWxvYWQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmRlbGV0ZSA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICAgICAgU3dlZXRBbGVydC5zd2FsKHsgICBcbiAgICAgICAgICB0aXRsZTogJ+ehruiupOWIoOmZpO+8nycsICAgXG4gICAgICAgICAgdGV4dDogJ+WIoOmZpOS7peWQjuWwhuaBouWkje+8gScsICAgXG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLCAgIFxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsICAgXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiAnI0RENkI1NScsICAgXG4gICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICfmmK/nmoTvvIzliKDpmaTvvIEnLFxuICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6ICfkuI3vvIzlhYjkuI3liKAhJyxcbiAgICAgICAgICAvLyBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgfSwgZnVuY3Rpb24gKGlzQ29uZmlybSkge1xuICAgICAgICAgIGlmKGlzQ29uZmlybSkge1xuICAgICAgICAgICAgQ29zdC5kZWxldGVCeUlkKHtpZDogZW50aXR5LmlkfSk7XG4gICAgICAgICAgICB2bS50YWJsZVBhcmFtcy5yZWxvYWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBDb3N0Q2F0ZWdvcmllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0Nvc3RjYXRlZ29yeScsICdTd2VldEFsZXJ0J107XG4gICAgZnVuY3Rpb24gQ29zdENhdGVnb3JpZXNDb250cm9sbGVyKCRzY29wZSwgQ29zdGNhdGVnb3J5LCBTd2VldEFsZXJ0KSB7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuICAgICAgICB2bS5jYXRlZ29yaWVzID0gQ29zdGNhdGVnb3J5LmZpbmQoe2ZpbHRlcjoge1xuICAgICAgICAgIG9yZGVyOiBcIm5hbWUgREVTQ1wiLFxuICAgICAgICAgIHdoZXJlOiB7c3RhdHVzOntuZTonZGVsZXRlZCd9fVxuICAgICAgICB9fSk7XG5cbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0ucmVsb2FkID0gYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gZGVsZXRlQWxlcnQoY2FsbGJhY2spIHtcbiAgICAgICAgU3dlZXRBbGVydC5zd2FsKHsgICBcbiAgICAgICAgICB0aXRsZTogJ+ehruiupOWIoOmZpO+8nycsICAgXG4gICAgICAgICAgdGV4dDogJ+WIoOmZpOS7peWQjuWwhuaXoOazleS9v+eUqOWIhuexu+S6hu+8gScsICAgXG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLCAgIFxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsICAgXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiAnI0RENkI1NScsICAgXG4gICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICfmmK/nmoTvvIzliKDpmaTvvIEnLFxuICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6ICfkuI3vvIzlhYjkuI3liKAhJyxcbiAgICAgICAgICAvLyBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5hZGRDYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuICAgICAgICBpZihjYXRlZ29yeSAmJiBjYXRlZ29yeSAhPSAnJykge1xuICAgICAgICAgIENvc3RjYXRlZ29yeS5jcmVhdGUoe25hbWU6IGNhdGVnb3J5fSkuJHByb21pc2UudGhlbihhY3RpdmF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0udXBkYXRlQ2F0ZWdvcnkgPSBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcbiAgICAgICAgQ29zdGNhdGVnb3J5LnByb3RvdHlwZSR1cGRhdGVBdHRyaWJ1dGVzKHtpZDogY2F0ZWdvcnkuaWR9LCB7XG4gICAgICAgICAgc3RhdHVzOiBjYXRlZ29yeS5zdGF0dXMsXG4gICAgICAgICAgbmFtZTogY2F0ZWdvcnkubmFtZSxcbiAgICAgICAgICBzdWJzOiBjYXRlZ29yeS5zdWJzXG4gICAgICAgIH0pLiRwcm9taXNlLnRoZW4oYWN0aXZhdGUpO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5kZWxldGVDYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuICAgICAgICBkZWxldGVBbGVydChmdW5jdGlvbiAoaXNDb25maXJtKSB7XG4gICAgICAgICAgaWYoaXNDb25maXJtKSB7XG4gICAgICAgICAgICBjYXRlZ29yeS5zdGF0dXMgPSAnZGVsZXRlZCc7XG4gICAgICAgICAgICB2bS51cGRhdGVDYXRlZ29yeShjYXRlZ29yeSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5hZGRTdWJDYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSwgc3ViY2F0ZWdvcnkpIHtcbiAgICAgICAgaWYoc3ViY2F0ZWdvcnkgJiYgc3ViY2F0ZWdvcnkgIT0gJycgJiYgY2F0ZWdvcnkuc3Vicy5pbmRleE9mKHN1YmNhdGVnb3J5KSA9PT0gLTEpIHtcbiAgICAgICAgICBjYXRlZ29yeS5zdWJzLnB1c2goc3ViY2F0ZWdvcnkpO1xuICAgICAgICAgIHZtLnVwZGF0ZUNhdGVnb3J5KGNhdGVnb3J5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5kZWxldGVTdWJjYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSwgaW5kZXgpIHtcbiAgICAgICAgLy8gdmFyIGluZGV4ID0gY2F0ZWdvcnkuc3Vicy5pbmRleE9mKHN1YmNhdGVnb3J5KTtcbiAgICAgICAgZGVsZXRlQWxlcnQoZnVuY3Rpb24gKGlzQ29uZmlybSkge1xuICAgICAgICAgIGlmKGlzQ29uZmlybSkge1xuICAgICAgICAgICAgY2F0ZWdvcnkuc3Vicy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgdm0udXBkYXRlQ2F0ZWdvcnkoY2F0ZWdvcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29zdERpYWxvZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ25nRGlhbG9nJywgJ0Nvc3QnLCAnU3dlZXRBbGVydCcsICdDb3N0Y2F0ZWdvcnknLCAndG9hc3RlciddO1xuICAgIGZ1bmN0aW9uIGNvc3REaWFsb2dDb250cm9sbGVyKCRzY29wZSwgbmdEaWFsb2csIENvc3QsIFN3ZWV0QWxlcnQsIENvc3RjYXRlZ29yeSwgdG9hc3Rlcikge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICRzY29wZS5jYXRlZ29yaWVzID0gQ29zdGNhdGVnb3J5LmZpbmQoe2ZpbHRlcjoge1xuICAgICAgICAgICAgb3JkZXI6IFwibmFtZSBERVNDXCIsXG4gICAgICAgICAgICB3aGVyZToge3N0YXR1czp7bmU6J2RlbGV0ZWQnfX1cbiAgICAgICAgICB9fSk7XG4gICAgICAgICAgJHNjb3BlLmRhdGEgPSAkc2NvcGUuZGF0YSB8fCB7XG4gICAgICAgICAgICBjYXRlZ29yeTogJ+ivt+mAieaLqScsXG4gICAgICAgICAgICBzdWJjYXRlZ29yeTogJ+WIhuexuycsXG4gICAgICAgICAgICBhbW91bnQ6IDBcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNldENhdGVnb3J5ID0gZnVuY3Rpb24gKGMsIHMpIHtcbiAgICAgICAgICAkc2NvcGUuZGF0YS5jYXRlZ29yeSA9IGM7XG4gICAgICAgICAgJHNjb3BlLmRhdGEuc3ViY2F0ZWdvcnkgPSBzO1xuICAgICAgICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5jb25maXJtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmKCRzY29wZS5kYXRhLmFtb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxldGUgJHNjb3BlLmRhdGEubWVyY2hhbnRJZDtcbiAgICAgICAgICBkZWxldGUgJHNjb3BlLmRhdGEuc2hvcElkO1xuICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuZGF0YS5jcmVhdGVkO1xuICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuZGF0YS5vcGVyYXRvcjtcbiAgICAgICAgICBDb3N0LnVwc2VydCgkc2NvcGUuZGF0YSkuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBuZ0RpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAn5oiQ5YqfJywgXCLlrozmiJDmlK/lh7rnmbvorrBcIik7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgJ+Wksei0pScsIFwi5pSv5Ye655m76K6w5pyq5a6M5oiQ77yM6K+36YeN6K+V77yBXCIpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJHNjb3BlLnN1Ym1pdGluZyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuY29yZScpXHJcbiAgICAgICAgLmNvbmZpZyhjb3JlQ29uZmlnKVxyXG4gICAgICAgIC5jb25maWcobG9vcGJhY2tDb25maWcpXHJcbiAgICA7XHJcblxyXG4gICAgY29yZUNvbmZpZy4kaW5qZWN0ID0gWyckY29udHJvbGxlclByb3ZpZGVyJywgJyRjb21waWxlUHJvdmlkZXInLCAnJGZpbHRlclByb3ZpZGVyJywgJyRwcm92aWRlJywgJyRodHRwUHJvdmlkZXInXTtcclxuICAgIGZ1bmN0aW9uIGNvcmVDb25maWcoJGNvbnRyb2xsZXJQcm92aWRlciwgJGNvbXBpbGVQcm92aWRlciwgJGZpbHRlclByb3ZpZGVyLCAkcHJvdmlkZSwgJGh0dHBQcm92aWRlcil7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgY29yZSA9IGFuZ3VsYXIubW9kdWxlKCdhcHAuY29yZScpO1xyXG4gICAgICAvLyByZWdpc3RlcmluZyBjb21wb25lbnRzIGFmdGVyIGJvb3RzdHJhcFxyXG4gICAgICBjb3JlLmNvbnRyb2xsZXIgPSAkY29udHJvbGxlclByb3ZpZGVyLnJlZ2lzdGVyO1xyXG4gICAgICBjb3JlLmRpcmVjdGl2ZSAgPSAkY29tcGlsZVByb3ZpZGVyLmRpcmVjdGl2ZTtcclxuICAgICAgY29yZS5maWx0ZXIgICAgID0gJGZpbHRlclByb3ZpZGVyLnJlZ2lzdGVyO1xyXG4gICAgICBjb3JlLmZhY3RvcnkgICAgPSAkcHJvdmlkZS5mYWN0b3J5O1xyXG4gICAgICBjb3JlLnNlcnZpY2UgICAgPSAkcHJvdmlkZS5zZXJ2aWNlO1xyXG4gICAgICBjb3JlLmNvbnN0YW50ICAgPSAkcHJvdmlkZS5jb25zdGFudDtcclxuICAgICAgY29yZS52YWx1ZSAgICAgID0gJHByb3ZpZGUudmFsdWU7XHJcblxyXG4gICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKGZ1bmN0aW9uKCRxLCAkbG9jYXRpb24sIExvb3BCYWNrQXV0aCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbihyZWplY3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKHJlamVjdGlvbi5zdGF0dXMgPT0gNDAxKSB7XHJcbiAgICAgICAgICAgICAgTG9vcEJhY2tBdXRoLmNsZWFyVXNlcigpO1xyXG4gICAgICAgICAgICAgIExvb3BCYWNrQXV0aC5jbGVhclN0b3JhZ2UoKTtcclxuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BhZ2UvbG9naW4nKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICB9KTsgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBsb29wYmFja0NvbmZpZy4kaW5qZWN0ID0gWydMb29wQmFja1Jlc291cmNlUHJvdmlkZXInLCAndXJsQmFzZSddO1xyXG4gICAgZnVuY3Rpb24gbG9vcGJhY2tDb25maWcoTG9vcEJhY2tSZXNvdXJjZVByb3ZpZGVyLCB1cmxCYXNlKSB7XHJcbiAgICAgIExvb3BCYWNrUmVzb3VyY2VQcm92aWRlci5zZXRVcmxCYXNlKHVybEJhc2UpO1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBjb25zdGFudHMuanNcclxuICogRGVmaW5lIGNvbnN0YW50cyB0byBpbmplY3QgYWNyb3NzIHRoZSBhcHBsaWNhdGlvblxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvcmUnKVxyXG4gICAgICAgIC5jb25zdGFudCgnQVBQX01FRElBUVVFUlknLCB7XHJcbiAgICAgICAgICAnZGVza3RvcExHJzogICAgICAgICAgICAgMTIwMCxcclxuICAgICAgICAgICdkZXNrdG9wJzogICAgICAgICAgICAgICAgOTkyLFxyXG4gICAgICAgICAgJ3RhYmxldCc6ICAgICAgICAgICAgICAgICA3NjgsXHJcbiAgICAgICAgICAnbW9iaWxlJzogICAgICAgICAgICAgICAgIDQ4MFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNvbnN0YW50KCd1cmxCYXNlJywgXCJodHRwOi8vMC4wLjAuMDozMDAwL2FwaVwiKVxyXG4gICAgICAgIC8vIC5jb25zdGFudCgndXJsQmFzZScsIFwiaHR0cDovL2FwaS5mYW5rYWh1aS5jb206MzAwMC9hcGlcIilcclxuICAgICAgO1xyXG5cclxufSkoKTsiLCIvKipcbiAqIEFuZ3VsYXJKUyBkZWZhdWx0IGZpbHRlciB3aXRoIHRoZSBmb2xsb3dpbmcgZXhwcmVzc2lvbjpcbiAqIFwicGVyc29uIGluIHBlb3BsZSB8IGZpbHRlcjoge25hbWU6ICRzZWxlY3Quc2VhcmNoLCBhZ2U6ICRzZWxlY3Quc2VhcmNofVwiXG4gKiBwZXJmb3JtcyBhIEFORCBiZXR3ZWVuICduYW1lOiAkc2VsZWN0LnNlYXJjaCcgYW5kICdhZ2U6ICRzZWxlY3Quc2VhcmNoJy5cbiAqIFdlIHdhbnQgdG8gcGVyZm9ybSBhIE9SLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb3JlJylcbiAgICAgICAgLmZpbHRlcigncm9sZScsIHJvbGVGaWx0ZXIpXG4gICAgO1xuXG4gICAgZnVuY3Rpb24gcm9sZUZpbHRlcigpIHtcbiAgICAgICAgdmFyIHJvbGUgPSB7XG4gICAgICAgICAgb3duZXI6IFwi6ICB5p2/XCIsXG4gICAgICAgICAgc2hvcE1hbmFnZXI6IFwi5bqX6ZW/XCIsXG4gICAgICAgICAgY2FzaGllcjogXCLmlLbpk7blkZhcIlxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHJvbGVba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuY29yZScpXHJcbiAgICAgICAgLnJ1bihhcHBSdW4pXHJcbiAgICAgICAgLnJ1bihjdXJyZW50VXNlclJ1bilcclxuICAgIDtcclxuXHJcbiAgICBhcHBSdW4uJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJHN0YXRlUGFyYW1zJywgICckd2luZG93JywgJyR0ZW1wbGF0ZUNhY2hlJywgJ0NvbG9ycyddO1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBhcHBSdW4oJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICR3aW5kb3csICR0ZW1wbGF0ZUNhY2hlLCBDb2xvcnMpIHtcclxuICAgICAgXHJcbiAgICAgIC8vIFNldCByZWZlcmVuY2UgdG8gYWNjZXNzIHRoZW0gZnJvbSBhbnkgc2NvcGVcclxuICAgICAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGU7XHJcbiAgICAgICRyb290U2NvcGUuJHN0YXRlUGFyYW1zID0gJHN0YXRlUGFyYW1zO1xyXG4gICAgICAkcm9vdFNjb3BlLiRzdG9yYWdlID0gJHdpbmRvdy5sb2NhbFN0b3JhZ2U7XHJcblxyXG4gICAgICAvLyBVbmNvbW1lbnQgdGhpcyB0byBkaXNhYmxlIHRlbXBsYXRlIGNhY2hlXHJcbiAgICAgIC8qJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcclxuICAgICAgICAgIGlmICh0eXBlb2YodG9TdGF0ZSkgIT09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgJHRlbXBsYXRlQ2FjaGUucmVtb3ZlKHRvU3RhdGUudGVtcGxhdGVVcmwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9KTsqL1xyXG5cclxuICAgICAgLy8gQWxsb3dzIHRvIHVzZSBicmFuZGluZyBjb2xvciB3aXRoIGludGVycG9sYXRpb25cclxuICAgICAgLy8ge3sgY29sb3JCeU5hbWUoJ3ByaW1hcnknKSB9fVxyXG4gICAgICAkcm9vdFNjb3BlLmNvbG9yQnlOYW1lID0gQ29sb3JzLmJ5TmFtZTtcclxuXHJcbiAgICAgIC8vIGNhbmNlbCBjbGljayBldmVudCBlYXNpbHlcclxuICAgICAgJHJvb3RTY29wZS5jYW5jZWwgPSBmdW5jdGlvbigkZXZlbnQpIHtcclxuICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBIb29rcyBFeGFtcGxlXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuICAgICAgLy8gSG9vayBub3QgZm91bmRcclxuICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZU5vdEZvdW5kJyxcclxuICAgICAgICBmdW5jdGlvbihldmVudCwgdW5mb3VuZFN0YXRlLyosIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyovKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVuZm91bmRTdGF0ZS50byk7IC8vIFwibGF6eS5zdGF0ZVwiXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVuZm91bmRTdGF0ZS50b1BhcmFtcyk7IC8vIHthOjEsIGI6Mn1cclxuICAgICAgICAgICAgY29uc29sZS5sb2codW5mb3VuZFN0YXRlLm9wdGlvbnMpOyAvLyB7aW5oZXJpdDpmYWxzZX0gKyBkZWZhdWx0IG9wdGlvbnNcclxuICAgICAgICB9KTtcclxuICAgICAgLy8gSG9vayBlcnJvclxyXG4gICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLFxyXG4gICAgICAgIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvcil7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIC8vIEhvb2sgc3VjY2Vzc1xyXG4gICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsXHJcbiAgICAgICAgZnVuY3Rpb24oLypldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyovKSB7XHJcbiAgICAgICAgICAvLyBkaXNwbGF5IG5ldyB2aWV3IGZyb20gdG9wXHJcbiAgICAgICAgICAkd2luZG93LnNjcm9sbFRvKDAsIDApO1xyXG4gICAgICAgICAgLy8gU2F2ZSB0aGUgcm91dGUgdGl0bGVcclxuICAgICAgICAgICRyb290U2NvcGUuY3VyclRpdGxlID0gJHN0YXRlLmN1cnJlbnQudGl0bGU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBMb2FkIGEgdGl0bGUgZHluYW1pY2FsbHlcclxuICAgICAgJHJvb3RTY29wZS5jdXJyVGl0bGUgPSAkc3RhdGUuY3VycmVudC50aXRsZTtcclxuICAgICAgJHJvb3RTY29wZS5wYWdlVGl0bGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdGl0bGUgPSAkcm9vdFNjb3BlLmFwcC5uYW1lICsgJyAtICcgKyAoJHJvb3RTY29wZS5jdXJyVGl0bGUgfHwgJHJvb3RTY29wZS5hcHAuZGVzY3JpcHRpb24pO1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgcmV0dXJuIHRpdGxlO1xyXG4gICAgICB9OyAgICAgIFxyXG5cclxuICAgIH1cclxuXHJcbiAgICBjdXJyZW50VXNlclJ1bi4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ1VzZXInLCAnJGZpbHRlciddO1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBjdXJyZW50VXNlclJ1bigkcm9vdFNjb3BlLCBVc2VyLCAkZmlsdGVyKSB7XHJcbiAgICAgIFxyXG4gICAgICB1c2VyRGlkTG9naW5lZCgpO1xyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gdXNlckRpZExvZ2luZWQoKSB7XHJcbiAgICAgICAgaWYoVXNlci5pc0F1dGhlbnRpY2F0ZWQoKSkge1xyXG4gICAgICAgICAgVXNlci5maW5kQnlJZCh7aWQ6IFVzZXIuZ2V0Q3VycmVudElkKCksIGZpbHRlcjp7aW5jbHVkZTpbJ3Nob3AnLCAnbWVyY2hhbnQnXX19KVxyXG4gICAgICAgICAgLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICAgICAgdXNlci5qb2IgPSAkZmlsdGVyKCdyb2xlJykodXNlci5yb2xlKTtcclxuICAgICAgICAgICAgdXNlci5uYW1lID0gdXNlci5uYW1lIHx8IHVzZXIudXNlcm5hbWU7XHJcbiAgICAgICAgICAgIHVzZXIucGljdHVyZSA9ICdhcHAvaW1nL2R1bW15LnBuZyc7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUudXNlciA9IHVzZXI7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICRyb290U2NvcGUuJG9uKCdVc2VyLmxvZ2luZWQnLCB1c2VyRGlkTG9naW5lZCk7XHJcbiAgICAgIFxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuZGFzaGJvYXJkJylcclxuICAgICAgICAuY29udHJvbGxlcignRGFzaGJvYXJkQ29udHJvbGxlcicsIERhc2hib2FyZENvbnRyb2xsZXIpO1xyXG5cclxuICAgIERhc2hib2FyZENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0NoYXJ0RGF0YScsICckdGltZW91dCcsICdDaGVja2luJywgJ0RlYWwnLCAnUGF5bWVudCddO1xyXG4gICAgZnVuY3Rpb24gRGFzaGJvYXJkQ29udHJvbGxlcigkc2NvcGUsIENoYXJ0RGF0YSwgJHRpbWVvdXQsIENoZWNraW4sIERlYWwsIFBheW1lbnQpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBTZXQgTW9tZW50IGxvY2FsZVxyXG4gICAgICAgIG1vbWVudC5sb2NhbGUoJ3poLWNuJyk7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmKCEkc2NvcGUudXNlcikgcmV0dXJuO1xyXG5cclxuICAgICAgICAgIC8vIFN0YXRpc3RpY1xyXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICAgICAgICB2bS5zdGF0RGF0YSA9IHthbW91bnQ6IDAsIHF0eTogMCwgZGVwb3NpdDogMH07XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIERlYWwuc3RhdCh7ZmlsdGVyOnt3aGVyZTp7c3RhdHVzOiAnY2xvc2VkJywgXCJwYXltZW50LmFtb3VudFwiOiB7JGd0OiAwfX19fSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBpZihyZXMubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZtLnN0YXREYXRhLmFtb3VudCA9IHJlc1swXS5hbW91bnQ7XHJcbiAgICAgICAgICAgIHZtLnN0YXREYXRhLnF0eSA9IHJlc1swXS5xdHk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgUGF5bWVudC5zdGF0KHtmaWx0ZXI6e3doZXJlOntzdGF0dXM6ICdjbG9zZWQnLCBjYXRlZ29yeTogJ2RlcG9zaXQnfX19LCBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGlmKHJlcy5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgICAgICAgICAgdm0uc3RhdERhdGEuZGVwb3NpdCA9IHJlc1swXS5hbW91bnQ7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLy8gQ0hFQ0tJTlxyXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICAgICAgICB2bS5jaGVja2lucyA9IENoZWNraW4uZmluZCh7ZmlsdGVyOntcclxuICAgICAgICAgICAgd2hlcmU6IHttZXJjaGFudElkOiAkc2NvcGUudXNlci5zaG9wSWR9LFxyXG4gICAgICAgICAgICBpbmNsdWRlOiBbe21lbWJlcjogJ3d4dXNlcid9XSxcclxuICAgICAgICAgICAgbGltaXQ6IDEwLCBcclxuICAgICAgICAgICAgb3JkZXI6ICdjcmVhdGVkIERFU0MnXHJcbiAgICAgICAgICB9fSk7XHJcblxyXG4gICAgICAgICAgLy8gU1BMSU5FXHJcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuICAgICAgICAgIHZtLnNwbGluZURhdGEgPSBDaGFydERhdGEubG9hZCgnc2VydmVyL2NoYXJ0L3NwbGluZS5qc29uJyk7XHJcbiAgICAgICAgICB2bS5zcGxpbmVPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgIHNlcmllczoge1xyXG4gICAgICAgICAgICAgICAgICBsaW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgcG9pbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiA0XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIHNwbGluZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiAwLjQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICBmaWxsOiAwLjVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJyNlZWUnLFxyXG4gICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMSxcclxuICAgICAgICAgICAgICAgICAgaG92ZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmNmY2ZjJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDogdHJ1ZSxcclxuICAgICAgICAgICAgICB0b29sdGlwT3B0czoge1xyXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiBmdW5jdGlvbiAobGFiZWwsIHgsIHkpIHsgcmV0dXJuIHggKyAnIDogJyArIHk7IH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHhheGlzOiB7XHJcbiAgICAgICAgICAgICAgICAgIHRpY2tDb2xvcjogJyNmY2ZjZmMnLFxyXG4gICAgICAgICAgICAgICAgICBtb2RlOiAnY2F0ZWdvcmllcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHlheGlzOiB7XHJcbiAgICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgICAgbWF4OiAxNTAsIC8vIG9wdGlvbmFsOiB1c2UgaXQgZm9yIGEgY2xlYXIgcmVwcmVzZXRhdGlvblxyXG4gICAgICAgICAgICAgICAgICB0aWNrQ29sb3I6ICcjZWVlJyxcclxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICgkc2NvcGUuYXBwLmxheW91dC5pc1JUTCA/ICdyaWdodCcgOiAnbGVmdCcpLFxyXG4gICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0dGVyOiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHYvKiArICcgdmlzaXRvcnMnKi87XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHNoYWRvd1NpemU6IDBcclxuICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgIC8vIFBBTkVMIFJFRlJFU0ggRVZFTlRTXHJcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuXHJcbiAgICAgICAgICAkc2NvcGUuJG9uKCdwYW5lbC1yZWZyZXNoJywgZnVuY3Rpb24oZXZlbnQsIGlkKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2ltdWxhdGluZyBjaGFydCByZWZyZXNoIGR1cmluZyAzcyBvbiAjJytpZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBJbnN0ZWFkIG9mIHRpbWVvdXQgeW91IGNhbiByZXF1ZXN0IGEgY2hhcnQgZGF0YVxyXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIC8vIGRpcmVjdGl2ZSBsaXN0ZW4gZm9yIHRvIHJlbW92ZSB0aGUgc3Bpbm5lciBcclxuICAgICAgICAgICAgICAvLyBhZnRlciB3ZSBlbmQgdXAgdG8gcGVyZm9ybSBvd24gb3BlcmF0aW9uc1xyXG4gICAgICAgICAgICAgICRzY29wZS4kYnJvYWRjYXN0KCdyZW1vdmVTcGlubmVyJywgaWQpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZWZyZXNoZWQgIycgKyBpZCk7XHJcblxyXG4gICAgICAgICAgICB9LCAzMDAwKTtcclxuXHJcbiAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgLy8gUEFORUwgRElTTUlTUyBFVkVOVFNcclxuICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuICAgICAgICAgIC8vIEJlZm9yZSByZW1vdmUgcGFuZWxcclxuICAgICAgICAgICRzY29wZS4kb24oJ3BhbmVsLXJlbW92ZScsIGZ1bmN0aW9uKGV2ZW50LCBpZCwgZGVmZXJyZWQpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BhbmVsICMnICsgaWQgKyAnIHJlbW92aW5nJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBIZXJlIGlzIG9ibGlnYXRvcnkgdG8gY2FsbCB0aGUgcmVzb2x2ZSgpIGlmIHdlIHByZXRlbmQgdG8gcmVtb3ZlIHRoZSBwYW5lbCBmaW5hbGx5XHJcbiAgICAgICAgICAgIC8vIE5vdCBjYWxsaW5nIHJlc29sdmUoKSB3aWxsIE5PVCByZW1vdmUgdGhlIHBhbmVsXHJcbiAgICAgICAgICAgIC8vIEl0J3MgdXAgdG8geW91ciBhcHAgdG8gZGVjaWRlIGlmIHBhbmVsIHNob3VsZCBiZSByZW1vdmVkIG9yIG5vdFxyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIC8vIFBhbmVsIHJlbW92ZWQgKCBvbmx5IGlmIGFib3ZlIHdhcyByZXNvbHZlZCgpIClcclxuICAgICAgICAgICRzY29wZS4kb24oJ3BhbmVsLXJlbW92ZWQnLCBmdW5jdGlvbihldmVudCwgaWQpe1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BhbmVsICMnICsgaWQgKyAnIHJlbW92ZWQnKTtcclxuXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICRzY29wZS4kb24oJ1VzZXIubG9naW5lZCcsIGFjdGl2YXRlKTtcclxuICAgICAgICBcclxuICAgIH1cclxufSkoKTsiLCIvKipcbiAqIEFuZ3VsYXJKUyBkZWZhdWx0IGZpbHRlciB3aXRoIHRoZSBmb2xsb3dpbmcgZXhwcmVzc2lvbjpcbiAqIFwicGVyc29uIGluIHBlb3BsZSB8IGZpbHRlcjoge25hbWU6ICRzZWxlY3Quc2VhcmNoLCBhZ2U6ICRzZWxlY3Quc2VhcmNofVwiXG4gKiBwZXJmb3JtcyBhIEFORCBiZXR3ZWVuICduYW1lOiAkc2VsZWN0LnNlYXJjaCcgYW5kICdhZ2U6ICRzZWxlY3Quc2VhcmNoJy5cbiAqIFdlIHdhbnQgdG8gcGVyZm9ybSBhIE9SLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5kYXNoYm9hcmQnKVxuICAgICAgICAuZmlsdGVyKCdtb21lbnRfdW5peCcsIG1vbWVudFVuaXhGaWx0ZXIpXG4gICAgICAgIC5maWx0ZXIoJ21vbWVudF9mcm9tX25vdycsIG1vbWVudEZyb21Ob3dGaWx0ZXIpXG4gICAgICAgIC5maWx0ZXIoJ21vbWVudF91bml4X2Zyb21fbm93JywgbW9tZW50VW5peEZyb21Ob3dGaWx0ZXIpXG4gICAgO1xuXG4gICAgZnVuY3Rpb24gbW9tZW50VW5peEZpbHRlcihpbnB1dCwgZm9ybWF0KSB7XG4gICAgICByZXR1cm4gbW9tZW50LnVuaXgoaW5wdXQpLmZvcm1hdChmb3JtYXQgfHwgJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gbW9tZW50RnJvbU5vd0ZpbHRlcigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudChpbnB1dCkuZnJvbU5vdygpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRVbml4RnJvbU5vd0ZpbHRlcihpbnB1dCkge1xuICAgICAgcmV0dXJuIG1vbWVudC51bml4KGlucHV0KS5mcm9tTm93KCk7XG4gICAgfVxuXG59KSgpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBzY3JvbGwuanNcbiAqIE1ha2UgYSBjb250ZW50IGJveCBzY3JvbGxhYmxlXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmVsZW1lbnRzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnc2Nyb2xsYWJsZScsIHNjcm9sbGFibGUpO1xuXG4gICAgZnVuY3Rpb24gc2Nyb2xsYWJsZSAoKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIHZhciBkZWZhdWx0SGVpZ2h0ID0gMjUwO1xuICAgICAgICAgIGVsZW1lbnQuc2xpbVNjcm9sbCh7XG4gICAgICAgICAgICAgIGhlaWdodDogKGF0dHJzLmhlaWdodCB8fCBkZWZhdWx0SGVpZ2h0KVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogZmlsZXN0eWxlLmpzXHJcbiAqIEluaXRpYWxpemVzIHRoZSBmaWVsc3R5bGUgcGx1Z2luXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuZm9ybXMnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2ZpbGVzdHlsZScsIGZpbGVzdHlsZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gZmlsZXN0eWxlICgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICB2YXIgb3B0aW9ucyA9IGVsZW1lbnQuZGF0YSgpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBvbGQgdXNhZ2Ugc3VwcG9ydFxyXG4gICAgICAgICAgb3B0aW9ucy5jbGFzc0lucHV0ID0gZWxlbWVudC5kYXRhKCdjbGFzc2lucHV0JykgfHwgb3B0aW9ucy5jbGFzc0lucHV0O1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBlbGVtZW50LmZpbGVzdHlsZShvcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBmb3JtLXdpemFyZC5qc1xyXG4gKiBIYW5kbGVzIGZvcm0gd2l6YXJkIHBsdWdpbiBhbmQgdmFsaWRhdGlvblxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mb3JtcycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZm9ybVdpemFyZCcsIGZvcm1XaXphcmQpO1xyXG5cclxuICAgIGZvcm1XaXphcmQuJGluamVjdCA9IFsnJHBhcnNlJ107XHJcbiAgICBmdW5jdGlvbiBmb3JtV2l6YXJkICgkcGFyc2UpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZTogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgIHZhciB2YWxpZGF0ZSA9ICRwYXJzZShhdHRycy52YWxpZGF0ZVN0ZXBzKShzY29wZSksXHJcbiAgICAgICAgICAgICAgd2l6ID0gbmV3IFdpemFyZChhdHRycy5zdGVwcywgISF2YWxpZGF0ZSwgZWxlbWVudCk7XHJcbiAgICAgICAgICBzY29wZS53aXphcmQgPSB3aXouaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gV2l6YXJkIChxdWFudGl0eSwgdmFsaWRhdGUsIGVsZW1lbnQpIHtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgc2VsZi5xdWFudGl0eSA9IHBhcnNlSW50KHF1YW50aXR5LDEwKTtcclxuICAgICAgICAgIHNlbGYudmFsaWRhdGUgPSB2YWxpZGF0ZTtcclxuICAgICAgICAgIHNlbGYuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZWxmLmNyZWF0ZXN0ZXBzKHNlbGYucXVhbnRpdHkpO1xyXG4gICAgICAgICAgICBzZWxmLmdvKDEpOyAvLyBhbHdheXMgc3RhcnQgYXQgZmlzdCBzdGVwXHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBzZWxmLmdvID0gZnVuY3Rpb24oc3RlcCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCBhbmd1bGFyLmlzRGVmaW5lZChzZWxmLnN0ZXBzW3N0ZXBdKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgaWYoc2VsZi52YWxpZGF0ZSAmJiBzdGVwICE9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm9ybSA9ICQoc2VsZi5lbGVtZW50KSxcclxuICAgICAgICAgICAgICAgICAgICBncm91cCA9IGZvcm0uY2hpbGRyZW4oKS5jaGlsZHJlbignZGl2JykuZ2V0KHN0ZXAgLSAyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGZvcm0ucGFyc2xleSgpLnZhbGlkYXRlKCBncm91cC5pZCApKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHNlbGYuY2xlYW5hbGwoKTtcclxuICAgICAgICAgICAgICBzZWxmLnN0ZXBzW3N0ZXBdID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBzZWxmLmFjdGl2ZSA9IGZ1bmN0aW9uKHN0ZXApIHtcclxuICAgICAgICAgICAgcmV0dXJuICEhc2VsZi5zdGVwc1tzdGVwXTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgc2VsZi5jbGVhbmFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgaW4gc2VsZi5zdGVwcyl7XHJcbiAgICAgICAgICAgICAgc2VsZi5zdGVwc1tpXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHNlbGYuY3JlYXRlc3RlcHMgPSBmdW5jdGlvbihxKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RlcHMgPSBbXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMTsgaSA8PSBxOyBpKyspIHNlbGYuc3RlcHNbaV0gPSBmYWxzZTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogbWFza2VkLGpzXG4gKiBJbml0aWFsaXplcyB0aGUgbWFza2VkIGlucHV0c1xuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mb3JtcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ21hc2tlZCcsIG1hc2tlZCk7XG5cbiAgICBmdW5jdGlvbiBtYXNrZWQgKCkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgdmFyICRlbGVtID0gJChlbGVtZW50KTtcbiAgICAgICAgICBpZigkLmZuLmlucHV0bWFzaylcbiAgICAgICAgICAgICRlbGVtLmlucHV0bWFzaygpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXHJcbiAqIEFuZ3VsYXJKUyBkZWZhdWx0IGZpbHRlciB3aXRoIHRoZSBmb2xsb3dpbmcgZXhwcmVzc2lvbjpcclxuICogXCJwZXJzb24gaW4gcGVvcGxlIHwgZmlsdGVyOiB7bmFtZTogJHNlbGVjdC5zZWFyY2gsIGFnZTogJHNlbGVjdC5zZWFyY2h9XCJcclxuICogcGVyZm9ybXMgYSBBTkQgYmV0d2VlbiAnbmFtZTogJHNlbGVjdC5zZWFyY2gnIGFuZCAnYWdlOiAkc2VsZWN0LnNlYXJjaCcuXHJcbiAqIFdlIHdhbnQgdG8gcGVyZm9ybSBhIE9SLlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZvcm1zJylcclxuICAgICAgICAuZmlsdGVyKCdwcm9wc0ZpbHRlcicsIHByb3BzRmlsdGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBwcm9wc0ZpbHRlcigpIHtcclxuICAgICAgICByZXR1cm4gZmlsdGVyRmlsdGVyO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgZnVuY3Rpb24gZmlsdGVyRmlsdGVyKGl0ZW1zLCBwcm9wcykge1xyXG4gICAgICAgICAgdmFyIG91dCA9IFtdO1xyXG5cclxuICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoaXRlbXMpKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgIHZhciBpdGVtTWF0Y2hlcyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BzKTtcclxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wID0ga2V5c1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gcHJvcHNbcHJvcF0udG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtW3Byb3BdLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICBpdGVtTWF0Y2hlcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKGl0ZW1NYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICBvdXQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTGV0IHRoZSBvdXRwdXQgYmUgdGhlIGlucHV0IHVudG91Y2hlZFxyXG4gICAgICAgICAgICBvdXQgPSBpdGVtcztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IHRhZ3MtaW5wdXQuanNcbiAqIEluaXRpYWxpemVzIHRoZSB0YWcgaW5wdXRzIHBsdWdpblxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mb3JtcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3RhZ3NpbnB1dCcsIHRhZ3NpbnB1dCk7XG5cbiAgICB0YWdzaW5wdXQuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcbiAgICBmdW5jdGlvbiB0YWdzaW5wdXQgKCR0aW1lb3V0KSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XG4gICAgICAgICAgZWxlbWVudC5vbignaXRlbUFkZGVkIGl0ZW1SZW1vdmVkJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHZpZXcgdmFsdWUgaXMgbm90IGVtcHR5IGFuZCBpcyBhIHN0cmluZ1xuICAgICAgICAgICAgLy8gYW5kIHVwZGF0ZSB0aGUgdmlldyBmcm9tIHN0cmluZyB0byBhbiBhcnJheSBvZiB0YWdzXG4gICAgICAgICAgICBpZihuZ01vZGVsLiR2aWV3VmFsdWUgJiYgbmdNb2RlbC4kdmlld1ZhbHVlLnNwbGl0KSB7XG4gICAgICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZSggbmdNb2RlbC4kdmlld1ZhbHVlLnNwbGl0KCcsJykgKTtcbiAgICAgICAgICAgICAgbmdNb2RlbC4kcmVuZGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgZWxlbWVudC50YWdzaW5wdXQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiB2YWxpZGF0ZS1mb3JtLmpzXG4gKiBJbml0aWFsaXplcyB0aGUgdmFsaWRhdGlvbiBwbHVnaW4gUGFyc2xleVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mb3JtcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3ZhbGlkYXRlRm9ybScsIHZhbGlkYXRlRm9ybSk7XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZUZvcm0gKCkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgdmFyICRlbGVtID0gJChlbGVtZW50KTtcbiAgICAgICAgICBpZigkLmZuLnBhcnNsZXkpXG4gICAgICAgICAgICAkZWxlbS5wYXJzbGV5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgLm1vZHVsZSgnYXBwLml0ZW1zJywgW10pXG4gICAgICAuY29udHJvbGxlcignSXRlbXNDb250cm9sbGVyJywgSXRlbXNDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ1N0b2NrRGlhbG9nQ29udHJvbGxlcicsIFN0b2NrRGlhbG9nQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdTdG9ja3NDb250cm9sbGVyJywgU3RvY2tzQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdJdGVtQWRkQ29udHJvbGxlcicsIEl0ZW1BZGRDb250cm9sbGVyKTtcbiAgICBcbiAgICBJdGVtc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ25nVGFibGVQYXJhbXMnLCAnU2t1JywgJ25nRGlhbG9nJywgJ1N3ZWV0QWxlcnQnLCAnbmdUYWJsZUxCU2VydmljZSddO1xuICAgIGZ1bmN0aW9uIEl0ZW1zQ29udHJvbGxlcigkc2NvcGUsIG5nVGFibGVQYXJhbXMsIFNrdSwgbmdEaWFsb2csIFN3ZWV0QWxlcnQsIG5nVGFibGVMQlNlcnZpY2UpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICBcbiAgICAgIGFjdGl2YXRlKCk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICB2bS5rZXl3b3JkID0gXCJcIjtcbiAgICAgICAgdm0udGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7Y291bnQ6IDEwfSwge1xuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCRkZWZlciwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyID0ge1xuICAgICAgICAgICAgICB3aGVyZTp7c3RhdHVzOntuZTonZGVsZXRlZCd9fSwgXG4gICAgICAgICAgICAgIGluY2x1ZGU6W1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHJlbGF0aW9uOidpbnZlbnRvcmllcycsXG4gICAgICAgICAgICAgICAgICBzY29wZTp7IHdoZXJlOiB7c2hvcElkOiAkc2NvcGUudXNlci5zaG9wLmlkfSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYodm0ua2V5d29yZCAhPSAnJykge1xuICAgICAgICAgICAgICB2YXIgcXMgPSB7cmVnZXg6IGtleXdvcmR9O1xuICAgICAgICAgICAgICBmaWx0ZXIud2hlcmUub3IgPSBbe1wiaXRlbS5uYW1lXCI6cXN9LCB7bW9kZWw6cXN9XTtcbiAgICAgICAgICAgICAgcGFyYW1zLnBhZ2UoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZ1RhYmxlTEJTZXJ2aWNlLmdldERhdGEoJGRlZmVyLCBwYXJhbXMsIFNrdSwgZmlsdGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICB2bS5zdG9jayA9IGZ1bmN0aW9uIChza3UsIHR5cGUpIHtcbiAgICAgICAgbmdEaWFsb2cub3Blbih7IFxuICAgICAgICAgIHRlbXBsYXRlOiAnc3RvY2tEaWFsb2dJZCcsIFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdTdG9ja0RpYWxvZ0NvbnRyb2xsZXInLCBcbiAgICAgICAgICBkYXRhOiB7c2t1OiBza3UsIHR5cGU6IHR5cGV9IFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0uZGVsZXRlID0gZnVuY3Rpb24gKHNrdSkge1xuICAgICAgICBTd2VldEFsZXJ0LnN3YWwoeyAgIFxuICAgICAgICAgIHRpdGxlOiAn56Gu5a6a5Yig6Zmk5ZWG5ZOBJytza3UuaXRlbS5uYW1lLCAgIFxuICAgICAgICAgIHRleHQ6ICfliKDpmaTllYblk4HlkI7lsIbml6Dms5XmgaLlpI3vvIzkvaDnoa7lrpropoHliKDpmaTllYblk4HvvJ8nLCAgIFxuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJywgICBcbiAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLCAgIFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogJyNERDZCNTUnLCAgIFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAn5piv55qE77yM5Yig6Zmk77yBJyxcbiAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiAn5LiN77yM5Y+W5raI77yBJywgICBcbiAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgfSwgIGZ1bmN0aW9uKGlzQ29uZmlybSl7ICBcbiAgICAgICAgICBpZihpc0NvbmZpcm0pIHtcbiAgICAgICAgICAgIHNrdS5zdGF0dXMgPSAnZGVsZXRlZCc7XG4gICAgICAgICAgICBza3UuJHNhdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBTd2VldEFsZXJ0LnN3YWwoJ+W3suWIoOmZpCEnLCfkvaDnmoTllYblk4EnK3NrdS5pdGVtLm5hbWUrJ+W3sue7j+WIoOmZpOOAgicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgIFN3ZWV0QWxlcnQuc3dhbCgn5aSx6LSlIScsICfliKDpmaTllYblk4Hml7blj5HnlJ/plJnor6/vvIzkvaDnmoTllYblk4HmsqHmnInooqvliKDpmaTjgIInLCAnZXJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmNvbmZpcm0gPSBmdW5jdGlvbiAoc2t1KSB7XG4gICAgICAgIHZhciBxdHkgPSAwO1xuICAgICAgICB2YXIgaW52ZW50b3J5ID0gc2t1LmludmVudG9yaWVzWzBdO1xuICAgICAgICBpZihpbnZlbnRvcnkpIHtcbiAgICAgICAgICBxdHkgPSBpbnZlbnRvcnkuYmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICBTa3Uuc3RvY2tzLmNyZWF0ZSh7aWQ6IHNrdS5pZH0sIHt0eXBlOiAnaW52ZW50b3J5JywgcXR5OiBxdHl9KS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgdm0udGFibGVQYXJhbXMucmVsb2FkKCk7XG4gICAgICAgICAgU3dlZXRBbGVydC5zd2FsKCfnm5jngrnmiJDlip8hJywn5L2g55qE5ZWG5ZOBJytza3UuaXRlbS5uYW1lKyflt7Lnu4/nm5jngrnnoa7orqTjgIInLCAnc3VjY2VzcycpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgIH1cbiAgICBcbiAgICBJdGVtQWRkQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnSXRlbSddO1xuICAgIGZ1bmN0aW9uIEl0ZW1BZGRDb250cm9sbGVyKCRzY29wZSwgSXRlbSkge1xuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgd2luZG93LlBhcnNsZXlWYWxpZGF0b3Iuc2V0TG9jYWxlKCd6aF9jbicpO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgJHNjb3BlLmVudGl0eSA9IHtcbiAgICAgICAgICB0eXBlOiBcImVudGl0eVwiLFxuICAgICAgICAgIG5hbWU6IFwiaVBob25lNlMgUGx1c1wiLFxuICAgICAgICAgIHNrdXM6IFt7YmFyY29kZTogXCI0NTZcIiwgcHJpY2U6IDYwODgwMCwgbW9kZWw6IFwiMTZHQlwiLCBzdG9ja1F0eTozfV1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIEl0ZW0uY3JlYXRlKCRzY29wZS5lbnRpdHkpLiRwcm9taXNlXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgJHNjb3BlLiRzdGF0ZS5nbygnYXBwLml0ZW0nKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgICRzY29wZS5zYXZlQW5kTW9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgSXRlbS5jcmVhdGUoJHNjb3BlLmVudGl0eSlcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgU3RvY2tEaWFsb2dDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICduZ0RpYWxvZycsICdTdG9jaycsICd0b2FzdGVyJywgJyRmaWx0ZXInXTtcbiAgICBmdW5jdGlvbiBTdG9ja0RpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCBuZ0RpYWxvZywgU3RvY2ssIHRvYXN0ZXIsICRmaWx0ZXIpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAkc2NvcGUuc3RvY2tRdHkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY29uZmlybSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgc2t1ID0gJHNjb3BlLm5nRGlhbG9nRGF0YS5za3U7XG4gICAgICAgICAgdmFyIHR5cGUgPSAkc2NvcGUubmdEaWFsb2dEYXRhLnR5cGU7XG4gICAgICAgICAgdmFyIG1lbW8gPSAkc2NvcGUubmdEaWFsb2dEYXRhLm1lbW87XG4gICAgICAgICAgU3RvY2suY3JlYXRlKHtza3VJZDogc2t1LmlkLCBxdHk6ICRzY29wZS5zdG9ja1F0eSwgdHlwZTogdHlwZSwgbWVtbzogbWVtb30pO1xuICAgICAgICAgIGlmKCFza3UuaW52ZW50b3JpZXNbMF0pIHtcbiAgICAgICAgICAgIHNrdS5pbnZlbnRvcmllc1swXSA9IHtxdHk6IDAsIG1vZGlmaWVkOiBuZXcgRGF0ZSgpfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2t1LmludmVudG9yaWVzWzBdLnF0eSArPSAkc2NvcGUuc3RvY2tRdHk7XG4gICAgICAgICAgbmdEaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICfmiJDlip8nLFxuICAgICAgICAgICBcIuWujOaIkFwiKyRmaWx0ZXIoJ3N0b2NrX3R5cGUnKSh0eXBlKStza3UuaXRlbS5uYW1lK1wiOiBcIiskc2NvcGUuc3RvY2tRdHkrXCLku7ZcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgU3RvY2tzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnU3RvY2snLCAnbmdUYWJsZVBhcmFtcyddO1xuICAgIGZ1bmN0aW9uIFN0b2Nrc0NvbnRyb2xsZXIoJHNjb3BlLCBTdG9jaywgbmdUYWJsZVBhcmFtcykge1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIFxuICAgICAgYWN0aXZlKCk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2ZSgpIHtcbiAgICAgICAgdm0uZmlsdGVyID0ge3RleHQ6ICcnfVxuICAgICAgICB2bS50YWJsZVBhcmFtcyA9IG5ldyBuZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICBjb3VudDogMTAsXG4gICAgICAgICAgZmlsdGVyOiB2bS5maWx0ZXIudGV4dFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJGRlZmVyLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBvcHQgPSB7d2hlcmU6e30sIGluY2x1ZGU6Wydza3UnXX1cbiAgICAgICAgICAgIG9wdC5saW1pdCA9IHBhcmFtcy5jb3VudCgpXG4gICAgICAgICAgICBvcHQuc2tpcCA9IChwYXJhbXMucGFnZSgpLTEpKm9wdC5saW1pdFxuICAgICAgICAgICAgaWYodm0uZmlsdGVyLnRleHQgIT0gJycpIHtcbiAgICAgICAgICAgICAgb3B0LnNraXAgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgU3RvY2suY291bnQoe3doZXJlOiBvcHQud2hlcmV9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zLnRvdGFsKHJlc3VsdC5jb3VudClcbiAgICAgICAgICAgICAgU3RvY2suZmluZCh7ZmlsdGVyOm9wdH0sICRkZWZlci5yZXNvbHZlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxufSkoKTsiLCIvKipcbiAqIEFuZ3VsYXJKUyBkZWZhdWx0IGZpbHRlciB3aXRoIHRoZSBmb2xsb3dpbmcgZXhwcmVzc2lvbjpcbiAqIFwicGVyc29uIGluIHBlb3BsZSB8IGZpbHRlcjoge25hbWU6ICRzZWxlY3Quc2VhcmNoLCBhZ2U6ICRzZWxlY3Quc2VhcmNofVwiXG4gKiBwZXJmb3JtcyBhIEFORCBiZXR3ZWVuICduYW1lOiAkc2VsZWN0LnNlYXJjaCcgYW5kICdhZ2U6ICRzZWxlY3Quc2VhcmNoJy5cbiAqIFdlIHdhbnQgdG8gcGVyZm9ybSBhIE9SLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5pdGVtcycpXG4gICAgICAgIC5maWx0ZXIoJ2l0ZW1fdHlwZScsIGl0ZW1UeXBlRmlsdGVyKVxuICAgICAgICAuZmlsdGVyKCdzdG9ja190eXBlJywgc3RvY2tUeXBlRmlsdGVyKVxuICAgICAgICAuZmlsdGVyKCdjdXJyZW5jeV9jbnknLCBjdXJyZW5jeUNOWUZpbHRlcilcbiAgICA7XG5cbiAgICBmdW5jdGlvbiBpdGVtVHlwZUZpbHRlcigpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB7XG4gICAgICAgICAgZW50aXR5OiBcIuWunueJqeWVhuWTgVwiLFxuICAgICAgICAgIHNlcnZpY2U6IFwi5pyN5Yqh6aG555uuXCJcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjdXJyZW5jeUNOWUZpbHRlcigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHJldHVybiBcIsKlIFwiK3ZhbC8xMDA7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHN0b2NrVHlwZUZpbHRlcigpIHtcbiAgICAgIHZhciB0eXBlID0ge1xuICAgICAgICBzdG9jazogXCLov5votKflhaXlupNcIixcbiAgICAgICAgc2FsZTogXCLplIDllK7lh7rlupNcIixcbiAgICAgICAgY2FuY2VsOiBcIuaguOmUgOWHuuW6k1wiLFxuICAgICAgICBpbnZlbnRvcnk6IFwi55uY54K55L+u5q2jXCIsXG4gICAgICAgIHRyYW5zZmVyOiBcIuW6k+WtmOiwg+i0p1wiXG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBrZXkgPSBrZXkgfHwgJ3N0b2NrJztcbiAgICAgICAgcmV0dXJuIHR5cGVba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubGF6eWxvYWQnKVxyXG4gICAgICAgIC5jb25maWcobGF6eWxvYWRDb25maWcpO1xyXG5cclxuICAgIGxhenlsb2FkQ29uZmlnLiRpbmplY3QgPSBbJyRvY0xhenlMb2FkUHJvdmlkZXInLCAnQVBQX1JFUVVJUkVTJ107XHJcbiAgICBmdW5jdGlvbiBsYXp5bG9hZENvbmZpZygkb2NMYXp5TG9hZFByb3ZpZGVyLCBBUFBfUkVRVUlSRVMpe1xyXG5cclxuICAgICAgLy8gTGF6eSBMb2FkIG1vZHVsZXMgY29uZmlndXJhdGlvblxyXG4gICAgICAkb2NMYXp5TG9hZFByb3ZpZGVyLmNvbmZpZyh7XHJcbiAgICAgICAgZGVidWc6IGZhbHNlLFxyXG4gICAgICAgIGV2ZW50czogdHJ1ZSxcclxuICAgICAgICBtb2R1bGVzOiBBUFBfUkVRVUlSRVMubW9kdWxlc1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubGF6eWxvYWQnKVxyXG4gICAgICAgIC5jb25zdGFudCgnQVBQX1JFUVVJUkVTJywge1xyXG4gICAgICAgICAgLy8galF1ZXJ5IGJhc2VkIGFuZCBzdGFuZGFsb25lIHNjcmlwdHNcclxuICAgICAgICAgIHNjcmlwdHM6IHtcclxuICAgICAgICAgICAgJ3doaXJsJzogICAgICAgICAgICAgIFsndmVuZG9yL3doaXJsL2Rpc3Qvd2hpcmwuY3NzJ10sXHJcbiAgICAgICAgICAgICdjbGFzc3lsb2FkZXInOiAgICAgICBbJ3ZlbmRvci9qcXVlcnktY2xhc3N5bG9hZGVyL2pzL2pxdWVyeS5jbGFzc3lsb2FkZXIubWluLmpzJ10sXHJcbiAgICAgICAgICAgICdhbmltbyc6ICAgICAgICAgICAgICBbJ3ZlbmRvci9hbmltby5qcy9hbmltby5qcyddLFxyXG4gICAgICAgICAgICAnZmFzdGNsaWNrJzogICAgICAgICAgWyd2ZW5kb3IvZmFzdGNsaWNrL2xpYi9mYXN0Y2xpY2suanMnXSxcclxuICAgICAgICAgICAgJ21vZGVybml6cic6ICAgICAgICAgIFsndmVuZG9yL21vZGVybml6ci9tb2Rlcm5penIuanMnXSxcclxuICAgICAgICAgICAgJ2FuaW1hdGUnOiAgICAgICAgICAgIFsndmVuZG9yL2FuaW1hdGUuY3NzL2FuaW1hdGUubWluLmNzcyddLFxyXG4gICAgICAgICAgICAnc2t5Y29ucyc6ICAgICAgICAgICAgWyd2ZW5kb3Ivc2t5Y29ucy9za3ljb25zLmpzJ10sXHJcbiAgICAgICAgICAgICdpY29ucyc6ICAgICAgICAgICAgICBbJ3ZlbmRvci9mb250YXdlc29tZS9jc3MvZm9udC1hd2Vzb21lLm1pbi5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3Ivc2ltcGxlLWxpbmUtaWNvbnMvY3NzL3NpbXBsZS1saW5lLWljb25zLmNzcyddLFxyXG4gICAgICAgICAgICAnd2VhdGhlci1pY29ucyc6ICAgICAgWyd2ZW5kb3Ivd2VhdGhlci1pY29ucy9jc3Mvd2VhdGhlci1pY29ucy5taW4uY3NzJ10sXHJcbiAgICAgICAgICAgICdzcGFya2xpbmVzJzogICAgICAgICBbJ2FwcC92ZW5kb3Ivc3BhcmtsaW5lcy9qcXVlcnkuc3BhcmtsaW5lLm1pbi5qcyddLFxyXG4gICAgICAgICAgICAnd3lzaXd5Zyc6ICAgICAgICAgICAgWyd2ZW5kb3IvYm9vdHN0cmFwLXd5c2l3eWcvYm9vdHN0cmFwLXd5c2l3eWcuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYm9vdHN0cmFwLXd5c2l3eWcvZXh0ZXJuYWwvanF1ZXJ5LmhvdGtleXMuanMnXSxcclxuICAgICAgICAgICAgJ3NsaW1zY3JvbGwnOiAgICAgICAgIFsndmVuZG9yL3NsaW1TY3JvbGwvanF1ZXJ5LnNsaW1zY3JvbGwubWluLmpzJ10sXHJcbiAgICAgICAgICAgICdzY3JlZW5mdWxsJzogICAgICAgICBbJ3ZlbmRvci9zY3JlZW5mdWxsL2Rpc3Qvc2NyZWVuZnVsbC5qcyddLFxyXG4gICAgICAgICAgICAndmVjdG9yLW1hcCc6ICAgICAgICAgWyd2ZW5kb3IvaWthLmp2ZWN0b3JtYXAvanF1ZXJ5LWp2ZWN0b3JtYXAtMS4yLjIubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2lrYS5qdmVjdG9ybWFwL2pxdWVyeS1qdmVjdG9ybWFwLTEuMi4yLmNzcyddLFxyXG4gICAgICAgICAgICAndmVjdG9yLW1hcC1tYXBzJzogICAgWyd2ZW5kb3IvaWthLmp2ZWN0b3JtYXAvanF1ZXJ5LWp2ZWN0b3JtYXAtd29ybGQtbWlsbC1lbi5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9pa2EuanZlY3Rvcm1hcC9qcXVlcnktanZlY3Rvcm1hcC11cy1taWxsLWVuLmpzJ10sXHJcbiAgICAgICAgICAgICdsb2FkR29vZ2xlTWFwc0pTJzogICBbJ2FwcC92ZW5kb3IvZ21hcC9sb2FkLWdvb2dsZS1tYXBzLmpzJ10sXHJcbiAgICAgICAgICAgICdmbG90LWNoYXJ0JzogICAgICAgICBbJ3ZlbmRvci9GbG90L2pxdWVyeS5mbG90LmpzJ10sXHJcbiAgICAgICAgICAgICdmbG90LWNoYXJ0LXBsdWdpbnMnOiBbJ3ZlbmRvci9mbG90LnRvb2x0aXAvanMvanF1ZXJ5LmZsb3QudG9vbHRpcC5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvRmxvdC9qcXVlcnkuZmxvdC5yZXNpemUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvRmxvdC9qcXVlcnkuZmxvdC5waWUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvRmxvdC9qcXVlcnkuZmxvdC50aW1lLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL0Zsb3QvanF1ZXJ5LmZsb3QuY2F0ZWdvcmllcy5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9mbG90LXNwbGluZS9qcy9qcXVlcnkuZmxvdC5zcGxpbmUubWluLmpzJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBqcXVlcnkgY29yZSBhbmQgd2lkZ2V0c1xyXG4gICAgICAgICAgICAnanF1ZXJ5LXVpJzogICAgICAgICAgWyd2ZW5kb3IvanF1ZXJ5LXVpL3VpL2NvcmUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvanF1ZXJ5LXVpL3VpL3dpZGdldC5qcyddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxvYWRzIG9ubHkganF1ZXJ5IHJlcXVpcmVkIG1vZHVsZXMgYW5kIHRvdWNoIHN1cHBvcnRcclxuICAgICAgICAgICAgJ2pxdWVyeS11aS13aWRnZXRzJzogIFsndmVuZG9yL2pxdWVyeS11aS91aS9jb3JlLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2pxdWVyeS11aS91aS93aWRnZXQuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvanF1ZXJ5LXVpL3VpL21vdXNlLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2pxdWVyeS11aS91aS9kcmFnZ2FibGUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvanF1ZXJ5LXVpL3VpL2Ryb3BwYWJsZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9qcXVlcnktdWkvdWkvc29ydGFibGUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvanF1ZXJ5dWktdG91Y2gtcHVuY2gvanF1ZXJ5LnVpLnRvdWNoLXB1bmNoLm1pbi5qcyddLFxyXG4gICAgICAgICAgICAnbW9tZW50JyA6ICAgICAgICAgICAgWyd2ZW5kb3IvbW9tZW50L21pbi9tb21lbnQtd2l0aC1sb2NhbGVzLm1pbi5qcyddLFxyXG4gICAgICAgICAgICAnaW5wdXRtYXNrJzogICAgICAgICAgWyd2ZW5kb3IvanF1ZXJ5LmlucHV0bWFzay9kaXN0L2pxdWVyeS5pbnB1dG1hc2suYnVuZGxlLm1pbi5qcyddLFxyXG4gICAgICAgICAgICAnZmxhdGRvYyc6ICAgICAgICAgICAgWyd2ZW5kb3IvZmxhdGRvYy9mbGF0ZG9jLmpzJ10sXHJcbiAgICAgICAgICAgICdjb2RlbWlycm9yJzogICAgICAgICBbJ3ZlbmRvci9jb2RlbWlycm9yL2xpYi9jb2RlbWlycm9yLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2NvZGVtaXJyb3IvbGliL2NvZGVtaXJyb3IuY3NzJ10sXHJcbiAgICAgICAgICAgIC8vIG1vZGVzIGZvciBjb21tb24gd2ViIGZpbGVzXHJcbiAgICAgICAgICAgICdjb2RlbWlycm9yLW1vZGVzLXdlYic6IFsndmVuZG9yL2NvZGVtaXJyb3IvbW9kZS9qYXZhc2NyaXB0L2phdmFzY3JpcHQuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9jb2RlbWlycm9yL21vZGUveG1sL3htbC5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2NvZGVtaXJyb3IvbW9kZS9odG1sbWl4ZWQvaHRtbG1peGVkLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvY29kZW1pcnJvci9tb2RlL2Nzcy9jc3MuanMnXSxcclxuICAgICAgICAgICAgJ3RhZ2lucHV0JyA6ICAgICAgICAgIFsndmVuZG9yL2Jvb3RzdHJhcC10YWdzaW5wdXQvZGlzdC9ib290c3RyYXAtdGFnc2lucHV0LmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9ib290c3RyYXAtdGFnc2lucHV0L2Rpc3QvYm9vdHN0cmFwLXRhZ3NpbnB1dC5taW4uanMnXSxcclxuICAgICAgICAgICAgJ2ZpbGVzdHlsZSc6ICAgICAgICAgIFsndmVuZG9yL2Jvb3RzdHJhcC1maWxlc3R5bGUvc3JjL2Jvb3RzdHJhcC1maWxlc3R5bGUuanMnXSxcclxuICAgICAgICAgICAgJ3BhcnNsZXknOiAgICAgICAgICAgIFsndmVuZG9yL3BhcnNsZXlqcy9zcmMvaTE4bi96aF9jbi5leHRyYS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9wYXJzbGV5anMvZGlzdC9wYXJzbGV5Lm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9wYXJzbGV5anMvc3JjL2kxOG4vemhfY24uanMnXSxcclxuICAgICAgICAgICAgJ2Z1bGxjYWxlbmRhcic6ICAgICAgIFsndmVuZG9yL2Z1bGxjYWxlbmRhci9kaXN0L2Z1bGxjYWxlbmRhci5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvZnVsbGNhbGVuZGFyL2Rpc3QvZnVsbGNhbGVuZGFyLmNzcyddLFxyXG4gICAgICAgICAgICAnZ2NhbCc6ICAgICAgICAgICAgICAgWyd2ZW5kb3IvZnVsbGNhbGVuZGFyL2Rpc3QvZ2NhbC5qcyddLFxyXG4gICAgICAgICAgICAnY2hhcnRqcyc6ICAgICAgICAgICAgWyd2ZW5kb3IvQ2hhcnQuanMvQ2hhcnQuanMnXSxcclxuICAgICAgICAgICAgJ21vcnJpcyc6ICAgICAgICAgICAgIFsndmVuZG9yL3JhcGhhZWwvcmFwaGFlbC5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9tb3JyaXMuanMvbW9ycmlzLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL21vcnJpcy5qcy9tb3JyaXMuY3NzJ10sXHJcbiAgICAgICAgICAgICdsb2FkZXJzLmNzcyc6ICAgICAgICAgIFsndmVuZG9yL2xvYWRlcnMuY3NzL2xvYWRlcnMuY3NzJ10sXHJcbiAgICAgICAgICAgICdzcGlua2l0JzogICAgICAgICAgICAgIFsndmVuZG9yL3NwaW5raXQvY3NzL3NwaW5raXQuY3NzJ11cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAvLyBBbmd1bGFyIGJhc2VkIHNjcmlwdCAodXNlIHRoZSByaWdodCBtb2R1bGUgbmFtZSlcclxuICAgICAgICAgIG1vZHVsZXM6IFtcclxuICAgICAgICAgICAge25hbWU6ICd0b2FzdGVyJywgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2FuZ3VsYXJqcy10b2FzdGVyL3RvYXN0ZXIuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyanMtdG9hc3Rlci90b2FzdGVyLmNzcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICdsb2NhbHl0aWNzLmRpcmVjdGl2ZXMnLCAgICAgZmlsZXM6IFsndmVuZG9yL2Nob3Nlbl92MS4yLjAvY2hvc2VuLmpxdWVyeS5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9jaG9zZW5fdjEuMi4wL2Nob3Nlbi5taW4uY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1jaG9zZW4tbG9jYWx5dGljcy9jaG9zZW4uanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnbmdEaWFsb2cnLCAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9uZ0RpYWxvZy9qcy9uZ0RpYWxvZy5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9uZ0RpYWxvZy9jc3MvbmdEaWFsb2cubWluLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL25nRGlhbG9nL2Nzcy9uZ0RpYWxvZy10aGVtZS1kZWZhdWx0Lm1pbi5jc3MnXSB9LFxyXG4gICAgICAgICAgICB7bmFtZTogJ25nV2lnJywgICAgICAgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvbmdXaWcvZGlzdC9uZy13aWcubWluLmpzJ10gfSxcclxuICAgICAgICAgICAge25hbWU6ICduZ1RhYmxlJywgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL25nLXRhYmxlL2Rpc3QvbmctdGFibGUubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL25nLXRhYmxlL2Rpc3QvbmctdGFibGUubWluLmNzcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICduZ1RhYmxlRXhwb3J0JywgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL25nLXRhYmxlLWV4cG9ydC9uZy10YWJsZS1leHBvcnQuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnYW5ndWxhckJvb3RzdHJhcE5hdlRyZWUnLCAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLWJvb3RzdHJhcC1uYXYtdHJlZS9kaXN0L2Fibl90cmVlX2RpcmVjdGl2ZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLWJvb3RzdHJhcC1uYXYtdHJlZS9kaXN0L2Fibl90cmVlLmNzcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICdodG1sU29ydGFibGUnLCAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2h0bWwuc29ydGFibGUvZGlzdC9odG1sLnNvcnRhYmxlLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2h0bWwuc29ydGFibGUvZGlzdC9odG1sLnNvcnRhYmxlLmFuZ3VsYXIuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAneGVkaXRhYmxlJywgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLXhlZGl0YWJsZS9kaXN0L2pzL3hlZGl0YWJsZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLXhlZGl0YWJsZS9kaXN0L2Nzcy94ZWRpdGFibGUuY3NzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2FuZ3VsYXJGaWxlVXBsb2FkJywgICAgICAgICBmaWxlczogWyd2ZW5kb3IvYW5ndWxhci1maWxlLXVwbG9hZC9hbmd1bGFyLWZpbGUtdXBsb2FkLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ25nSW1nQ3JvcCcsICAgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvbmctaW1nLWNyb3AvY29tcGlsZS91bm1pbmlmaWVkL25nLWltZy1jcm9wLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL25nLWltZy1jcm9wL2NvbXBpbGUvdW5taW5pZmllZC9uZy1pbWctY3JvcC5jc3MnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAndWkuc2VsZWN0JywgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLXVpLXNlbGVjdC9kaXN0L3NlbGVjdC5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLXVpLXNlbGVjdC9kaXN0L3NlbGVjdC5jc3MnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAndWkuY29kZW1pcnJvcicsICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLXVpLWNvZGVtaXJyb3IvdWktY29kZW1pcnJvci5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICdhbmd1bGFyLWNhcm91c2VsJywgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2FuZ3VsYXItY2Fyb3VzZWwvZGlzdC9hbmd1bGFyLWNhcm91c2VsLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLWNhcm91c2VsL2Rpc3QvYW5ndWxhci1jYXJvdXNlbC5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICduZ0dyaWQnLCAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL25nLWdyaWQvYnVpbGQvbmctZ3JpZC5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvbmctZ3JpZC9uZy1ncmlkLmNzcycgXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnaW5maW5pdGUtc2Nyb2xsJywgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9uZ0luZmluaXRlU2Nyb2xsL2J1aWxkL25nLWluZmluaXRlLXNjcm9sbC5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICd1aS5ib290c3RyYXAtc2xpZGVyJywgICAgICAgZmlsZXM6IFsndmVuZG9yL3NlaXlyaWEtYm9vdHN0cmFwLXNsaWRlci9kaXN0L2Jvb3RzdHJhcC1zbGlkZXIubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3NlaXlyaWEtYm9vdHN0cmFwLXNsaWRlci9kaXN0L2Nzcy9ib290c3RyYXAtc2xpZGVyLm1pbi5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1ib290c3RyYXAtc2xpZGVyL3NsaWRlci5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICd1aS5ncmlkJywgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2FuZ3VsYXItdWktZ3JpZC91aS1ncmlkLm1pbi5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci11aS1ncmlkL3VpLWdyaWQubWluLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ3RleHRBbmd1bGFyJywgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvdGV4dEFuZ3VsYXIvZGlzdC90ZXh0QW5ndWxhci5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvdGV4dEFuZ3VsYXIvZGlzdC90ZXh0QW5ndWxhci1yYW5neS5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvdGV4dEFuZ3VsYXIvZGlzdC90ZXh0QW5ndWxhci1zYW5pdGl6ZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci90ZXh0QW5ndWxhci9zcmMvZ2xvYmFscy5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci90ZXh0QW5ndWxhci9zcmMvZmFjdG9yaWVzLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3RleHRBbmd1bGFyL3NyYy9ET00uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvdGV4dEFuZ3VsYXIvc3JjL3ZhbGlkYXRvcnMuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvdGV4dEFuZ3VsYXIvc3JjL3RhQmluZC5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci90ZXh0QW5ndWxhci9zcmMvbWFpbi5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci90ZXh0QW5ndWxhci9kaXN0L3RleHRBbmd1bGFyU2V0dXAuanMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgc2VyaWU6IHRydWV9LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2FuZ3VsYXItcmlja3NoYXcnLCAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvZDMvZDMubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3JpY2tzaGF3L3JpY2tzaGF3LmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3JpY2tzaGF3L3JpY2tzaGF3Lm1pbi5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1yaWNrc2hhdy9yaWNrc2hhdy5qcyddLCBzZXJpZTogdHJ1ZX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnYW5ndWxhci1jaGFydGlzdCcsICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9jaGFydGlzdC9kaXN0L2NoYXJ0aXN0Lm1pbi5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvY2hhcnRpc3QvZGlzdC9jaGFydGlzdC5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLWNoYXJ0aXN0LmpzL2Rpc3QvYW5ndWxhci1jaGFydGlzdC5qcyddLCBzZXJpZTogdHJ1ZX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAndWkubWFwJywgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLXVpLW1hcC91aS1tYXAuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnZGF0YXRhYmxlcycsICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9kYXRhdGFibGVzL21lZGlhL2Nzcy9qcXVlcnkuZGF0YVRhYmxlcy5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvZGF0YXRhYmxlcy9tZWRpYS9qcy9qcXVlcnkuZGF0YVRhYmxlcy5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLWRhdGF0YWJsZXMvZGlzdC9hbmd1bGFyLWRhdGF0YWJsZXMuanMnXSwgc2VyaWU6IHRydWV9LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2FuZ3VsYXItanFjbG91ZCcsICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvanFjbG91ZDIvZGlzdC9qcWNsb3VkLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9qcWNsb3VkMi9kaXN0L2pxY2xvdWQuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1qcWNsb3VkL2FuZ3VsYXItanFjbG91ZC5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICdhbmd1bGFyR3JpZCcsICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2FnLWdyaWQvZGlzdC9hbmd1bGFyLWdyaWQuY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FnLWdyaWQvZGlzdC9hbmd1bGFyLWdyaWQuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYWctZ3JpZC9kaXN0L3RoZW1lLWRhcmsuY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FnLWdyaWQvZGlzdC90aGVtZS1mcmVzaC5jc3MnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnbmctbmVzdGFibGUnLCAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9uZy1uZXN0YWJsZS9zcmMvYW5ndWxhci1uZXN0YWJsZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9uZXN0YWJsZS9qcXVlcnkubmVzdGFibGUuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnYWtvZW5pZy5kZWNrZ3JpZCcsICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLWRlY2tncmlkL2FuZ3VsYXItZGVja2dyaWQuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnb2l0b3plcm8ubmdTd2VldEFsZXJ0JywgICAgIGZpbGVzOiBbJ3ZlbmRvci9zd2VldGFsZXJ0L2Rpc3Qvc3dlZXRhbGVydC5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3Ivc3dlZXRhbGVydC9kaXN0L3N3ZWV0YWxlcnQubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FuZ3VsYXItc3dlZXRhbGVydC9Td2VldEFsZXJ0LmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2JtLmJzVG91cicsICAgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvYm9vdHN0cmFwLXRvdXIvYnVpbGQvY3NzL2Jvb3RzdHJhcC10b3VyLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9ib290c3RyYXAtdG91ci9idWlsZC9qcy9ib290c3RyYXAtdG91ci1zdGFuZGFsb25lLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FuZ3VsYXItYm9vdHN0cmFwLXRvdXIvZGlzdC9hbmd1bGFyLWJvb3RzdHJhcC10b3VyLmpzJ10sIHNlcmllOiB0cnVlfSxcclxuICAgICAgICAgICAge25hbWU6ICd1aS5rbm9iJywgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2FuZ3VsYXIta25vYi9zcmMvYW5ndWxhci1rbm9iLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2pxdWVyeS1rbm9iL2Rpc3QvanF1ZXJ5Lmtub2IubWluLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2Vhc3lwaWVjaGFydCcsICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvanF1ZXJ5LmVhc3ktcGllLWNoYXJ0L2Rpc3QvYW5ndWxhci5lYXN5cGllY2hhcnQubWluLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2NvbG9ycGlja2VyLm1vZHVsZScsICAgICAgICBmaWxlczogWyd2ZW5kb3IvYW5ndWxhci1ib290c3RyYXAtY29sb3JwaWNrZXIvY3NzL2NvbG9ycGlja2VyLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLWJvb3RzdHJhcC1jb2xvcnBpY2tlci9qcy9ib290c3RyYXAtY29sb3JwaWNrZXItbW9kdWxlLmpzJ119XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sb2FkaW5nYmFyJylcclxuICAgICAgICAuY29uZmlnKGxvYWRpbmdiYXJDb25maWcpXHJcbiAgICAgICAgO1xyXG4gICAgbG9hZGluZ2JhckNvbmZpZy4kaW5qZWN0ID0gWydjZnBMb2FkaW5nQmFyUHJvdmlkZXInXTtcclxuICAgIGZ1bmN0aW9uIGxvYWRpbmdiYXJDb25maWcoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcclxuICAgICAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVCYXIgPSB0cnVlO1xyXG4gICAgICBjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcclxuICAgICAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmxhdGVuY3lUaHJlc2hvbGQgPSA1MDA7XHJcbiAgICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5wYXJlbnRTZWxlY3RvciA9ICcud3JhcHBlciA+IHNlY3Rpb24nO1xyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmxvYWRpbmdiYXInKVxyXG4gICAgICAgIC5ydW4obG9hZGluZ2JhclJ1bilcclxuICAgICAgICA7XHJcbiAgICBsb2FkaW5nYmFyUnVuLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnLCAnY2ZwTG9hZGluZ0JhciddO1xyXG4gICAgZnVuY3Rpb24gbG9hZGluZ2JhclJ1bigkcm9vdFNjb3BlLCAkdGltZW91dCwgY2ZwTG9hZGluZ0Jhcil7XHJcblxyXG4gICAgICAvLyBMb2FkaW5nIGJhciB0cmFuc2l0aW9uXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG4gICAgICB2YXIgdGhCYXI7XHJcbiAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaWYoJCgnLndyYXBwZXIgPiBzZWN0aW9uJykubGVuZ3RoKSAvLyBjaGVjayBpZiBiYXIgY29udGFpbmVyIGV4aXN0c1xyXG4gICAgICAgICAgICB0aEJhciA9ICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIGNmcExvYWRpbmdCYXIuc3RhcnQoKTtcclxuICAgICAgICAgICAgfSwgMCk7IC8vIHNldHMgYSBsYXRlbmN5IFRocmVzaG9sZFxyXG4gICAgICB9KTtcclxuICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgZXZlbnQudGFyZ2V0U2NvcGUuJHdhdGNoKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aEJhcik7XHJcbiAgICAgICAgICAgIGNmcExvYWRpbmdCYXIuY29tcGxldGUoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmxvY2FsZScpXHJcbiAgICAgICAgLmNvbmZpZyhsb2NhbGVDb25maWcpXHJcbiAgICAgICAgO1xyXG4gICAgbG9jYWxlQ29uZmlnLiRpbmplY3QgPSBbJ3RtaER5bmFtaWNMb2NhbGVQcm92aWRlciddO1xyXG4gICAgZnVuY3Rpb24gbG9jYWxlQ29uZmlnKHRtaER5bmFtaWNMb2NhbGVQcm92aWRlcil7XHJcbiAgXHJcbiAgICAgIHRtaER5bmFtaWNMb2NhbGVQcm92aWRlci5kZWZhdWx0TG9jYWxlKCd6aCcpO1xyXG4gICAgICB0bWhEeW5hbWljTG9jYWxlUHJvdmlkZXIubG9jYWxlTG9jYXRpb25QYXR0ZXJuKCd2ZW5kb3IvYW5ndWxhci1pMThuL2FuZ3VsYXItbG9jYWxlX3t7bG9jYWxlfX0uanMnKTtcclxuICAgICAgLy8gdG1oRHluYW1pY0xvY2FsZVByb3ZpZGVyLnVzZVN0b3JhZ2UoJyRjb29raWVTdG9yZScpO1xyXG5cclxuICAgIH1cclxufSkoKTsiLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBsb2NhbGUuanNcclxuICogRGVtbyBmb3IgbG9jYWxlIHNldHRpbmdzXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sb2NhbGUnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMb2NhbGl6YXRpb25Db250cm9sbGVyJywgTG9jYWxpemF0aW9uQ29udHJvbGxlcik7XHJcblxyXG4gICAgTG9jYWxpemF0aW9uQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ3RtaER5bmFtaWNMb2NhbGUnLCAnJGxvY2FsZSddO1xyXG4gICAgZnVuY3Rpb24gTG9jYWxpemF0aW9uQ29udHJvbGxlcigkcm9vdFNjb3BlLCB0bWhEeW5hbWljTG9jYWxlLCAkbG9jYWxlKSB7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAkcm9vdFNjb3BlLmF2YWlsYWJsZUxvY2FsZXMgPSB7XHJcbiAgICAgICAgICAgICdlbic6ICdFbmdsaXNoJyxcclxuICAgICAgICAgICAgJ2VzJzogJ1NwYW5pc2gnLFxyXG4gICAgICAgICAgICAnZGUnOiAnR2VybWFuJyxcclxuICAgICAgICAgICAgJ2ZyJzogJ0ZyZW5jaCcsXHJcbiAgICAgICAgICAgICdhcic6ICdBcmFiaWMnLFxyXG4gICAgICAgICAgICAnamEnOiAnSmFwYW5lc2UnLFxyXG4gICAgICAgICAgICAna28nOiAnS29yZWFuJyxcclxuICAgICAgICAgICAgJ3poJzogJ0NoaW5lc2UnfTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgJHJvb3RTY29wZS5tb2RlbCA9IHtzZWxlY3RlZExvY2FsZTogJ3poJ307XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICRyb290U2NvcGUuJGxvY2FsZSA9ICRsb2NhbGU7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICRyb290U2NvcGUuY2hhbmdlTG9jYWxlID0gdG1oRHluYW1pY0xvY2FsZS5zZXQ7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgIC5tb2R1bGUoJ2FwcC5tZW1iZXJzJylcbiAgICAgIC5jb250cm9sbGVyKCdNZW1iZXJzQ29udHJvbGxlcicsIE1lbWJlcnNDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ01lbWJlckNvbnRyb2xsZXInLCBNZW1iZXJDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ3JlY2hhcmdlRGlhbG9nQ29udHJvbGxlcicsIHJlY2hhcmdlRGlhbG9nQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdib251c0RpYWxvZ0NvbnRyb2xsZXInLCBib251c0RpYWxvZ0NvbnRyb2xsZXIpXG4gICAgO1xuICAgICAgXG4gICAgTWVtYmVyc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ01lbWJlcicsICduZ1RhYmxlUGFyYW1zJywgJ25nVGFibGVMQlNlcnZpY2UnLCAnU3dlZXRBbGVydCcsICdxcmNvZGVTZXJ2aWNlJywgJ2RlYWxTZXJ2aWNlJ107XG4gICAgZnVuY3Rpb24gTWVtYmVyc0NvbnRyb2xsZXIoJHNjb3BlLCBNZW1iZXIsIG5nVGFibGVQYXJhbXMsIG5nVGFibGVMQlNlcnZpY2UsIFN3ZWV0QWxlcnQsIHFyY29kZVNlcnZpY2UsIGRlYWxTZXJ2aWNlKSB7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgXG4gICAgICBhY3RpdmF0ZSgpO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgJHNjb3BlLnFyY29kZVNlcnZpY2UgPSBxcmNvZGVTZXJ2aWNlO1xuICAgICAgICB2bS5rZXl3b3JkID0gXCJcIjtcbiAgICAgICAgdm0udGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7Y291bnQ6IDEwfSwge1xuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCRkZWZlciwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyID0ge3doZXJlOntzdGF0dXM6e25lOidkZWxldGVkJ319LCBpbmNsdWRlOlsnd3h1c2VyJ119XG4gICAgICAgICAgICBpZih2bS5rZXl3b3JkICE9ICcnKSB7XG4gICAgICAgICAgICAgIHZhciBxcyA9IHtyZWdleDoga2V5d29yZH07XG4gICAgICAgICAgICAgIGZpbHRlci53aGVyZS5vciA9IFt7XCJlbnRpdGllcy5za3UuaXRlbS5uYW1lXCI6cXN9XTtcbiAgICAgICAgICAgICAgcGFyYW1zLnBhZ2UoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZ1RhYmxlTEJTZXJ2aWNlLmdldERhdGEoJGRlZmVyLCBwYXJhbXMsIE1lbWJlciwgZmlsdGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5zZWxsID0gZnVuY3Rpb24gKG1lbWJlcikge1xuICAgICAgICBkZWFsU2VydmljZS5vcGVuRGVhbChtZW1iZXIpO1xuICAgICAgICAkc2NvcGUuJHN0YXRlLmdvKCdhcHAuc2VsbCcpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBNZW1iZXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdNZW1iZXInLCAnbmdUYWJsZVBhcmFtcycsICduZ1RhYmxlTEJTZXJ2aWNlJywgJ1N3ZWV0QWxlcnQnLCAnZGVhbFNlcnZpY2UnLCAnbmdEaWFsb2cnXTtcbiAgICBmdW5jdGlvbiBNZW1iZXJDb250cm9sbGVyKCRzY29wZSwgTWVtYmVyLCBuZ1RhYmxlUGFyYW1zLCBuZ1RhYmxlTEJTZXJ2aWNlLCBTd2VldEFsZXJ0LCBkZWFsU2VydmljZSwgbmdEaWFsb2cpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2YXIgbWVtYmVySWQgPSAkc2NvcGUuJHN0YXRlLnBhcmFtcy5tZW1iZXJJZDtcbiAgICAgICAgICAgIFxuICAgICAgdm0uZGVhbFRhYmxlUGFyYW1zID0gbmV3IG5nVGFibGVQYXJhbXMoe1xuICAgICAgICBjb3VudDogMTBcbiAgICAgIH0sIHtcbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJGRlZmVyLCBwYXJhbXMpIHtcbiAgICAgICAgICB2YXIgb3B0ID0ge3doZXJlOntzdGF0dXM6e25lOidkZWxldGVkJ319fVxuICAgICAgICAgIG9wdC5saW1pdCA9IHBhcmFtcy5jb3VudCgpXG4gICAgICAgICAgb3B0LnNraXAgPSAocGFyYW1zLnBhZ2UoKS0xKSpvcHQubGltaXRcbiAgICAgICAgICBNZW1iZXIuZGVhbHMuY291bnQoe2lkOiBtZW1iZXJJZCwgd2hlcmU6IG9wdC53aGVyZX0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHZtLmRlYWxUYWJsZVBhcmFtcy50b3RhbChyZXN1bHQuY291bnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIE1lbWJlci5kZWFscyh7aWQ6IG1lbWJlcklkLCBmaWx0ZXI6b3B0fSwgJGRlZmVyLnJlc29sdmUpO1xuICAgICAgICB9XG4gICAgICB9KTsgICAgIFxuICAgICAgXG4gICAgICB2bS5kZXBvc2l0VGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7XG4gICAgICAgIGNvdW50OiAxMFxuICAgICAgfSwge1xuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbigkZGVmZXIsIHBhcmFtcykge1xuICAgICAgICAgIHZhciBvcHQgPSB7XG4gICAgICAgICAgICB3aGVyZTp7c3RhdHVzOntuZTonZGVsZXRlZCd9LCBvcjpbe3R5cGU6ICdkZXBvc2l0J30sIHtjYXRlZ29yeTogJ2RlcG9zaXQnfV19LFxuICAgICAgICAgICAgaW5jbHVkZTogWydzaG9wJ11cbiAgICAgICAgICB9XG4gICAgICAgICAgb3B0LmxpbWl0ID0gcGFyYW1zLmNvdW50KClcbiAgICAgICAgICBvcHQuc2tpcCA9IChwYXJhbXMucGFnZSgpLTEpKm9wdC5saW1pdFxuICAgICAgICAgIE1lbWJlci5wYXltZW50cy5jb3VudCh7aWQ6IG1lbWJlcklkLCB3aGVyZTogb3B0LndoZXJlfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgdm0uZGVwb3NpdFRhYmxlUGFyYW1zLnRvdGFsKHJlc3VsdC5jb3VudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgTWVtYmVyLnBheW1lbnRzKHtpZDogbWVtYmVySWQsIGZpbHRlcjpvcHR9LCAkZGVmZXIucmVzb2x2ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB2bS5ib251c1RhYmxlUGFyYW1zID0gbmV3IG5nVGFibGVQYXJhbXMoe1xuICAgICAgICBjb3VudDogMTBcbiAgICAgIH0sIHtcbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJGRlZmVyLCBwYXJhbXMpIHtcbiAgICAgICAgICB2YXIgb3B0ID0ge1xuICAgICAgICAgICAgd2hlcmU6e3N0YXR1czp7bmU6J2RlbGV0ZWQnfX0sXG4gICAgICAgICAgICBpbmNsdWRlOiBbXVxuICAgICAgICAgIH1cbiAgICAgICAgICBvcHQubGltaXQgPSBwYXJhbXMuY291bnQoKVxuICAgICAgICAgIG9wdC5za2lwID0gKHBhcmFtcy5wYWdlKCktMSkqb3B0LmxpbWl0XG4gICAgICAgICAgTWVtYmVyLmJvbnVzZXMuY291bnQoe2lkOiBtZW1iZXJJZCwgd2hlcmU6IG9wdC53aGVyZX0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHZtLmJvbnVzVGFibGVQYXJhbXMudG90YWwocmVzdWx0LmNvdW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBNZW1iZXIuYm9udXNlcyh7aWQ6IG1lbWJlcklkLCBmaWx0ZXI6b3B0fSwgJGRlZmVyLnJlc29sdmUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIFxuICAgICAgICBtZW1iZXJJZCA9ICRzY29wZS4kc3RhdGUucGFyYW1zLm1lbWJlcklkO1xuXG4gICAgICAgIHZtLm1lbWJlciA9IE1lbWJlci5maW5kT25lKHtmaWx0ZXI6IHtcbiAgICAgICAgICB3aGVyZToge2lkOiBtZW1iZXJJZH0sIFxuICAgICAgICAgIGluY2x1ZGU6Wyd3eHVzZXInXVxuICAgICAgICB9fSk7XG4gICAgICAgIFxuICAgICAgICB2bS5kZWFsVGFibGVQYXJhbXMucmVsb2FkKCk7XG4gICAgICAgIHZtLmRlcG9zaXRUYWJsZVBhcmFtcy5yZWxvYWQoKTtcbiAgICAgICAgdm0uYm9udXNUYWJsZVBhcmFtcy5yZWxvYWQoKTtcbiAgICAgIH1cblxuICAgICAgdm0uc2VsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVhbFNlcnZpY2Uub3BlbkRlYWwodm0ubWVtYmVyKTtcbiAgICAgICAgJHNjb3BlLiRzdGF0ZS5nbygnYXBwLnNlbGwnKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0ucmVjaGFyZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG5nRGlhbG9nLm9wZW4oeyBcbiAgICAgICAgICB0ZW1wbGF0ZTogJ3JlY2hhcmdlRGlhbG9nSWQnLCBcbiAgICAgICAgICBjb250cm9sbGVyOiAncmVjaGFyZ2VEaWFsb2dDb250cm9sbGVyJ1xuICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGFjdGl2YXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5zZXRCb251cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbmdEaWFsb2cub3Blbih7IFxuICAgICAgICAgIHRlbXBsYXRlOiAnYm9udXNEaWFsb2dJZCcsIFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdib251c0RpYWxvZ0NvbnRyb2xsZXInXG4gICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgYWN0aXZhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJlY2hhcmdlRGlhbG9nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnbmdEaWFsb2cnLCAnTWVtYmVyJywgJ3RvYXN0ZXInLCAnZGVhbFNlcnZpY2UnXTtcbiAgICBmdW5jdGlvbiByZWNoYXJnZURpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCBuZ0RpYWxvZywgTWVtYmVyLCB0b2FzdGVyLCBkZWFsU2VydmljZSkge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIHZhciBtZW1iZXJJZCA9ICRzY29wZS4kc3RhdGUucGFyYW1zLm1lbWJlcklkO1xuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICBtZW1iZXJJZCA9ICRzY29wZS4kc3RhdGUucGFyYW1zLm1lbWJlcklkO1xuICAgICAgICAgICRzY29wZS5tZW1iZXIgPSBNZW1iZXIuZmluZEJ5SWQoe2lkOm1lbWJlcklkfSk7XG4gICAgICAgICAgJHNjb3BlLmRhdGEgPSB7XG4gICAgICAgICAgICB0eXBlOiAnY2FzaCcsIFxuICAgICAgICAgICAgYW1vdW50OiAwLFxuICAgICAgICAgICAgY2F0ZWdvcnk6ICdkZXBvc2l0J1xuICAgICAgICAgIH07XG4gICAgICAgICAgJHNjb3BlLnBheVR5cGUgPSBkZWFsU2VydmljZS5wYXlUeXBlO1xuICAgICAgICAgICRzY29wZS5jYXNoID0ge1xuICAgICAgICAgICAgcGFpZDogMCxcbiAgICAgICAgICAgIGNoYW5nZTogMCxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5vbkNoYW5nZVBheVR5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYoZGF0YS50eXBlID09PSAnY2FzaCcpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhLmNvc3QgPSAkc2NvcGUuZGF0YS5hbW91bnQlJHNjb3BlLnVzZXIubWVyY2hhbnQuY2hhbmdlUmF0ZTtcbiAgICAgICAgICAgICRzY29wZS5kYXRhLmFtb3VudCAtPSAkc2NvcGUuZGF0YS5jb3N0O1xuICAgICAgICAgICAgJHNjb3BlLmNvdW50Q2hhbmdlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhLmNvc3QgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmNvdW50Q2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS5jYXNoLnBhaWQgPSAgJHNjb3BlLmNhc2gucGFpZDtcbiAgICAgICAgICAkc2NvcGUuY2FzaC5jaGFuZ2UgPSAkc2NvcGUuZGF0YS5hbW91bnQgLSAkc2NvcGUuY2FzaC5wYWlkO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY29uZmlybSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZigkc2NvcGUuZGF0YS5hbW91bnQgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgTWVtYmVyLnBheW1lbnRzLmNyZWF0ZSh7aWQ6IG1lbWJlcklkfSwgJHNjb3BlLmRhdGEpLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgbmdEaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ+aIkOWKnycsIFwi5a6M5oiQ5YKo5YC85pON5L2cXCIpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsICflpLHotKUnLCBcIuWCqOWAvOaTjeS9nOacquWujOaIkO+8jOivt+mHjeivle+8gVwiKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICBib251c0RpYWxvZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ25nRGlhbG9nJywgJ01lbWJlcicsICd0b2FzdGVyJ107XG4gICAgZnVuY3Rpb24gYm9udXNEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgbmdEaWFsb2csIE1lbWJlciwgdG9hc3Rlcikge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIHZhciBtZW1iZXJJZCA9ICRzY29wZS4kc3RhdGUucGFyYW1zLm1lbWJlcklkO1xuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICBtZW1iZXJJZCA9ICRzY29wZS4kc3RhdGUucGFyYW1zLm1lbWJlcklkO1xuICAgICAgICAgICRzY29wZS5tZW1iZXIgPSBNZW1iZXIuZmluZEJ5SWQoe2lkOm1lbWJlcklkfSk7XG4gICAgICAgICAgJHNjb3BlLmRhdGEgPSB7XG4gICAgICAgICAgICBhbW91bnQ6IDAsXG4gICAgICAgICAgICBtZW1vOiAnbWFudWFsJ1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5jb25maXJtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmKCRzY29wZS5kYXRhLmFtb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZigkc2NvcGUuZGF0YS5hbW91bnQgPiAwKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YS5tZW1vID0gJ21hbnVhbCc7XG4gICAgICAgICAgfSBlbHNlIGlmKCRzY29wZS5kYXRhLmFtb3VudCA8IDApIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhLm1lbW8gPSAnd3JpdGVvZmYnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBNZW1iZXIuYm9udXNlcy5jcmVhdGUoe2lkOiBtZW1iZXJJZH0sICRzY29wZS5kYXRhKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIG5nRGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICfmiJDlip8nLCBcIuWujOaIkOWCqOWAvOaTjeS9nFwiKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCAn5aSx6LSlJywgXCLlgqjlgLzmk43kvZzmnKrlrozmiJDvvIzor7fph43or5XvvIFcIilcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiLyoqXG4gKiBBbmd1bGFySlMgZGVmYXVsdCBmaWx0ZXIgd2l0aCB0aGUgZm9sbG93aW5nIGV4cHJlc3Npb246XG4gKiBcInBlcnNvbiBpbiBwZW9wbGUgfCBmaWx0ZXI6IHtuYW1lOiAkc2VsZWN0LnNlYXJjaCwgYWdlOiAkc2VsZWN0LnNlYXJjaH1cIlxuICogcGVyZm9ybXMgYSBBTkQgYmV0d2VlbiAnbmFtZTogJHNlbGVjdC5zZWFyY2gnIGFuZCAnYWdlOiAkc2VsZWN0LnNlYXJjaCcuXG4gKiBXZSB3YW50IHRvIHBlcmZvcm0gYSBPUi5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAubWVtYmVycycpXG4gICAgICAgIC5maWx0ZXIoJ3d4X3NleCcsIHd4c2V4RmlsdGVyKVxuICAgICAgICAuZmlsdGVyKCd3eF9zdWJzY3JpYmUnLCB3eHN1YnNjcmliZUZpbHRlcilcbiAgICAgICAgLmZpbHRlcignZGVwb3NpdF9jYXRlZ29yeScsIGRlcG9zaXRjYXRlZ29yeUZpbHRlcilcbiAgICAgICAgLmZpbHRlcignYm9udXNfbWVtbycsIGJvbnVzTWVtb0ZpbHRlcilcbiAgICA7XG5cbiAgICBmdW5jdGlvbiB3eHNleEZpbHRlcigpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBbJ+S/neWvhicsICfnlLcnLCAn5aWzJ107XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZVtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHd4c3Vic2NyaWJlRmlsdGVyKCkge1xuICAgICAgdmFyIHN0YXRlID0gWyfmnKrlhbPms6gnLCAn5bey5YWz5rOoJ107XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gc3RhdGVba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gZGVwb3NpdGNhdGVnb3J5RmlsdGVyKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkZXBvc2l0KSB7XG4gICAgICAgIGlmKGRlcG9zaXQudHlwZSA9PT0gJ2RlcG9zaXQnKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcG9zaXQuYW1vdW50IDwgMCA/ICflgqjlgLzmtojotLknOiflgqjlgLzpgIDmrL4nO1xuICAgICAgICB9IGVsc2UgaWYoZGVwb3NpdC5jYXRlZ29yeSA9PT0gJ2RlcG9zaXQnKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcG9zaXQuYW1vdW50IDwgMCA/ICfmj5DnjrAnOiflhYXlgLwnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAn5pyq55+lJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJvbnVzTWVtb0ZpbHRlcigpIHtcbiAgICAgIHZhciBtZW1vID0ge1xuICAgICAgICByZXdhcmQ6ICfmtojotLnnp6/liIYnLFxuICAgICAgICB2b3VjaDogJ+a2iOi0ueaKteaJoycsXG4gICAgICAgIG1hbnVhbDogJ+aJi+WKqOenr+WIhicsXG4gICAgICAgIHdyaXRlb2ZmOiAn5omL5Yqo5YeP6K6hJyxcbiAgICAgICAgZXhjaGFuZ2U6ICflhZHmjaInXG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gbWVtb1trZXldO1xuICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm1lbWJlcnMnKVxuICAgICAgICAuc2VydmljZSgncXJjb2RlU2VydmljZScsIHFyY29kZVNlcnZpY2UpO1xuXG4gICAgcXJjb2RlU2VydmljZS4kaW5qZWN0ID0gWyduZ0RpYWxvZyddO1xuICAgIGZ1bmN0aW9uIHFyY29kZVNlcnZpY2UobmdEaWFsb2cpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFxuICAgICAgdGhpcy5zaG93UVJDb2RlID0gc2hvd1FSQ29kZTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gc2hvd1FSQ29kZShpbWFnZXVybCkge1xuICAgICAgICBpbWFnZXVybCA9IGltYWdldXJsIHx8ICdhcHAvaW1nL3FyY29kZS1mb3ItZ2guanBnJztcbiAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgdGVtcGxhdGU6IFwiPGltZyBzcmM9XCIraW1hZ2V1cmwrXCIgY2xhc3M9J2ltZy1yZXNwb25zaXZlJz5cIixcbiAgICAgICAgICBwbGFpbjogdHJ1ZSxcbiAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0J1xuICAgICAgICB9KTsgICAgXG4gICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgIC5tb2R1bGUoJ2FwcC5teXNob3AnLCBbXSlcbiAgICAgIC5jb250cm9sbGVyKCdNeVNob3BDb250cm9sbGVyJywgTXlTaG9wQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdTaG9wc0NvbnRyb2xsZXInLCBTaG9wc0NvbnRyb2xsZXIpXG4gICAgICAuY29udHJvbGxlcignU2hvcEFkZENvbnRyb2xsZXInLCBTaG9wQWRkQ29udHJvbGxlcik7XG4gICAgICAgIFxuICAgIE15U2hvcENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ2VkaXRhYmxlT3B0aW9ucycsICdlZGl0YWJsZVRoZW1lcycsICdTaG9wJywgJ01lcmNoYW50J107XG4gICAgZnVuY3Rpb24gTXlTaG9wQ29udHJvbGxlcigkc2NvcGUsIGVkaXRhYmxlT3B0aW9ucywgZWRpdGFibGVUaGVtZXMsIFNob3AsIE1lcmNoYW50KSB7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICBBTWFwLnNlcnZpY2UoJ0FNYXAuRGlzdHJpY3RTZWFyY2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkaXN0cmljdFNlYXJjaCA9IG5ldyBBTWFwLkRpc3RyaWN0U2VhcmNoKHtcbiAgICAgICAgICBsZXZlbCA6ICdjb3VudHJ5JyxcbiAgICAgICAgICBzdWJkaXN0cmljdCA6IDMgICAgXG4gICAgICAgIH0pO1xuICAgIFxuICAgICAgICBkaXN0cmljdFNlYXJjaC5zZWFyY2goJ+S4reWbvScsIGZ1bmN0aW9uIChzdGF0dXMsIHJlc3VsdCkge1xuICAgICAgICAgIHZtLnByb3ZpbmNlcyA9IHJlc3VsdC5kaXN0cmljdExpc3RbMF0uZGlzdHJpY3RMaXN0O1xuICAgICAgICAgIC8vICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIFxuICAgICAgICBlZGl0YWJsZU9wdGlvbnMudGhlbWUgPSAnYnMzJztcbiAgICAgICAgXG4gICAgICAgIGVkaXRhYmxlVGhlbWVzLmJzMy5pbnB1dENsYXNzID0gJ2lucHV0LXNtJztcbiAgICAgICAgZWRpdGFibGVUaGVtZXMuYnMzLmJ1dHRvbnNDbGFzcyA9ICdidG4tc20nO1xuICAgICAgICBlZGl0YWJsZVRoZW1lcy5iczMuc3VibWl0VHBsID0gJzxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzXCI+PHNwYW4gY2xhc3M9XCJmYSBmYS1jaGVja1wiPjwvc3Bhbj48L2J1dHRvbj4nO1xuICAgICAgICBlZGl0YWJsZVRoZW1lcy5iczMuY2FuY2VsVHBsID0gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgbmctY2xpY2s9XCIkZm9ybS4kY2FuY2VsKClcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJmYSBmYS10aW1lcyB0ZXh0LW11dGVkXCI+PC9zcGFuPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9idXR0b24+JztcbiAgICAgICAgXG4gICAgICAgIHZtLnNob3AgPSAkc2NvcGUudXNlci5zaG9wO1xuICAgICAgICB2bS5tZXJjaGFudCA9ICRzY29wZS51c2VyLm1lcmNoYW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS51cGRhdGUgPSBmdW5jdGlvbiAob2JqLCBrZXksIGRhdGEpIHtcbiAgICAgICAgdm1bb2JqXVtrZXldID0gZGF0YS5uYW1lO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5zYXZlU2hvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgU2hvcC51cHNlcnQodm0uc2hvcCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLnNhdmVNZXJjaGFudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgTWVyY2hhbnQudXBzZXJ0KHZtLm1lcmNoYW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgU2hvcHNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICduZ1RhYmxlJywgJ1Nob3AnXTtcbiAgICBmdW5jdGlvbiBTaG9wc0NvbnRyb2xsZXIoJHNjb3BlLCBuZ1RhYmxlLCBTaG9wKSB7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgXG4gICAgICBhY3RpdmF0ZSgpO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgXG4gICAgICB9XG4gICAgICBcbiAgICAgICRzY29wZS5maWx0ZXIgPSB7dGV4dDogJyd9XG4gICAgICAkc2NvcGUudGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7XG4gICAgICAgIGNvdW50OiAxMCxcbiAgICAgICAgZmlsdGVyOiAkc2NvcGUuZmlsdGVyLnRleHRcbiAgICAgIH0sIHtcbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJGRlZmVyLCBwYXJhbXMpIHtcbiAgICAgICAgICB2YXIgb3B0ID0ge29yZGVyOiAnc3Vic2NyaWJlX3RpbWUgREVTQyd9XG4gICAgICAgICAgb3B0LmxpbWl0ID0gcGFyYW1zLmNvdW50KClcbiAgICAgICAgICBvcHQuc2tpcCA9IChwYXJhbXMucGFnZSgpLTEpKm9wdC5saW1pdFxuICAgICAgICAgIG9wdC53aGVyZSA9IHt9XG4gICAgICAgICAgaWYoJHNjb3BlLmZpbHRlci50ZXh0ICE9ICcnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZmlsdGVyLnRleHQpO1xuICAgICAgICAgICAgLy8gdmFyIHFzID0ge2xpa2U6ICclJyskc2NvcGUuZmlsdGVyLnRleHQrJyUnfTtcbiAgICAgICAgICAgIHZhciBxcyA9IHtyZWdleDogJHNjb3BlLmZpbHRlci50ZXh0fTtcbiAgICAgICAgICAgIG9wdC53aGVyZS5vciA9IFt7bmlja25hbWU6cXN9LCB7cmVtYXJrOnFzfV07XG4gICAgICAgICAgICBvcHQuc2tpcCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIFNrdS5jb3VudCh7d2hlcmU6IG9wdC53aGVyZX0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS50YWJsZVBhcmFtcy50b3RhbChyZXN1bHQuY291bnQpXG4gICAgICAgICAgICBTa3UuZmluZCh7ZmlsdGVyOm9wdH0sICRkZWZlci5yZXNvbHZlKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pICAgXG4gICAgfVxuICAgIFxuICAgIFNob3BBZGRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdTaG9wJ107XG4gICAgZnVuY3Rpb24gU2hvcEFkZENvbnRyb2xsZXIoJHNjb3BlLCBTaG9wKSB7XG4gICAgICBhY3RpdmF0ZSgpO1xuICAgICAgXG4gICAgICB3aW5kb3cuUGFyc2xleVZhbGlkYXRvci5zZXRMb2NhbGUoJ3poX2NuJyk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAkc2NvcGUuZW50aXR5ID0ge1xuICAgICAgICAgIHR5cGU6IFwiZW50aXR5XCIsXG4gICAgICAgICAgbmFtZTogXCJpUGhvbmU2UyBQbHVzXCIsXG4gICAgICAgICAgc2t1czogW3tiYXJjb2RlOlwiMTIzXCIsIHByaWNlOiA1Mjg4LCBtb2RlbDogXCIxNkdcIn1dXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBcbiAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgIH1cbiAgICAgIFxuICAgICAgJHNjb3BlLnNhdmVBbmRNb3JlID0gZnVuY3Rpb24gKCkge1xuICAgICAgfVxuICAgIH0gICAgXG59KSgpOyIsIi8qKlxuICogQW5ndWxhckpTIGRlZmF1bHQgZmlsdGVyIHdpdGggdGhlIGZvbGxvd2luZyBleHByZXNzaW9uOlxuICogXCJwZXJzb24gaW4gcGVvcGxlIHwgZmlsdGVyOiB7bmFtZTogJHNlbGVjdC5zZWFyY2gsIGFnZTogJHNlbGVjdC5zZWFyY2h9XCJcbiAqIHBlcmZvcm1zIGEgQU5EIGJldHdlZW4gJ25hbWU6ICRzZWxlY3Quc2VhcmNoJyBhbmQgJ2FnZTogJHNlbGVjdC5zZWFyY2gnLlxuICogV2Ugd2FudCB0byBwZXJmb3JtIGEgT1IuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm15c2hvcCcpXG4gICAgICAgIC5maWx0ZXIoJ2l0ZW1fdHlwZTInLCBpdGVtVHlwZUZpbHRlcjIpO1xuXG4gICAgZnVuY3Rpb24gaXRlbVR5cGVGaWx0ZXIyKCkge1xuICAgICAgICB2YXIgdHlwZSA9IHtcbiAgICAgICAgICBlbnRpdHk6IFwi5a6e5L2T5ZWG5ZOBXCIsXG4gICAgICAgICAgc2VydmljZTogXCLmnI3liqHpobnnm65cIlxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZVtrZXldO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IGRlbW8tbm90aWZ5LmpzXHJcbiAqIFByb3ZpZGVzIGEgc2ltcGxlIGRlbW8gZm9yIG5vdGlmeVxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubm90aWZ5JylcclxuICAgICAgICAuY29udHJvbGxlcignTm90aWZ5RGVtb0N0cmwnLCBOb3RpZnlEZW1vQ3RybCk7XHJcblxyXG4gICAgTm90aWZ5RGVtb0N0cmwuJGluamVjdCA9IFsnTm90aWZ5JywgJyR0aW1lb3V0J107XHJcbiAgICBmdW5jdGlvbiBOb3RpZnlEZW1vQ3RybChOb3RpZnksICR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgIHZtLm1zZ0h0bWwgPSAnPGVtIGNsYXNzPVwiZmEgZmEtY2hlY2tcIj48L2VtPiBNZXNzYWdlIHdpdGggaWNvbi4uJztcclxuXHJcbiAgICAgICAgICB2bS5ub3RpZnlNc2cgPSAnU29tZSBtZXNzYWdlcyBoZXJlLi4nO1xyXG4gICAgICAgICAgdm0ubm90aWZ5T3B0cyA9IHtcclxuICAgICAgICAgICAgc3RhdHVzOiAnZGFuZ2VyJyxcclxuICAgICAgICAgICAgcG9zOiAnYm90dG9tLWNlbnRlcidcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgLy8gU2VydmljZSB1c2FnZSBleGFtcGxlXHJcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgTm90aWZ5LmFsZXJ0KCBcclxuICAgICAgICAgICAgICAgICdUaGlzIGlzIGEgY3VzdG9tIG1lc3NhZ2UgZnJvbSBub3RpZnkuLicsIFxyXG4gICAgICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IG5vdGlmeS5qc1xuICogRGlyZWN0aXZlIGZvciBub3RpZnkgcGx1Z2luXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm5vdGlmeScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ25vdGlmeScsIG5vdGlmeSk7XG5cbiAgICBub3RpZnkuJGluamVjdCA9IFsnJHdpbmRvdycsICdOb3RpZnknXTtcbiAgICBmdW5jdGlvbiBub3RpZnkgKCR3aW5kb3csIE5vdGlmeSkge1xuXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgIG9wdGlvbnM6ICc9JyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJz0nXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCkge1xuXG4gICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgTm90aWZ5LmFsZXJ0KHNjb3BlLm1lc3NhZ2UsIHNjb3BlLm9wdGlvbnMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pKCk7XG5cbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IG5vdGlmeS5qc1xyXG4gKiBDcmVhdGUgYSBub3RpZmljYXRpb25zIHRoYXQgZmFkZSBvdXQgYXV0b21hdGljYWxseS5cclxuICogQmFzZWQgb24gTm90aWZ5IGFkZG9uIGZyb20gVUlLaXQgKGh0dHA6Ly9nZXR1aWtpdC5jb20vZG9jcy9hZGRvbnNfbm90aWZ5Lmh0bWwpXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5ub3RpZnknKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdOb3RpZnknLCBOb3RpZnkpO1xyXG5cclxuICAgIE5vdGlmeS4kaW5qZWN0ID0gWyckdGltZW91dCddO1xyXG4gICAgZnVuY3Rpb24gTm90aWZ5KCR0aW1lb3V0KSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWxlcnQgPSBub3RpZnlBbGVydDtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBub3RpZnlBbGVydChtc2csIG9wdHMpIHtcclxuICAgICAgICAgICAgaWYgKCBtc2cgKSB7XHJcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICQubm90aWZ5KG1zZywgb3B0cyB8fCB7fSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogTm90aWZ5IEFkZG9uIGRlZmluaXRpb24gYXMgalF1ZXJ5IHBsdWdpblxyXG4gKiBBZGFwdGVkIHZlcnNpb24gdG8gd29yayB3aXRoIEJvb3RzdHJhcCBjbGFzc2VzXHJcbiAqIE1vcmUgaW5mb3JtYXRpb24gaHR0cDovL2dldHVpa2l0LmNvbS9kb2NzL2FkZG9uc19ub3RpZnkuaHRtbFxyXG4gKi9cclxuKGZ1bmN0aW9uKCQpe1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGNvbnRhaW5lcnMgPSB7fSxcclxuICAgICAgICBtZXNzYWdlcyAgID0ge30sXHJcbiAgICAgICAgbm90aWZ5ICAgICA9ICBmdW5jdGlvbihvcHRpb25zKXtcclxuICAgICAgICAgICAgaWYgKCQudHlwZShvcHRpb25zKSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7IG1lc3NhZ2U6IG9wdGlvbnMgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzWzFdKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQob3B0aW9ucywgJC50eXBlKGFyZ3VtZW50c1sxXSkgPT09ICdzdHJpbmcnID8ge3N0YXR1czphcmd1bWVudHNbMV19IDogYXJndW1lbnRzWzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKG5ldyBNZXNzYWdlKG9wdGlvbnMpKS5zaG93KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbG9zZUFsbCAgPSBmdW5jdGlvbihncm91cCwgaW5zdGFudGx5KXtcclxuICAgICAgICAgICAgdmFyIGlkO1xyXG4gICAgICAgICAgICBpZihncm91cCkge1xyXG4gICAgICAgICAgICAgICAgZm9yKGlkIGluIG1lc3NhZ2VzKSB7IGlmKGdyb3VwPT09bWVzc2FnZXNbaWRdLmdyb3VwKSBtZXNzYWdlc1tpZF0uY2xvc2UoaW5zdGFudGx5KTsgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yKGlkIGluIG1lc3NhZ2VzKSB7IG1lc3NhZ2VzW2lkXS5jbG9zZShpbnN0YW50bHkpOyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgdmFyIE1lc3NhZ2UgPSBmdW5jdGlvbihvcHRpb25zKXtcclxuICAgICAgICAvLyB2YXIgJHRoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBNZXNzYWdlLmRlZmF1bHRzLCBvcHRpb25zKTtcclxuICAgICAgICB0aGlzLnV1aWQgICAgPSAnSUQnKyhuZXcgRGF0ZSgpLmdldFRpbWUoKSkrJ1JBTkQnKyhNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSAqIDEwMDAwMCkpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoW1xyXG4gICAgICAgICAgICAvLyBAZ2VlZG1vOiBhbGVydC1kaXNtaXNzYWJsZSBlbmFibGVzIGJzIGNsb3NlIGljb25cclxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ1ay1ub3RpZnktbWVzc2FnZSBhbGVydC1kaXNtaXNzYWJsZVwiPicsXHJcbiAgICAgICAgICAgICAgICAnPGEgY2xhc3M9XCJjbG9zZVwiPiZ0aW1lczs8L2E+JyxcclxuICAgICAgICAgICAgICAgICc8ZGl2PicrdGhpcy5vcHRpb25zLm1lc3NhZ2UrJzwvZGl2PicsXHJcbiAgICAgICAgICAgICc8L2Rpdj4nXHJcbiAgICAgICAgXS5qb2luKCcnKSkuZGF0YSgnbm90aWZ5TWVzc2FnZScsIHRoaXMpO1xyXG4gICAgICAgIC8vIHN0YXR1c1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcygnYWxlcnQgYWxlcnQtJyt0aGlzLm9wdGlvbnMuc3RhdHVzKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50c3RhdHVzID0gdGhpcy5vcHRpb25zLnN0YXR1cztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ncm91cCA9IHRoaXMub3B0aW9ucy5ncm91cDtcclxuICAgICAgICBtZXNzYWdlc1t0aGlzLnV1aWRdID0gdGhpcztcclxuICAgICAgICBpZighY29udGFpbmVyc1t0aGlzLm9wdGlvbnMucG9zXSkge1xyXG4gICAgICAgICAgICBjb250YWluZXJzW3RoaXMub3B0aW9ucy5wb3NdID0gJCgnPGRpdiBjbGFzcz1cInVrLW5vdGlmeSB1ay1ub3RpZnktJyt0aGlzLm9wdGlvbnMucG9zKydcIj48L2Rpdj4nKS5hcHBlbmRUbygnYm9keScpLm9uKCdjbGljaycsICcudWstbm90aWZ5LW1lc3NhZ2UnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5kYXRhKCdub3RpZnlNZXNzYWdlJykuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgICQuZXh0ZW5kKE1lc3NhZ2UucHJvdG90eXBlLCB7XHJcbiAgICAgICAgdXVpZDogZmFsc2UsXHJcbiAgICAgICAgZWxlbWVudDogZmFsc2UsXHJcbiAgICAgICAgdGltb3V0OiBmYWxzZSxcclxuICAgICAgICBjdXJyZW50c3RhdHVzOiAnJyxcclxuICAgICAgICBncm91cDogZmFsc2UsXHJcbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuaXMoJzp2aXNpYmxlJykpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcclxuICAgICAgICAgICAgY29udGFpbmVyc1t0aGlzLm9wdGlvbnMucG9zXS5zaG93KCkucHJlcGVuZCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB2YXIgbWFyZ2luYm90dG9tID0gcGFyc2VJbnQodGhpcy5lbGVtZW50LmNzcygnbWFyZ2luLWJvdHRvbScpLCAxMCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3MoeydvcGFjaXR5JzowLCAnbWFyZ2luLXRvcCc6IC0xKnRoaXMuZWxlbWVudC5vdXRlckhlaWdodCgpLCAnbWFyZ2luLWJvdHRvbSc6MH0pLmFuaW1hdGUoeydvcGFjaXR5JzoxLCAnbWFyZ2luLXRvcCc6IDAsICdtYXJnaW4tYm90dG9tJzptYXJnaW5ib3R0b219LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCR0aGlzLm9wdGlvbnMudGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjbG9zZWZuID0gZnVuY3Rpb24oKXsgJHRoaXMuY2xvc2UoKTsgfTtcclxuICAgICAgICAgICAgICAgICAgICAkdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChjbG9zZWZuLCAkdGhpcy5vcHRpb25zLnRpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVsZW1lbnQuaG92ZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyBjbGVhclRpbWVvdXQoJHRoaXMudGltZW91dCk7IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyAkdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChjbG9zZWZuLCAkdGhpcy5vcHRpb25zLnRpbWVvdXQpOyAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsb3NlOiBmdW5jdGlvbihpbnN0YW50bHkpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzICAgID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIGZpbmFsaXplID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFjb250YWluZXJzWyR0aGlzLm9wdGlvbnMucG9zXS5jaGlsZHJlbigpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJzWyR0aGlzLm9wdGlvbnMucG9zXS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXNzYWdlc1skdGhpcy51dWlkXTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGltZW91dCkgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XHJcbiAgICAgICAgICAgIGlmKGluc3RhbnRseSkge1xyXG4gICAgICAgICAgICAgICAgZmluYWxpemUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hbmltYXRlKHsnb3BhY2l0eSc6MCwgJ21hcmdpbi10b3AnOiAtMSogdGhpcy5lbGVtZW50Lm91dGVySGVpZ2h0KCksICdtYXJnaW4tYm90dG9tJzowfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBmaW5hbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbnRlbnQ6IGZ1bmN0aW9uKGh0bWwpe1xyXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5lbGVtZW50LmZpbmQoJz5kaXYnKTtcclxuICAgICAgICAgICAgaWYoIWh0bWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuaHRtbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0YXR1czogZnVuY3Rpb24oc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIGlmKCFzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRzdGF0dXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdhbGVydCBhbGVydC0nK3RoaXMuY3VycmVudHN0YXR1cykuYWRkQ2xhc3MoJ2FsZXJ0IGFsZXJ0LScrc3RhdHVzKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50c3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIE1lc3NhZ2UuZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgc3RhdHVzOiAnbm9ybWFsJyxcclxuICAgICAgICB0aW1lb3V0OiA1MDAwLFxyXG4gICAgICAgIGdyb3VwOiBudWxsLFxyXG4gICAgICAgIHBvczogJ3RvcC1jZW50ZXInXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAkLm5vdGlmeSAgICAgICAgICA9IG5vdGlmeTtcclxuICAgICQubm90aWZ5Lm1lc3NhZ2UgID0gTWVzc2FnZTtcclxuICAgICQubm90aWZ5LmNsb3NlQWxsID0gY2xvc2VBbGw7XHJcbiAgICBcclxuICAgIHJldHVybiBub3RpZnk7XHJcbn0oalF1ZXJ5KSk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBhY2Nlc3MtbG9naW4uanNcbiAqIERlbW8gZm9yIGxvZ2luIGFwaVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYWdlcycpXG4gICAgICAgIC5jb250cm9sbGVyKCdMb2dpbkZvcm1Db250cm9sbGVyJywgTG9naW5Gb3JtQ29udHJvbGxlcik7XG5cbiAgICBMb2dpbkZvcm1Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzdGF0ZScsICdVc2VyJywgJyRyb290U2NvcGUnXTtcbiAgICBmdW5jdGlvbiBMb2dpbkZvcm1Db250cm9sbGVyKCRzdGF0ZSwgVXNlciwgJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgIC8vIGJpbmQgaGVyZSBhbGwgZGF0YSBmcm9tIHRoZSBmb3JtXG4gICAgICAgICAgdm0uYWNjb3VudCA9IHtcbiAgICAgICAgICAgIHJlYWxtOiAnbWVyY2hhbnQnLFxuICAgICAgICAgICAgcmVtZW1iZXI6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIC8vIHBsYWNlIHRoZSBtZXNzYWdlIGlmIHNvbWV0aGluZyBnb2VzIHdyb25nXG4gICAgICAgICAgdm0uYXV0aE1zZyA9ICcnO1xuXG4gICAgICAgICAgdm0ubG9naW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmF1dGhNc2cgPSAnJztcblxuICAgICAgICAgICAgaWYodm0ubG9naW5Gb3JtLiR2YWxpZCkge1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgVXNlclxuICAgICAgICAgICAgICAgIC5sb2dpbih2bS5hY2NvdW50LCBmdW5jdGlvbiAoYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnVXNlci5sb2dpbmVkJyk7XG4gICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHZtLmF1dGhNc2cgPSBlcnJvci5kYXRhLmVycm9yLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAvLyBzZXQgYXMgZGlydHkgaWYgdGhlIHVzZXIgY2xpY2sgZGlyZWN0bHkgdG8gbG9naW4gc28gd2Ugc2hvdyB0aGUgdmFsaWRhdGlvbiBtZXNzYWdlc1xuICAgICAgICAgICAgICAvKmpzaGludCAtVzEwNiovXG4gICAgICAgICAgICAgIHZtLmxvZ2luRm9ybS5hY2NvdW50X3VzZXJuYW1lLiRkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgIHZtLmxvZ2luRm9ybS5hY2NvdW50X3Bhc3N3b3JkLiRkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogYWNjZXNzLXJlZ2lzdGVyLmpzXG4gKiBEZW1vIGZvciByZWdpc3RlciBhY2NvdW50IGFwaVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYWdlcycpXG4gICAgICAgIC5jb250cm9sbGVyKCdSZWdpc3RlckZvcm1Db250cm9sbGVyJywgUmVnaXN0ZXJGb3JtQ29udHJvbGxlcik7XG5cbiAgICBSZWdpc3RlckZvcm1Db250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJ1VzZXInLCAnJGZpbHRlciddO1xuICAgIGZ1bmN0aW9uIFJlZ2lzdGVyRm9ybUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHN0YXRlLCBVc2VyLCAkZmlsdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgLy8gYmluZCBoZXJlIGFsbCBkYXRhIGZyb20gdGhlIGZvcm1cbiAgICAgICAgICB2bS5hY2NvdW50ID0ge1xuICAgICAgICAgICAgcmVhbG06ICdtZXJjaGFudCcsXG4gICAgICAgICAgICByb2xlOiAnb3duZXInXG4gICAgICAgICAgfTtcbiAgICAgICAgICB2bS5hZ3JlZWQgPSB0cnVlO1xuICAgICAgICAgIC8vIHBsYWNlIHRoZSBtZXNzYWdlIGlmIHNvbWV0aGluZyBnb2VzIHdyb25nXG4gICAgICAgICAgdm0uYXV0aE1zZyA9ICcnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgdm0ucmVnaXN0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmF1dGhNc2cgPSAnJztcblxuICAgICAgICAgICAgaWYodm0ucmVnaXN0ZXJGb3JtLiR2YWxpZCkge1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgdm0uYWNjb3VudC5lbWFpbCA9IHZtLmFjY291bnQudXNlcm5hbWUrXCJAZmFua2FodWkuY29tXCI7XG4gICAgICAgICAgICAgIHZtLmFjY291bnQucGhvbmUgPSB2bS5hY2NvdW50LnVzZXJuYW1lO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgVXNlclxuICAgICAgICAgICAgICAgIC5jcmVhdGUodm0uYWNjb3VudCwgZnVuY3Rpb24gKGFjY291bnQpIHtcbiAgICAgICAgICAgICAgICAgIFVzZXJcbiAgICAgICAgICAgICAgICAgICAgLmxvZ2luKHt1c2VybmFtZTogdm0uYWNjb3VudC51c2VybmFtZSwgcGFzc3dvcmQ6IHZtLmFjY291bnQucGFzc3dvcmR9KVxuICAgICAgICAgICAgICAgICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAoYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ1VzZXIubG9naW5lZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHZtLmF1dGhNc2cgPSAkZmlsdGVyKCdyZWdpc3Rlcl9lcnJvcicpKGVycm9yLmRhdGEuZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAvLyBzZXQgYXMgZGlydHkgaWYgdGhlIHVzZXIgY2xpY2sgZGlyZWN0bHkgdG8gbG9naW4gc28gd2Ugc2hvdyB0aGUgdmFsaWRhdGlvbiBtZXNzYWdlc1xuICAgICAgICAgICAgICAvKmpzaGludCAtVzEwNiovXG4gICAgICAgICAgICAgIHZtLnJlZ2lzdGVyRm9ybS5hY2NvdW50X3VzZXJuYW1lLiRkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgIHZtLnJlZ2lzdGVyRm9ybS5hY2NvdW50X3Bhc3N3b3JkLiRkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgIHZtLnJlZ2lzdGVyRm9ybS5hY2NvdW50X2FncmVlZC4kZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiIsIi8qKlxuICogQW5ndWxhckpTIGRlZmF1bHQgZmlsdGVyIHdpdGggdGhlIGZvbGxvd2luZyBleHByZXNzaW9uOlxuICogXCJwZXJzb24gaW4gcGVvcGxlIHwgZmlsdGVyOiB7bmFtZTogJHNlbGVjdC5zZWFyY2gsIGFnZTogJHNlbGVjdC5zZWFyY2h9XCJcbiAqIHBlcmZvcm1zIGEgQU5EIGJldHdlZW4gJ25hbWU6ICRzZWxlY3Quc2VhcmNoJyBhbmQgJ2FnZTogJHNlbGVjdC5zZWFyY2gnLlxuICogV2Ugd2FudCB0byBwZXJmb3JtIGEgT1IuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnBhZ2VzJylcbiAgICAgICAgLmZpbHRlcigncmVnaXN0ZXJfZXJyb3InLCByZWdpc3RlckVycm9yRmlsdGVyKVxuICAgIDtcbiAgICBcbiAgICBmdW5jdGlvbiByZWdpc3RlckVycm9yRmlsdGVyKCkge1xuICAgICAgICAvLyBcIlRoZSBgbWVyY2hhbnRgIGluc3RhbmNlIGlzIG5vdCB2YWxpZC4gRGV0YWlsczogYG5hbWVgIG5hbWUgZXhpc3QgKHZhbHVlOiBcImZhbmthaHVpXCIpLlwiXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBpZigvTWVyY2hhbnQgbmFtZSBleGlzdC8udGVzdChtc2cpKSByZXR1cm4gXCLllYbmiLflkI3lrZflt7Lnu4/lrZjlnKhcIjtcbiAgICAgICAgaWYoL1VzZXIgYWxyZWFkeSBleGlzdHMvLnRlc3QobXNnKSkgcmV0dXJuIFwi55So5oi35ZCN5bey57uP5a2Y5ZyoXCI7XG4gICAgICAgIGVsc2UgcmV0dXJuIG1zZztcbiAgICAgIH1cbiAgICB9XG59KSgpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBDb2xsYXBzZSBwYW5lbHMgKiBbcGFuZWwtY29sbGFwc2VdXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYW5lbHMnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BhbmVsQ29sbGFwc2UnLCBwYW5lbENvbGxhcHNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBwYW5lbENvbGxhcHNlICgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBDb250cm9sbGVyLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZTogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbiAgICB9XHJcblxyXG4gICAgQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHRpbWVvdXQnLCAnJGxvY2FsU3RvcmFnZSddO1xyXG4gICAgZnVuY3Rpb24gQ29udHJvbGxlciAoJHNjb3BlLCAkZWxlbWVudCwgJHRpbWVvdXQsICRsb2NhbFN0b3JhZ2UpIHtcclxuICAgICAgdmFyIHN0b3JhZ2VLZXlOYW1lID0gJ3BhbmVsU3RhdGUnO1xyXG5cclxuICAgICAgLy8gUHJlcGFyZSB0aGUgcGFuZWwgdG8gYmUgY29sbGFwc2libGVcclxuICAgICAgdmFyICRlbGVtICAgPSAkKCRlbGVtZW50KSxcclxuICAgICAgICAgIHBhcmVudCAgPSAkZWxlbS5jbG9zZXN0KCcucGFuZWwnKSwgLy8gZmluZCB0aGUgZmlyc3QgcGFyZW50IHBhbmVsXHJcbiAgICAgICAgICBwYW5lbElkID0gcGFyZW50LmF0dHIoJ2lkJyk7XHJcblxyXG4gICAgICAvLyBMb2FkIHRoZSBzYXZlZCBzdGF0ZSBpZiBleGlzdHNcclxuICAgICAgdmFyIGN1cnJlbnRTdGF0ZSA9IGxvYWRQYW5lbFN0YXRlKCBwYW5lbElkICk7XHJcbiAgICAgIGlmICggdHlwZW9mIGN1cnJlbnRTdGF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkc2NvcGVbcGFuZWxJZF0gPSBjdXJyZW50U3RhdGU7IH0sXHJcbiAgICAgICAgICAxMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGJpbmQgZXZlbnRzIHRvIHN3aXRjaCBpY29uc1xyXG4gICAgICAkZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgc2F2ZVBhbmVsU3RhdGUoIHBhbmVsSWQsICEkc2NvcGVbcGFuZWxJZF0gKTtcclxuXHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICAvLyBDb250cm9sbGVyIGhlbHBlcnNcclxuICAgICAgZnVuY3Rpb24gc2F2ZVBhbmVsU3RhdGUoaWQsIHN0YXRlKSB7XHJcbiAgICAgICAgaWYoIWlkKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBhbmd1bGFyLmZyb21Kc29uKCRsb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleU5hbWVdKTtcclxuICAgICAgICBpZighZGF0YSkgeyBkYXRhID0ge307IH1cclxuICAgICAgICBkYXRhW2lkXSA9IHN0YXRlO1xyXG4gICAgICAgICRsb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleU5hbWVdID0gYW5ndWxhci50b0pzb24oZGF0YSk7XHJcbiAgICAgIH1cclxuICAgICAgZnVuY3Rpb24gbG9hZFBhbmVsU3RhdGUoaWQpIHtcclxuICAgICAgICBpZighaWQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgZGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24oJGxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5TmFtZV0pO1xyXG4gICAgICAgIGlmKGRhdGEpIHtcclxuICAgICAgICAgIHJldHVybiBkYXRhW2lkXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBEaXNtaXNzIHBhbmVscyAqIFtwYW5lbC1kaXNtaXNzXVxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnBhbmVscycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGFuZWxEaXNtaXNzJywgcGFuZWxEaXNtaXNzKTtcclxuXHJcbiAgICBmdW5jdGlvbiBwYW5lbERpc21pc3MgKCkge1xyXG5cclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBDb250cm9sbGVyLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckZWxlbWVudCcsICckcScsICdVdGlscyddO1xyXG4gICAgZnVuY3Rpb24gQ29udHJvbGxlciAoJHNjb3BlLCAkZWxlbWVudCwgJHEsIFV0aWxzKSB7XHJcbiAgICAgIHZhciByZW1vdmVFdmVudCAgID0gJ3BhbmVsLXJlbW92ZScsXHJcbiAgICAgICAgICByZW1vdmVkRXZlbnQgID0gJ3BhbmVsLXJlbW92ZWQnO1xyXG5cclxuICAgICAgJGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIC8vIGZpbmQgdGhlIGZpcnN0IHBhcmVudCBwYW5lbFxyXG4gICAgICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wYW5lbCcpO1xyXG5cclxuICAgICAgICByZW1vdmVFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBDb21tdW5pY2F0ZSBldmVudCBkZXN0cm95aW5nIHBhbmVsXHJcbiAgICAgICAgICAkc2NvcGUuJGVtaXQocmVtb3ZlRXZlbnQsIHBhcmVudC5hdHRyKCdpZCcpLCBkZWZlcnJlZCk7XHJcbiAgICAgICAgICBwcm9taXNlLnRoZW4oZGVzdHJveU1pZGRsZXdhcmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUnVuIHRoZSBhbmltYXRpb24gYmVmb3JlIGRlc3Ryb3kgdGhlIHBhbmVsXHJcbiAgICAgICAgZnVuY3Rpb24gZGVzdHJveU1pZGRsZXdhcmUoKSB7XHJcbiAgICAgICAgICBpZihVdGlscy5zdXBwb3J0LmFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICBwYXJlbnQuYW5pbW8oe2FuaW1hdGlvbjogJ2JvdW5jZU91dCd9LCBkZXN0cm95UGFuZWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBkZXN0cm95UGFuZWwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lQYW5lbCgpIHtcclxuXHJcbiAgICAgICAgICB2YXIgY29sID0gcGFyZW50LnBhcmVudCgpO1xyXG4gICAgICAgICAgcGFyZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgLy8gcmVtb3ZlIHRoZSBwYXJlbnQgaWYgaXQgaXMgYSByb3cgYW5kIGlzIGVtcHR5IGFuZCBub3QgYSBzb3J0YWJsZSAocG9ydGxldClcclxuICAgICAgICAgIGNvbFxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gKGVsLmlzKCdbY2xhc3MqPVwiY29sLVwiXTpub3QoLnNvcnRhYmxlKScpICYmIGVsLmNoaWxkcmVuKCcqJykubGVuZ3RoID09PSAwKTtcclxuICAgICAgICAgIH0pLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgIC8vIENvbW11bmljYXRlIGV2ZW50IGRlc3Ryb3llZCBwYW5lbFxyXG4gICAgICAgICAgJHNjb3BlLiRlbWl0KHJlbW92ZWRFdmVudCwgcGFyZW50LmF0dHIoJ2lkJykpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9KTtcclxuICAgIH1cclxufSkoKTtcclxuXHJcblxyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogUmVmcmVzaCBwYW5lbHNcclxuICogW3BhbmVsLXJlZnJlc2hdICogW2RhdGEtc3Bpbm5lcj1cInN0YW5kYXJkXCJdXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucGFuZWxzJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdwYW5lbFJlZnJlc2gnLCBwYW5lbFJlZnJlc2gpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHBhbmVsUmVmcmVzaCAoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogQ29udHJvbGxlcixcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckZWxlbWVudCddO1xyXG4gICAgZnVuY3Rpb24gQ29udHJvbGxlciAoJHNjb3BlLCAkZWxlbWVudCkge1xyXG4gICAgICB2YXIgcmVmcmVzaEV2ZW50ICAgPSAncGFuZWwtcmVmcmVzaCcsXHJcbiAgICAgICAgICB3aGlybENsYXNzICAgICA9ICd3aGlybCcsXHJcbiAgICAgICAgICBkZWZhdWx0U3Bpbm5lciA9ICdzdGFuZGFyZCc7XHJcblxyXG4gICAgICAvLyBjYXRjaCBjbGlja3MgdG8gdG9nZ2xlIHBhbmVsIHJlZnJlc2hcclxuICAgICAgJGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgcGFuZWwgICA9ICR0aGlzLnBhcmVudHMoJy5wYW5lbCcpLmVxKDApLFxyXG4gICAgICAgICAgICBzcGlubmVyID0gJHRoaXMuZGF0YSgnc3Bpbm5lcicpIHx8IGRlZmF1bHRTcGlubmVyXHJcbiAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgLy8gc3RhcnQgc2hvd2luZyB0aGUgc3Bpbm5lclxyXG4gICAgICAgIHBhbmVsLmFkZENsYXNzKHdoaXJsQ2xhc3MgKyAnICcgKyBzcGlubmVyKTtcclxuXHJcbiAgICAgICAgLy8gRW1pdCBldmVudCB3aGVuIHJlZnJlc2ggY2xpY2tlZFxyXG4gICAgICAgICRzY29wZS4kZW1pdChyZWZyZXNoRXZlbnQsIHBhbmVsLmF0dHIoJ2lkJykpO1xyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBsaXN0ZW4gdG8gcmVtb3ZlIHNwaW5uZXJcclxuICAgICAgJHNjb3BlLiRvbigncmVtb3ZlU3Bpbm5lcicsIHJlbW92ZVNwaW5uZXIpO1xyXG5cclxuICAgICAgLy8gbWV0aG9kIHRvIGNsZWFyIHRoZSBzcGlubmVyIHdoZW4gZG9uZVxyXG4gICAgICBmdW5jdGlvbiByZW1vdmVTcGlubmVyIChldiwgaWQpIHtcclxuICAgICAgICBpZiAoIWlkKSByZXR1cm47XHJcbiAgICAgICAgdmFyIG5ld2lkID0gaWQuY2hhckF0KDApID09PSAnIycgPyBpZCA6ICgnIycraWQpO1xyXG4gICAgICAgIGFuZ3VsYXJcclxuICAgICAgICAgIC5lbGVtZW50KG5ld2lkKVxyXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKHdoaXJsQ2xhc3MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5cclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGUgcGFuZWwtdG9vbHMuanNcbiAqIERpcmVjdGl2ZSB0b29scyB0byBjb250cm9sIHBhbmVscy4gXG4gKiBBbGxvd3MgY29sbGFwc2UsIHJlZnJlc2ggYW5kIGRpc21pc3MgKHJlbW92ZSlcbiAqIFNhdmVzIHBhbmVsIHN0YXRlIGluIGJyb3dzZXIgc3RvcmFnZVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYW5lbHMnKVxuICAgICAgICAuZGlyZWN0aXZlKCdwYW5lbHRvb2wnLCBwYW5lbHRvb2wpO1xuXG4gICAgcGFuZWx0b29sLiRpbmplY3QgPSBbJyRjb21waWxlJywgJyR0aW1lb3V0J107XG4gICAgZnVuY3Rpb24gcGFuZWx0b29sICgkY29tcGlsZSwgJHRpbWVvdXQpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICAgIHZhciB0ZW1wbGF0ZXMgPSB7XG4gICAgICAgICAgICAvKiBqc2hpbnQgbXVsdGlzdHI6IHRydWUgKi9cbiAgICAgICAgICAgIGNvbGxhcHNlOic8YSBocmVmPVwiI1wiIHBhbmVsLWNvbGxhcHNlPVwiXCIgdWliLXRvb2x0aXA9XCJDb2xsYXBzZSBQYW5lbFwiIG5nLWNsaWNrPVwie3twYW5lbElkfX0gPSAhe3twYW5lbElkfX1cIj4gXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxlbSBuZy1zaG93PVwie3twYW5lbElkfX1cIiBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2VtPiBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGVtIG5nLXNob3c9XCIhe3twYW5lbElkfX1cIiBjbGFzcz1cImZhIGZhLW1pbnVzXCI+PC9lbT4gXFxcbiAgICAgICAgICAgICAgICAgICAgICA8L2E+JyxcbiAgICAgICAgICAgIGRpc21pc3M6ICc8YSBocmVmPVwiI1wiIHBhbmVsLWRpc21pc3M9XCJcIiB1aWItdG9vbHRpcD1cIkNsb3NlIFBhbmVsXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgPGVtIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L2VtPlxcXG4gICAgICAgICAgICAgICAgICAgICA8L2E+JyxcbiAgICAgICAgICAgIHJlZnJlc2g6ICc8YSBocmVmPVwiI1wiIHBhbmVsLXJlZnJlc2g9XCJcIiBkYXRhLXNwaW5uZXI9XCJ7e3NwaW5uZXJ9fVwiIHVpYi10b29sdGlwPVwiUmVmcmVzaCBQYW5lbFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgIDxlbSBjbGFzcz1cImZhIGZhLXJlZnJlc2hcIj48L2VtPlxcXG4gICAgICAgICAgICAgICAgICAgICA8L2E+J1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgdG9vbHMgPSBzY29wZS5wYW5lbFRvb2xzIHx8IGF0dHJzO1xuICAgICAgXG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwoZ2V0VGVtcGxhdGUoZWxlbWVudCwgdG9vbHMgKSkuc2hvdygpO1xuICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKShzY29wZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3B1bGwtcmlnaHQnKTtcbiAgICAgICAgICB9KTtcbiAgXG4gICAgICAgICAgZnVuY3Rpb24gZ2V0VGVtcGxhdGUoIGVsZW0sIGF0dHJzICl7XG4gICAgICAgICAgICB2YXIgdGVtcCA9ICcnO1xuICAgICAgICAgICAgYXR0cnMgPSBhdHRycyB8fCB7fTtcbiAgICAgICAgICAgIGlmKGF0dHJzLnRvb2xDb2xsYXBzZSlcbiAgICAgICAgICAgICAgdGVtcCArPSB0ZW1wbGF0ZXMuY29sbGFwc2UucmVwbGFjZSgve3twYW5lbElkfX0vZywgKGVsZW0ucGFyZW50KCkucGFyZW50KCkuYXR0cignaWQnKSkgKTtcbiAgICAgICAgICAgIGlmKGF0dHJzLnRvb2xEaXNtaXNzKVxuICAgICAgICAgICAgICB0ZW1wICs9IHRlbXBsYXRlcy5kaXNtaXNzO1xuICAgICAgICAgICAgaWYoYXR0cnMudG9vbFJlZnJlc2gpXG4gICAgICAgICAgICAgIHRlbXAgKz0gdGVtcGxhdGVzLnJlZnJlc2gucmVwbGFjZSgve3tzcGlubmVyfX0vZywgYXR0cnMudG9vbFJlZnJlc2gpO1xuICAgICAgICAgICAgcmV0dXJuIHRlbXA7XG4gICAgICAgICAgfVxuICAgICAgICB9Ly8gbGlua1xuICAgIH0gXG5cbn0pKCk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogZGVtby1wYW5lbHMuanNcbiAqIFByb3ZpZGVzIGEgc2ltcGxlIGRlbW8gZm9yIHBhbmVsIGFjdGlvbnNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAucGFuZWxzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BhbmVsc0N0cmwnLCBQYW5lbHNDdHJsKTtcblxuICAgIFBhbmVsc0N0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyR0aW1lb3V0J107XG4gICAgZnVuY3Rpb24gUGFuZWxzQ3RybCgkc2NvcGUsICR0aW1lb3V0KSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cbiAgICAgICAgICAvLyBQQU5FTCBDT0xMQVBTRSBFVkVOVFNcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuICAgICAgICAgIC8vIFdlIGNhbiB1c2UgcGFuZWwgaWQgbmFtZSBmb3IgdGhlIGJvb2xlYW4gZmxhZyB0byBbdW5dY29sbGFwc2UgdGhlIHBhbmVsXG4gICAgICAgICAgJHNjb3BlLiR3YXRjaCgncGFuZWxEZW1vMScsZnVuY3Rpb24obmV3VmFsKXtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwYW5lbERlbW8xIGNvbGxhcHNlZDogJyArIG5ld1ZhbCk7XG5cbiAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgLy8gUEFORUwgRElTTUlTUyBFVkVOVFNcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuICAgICAgICAgIC8vIEJlZm9yZSByZW1vdmUgcGFuZWxcbiAgICAgICAgICAkc2NvcGUuJG9uKCdwYW5lbC1yZW1vdmUnLCBmdW5jdGlvbihldmVudCwgaWQsIGRlZmVycmVkKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BhbmVsICMnICsgaWQgKyAnIHJlbW92aW5nJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEhlcmUgaXMgb2JsaWdhdG9yeSB0byBjYWxsIHRoZSByZXNvbHZlKCkgaWYgd2UgcHJldGVuZCB0byByZW1vdmUgdGhlIHBhbmVsIGZpbmFsbHlcbiAgICAgICAgICAgIC8vIE5vdCBjYWxsaW5nIHJlc29sdmUoKSB3aWxsIE5PVCByZW1vdmUgdGhlIHBhbmVsXG4gICAgICAgICAgICAvLyBJdCdzIHVwIHRvIHlvdXIgYXBwIHRvIGRlY2lkZSBpZiBwYW5lbCBzaG91bGQgYmUgcmVtb3ZlZCBvciBub3RcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICBcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFBhbmVsIHJlbW92ZWQgKCBvbmx5IGlmIGFib3ZlIHdhcyByZXNvbHZlZCgpIClcbiAgICAgICAgICAkc2NvcGUuJG9uKCdwYW5lbC1yZW1vdmVkJywgZnVuY3Rpb24oZXZlbnQsIGlkKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BhbmVsICMnICsgaWQgKyAnIHJlbW92ZWQnKTtcblxuICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAvLyBQQU5FTCBSRUZSRVNIIEVWRU5UU1xuICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG4gICAgICAgICAgJHNjb3BlLiRvbigncGFuZWwtcmVmcmVzaCcsIGZ1bmN0aW9uKGV2ZW50LCBpZCkge1xuICAgICAgICAgICAgdmFyIHNlY3MgPSAzO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVmcmVzaGluZyBkdXJpbmcgJyArIHNlY3MgKydzICMnK2lkKTtcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgLy8gZGlyZWN0aXZlIGxpc3RlbiBmb3IgdG8gcmVtb3ZlIHRoZSBzcGlubmVyIFxuICAgICAgICAgICAgICAvLyBhZnRlciB3ZSBlbmQgdXAgdG8gcGVyZm9ybSBvd24gb3BlcmF0aW9uc1xuICAgICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgncmVtb3ZlU3Bpbm5lcicsIGlkKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZWZyZXNoZWQgIycgKyBpZCk7XG5cbiAgICAgICAgICAgIH0sIDMwMDApO1xuXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBQQU5FTFMgVklBIE5HLVJFUEVBVFxuICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG4gICAgICAgICAgJHNjb3BlLnBhbmVscyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6ICdwYW5lbFJlcGVhdDEnLFxuICAgICAgICAgICAgICB0aXRsZTogJ1BhbmVsIFRpdGxlIDEnLFxuICAgICAgICAgICAgICBib2R5OiAnTnVsbGEgZWdldCBsb3JlbSBsZW8sIHNpdCBhbWV0IGVsZW1lbnR1bSBsb3JlbS4gJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6ICdwYW5lbFJlcGVhdDInLFxuICAgICAgICAgICAgICB0aXRsZTogJ1BhbmVsIFRpdGxlIDInLFxuICAgICAgICAgICAgICBib2R5OiAnTnVsbGEgZWdldCBsb3JlbSBsZW8sIHNpdCBhbWV0IGVsZW1lbnR1bSBsb3JlbS4gJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6ICdwYW5lbFJlcGVhdDMnLFxuICAgICAgICAgICAgICB0aXRsZTogJ1BhbmVsIFRpdGxlIDMnLFxuICAgICAgICAgICAgICBib2R5OiAnTnVsbGEgZWdldCBsb3JlbSBsZW8sIHNpdCBhbWV0IGVsZW1lbnR1bSBsb3JlbS4gJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF07XG4gICAgICAgIH1cblxuICAgIH0gLy9QYW5lbHNDdHJsXG5cbn0pKCk7XG5cbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogRHJhZyBhbmQgZHJvcCBhbnkgcGFuZWwgYmFzZWQgb24galF1ZXJ5VUkgcG9ydGxldHNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAucGFuZWxzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgncG9ydGxldCcsIHBvcnRsZXQpO1xuXG4gICAgcG9ydGxldC4kaW5qZWN0ID0gWyckdGltZW91dCcsICckbG9jYWxTdG9yYWdlJ107XG4gICAgZnVuY3Rpb24gcG9ydGxldCAoJHRpbWVvdXQsICRsb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHZhciBzdG9yYWdlS2V5TmFtZSA9ICdwb3J0bGV0U3RhdGUnO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBsaW5rXG4gICAgICB9O1xuXG4gICAgICAvLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICBcbiAgICAgICAgLy8gbm90IGNvbXBhdGlibGUgd2l0aCBqcXVlcnkgc29ydGFibGVcbiAgICAgICAgaWYoISQuZm4uc29ydGFibGUpIHJldHVybjtcblxuICAgICAgICBlbGVtZW50LnNvcnRhYmxlKHtcbiAgICAgICAgICBjb25uZWN0V2l0aDogICAgICAgICAgJ1twb3J0bGV0XScsIC8vIHNhbWUgbGlrZSBkaXJlY3RpdmUgXG4gICAgICAgICAgaXRlbXM6ICAgICAgICAgICAgICAgICdkaXYucGFuZWwnLFxuICAgICAgICAgIGhhbmRsZTogICAgICAgICAgICAgICAnLnBvcnRsZXQtaGFuZGxlcicsXG4gICAgICAgICAgb3BhY2l0eTogICAgICAgICAgICAgIDAuNyxcbiAgICAgICAgICBwbGFjZWhvbGRlcjogICAgICAgICAgJ3BvcnRsZXQgYm94LXBsYWNlaG9sZGVyJyxcbiAgICAgICAgICBjYW5jZWw6ICAgICAgICAgICAgICAgJy5wb3J0bGV0LWNhbmNlbCcsXG4gICAgICAgICAgZm9yY2VQbGFjZWhvbGRlclNpemU6IHRydWUsXG4gICAgICAgICAgaWZyYW1lRml4OiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgIHRvbGVyYW5jZTogICAgICAgICAgICAncG9pbnRlcicsXG4gICAgICAgICAgaGVscGVyOiAgICAgICAgICAgICAgICdvcmlnaW5hbCcsXG4gICAgICAgICAgcmV2ZXJ0OiAgICAgICAgICAgICAgIDIwMCxcbiAgICAgICAgICBmb3JjZUhlbHBlclNpemU6ICAgICAgdHJ1ZSxcbiAgICAgICAgICB1cGRhdGU6ICAgICAgICAgICAgICAgc2F2ZVBvcnRsZXRPcmRlcixcbiAgICAgICAgICBjcmVhdGU6ICAgICAgICAgICAgICAgbG9hZFBvcnRsZXRPcmRlclxuICAgICAgICB9KTtcblxuICAgICAgfVxuXG5cbiAgICAgIGZ1bmN0aW9uIHNhdmVQb3J0bGV0T3JkZXIoZXZlbnQvKiwgdWkqLykge1xuICAgICAgICB2YXIgc2VsZiA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgdmFyIGRhdGEgPSBhbmd1bGFyLmZyb21Kc29uKCRsb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleU5hbWVdKTtcbiAgICAgICAgXG4gICAgICAgIGlmKCFkYXRhKSB7IGRhdGEgPSB7fTsgfVxuXG4gICAgICAgIGRhdGFbc2VsZi5pZF0gPSAkKHNlbGYpLnNvcnRhYmxlKCd0b0FycmF5Jyk7XG5cbiAgICAgICAgaWYoZGF0YSkge1xuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5TmFtZV0gPSBhbmd1bGFyLnRvSnNvbihkYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBsb2FkUG9ydGxldE9yZGVyKGV2ZW50KSB7XG4gICAgICAgIHZhciBzZWxmID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgZGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24oJGxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5TmFtZV0pO1xuXG4gICAgICAgIGlmKGRhdGEpIHtcbiAgICAgICAgICBcbiAgICAgICAgICB2YXIgcG9ybGV0SWQgPSBzZWxmLmlkLFxuICAgICAgICAgICAgICBwYW5lbHMgICA9IGRhdGFbcG9ybGV0SWRdO1xuXG4gICAgICAgICAgaWYocGFuZWxzKSB7XG4gICAgICAgICAgICB2YXIgcG9ydGxldCA9ICQoJyMnK3BvcmxldElkKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJC5lYWNoKHBhbmVscywgZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAkKCcjJyt2YWx1ZSkuYXBwZW5kVG8ocG9ydGxldCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuXG59KSgpO1xuICIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnByZWxvYWRlcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncHJlbG9hZGVyJywgcHJlbG9hZGVyKTtcclxuXHJcbiAgICBwcmVsb2FkZXIuJGluamVjdCA9IFsnJGFuaW1hdGUnLCAnJHRpbWVvdXQnLCAnJHEnXTtcclxuICAgIGZ1bmN0aW9uIHByZWxvYWRlciAoJGFuaW1hdGUsICR0aW1lb3V0LCAkcSkge1xyXG5cclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBQycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcclxuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInByZWxvYWRlci1wcm9ncmVzc1wiPicgK1xyXG4gICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInByZWxvYWRlci1wcm9ncmVzcy1iYXJcIiAnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAnbmctc3R5bGU9XCJ7d2lkdGg6IGxvYWRDb3VudGVyICsgXFwnJVxcJ31cIj48L2Rpdj4nICtcclxuICAgICAgICAgICAgICAnPC9kaXY+J1xyXG4gICAgICAgICAgICAsXHJcbiAgICAgICAgICAgIGxpbms6IGxpbmtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWwpIHtcclxuXHJcbiAgICAgICAgICBzY29wZS5sb2FkQ291bnRlciA9IDA7XHJcblxyXG4gICAgICAgICAgdmFyIGNvdW50ZXIgID0gMCxcclxuICAgICAgICAgICAgICB0aW1lb3V0O1xyXG5cclxuICAgICAgICAgIC8vIGRpc2FibGVzIHNjcm9sbGJhclxyXG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdib2R5JykuY3NzKCdvdmVyZmxvdycsICdoaWRkZW4nKTtcclxuICAgICAgICAgIC8vIGVuc3VyZSBjbGFzcyBpcyBwcmVzZW50IGZvciBzdHlsaW5nXHJcbiAgICAgICAgICBlbC5hZGRDbGFzcygncHJlbG9hZGVyJyk7XHJcblxyXG4gICAgICAgICAgYXBwUmVhZHkoKS50aGVuKGVuZENvdW50ZXIpO1xyXG5cclxuICAgICAgICAgIHRpbWVvdXQgPSAkdGltZW91dChzdGFydENvdW50ZXIpO1xyXG5cclxuICAgICAgICAgIC8vLy8vLy9cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBzdGFydENvdW50ZXIoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVtYWluaW5nID0gMTAwIC0gY291bnRlcjtcclxuICAgICAgICAgICAgY291bnRlciA9IGNvdW50ZXIgKyAoMC4wMTUgKiBNYXRoLnBvdygxIC0gTWF0aC5zcXJ0KHJlbWFpbmluZyksIDIpKTtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLmxvYWRDb3VudGVyID0gcGFyc2VJbnQoY291bnRlciwgMTApO1xyXG5cclxuICAgICAgICAgICAgdGltZW91dCA9ICR0aW1lb3V0KHN0YXJ0Q291bnRlciwgMjApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGVuZENvdW50ZXIoKSB7XHJcblxyXG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZW91dCk7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5sb2FkQ291bnRlciA9IDEwMDtcclxuXHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgLy8gYW5pbWF0ZSBwcmVsb2FkZXIgaGlkaW5nXHJcbiAgICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3MoZWwsICdwcmVsb2FkZXItaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgLy8gcmV0b3JlIHNjcm9sbGJhclxyXG4gICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLmNzcygnb3ZlcmZsb3cnLCAnJyk7XHJcbiAgICAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gYXBwUmVhZHkoKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHZhciB2aWV3c0xvYWRlZCA9IDA7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgZG9lc24ndCBzeW5jIHdpdGggdGhlIHJlYWwgYXBwIHJlYWR5XHJcbiAgICAgICAgICAgIC8vIGEgY3VzdG9tIGV2ZW50IG11c3QgYmUgdXNlZCBpbnN0ZWFkXHJcbiAgICAgICAgICAgIHZhciBvZmYgPSBzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICB2aWV3c0xvYWRlZCArKztcclxuICAgICAgICAgICAgICAvLyB3ZSBrbm93IHRoZXJlIGFyZSBhdCBsZWFzdCB0d28gdmlld3MgdG8gYmUgbG9hZGVkIFxyXG4gICAgICAgICAgICAgIC8vIGJlZm9yZSB0aGUgYXBwIGlzIHJlYWR5ICgxLWluZGV4Lmh0bWwgMi1hcHAqLmh0bWwpXHJcbiAgICAgICAgICAgICAgaWYgKCB2aWV3c0xvYWRlZCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgLy8gd2l0aCByZXNvbHZlIHRoaXMgZmlyZXMgb25seSBvbmNlXHJcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAzMDAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICBvZmYoKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IC8vbGlua1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuc2FsZXMnKVxuICAgICAgICAuc2VydmljZSgnZGVhbFNlcnZpY2UnLCBkZWFsU2VydmljZSlcbiAgICAgICAgLnNlcnZpY2UoJ3JldHVyblNlcnZpY2UnLCByZXR1cm5TZXJ2aWNlKVxuICAgIDtcblxuICAgIGRlYWxTZXJ2aWNlLiRpbmplY3QgPSBbJ0RlYWwnLCAnU2t1JywgJ25nRGlhbG9nJywgJyRyb290U2NvcGUnXTtcbiAgICBmdW5jdGlvbiBkZWFsU2VydmljZShEZWFsLCBTa3UsIG5nRGlhbG9nLCAkcm9vdFNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHRoaXMub3BlbkRlYWwgPSBvcGVuRGVhbDtcbiAgICAgIHRoaXMucXVlcnlTa3VzID0gcXVlcnlTa3VzO1xuICAgICAgdGhpcy5yZWdpc3RlciA9IHJlZ2lzdGVyO1xuICAgICAgdGhpcy5zdWJzdHJhY3RPbmUgPSBzdWJzdHJhY3RPbmU7XG4gICAgICB0aGlzLmNvdW50VG90YWwgPSBjb3VudFRvdGFsO1xuICAgICAgdGhpcy5jaGVja291dCA9IGNoZWNrb3V0OyBcbiAgICAgIHRoaXMub25DaGFuZ2VQYXlUeXBlID0gb25DaGFuZ2VQYXlUeXBlO1xuICAgICAgdGhpcy5jb3VudENoYW5nZSA9IGNvdW50Q2hhbmdlO1xuICAgICAgdGhpcy5wYXkgPSBwYXk7XG4gICAgICB0aGlzLnBheVR5cGUgPSB7XG4gICAgICAgIGRlcG9zaXQ6IFwi5Lya5ZGY5YKo5YC8XCIsXG4gICAgICAgIGNhc2g6IFwi546w6YeR5pSv5LuYXCIsXG4gICAgICAgIGJhbmtjYXJkOiBcIuWIt+WNoeaUr+S7mFwiLFxuICAgICAgICB3eHBheTogXCLlvq7kv6HmlK/ku5hcIixcbiAgICAgICAgYWxpcGF5OiBcIuaUr+S7mOWunVwiXG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBvcGVuRGVhbChtZW1iZXIpIHtcbiAgICAgICAgc2VsZi5kZWFsID0ge1xuICAgICAgICAgIGVudGl0aWVzOiBbXSxcbiAgICAgICAgICB0b3RhbEFtb3VudDogMCxcbiAgICAgICAgICB0b3RhbFF0eTogMCxcbiAgICAgICAgICBtZW1iZXI6IG1lbWJlcixcbiAgICAgICAgICBzdGF0dXM6ICdvcGVuZWQnLFxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKClcbiAgICAgICAgfVxuICAgICAgICBzZWxmLnNlbGVjdGVkU2t1ID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBxdWVyeVNrdXMgKHZhbCkge1xuICAgICAgICByZXR1cm4gU2t1LmZpbmQoe2ZpbHRlcjp7d2hlcmU6e2JhcmNvZGU6e3JlZ2V4OiB2YWx9fX0sIGxpbWl0OiAxMH0pXG4gICAgICAgIC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChza3VzKSB7XG4gICAgICAgICAgcmV0dXJuIHNrdXM7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICBmdW5jdGlvbiByZWdpc3RlciAoKSB7XG4gICAgICAgIGlmKHNlbGYuc2VsZWN0ZWRTa3UgJiYgc2VsZi5zZWxlY3RlZFNrdSBpbnN0YW5jZW9mIFNrdSkge1xuICAgICAgICAgIHZhciBlbnRpdHkgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHNlbGYuZGVhbC5lbnRpdGllcywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmKGUuc2t1LmJhcmNvZGUgPT09IHNlbGYuc2VsZWN0ZWRTa3UuYmFyY29kZSl7XG4gICAgICAgICAgICAgIGUucXR5Kys7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYoIWVudGl0eSkge1xuICAgICAgICAgICAgZW50aXR5ID0ge1xuICAgICAgICAgICAgICBza3U6IHNlbGYuc2VsZWN0ZWRTa3UsXG4gICAgICAgICAgICAgIHF0eTogMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHNlbGYuZGVhbC5lbnRpdGllcy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNlbGYuc2VsZWN0ZWRTa3UgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHN1YnN0cmFjdE9uZSAoZW50aXR5LCBpbmRleCkge1xuICAgICAgICBlbnRpdHkucXR5LS07XG4gICAgICAgIGlmKGVudGl0eS5xdHkgPT09IDApIHtcbiAgICAgICAgICBzZWxmLmRlYWwuZW50aXRpZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICBmdW5jdGlvbiBjb3VudFRvdGFsICgpIHtcbiAgICAgICAgc2VsZi5kZWFsLnRvdGFsQW1vdW50ID0gMDtcbiAgICAgICAgc2VsZi5kZWFsLnRvdGFsUXR5ID0gMDtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHNlbGYuZGVhbC5lbnRpdGllcywgZnVuY3Rpb24gKGVudGl0eSkge1xuICAgICAgICAgIHNlbGYuZGVhbC50b3RhbFF0eSArPSBlbnRpdHkucXR5O1xuICAgICAgICAgIHNlbGYuZGVhbC50b3RhbEFtb3VudCArPSBlbnRpdHkucXR5KmVudGl0eS5za3UucHJpY2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc2VsZi5kZWFsLnRvdGFsQW1vdW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBjaGVja291dCAoKSB7XG4gICAgICAgIHNlbGYuZGVhbC5wYXltZW50ID0ge3R5cGU6ICdjYXNoJ307XG4gICAgICAgIGlmKHNlbGYuZGVhbC5tZW1iZXIpIHtcbiAgICAgICAgICBzZWxmLmRlYWwubWVtYmVySWQgPSBzZWxmLmRlYWwubWVtYmVyLmlkO1xuICAgICAgICAgIHNlbGYuZGVhbC5kaXNjb3VudEFtb3VudCA9IHNlbGYuZGVhbC50b3RhbEFtb3VudCooMTAwLXNlbGYuZGVhbC5tZW1iZXIuZGlzY291bnQpLzEwMDtcbiAgICAgICAgICBpZigkcm9vdFNjb3BlLnVzZXIubWVyY2hhbnQuZW5hYmxlQm9udXNCaWQpIHtcbiAgICAgICAgICAgIHNlbGYuZGVhbC5ib251c1ZvdWNoQW1vdW50ID0gTWF0aC5yb3VuZChzZWxmLmRlYWwubWVtYmVyLmJvbnVzLyRyb290U2NvcGUudXNlci5tZXJjaGFudC5ib251c0JpZFJhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLmRlYWwuZGlzY291bnRBbW91bnQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuZGVhbC5mZWUgPSBzZWxmLmRlYWwudG90YWxBbW91bnQtc2VsZi5kZWFsLmRpc2NvdW50QW1vdW50O1xuICAgICAgICBpZihzZWxmLmRlYWwubWVtYmVyKSB7XG4gICAgICAgICAgaWYoJHJvb3RTY29wZS51c2VyLm1lcmNoYW50LmVuYWJsZUJvbnVzQmlkKSB7XG4gICAgICAgICAgICBpZihzZWxmLmRlYWwuYm9udXNWb3VjaEFtb3VudCA+IHNlbGYuZGVhbC5mZWUpIHtcbiAgICAgICAgICAgICAgc2VsZi5kZWFsLmJvbnVzVm91Y2hBbW91bnQgPSBzZWxmLmRlYWwuZmVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5kZWFsLmZlZSAtPSBzZWxmLmRlYWwuYm9udXNWb3VjaEFtb3VudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoc2VsZi5kZWFsLm1lbWJlci5iYWxhbmNlID49IHNlbGYuZGVhbC5mZWUpIHtcbiAgICAgICAgICAgIHNlbGYuZGVhbC5wYXltZW50LnR5cGUgPSAnZGVwb3NpdCc7XG4gICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICBcbiAgICAgICAgb25DaGFuZ2VQYXlUeXBlKCk7XG4gICAgICAgIFxuICAgICAgICBuZ0RpYWxvZy5vcGVuKHsgXG4gICAgICAgICAgdGVtcGxhdGU6ICdjaGVja291dERpYWxvZ0lkJywgXG4gICAgICAgICAgY29udHJvbGxlcjogJ2NoZWNrb3V0RGlhbG9nQ29udHJvbGxlcidcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIG9uQ2hhbmdlUGF5VHlwZSgpIHtcbiAgICAgICAgc2VsZi5kZWFsLnBheW1lbnQuYW1vdW50ID0gc2VsZi5kZWFsLmZlZTtcbiAgICAgICAgaWYoc2VsZi5kZWFsLnBheW1lbnQudHlwZSA9PT0gJ2Nhc2gnKSB7XG4gICAgICAgICAgc2VsZi5kZWFsLnBheW1lbnQuY2hhbmdlID0gc2VsZi5kZWFsLmZlZSUkcm9vdFNjb3BlLnVzZXIubWVyY2hhbnQuY2hhbmdlUmF0ZTtcbiAgICAgICAgICBzZWxmLmRlYWwucGF5bWVudC5hbW91bnQgLT0gc2VsZi5kZWFsLnBheW1lbnQuY2hhbmdlO1xuICAgICAgICAgIGNvdW50Q2hhbmdlKCk7XG4gICAgICAgIH0gZWxzZSBpZihzZWxmLmRlYWwucGF5bWVudC50eXBlID09PSAnZGVwb3NpdCcpIHtcbiAgICAgICAgICBzZWxmLmRlYWwucGF5bWVudC5hbW91bnQgPSAwLXNlbGYuZGVhbC5mZWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5kZWFsLnBheW1lbnQuYW1vdW50ID0gc2VsZi5kZWFsLmZlZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBjb3VudENoYW5nZSgpIHtcbiAgICAgICAgaWYoc2VsZi5kZWFsLnBheW1lbnQudHlwZSA9PT0gJ2Nhc2gnKSB7XG4gICAgICAgICAgc2VsZi5jYXNoID0gc2VsZi5jYXNoIHx8IHt9O1xuICAgICAgICAgIHNlbGYuY2FzaC5wYWlkID0gc2VsZi5jYXNoLnBhaWQgfHwgc2VsZi5kZWFsLnBheW1lbnQuYW1vdW50O1xuICAgICAgICAgIHNlbGYuY2FzaC5jaGFuZ2UgPSBzZWxmLmRlYWwucGF5bWVudC5hbW91bnQgLSBzZWxmLmNhc2gucGFpZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXkoKSB7XG4gICAgICAgIHNlbGYuZGVhbC5zdGF0dXMgPSAnY2xvc2VkJztcbiAgICAgICAgZGVsZXRlIHNlbGYuZGVhbC5tZW1iZXI7XG4gICAgICAgIHJldHVybiBEZWFsLmNyZWF0ZShzZWxmLmRlYWwpLiRwcm9taXNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVyblNlcnZpY2UuJGluamVjdCA9IFsnRGVhbCcsICdTa3UnLCAnbmdEaWFsb2cnLCAnJHJvb3RTY29wZSddO1xuICAgIGZ1bmN0aW9uIHJldHVyblNlcnZpY2UoRGVhbCwgU2t1LCBuZ0RpYWxvZywgJHJvb3RTY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB0aGlzLm9wZW5SZXR1cm4gPSBvcGVuUmV0dXJuO1xuICAgICAgdGhpcy5jaGVja291dCA9IGNoZWNrb3V0O1xuICAgICAgdGhpcy5kb1JldHVybiA9IGRvUmV0dXJuO1xuICAgICAgdGhpcy5jb3VudCA9IGNvdW50O1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBvcGVuUmV0dXJuKGRlYWwpIHtcbiAgICAgICAgc2VsZi5kZWFsID0gZGVhbDtcbiAgICAgICAgc2VsZi5wb3N0RGF0YSA9IHtcbiAgICAgICAgICBlbnRpdGllczogW10sXG4gICAgICAgICAgdG90YWxBbW91bnQ6IDAsXG4gICAgICAgICAgdG90YWxRdHk6IDAsXG4gICAgICAgICAgc3RhdHVzOiAnb3BlbmVkJyxcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gY291bnQoKSB7XG4gICAgICAgIHNlbGYucG9zdERhdGEudG90YWxBbW91bnQgPSAwO1xuICAgICAgICBzZWxmLnBvc3REYXRhLnRvdGFsUXR5ID0gMDtcbiAgICAgICAgc2VsZi5wb3N0RGF0YS5lbnRpdGllcy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICAgICAgICBzZWxmLnBvc3REYXRhLnRvdGFsQW1vdW50ICs9IGVudGl0eS5xdHkqZW50aXR5LnNrdS5wcmljZTtcbiAgICAgICAgICBzZWxmLnBvc3REYXRhLnRvdGFsUXR5ICs9IGVudGl0eS5xdHk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYucG9zdERhdGEuZGlzY291bnRBbW91bnQgPSAwO1xuICAgICAgICBpZihzZWxmLmRlYWwubWVtYmVyKSB7XG4gICAgICAgICAgc2VsZi5wb3N0RGF0YS5kaXNjb3VudEFtb3VudCA9IHNlbGYucG9zdERhdGEudG90YWxBbW91bnQqKDEwMC1zZWxmLmRlYWwubWVtYmVyLmRpc2NvdW50KS8xMDA7ICAgICAgICAgICB9XG4gICAgICAgIHNlbGYucG9zdERhdGEuZmVlID0gc2VsZi5wb3N0RGF0YS50b3RhbEFtb3VudCAtIHNlbGYucG9zdERhdGEuZGlzY291bnRBbW91bnQ7XG4gICAgICAgIHNlbGYucG9zdERhdGEucGF5bWVudC5hbW91bnQgPSBzZWxmLnBvc3REYXRhLmZlZTtcbiAgICAgICAgaWYoc2VsZi5wb3N0RGF0YS5wYXltZW50LnR5cGUgPT09ICdjYXNoJykge1xuICAgICAgICAgIHNlbGYucG9zdERhdGEucGF5bWVudC5jaGFuZ2UgPSBzZWxmLnBvc3REYXRhLmZlZSUkcm9vdFNjb3BlLnVzZXIubWVyY2hhbnQuY2hhbmdlUmF0ZTtcbiAgICAgICAgICBzZWxmLnBvc3REYXRhLnBheW1lbnQuYW1vdW50IC09IHNlbGYucG9zdERhdGEucGF5bWVudC5jaGFuZ2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gY2hlY2tvdXQoZW50aXR5KSB7XG4gICAgICAgIHNlbGYucG9zdERhdGEucGF5bWVudCA9IHt0eXBlOiBzZWxmLmRlYWwucGF5bWVudC50eXBlfTtcbiAgICAgICAgXG4gICAgICAgIHZhciBlbnRpdGllcyA9IHNlbGYuZGVhbC5lbnRpdGllcztcbiAgICAgICAgaWYoZW50aXR5KSBlbnRpdGllcyA9IFtlbnRpdHldO1xuICAgICAgICBcbiAgICAgICAgc2VsZi5wb3N0RGF0YS5lbnRpdGllcyA9IFtdO1xuICAgICAgICBlbnRpdGllcy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICAgICAgICB2YXIgZSA9ICB7XG4gICAgICAgICAgICBza3U6IGVudGl0eS5za3UsXG4gICAgICAgICAgICBxdHk6IGVudGl0eS5xdHkgLSBlbnRpdHkucmV0dXJuZWRRdHlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoZS5xdHkgPiAwKSBzZWxmLnBvc3REYXRhLmVudGl0aWVzLnB1c2goZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgY291bnQoKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBuZ0RpYWxvZy5vcGVuKHsgXG4gICAgICAgICAgdGVtcGxhdGU6ICdjaGVja291dFJldHVybkRpYWxvZ0lkJywgXG4gICAgICAgICAgY29udHJvbGxlcjogJ2NoZWNrb3V0UmV0dXJuRGlhbG9nQ29udHJvbGxlcidcbiAgICAgICAgfSkuY2xvc2VQcm9taXNlO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBkb1JldHVybigpIHtcbiAgICAgICAgc2VsZi5wb3N0RGF0YS5zdGF0dXMgPSAnY2xvc2VkJztcbiAgICAgICAgcmV0dXJuIERlYWwucmV0dXJucy5jcmVhdGUoe2lkOiBzZWxmLmRlYWwuaWR9LCBzZWxmLnBvc3REYXRhKS4kcHJvbWlzZTtcbiAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgIC5tb2R1bGUoJ2FwcC5zYWxlcycpXG4gICAgICAuY29udHJvbGxlcignU2VsbENvbnRyb2xsZXInLCBTZWxsQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdjaGVja291dERpYWxvZ0NvbnRyb2xsZXInLCBjaGVja291dERpYWxvZ0NvbnRyb2xsZXIpXG4gICAgICAuY29udHJvbGxlcignRGVhbHNDb250cm9sbGVyJywgRGVhbHNDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ0RlYWxDb250cm9sbGVyJywgRGVhbENvbnRyb2xsZXIpXG4gICAgICAuY29udHJvbGxlcignY2hlY2tvdXRSZXR1cm5EaWFsb2dDb250cm9sbGVyJywgY2hlY2tvdXRSZXR1cm5EaWFsb2dDb250cm9sbGVyKVxuICAgIDtcbiAgICAgIFxuICAgIFNlbGxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdkZWFsU2VydmljZScsICdDaGVja2luJ107XG4gICAgZnVuY3Rpb24gU2VsbENvbnRyb2xsZXIoJHNjb3BlLCBkZWFsU2VydmljZSwgQ2hlY2tpbikge1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgIFxuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICRzY29wZS5kZWFsU2VydmljZSA9IGRlYWxTZXJ2aWNlO1xuICAgICAgICBpZighZGVhbFNlcnZpY2UuZGVhbCkge1xuICAgICAgICAgIGRlYWxTZXJ2aWNlLm9wZW5EZWFsKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIENIRUNLSU5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG4gICAgICAgIHZtLmNoZWNraW5zID0gQ2hlY2tpbi5maW5kKHtmaWx0ZXI6e1xuICAgICAgICAgIHdoZXJlOiB7bWVyY2hhbnRJZDogJHNjb3BlLnVzZXIuc2hvcElkfSxcbiAgICAgICAgICBpbmNsdWRlOiBbe21lbWJlcjogJ3d4dXNlcid9XSxcbiAgICAgICAgICBsaW1pdDogMTAsIFxuICAgICAgICAgIG9yZGVyOiAnY3JlYXRlZCBERVNDJ1xuICAgICAgICB9fSk7XG4gICAgICAgIFxuICAgICAgICB2bS50ZW1wbGF0ZVVybCA9ICdjaGVja2luc1RlbXBsYXRlLmh0bWwnO1xuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIGNoZWNrb3V0RGlhbG9nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnbmdEaWFsb2cnLCAnZGVhbFNlcnZpY2UnLCAndG9hc3RlciddO1xuICAgIGZ1bmN0aW9uIGNoZWNrb3V0RGlhbG9nQ29udHJvbGxlcigkc2NvcGUsIG5nRGlhbG9nLCBkZWFsU2VydmljZSwgdG9hc3Rlcikge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICRzY29wZS5kZWFsU2VydmljZSA9IGRlYWxTZXJ2aWNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY29uZmlybSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBkZWFsU2VydmljZS5wYXkoKS50aGVuKGZ1bmN0aW9uIChkZWFsKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBuZ0RpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgICAgZGVhbFNlcnZpY2Uub3BlbkRlYWwoKTtcbiAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ+aIkOWKnycsIFwi5a6M5oiQ5Lqk5piTXCIpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsICflpLHotKUnLCBcIuS6pOaYk+acquWujOaIkO+8jOivt+mHjeivle+8gVwiKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICBEZWFsc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0RlYWwnLCAnbmdUYWJsZVBhcmFtcycsICduZ1RhYmxlTEJTZXJ2aWNlJ107XG4gICAgZnVuY3Rpb24gRGVhbHNDb250cm9sbGVyKCRzY29wZSwgRGVhbCwgbmdUYWJsZVBhcmFtcywgbmdUYWJsZUxCU2VydmljZSkge1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIFxuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIHZtLmtleXdvcmQgPSBcIlwiO1xuICAgICAgICB2bS50YWJsZVBhcmFtcyA9IG5ldyBuZ1RhYmxlUGFyYW1zKHtjb3VudDogMTB9LCB7XG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJGRlZmVyLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXIgPSB7d2hlcmU6e3N0YXR1czp7bmU6J2RlbGV0ZWQnfX0sIGluY2x1ZGU6W119XG4gICAgICAgICAgICBpZih2bS5rZXl3b3JkICE9ICcnKSB7XG4gICAgICAgICAgICAgIHZhciBxcyA9IHtyZWdleDoga2V5d29yZH07XG4gICAgICAgICAgICAgIGZpbHRlci53aGVyZS5vciA9IFt7XCJlbnRpdGllcy5za3UuaXRlbS5uYW1lXCI6cXN9XTtcbiAgICAgICAgICAgICAgcGFyYW1zLnBhZ2UoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZ1RhYmxlTEJTZXJ2aWNlLmdldERhdGEoJGRlZmVyLCBwYXJhbXMsIERlYWwsIGZpbHRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgRGVhbENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0RlYWwnLCAnbmdUYWJsZVBhcmFtcycsICduZ1RhYmxlTEJTZXJ2aWNlJywgJ3JldHVyblNlcnZpY2UnXTtcbiAgICBmdW5jdGlvbiBEZWFsQ29udHJvbGxlcigkc2NvcGUsIERlYWwsIG5nVGFibGVQYXJhbXMsIG5nVGFibGVMQlNlcnZpY2UsIHJldHVyblNlcnZpY2UpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICBcbiAgICAgIGFjdGl2YXRlKCk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICB2bS5yZXR1cm5Ta3UgPSB7fTtcbiAgICAgICAgdm0uZGVhbCA9IERlYWwuZmluZE9uZSh7ZmlsdGVyOntcbiAgICAgICAgICB3aGVyZToge2lkOiAkc2NvcGUuJHN0YXRlLnBhcmFtcy5kZWFsSWR9LFxuICAgICAgICAgIGluY2x1ZGU6WydyZXR1cm5zJywgJ2JvbnVzZXMnXVxuICAgICAgICB9fSk7XG4gICAgICAgIHZtLmRlYWwuJHByb21pc2UudGhlbihmdW5jdGlvbiAoZGVhbCkge1xuICAgICAgICAgIHZtLmRlYWwuZW50aXRpZXMuZm9yRWFjaChmdW5jdGlvbiAoZW50aXR5KSB7XG4gICAgICAgICAgICBlbnRpdHkucmV0dXJuZWRRdHkgPSAwO1xuICAgICAgICAgICAgdm0ucmV0dXJuU2t1W2VudGl0eS5za3UuaWRdID0gZW50aXR5O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmKHZtLmRlYWwucmV0dXJucyAmJiB2bS5kZWFsLnJldHVybnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdm0uZGVhbC5yZXR1cm5zLmZvckVhY2goZnVuY3Rpb24gKHJldCkge1xuICAgICAgICAgICAgICByZXQuZW50aXRpZXMuZm9yRWFjaChmdW5jdGlvbiAocmV0dXJuRW50aXR5KSB7XG4gICAgICAgICAgICAgICAgdm0ucmV0dXJuU2t1W3JldHVybkVudGl0eS5za3UuaWRdLnJldHVybmVkUXR5ICs9IHJldHVybkVudGl0eS5xdHk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2bS5yZXR1cm4gPSB2bS5kZWFsLnJldHVybnNbMF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLnJldHVybiA9IHtlbnRpdGllczpbXX07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVyblNlcnZpY2Uub3BlblJldHVybih2bS5kZWFsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmdvUmV0dXJuID0gZnVuY3Rpb24gKGVudGl0eSkge1xuICAgICAgICByZXR1cm5TZXJ2aWNlLmNoZWNrb3V0KGVudGl0eSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGFjdGl2YXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrb3V0UmV0dXJuRGlhbG9nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnbmdEaWFsb2cnLCAncmV0dXJuU2VydmljZScsICd0b2FzdGVyJ107XG4gICAgZnVuY3Rpb24gY2hlY2tvdXRSZXR1cm5EaWFsb2dDb250cm9sbGVyKCRzY29wZSwgbmdEaWFsb2csIHJldHVyblNlcnZpY2UsIHRvYXN0ZXIpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAkc2NvcGUucmV0dXJuU2VydmljZSA9IHJldHVyblNlcnZpY2U7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5jb25maXJtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVyblNlcnZpY2UuZG9SZXR1cm4oKS50aGVuKGZ1bmN0aW9uIChyZXQpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIG5nRGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICfmiJDlip8nLCBcIuWujOaIkOmAgOasvumAgOi0p1wiKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCAn5aSx6LSlJywgXCLpgIDmrL7pgIDotKfmnKrlrozmiJDvvIzor7fph43or5XvvIFcIilcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbn0pKCk7IiwiLyoqXG4gKiBBbmd1bGFySlMgZGVmYXVsdCBmaWx0ZXIgd2l0aCB0aGUgZm9sbG93aW5nIGV4cHJlc3Npb246XG4gKiBcInBlcnNvbiBpbiBwZW9wbGUgfCBmaWx0ZXI6IHtuYW1lOiAkc2VsZWN0LnNlYXJjaCwgYWdlOiAkc2VsZWN0LnNlYXJjaH1cIlxuICogcGVyZm9ybXMgYSBBTkQgYmV0d2VlbiAnbmFtZTogJHNlbGVjdC5zZWFyY2gnIGFuZCAnYWdlOiAkc2VsZWN0LnNlYXJjaCcuXG4gKiBXZSB3YW50IHRvIHBlcmZvcm0gYSBPUi5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuc2FsZXMnKVxuICAgICAgICAuZmlsdGVyKCdkZWFsX3N0YXR1cycsIGRlYWxTdGF0dXNGaWx0ZXIpXG4gICAgICAgIC5maWx0ZXIoJ3BheW1lbnRfdHlwZScsIHBheW1lbnRUeXBlRmlsdGVyKVxuICAgIDtcblxuICAgIHBheW1lbnRUeXBlRmlsdGVyLiRpbmplY3QgPSBbJ2RlYWxTZXJ2aWNlJ107XG4gICAgZnVuY3Rpb24gcGF5bWVudFR5cGVGaWx0ZXIoZGVhbFNlcnZpY2UpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIHJldHVybiBkZWFsU2VydmljZS5wYXlUeXBlW2tleV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkZWFsU3RhdHVzRmlsdGVyLiRpbmplY3QgPSBbXTtcbiAgICBmdW5jdGlvbiBkZWFsU3RhdHVzRmlsdGVyKCkge1xuICAgICAgdmFyIGRpYyA9IHtcbiAgICAgICAgY2xvc2VkOiAn5bey5a6M5oiQJ1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIGRpY1trZXldO1xuICAgICAgfVxuICAgIH1cbn0pKCk7IiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogaGVscGVycy5qc1xyXG4gKiBQcm92aWRlcyBoZWxwZXIgZnVuY3Rpb25zIGZvciByb3V0ZXMgZGVmaW5pdGlvblxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdXRlcycpXHJcbiAgICAgICAgLnByb3ZpZGVyKCdSb3V0ZUhlbHBlcnMnLCBSb3V0ZUhlbHBlcnNQcm92aWRlcilcclxuICAgICAgICA7XHJcblxyXG4gICAgUm91dGVIZWxwZXJzUHJvdmlkZXIuJGluamVjdCA9IFsnQVBQX1JFUVVJUkVTJ107XHJcbiAgICBmdW5jdGlvbiBSb3V0ZUhlbHBlcnNQcm92aWRlcihBUFBfUkVRVUlSRVMpIHtcclxuXHJcbiAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIHByb3ZpZGVyIGFjY2VzcyBsZXZlbFxyXG4gICAgICAgIGJhc2VwYXRoOiBiYXNlcGF0aCxcclxuICAgICAgICByZXNvbHZlRm9yOiByZXNvbHZlRm9yLFxyXG4gICAgICAgIC8vIGNvbnRyb2xsZXIgYWNjZXNzIGxldmVsXHJcbiAgICAgICAgJGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBiYXNlcGF0aDogYmFzZXBhdGgsXHJcbiAgICAgICAgICAgIHJlc29sdmVGb3I6IHJlc29sdmVGb3JcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gU2V0IGhlcmUgdGhlIGJhc2Ugb2YgdGhlIHJlbGF0aXZlIHBhdGhcclxuICAgICAgLy8gZm9yIGFsbCBhcHAgdmlld3NcclxuICAgICAgZnVuY3Rpb24gYmFzZXBhdGgodXJpKSB7XHJcbiAgICAgICAgcmV0dXJuICdhcHAvdmlld3MvJyArIHVyaTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gR2VuZXJhdGVzIGEgcmVzb2x2ZSBvYmplY3QgYnkgcGFzc2luZyBzY3JpcHQgbmFtZXNcclxuICAgICAgLy8gcHJldmlvdXNseSBjb25maWd1cmVkIGluIGNvbnN0YW50LkFQUF9SRVFVSVJFU1xyXG4gICAgICBmdW5jdGlvbiByZXNvbHZlRm9yKCkge1xyXG4gICAgICAgIHZhciBfYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgZGVwczogWyckb2NMYXp5TG9hZCcsJyRxJywgZnVuY3Rpb24gKCRvY0xMLCAkcSkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGVzIGEgcHJvbWlzZSBjaGFpbiBmb3IgZWFjaCBhcmd1bWVudFxyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLndoZW4oMSk7IC8vIGVtcHR5IHByb21pc2VcclxuICAgICAgICAgICAgZm9yKHZhciBpPTAsIGxlbj1fYXJncy5sZW5ndGg7IGkgPCBsZW47IGkgKyspe1xyXG4gICAgICAgICAgICAgIHByb21pc2UgPSBhbmRUaGVuKF9hcmdzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZXMgcHJvbWlzZSB0byBjaGFpbiBkeW5hbWljYWxseVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBhbmRUaGVuKF9hcmcpIHtcclxuICAgICAgICAgICAgICAvLyBhbHNvIHN1cHBvcnQgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlXHJcbiAgICAgICAgICAgICAgaWYodHlwZW9mIF9hcmcgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oX2FyZyk7XHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGlzIGEgbW9kdWxlLCBwYXNzIHRoZSBuYW1lLiBJZiBub3QsIHBhc3MgdGhlIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdoYXRUb0xvYWQgPSBnZXRSZXF1aXJlZChfYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaW1wbGUgZXJyb3IgY2hlY2tcclxuICAgICAgICAgICAgICAgICAgICBpZighd2hhdFRvTG9hZCkgcmV0dXJuICQuZXJyb3IoJ1JvdXRlIHJlc29sdmU6IEJhZCByZXNvdXJjZSBuYW1lIFsnICsgX2FyZyArICddJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZmluYWxseSwgcmV0dXJuIGEgcHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMTC5sb2FkKCB3aGF0VG9Mb2FkICk7XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGFuZCByZXR1cm5zIHJlcXVpcmVkIGRhdGFcclxuICAgICAgICAgICAgLy8gYW5hbHl6ZSBtb2R1bGUgaXRlbXMgd2l0aCB0aGUgZm9ybSBbbmFtZTogJycsIGZpbGVzOiBbXV1cclxuICAgICAgICAgICAgLy8gYW5kIGFsc28gc2ltcGxlIGFycmF5IG9mIHNjcmlwdCBmaWxlcyAoZm9yIG5vdCBhbmd1bGFyIGpzKVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRSZXF1aXJlZChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgaWYgKEFQUF9SRVFVSVJFUy5tb2R1bGVzKVxyXG4gICAgICAgICAgICAgICAgICBmb3IodmFyIG0gaW4gQVBQX1JFUVVJUkVTLm1vZHVsZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICBpZihBUFBfUkVRVUlSRVMubW9kdWxlc1ttXS5uYW1lICYmIEFQUF9SRVFVSVJFUy5tb2R1bGVzW21dLm5hbWUgPT09IG5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFQUF9SRVFVSVJFUy5tb2R1bGVzW21dO1xyXG4gICAgICAgICAgICAgIHJldHVybiBBUFBfUkVRVUlSRVMuc2NyaXB0cyAmJiBBUFBfUkVRVUlSRVMuc2NyaXB0c1tuYW1lXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH1dfTtcclxuICAgICAgfSAvLyByZXNvbHZlRm9yXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbn0pKCk7XHJcblxyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBjb25maWcuanNcclxuICogQXBwIHJvdXRlcyBhbmQgcmVzb3VyY2VzIGNvbmZpZ3VyYXRpb25cclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm91dGVzJylcclxuICAgICAgICAuY29uZmlnKHJvdXRlc0NvbmZpZyk7XHJcblxyXG4gICAgcm91dGVzQ29uZmlnLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICdSb3V0ZUhlbHBlcnNQcm92aWRlciddO1xyXG4gICAgZnVuY3Rpb24gcm91dGVzQ29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCBoZWxwZXIpe1xyXG5cclxuICAgICAgICAvLyBTZXQgdGhlIGZvbGxvd2luZyB0byB0cnVlIHRvIGVuYWJsZSB0aGUgSFRNTDUgTW9kZVxyXG4gICAgICAgIC8vIFlvdSBtYXkgaGF2ZSB0byBzZXQgPGJhc2U+IHRhZyBpbiBpbmRleCBhbmQgYSByb3V0aW5nIGNvbmZpZ3VyYXRpb24gaW4geW91ciBzZXJ2ZXJcclxuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoZmFsc2UpO1xyXG5cclxuICAgICAgICAvLyBkZWZhdWx0cyB0byBkYXNoYm9hcmRcclxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvYXBwL2Rhc2hib2FyZCcpO1xyXG5cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIEFwcGxpY2F0aW9uIFJvdXRlc1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwJywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9hcHAnLFxyXG4gICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBoZWxwZXIuYmFzZXBhdGgoJ2FwcC5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ2Zhc3RjbGljaycsICdtb2Rlcm5penInLCAnaWNvbnMnLCAnc2NyZWVuZnVsbCcsICdhbmltbycsICdzcGFya2xpbmVzJywgJ3NsaW1zY3JvbGwnLCAnY2xhc3N5bG9hZGVyJywgJ3RvYXN0ZXInLCAnd2hpcmwnLCAnbW9tZW50JylcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ2FwcC5kYXNoYm9hcmQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2Rhc2hib2FyZCcsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdEYXNoYm9hcmQnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBoZWxwZXIuYmFzZXBhdGgoJ2Rhc2hib2FyZC5odG1sJyksXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Rhc2hib2FyZENvbnRyb2xsZXIgYXMgZGFzaCcsXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ2Zsb3QtY2hhcnQnLCdmbG90LWNoYXJ0LXBsdWdpbnMnLCAnd2VhdGhlci1pY29ucycpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAuc2VsbCcsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvc2VsbCcsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdzZWxsJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdzZWxsLmh0bWwnKSxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2VsbENvbnRyb2xsZXIgYXMgc2VsbCcsXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdEaWFsb2cnLCAnb2l0b3plcm8ubmdTd2VldEFsZXJ0JywgJ2xvYWRlcnMuY3NzJywgJ3NwaW5raXQnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLm1lbWJlcnMnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL21lbWJlcnMnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnTWVtYmVycycsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnbWVtYmVycy5odG1sJyksXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01lbWJlcnNDb250cm9sbGVyIGFzIG1lbWJlcnMnLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCduZ1RhYmxlJywgJ25nVGFibGVFeHBvcnQnLCAnbmdEaWFsb2cnLCAnb2l0b3plcm8ubmdTd2VldEFsZXJ0JywgJ3NwaW5raXQnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLm1lbWJlcicsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvbWVtYmVycy86bWVtYmVySWQnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnTWVtYmVyIERldGFpbCcsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnbWVtYmVyLmh0bWwnKSxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWVtYmVyQ29udHJvbGxlciBhcyBtZW1iZXInLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCduZ1RhYmxlJywgJ25nRGlhbG9nJywgJ29pdG96ZXJvLm5nU3dlZXRBbGVydCcsICdzcGlua2l0JylcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ2FwcC5kZWFscycsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvZGVhbHMnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnRGVhbHMnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBoZWxwZXIuYmFzZXBhdGgoJ2RlYWxzLmh0bWwnKSxcclxuICAgICAgICAgICAgICByZXNvbHZlOiBoZWxwZXIucmVzb2x2ZUZvcignbmdUYWJsZScsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAuZGVhbCcsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvZGVhbHMvOmRlYWxJZCcsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdEZWFsJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdkZWFsLmh0bWwnKSxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGVhbENvbnRyb2xsZXIgYXMgZGMnLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCduZ1RhYmxlJywgJ25nRGlhbG9nJywgJ29pdG96ZXJvLm5nU3dlZXRBbGVydCcsICdzcGlua2l0JylcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ2FwcC5jb3N0Jywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9jb3N0JyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0Nvc3QnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBoZWxwZXIuYmFzZXBhdGgoJ2Nvc3QuaHRtbCcpLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCduZ1RhYmxlJywgJ25nVGFibGVFeHBvcnQnLCAnbmdEaWFsb2cnLCAnb2l0b3plcm8ubmdTd2VldEFsZXJ0JywgJ3NwaW5raXQnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLml0ZW0nLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2l0ZW0nLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnSXRlbScsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnaXRlbS5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdUYWJsZUV4cG9ydCcsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAuaXRlbS1hZGQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2l0ZW0tYWRkJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0l0ZW0gQWRkJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdpdGVtLWFkZC5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ3BhcnNsZXknKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLmNhcmQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2NhcmQnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnQ2FyZCcsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnY2FyZC5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdUYWJsZUV4cG9ydCcsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAuY2FtcGFpZ24nLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2NhbXBhaWduJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0NhbXBhaWduJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdjYW1wYWlnbi5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdUYWJsZUV4cG9ydCcsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAubXlzaG9wJywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9teXNob3AnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnTXlTaG9wJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdteXNob3AuaHRtbCcpLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCd4ZWRpdGFibGUnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLnNldHRpbmcnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3NldHRpbmcnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnU2V0dGluZycsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnc2V0dGluZy5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdUYWJsZUV4cG9ydCcsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLy9cclxuICAgICAgICAgIC8vIFNpbmdsZSBQYWdlIFJvdXRlc1xyXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgIC5zdGF0ZSgncGFnZScsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZScsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvcGFnZS5odG1sJyxcclxuICAgICAgICAgICAgICByZXNvbHZlOiBoZWxwZXIucmVzb2x2ZUZvcignbW9kZXJuaXpyJywgJ2ljb25zJyksXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogWyckcm9vdFNjb3BlJywgZnVuY3Rpb24oJHJvb3RTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmFwcC5sYXlvdXQuaXNCb3hlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdwYWdlLmxvZ2luJywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdMb2dpbicsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvbG9naW4uaHRtbCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ3BhZ2UucmVnaXN0ZXInLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ1JlZ2lzdGVyJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy9yZWdpc3Rlci5odG1sJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgncGFnZS5yZWNvdmVyJywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9yZWNvdmVyJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ1JlY292ZXInLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BhZ2VzL3JlY292ZXIuaHRtbCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ3BhZ2UuNDA0Jywge1xyXG4gICAgICAgICAgICAgIHVybDogJy80MDQnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnTm90IEZvdW5kJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy80MDQuaHRtbCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAvL1xyXG4gICAgICAgICAgLy8gQ1VTVE9NIFJFU09MVkVTXHJcbiAgICAgICAgICAvLyAgIEFkZCB5b3VyIG93biByZXNvbHZlcyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAvLyAgIGZvbGxvd2luZyB0aGlzIG9iamVjdCBleHRlbmRcclxuICAgICAgICAgIC8vICAgbWV0aG9kXHJcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgLy8gLnN0YXRlKCdhcHAuc29tZXJvdXRlJywge1xyXG4gICAgICAgICAgLy8gICB1cmw6ICcvc29tZV91cmwnLFxyXG4gICAgICAgICAgLy8gICB0ZW1wbGF0ZVVybDogJ3BhdGhfdG9fdGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAvLyAgIGNvbnRyb2xsZXI6ICdzb21lQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAvLyAgIHJlc29sdmU6IGFuZ3VsYXIuZXh0ZW5kKFxyXG4gICAgICAgICAgLy8gICAgIGhlbHBlci5yZXNvbHZlRm9yKCksIHtcclxuICAgICAgICAgIC8vICAgICAvLyBZT1VSIFJFU09MVkVTIEdPIEhFUkVcclxuICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAvLyAgIClcclxuICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICA7XHJcblxyXG4gICAgfSAvLyByb3V0ZXNDb25maWdcclxuXHJcbn0pKCk7XHJcblxyXG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgICAgLm1vZHVsZSgnYXBwLnNldHRpbmdzJylcbiAgICAgIC5jb250cm9sbGVyKCdTZXR0aW5nQ29udHJvbGxlcicsIFNldHRpbmdDb250cm9sbGVyKVxuICBcbiAgU2V0dGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnTWVyY2hhbnQnLCAnU2hvcCcsICdNZW1iZXInLCAndG9hc3RlciddO1xuICBmdW5jdGlvbiBTZXR0aW5nQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsIE1lcmNoYW50LCBTaG9wLCBNZW1iZXIsIHRvYXN0ZXIpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmluZHVzdHJ5ID0ge1xuICAgICAgXCJJVOenkeaKgFwiOiB7XG4gICAgICAgIFwi5LqS6IGU572RL+eUteWtkOWVhuWKoVwiOiBcIjFcIixcbiAgICAgICAgXCJJVOi9r+S7tuS4juacjeWKoVwiOiBcIjJcIixcbiAgICAgICAgXCJJVOehrOS7tuS4juiuvuWkh1wiOiBcIjNcIixcbiAgICAgICAgXCLnlLXlrZDmioDmnK9cIjogXCI0XCIsXG4gICAgICAgIFwi6YCa5L+h5LiO6L+Q6JCl5ZWGXCI6IFwiNVwiLFxuICAgICAgICBcIue9kee7nOa4uOaIj1wiOiBcIjZcIlxuICAgICAgfSxcbiAgICAgIFwi6YeR6J6N5LiaXCI6IHtcbiAgICAgICAgXCLpk7booYxcIjogXCI3XCIsXG4gICAgICAgIFwi5Z+66YeRfOeQhui0onzkv6HmiZhcIjogXCI4XCIsXG4gICAgICAgIFwi5L+d6ZmpXCI6IFwiOVwiXG4gICAgICB9LFxuICAgICAgXCLppJDppa5cIjoge1xuICAgICAgICBcIumkkOmlrlwiOiBcIjEwXCJcbiAgICAgIH0sXG4gICAgICBcIumFkuW6l+aXhea4uFwiOiB7XG4gICAgICAgIFwi6YWS5bqXXCI6IFwiMTFcIixcbiAgICAgICAgXCLml4XmuLhcIjogXCIxMlwiXG4gICAgICB9LFxuICAgICAgXCLov5DovpPkuI7ku5PlgqhcIjoge1xuICAgICAgICBcIuW/q+mAklwiOiBcIjEzXCIsXG4gICAgICAgIFwi54mp5rWBXCI6IFwiMTRcIixcbiAgICAgICAgXCLku5PlgqhcIjogXCIxNVwiXG4gICAgICB9LFxuICAgICAgXCLmlZnogrJcIjoge1xuICAgICAgICBcIuWfueiurVwiOiBcIjE2XCIsXG4gICAgICAgIFwi6Zmi5qChXCI6IFwiMTdcIlxuICAgICAgfSxcbiAgICAgIFwi5pS/5bqc5LiO5YWs5YWx5LqL5LiaXCI6IHtcbiAgICAgICAgXCLlrabmnK/np5HnoJRcIjogXCIxOFwiLFxuICAgICAgICBcIuS6pOitplwiOiBcIjE5XCIsXG4gICAgICAgIFwi5Y2a54mp6aaGXCI6IFwiMjBcIixcbiAgICAgICAgXCLlhazlhbHkuovkuJp86Z2e55uI5Yip5py65p6EXCI6IFwiMjFcIlxuICAgICAgfSxcbiAgICAgIFwi5Yy76I2v5oqk55CGXCI6IHtcbiAgICAgICAgXCLljLvoja/ljLvnlpdcIjogXCIyMlwiLFxuICAgICAgICBcIuaKpOeQhue+juWuuVwiOiBcIjIzXCIsXG4gICAgICAgIFwi5L+d5YGl5LiO5Y2r55SfXCI6IFwiMjRcIlxuICAgICAgfSxcbiAgICAgIFwi5Lqk6YCa5bel5YW3XCI6IHtcbiAgICAgICAgXCLmsb3ovabnm7jlhbNcIjogXCIyNVwiLFxuICAgICAgICBcIuaRqeaJmOi9puebuOWFs1wiOiBcIjI2XCIsXG4gICAgICAgIFwi54Gr6L2m55u45YWzXCI6IFwiMjdcIixcbiAgICAgICAgXCLpo57mnLrnm7jlhbNcIjogXCIyOFwiXG4gICAgICB9LFxuICAgICAgXCLmiL/lnLDkuqdcIjoge1xuICAgICAgICBcIuW7uuetkVwiOiBcIjI5XCIsXG4gICAgICAgIFwi54mp5LiaXCI6IFwiMzBcIlxuICAgICAgfSxcbiAgICAgIFwi5raI6LS55ZOBXCI6IHtcbiAgICAgICAgXCLmtojotLnlk4FcIjogXCIzMVwiXG4gICAgICB9LFxuICAgICAgXCLllYbkuJrmnI3liqFcIjoge1xuICAgICAgICBcIuazleW+i1wiOiBcIjMyXCIsXG4gICAgICAgIFwi5Lya5bGVXCI6IFwiMzNcIixcbiAgICAgICAgXCLkuK3ku4vmnI3liqFcIjogXCIzNFwiLFxuICAgICAgICBcIuiupOivgVwiOiBcIjM1XCIsXG4gICAgICAgIFwi5a6h6K6hXCI6IFwiMzZcIlxuICAgICAgfSxcbiAgICAgIFwi5paH5L2T5aix5LmQXCI6IHtcbiAgICAgICAgXCLkvKDlqpJcIjogXCIzN1wiLFxuICAgICAgICBcIuS9k+iCslwiOiBcIjM4XCIsXG4gICAgICAgIFwi5aix5LmQ5LyR6ZeyXCI6IFwiMzlcIlxuICAgICAgfSxcbiAgICAgIFwi5Y2w5Yi3XCI6IHtcbiAgICAgICAgXCLljbDliLdcIjogXCI0MFwiXG4gICAgICB9LFxuICAgICAgXCLlhbblroNcIjoge1xuICAgICAgICBcIuWFtuWug1wiOiBcIjQxXCJcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWN0aXZldGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2ZXRlKCkge1xuICAgICAgdm0ud3hnaCA9IE1lcmNoYW50LnByb3RvdHlwZSRfX2dldF9fd3hnaCh7aWQ6ICRzY29wZS51c2VyLm1lcmNoYW50SWQsIHJlZnJlc2g6IHRydWV9KTtcbiAgICB9XG5cbiAgICB2bS51cGRhdGUgPSBmdW5jdGlvbiAoaXNTaG9wKSB7XG4gICAgICB2YXIgbW9kZWwgPSBNZXJjaGFudDtcbiAgICAgIHZhciBkYXRhID0gJHNjb3BlLnVzZXIubWVyY2hhbnQ7XG4gICAgICBpZihpc1Nob3ApIHtcbiAgICAgICAgZGF0YSA9ICRzY29wZS51c2VyLnNob3A7XG4gICAgICAgIG1vZGVsID0gU2hvcDtcbiAgICAgIH1cbiAgICAgIG1vZGVsLnVwZGF0ZSh7d2hlcmU6IHtpZDogZGF0YS5pZH19LCBkYXRhLCBmdW5jdGlvbiBzdWNjZXNzKHJlc3VsdCwgcmVzKSB7XG4gICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ+aIkOWKnycsIFwi6K6+572u5bey57uP5L+d5a2YXCIpO1xuICAgICAgfSwgZnVuY3Rpb24gZXJyb3IocmVzKSB7XG4gICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsICflpLHotKUnLCBcIuiuvue9ruacquaIkOWKn++8jOivt+mHjeivle+8gVwiKVxuICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIHZtLmFkZE1lbWJlckxldmVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGxldmVscyA9ICRzY29wZS51c2VyLm1lcmNoYW50Lm1lbWJlckxldmVscyB8fCBbXTtcbiAgICAgIHZhciBsYXN0ID0gbGV2ZWxzLmxlbmd0aCA+IDAgJiYgbGV2ZWxzW2xldmVscy5sZW5ndGgtMV0gfHwge3VwcGVyOiAtMX07XG4gICAgICBsZXZlbHMucHVzaCh7bG93ZXI6IGxhc3QudXBwZXIrMSwgdXBwZXI6IGxhc3QudXBwZXIrMTAwMCwgZGlzY291bnQ6MTAwLCBuYW1lOiAnVklQJ30pO1xuICAgICAgaWYoISRzY29wZS51c2VyLm1lcmNoYW50Lm1lbWJlckxldmVscykgJHNjb3BlLnVzZXIubWVyY2hhbnQubWVtYmVyTGV2ZWxzID0gbGV2ZWxzO1xuICAgIH1cbiAgICBcbiAgICB2bS51cGRhZXRlTWVtYmVyTGV2ZWxzID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLnVzZXIubWVyY2hhbnQubWVtYmVyTGV2ZWxzLmZvckVhY2goZnVuY3Rpb24gKGxldmVsKSB7XG4gICAgICAgIE1lbWJlci51cGRhdGUoe1xuICAgICAgICAgIHdoZXJlOiB7bWVyY2hhbnRJZDokc2NvcGUudXNlci5tZXJjaGFudC5pZCwgdG90YWxCb251czoge2d0ZTogbGV2ZWwubG93ZXIsIGx0ZTogbGV2ZWwudXBwZXJ9fVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZGlzY291bnQ6IGxldmVsLmRpc2NvdW50LCBsZXZlbDogbGV2ZWwubmFtZVxuICAgICAgICB9LCBmdW5jdGlvbiBzdWNlc3MocmVzdWx0LCByZXMpIHtcbiAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICfmiJDlip8nLCBcIuabtOaWsOWFqOS9k+S8muWRmOetiee6p+WujOaIkFwiKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gZXJyb3IocmVzKSB7XG4gICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgJ+Wksei0pScsIFwi5pu05paw5YWo5L2T5Lya5ZGY562J57qn5pyq5oiQ5Yqf77yM6K+36YeN6K+V77yBXCIpXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgICAgICAgICAgXG4gICAgdm0udXBkYXRlV3hnaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZtLnVwZGF0ZSgpO1xuICAgICAgTWVyY2hhbnQudXBkYXRlV3hnaCh7XG4gICAgICAgIGlkOiB2bS53eGdoLmlkLFxuICAgICAgICBhcHBpZDogdm0ud3hnaC5hcHBpZCxcbiAgICAgICAgYXBwc2VjcmV0OiB2bS53eGdoLmFwcHNlY3JldCxcbiAgICAgICAgaW5kdXN0cnk6ICRzY29wZS51c2VyLm1lcmNoYW50LmluZHVzdHJ5XG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ+aIkOWKnycsIFwi5b6u5L+h5YWs5LyX5Y+36K6+572u5bey57uP5L+d5a2YXCIpO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCAn5aSx6LSlJywgXCLorr7nva7mnKrmiJDlip/vvIzor7fph43or5XvvIFcIilcbiAgICAgIH0pO1xuICAgIH0gXG4gIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuc2V0dGluZ3MnKVxyXG4gICAgICAgIC5ydW4oc2V0dGluZ3NSdW4pO1xyXG5cclxuICAgIHNldHRpbmdzUnVuLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJGxvY2FsU3RvcmFnZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNldHRpbmdzUnVuKCRyb290U2NvcGUsICRsb2NhbFN0b3JhZ2Upe1xyXG5cclxuICAgICAgLy8gR2xvYmFsIFNldHRpbmdzXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG4gICAgICAkcm9vdFNjb3BlLmFwcCA9IHtcclxuICAgICAgICBuYW1lOiAn5rOb5Y2h5rGHV2ViUE9TJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ+WcqOe6v+aUtumTtuezu+e7nycsXHJcbiAgICAgICAgeWVhcjogKChuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpKSxcclxuICAgICAgICBsYXlvdXQ6IHtcclxuICAgICAgICAgIGlzRml4ZWQ6IHRydWUsXHJcbiAgICAgICAgICBpc0NvbGxhcHNlZDogZmFsc2UsXHJcbiAgICAgICAgICBpc0JveGVkOiBmYWxzZSxcclxuICAgICAgICAgIGlzUlRMOiBmYWxzZSxcclxuICAgICAgICAgIGhvcml6b250YWw6IGZhbHNlLFxyXG4gICAgICAgICAgaXNGbG9hdDogZmFsc2UsXHJcbiAgICAgICAgICBhc2lkZUhvdmVyOiBmYWxzZSxcclxuICAgICAgICAgIHRoZW1lOiBcImFwcC9jc3MvdGhlbWUtZS5jc3NcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXNlRnVsbExheW91dDogZmFsc2UsXHJcbiAgICAgICAgaGlkZGVuRm9vdGVyOiBmYWxzZSxcclxuICAgICAgICBvZmZzaWRlYmFyT3BlbjogZmFsc2UsXHJcbiAgICAgICAgYXNpZGVUb2dnbGVkOiBmYWxzZSxcclxuICAgICAgICB2aWV3QW5pbWF0aW9uOiAnbmctZmFkZUluVXAnXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBTZXR1cCB0aGUgbGF5b3V0IG1vZGVcclxuICAgICAgJHJvb3RTY29wZS5hcHAubGF5b3V0Lmhvcml6b250YWwgPSAoICRyb290U2NvcGUuJHN0YXRlUGFyYW1zLmxheW91dCA9PT0gJ2FwcC1oJykgO1xyXG5cclxuICAgICAgLy8gUmVzdG9yZSBsYXlvdXQgc2V0dGluZ3NcclxuICAgICAgaWYoIGFuZ3VsYXIuaXNEZWZpbmVkKCRsb2NhbFN0b3JhZ2UubGF5b3V0KSApXHJcbiAgICAgICAgJHJvb3RTY29wZS5hcHAubGF5b3V0ID0gJGxvY2FsU3RvcmFnZS5sYXlvdXQ7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICAkbG9jYWxTdG9yYWdlLmxheW91dCA9ICRyb290U2NvcGUuYXBwLmxheW91dDtcclxuXHJcbiAgICAgICRyb290U2NvcGUuJHdhdGNoKCdhcHAubGF5b3V0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRsb2NhbFN0b3JhZ2UubGF5b3V0ID0gJHJvb3RTY29wZS5hcHAubGF5b3V0O1xyXG4gICAgICB9LCB0cnVlKTtcclxuXHJcbiAgICAgIC8vIENsb3NlIHN1Ym1lbnUgd2hlbiBzaWRlYmFyIGNoYW5nZSBmcm9tIGNvbGxhcHNlZCB0byBub3JtYWxcclxuICAgICAgJHJvb3RTY29wZS4kd2F0Y2goJ2FwcC5sYXlvdXQuaXNDb2xsYXBzZWQnLCBmdW5jdGlvbihuZXdWYWx1ZSkge1xyXG4gICAgICAgIGlmKCBuZXdWYWx1ZSA9PT0gZmFsc2UgKVxyXG4gICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdjbG9zZVNpZGViYXJNZW51Jyk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IHNpZGViYXItbWVudS5qc1xyXG4gKiBIYW5kbGUgc2lkZWJhciBjb2xsYXBzaWJsZSBlbGVtZW50c1xyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnNpZGViYXInKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdTaWRlYmFyQ29udHJvbGxlcicsIFNpZGViYXJDb250cm9sbGVyKTtcclxuXHJcbiAgICBTaWRlYmFyQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyRzY29wZScsICckc3RhdGUnLCAnU2lkZWJhckxvYWRlcicsICdVdGlscyddO1xyXG4gICAgZnVuY3Rpb24gU2lkZWJhckNvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsIFNpZGViYXJMb2FkZXIsICBVdGlscykge1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgdmFyIGNvbGxhcHNlTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAgIC8vIGRlbW86IHdoZW4gc3dpdGNoIGZyb20gY29sbGFwc2UgdG8gaG92ZXIsIGNsb3NlIGFsbCBpdGVtc1xyXG4gICAgICAgICAgJHJvb3RTY29wZS4kd2F0Y2goJ2FwcC5sYXlvdXQuYXNpZGVIb3ZlcicsIGZ1bmN0aW9uKG9sZFZhbCwgbmV3VmFsKXtcclxuICAgICAgICAgICAgaWYgKCBuZXdWYWwgPT09IGZhbHNlICYmIG9sZFZhbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgIGNsb3NlQWxsQnV0KC0xKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgIC8vIExvYWQgbWVudSBmcm9tIGpzb24gZmlsZVxyXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG4gICAgICAgICAgU2lkZWJhckxvYWRlci5nZXRNZW51KHNpZGViYXJSZWFkeSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGZ1bmN0aW9uIHNpZGViYXJSZWFkeShpdGVtcykge1xyXG4gICAgICAgICAgICAkc2NvcGUubWVudUl0ZW1zID0gaXRlbXM7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gSGFuZGxlIHNpZGViYXIgYW5kIGNvbGxhcHNlIGl0ZW1zXHJcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICRzY29wZS5nZXRNZW51SXRlbVByb3BDbGFzc2VzID0gZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKGl0ZW0uaGVhZGluZyA/ICduYXYtaGVhZGluZycgOiAnJykgK1xyXG4gICAgICAgICAgICAgICAgICAgKGlzQWN0aXZlKGl0ZW0pID8gJyBhY3RpdmUnIDogJycpIDtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgJHNjb3BlLmFkZENvbGxhcHNlID0gZnVuY3Rpb24oJGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgICAgIGNvbGxhcHNlTGlzdFskaW5kZXhdID0gJHJvb3RTY29wZS5hcHAubGF5b3V0LmFzaWRlSG92ZXIgPyB0cnVlIDogIWlzQWN0aXZlKGl0ZW0pO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAkc2NvcGUuaXNDb2xsYXBzZSA9IGZ1bmN0aW9uKCRpbmRleCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKGNvbGxhcHNlTGlzdFskaW5kZXhdKTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgJHNjb3BlLnRvZ2dsZUNvbGxhcHNlID0gZnVuY3Rpb24oJGluZGV4LCBpc1BhcmVudEl0ZW0pIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbGxhcHNlZCBzaWRlYmFyIGRvZXNuJ3QgdG9nZ2xlIGRyb2RvcHduXHJcbiAgICAgICAgICAgIGlmKCBVdGlscy5pc1NpZGViYXJDb2xsYXBzZWQoKSB8fCAkcm9vdFNjb3BlLmFwcC5sYXlvdXQuYXNpZGVIb3ZlciApIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSBpdGVtIGluZGV4IGV4aXN0c1xyXG4gICAgICAgICAgICBpZiggYW5ndWxhci5pc0RlZmluZWQoIGNvbGxhcHNlTGlzdFskaW5kZXhdICkgKSB7XHJcbiAgICAgICAgICAgICAgaWYgKCAhICRzY29wZS5sYXN0RXZlbnRGcm9tQ2hpbGQgKSB7XHJcbiAgICAgICAgICAgICAgICBjb2xsYXBzZUxpc3RbJGluZGV4XSA9ICFjb2xsYXBzZUxpc3RbJGluZGV4XTtcclxuICAgICAgICAgICAgICAgIGNsb3NlQWxsQnV0KCRpbmRleCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCBpc1BhcmVudEl0ZW0gKSB7XHJcbiAgICAgICAgICAgICAgY2xvc2VBbGxCdXQoLTEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkc2NvcGUubGFzdEV2ZW50RnJvbUNoaWxkID0gaXNDaGlsZCgkaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgLy8gQ29udHJvbGxlciBoZWxwZXJzXHJcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGl0ZW0gYW5kIGNoaWxkcmVuIGFjdGl2ZSBzdGF0ZVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBpc0FjdGl2ZShpdGVtKSB7XHJcblxyXG4gICAgICAgICAgICAgIGlmKCFpdGVtKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgIGlmKCAhaXRlbS5zcmVmIHx8IGl0ZW0uc3JlZiA9PT0gJyMnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm91bmRBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpdGVtLnN1Ym1lbnUsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmKGlzQWN0aXZlKHZhbHVlKSkgZm91bmRBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZm91bmRBY3RpdmU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiAkc3RhdGUuaXMoaXRlbS5zcmVmKSB8fCAkc3RhdGUuaW5jbHVkZXMoaXRlbS5zcmVmKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2xvc2VBbGxCdXQoaW5kZXgpIHtcclxuICAgICAgICAgICAgICBpbmRleCArPSAnJztcclxuICAgICAgICAgICAgICBmb3IodmFyIGkgaW4gY29sbGFwc2VMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZihpbmRleCA8IDAgfHwgaW5kZXguaW5kZXhPZihpKSA8IDApXHJcbiAgICAgICAgICAgICAgICAgIGNvbGxhcHNlTGlzdFtpXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBpc0NoaWxkKCRpbmRleCkge1xyXG4gICAgICAgICAgICAgIC8qanNoaW50IC1XMDE4Ki9cclxuICAgICAgICAgICAgICByZXR1cm4gKHR5cGVvZiAkaW5kZXggPT09ICdzdHJpbmcnKSAmJiAhKCRpbmRleC5pbmRleE9mKCctJykgPCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIH0gLy8gYWN0aXZhdGVcclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IHNpZGViYXIuanNcclxuICogV3JhcHMgdGhlIHNpZGViYXIgYW5kIGhhbmRsZXMgY29sbGFwc2VkIHN0YXRlXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuc2lkZWJhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnc2lkZWJhcicsIHNpZGViYXIpO1xyXG5cclxuICAgIHNpZGViYXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckdGltZW91dCcsICckd2luZG93JywgJ1V0aWxzJ107XHJcbiAgICBmdW5jdGlvbiBzaWRlYmFyICgkcm9vdFNjb3BlLCAkdGltZW91dCwgJHdpbmRvdywgVXRpbHMpIHtcclxuICAgICAgICB2YXIgJHdpbiA9IGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KTtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICAvLyBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyBjb250cm9sbGVyOiBDb250cm9sbGVyLFxyXG4gICAgICAgICAgICAvLyBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxuYXYgY2xhc3M9XCJzaWRlYmFyXCIgbmctdHJhbnNjbHVkZT48L25hdj4nLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlXHJcbiAgICAgICAgICAgIC8vIHNjb3BlOiB7fVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuXHJcbiAgICAgICAgICB2YXIgY3VycmVudFN0YXRlID0gJHJvb3RTY29wZS4kc3RhdGUuY3VycmVudC5uYW1lO1xyXG4gICAgICAgICAgdmFyICRzaWRlYmFyID0gZWxlbWVudDtcclxuXHJcbiAgICAgICAgICB2YXIgZXZlbnROYW1lID0gVXRpbHMuaXNUb3VjaCgpID8gJ2NsaWNrJyA6ICdtb3VzZWVudGVyJyA7XHJcbiAgICAgICAgICB2YXIgc3ViTmF2ID0gJCgpO1xyXG5cclxuICAgICAgICAgICRzaWRlYmFyLm9uKCBldmVudE5hbWUsICcubmF2ID4gbGknLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKCBVdGlscy5pc1NpZGViYXJDb2xsYXBzZWQoKSB8fCAkcm9vdFNjb3BlLmFwcC5sYXlvdXQuYXNpZGVIb3ZlciApIHtcclxuXHJcbiAgICAgICAgICAgICAgc3ViTmF2LnRyaWdnZXIoJ21vdXNlbGVhdmUnKTtcclxuICAgICAgICAgICAgICBzdWJOYXYgPSB0b2dnbGVNZW51SXRlbSggJCh0aGlzKSwgJHNpZGViYXIpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBVc2VkIHRvIGRldGVjdCBjbGljayBhbmQgdG91Y2ggZXZlbnRzIG91dHNpZGUgdGhlIHNpZGViYXIgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgc2lkZWJhckFkZEJhY2tkcm9wKCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgc2NvcGUuJG9uKCdjbG9zZVNpZGViYXJNZW51JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUZsb2F0aW5nTmF2KCk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBOb3JtYWxpemUgc3RhdGUgd2hlbiByZXNpemUgdG8gbW9iaWxlXHJcbiAgICAgICAgICAkd2luLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYoICEgVXRpbHMuaXNNb2JpbGUoKSApXHJcbiAgICAgICAgICBcdGFzaWRlVG9nZ2xlT2ZmKCk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBBZGp1c3RtZW50IG9uIHJvdXRlIGNoYW5nZXNcclxuICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZSA9IHRvU3RhdGUubmFtZTtcclxuICAgICAgICAgICAgLy8gSGlkZSBzaWRlYmFyIGF1dG9tYXRpY2FsbHkgb24gbW9iaWxlXHJcbiAgICAgICAgICAgIGFzaWRlVG9nZ2xlT2ZmKCk7XHJcblxyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2Nsb3NlU2lkZWJhck1lbnUnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgXHQgIC8vIEF1dG9jbG9zZSB3aGVuIGNsaWNrIG91dHNpZGUgdGhlIHNpZGViYXJcclxuICAgICAgICAgIGlmICggYW5ndWxhci5pc0RlZmluZWQoYXR0cnMuc2lkZWJhckFueWNsaWNrQ2xvc2UpICkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSAkKCcud3JhcHBlcicpO1xyXG4gICAgICAgICAgICB2YXIgc2JjbGlja0V2ZW50ID0gJ2NsaWNrLnNpZGViYXInO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kd2F0Y2goJ2FwcC5hc2lkZVRvZ2dsZWQnLCB3YXRjaEV4dGVybmFsQ2xpY2tzKTtcclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8vLy8vXHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gd2F0Y2hFeHRlcm5hbENsaWNrcyhuZXdWYWwpIHtcclxuICAgICAgICAgICAgLy8gaWYgc2lkZWJhciBiZWNvbWVzIHZpc2libGVcclxuICAgICAgICAgICAgaWYgKCBuZXdWYWwgPT09IHRydWUgKSB7XHJcbiAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXsgLy8gcmVuZGVyIGFmdGVyIGN1cnJlbnQgZGlnZXN0IGN5Y2xlXHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyLm9uKHNiY2xpY2tFdmVudCwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICAgIC8vIGlmIG5vdCBjaGlsZCBvZiBzaWRlYmFyXHJcbiAgICAgICAgICAgICAgICAgIGlmKCAhICQoZS50YXJnZXQpLnBhcmVudHMoJy5hc2lkZScpLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgICAgICAgICBhc2lkZVRvZ2dsZU9mZigpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAvLyBkZXR0YWNoIGV2ZW50XHJcbiAgICAgICAgICAgICAgd3JhcHBlci5vZmYoc2JjbGlja0V2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGFzaWRlVG9nZ2xlT2ZmKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmFwcC5hc2lkZVRvZ2dsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYoIXNjb3BlLiQkcGhhc2UpIHNjb3BlLiRhcHBseSgpOyAvLyBhbnRpLXBhdHRlcm4gYnV0IHNvbWV0aW1lcyBuZWNlc3NhcnlcclxuICAgICAgXHQgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaWRlYmFyQWRkQmFja2Ryb3AoKSB7XHJcbiAgICAgICAgICB2YXIgJGJhY2tkcm9wID0gJCgnPGRpdi8+JywgeyAnY2xhc3MnOiAnZHJvcGRvd24tYmFja2Ryb3AnfSApO1xyXG4gICAgICAgICAgJGJhY2tkcm9wLmluc2VydEFmdGVyKCcuYXNpZGUtaW5uZXInKS5vbignY2xpY2sgbW91c2VlbnRlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmVtb3ZlRmxvYXRpbmdOYXYoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gT3BlbiB0aGUgY29sbGFwc2Ugc2lkZWJhciBzdWJtZW51IGl0ZW1zIHdoZW4gb24gdG91Y2ggZGV2aWNlcyBcclxuICAgICAgICAvLyAtIGRlc2t0b3Agb25seSBvcGVucyBvbiBob3ZlclxyXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZVRvdWNoSXRlbSgkZWxlbWVudCl7XHJcbiAgICAgICAgICAkZWxlbWVudFxyXG4gICAgICAgICAgICAuc2libGluZ3MoJ2xpJylcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuJylcclxuICAgICAgICAgICAgLmVuZCgpXHJcbiAgICAgICAgICAgIC50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSGFuZGxlcyBob3ZlciB0byBvcGVuIGl0ZW1zIHVuZGVyIGNvbGxhcHNlZCBtZW51XHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlTWVudUl0ZW0oJGxpc3RJdGVtLCAkc2lkZWJhcikge1xyXG5cclxuICAgICAgICAgIHJlbW92ZUZsb2F0aW5nTmF2KCk7XHJcblxyXG4gICAgICAgICAgdmFyIHVsID0gJGxpc3RJdGVtLmNoaWxkcmVuKCd1bCcpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBpZiggIXVsLmxlbmd0aCApIHJldHVybiAkKCk7XHJcbiAgICAgICAgICBpZiggJGxpc3RJdGVtLmhhc0NsYXNzKCdvcGVuJykgKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVRvdWNoSXRlbSgkbGlzdEl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gJCgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHZhciAkYXNpZGUgPSAkKCcuYXNpZGUnKTtcclxuICAgICAgICAgIHZhciAkYXNpZGVJbm5lciA9ICQoJy5hc2lkZS1pbm5lcicpOyAvLyBmb3IgdG9wIG9mZnNldCBjYWxjdWxhdGlvblxyXG4gICAgICAgICAgLy8gZmxvYXQgYXNpZGUgdXNlcyBleHRyYSBwYWRkaW5nIG9uIGFzaWRlXHJcbiAgICAgICAgICB2YXIgbWFyID0gcGFyc2VJbnQoICRhc2lkZUlubmVyLmNzcygncGFkZGluZy10b3AnKSwgMCkgKyBwYXJzZUludCggJGFzaWRlLmNzcygncGFkZGluZy10b3AnKSwgMCk7XHJcbiAgICAgICAgICB2YXIgc3ViTmF2ID0gdWwuY2xvbmUoKS5hcHBlbmRUbyggJGFzaWRlICk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHRvZ2dsZVRvdWNoSXRlbSgkbGlzdEl0ZW0pO1xyXG5cclxuICAgICAgICAgIHZhciBpdGVtVG9wID0gKCRsaXN0SXRlbS5wb3NpdGlvbigpLnRvcCArIG1hcikgLSAkc2lkZWJhci5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgIHZhciB2d0hlaWdodCA9ICR3aW4uaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgc3ViTmF2XHJcbiAgICAgICAgICAgIC5hZGRDbGFzcygnbmF2LWZsb2F0aW5nJylcclxuICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgcG9zaXRpb246ICRyb290U2NvcGUuYXBwLmxheW91dC5pc0ZpeGVkID8gJ2ZpeGVkJyA6ICdhYnNvbHV0ZScsXHJcbiAgICAgICAgICAgICAgdG9wOiAgICAgIGl0ZW1Ub3AsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAgIChzdWJOYXYub3V0ZXJIZWlnaHQodHJ1ZSkgKyBpdGVtVG9wID4gdndIZWlnaHQpID8gMCA6ICdhdXRvJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBzdWJOYXYub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdG9nZ2xlVG91Y2hJdGVtKCRsaXN0SXRlbSk7XHJcbiAgICAgICAgICAgIHN1Yk5hdi5yZW1vdmUoKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHJldHVybiBzdWJOYXY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZW1vdmVGbG9hdGluZ05hdigpIHtcclxuICAgICAgICAgICQoJy5kcm9wZG93bi1iYWNrZHJvcCcpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgJCgnLnNpZGViYXItc3VibmF2Lm5hdi1mbG9hdGluZycpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgJCgnLnNpZGViYXIgbGkub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn0pKCk7XHJcblxyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5zaWRlYmFyJylcclxuICAgICAgICAuc2VydmljZSgnU2lkZWJhckxvYWRlcicsIFNpZGViYXJMb2FkZXIpO1xyXG5cclxuICAgIFNpZGViYXJMb2FkZXIuJGluamVjdCA9IFsnJGh0dHAnXTtcclxuICAgIGZ1bmN0aW9uIFNpZGViYXJMb2FkZXIoJGh0dHApIHtcclxuICAgICAgICB0aGlzLmdldE1lbnUgPSBnZXRNZW51O1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE1lbnUob25SZWFkeSwgb25FcnJvcikge1xyXG4gICAgICAgICAgdmFyIG1lbnVKc29uID0gJ3NlcnZlci9zaWRlYmFyLW1lbnUuanNvbicsXHJcbiAgICAgICAgICAgICAgbWVudVVSTCAgPSBtZW51SnNvbiArICc/dj0nICsgKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTsgLy8ganVtcHMgY2FjaGVcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICBvbkVycm9yID0gb25FcnJvciB8fCBmdW5jdGlvbigpIHsgYWxlcnQoJ0ZhaWx1cmUgbG9hZGluZyBtZW51Jyk7IH07XHJcblxyXG4gICAgICAgICAgJGh0dHBcclxuICAgICAgICAgICAgLmdldChtZW51VVJMKVxyXG4gICAgICAgICAgICAuc3VjY2VzcyhvblJlYWR5KVxyXG4gICAgICAgICAgICAuZXJyb3Iob25FcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5zaWRlYmFyJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzZXJCbG9ja0NvbnRyb2xsZXInLCBVc2VyQmxvY2tDb250cm9sbGVyKTtcblxuICAgIFVzZXJCbG9ja0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZSddO1xuICAgIGZ1bmN0aW9uIFVzZXJCbG9ja0NvbnRyb2xsZXIoJHJvb3RTY29wZSkge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICRyb290U2NvcGUudXNlciA9ICRyb290U2NvcGUudXNlciB8fCB7XG4gICAgICAgICAgICBuYW1lOiAgICAgJ+adjuaYjicsXG4gICAgICAgICAgICBqb2I6ICAgICAgJ+iAgeadvycsXG4gICAgICAgICAgICBwaWN0dXJlOiAgJ2FwcC9pbWcvZHVtbXkucG5nJ1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyBIaWRlcy9zaG93IHVzZXIgYXZhdGFyIG9uIHNpZGViYXJcbiAgICAgICAgICAkcm9vdFNjb3BlLnRvZ2dsZVVzZXJCbG9jayA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3RvZ2dsZVVzZXJCbG9jaycpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAkcm9vdFNjb3BlLnVzZXJCbG9ja1Zpc2libGUgPSB0cnVlO1xuICAgICAgICAgIFxuICAgICAgICAgICRyb290U2NvcGUuJG9uKCd0b2dnbGVVc2VyQmxvY2snLCBmdW5jdGlvbigvKmV2ZW50LCBhcmdzKi8pIHtcblxuICAgICAgICAgICAgJHJvb3RTY29wZS51c2VyQmxvY2tWaXNpYmxlID0gISAkcm9vdFNjb3BlLnVzZXJCbG9ja1Zpc2libGU7XG4gICAgICAgICAgICBcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWJsZXMnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCduZ1RhYmxlRGF0YVNlcnZpY2UnLCBuZ1RhYmxlRGF0YVNlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG5nVGFibGVEYXRhU2VydmljZSgpIHtcclxuICAgICAgICAvKiBqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5nZXREYXRhID0gZ2V0RGF0YTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREYXRhKCRkZWZlciwgcGFyYW1zLCBhcGkpIHtcclxuICAgICAgICAgIC8vIGlmIG5vIGNhY2hlLCByZXF1ZXN0IGRhdGEgYW5kIGZpbHRlclxyXG4gICAgICAgICAgaWYgKCAhIHNlbGYuY2FjaGUgKSB7XHJcbiAgICAgICAgICAgIGlmICggYXBpICkge1xyXG4gICAgICAgICAgICAgIGFwaS5nZXQoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNhY2hlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIGZpbHRlcmRhdGEoJGRlZmVyLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZmlsdGVyZGF0YSgkZGVmZXIsIHBhcmFtcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGZ1bmN0aW9uIGZpbHRlcmRhdGEoJGRlZmVyLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgdmFyIGZyb20gPSAocGFyYW1zLnBhZ2UoKSAtIDEpICogcGFyYW1zLmNvdW50KCk7XHJcbiAgICAgICAgICAgIHZhciB0byA9IHBhcmFtcy5wYWdlKCkgKiBwYXJhbXMuY291bnQoKTtcclxuICAgICAgICAgICAgdmFyIGZpbHRlcmVkRGF0YSA9IHNlbGYuY2FjaGUucmVzdWx0LnNsaWNlKGZyb20sIHRvKTtcclxuXHJcbiAgICAgICAgICAgIHBhcmFtcy50b3RhbChzZWxmLmNhY2hlLnRvdGFsKTtcclxuICAgICAgICAgICAgJGRlZmVyLnJlc29sdmUoZmlsdGVyZWREYXRhKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWJsZXMnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCduZ1RhYmxlTEJTZXJ2aWNlJywgbmdUYWJsZUxCU2VydmljZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gbmdUYWJsZUxCU2VydmljZSgpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgdGhpcy5nZXREYXRhID0gZ2V0RGF0YTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldERhdGEoJGRlZmVyLCBwYXJhbXMsIE1vZGVsLCBmaWx0ZXIpIHtcclxuICAgICAgICBmaWx0ZXIubGltaXQgPSBwYXJhbXMuY291bnQoKTtcclxuICAgICAgICBmaWx0ZXIuc2tpcCA9IChwYXJhbXMucGFnZSgpLTEpKmZpbHRlci5saW1pdDtcclxuICAgICAgICBcclxuICAgICAgICBNb2RlbC5jb3VudCh7d2hlcmU6IGZpbHRlci53aGVyZX0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIHBhcmFtcy50b3RhbChyZXN1bHQuY291bnQpO1xyXG4gICAgICAgICAgTW9kZWwuZmluZCh7ZmlsdGVyOmZpbHRlcn0sICRkZWZlci5yZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50cmFuc2xhdGUnKVxyXG4gICAgICAgIC5jb25maWcodHJhbnNsYXRlQ29uZmlnKVxyXG4gICAgICAgIDtcclxuICAgIHRyYW5zbGF0ZUNvbmZpZy4kaW5qZWN0ID0gWyckdHJhbnNsYXRlUHJvdmlkZXInXTtcclxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZUNvbmZpZygkdHJhbnNsYXRlUHJvdmlkZXIpe1xyXG5cclxuICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnVzZVN0YXRpY0ZpbGVzTG9hZGVyKHtcclxuICAgICAgICAgIHByZWZpeCA6ICdhcHAvaTE4bi8nLFxyXG4gICAgICAgICAgc3VmZml4IDogJy5qc29uJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICR0cmFuc2xhdGVQcm92aWRlci5wcmVmZXJyZWRMYW5ndWFnZSgnemhfQ04nKTtcclxuICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnVzZUxvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudXNlUG9zdENvbXBpbGluZyh0cnVlKTtcclxuICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnVzZVNhbml0aXplVmFsdWVTdHJhdGVneSgnc2FuaXRpemVQYXJhbWV0ZXJzJyk7XHJcblxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnRyYW5zbGF0ZScpXHJcbiAgICAgICAgLnJ1bih0cmFuc2xhdGVSdW4pXHJcbiAgICAgICAgO1xyXG4gICAgdHJhbnNsYXRlUnVuLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHRyYW5zbGF0ZSddO1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVSdW4oJHJvb3RTY29wZSwgJHRyYW5zbGF0ZSl7XHJcblxyXG4gICAgICAvLyBJbnRlcm5hdGlvbmFsaXphdGlvblxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAkcm9vdFNjb3BlLmxhbmd1YWdlID0ge1xyXG4gICAgICAgIC8vIEhhbmRsZXMgbGFuZ3VhZ2UgZHJvcGRvd25cclxuICAgICAgICBsaXN0SXNPcGVuOiBmYWxzZSxcclxuICAgICAgICAvLyBsaXN0IG9mIGF2YWlsYWJsZSBsYW5ndWFnZXNcclxuICAgICAgICBhdmFpbGFibGU6IHtcclxuICAgICAgICAgICd6aF9DTic6ICAgICfkuK3mlofnroDkvZMnLFxyXG4gICAgICAgICAgJ2VuJzogICAgICAgJ0VuZ2xpc2gnLFxyXG4gICAgICAgICAgJ2VzX0FSJzogICAgJ0VzcGHDsW9sJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gZGlzcGxheSBhbHdheXMgdGhlIGN1cnJlbnQgdWkgbGFuZ3VhZ2VcclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgcHJvcG9zZWRMYW5ndWFnZSA9ICR0cmFuc2xhdGUucHJvcG9zZWRMYW5ndWFnZSgpIHx8ICR0cmFuc2xhdGUudXNlKCk7XHJcbiAgICAgICAgICB2YXIgcHJlZmVycmVkTGFuZ3VhZ2UgPSAkdHJhbnNsYXRlLnByZWZlcnJlZExhbmd1YWdlKCk7IC8vIHdlIGtub3cgd2UgaGF2ZSBzZXQgYSBwcmVmZXJyZWQgb25lIGluIGFwcC5jb25maWdcclxuICAgICAgICAgICRyb290U2NvcGUubGFuZ3VhZ2Uuc2VsZWN0ZWQgPSAkcm9vdFNjb3BlLmxhbmd1YWdlLmF2YWlsYWJsZVsgKHByb3Bvc2VkTGFuZ3VhZ2UgfHwgcHJlZmVycmVkTGFuZ3VhZ2UpIF07XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChsb2NhbGVJZCkge1xyXG4gICAgICAgICAgLy8gU2V0IHRoZSBuZXcgaWRpb21cclxuICAgICAgICAgICR0cmFuc2xhdGUudXNlKGxvY2FsZUlkKTtcclxuICAgICAgICAgIC8vIHNhdmUgYSByZWZlcmVuY2UgZm9yIHRoZSBjdXJyZW50IGxhbmd1YWdlXHJcbiAgICAgICAgICAkcm9vdFNjb3BlLmxhbmd1YWdlLnNlbGVjdGVkID0gJHJvb3RTY29wZS5sYW5ndWFnZS5hdmFpbGFibGVbbG9jYWxlSWRdO1xyXG4gICAgICAgICAgLy8gZmluYWxseSB0b2dnbGUgZHJvcGRvd25cclxuICAgICAgICAgICRyb290U2NvcGUubGFuZ3VhZ2UubGlzdElzT3BlbiA9ICEgJHJvb3RTY29wZS5sYW5ndWFnZS5saXN0SXNPcGVuO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgICRyb290U2NvcGUubGFuZ3VhZ2UuaW5pdCgpO1xyXG5cclxuICAgIH1cclxufSkoKTsiLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogYW5pbWF0ZS1lbmFibGVkLmpzXG4gKiBFbmFibGUgb3IgZGlzYWJsZXMgbmdBbmltYXRlIGZvciBlbGVtZW50IHdpdGggZGlyZWN0aXZlXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnV0aWxzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnYW5pbWF0ZUVuYWJsZWQnLCBhbmltYXRlRW5hYmxlZCk7XG5cbiAgICBhbmltYXRlRW5hYmxlZC4kaW5qZWN0ID0gWyckYW5pbWF0ZSddO1xuICAgIGZ1bmN0aW9uIGFuaW1hdGVFbmFibGVkICgkYW5pbWF0ZSkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NvcGUuJGV2YWwoYXR0cnMuYW5pbWF0ZUVuYWJsZWQsIHNjb3BlKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICRhbmltYXRlLmVuYWJsZWQoISFuZXdWYWx1ZSwgZWxlbWVudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBicm93c2VyLmpzXHJcbiAqIEJyb3dzZXIgZGV0ZWN0aW9uXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudXRpbHMnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdCcm93c2VyJywgQnJvd3Nlcik7XHJcblxyXG4gICAgQnJvd3Nlci4kaW5qZWN0ID0gWyckd2luZG93J107XHJcbiAgICBmdW5jdGlvbiBCcm93c2VyKCR3aW5kb3cpIHtcclxuICAgICAgcmV0dXJuICR3aW5kb3cualFCcm93c2VyO1xyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IGNsZWFyLXN0b3JhZ2UuanNcbiAqIFJlbW92ZXMgYSBrZXkgZnJvbSB0aGUgYnJvd3NlciBzdG9yYWdlIHZpYSBlbGVtZW50IGNsaWNrXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnV0aWxzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgncmVzZXRLZXknLCByZXNldEtleSk7XG5cbiAgICByZXNldEtleS4kaW5qZWN0ID0gWyckc3RhdGUnLCAnJGxvY2FsU3RvcmFnZSddO1xuICAgIGZ1bmN0aW9uIHJlc2V0S2V5ICgkc3RhdGUsICRsb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgcmVzZXRLZXk6ICdAJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICBpZihzY29wZS5yZXNldEtleSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSAkbG9jYWxTdG9yYWdlW3Njb3BlLnJlc2V0S2V5XTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJHN0YXRlLmN1cnJlbnQsIHt9LCB7cmVsb2FkOiB0cnVlfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgJC5lcnJvcignTm8gc3RvcmFnZSBrZXkgc3BlY2lmaWVkIGZvciByZXNldC4nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IGN1cnJlbmN5LmpzXG4gKiBDdXJyZW5jeSBmb3JtYXQgZFxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC51dGlscycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2N1cnJlbmN5JywgY3VycmVuY3kpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2JvbnVzJywgYm9udXMpO1xuXG4gICAgY3VycmVuY3kuJGluamVjdCA9IFsnJHdpbmRvdyddO1xuICAgIGZ1bmN0aW9uIGN1cnJlbmN5KCR3aW5kb3cpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ29udHJvbGxlcikge1xuICAgICAgICAgIG5nTW9kZWxDb250cm9sbGVyLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgLy9jb252ZXJ0IGRhdGEgZnJvbSB2aWV3IGZvcm1hdCB0byBtb2RlbCBmb3JtYXRcbiAgICAgICAgICAgIHJldHVybiBkYXRhKjEwMDsgLy9jb252ZXJ0ZWRcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG5nTW9kZWxDb250cm9sbGVyLiRmb3JtYXR0ZXJzLnB1c2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgLy9jb252ZXJ0IGRhdGEgZnJvbSBtb2RlbCBmb3JtYXQgdG8gdmlldyBmb3JtYXRcbiAgICAgICAgICAgIHJldHVybiBkYXRhLzEwMDsgLy9jb252ZXJ0ZWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgYm9udXMuJGluamVjdCA9IFsnJHdpbmRvdyddO1xuICAgIGZ1bmN0aW9uIGJvbnVzKCR3aW5kb3cpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ29udHJvbGxlcikge1xuICAgICAgICAgIG5nTW9kZWxDb250cm9sbGVyLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgLy9jb252ZXJ0IGRhdGEgZnJvbSB2aWV3IGZvcm1hdCB0byBtb2RlbCBmb3JtYXRcbiAgICAgICAgICAgIHJldHVybiBkYXRhLzEwMDsgLy9jb252ZXJ0ZWRcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG5nTW9kZWxDb250cm9sbGVyLiRmb3JtYXR0ZXJzLnB1c2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgLy9jb252ZXJ0IGRhdGEgZnJvbSBtb2RlbCBmb3JtYXQgdG8gdmlldyBmb3JtYXRcbiAgICAgICAgICAgIHJldHVybiBkYXRhKjEwMDsgLy9jb252ZXJ0ZWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogZnVsbHNjcmVlbi5qc1xuICogVG9nZ2xlIHRoZSBmdWxsc2NyZWVuIG1vZGUgb24vb2ZmXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnV0aWxzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgndG9nZ2xlRnVsbHNjcmVlbicsIHRvZ2dsZUZ1bGxzY3JlZW4pO1xuXG4gICAgdG9nZ2xlRnVsbHNjcmVlbi4kaW5qZWN0ID0gWydCcm93c2VyJ107XG4gICAgZnVuY3Rpb24gdG9nZ2xlRnVsbHNjcmVlbiAoQnJvd3Nlcikge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgLy8gTm90IHN1cHBvcnRlZCB1bmRlciBJRVxuICAgICAgICAgIGlmKCBCcm93c2VyLm1zaWUgKSB7XG4gICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdoaWRlJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGlmIChzY3JlZW5mdWxsLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgc2NyZWVuZnVsbC50b2dnbGUoKTtcbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgLy8gU3dpdGNoIGljb24gaW5kaWNhdG9yXG4gICAgICAgICAgICAgICAgICBpZihzY3JlZW5mdWxsLmlzRnVsbHNjcmVlbilcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGlsZHJlbignZW0nKS5yZW1vdmVDbGFzcygnZmEtZXhwYW5kJykuYWRkQ2xhc3MoJ2ZhLWNvbXByZXNzJyk7XG4gICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY2hpbGRyZW4oJ2VtJykucmVtb3ZlQ2xhc3MoJ2ZhLWNvbXByZXNzJykuYWRkQ2xhc3MoJ2ZhLWV4cGFuZCcpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICQuZXJyb3IoJ0Z1bGxzY3JlZW4gbm90IGVuYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IGxvYWQtY3NzLmpzXG4gKiBSZXF1ZXN0IGFuZCBsb2FkIGludG8gdGhlIGN1cnJlbnQgcGFnZSBhIGNzcyBmaWxlXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnV0aWxzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnbG9hZENzcycsIGxvYWRDc3MpO1xuXG4gICAgZnVuY3Rpb24gbG9hZENzcyAoKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICBpZihlbGVtZW50LmlzKCdhJykpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgdmFyIHVyaSA9IGF0dHJzLmxvYWRDc3MsXG4gICAgICAgICAgICAgICAgICBsaW5rO1xuXG4gICAgICAgICAgICAgIGlmKHVyaSkge1xuICAgICAgICAgICAgICAgIGxpbmsgPSBjcmVhdGVMaW5rKHVyaSk7XG4gICAgICAgICAgICAgICAgaWYgKCAhbGluayApIHtcbiAgICAgICAgICAgICAgICAgICQuZXJyb3IoJ0Vycm9yIGNyZWF0aW5nIHN0eWxlc2hlZXQgbGluayBlbGVtZW50LicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAkLmVycm9yKCdObyBzdHlsZXNoZWV0IGxvY2F0aW9uIGRlZmluZWQuJyk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVMaW5rKHVyaSkge1xuICAgICAgICAgIHZhciBsaW5rSWQgPSAnYXV0b2xvYWRlZC1zdHlsZXNoZWV0JyxcbiAgICAgICAgICAgICAgb2xkTGluayA9ICQoJyMnK2xpbmtJZCkuYXR0cignaWQnLCBsaW5rSWQgKyAnLW9sZCcpO1xuXG4gICAgICAgICAgJCgnaGVhZCcpLmFwcGVuZCgkKCc8bGluay8+JykuYXR0cih7XG4gICAgICAgICAgICAnaWQnOiAgIGxpbmtJZCxcbiAgICAgICAgICAgICdyZWwnOiAgJ3N0eWxlc2hlZXQnLFxuICAgICAgICAgICAgJ2hyZWYnOiB1cmlcbiAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICBpZiggb2xkTGluay5sZW5ndGggKSB7XG4gICAgICAgICAgICBvbGRMaW5rLnJlbW92ZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiAkKCcjJytsaW5rSWQpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IG5vdy5qc1xuICogUHJvdmlkZXMgYSBzaW1wbGUgd2F5IHRvIGRpc3BsYXkgdGhlIGN1cnJlbnQgdGltZSBmb3JtYXR0ZWRcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudXRpbHMnKVxuICAgICAgICAuZGlyZWN0aXZlKCdub3cnLCBub3cpO1xuXG4gICAgbm93LiRpbmplY3QgPSBbJ2RhdGVGaWx0ZXInLCAnJGludGVydmFsJ107XG4gICAgZnVuY3Rpb24gbm93IChkYXRlRmlsdGVyLCAkaW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgdmFyIGZvcm1hdCA9IGF0dHJzLmZvcm1hdDtcblxuICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVRpbWUoKSB7XG4gICAgICAgICAgICB2YXIgZHQgPSBkYXRlRmlsdGVyKG5ldyBEYXRlKCksIGZvcm1hdCk7XG4gICAgICAgICAgICBlbGVtZW50LnRleHQoZHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHVwZGF0ZVRpbWUoKTtcbiAgICAgICAgICB2YXIgaW50ZXJ2YWxQcm9taXNlID0gJGludGVydmFsKHVwZGF0ZVRpbWUsIDEwMDApO1xuXG4gICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKGludGVydmFsUHJvbWlzZSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiB0YWJsZS1jaGVja2FsbC5qc1xuICogVGFibGVzIGNoZWNrIGFsbCBjaGVja2JveFxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudXRpbHMnKVxuICAgICAgICAuZGlyZWN0aXZlKCdjaGVja0FsbCcsIGNoZWNrQWxsKTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrQWxsICgpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgIGVsZW1lbnQub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBpbmRleD0gJHRoaXMuaW5kZXgoKSArIDEsXG4gICAgICAgICAgICAgICAgY2hlY2tib3ggPSAkdGhpcy5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKSxcbiAgICAgICAgICAgICAgICB0YWJsZSA9ICR0aGlzLnBhcmVudHMoJ3RhYmxlJyk7XG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdG8gYWZmZWN0IG9ubHkgdGhlIGNvcnJlY3QgY2hlY2tib3ggY29sdW1uXG4gICAgICAgICAgICB0YWJsZS5maW5kKCd0Ym9keSA+IHRyID4gdGQ6bnRoLWNoaWxkKCcraW5kZXgrJykgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJylcbiAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLCBjaGVja2JveFswXS5jaGVja2VkKTtcblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogdHJpZ2dlci1yZXNpemUuanNcclxuICogVHJpZ2dlcnMgYSB3aW5kb3cgcmVzaXplIGV2ZW50IGZyb20gYW55IGVsZW1lbnRcclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnV0aWxzJylcclxuICAgICAgICAuZGlyZWN0aXZlKCd0cmlnZ2VyUmVzaXplJywgdHJpZ2dlclJlc2l6ZSk7XHJcblxyXG4gICAgdHJpZ2dlclJlc2l6ZS4kaW5qZWN0ID0gWyckd2luZG93JywgJyR0aW1lb3V0J107XHJcbiAgICBmdW5jdGlvbiB0cmlnZ2VyUmVzaXplICgkd2luZG93LCAkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQpIHtcclxuICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAkd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdyZXNpemUnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IHV0aWxzLmpzXG4gKiBVdGlsaXR5IGxpYnJhcnkgdG8gdXNlIGFjcm9zcyB0aGUgdGhlbWVcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudXRpbHMnKVxuICAgICAgICAuc2VydmljZSgnVXRpbHMnLCBVdGlscyk7XG5cbiAgICBVdGlscy4kaW5qZWN0ID0gWyckd2luZG93JywgJ0FQUF9NRURJQVFVRVJZJ107XG4gICAgZnVuY3Rpb24gVXRpbHMoJHdpbmRvdywgQVBQX01FRElBUVVFUlkpIHtcblxuICAgICAgICB2YXIgJGh0bWwgPSBhbmd1bGFyLmVsZW1lbnQoJ2h0bWwnKSxcbiAgICAgICAgICAgICR3aW4gID0gYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLFxuICAgICAgICAgICAgJGJvZHkgPSBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC8vIERFVEVDVElPTlxuICAgICAgICAgIHN1cHBvcnQ6IHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zaXRpb25FbmQgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXZWJraXRUcmFuc2l0aW9uOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1velRyYW5zaXRpb246ICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT1RyYW5zaXRpb246ICdvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICd0cmFuc2l0aW9uZW5kJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobmFtZSBpbiB0cmFuc0VuZEV2ZW50TmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gdHJhbnNFbmRFdmVudE5hbWVzW25hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2l0aW9uRW5kICYmIHsgZW5kOiB0cmFuc2l0aW9uRW5kIH07XG4gICAgICAgICAgICAgICAgfSkoKSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGFuaW1hdGlvbkVuZCA9IChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbUVuZEV2ZW50TmFtZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgV2Via2l0QW5pbWF0aW9uOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNb3pBbmltYXRpb246ICdhbmltYXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9BbmltYXRpb246ICdvQW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ2FuaW1hdGlvbmVuZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIG5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChuYW1lIGluIGFuaW1FbmRFdmVudE5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gYW5pbUVuZEV2ZW50TmFtZXNbbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KCkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbkVuZCAmJiB7IGVuZDogYW5pbWF0aW9uRW5kIH07XG4gICAgICAgICAgICB9KSgpLFxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lOiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oY2FsbGJhY2speyB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMC82MCk7IH0sXG4gICAgICAgICAgICAvKmpzaGludCAtVzA2OSovXG4gICAgICAgICAgICB0b3VjaDogKFxuICAgICAgICAgICAgICAgICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9tb2JpbGV8dGFibGV0LykpIHx8XG4gICAgICAgICAgICAgICAgKHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2Ygd2luZG93LkRvY3VtZW50VG91Y2gpICB8fFxuICAgICAgICAgICAgICAgICh3aW5kb3cubmF2aWdhdG9yWydtc1BvaW50ZXJFbmFibGVkJ10gJiYgd2luZG93Lm5hdmlnYXRvclsnbXNNYXhUb3VjaFBvaW50cyddID4gMCkgfHwgLy9JRSAxMFxuICAgICAgICAgICAgICAgICh3aW5kb3cubmF2aWdhdG9yWydwb2ludGVyRW5hYmxlZCddICYmIHdpbmRvdy5uYXZpZ2F0b3JbJ21heFRvdWNoUG9pbnRzJ10gPiAwKSB8fCAvL0lFID49MTFcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIG11dGF0aW9ub2JzZXJ2ZXI6ICh3aW5kb3cuTXV0YXRpb25PYnNlcnZlciB8fCB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlciB8fCB3aW5kb3cuTW96TXV0YXRpb25PYnNlcnZlciB8fCBudWxsKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLy8gVVRJTElUSUVTXG4gICAgICAgICAgaXNJblZpZXc6IGZ1bmN0aW9uKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgLypqc2hpbnQgLVcxMDYqL1xuICAgICAgICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgIGlmICghJGVsZW1lbnQuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciB3aW5kb3dfbGVmdCA9ICR3aW4uc2Nyb2xsTGVmdCgpLFxuICAgICAgICAgICAgICAgICAgd2luZG93X3RvcCAgPSAkd2luLnNjcm9sbFRvcCgpLFxuICAgICAgICAgICAgICAgICAgb2Zmc2V0ICAgICAgPSAkZWxlbWVudC5vZmZzZXQoKSxcbiAgICAgICAgICAgICAgICAgIGxlZnQgICAgICAgID0gb2Zmc2V0LmxlZnQsXG4gICAgICAgICAgICAgICAgICB0b3AgICAgICAgICA9IG9mZnNldC50b3A7XG5cbiAgICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt0b3BvZmZzZXQ6MCwgbGVmdG9mZnNldDowfSwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgaWYgKHRvcCArICRlbGVtZW50LmhlaWdodCgpID49IHdpbmRvd190b3AgJiYgdG9wIC0gb3B0aW9ucy50b3BvZmZzZXQgPD0gd2luZG93X3RvcCArICR3aW4uaGVpZ2h0KCkgJiZcbiAgICAgICAgICAgICAgICAgIGxlZnQgKyAkZWxlbWVudC53aWR0aCgpID49IHdpbmRvd19sZWZ0ICYmIGxlZnQgLSBvcHRpb25zLmxlZnRvZmZzZXQgPD0gd2luZG93X2xlZnQgKyAkd2luLndpZHRoKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFxuICAgICAgICAgIGxhbmdkaXJlY3Rpb246ICRodG1sLmF0dHIoJ2RpcicpID09PSAncnRsJyA/ICdyaWdodCcgOiAnbGVmdCcsXG5cbiAgICAgICAgICBpc1RvdWNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0bWwuaGFzQ2xhc3MoJ3RvdWNoJyk7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIGlzU2lkZWJhckNvbGxhcHNlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRib2R5Lmhhc0NsYXNzKCdhc2lkZS1jb2xsYXBzZWQnKTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgaXNTaWRlYmFyVG9nZ2xlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRib2R5Lmhhc0NsYXNzKCdhc2lkZS10b2dnbGVkJyk7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIGlzTW9iaWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJHdpbi53aWR0aCgpIDwgQVBQX01FRElBUVVFUlkudGFibGV0O1xuICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2N1c3RvbScsIFtcclxuICAgICAgICAgICAgLy8gcmVxdWVzdCB0aGUgdGhlIGVudGlyZSBmcmFtZXdvcmtcclxuICAgICAgICAgICAgJ2FuZ2xlJyxcclxuICAgICAgICAgICAgLy8gb3IganVzdCBtb2R1bGVzXHJcbiAgICAgICAgICAgICdhcHAuY29yZScsXHJcbiAgICAgICAgICAgICdhcHAuc2lkZWJhcidcclxuICAgICAgICAgICAgLyouLi4qL1xyXG4gICAgICAgIF0pO1xyXG59KSgpOyIsIlxyXG4vLyBUbyBydW4gdGhpcyBjb2RlLCBlZGl0IGZpbGUgaW5kZXguaHRtbCBvciBpbmRleC5qYWRlIGFuZCBjaGFuZ2VcclxuLy8gaHRtbCBkYXRhLW5nLWFwcCBhdHRyaWJ1dGUgZnJvbSBhbmdsZSB0byBteUFwcE5hbWVcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdjdXN0b20nKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdDb250cm9sbGVyJywgQ29udHJvbGxlcik7XHJcblxyXG4gICAgQ29udHJvbGxlci4kaW5qZWN0ID0gWyckbG9nJ107XHJcbiAgICBmdW5jdGlvbiBDb250cm9sbGVyKCRsb2cpIHtcclxuICAgICAgICAvLyBmb3IgY29udHJvbGxlckFzIHN5bnRheFxyXG4gICAgICAgIC8vIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAkbG9nLmxvZygnSVxcJ20gYSBsaW5lIGZyb20gY3VzdG9tLmpzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
