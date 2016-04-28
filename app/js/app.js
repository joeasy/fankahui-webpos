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
          vm.days = days;
          var now = moment();
          var from = moment().subtract(days-1, 'days').startOf('day');
          for (var i = 0; i < days; i++) {
            var d = moment().subtract(days-i-1, 'days').date();
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
            },
            sort: {_id: 1}
          }}, function (res) {
            for (var i = 0; i < days; i++) {
              var m = moment().subtract(days-i-1, 'days');
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
            },
            sort: {_id: 1}
          }}, function (res) {
            for (var i = 0; i < days; i++) {
              var m = moment().subtract(days-i-1, 'days');
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
        self.cash = {};
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjaGFydHMvY2hhcnRzLm1vZHVsZS5qcyIsImNvbG9ycy9jb2xvcnMubW9kdWxlLmpzIiwiY29yZS9jb3JlLm1vZHVsZS5qcyIsImNvc3RzL2Nvc3RzLm1vZHVsZS5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmQubW9kdWxlLmpzIiwiZWxlbWVudHMvZWxlbWVudHMubW9kdWxlLmpzIiwiZm9ybXMvZm9ybXMubW9kdWxlLmpzIiwiaXRlbXMvaXRlbXMubW9kdWxlLmpzIiwibGF6eWxvYWQvbGF6eWxvYWQubW9kdWxlLmpzIiwibG9hZGluZ2Jhci9sb2FkaW5nYmFyLm1vZHVsZS5qcyIsImxvY2FsZS9sb2NhbGUubW9kdWxlLmpzIiwibWVtYmVycy9tZW1iZXJzLm1vZHVsZS5qcyIsIm15c2hvcC9teXNob3AubW9kdWxlLmpzIiwibm90aWZ5L25vdGlmeS5tb2R1bGUuanMiLCJwYWdlcy9wYWdlcy5tb2R1bGUuanMiLCJwYW5lbHMvcGFuZWxzLm1vZHVsZS5qcyIsInByZWxvYWRlci9wcmVsb2FkZXIubW9kdWxlLmpzIiwicm91dGVzL3JvdXRlcy5tb2R1bGUuanMiLCJzYWxlcy9zYWxlcy5tb2R1bGUuanMiLCJzZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJzaWRlYmFyL3NpZGViYXIubW9kdWxlLmpzIiwidGFibGVzL3RhYmxlcy5tb2R1bGUuanMiLCJ0cmFuc2xhdGUvdHJhbnNsYXRlLm1vZHVsZS5qcyIsInV0aWxzL3V0aWxzLm1vZHVsZS5qcyIsImNoYXJ0cy9jaGFydGpzLmRpcmVjdGl2ZS5qcyIsImNoYXJ0cy9jbGFzc3lsb2FkZXIuZGlyZWN0aXZlLmpzIiwiY2hhcnRzL2Zsb3QtZGF0YS5zZXJ2aWNlLmpzIiwiY2hhcnRzL2Zsb3QuZGlyZWN0aXZlLmpzIiwiY2hhcnRzL21vcnJpcy5kaXJlY3RpdmUuanMiLCJjaGFydHMvc3BhcmtsaW5lcy5kaXJlY3RpdmUuanMiLCJjb2xvcnMvY29sb3JzLmNvbnRhbnQuanMiLCJjb2xvcnMvY29sb3JzLnNlcnZpY2UuanMiLCJjb3JlL2NvcmUuY29uZmlnLmpzIiwiY29yZS9jb3JlLmNvbnN0YW50cy5qcyIsImNvcmUvY29yZS5maWx0ZXIuanMiLCJjb3JlL2NvcmUucnVuLmpzIiwiY29zdHMvY29zdHMuY29udHJvbGxlci5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmQuY29udHJvbGxlci5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmQuZmlsdGVyLmpzIiwiZWxlbWVudHMvc2Nyb2xsLmRpcmVjdGl2ZS5qcyIsImZvcm1zL2ZpbGVzdHlsZS5kaXJlY3RpdmUuanMiLCJmb3Jtcy9mb3JtLXdpemFyZC5kaXJlY3RpdmUuanMiLCJmb3Jtcy9tYXNrZWQuZGlyZWN0aXZlLmpzIiwiZm9ybXMvcHJvcHMuZmlsdGVyLmpzIiwiZm9ybXMvdGFncy1pbnB1dC5kaXJlY3RpdmUuanMiLCJmb3Jtcy92YWxpZGF0ZS1mb3JtLmRpcmVjdGl2ZS5qcyIsIml0ZW1zL2l0ZW1zLmNvbnRyb2xsZXIuanMiLCJpdGVtcy9pdGVtcy5maWx0ZXIuanMiLCJsYXp5bG9hZC9sYXp5bG9hZC5jb25maWcuanMiLCJsYXp5bG9hZC9sYXp5bG9hZC5jb25zdGFudHMuanMiLCJsb2FkaW5nYmFyL2xvYWRpbmdiYXIuY29uZmlnLmpzIiwibG9hZGluZ2Jhci9sb2FkaW5nYmFyLnJ1bi5qcyIsImxvY2FsZS9sb2NhbGUuY29uZmlnLmpzIiwibG9jYWxlL2xvY2FsZS5jb250cm9sbGVyLmpzIiwibWVtYmVycy9tZW1iZXJzLmNvbnRyb2xsZXIuanMiLCJtZW1iZXJzL21lbWJlcnMuZmlsdGVyLmpzIiwibWVtYmVycy9tZW1iZXJzLnNlcnZpY2UuanMiLCJteXNob3AvbXlzaG9wLmNvbnRyb2xsZXIuanMiLCJteXNob3AvbXlzaG9wLmZpbHRlci5qcyIsIm5vdGlmeS9ub3RpZnkuY29udHJvbGxlci5qcyIsIm5vdGlmeS9ub3RpZnkuZGlyZWN0aXZlLmpzIiwibm90aWZ5L25vdGlmeS5zZXJ2aWNlLmpzIiwicGFnZXMvYWNjZXNzLWxvZ2luLmNvbnRyb2xsZXIuanMiLCJwYWdlcy9hY2Nlc3MtcmVnaXN0ZXIuY29udHJvbGxlci5qcyIsInBhZ2VzL3BhZ2VzLmZpbHRlci5qcyIsInBhbmVscy9wYW5lbC1jb2xsYXBzZS5kaXJlY3RpdmUuanMiLCJwYW5lbHMvcGFuZWwtZGlzbWlzcy5kaXJlY3RpdmUuanMiLCJwYW5lbHMvcGFuZWwtcmVmcmVzaC5kaXJlY3RpdmUuanMiLCJwYW5lbHMvcGFuZWwtdG9vbHMuZGlyZWN0aXZlLmpzIiwicGFuZWxzL3BhbmVscy5jb250cm9sbGVyLmpzIiwicGFuZWxzL3BvcnRsZXQuZGlyZWN0aXZlLmpzIiwicHJlbG9hZGVyL3ByZWxvYWRlci5kaXJlY3RpdmUuanMiLCJyb3V0ZXMvcm91dGUtaGVscGVycy5wcm92aWRlci5qcyIsInJvdXRlcy9yb3V0ZXMuY29uZmlnLmpzIiwic2FsZXMvZGVhbC5zZXJ2aWNlLmpzIiwic2FsZXMvc2FsZXMuY29udHJvbGxlci5qcyIsInNhbGVzL3NhbGVzLmZpbHRlci5qcyIsInNldHRpbmdzL3NldHRpbmcuY29udHJvbGxlci5qcyIsInNldHRpbmdzL3NldHRpbmdzLnJ1bi5qcyIsInNpZGViYXIvc2lkZWJhci5jb250cm9sbGVyLmpzIiwic2lkZWJhci9zaWRlYmFyLmRpcmVjdGl2ZS5qcyIsInNpZGViYXIvc2lkZWJhci5zZXJ2aWNlLmpzIiwic2lkZWJhci9zaWRlYmFyLnVzZXJibG9jay5jb250cm9sbGVyLmpzIiwidGFibGVzL25ndGFibGUtZGF0YS5zZXJ2aWNlLmpzIiwidGFibGVzL25ndGFibGUtbGIuc2VydmljZS5qcyIsInRyYW5zbGF0ZS90cmFuc2xhdGUuY29uZmlnLmpzIiwidHJhbnNsYXRlL3RyYW5zbGF0ZS5ydW4uanMiLCJ1dGlscy9hbmltYXRlLWVuYWJsZWQuZGlyZWN0aXZlLmpzIiwidXRpbHMvYnJvd3Nlci5zZXJ2aWNlLmpzIiwidXRpbHMvY2xlYXItc3RvcmFnZS5kaXJlY3RpdmUuanMiLCJ1dGlscy9jdXJyZW5jeS5kaXJlY3RpdmUuanMiLCJ1dGlscy9mdWxsc2NyZWVuLmRpcmVjdGl2ZS5qcyIsInV0aWxzL2xvYWQtY3NzLmRpcmVjdGl2ZS5qcyIsInV0aWxzL25vdy5kaXJlY3RpdmUuanMiLCJ1dGlscy90YWJsZS1jaGVja2FsbC5kaXJlY3RpdmUuanMiLCJ1dGlscy90cmlnZ2VyLXJlc2l6ZS5kaXJlY3RpdmUuanMiLCJ1dGlscy91dGlscy5zZXJ2aWNlLmpzIiwiY3VzdG9tLm1vZHVsZS5qcyIsImN1c3RvbS5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQWNBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxTQUFBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7Ozs7O0FDeENBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxjQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxjQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxZQUFBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTs7O0FDbEJBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxhQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxpQkFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsZ0JBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGFBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGFBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGdCQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxrQkFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsZUFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsYUFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsaUJBQUE7Ozs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsY0FBQTtZQUNBOzs7QUNMQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsYUFBQTs7QUNKQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUEsZ0JBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGVBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGNBQUE7O0FDSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBLGlCQUFBOztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxhQUFBO1VBQ0E7Ozs7Ozs7Ozs7QUNDQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7O1NBRUEsVUFBQSxpQkFBQSxRQUFBO1NBQ0EsVUFBQSxpQkFBQSxRQUFBO1NBQ0EsVUFBQSxpQkFBQSxRQUFBO1NBQ0EsVUFBQSxpQkFBQSxRQUFBO1NBQ0EsVUFBQSxpQkFBQSxRQUFBO1NBQ0EsVUFBQSxpQkFBQSxRQUFBO1NBQ0EsVUFBQSxpQkFBQSxRQUFBOzs7SUFHQSxTQUFBLFFBQUEsTUFBQTtRQUNBLE9BQUEsV0FBQTtZQUNBLE9BQUE7Z0JBQ0EsVUFBQTtnQkFDQSxPQUFBO29CQUNBLE1BQUE7b0JBQ0EsU0FBQTtvQkFDQSxJQUFBO29CQUNBLE9BQUE7b0JBQ0EsUUFBQTtvQkFDQSxRQUFBO29CQUNBLE9BQUE7b0JBQ0EsVUFBQTtvQkFDQSxZQUFBO29CQUNBLFNBQUE7b0JBQ0EsUUFBQTs7Z0JBRUEsTUFBQSxVQUFBLFFBQUEsT0FBQTtvQkFDQSxJQUFBLE1BQUEsTUFBQSxHQUFBLFdBQUE7b0JBQ0EsSUFBQSxXQUFBOztvQkFFQSxPQUFBLE9BQUEsWUFBQTt3QkFDQSxJQUFBLE9BQUEsU0FBQSxHQUFBOzRCQUNBLE1BQUEsTUFBQSxNQUFBLFNBQUE7NEJBQ0EsSUFBQSxPQUFBLFFBQUEsTUFBQTsrQkFDQTs0QkFDQSxJQUFBLE9BQUEsUUFBQSxPQUFBLFNBQUEsSUFBQSxPQUFBOzRCQUNBLFdBQUE7Ozt3QkFHQSxHQUFBLE9BQUEsVUFBQSxFQUFBOzRCQUNBLE1BQUEsT0FBQSxNQUFBLFNBQUE7NEJBQ0EsSUFBQSxPQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUE7K0JBQ0E7NEJBQ0EsSUFBQSxPQUFBLFNBQUEsT0FBQSxVQUFBLElBQUEsT0FBQTs0QkFDQSxXQUFBOzs7O29CQUlBLE9BQUEsT0FBQSxRQUFBLFVBQUEsUUFBQTt3QkFDQSxHQUFBOzRCQUNBLGFBQUE7Ozt3QkFHQSxJQUFBLENBQUEsUUFBQTs0QkFDQTs7d0JBRUEsSUFBQSxPQUFBLE9BQUEsRUFBQSxPQUFBLE9BQUE7O3dCQUVBLEdBQUEsU0FBQTs0QkFDQSxPQUFBOzRCQUNBLFFBQUEsSUFBQSxNQUFBOzs7d0JBR0EsR0FBQSxPQUFBLGNBQUEsT0FBQTs0QkFDQSxPQUFBLFFBQUEsYUFBQTs7d0JBRUEsR0FBQSxPQUFBLGVBQUE7NEJBQ0EsT0FBQSxRQUFBLGFBQUEsT0FBQTs7d0JBRUEsZUFBQSxNQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUE7d0JBQ0EsYUFBQTt3QkFDQSxHQUFBLE9BQUE7NEJBQ0EsUUFBQSxRQUFBLE1BQUEsSUFBQSxTQUFBLE9BQUEsYUFBQTt1QkFDQTs7b0JBRUEsT0FBQSxPQUFBLFdBQUEsVUFBQSxRQUFBO3dCQUNBLElBQUE7NEJBQ0EsYUFBQTt3QkFDQSxHQUFBLFNBQUEsYUFBQSxDQUFBLGFBQUE7NEJBQ0E7d0JBQ0EsR0FBQSxDQUFBLFNBQUEsV0FBQSxVQUFBLGFBQUEsU0FBQSxVQUFBLFNBQUE7NEJBQ0E7d0JBQ0EsSUFBQSxnQkFBQSxhQUFBLFNBQUE7d0JBQ0EsY0FBQTt3QkFDQSxjQUFBLFlBQUEsY0FBQTt3QkFDQSxhQUFBLFlBQUEsQ0FBQTt3QkFDQSxjQUFBO3VCQUNBOztvQkFFQSxPQUFBO29CQUNBLElBQUEsUUFBQSxJQUFBLE1BQUE7b0JBQ0EsSUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2xHQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGdCQUFBOztJQUVBLGFBQUEsVUFBQSxDQUFBLFlBQUEsU0FBQTtJQUNBLFNBQUEsY0FBQSxVQUFBLE9BQUEsU0FBQTtRQUNBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBOztRQUVBLE9BQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsU0FBQTtVQUNBLElBQUEsa0JBQUEsRUFBQTtjQUNBLGtCQUFBOzs7VUFHQSxTQUFBLFVBQUE7O1lBRUEsSUFBQSxXQUFBLEVBQUE7Z0JBQ0EsV0FBQSxTQUFBOzs7WUFHQSxHQUFBLFNBQUE7Y0FDQSxJQUFBLFFBQUEsZ0JBQUE7O2dCQUVBLFVBQUEsT0FBQSxXQUFBO2tCQUNBLGtCQUFBLFVBQUE7OztnQkFHQSxrQkFBQSxVQUFBOzs7Z0JBR0EsWUFBQSxVQUFBOzs7YUFHQTs7VUFFQSxTQUFBLGtCQUFBLFNBQUEsU0FBQTtZQUNBLElBQUEsU0FBQSxDQUFBO1lBQ0EsSUFBQSxFQUFBLFFBQUEsU0FBQTtnQkFDQSxNQUFBLFNBQUEsU0FBQSxDQUFBLFdBQUEsV0FBQTtjQUNBLFlBQUEsU0FBQTs7O1VBR0EsU0FBQSxZQUFBLFNBQUEsU0FBQTtZQUNBLFFBQUEsYUFBQSxTQUFBLFNBQUE7Ozs7Ozs7QUN0REEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxhQUFBOztJQUVBLFVBQUEsVUFBQSxDQUFBO0lBQ0EsU0FBQSxVQUFBLFdBQUE7UUFDQSxLQUFBLE9BQUE7Ozs7UUFJQSxJQUFBLE9BQUE7WUFDQSxLQUFBLEVBQUEsUUFBQSxPQUFBLFNBQUE7O1FBRUEsU0FBQSxLQUFBLFFBQUE7VUFDQSxPQUFBLFVBQUEsUUFBQSxJQUFBLE1BQUE7Ozs7Ozs7Ozs7QUNaQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFFBQUE7O0lBRUEsS0FBQSxVQUFBLENBQUEsU0FBQTtJQUNBLFNBQUEsTUFBQSxPQUFBLFVBQUE7O1FBRUEsSUFBQSxZQUFBO1VBQ0EsVUFBQTtVQUNBLFVBQUE7VUFDQSxPQUFBO1lBQ0EsU0FBQTtZQUNBLFNBQUE7WUFDQSxRQUFBO1lBQ0EsVUFBQTtZQUNBLEtBQUE7O1VBRUEsTUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTtVQUNBLElBQUEsUUFBQSxNQUFBLFVBQUE7VUFDQSxJQUFBLGdCQUFBOztVQUVBLE9BQUE7O1VBRUEsUUFBQSxNQUFBLFNBQUE7VUFDQSxTQUFBLE1BQUEsVUFBQTs7VUFFQSxXQUFBLEVBQUEsUUFBQSxXQUFBO1VBQ0EsU0FBQSxJQUFBO1lBQ0EsT0FBQTtZQUNBLFFBQUE7OztVQUdBLFNBQUEsT0FBQTtZQUNBLElBQUE7WUFDQSxHQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsTUFBQSxTQUFBO1lBQ0EsVUFBQSxFQUFBLEtBQUEsVUFBQSxNQUFBLFNBQUEsTUFBQTtZQUNBLE1BQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxNQUFBLFVBQUE7Y0FDQSxNQUFBLFNBQUEsU0FBQTs7O1lBR0EsT0FBQTs7O1VBR0EsU0FBQSxpQkFBQSxTQUFBO1lBQ0EsSUFBQSxNQUFBO2NBQ0EsS0FBQSxRQUFBO2NBQ0EsS0FBQTtjQUNBLE9BQUEsS0FBQTttQkFDQTtjQUNBLE9BQUE7Y0FDQSxlQUFBLE1BQUE7Y0FDQSxPQUFBOzs7VUFHQSxNQUFBLGlCQUFBLFdB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SUFDQTs7SUFFQTtPQUNBLE9BQUE7T0FDQSxXQUFBLG1CQUFBO09BQ0EsV0FBQSw0QkFBQTtPQUNBLFdBQUEsd0JBQUE7OztJQUdBLGdCQUFBLFVBQUEsQ0FBQSxVQUFBLFFBQUEsaUJBQUEsb0JBQUEsY0FBQTtJQUNBLFNBQUEsZ0JBQUEsUUFBQSxNQUFBLGVBQUEsa0JBQUEsWUFBQSxVQUFBO01BQ0EsSUFBQSxLQUFBOztNQUVBOztNQUVBLEdBQUEsS0FBQTtRQUNBLFNBQUE7VUFDQSxZQUFBO1VBQ0EsU0FBQSxJQUFBO1VBQ0EsU0FBQSxJQUFBLEtBQUEsS0FBQSxFQUFBO1VBQ0EsYUFBQTs7UUFFQSxPQUFBO1VBQ0EsSUFBQSxJQUFBLEtBQUEsU0FBQSxRQUFBO1VBQ0EsTUFBQTs7UUFFQSxLQUFBO1VBQ0EsSUFBQSxJQUFBO1VBQ0EsTUFBQTs7OztNQUlBLFNBQUEsV0FBQTtRQUNBLEdBQUEsY0FBQSxJQUFBLGNBQUEsQ0FBQSxPQUFBLEtBQUE7VUFDQSxTQUFBLFNBQUEsUUFBQSxRQUFBO1lBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQTtjQUNBLE9BQUEsQ0FBQSxHQUFBO2NBQ0EsVUFBQSxDQUFBLFNBQUE7Z0JBQ0EsT0FBQSxHQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUE7Z0JBQ0EsT0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLE1BQUE7OztZQUdBLGlCQUFBLFFBQUEsUUFBQSxRQUFBLE1BQUE7Ozs7OztNQU1BLEdBQUEsU0FBQSxZQUFBO1FBQ0EsU0FBQSxLQUFBO1VBQ0EsVUFBQTtVQUNBLFlBQUE7V0FDQSxhQUFBLEtBQUEsVUFBQSxNQUFBO1VBQ0EsR0FBQSxZQUFBOzs7O01BSUEsR0FBQSxPQUFBLFVBQUEsUUFBQTtRQUNBLE9BQUEsT0FBQTtRQUNBLFNBQUEsS0FBQTtVQUNBLFVBQUE7VUFDQSxZQUFBO1VBQ0EsT0FBQTtXQUNBLGFBQUEsS0FBQSxVQUFBLE1BQUE7VUFDQSxHQUFBLFlBQUE7Ozs7TUFJQSxHQUFBLFNBQUEsVUFBQSxRQUFBO1FBQ0EsV0FBQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0Esa0JBQUE7VUFDQSxvQkFBQTtVQUNBLG1CQUFBO1VBQ0Esa0JBQUE7O1dBRUEsVUFBQSxXQUFBO1VBQ0EsR0FBQSxXQUFBO1lBQ0EsS0FBQSxXQUFBLENBQUEsSUFBQSxPQUFBO1lBQ0EsR0FBQSxZQUFBOzs7Ozs7SUFNQSx5QkFBQSxVQUFBLENBQUEsVUFBQSxnQkFBQTtJQUNBLFNBQUEseUJBQUEsUUFBQSxjQUFBLFlBQUE7TUFDQSxJQUFBLEtBQUE7O01BRUE7O01BRUEsU0FBQSxXQUFBOztRQUVBLEdBQUEsYUFBQSxhQUFBLEtBQUEsQ0FBQSxRQUFBO1VBQ0EsT0FBQTtVQUNBLE9BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQTs7Ozs7TUFLQSxHQUFBLFNBQUE7O01BRUEsU0FBQSxZQUFBLFVBQUE7UUFDQSxXQUFBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxrQkFBQTtVQUNBLG9CQUFBO1VBQ0EsbUJBQUE7VUFDQSxrQkFBQTs7V0FFQTs7O01BR0EsR0FBQSxjQUFBLFVBQUEsVUFBQTtRQUNBLEdBQUEsWUFBQSxZQUFBLElBQUE7VUFDQSxhQUFBLE9BQUEsQ0FBQSxNQUFBLFdBQUEsU0FBQSxLQUFBOzs7O01BSUEsR0FBQSxpQkFBQSxVQUFBLFVBQUE7UUFDQSxhQUFBLDJCQUFBLENBQUEsSUFBQSxTQUFBLEtBQUE7VUFDQSxRQUFBLFNBQUE7VUFDQSxNQUFBLFNBQUE7VUFDQSxNQUFBLFNBQUE7V0FDQSxTQUFBLEtBQUE7OztNQUdBLEdBQUEsaUJBQUEsVUFBQSxVQUFBO1FBQ0EsWUFBQSxVQUFBLFdBQUE7VUFDQSxHQUFBLFdBQUE7WUFDQSxTQUFBLFNBQUE7WUFDQSxHQUFBLGVBQUE7Ozs7O01BS0EsR0FBQSxpQkFBQSxVQUFBLFVBQUEsYUFBQTtRQUNBLEdBQUEsZUFBQSxlQUFBLE1BQUEsU0FBQSxLQUFBLFFBQUEsaUJBQUEsQ0FBQSxHQUFBO1VBQ0EsU0FBQSxLQUFBLEtBQUE7VUFDQSxHQUFBLGVBQUE7Ozs7TUFJQSxHQUFBLG9CQUFBLFVBQUEsVUFBQSxPQUFBOztRQUVBLFlBQUEsVUFBQSxXQUFBO1VBQ0EsR0FBQSxXQUFBO1lBQ0EsU0FBQSxLQUFBLE9BQUEsT0FBQTtZQUNBLEdBQUEsZUFBQTs7Ozs7O0lBTUEscUJBQUEsVUFBQSxDQUFBLFVBQUEsWUFBQSxRQUFBLGNBQUEsZ0JBQUE7SUFDQSxTQUFBLHFCQUFBLFFBQUEsVUFBQSxNQUFBLFlBQUEsY0FBQSxTQUFBOztRQUVBOzs7O1FBSUEsU0FBQSxXQUFBO1VBQ0EsT0FBQSxhQUFBLGFBQUEsS0FBQSxDQUFBLFFBQUE7WUFDQSxPQUFBO1lBQ0EsT0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBOztVQUVBLE9BQUEsT0FBQSxPQUFBLFFBQUE7WUFDQSxVQUFBO1lBQ0EsYUFBQTtZQUNBLFFBQUE7Ozs7UUFJQSxPQUFBLGNBQUEsVUFBQSxHQUFBLEdBQUE7VUFDQSxPQUFBLEtBQUEsV0FBQTtVQUNBLE9BQUEsS0FBQSxjQUFBO1VBQ0EsT0FBQSxjQUFBOzs7UUFHQSxPQUFBLFVBQUEsWUFBQTtVQUNBLEdBQUEsT0FBQSxLQUFBLFdBQUEsR0FBQTtZQUNBOztVQUVBLE9BQUEsT0FBQSxLQUFBO1VBQ0EsT0FBQSxPQUFBLEtBQUE7VUFDQSxPQUFBLE9BQUEsS0FBQTtVQUNBLE9BQUEsT0FBQSxLQUFBO1VBQ0EsS0FBQSxPQUFBLE9BQUEsTUFBQSxTQUFBLEtBQUEsVUFBQSxRQUFBO1lBQ0EsT0FBQSxZQUFBO1lBQ0EsU0FBQTtZQUNBLFFBQUEsSUFBQSxXQUFBLE1BQUE7YUFDQSxVQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUE7WUFDQSxRQUFBLElBQUEsU0FBQSxNQUFBOztVQUVBLE9BQUEsWUFBQTs7Ozs7QUN4TUEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxvQkFBQSxVQUFBLENBQUEsVUFBQSxhQUFBLFlBQUEsV0FBQSxRQUFBLFdBQUE7SUFDQSxTQUFBLG9CQUFBLFFBQUEsV0FBQSxVQUFBLFNBQUEsTUFBQSxTQUFBLGFBQUE7UUFDQSxJQUFBLEtBQUE7OztRQUdBLE9BQUEsT0FBQTs7UUFFQTs7OztRQUlBLFNBQUEsV0FBQTs7VUFFQSxHQUFBLENBQUEsT0FBQSxNQUFBOzs7O1VBSUEsR0FBQSxXQUFBO1lBQ0EsQ0FBQSxPQUFBLFFBQUEsT0FBQSxXQUFBLE1BQUE7WUFDQSxDQUFBLE9BQUEsUUFBQSxPQUFBLFdBQUEsTUFBQTtZQUNBLENBQUEsT0FBQSxRQUFBLE9BQUEsV0FBQSxNQUFBOztVQUVBLElBQUEsT0FBQTtVQUNBLEdBQUEsT0FBQTtVQUNBLElBQUEsTUFBQTtVQUNBLElBQUEsT0FBQSxTQUFBLFNBQUEsS0FBQSxHQUFBLFFBQUEsUUFBQTtVQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxNQUFBLEtBQUE7WUFDQSxJQUFBLElBQUEsU0FBQSxTQUFBLEtBQUEsRUFBQSxHQUFBLFFBQUE7WUFDQSxHQUFBLFNBQUEsR0FBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBO1lBQ0EsR0FBQSxTQUFBLEdBQUEsS0FBQSxLQUFBLENBQUEsR0FBQTtZQUNBLEdBQUEsU0FBQSxHQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUE7O1VBRUEsSUFBQSxnQkFBQSxVQUFBLEtBQUEsSUFBQTtZQUNBLElBQUEsU0FBQTtZQUNBLElBQUEsS0FBQSxVQUFBLE1BQUE7Y0FDQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUE7aUJBQ0EsS0FBQSxJQUFBLFVBQUEsR0FBQSxRQUFBO2lCQUNBLEtBQUEsSUFBQSxlQUFBLEdBQUEsUUFBQTtnQkFDQSxTQUFBO2dCQUNBLE9BQUE7cUJBQ0E7Z0JBQ0EsT0FBQTs7O1lBR0EsT0FBQTs7VUFFQSxLQUFBLEtBQUEsQ0FBQSxPQUFBO1lBQ0EsTUFBQTtjQUNBLFFBQUE7Y0FDQSxrQkFBQSxDQUFBLEtBQUE7Y0FDQSxVQUFBLENBQUEsTUFBQSxNQUFBLE1BQUE7O1lBRUEsTUFBQSxDQUFBLEtBQUE7Y0FDQSxVQUFBLEtBQUE7WUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsTUFBQSxLQUFBO2NBQ0EsSUFBQSxJQUFBLFNBQUEsU0FBQSxLQUFBLEVBQUEsR0FBQTtjQUNBLElBQUEsT0FBQSxjQUFBLEtBQUE7Y0FDQSxHQUFBLENBQUEsTUFBQTtjQUNBLElBQUEsSUFBQSxFQUFBO2NBQ0EsR0FBQSxTQUFBLEdBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLE1BQUEsS0FBQSxPQUFBO2NBQ0EsR0FBQSxTQUFBLEdBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBOztZQUVBLEdBQUEsV0FBQSxLQUFBLEdBQUEsU0FBQTs7O1VBR0EsUUFBQSxLQUFBLENBQUEsT0FBQTtZQUNBLE1BQUE7Y0FDQSxRQUFBO2NBQ0EsVUFBQTtjQUNBLFVBQUEsQ0FBQSxNQUFBLE1BQUEsTUFBQTs7WUFFQSxNQUFBLENBQUEsS0FBQTtjQUNBLFVBQUEsS0FBQTtZQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxNQUFBLEtBQUE7Y0FDQSxJQUFBLElBQUEsU0FBQSxTQUFBLEtBQUEsRUFBQSxHQUFBO2NBQ0EsSUFBQSxPQUFBLGNBQUEsS0FBQTtjQUNBLEdBQUEsQ0FBQSxNQUFBO2NBQ0EsSUFBQSxJQUFBLEVBQUE7Y0FDQSxHQUFBLFNBQUEsR0FBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsTUFBQSxLQUFBLE9BQUE7O1lBRUEsR0FBQSxXQUFBLEtBQUEsR0FBQSxTQUFBOzs7OztVQUtBLEdBQUEsV0FBQSxRQUFBLEtBQUEsQ0FBQSxPQUFBO1lBQ0EsT0FBQSxDQUFBLFlBQUEsT0FBQSxLQUFBO1lBQ0EsU0FBQSxDQUFBLENBQUEsUUFBQTtZQUNBLE9BQUE7WUFDQSxPQUFBOzs7VUFHQSxHQUFBLE9BQUEsVUFBQSxRQUFBO1lBQ0EsWUFBQSxTQUFBO1lBQ0EsT0FBQSxPQUFBLEdBQUE7Ozs7O1VBS0EsR0FBQSxhQUFBLFVBQUEsS0FBQTtVQUNBLEdBQUEsZ0JBQUE7Y0FDQSxRQUFBO2tCQUNBLE9BQUE7c0JBQ0EsTUFBQTs7a0JBRUEsUUFBQTtzQkFDQSxNQUFBO3NCQUNBLFFBQUE7O2tCQUVBLFNBQUE7c0JBQ0EsTUFBQTtzQkFDQSxTQUFBO3NCQUNBLFdBQUE7c0JBQ0EsTUFBQTs7O2NBR0EsTUFBQTtrQkFDQSxhQUFBO2tCQUNBLGFBQUE7a0JBQ0EsV0FBQTtrQkFDQSxpQkFBQTs7Y0FFQSxTQUFBO2NBQ0EsYUFBQTtrQkFDQSxTQUFBLFVBQUEsT0FBQSxHQUFBLEdBQUEsRUFBQSxPQUFBLElBQUEsUUFBQTs7Y0FFQSxPQUFBO2tCQUNBLFdBQUE7a0JBQ0EsTUFBQTs7Y0FFQSxPQUFBOzs7a0JBR0EsV0FBQTtrQkFDQSxXQUFBLE9BQUEsSUFBQSxPQUFBLFFBQUEsVUFBQTtrQkFDQSxlQUFBLFVBQUEsR0FBQTtzQkFDQSxPQUFBOzs7Y0FHQSxZQUFBOzs7OztRQUtBLE9BQUEsSUFBQSxnQkFBQTs7Ozs7Ozs7Ozs7QUNoSkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsT0FBQSxlQUFBO1NBQ0EsT0FBQSxtQkFBQTtTQUNBLE9BQUEsd0JBQUE7OztJQUdBLFNBQUEsaUJBQUEsT0FBQSxRQUFBO01BQ0EsT0FBQSxPQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUE7Ozs7SUFHQSxTQUFBLHNCQUFBO01BQ0EsT0FBQSxVQUFBLE9BQUE7UUFDQSxPQUFBLE9BQUEsT0FBQTs7OztJQUlBLFNBQUEsd0JBQUEsT0FBQTtNQUNBLE9BQUEsT0FBQSxLQUFBLE9BQUE7Ozs7Ozs7Ozs7QUN2QkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxjQUFBOztJQUVBLFNBQUEsY0FBQTtRQUNBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBOztRQUVBLE9BQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsU0FBQSxPQUFBO1VBQ0EsSUFBQSxnQkFBQTtVQUNBLFFBQUEsV0FBQTtjQUNBLFNBQUEsTUFBQSxVQUFBOzs7Ozs7Ozs7Ozs7QUNqQkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxhQUFBOztJQUVBLFNBQUEsYUFBQTtRQUNBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBOztRQUVBLE9BQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsU0FBQTtVQUNBLElBQUEsVUFBQSxRQUFBOzs7VUFHQSxRQUFBLGFBQUEsUUFBQSxLQUFBLGlCQUFBLFFBQUE7O1VBRUEsUUFBQSxVQUFBOzs7Ozs7Ozs7Ozs7QUNuQkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxjQUFBOztJQUVBLFdBQUEsVUFBQSxDQUFBO0lBQ0EsU0FBQSxZQUFBLFFBQUE7UUFDQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTtZQUNBLE9BQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBLE9BQUE7VUFDQSxJQUFBLFdBQUEsT0FBQSxNQUFBLGVBQUE7Y0FDQSxNQUFBLElBQUEsT0FBQSxNQUFBLE9BQUEsQ0FBQSxDQUFBLFVBQUE7VUFDQSxNQUFBLFNBQUEsSUFBQTs7O1FBR0EsU0FBQSxRQUFBLFVBQUEsVUFBQSxTQUFBOztVQUVBLElBQUEsT0FBQTtVQUNBLEtBQUEsV0FBQSxTQUFBLFNBQUE7VUFDQSxLQUFBLFdBQUE7VUFDQSxLQUFBLFVBQUE7O1VBRUEsS0FBQSxPQUFBLFdBQUE7WUFDQSxLQUFBLFlBQUEsS0FBQTtZQUNBLEtBQUEsR0FBQTtZQUNBLE9BQUE7OztVQUdBLEtBQUEsS0FBQSxTQUFBLE1BQUE7O1lBRUEsS0FBQSxRQUFBLFVBQUEsS0FBQSxNQUFBLFNBQUE7O2NBRUEsR0FBQSxLQUFBLFlBQUEsU0FBQSxHQUFBO2dCQUNBLElBQUEsT0FBQSxFQUFBLEtBQUE7b0JBQ0EsUUFBQSxLQUFBLFdBQUEsU0FBQSxPQUFBLElBQUEsT0FBQTs7Z0JBRUEsSUFBQSxVQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUEsTUFBQTtrQkFDQSxPQUFBOzs7O2NBSUEsS0FBQTtjQUNBLEtBQUEsTUFBQSxRQUFBOzs7O1VBSUEsS0FBQSxTQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsQ0FBQSxDQUFBLEtBQUEsTUFBQTs7O1VBR0EsS0FBQSxXQUFB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QTtjQUNBLElBQUEsS0FBQSxDQUFBLE9BQUE7Y0FDQSxPQUFBLE1BQUEsS0FBQSxDQUFBLENBQUEsWUFBQSxLQUFBLENBQUEsTUFBQTtjQUNBLE9BQUEsS0FBQTs7WUFFQSxpQkFBQSxRQUFBLFFBQUEsUUFBQSxLQUFBOzs7OztNQUtBLEdBQUEsUUFBQSxVQUFBLEtBQUEsTUFBQTtRQUNBLFNBQUEsS0FBQTtVQUNBLFVBQUE7VUFDQSxZQUFBO1VBQ0EsTUFBQSxDQUFBLEtBQUEsS0FBQSxNQUFBOzs7O01BSUEsR0FBQSxTQUFBLFVBQUEsS0FBQTtRQUNBLFdBQUEsS0FBQTtVQUNBLE9BQUEsU0FBQSxJQUFBLEtBQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLGtCQUFBO1VBQ0Esb0JBQUE7VUFDQSxtQkFBQTtVQUNBLGtCQUFBO1VBQ0EsZ0JBQUE7WUFDQSxTQUFBLFVBQUE7VUFDQSxHQUFBLFdBQUE7WUFDQSxJQUFBLFNBQUE7WUFDQSxJQUFBLE1BQUEsWUFBQTtjQUNBLFdBQUEsS0FBQSxPQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsU0FBQTtlQUNBLFVBQUEsS0FBQTtjQUNBLFdBQUEsS0FBQSxPQUFBLHdCQUFBOzs7Ozs7TUFNQSxHQUFBLFVBQUEsVUFBQSxLQUFBO1FBQ0EsSUFBQSxNQUFBO1FBQ0EsSUFBQSxZQUFBLElBQUEsWUFBQTtRQUNBLEdBQUEsV0FBQTtVQUNBLE1BQUEsVUFBQTs7UUFFQSxJQUFBLE9BQUEsT0FBQSxDQUFBLElBQUEsSUFBQSxLQUFBLENBQUEsTUFBQSxhQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUEsVUFBQSxNQUFBO1VBQ0EsR0FBQSxZQUFBO1VBQ0EsV0FBQSxLQUFBLFFBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxXQUFBOzs7Ozs7SUFNQSxrQkFBQSxVQUFBLENBQUEsVUFBQTtJQUNBLFNBQUEsa0JBQUEsUUFBQSxNQUFBO01BQ0E7O01BRUEsT0FBQSxpQkFBQSxVQUFBOztNQUVBLFNBQUEsV0FBQTtRQUNBLE9BQUEsU0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQSxDQUFBLENBQUEsU0FBQSxPQUFBLE9BQUEsUUFBQSxPQUFBLFFBQUEsU0FBQTs7OztNQUlBLE9BQUEsT0FBQSxZQUFBO1FBQ0EsS0FBQSxPQUFBLE9BQUEsUUFBQTtTQUNBLEtBQUEsVUFBQSxNQUFBO1VBQ0EsT0FBQSxPQUFBLEdBQUE7Ozs7TUFJQSxPQUFBLGNBQUEsWUFBQTtRQUNBLEtBQUEsT0FBQSxPQUFBOzs7O0lBSUEsc0JBQUEsVUFBQSxDQUFBLFVBQUEsWUFBQSxTQUFBLFdBQUE7SUFDQSxTQUFBLHNCQUFBLFFBQUEsVUFBQSxPQUFBLFNBQUEsU0FBQTs7UUFFQTs7OztRQUlBLFNBQUEsV0FBQTtVQUNBLE9BQUEsV0FBQTs7O1FBR0EsT0FBQSxVQUFBLFlBQUE7VUFDQSxJQUFBLE1BQUEsT0FBQSxhQUFBO1VBQ0EsSUFBQSxPQUFBLE9BQUEsYUFBQTtVQUNBLElBQUEsT0FBQSxPQUFBLGFBQUE7VUFDQSxNQUFBLE9BQUEsQ0FBQSxPQUFBLElBQUEsSUFBQSxLQUFBLE9BQUEsVUFBQSxNQUFBLE1BQUEsTUFBQTtVQUNBLEdBQUEsQ0FBQSxJQUFBLFlBQUEsSUFBQTtZQUNBLElBQUEsWUFBQSxLQUFBLENBQUEsS0FBQSxHQUFBLFVBQUEsSUFBQTs7VUFFQSxJQUFBLFlBQUEsR0FBQSxPQUFBLE9BQUE7VUFDQSxTQUFBO1VBQ0EsUUFBQSxJQUFBLFdBQUE7V0FDQSxLQUFBLFFBQUEsY0FBQSxNQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsT0FBQSxTQUFBOzs7O0lBSUEsaUJBQUEsVUFBQSxDQUFBLFVBQUEsU0FBQTtJQUNBLFNBQUEsaUJBQUEsUUFBQSxPQUFBLGVBQUE7TUFDQSxJQUFBLEtBQUE7O01BRUE7O01BRUEsU0FBQSxTQUFBO1FBQ0EsR0FBQSxTQUFBLENBQUEsTUFBQTtRQUNBLEdBQUEsY0FBQSxJQUFBLGNBQUE7VUFDQSxPQUFBO1VBQ0EsUUFBQSxHQUFBLE9BQUE7V0FDQTtVQUNBLFNBQUEsU0FBQSxRQUFBLFFBQUE7WUFDQSxJQUFBLE1BQUEsQ0FBQSxNQUFBLElBQUEsUUFBQSxDQUFBO1lBQ0EsSUFBQSxRQUFBLE9BQUE7WUFDQSxJQUFBLE9BQUEsQ0FBQSxPQUFBLE9BQUEsR0FBQSxJQUFBO1lBQ0EsR0FBQSxHQUFBLE9BQUEsUUFBQSxJQUFBO2NBQ0EsSUFBQSxPQUFBOztZQUVBLE1BQUEsTUFBQSxDQUFBLE9BQUEsSUFBQSxRQUFBLFVBQUEsUUFBQTtjQUNBLEdBQUEsWUFBQSxNQUFBLE9BQUE7Y0FDQSxNQUFBLEtBQUEsQ0FBQSxPQUFBLE1BQUEsT0FBQTs7Ozs7Ozs7Ozs7Ozs7O0FDckpBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLE9BQUEsYUFBQTtTQUNBLE9BQUEsY0FBQTtTQUNBLE9BQUEsZ0JBQUE7OztJQUdBLFNBQUEsaUJBQUE7UUFDQSxJQUFBLE9BQUE7VUFDQSxRQUFBO1VBQ0EsU0FBQTs7UUFFQSxPQUFBLFNBQUEsS0FBQTtVQUNBLE9BQUEsS0FBQTs7OztJQUlBLFNBQUEsb0JBQUE7TUFDQSxPQUFBLFVBQUEsS0FBQTtRQUNBLE9BQUEsS0FBQSxJQUFBOzs7O0lBSUEsU0FBQSxrQkFBQTtNQUNBLElBQUEsT0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsUUFBQTtRQUNBLFdBQUE7UUFDQSxVQUFBOztNQUVBLE9BQUEsVUFBQSxLQUFBO1FBQ0EsTUFBQSxPQUFBO1FBQ0EsT0FBQSxLQUFBOzs7OztBQzNDQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxPQUFBOztJQUVBLGVBQUEsVUFBQSxDQUFBLHVCQUFBO0lBQ0EsU0FBQSxlQUFBLHFCQUFBLGFBQUE7OztNQUdBLG9CQUFBLE9BQUE7UUFDQSxPQUFBO1FBQ0EsUUFBQTtRQUNBLFNBQUEsYUFBQTs7Ozs7QUNkQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxTQUFBLGdCQUFBOztVQUVBLFNBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTttQ0FDQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTttQ0FDQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTttQ0FDQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7bUNBQ0E7bUNBQ0E7bUNBQ0E7bUNBQ0E7bUNBQ0E7O1lBRUEsc0JBQUEsQ0FBQTttQ0FDQTs7WUFFQSxzQkFBQSxDQUFBO21DQUNBO21DQUNBO21DQUNBO21DQUNBO21DQUNBO21DQUNBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTttQ0FDQTs7WUFFQSx3QkFBQSxDQUFBO3FDQUNBO3FDQUNBO3FDQUNBO1lBQ0Esc0JBQUEsQ0FBQTttQ0FDQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO21DQUNBO21DQUNBO1lBQ0Esc0JBQUEsQ0FBQTttQ0FDQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0Esc0JBQUEsQ0FBQTttQ0FDQTttQ0FDQTtZQUNBLHdCQUFBLENBQUE7WUFDQSx3QkFBQSxDQUFBOzs7VUFHQSxTQUFBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt1REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7dURBQ0E7dURBQ0E7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3VEQUNBO3VEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7d0RBQ0E7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTt3REFDQTt3REFDQTt3REFDQTt3REFDQTt3REFDQTt3REFDQTt3REFDQTt3REFDQTsyREFDQSxPQUFBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTt3REFDQTt3REFDQSx3Q0FBQSxPQUFBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTt3REFDQSx3REFBQSxPQUFBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7d0RBQ0EseURBQUEsT0FBQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7d0RBQ0E7d0RBQ0E7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO3dEQUNBO3dEQUNBO1lBQ0EsQ0FBQSxNQUFBLDZCQUFBLE9BQUEsQ0FBQTt3REFDQTtZQUNBLENBQUEsTUFBQSw2QkFBQSxPQUFBLENBQUE7WUFDQSxDQUFBLE1BQUEsNkJBQUEsT0FBQSxDQUFBO3dEQUNBO3dEQUNBO1lBQ0Es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LE9BQUE7O01BRUEsR0FBQSxrQkFBQSxJQUFBLGNBQUE7UUFDQSxPQUFBO1NBQ0E7UUFDQSxTQUFBLFNBQUEsUUFBQSxRQUFBO1VBQ0EsSUFBQSxNQUFBLENBQUEsTUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBO1VBQ0EsSUFBQSxRQUFBLE9BQUE7VUFDQSxJQUFBLE9BQUEsQ0FBQSxPQUFBLE9BQUEsR0FBQSxJQUFBO1VBQ0EsT0FBQSxNQUFBLE1BQUEsQ0FBQSxJQUFBLFVBQUEsT0FBQSxJQUFBLFFBQUEsVUFBQSxRQUFBO1lBQ0EsR0FBQSxnQkFBQSxNQUFBLE9BQUE7O1VBRUEsT0FBQSxNQUFBLENBQUEsSUFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBOzs7O01BSUEsR0FBQSxxQkFBQSxJQUFBLGNBQUE7UUFDQSxPQUFBO1NBQ0E7UUFDQSxTQUFBLFNBQUEsUUFBQSxRQUFBO1VBQ0EsSUFBQSxNQUFBO1lBQ0EsTUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLFlBQUEsR0FBQSxDQUFBLENBQUEsTUFBQSxZQUFBLENBQUEsVUFBQTtZQUNBLFNBQUEsQ0FBQTs7VUFFQSxJQUFBLFFBQUEsT0FBQTtVQUNBLElBQUEsT0FBQSxDQUFBLE9BQUEsT0FBQSxHQUFBLElBQUE7VUFDQSxPQUFBLFNBQUEsTUFBQSxDQUFBLElBQUEsVUFBQSxPQUFBLElBQUEsUUFBQSxVQUFBLFFBQUE7WUFDQSxHQUFBLG1CQUFBLE1BQUEsT0FBQTs7VUFFQSxPQUFBLFNBQUEsQ0FBQSxJQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUE7Ozs7TUFJQSxHQUFBLG1CQUFBLElBQUEsY0FBQTtRQUNBLE9BQUE7U0FDQTtRQUNBLFNBQUEsU0FBQSxRQUFBLFFBQUE7VUFDQSxJQUFBLE1BQUE7WUFDQSxNQUFBLENBQUEsT0FBQSxDQUFBLEdBQUE7WUFDQSxTQUFBOztVQUVBLElBQUEsUUFBQSxPQUFBO1VBQ0EsSUFBQSxPQUFBLENBQUEsT0FBQSxPQUFBLEdBQUEsSUFBQTtVQUNBLE9BQUEsUUFBQSxNQUFBLENBQUEsSUFBQSxVQUFBLE9BQUEsSUFBQSxRQUFBLFVBQUEsUUFBQTtZQUNBLEdBQUEsaUJBQUEsTUFBQSxPQUFBOztVQUVBLE9BQUEsUUFBQSxDQUFBLElBQUEsVUFBQSxPQUFBLE1BQUEsT0FBQTs7OztNQUlBOztNQUVBLFNBQUEsV0FBQTs7UUFFQSxXQUFBLE9BQUEsT0FBQSxPQUFBOztRQUVBLEdBQUEsU0FBQSxPQUFBLFFBQUEsQ0FBQSxRQUFBO1VBQ0EsT0FBQSxDQUFBLElBQUE7VUFDQSxRQUFBLENBQUE7OztRQUdBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxpQkFBQTs7O01BR0EsR0FBQSxPQUFBLFlBQUE7UUFDQSxZQUFBLFNBQUEsR0FBQTtRQUNBLE9BQUEsT0FBQSxHQUFBOzs7TUFHQSxHQUFBLFdBQUEsWUFBQTtRQUNBLFNBQUEsS0FBQTtVQUNBLFVBQUE7VUFDQSxZQUFBO1dBQ0EsYUFBQSxLQUFBLFVBQUEsTUFBQTtVQUNBOzs7O01BSUEsR0FBQSxXQUFBLFlBQUE7UUFDQSxTQUFBLEtBQUE7VUFDQSxVQUFBO1VBQ0EsWUFBQTtXQUNBLGFBQUEsS0FBQSxVQUFBLE1BQUE7VUFDQTs7Ozs7SUFLQSx5QkFBQSxVQUFBLENBQUEsVUFBQSxZQUFBLFVBQUEsV0FBQTtJQUNBLFNBQUEseUJBQUEsUUFBQSxVQUFBLFFBQUEsU0FBQSxhQUFBOztRQUVBOzs7O1FBSUEsSUFBQSxXQUFBLE9BQUEsT0FBQSxPQUFBO1FBQ0EsU0FBQSxXQUFBO1VBQ0EsV0FBQSxPQUFBLE9BQUEsT0FBQTtVQUNBLE9BQUEsU0FBQSxPQUFBLFNBQUEsQ0FBQSxHQUFBO1VBQ0EsT0FBQSxPQUFBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7WUFDQSxVQUFBOztVQUVBLE9BQUEsVUFBQSxZQUFBO1VBQ0EsT0FBQSxPQUFBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Ozs7UUFJQSxPQUFBLGtCQUFBLFlBQUE7VUFDQSxHQUFBLEtBQUEsU0FBQSxRQUFBO1lBQ0EsT0FBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUE7WUFDQSxPQUFBLEtBQUEsVUFBQSxPQUFBLEtBQUE7WUFDQSxPQUFBO2lCQUNBO1lBQ0EsT0FBQSxLQUFBLE9BQUE7Ozs7UUFJQSxPQUFBLGNBQUEsWUFBQTtVQUNBLE9BQUEsS0FBQSxRQUFBLE9BQUEsS0FBQTtVQUNBLE9BQUEsS0FBQSxTQUFBLE9BQUEsS0FBQSxTQUFBLE9BQUEsS0FBQTs7O1FBR0EsT0FBQSxVQUFBLFlBQUE7VUFDQSxHQUFBLE9BQUEsS0FBQSxXQUFBLEdBQUE7WUFDQTs7VUFFQSxPQUFBLFNBQUEsT0FBQSxDQUFBLElBQUEsV0FBQSxPQUFBLE1BQUEsU0FBQSxLQUFBLFVBQUEsUUFBQTtZQUNBLE9BQUEsWUFBQTtZQUNBLFNBQUE7WUFDQSxRQUFBLElBQUEsV0FBQSxNQUFBO2FBQ0EsVUFBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBO1lBQ0EsUUFBQSxJQUFBLFNBQUEsTUFBQTs7VUFFQSxPQUFBLFlBQUE7Ozs7O0lBS0Esc0JBQUEsVUFBQSxDQUFBLFVBQUEsWUFBQSxVQUFBO0lBQ0EsU0FBQSxzQkFBQSxRQUFBLFVBQUEsUUFBQSxTQUFBOztRQUVBOzs7O1FBSUEsSUFBQSxXQUFBLE9BQUEsT0FBQSxPQUFBO1FBQ0EsU0FBQSxXQUFBO1VBQ0EsV0FBQSxPQUFBLE9BQUEsT0FBQTtVQUNBLE9BQUEsU0FBQSxPQUFBLFNBQUEsQ0FBQSxHQUFBO1VBQ0EsT0FBQSxPQUFBO1lBQ0EsUUFBQTtZQUNBLE1BQUE7Ozs7UUFJQSxPQUFBLFVBQUEsWUFBQTtVQUNBLEdBQUEsT0FBQSxLQUFBLFdBQUEsR0FBQTtZQUNBO2lCQUNBLEdBQUEsT0FBQSxLQUFBLFNBQUEsR0FBQTtZQUNBLE9BQUEsS0FBQSxPQUFBO2lCQUNBLEdBQUEsT0FBQSxLQUFBLFNBQUEsR0FBQTtZQUNBLE9BQUEsS0FBQSxPQUFBOztVQUVBLE9BQUEsUUFBQSxPQUFBLENBQUEsSUFBQSxXQUFBLE9BQUEsTUFBQSxTQUFBLEtBQUEsVUFBQSxRQUFBO1lBQ0EsT0FBQSxZQUFBO1lBQ0EsU0FBQTtZQUNBLFFBQUEsSUFBQSxXQUFB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LENBQUEsT0FBQSxPQUFBLEdBQUEsSUFBQTtVQUNBLElBQUEsUUFBQTtVQUNBLEdBQUEsT0FBQSxPQUFBLFFBQUEsSUFBQTtZQUNBLFFBQUEsSUFBQSxPQUFBLE9BQUE7O1lBRUEsSUFBQSxLQUFBLENBQUEsT0FBQSxPQUFBLE9BQUE7WUFDQSxJQUFBLE1BQUEsS0FBQSxDQUFBLENBQUEsU0FBQSxLQUFBLENBQUEsT0FBQTtZQUNBLElBQUEsT0FBQTs7VUFFQSxJQUFBLE1BQUEsQ0FBQSxPQUFBLElBQUEsUUFBQSxVQUFBLFFBQUE7WUFDQSxPQUFBLFlBQUEsTUFBQSxPQUFBO1lBQ0EsSUFBQSxLQUFBLENBQUEsT0FBQSxNQUFBLE9BQUE7Ozs7OztJQU1BLGtCQUFBLFVBQUEsQ0FBQSxVQUFBO0lBQ0EsU0FBQSxrQkFBQSxRQUFBLE1BQUE7TUFDQTs7TUFFQSxPQUFBLGlCQUFBLFVBQUE7O01BRUEsU0FBQSxXQUFBO1FBQ0EsT0FBQSxTQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxNQUFBLENBQUEsQ0FBQSxRQUFBLE9BQUEsT0FBQSxNQUFBLE9BQUE7Ozs7TUFJQSxPQUFBLE9BQUEsWUFBQTs7OztNQUlBLE9BQUEsY0FBQSxZQUFBOzs7Ozs7Ozs7OztBQ3JHQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxPQUFBLGNBQUE7O0lBRUEsU0FBQSxrQkFBQTtRQUNBLElBQUEsT0FBQTtVQUNBLFFBQUE7VUFDQSxTQUFBOztRQUVBLE9BQUEsU0FBQSxLQUFBO1VBQ0EsT0FBQSxLQUFBOzs7Ozs7Ozs7QUNoQkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxrQkFBQTs7SUFFQSxlQUFBLFVBQUEsQ0FBQSxVQUFBO0lBQ0EsU0FBQSxlQUFBLFFBQUEsVUFBQTtRQUNBLElBQUEsS0FBQTs7UUFFQTs7OztRQUlBLFNBQUEsV0FBQTtVQUNBLEdBQUEsVUFBQTs7VUFFQSxHQUFBLFlBQUE7VUFDQSxHQUFBLGFBQUE7WUFDQSxRQUFBO1lBQ0EsS0FBQTs7OztVQUlBLFNBQUEsVUFBQTs7WUFFQSxPQUFBO2dCQUNBO2dCQUNBLENBQUEsUUFBQTs7O2FBR0E7Ozs7Ozs7Ozs7QUMvQkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxVQUFBOztJQUVBLE9BQUEsVUFBQSxDQUFBLFdBQUE7SUFDQSxTQUFBLFFBQUEsU0FBQSxRQUFBOztRQUVBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBO1lBQ0EsT0FBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBOzs7UUFHQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUE7O1VBRUEsUUFBQSxHQUFBLFNBQUEsVUFBQSxHQUFBO1lBQ0EsRUFBQTtZQUNBLE9BQUEsTUFBQSxNQUFBLFNBQUEsTUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FDdkJBLENBQUEsV0FBQTtJQUNBO0lBQ0E7U0FDQSxPQUFBO1NBQ0EsUUFBQSxVQUFBOztJQUVBLE9BQUEsVUFBQSxDQUFBO0lBQ0EsU0FBQSxPQUFBLFVBQUE7O1FBRUEsS0FBQSxRQUFBOzs7O1FBSUEsU0FBQSxZQUFBLEtBQUEsTUFBQTtZQUNBLEtBQUEsTUFBQTtnQkFDQSxTQUFBLFVBQUE7b0JBQ0EsRUFBQSxPQUFBLEtBQUEsUUFBQTs7Ozs7Ozs7Ozs7OztBQWFBLENBQUEsU0FBQSxFQUFBO0lBQ0E7SUFDQSxJQUFBLGFBQUE7UUFDQSxhQUFBO1FBQ0EsY0FBQSxTQUFBLFFBQUE7WUFDQSxJQUFBLEVBQUEsS0FBQSxhQUFBLFVBQUE7Z0JBQ0EsVUFBQSxFQUFBLFNBQUE7O1lBRUEsSUFBQSxVQUFBLElBQUE7Z0JBQ0EsVUFBQSxFQUFBLE9BQUEsU0FBQSxFQUFBLEtBQUEsVUFBQSxRQUFBLFdBQUEsQ0FBQSxPQUFBLFVBQUEsTUFBQSxVQUFBOztZQUVBLE9BQUEsQ0FBQSxJQUFBLFFBQUEsVUFBQTs7UUFFQSxZQUFBLFNBQUEsT0FBQSxVQUFBO1lBQ0EsSUFBQTtZQUNBLEdBQUEsT0FBQTtnQkFDQSxJQUFBLE1BQUEsVUFBQSxFQUFBLEdBQUEsUUFBQSxTQUFBLElBQUEsT0FBQSxTQUFBLElBQUEsTUFBQTttQkFDQTtnQkFDQSxJQUFBLE1BQUEsVUFBQSxFQUFBLFNBQUEsSUFBQSxNQUFBOzs7SUFHQSxJQUFBLFVBQUEsU0FBQSxRQUFBOztRQUVBLEtBQUEsVUFBQSxFQUFBLE9BQUEsSUFBQSxRQUFBLFVBQUE7UUFDQSxLQUFBLFVBQUEsTUFBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEtBQUEsS0FBQSxLQUFBLFdBQUE7UUFDQSxLQUFBLFVBQUEsRUFBQTs7WUFFQTtnQkFDQTtnQkFDQSxRQUFBLEtBQUEsUUFBQSxRQUFBO1lBQ0E7VUFDQSxLQUFBLEtBQUEsS0FBQSxpQkFBQTs7UUFFQSxJQUFBLEtBQUEsUUFBQSxRQUFBO1lBQ0EsS0FBQSxRQUFBLFNBQUEsZUFBQSxLQUFBLFFBQUE7WUFDQSxLQUFBLGdCQUFBLEtBQUEsUUFBQTs7UUFFQSxLQUFBLFFBQUEsS0FBQSxRQUFBO1FBQ0EsU0FBQSxLQUFBLFFBQUE7UUFDQSxHQUFBLENBQUEsV0FBQSxLQUFBLFFBQUEsTUFBQTtZQUNBLFdBQUEsS0FBQSxRQUFBLE9BQUEsRUFBQSxtQ0FBQSxLQUFBLFFBQUEsSUFBQSxZQUFBLFNBQUEsUUFBQSxHQUFBLFNBQUEsc0JBQUEsVUFBQTtnQkFDQSxFQUFBLE1BQUEsS0FBQSxpQkFBQTs7OztJQUlBLEVBQUEsT0FBQSxRQUFBLFdBQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtRQUNBLFFBQUE7UUFDQSxlQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUEsV0FBQTtZQUNBLElBQUEsS0FBQSxRQUFBLEdBQUEsYUFBQTtZQUNBLElBQUEsUUFBQTtZQUNBLFdBQUEsS0FBQSxRQUFBLEtBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxJQUFBLGVBQUEsU0FBQSxLQUFBLFFBQUEsSUFBQSxrQkFBQTtZQUNBLEtBQUEsUUFBQSxJQUFBLENBQUEsVUFBQSxHQUFBLGNBQUEsQ0FBQSxFQUFBLEtBQUEsUUFBQSxlQUFBLGdCQUFBLElBQUEsUUFBQSxDQUFBLFVBQUEsR0FBQSxjQUFBLEdBQUEsZ0JBQUEsZUFBQSxVQUFBO2dCQUNBLElBQUEsTUFBQSxRQUFBLFNBQUE7b0JBQ0EsSUFBQSxVQUFBLFVBQUEsRUFBQSxNQUFBO29CQUNBLE1BQUEsVUFBQSxXQUFBLFNBQUEsTUFBQSxRQUFBO29CQUNBLE1BQUEsUUFBQTt3QkFDQSxXQUFBLEVBQUEsYUFBQSxNQUFBO3dCQUNBLFdBQUEsRUFBQSxNQUFBLFVBQUEsV0FBQSxTQUFBLE1BQUEsUUFBQTs7OztZQUlBLE9BQUE7O1FBRUEsT0FBQSxTQUFBLFdBQUE7WUFDQSxJQUFBLFdBQUE7Z0JBQ0EsV0FBQSxVQUFBO29CQUNBLE1BQUEsUUFBQTtvQkFDQSxHQUFBLENBQUEsV0FBQSxNQUFBLFFBQUEsS0FBQSxXQUFBLFFBQUE7d0JBQ0EsV0FBQSxNQUFBLFFBQUEsS0FBQTs7b0JBRUEsT0FBQSxTQUFBLE1BQUE7O1lBRUEsR0FBQSxLQUFBLFNBQUEsYUFBQSxLQUFBO1lBQ0EsR0FBQSxXQUFBO2dCQUNBO21CQUNBO2dCQUNBLEtBQUEsUUFBQSxRQUFBLENBQUEsVUFBQSxHQUFBLGNBQUEsQ0FBQSxHQUFBLEtBQUEsUUFBQSxlQUFBLGdCQUFBLElBQUEsVUFBQTtvQkFDQTs7OztRQUlBLFNBQUEsU0FBQSxLQUFBO1lBQ0EsSUFBQSxZQUFBLEtBQUEsUUFBQSxLQUFBO1lBQ0EsR0FBQSxDQUFBLE1BQUE7Z0JBQ0EsT0FBQSxVQUFBOztZQUVBLFVBQUEsS0FBQTtZQUNBLE9BQUE7O1FBRUEsUUFBQSxTQUFBLFFBQUE7WUFDQSxHQUFBLENBQUEsUUFBQTtnQkFDQSxPQUFBLEtBQUE7O1lBRUEsS0FBQSxRQUFBLFlBQUEsZUFBQSxLQUFBLGVBQUEsU0FBQSxlQUFBO1lBQ0EsS0FBQSxnQkFBQTtZQUNBLE9BQUE7OztJQUdBLFFBQUEsV0FBQTtRQUNBLFNBQUE7UUFDQSxRQUFBO1FBQ0EsU0FBQTtRQUNBLE9BQUE7UUFDQSxLQUFBOzs7SUFHQSxFQUFBLGtCQUFBO0lBQ0EsRUFBQSxPQUFBLFdBQUE7SUFDQSxFQUFBLE9BQUEsV0FBQTs7SUFFQSxPQUFBO0VBQ0E7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QUEsT0FBQSxRQUFBLFNBQUEsY0FBQTtRQUNBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsT0FBQTtRQUNBLEtBQUEsTUFBQTtRQUNBLGNBQUEsa0JBQUEsUUFBQSxPQUFBOztNQUVBLFNBQUEsZUFBQSxJQUFBO1FBQ0EsR0FBQSxDQUFBLElBQUEsT0FBQTtRQUNBLElBQUEsT0FBQSxRQUFBLFNBQUEsY0FBQTtRQUNBLEdBQUEsTUFBQTtVQUNBLE9BQUEsS0FBQTs7Ozs7Ozs7Ozs7QUNuREEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxnQkFBQTs7SUFFQSxTQUFBLGdCQUFBOztRQUVBLElBQUEsWUFBQTtZQUNBLFlBQUE7WUFDQSxVQUFBOztRQUVBLE9BQUE7Ozs7SUFJQSxXQUFBLFVBQUEsQ0FBQSxVQUFBLFlBQUEsTUFBQTtJQUNBLFNBQUEsWUFBQSxRQUFBLFVBQUEsSUFBQSxPQUFBO01BQ0EsSUFBQSxnQkFBQTtVQUNBLGdCQUFBOztNQUVBLFNBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQTtRQUNBLEVBQUE7OztRQUdBLElBQUEsU0FBQSxFQUFBLE1BQUEsUUFBQTs7UUFFQTs7UUFFQSxTQUFBLGdCQUFBO1VBQ0EsSUFBQSxXQUFBLEdBQUE7VUFDQSxJQUFBLFVBQUEsU0FBQTs7O1VBR0EsT0FBQSxNQUFBLGFBQUEsT0FBQSxLQUFBLE9BQUE7VUFDQSxRQUFBLEtBQUE7Ozs7UUFJQSxTQUFBLG9CQUFBO1VBQ0EsR0FBQSxNQUFBLFFBQUEsV0FBQTtZQUNBLE9BQUEsTUFBQSxDQUFBLFdBQUEsY0FBQTs7ZUFFQTs7O1FBR0EsU0FBQSxlQUFBOztVQUVBLElBQUEsTUFBQSxPQUFBO1VBQ0EsT0FBQTs7VUFFQTthQUNBLE9BQUEsV0FBQTtZQUNBLElBQUEsS0FBQSxFQUFBO1lBQ0EsUUFBQSxHQUFBLEdBQUEscUNBQUEsR0FBQSxTQUFBLEtBQUEsV0FBQTthQUNBOzs7VUFHQSxPQUFBLE1BQUEsY0FBQSxPQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7OztBQzFEQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGdCQUFBOztJQUVBLFNBQUEsZ0JBQUE7UUFDQSxJQUFBLFlBQUE7WUFDQSxZQUFBO1lBQ0EsVUFBQTtZQUNBLE9BQUE7O1FBRUEsT0FBQTs7OztJQUlBLFdBQUEsVUFBQSxDQUFBLFVBQUE7SUFDQSxTQUFBLFlBQUEsUUFBQSxVQUFBO01BQ0EsSUFBQSxpQkFBQTtVQUNBLGlCQUFBO1VBQ0EsaUJBQUE7OztNQUdBLFNBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQTtRQUNBLEVBQUE7O1FBRUEsSUFBQSxVQUFBLEVBQUE7WUFDQSxVQUFBLE1BQUEsUUFBQSxVQUFBLEdBQUE7WUFDQSxVQUFBLE1BQUEsS0FBQSxjQUFBOzs7O1FBSUEsTUFBQSxTQUFBLGFBQUEsTUFBQTs7O1FBR0EsT0FBQSxNQUFBLGNBQUEsTUFBQSxLQUFBOzs7OztNQUtBLE9BQUEsSUFBQSxpQkFBQTs7O01BR0EsU0FBQSxlQUFBLElBQUEsSUFBQTtRQUNBLElBQUEsQ0FBQSxJQUFBO1FBQ0EsSUFBQSxRQUFBLEdBQUEsT0FBQSxPQUFBLE1BQUEsTUFBQSxJQUFBO1FBQ0E7V0FDQSxRQUFBO1dBQ0EsWUFBQTs7Ozs7Ozs7Ozs7Ozs7QUMvQ0EsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxhQUFBOztJQUVBLFVBQUEsVUFBQSxDQUFBLFlBQUE7SUFDQSxTQUFBLFdBQUEsVUFBQSxVQUFBO1FBQ0EsSUFBQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7WUFDQSxPQUFBOztRQUVBLE9BQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsU0FBQSxPQUFBOztVQUVBLElBQUEsWUFBQTs7WUFFQSxTQUFBOzs7O1lBSUEsU0FBQTs7O1lBR0EsU0FBQTs7Ozs7VUFLQSxJQUFBLFFBQUEsTUFBQSxjQUFBOztVQUVBLFNBQUEsV0FBQTtZQUNBLFFBQUEsS0FBQSxZQUFBLFNBQUEsU0FBQTtZQUNBLFNBQUEsUUFBQSxZQUFBOztZQUVBLFFBQUEsU0FBQTs7O1VBR0EsU0FBQSxhQUFBLE1BQUEsT0FBQTtZQUNBLElBQUEsT0FBQTtZQUNBLFFBQUEsU0FBQTtZQUNBLEdBQUEsTUFBQTtjQUNBLFFBQUEsVUFBQSxTQUFBLFFBQUEsaUJBQUEsS0FBQSxTQUFBLFNBQUEsS0FBQTtZQUNBLEdBQUEsTUFBQTtjQUNBLFFBQUEsVUFBQTtZQUNBLEdBQUEsTUFBQTtjQUNBLFFBQUEsVUFBQSxRQUFBLFFBQUEsZ0JBQUEsTUFBQTtZQUNBLE9BQUE7Ozs7Ozs7Ozs7OztBQ3BEQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLGNBQUE7O0lBRUEsV0FBQSxVQUFBLENBQUEsVUFBQTtJQUNBLFNBQUEsV0FBQSxRQUFBLFVBQUE7O1FBRUE7Ozs7UUFJQSxTQUFBLFdBQUE7Ozs7OztVQU1BLE9BQUEsT0FBQSxhQUFBLFNBQUEsT0FBQTs7Y0FFQSxRQUFBLElBQUEsMkJBQUE7Ozs7Ozs7OztVQVNBLE9BQUEsSUFBQSxnQkFBQSxTQUFBLE9BQUEsSUFBQSxTQUFBOztZQUVBLFFBQUEsSUFBQSxZQUFBLEtBQUE7Ozs7O1lBS0EsU0FBQTs7Ozs7VUFLQSxPQUFBLElBQUEsaUJBQUEsU0FBQSxPQUFBLEdBQUE7O1lBRUEsUUFBQSxJQUFBLFlBQUEsS0FBQTs7Ozs7Ozs7VUFRQSxPQUFBLElBQUEsaUJBQUEsU0FBQSxPQUFBLElBQUE7WUFDQSxJQUFBLE9BQUE7O1lBRUEsUUFBQSxJQUFBLHVCQUFBLE1BQUEsTUFBQTs7WUFFQSxTQUFBLFVBQUE7OztjQUdBLE9BQUEsV0FBQSxpQkFBQTs7Y0FFQSxRQUFBLElBQUEsZ0JBQUE7O2VBRUE7Ozs7Ozs7VUFPQSxPQUFBLFNBQUE7WUFDQTtjQUNBLElBQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTs7WUFFQTtjQUNBLElBQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTs7WUFFQTtjQUNBLElBQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTs7Ozs7Ozs7Ozs7Ozs7QUN2RkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxXQUFBOztJQUVBLFFBQUEsVUFBQSxDQUFBLFlBQUE7SUFDQSxTQUFBLFNBQUEsVUFBQSxlQUFBO01BQ0EsSUFBQSxpQkFBQTs7TUFFQSxPQUFBO1FBQ0EsVUFBQTtRQUNBLE1BQUE7Ozs7O01BS0EsU0FBQSxLQUFBLE9BQUEsU0FBQTs7O1FBR0EsR0FBQSxDQUFBLEVBQUEsR0FBQSxVQUFBOztRQUVBLFFBQUEsU0FBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7VUFDQSxzQkFBQTtVQUNBLHNCQUFBO1VBQ0Esc0JBQUE7Ozs7OztNQU1BLFNBQUEsaUJBQUEsZUFBQTtRQUNBLElBQUEsT0FBQSxNQUFBO1FBQ0EsSUFBQSxPQUFBLFFBQUEsU0FBQSxjQUFBOztRQUVBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsT0FBQTs7UUFFQSxLQUFBLEtBQUEsTUFBQSxFQUFBLE1BQUEsU0FBQTs7UUFFQSxHQUFBLE1BQUE7VUFDQSxTQUFBLFdBQUE7WUFDQSxjQUFBLGtCQUFBLFFBQUEsT0FBQTs7Ozs7TUFLQSxTQUFBLGlCQUFBLE9BQUE7UUFDQSxJQUFBLE9BQUEsTUFBQTtRQUNBLElBQUEsT0FBQSxRQUFBLFNBQUEsY0FBQTs7UUFFQSxHQUFBLE1BQUE7O1VBRUEsSUFBQSxXQUFBLEtBQUE7Y0FDQSxXQUFBLEtBQUE7O1VBRUEsR0FBQSxRQUFBO1lBQ0EsSUFBQSxVQUFBLEVBQUEsSUFBQTs7WUFFQSxFQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUEsT0FBQTtlQUNBLEVBQUEsSUFBQSxPQUFBLFNBQUE7Ozs7Ozs7Ozs7O0FDM0VBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsYUFBQTs7SUFFQSxVQUFBLFVBQUEsQ0FBQSxZQUFBLFlBQUE7SUFDQSxTQUFBLFdBQUEsVUFBQSxVQUFBLElBQUE7O1FBRUEsSUFBQSxZQUFBO1lBQ0EsVUFBQTtZQUNBO2NBQ0E7a0JBQ0E7dUJBQ0E7Y0FDQTs7WUFFQSxNQUFBOztRQUVBLE9BQUE7Ozs7UUFJQSxTQUFBLEtBQUEsT0FBQSxJQUFBOztVQUVBLE1BQUEsY0FBQTs7VUFFQSxJQUFBLFdBQUE7Y0FDQTs7O1VBR0EsUUFBQSxRQUFBLFFBQUEsSUFBQSxZQUFBOztVQUVBLEdBQUEsU0FBQTs7VUFFQSxXQUFBLEtBQUE7O1VBRUEsVUFBQSxTQUFBOzs7O1VBSUEsU0FBQSxlQUFBOztZQUVBLElBQUEsWUFBQSxNQUFBO1lBQ0EsVUFBQSxXQUFBLFFBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxLQUFBLFlBQUE7O1lBRUEsTUFBQSxjQUFBLFNBQUEsU0FBQTs7WUFFQSxVQUFBLFNBQUEsY0FBQTs7O1VBR0EsU0FBQSxhQUFBOztZQUVBLFNBQUEsT0FBQTs7WUFFQSxNQUFBLGNBQUE7O1lBRUEsU0FBQSxVQUFBOztjQUVBLFNBQUEsU0FBQSxJQUFBOztjQUVBLFFBQUEsUUFBQSxRQUFBLElBQUEsWUFBQTtlQUNBOzs7VUFHQSxTQUFBLFdBQUE7WUFDQSxJQUFBLFdBQUEsR0FBQTtZQUNBLElBQUEsY0FBQTs7O1lBR0EsSUFBQSxNQUFBLE1BQUEsSUFBQSxzQkFBQSxZQUFBO2NBQ0E7OztjQUdBLEtBQUEsZ0JBQUEsR0FBQTs7Z0JBRUEsU0FBQSxVQUFBO2tCQUNBLFNBQUE7bUJBQ0E7O2dCQUVBOzs7OztZQUtBLE9BQUEsU0FBQTs7Ozs7Ozs7Ozs7O0FDakZBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFNBQUEsZ0JBQUE7OztJQUdBLHFCQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEscUJBQUEsY0FBQTs7O01BR0EsT0FBQTs7UUFFQSxVQUFBO1FBQ0EsWUFBQTs7UUFFQSxNQUFBLFdBQUE7VUFDQSxPQUFBO1lBQ0EsVUFBQTtZQUNBLFlBQUE7Ozs7Ozs7TUFPQSxTQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsZUFBQTs7Ozs7TUFLQSxTQUFBLGFBQUE7UUFDQSxJQUFBLFFBQUE7UUFD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QUNBLEtBQUEsVUFBQTtRQUNBLFNBQUE7UUFDQSxNQUFBO1FBQ0EsVUFBQTtRQUNBLE9BQUE7UUFDQSxRQUFBOzs7TUFHQSxTQUFBLFNBQUEsUUFBQTtRQUNBLEtBQUEsT0FBQTtVQUNBLFVBQUE7VUFDQSxhQUFBO1VBQ0EsVUFBQTtVQUNBLFFBQUE7VUFDQSxRQUFBO1VBQ0EsU0FBQSxJQUFBOztRQUVBLEtBQUEsY0FBQTtRQUNBLEtBQUEsT0FBQTs7O01BR0EsU0FBQSxXQUFBLEtBQUE7UUFDQSxPQUFBLElBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxDQUFBLE9BQUEsUUFBQSxPQUFBO1NBQ0EsU0FBQSxLQUFBLFVBQUEsTUFBQTtVQUNBLE9BQUE7Ozs7TUFJQSxTQUFBLFlBQUE7UUFDQSxHQUFBLEtBQUEsZUFBQSxLQUFBLHVCQUFBLEtBQUE7VUFDQSxJQUFBLFNBQUE7VUFDQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO1lBQ0EsR0FBQSxFQUFBLElBQUEsWUFBQSxLQUFBLFlBQUEsUUFBQTtjQUNBLEVBQUE7Y0FDQSxTQUFBOzs7VUFHQSxHQUFBLENBQUEsUUFBQTtZQUNBLFNBQUE7Y0FDQSxLQUFBLEtBQUE7Y0FDQSxLQUFBOztZQUVBLEtBQUEsS0FBQSxTQUFBLEtBQUE7OztRQUdBLEtBQUEsY0FBQTs7O01BR0EsU0FBQSxjQUFBLFFBQUEsT0FBQTtRQUNBLE9BQUE7UUFDQSxHQUFBLE9BQUEsUUFBQSxHQUFBO1VBQ0EsS0FBQSxLQUFBLFNBQUEsT0FBQSxPQUFBOzs7O01BSUEsU0FBQSxjQUFBO1FBQ0EsS0FBQSxLQUFBLGNBQUE7UUFDQSxLQUFBLEtBQUEsV0FBQTtRQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLFFBQUE7VUFDQSxLQUFBLEtBQUEsWUFBQSxPQUFBO1VBQ0EsS0FBQSxLQUFBLGVBQUEsT0FBQSxJQUFBLE9BQUEsSUFBQTs7UUFFQSxPQUFBLEtBQUEsS0FBQTs7O01BR0EsU0FBQSxZQUFBO1FBQ0EsS0FBQSxLQUFBLFVBQUEsQ0FBQSxNQUFBO1FBQ0EsR0FBQSxLQUFBLEtBQUEsUUFBQTtVQUNBLEtBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQSxLQUFBLGlCQUFBLEtBQUEsS0FBQSxhQUFBLElBQUEsS0FBQSxLQUFBLE9BQUEsVUFBQTtVQUNBLEdBQUEsV0FBQSxLQUFBLFNBQUEsZ0JBQUE7WUFDQSxLQUFBLEtBQUEsbUJBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxPQUFBLE1BQUEsV0FBQSxLQUFBLFNBQUE7O2VBRUE7VUFDQSxLQUFBLEtBQUEsaUJBQUE7O1FBRUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLFlBQUEsS0FBQSxLQUFBO1FBQ0EsR0FBQSxLQUFBLEtBQUEsUUFBQTtVQUNBLEdBQUEsV0FBQSxLQUFBLFNBQUEsZ0JBQUE7WUFDQSxHQUFBLEtBQUEsS0FBQSxtQkFBQSxLQUFBLEtBQUEsS0FBQTtjQUNBLEtBQUEsS0FBQSxtQkFBQSxLQUFBLEtBQUE7O1lBRUEsS0FBQSxLQUFBLE9BQUEsS0FBQSxLQUFBOztVQUVBLEdBQUEsS0FBQSxLQUFBLE9BQUEsV0FBQSxLQUFBLEtBQUEsS0FBQTtZQUNBLEtBQUEsS0FBQSxRQUFBLE9BQUE7Ozs7UUFJQTs7UUFFQSxTQUFBLEtBQUE7VUFDQSxVQUFBO1VBQ0EsWUFBQTs7OztNQUlBLFNBQUEsa0JBQUE7UUFDQSxLQUFBLEtBQUEsUUFBQSxTQUFBLEtBQUEsS0FBQTtRQUNBLEdBQUEsS0FBQSxLQUFBLFFBQUEsU0FBQSxRQUFBO1VBQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUEsSUFBQSxXQUFBLEtBQUEsU0FBQTtVQUNBLEtBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQSxLQUFBLFFBQUE7VUFDQTtlQUNBLEdBQUEsS0FBQSxLQUFBLFFBQUEsU0FBQSxXQUFBO1VBQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQSxFQUFBLEtBQUEsS0FBQTtlQUNBO1VBQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUE7Ozs7TUFJQSxTQUFBLGNBQUE7UUFDQSxHQUFBLEtBQUEsS0FBQSxRQUFBLFNBQUEsUUFBQTtVQUNBLEtBQUEsT0FBQSxLQUFBLFFBQUE7VUFDQSxLQUFBLEtBQUEsT0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLEtBQUEsUUFBQTtVQUNBLEtBQUEsS0FBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLFNBQUEsS0FBQSxLQUFBOzs7O01BSUEsU0FBQSxNQUFBO1FBQ0EsS0FBQSxLQUFBLFNBQUE7UUFDQSxPQUFBLEtBQUEsS0FBQTtRQUNBLE9BQUEsS0FBQSxPQUFBLEtBQUEsTUFBQTs7OztJQUlBLGNBQUEsVUFBQSxDQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsU0FBQSxjQUFBLE1BQUEsS0FBQSxVQUFBLFlBQUE7TUFDQSxJQUFBLE9BQUE7O01BRUEsS0FBQSxhQUFBO01BQ0EsS0FBQSxXQUFBO01BQ0EsS0FBQSxXQUFBO01BQ0EsS0FBQSxRQUFBOztNQUVBLFNBQUEsV0FBQSxNQUFBO1FBQ0EsS0FBQSxPQUFBO1FBQ0EsS0FBQSxXQUFBO1VBQ0EsVUFBQTtVQUNBLGFBQUE7VUFDQSxVQUFBO1VBQ0EsUUFBQTtVQUNBLFNBQUEsSUFBQTs7OztNQUlBLFNBQUEsUUFBQTtRQUNBLEtBQUEsU0FBQSxjQUFBO1FBQ0EsS0FBQSxTQUFBLFdBQUE7UUFDQSxLQUFBLFNBQUEsU0FBQSxRQUFBLFVBQUEsUUFBQTtVQUNBLEtBQUEsU0FBQSxlQUFBLE9BQUEsSUFBQSxPQUFBLElBQUE7VUFDQSxLQUFBLFNBQUEsWUFBQSxPQUFBOzs7UUFHQSxLQUFBLFNBQUEsaUJBQUE7UUFDQSxHQUFBLEtBQUEsS0FBQSxRQUFBO1VBQ0EsS0FBQSxTQUFBLGlCQUFBLEtBQUEsU0FBQSxhQUFBLElBQUEsS0FBQSxLQUFBLE9BQUEsVUFBQTtRQUNBLEtBQUEsU0FBQSxNQUFBLEtBQUEsU0FBQSxjQUFBLEtBQUEsU0FBQTtRQUNBLEtBQUEsU0FBQSxRQUFBLFNBQUEsS0FBQSxTQUFBO1FBQ0EsR0FBQSxLQUFBLFNBQUEsUUFBQSxTQUFBLFFBQUE7VUFDQSxLQUFBLFNBQUEsUUFBQSxTQUFBLEtBQUEsU0FBQSxJQUFBLFdBQUEsS0FBQSxTQUFBO1VBQ0EsS0FBQSxTQUFBLFFBQUEsVUFBQSxLQUFBLFNBQUEsUUFBQTs7OztNQUlBLFNBQUEsU0FBQSxRQUFBO1FBQ0EsS0FBQSxTQUFBLFVBQUEsQ0FBQSxNQUFBLEtBQUEsS0FBQSxRQUFBOztRQUVBLElBQUEsV0FBQSxLQUFBLEtBQUE7UUFDQSxHQUFBLFFBQUEsV0FBQSxDQUFBOztRQUVBLEtBQUEsU0FBQSxXQUFBO1FBQ0EsU0FBQSxRQUFBLFVBQUEsUUFBQTtVQUNBLElBQUEsS0FBQTtZQUNBLEtBQUEsT0FBQTtZQUNBLEtBQUEsT0FBQSxNQUFBLE9BQUE7O1VBRUEsR0FBQSxFQUFBLE1BQUEsR0FBQSxLQUFBLFNBQUEsU0FBQSxLQUFBOzs7UUFHQTs7UUFFQSxPQUFBLFNBQUEsS0FBQTtVQUNBLFVBQUE7VUFDQSxZQUFBO1dBQ0E7OztNQUdBLFNBQUEsV0FBQTtRQUNBLEtBQUEsU0FBQSxTQUFBO1FBQ0EsT0FBQSxLQUFBLFFBQUEsT0FBQSxDQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxVQUFBOzs7OztBQ25OQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtPQUNBLE9BQUE7T0FDQSxXQUFBLGtCQUFBO09BQ0EsV0FBQSw0QkFBQTtPQUNBLFdBQUEsbUJBQUE7T0FDQSxXQUFBLGtCQUFBO09BQ0EsV0FBQSxrQ0FBQTs7O0lBR0EsZUFBQSxVQUFBLENBQUEsVUFBQSxlQUFBO0lBQ0EsU0FBQSxlQUFBLFFBQUEsYUFBQSxTQUFBO01BQ0EsSUFBQSxLQUFBOztNQUVBOztNQUVBLFNBQUEsV0FBQTtRQUNBLE9BQUEsY0FBQTtRQUNBLEdBQUEsQ0FBQSxZQUFBLE1BQUE7VUFDQSxZQUFBOzs7OztRQUtBLEdBQUEsV0FBQSxRQUFBLEtBQUEsQ0FBQSxPQUFBO1VBQ0EsT0FBQSxDQUFBLFlBQUEsT0FBQSxLQUFBO1VBQ0EsU0FBQSxDQUFBLENBQUEsUUFBQTtVQUNBLE9BQUE7VUFDQSxPQUFBOzs7UUFHQSxHQUFBLGNBQUE7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QUFBLG1CQUFBO01BQ0EsSUFBQSxNQUFBO1FBQ0EsUUFBQTs7TUFFQSxPQUFBLFVBQUEsS0FBQTtRQUNBLE9BQUEsSUFBQTs7OztBQzdCQSxDQUFBLFlBQUE7RUFDQTs7RUFFQTtPQUNBLE9BQUE7T0FDQSxXQUFBLHFCQUFBOztFQUVBLGtCQUFBLFVBQUEsQ0FBQSxVQUFBLGNBQUEsWUFBQSxRQUFBLFVBQUE7RUFDQSxTQUFBLGtCQUFBLFFBQUEsWUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBO0lBQ0EsSUFBQSxLQUFBO0lBQ0EsR0FBQSxXQUFBO01BQ0EsUUFBQTtRQUNBLFlBQUE7UUFDQSxXQUFBO1FBQ0EsV0FBQTtRQUNBLFFBQUE7UUFDQSxVQUFBO1FBQ0EsUUFBQTs7TUFFQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBOztNQUVBLE1BQUE7UUFDQSxNQUFBOztNQUVBLFFBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTs7TUFFQSxTQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBOztNQUVBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTs7TUFFQSxXQUFBO1FBQ0EsUUFBQTtRQUNBLE1BQUE7UUFDQSxPQUFBO1FBQ0EsY0FBQTs7TUFFQSxRQUFBO1FBQ0EsUUFBQTtRQUNBLFFBQUE7UUFDQSxTQUFBOztNQUVBLFFBQUE7UUFDQSxRQUFBO1FBQ0EsU0FBQTtRQUNBLFFBQUE7UUFDQSxRQUFBOztNQUVBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTs7TUFFQSxPQUFBO1FBQ0EsT0FBQTs7TUFFQSxRQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7UUFDQSxRQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7O01BRUEsUUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsUUFBQTs7TUFFQSxNQUFBO1FBQ0EsTUFBQTs7TUFFQSxNQUFBO1FBQ0EsTUFBQTs7OztJQUlBOztJQUVBLFNBQUEsV0FBQTtNQUNBLEdBQUEsT0FBQSxTQUFBLHNCQUFBLENBQUEsSUFBQSxPQUFBLEtBQUEsWUFBQSxTQUFBOzs7SUFHQSxHQUFBLFNBQUEsVUFBQSxRQUFBO01BQ0EsSUFBQSxRQUFBO01BQ0EsSUFBQSxPQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsUUFBQTtRQUNBLE9BQUEsT0FBQSxLQUFBO1FBQ0EsUUFBQTs7TUFFQSxNQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxLQUFBLE1BQUEsTUFBQSxTQUFBLFFBQUEsUUFBQSxLQUFBO1FBQ0EsUUFBQSxJQUFBLFdBQUEsTUFBQTtTQUNBLFNBQUEsTUFBQSxLQUFBO1FBQ0EsUUFBQSxJQUFBLFNBQUEsTUFBQTs7OztJQUlBLEdBQUEsaUJBQUEsWUFBQTtNQUNBLElBQUEsU0FBQSxPQUFBLEtBQUEsU0FBQSxnQkFBQTtNQUNBLElBQUEsT0FBQSxPQUFBLFNBQUEsS0FBQSxPQUFBLE9BQUEsT0FBQSxNQUFBLENBQUEsT0FBQSxDQUFBO01BQ0EsT0FBQSxLQUFBLENBQUEsT0FBQSxLQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxNQUFBO01BQ0EsR0FBQSxDQUFBLE9BQUEsS0FBQSxTQUFBLGNBQUEsT0FBQSxLQUFBLFNBQUEsZUFBQTs7O0lBR0EsR0FBQSxzQkFBQSxZQUFBO01BQ0EsT0FBQSxLQUFBLFNBQUEsYUFBQSxRQUFBLFVBQUEsT0FBQTtRQUNBLE9BQUEsT0FBQTtVQUNBLE9BQUEsQ0FBQSxXQUFBLE9BQUEsS0FBQSxTQUFBLElBQUEsWUFBQSxDQUFBLEtBQUEsTUFBQSxPQUFBLEtBQUEsTUFBQTtXQUNBO1VBQ0EsVUFBQSxNQUFBLFVBQUEsT0FBQSxNQUFBO1dBQ0EsU0FBQSxPQUFBLFFBQUEsS0FBQTtVQUNBLFFBQUEsSUFBQSxXQUFBLE1BQUE7V0FDQSxTQUFBLE1BQUEsS0FBQTtVQUNBLFFBQUEsSUFBQSxTQUFBLE1BQUE7Ozs7O0lBS0EsR0FBQSxhQUFBLFlBQUE7TUFDQSxHQUFBO01BQ0EsU0FBQSxXQUFBO1FBQ0EsSUFBQSxHQUFBLEtBQUE7UUFDQSxPQUFBLEdBQUEsS0FBQTtRQUNBLFdBQUEsR0FBQSxLQUFBO1FBQ0EsVUFBQSxPQUFBLEtBQUEsU0FBQTtTQUNBLFVBQUEsUUFBQTtRQUNBLFFBQUEsSUFBQSxXQUFBLE1BQUE7U0FDQSxVQUFBLFFBQUE7UUFDQSxRQUFBLElBQUEsU0FBQSxNQUFBOzs7OztBQ3ZJQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxJQUFBOztJQUVBLFlBQUEsVUFBQSxDQUFBLGNBQUE7O0lBRUEsU0FBQSxZQUFBLFlBQUEsY0FBQTs7OztNQUlBLFdBQUEsTUFBQTtRQUNBLE1BQUE7UUFDQSxhQUFBO1FBQ0EsT0FBQSxDQUFBLElBQUEsUUFBQTtRQUNBLFFBQUE7VUFDQSxTQUFBO1VBQ0EsYUFBQTtVQUNBLFNBQUE7VUFDQSxPQUFBO1VBQ0EsWUFBQTtVQUNBLFNBQUE7VUFDQSxZQUFBO1VBQ0EsT0FBQTs7UUFFQSxlQUFBO1FBQ0EsY0FBQTtRQUNBLGdCQUFBO1FBQ0EsY0FBQTtRQUNBLGVBQUE7Ozs7TUFJQSxXQUFBLElBQUEsT0FBQSxlQUFBLFdBQUEsYUFBQSxXQUFBOzs7TUFHQSxJQUFBLFFBQUEsVUFBQSxjQUFBO1FBQ0EsV0FBQSxJQUFBLFNBQUEsY0FBQTs7UUFFQSxjQUFBLFNBQUEsV0FBQSxJQUFBOztNQUVBLFdBQUEsT0FBQSxjQUFBLFlBQUE7UUFDQSxjQUFBLFNBQUEsV0FBQSxJQUFBO1NBQ0E7OztNQUdBLFdBQUEsT0FBQSwwQkFBQSxTQUFBLFVBQUE7UUFDQSxJQUFBLGFBQUE7VUFDQSxXQUFBLFdBQUE7Ozs7Ozs7Ozs7OztBQzdDQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHFCQUFBOztJQUVBLGtCQUFBLFVBQUEsQ0FBQSxjQUFBLFVBQUEsVUFBQSxpQkFBQTtJQUNBLFNBQUEsa0JBQUEsWUFBQSxRQUFBLFFBQUEsZ0JBQUEsT0FBQTs7UUFFQTs7OztRQUlBLFNBQUEsV0FBQTtVQUNBLElBQUEsZUFBQTs7O1VBR0EsV0FBQSxPQUFBLHlCQUFBLFNBQUEsUUFBQSxPQUFBO1lBQ0EsS0FBQSxXQUFBLFNBQUEsV0FBQSxNQUFBO2NBQ0EsWUFBQSxDQUFBOzs7Ozs7OztVQVFBLGNBQUEsUUFBQTs7VUFFQSxTQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7Ozs7O1VBTUEsT0FBQSx5QkFBQSxTQUFBLE1BQUE7WUFDQSxPQUFBLENBQUEsS0FBQSxVQUFBLGdCQUFBO29CQUNBLFNBQUEsUUFBQSxZQUFBOzs7VUFHQSxPQUFBLGNBQUEsU0FBQSxRQUFBLE1BQUE7WUFDQSxhQUFBLFVBQUEsV0FBQSxJQUFBLE9BQUEsYUFBQSxPQUFBLENBQUEsU0FBQTs7O1VBR0EsT0FBQSxhQUFBLFNBQUEsUUFBQTtZQUNBLFFBQUEsYUFBQTs7O1VBR0EsT0FBQSxpQkFBQSxTQUFBLFFBQUEsY0FBQTs7O1lBR0EsSUFBQSxNQUFBLHdCQUFBLFdBQUEsSUFBQSxPQUFBLGFBQUEsT0FBQTs7O1lBR0EsSUFBQSxRQUFBLFdBQUEsYUFBQSxZQUFBO2NBQ0EsS0FBQSxFQUFBLE9BQUEscUJBQUE7Z0JBQ0EsYUFBQSxVQUFBLENBQUEsYUFBQTtnQkFDQSxZQUFBOzs7aUJBR0EsS0FBQSxlQUFBO2NBQ0EsWUFBQSxDQUFBOzs7WUFHQSxPQUFBLHFCQUFBLFFBQUE7O1lBRUEsT0FBQTs7Ozs7Ozs7WUFRQSxTQUFBLFNBQUEsTUFBQTs7Y0FFQSxHQUFBLENBQUEsTUFBQTs7Y0FFQSxJQUFBLENBQUEsS0FBQSxRQUFBLEtBQUEsU0FBQSxLQUFBO2dCQUNBLElBQUEsY0FBQTtnQkFDQSxRQUFBLFFBQUEsS0FBQSxTQUFBLFNBQUEsT0FBQTtrQkFDQSxHQUFBLFNBQUEsUUFBQSxjQUFBOztnQkFFQSxPQUFBOzs7Z0JBR0EsT0FBQSxPQUFBLEdBQUEsS0FBQSxTQUFBLE9BQUEsU0FBQSxLQUFBOzs7WUFHQSxTQUFBLFlBQUEsT0FBQTtjQUNBLFNBQUE7Y0FDQSxJQUFBLElBQUEsS0FBQSxjQUFBO2dCQUNBLEdBQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxLQUFBO2tCQUNBLGFBQUEsS0FBQTs7OztZQUlBLFNBQUEsUUFBQSxRQUFBOztjQUVBLE9BQUEsQ0FBQSxPQUFBLFdBQUEsYUFBQSxFQUFBLE9BQUEsUUFBQSxPQUFBOzs7Ozs7Ozs7Ozs7O0FDckdBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsV0FBQTs7SUFFQSxRQUFBLFVBQUEsQ0FBQSxjQUFBLFlBQUEsV0FBQTtJQUNBLFNBQUEsU0FBQSxZQUFBLFVBQUEsU0FBQSxPQUFBO1FBQ0EsSUFBQSxPQUFBLFFBQUEsUUFBQTtRQUNBLElBQUEsWUFBQTs7OztZQUlBLE1BQUE7WUFDQSxVQUFBO1lBQ0EsVUFBQTtZQUNBLFlBQUE7WUFDQSxTQUFBOzs7UUFHQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTs7VUFFQSxJQUFBLGVBQUEsV0FBQSxPQUFBLFFBQUE7VUFDQSxJQUFBLFdBQUE7O1VBRUEsSUFBQSxZQUFBLE1BQUEsWUFBQSxVQUFBO1VBQ0EsSUFBQSxTQUFBOztVQUVBLFNBQUEsSUFBQSxXQUFBLGFBQUEsV0FBQTs7WUFFQSxJQUFBLE1BQUEsd0JBQUEsV0FBQSxJQUFBLE9BQUEsYUFBQTs7Y0FFQSxPQUFBLFFBQUE7Y0FDQSxTQUFBLGdCQUFBLEVBQUEsT0FBQTs7O2NBR0E7Ozs7OztVQU1BLE1BQUEsSUFBQSxvQkFBQSxXQUFBO1lBQ0E7Ozs7VUFJQSxLQUFBLEdBQUEsVUFBQSxXQUFBO1lBQ0EsSUFBQSxFQUFBLE1BQUE7V0FDQTs7OztVQUlBLFdBQUEsSUFBQSxxQkFBQSxTQUFBLE9BQUEsU0FBQTtZQUNBLGVBQUEsUUFBQTs7WUFFQTs7WUFFQSxXQUFBLFdBQUE7Ozs7VUFJQSxLQUFBLFFBQUEsVUFBQSxNQUFBLHdCQUFBOztZQUVBLElBQUEsVUFBQSxFQUFBO1lBQ0EsSUFBQSxlQUFBOztZQUVBLFdBQUEsT0FBQSxvQkFBQTs7Ozs7O1VBTUEsU0FBQSxvQkFBQSxRQUFBOztZQUVBLEtBQUEsV0FBQSxPQUFBO2NBQ0EsU0FBQSxVQUFBO2dCQUNBLFFBQUEsR0FBQSxjQUFBLFNBQUEsRUFBQTs7a0JBRUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxRQUFBLFFBQUEsVUFBQSxTQUFBO29CQUNBOzs7OztpQkFLQTs7Y0FFQSxRQUFBLElBQUE7Ozs7VUFJQSxTQUFBLGlCQUFBO1lBQ0EsV0FBQSxJQUFBLGVBQUE7WUFDQSxHQUFBLENBQUEsTUFBQSxTQUFBLE1BQUE7Ozs7OztRQU1BLFNBQUEscUJBQUE7VUFDQSxJQUFBLFlBQUEsRUFBQSxVQUFBLEVBQUEsU0FBQTtVQUNBLFVBQUEsWUFBQSxnQkFBQSxHQUFBLG9CQUFBLFlBQUE7WUFDQTs7Ozs7O1FBTUEsU0FBQSxnQkFBQSxTQUFBO1VBQ0E7YUFDQSxTQUFBO2FBQ0EsWUFBQTthQUNBO2FBQ0EsWUFBQTs7Ozs7UUFLQSxTQUFBLGVBQUEsV0FBQSxVQUFBOztVQUVBOztVQUVBLElBQUEsS0FBQSxVQUFBLFNBQUE7O1VBRUEsSUFBQSxDQUFBLEdBQUEsU0FBQSxPQUFBO1VBQ0EsSUFBQSxVQUFBLFNBQUEsVUFBQTtZQUNBLGdCQUFBO1lBQ0EsT0FBQTs7O1VBR0EsSUFBQSxTQUFBLEVBQUE7VUFDQSxJQUFBLGNBQUEsRUFBQTs7VUFFQSxJQUFBLE1BQUEsVUFBQSxZQUFBLElBQUEsZ0JBQUEsS0FBQSxVQUFBLE9BQUEsSUFBQSxnQkFBQTtVQUNBLElBQUEsU0FBQSxHQUFBLFFBQUEsVUFBQTs7VUFFQSxnQkFBQTs7VUFFQSxJQUFBLFVBQUEsQ0FBQSxVQUFBLFdBQUEsTUFBQSxPQUFBLFNBQUE7VUFDQSxJQUFBLFdBQUEsS0FBQTs7VUFFQTthQUNBLFNBQUE7YUFDQSxJQUFBO2NBQ0EsVUFBQSxXQUFBLElBQUEsT0FBQSxVQUFBLFVBQUE7Y0FDQSxVQUFBO2NBQ0EsVUFBQSxDQUFBLE9BQUEsWUFBQSxRQUFBLFVBQUEsWUFBQSxJQUFBOzs7VUFHQSxPQUFBLEdBQUEsY0FBQSxXQUFBO1lBQ0EsZ0JBQUE7WUFDQSxPQUFBOzs7VUFHQSxPQUFBOzs7UUFHQSxTQUFBLG9CQUFBO1VBQ0EsRUFBQSxzQkFBQTtVQUNBLEVBQUEsZ0NBQUE7VUFDQSxFQUFBLG9CQUFBLFlBQUE7Ozs7Ozs7O0FD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QUVBLFdBQUEsSUFBQTs7VUFFQSxXQUFBLFNBQUEsV0FBQSxXQUFBLFNBQUEsVUFBQTs7VUFFQSxXQUFBLFNBQUEsYUFBQSxFQUFBLFdBQUEsU0FBQTs7OztNQUlBLFdBQUEsU0FBQTs7Ozs7Ozs7O0FDbENBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsa0JBQUE7O0lBRUEsZUFBQSxVQUFBLENBQUE7SUFDQSxTQUFBLGdCQUFBLFVBQUE7UUFDQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTtVQUNBLE1BQUEsT0FBQSxZQUFBO1lBQ0EsT0FBQSxNQUFBLE1BQUEsTUFBQSxnQkFBQTthQUNBLFVBQUEsVUFBQTtZQUNBLFNBQUEsUUFBQSxDQUFBLENBQUEsVUFBQTs7Ozs7Ozs7Ozs7O0FDbkJBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsV0FBQTs7SUFFQSxRQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEsUUFBQSxTQUFBO01BQ0EsT0FBQSxRQUFBOzs7Ozs7Ozs7O0FDVEEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxZQUFBOztJQUVBLFNBQUEsVUFBQSxDQUFBLFVBQUE7SUFDQSxTQUFBLFVBQUEsUUFBQSxlQUFBO1FBQ0EsSUFBQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7WUFDQSxPQUFBO2NBQ0EsVUFBQTs7O1FBR0EsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBO1VBQ0EsUUFBQSxHQUFBLFNBQUEsVUFBQSxHQUFBO2NBQ0EsRUFBQTs7Y0FFQSxHQUFBLE1BQUEsVUFBQTtnQkFDQSxPQUFBLGNBQUEsTUFBQTtnQkFDQSxPQUFBLEdBQUEsT0FBQSxTQUFBLElBQUEsQ0FBQSxRQUFBOzttQkFFQTtnQkFDQSxFQUFBLE1BQUE7Ozs7Ozs7Ozs7Ozs7QUMzQkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxZQUFBO1NBQ0EsVUFBQSxTQUFBOztJQUVBLFNBQUEsVUFBQSxDQUFBO0lBQ0EsU0FBQSxTQUFBLFNBQUE7TUFDQSxPQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUE7UUFDQSxNQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUEsbUJBQUE7VUFDQSxrQkFBQSxTQUFBLEtBQUEsU0FBQSxNQUFBOztZQUVBLE9BQUEsS0FBQTs7O1VBR0Esa0JBQUEsWUFBQSxLQUFBLFNBQUEsTUFBQTs7WUFFQSxPQUFBLEtBQUE7Ozs7OztJQU1BLE1BQUEsVUFBQSxDQUFBO0lBQ0EsU0FBQSxNQUFBLFNBQUE7TUFDQSxPQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUE7UUFDQSxNQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUEsbUJBQUE7VUFDQSxrQkFBQSxTQUFBLEtBQUEsU0FBQSxNQUFBOztZQUVBLE9BQUEsS0FBQTs7O1VBR0Esa0JBQUEsWUFBQSxLQUFBLFNBQUEsTUFBQTs7WUFFQSxPQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7QUN4Q0EsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxvQkFBQTs7SUFFQSxpQkFBQSxVQUFBLENBQUE7SUFDQSxTQUFBLGtCQUFBLFNBQUE7UUFDQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUE7O1VBRUEsSUFBQSxRQUFBLE9BQUE7WUFDQSxRQUFBLFNBQUE7O2VBRUE7WUFDQSxRQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUE7Z0JBQ0EsRUFBQTs7Z0JBRUEsSUFBQSxXQUFBLFNBQUE7O2tCQUVBLFdBQUE7OztrQkFHQSxHQUFBLFdBQUE7b0JBQ0EsRUFBQSxNQUFBLFNBQUEsTUFBQSxZQUFBLGFBQUEsU0FBQTs7b0JBRUEsRUFBQSxNQUFBLFNBQUEsTUFBQSxZQUFBLGVBQUEsU0FBQTs7dUJBRUE7a0JBQ0EsRUFBQSxNQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkNBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsV0FBQTs7SUFFQSxTQUFBLFdBQUE7UUFDQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTtVQUNBLFFBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQTtjQUNBLEdBQUEsUUFBQSxHQUFBLE1BQUEsRUFBQTtjQUNBLElBQUEsTUFBQSxNQUFBO2tCQUNBOztjQUVBLEdBQUEsS0FBQTtnQkFDQSxPQUFBLFdBQUE7Z0JBQ0EsS0FBQSxDQUFBLE9BQUE7a0JBQ0EsRUFBQSxNQUFBOzs7bUJBR0E7Z0JBQ0EsRUFBQSxNQUFBOzs7Ozs7UUFNQSxTQUFBLFdBQUEsS0FBQTtVQUNBLElBQUEsU0FBQTtjQUNBLFVBQUEsRUFBQSxJQUFBLFFBQUEsS0FBQSxNQUFBLFNBQUE7O1VBRUEsRUFBQSxRQUFBLE9BQUEsRUFBQSxXQUFBLEtBQUE7WUFDQSxRQUFBO1lBQ0EsUUFBQTtZQUNBLFFBQUE7OztVQUdBLElBQUEsUUFBQSxTQUFBO1lBQ0EsUUFBQTs7O1VBR0EsT0FBQSxFQUFBLElBQUE7Ozs7Ozs7Ozs7O0FDL0NBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsT0FBQTs7SUFFQSxJQUFBLFVBQUEsQ0FBQSxjQUFBO0lBQ0EsU0FBQSxLQUFBLFlBQUEsV0FBQTtRQUNBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBOztRQUVBLE9BQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsU0FBQSxPQUFBO1VBQ0EsSUFBQSxTQUFBLE1BQUE7O1VBRUEsU0FBQSxhQUFBO1lBQ0EsSUFBQSxLQUFBLFdBQUEsSUFBQSxRQUFBO1lBQ0EsUUFBQSxLQUFBOzs7VUFHQTtVQUNBLElBQUEsa0JBQUEsVUFBQSxZQUFBOztVQUVBLE1BQUEsSUFBQSxZQUFBLFVBQUE7WUFDQSxVQUFBLE9BQUE7Ozs7Ozs7Ozs7OztBQzVCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFB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Y0FBQSxLQUFBLFNBQUE7Z0JBQ0EsT0FBQTtxQkFDQTtnQkFDQSxPQUFBOzs7O1VBSUEsZUFBQSxNQUFBLEtBQUEsV0FBQSxRQUFBLFVBQUE7O1VBRUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxNQUFBLFNBQUE7OztVQUdBLG9CQUFBLFlBQUE7WUFDQSxPQUFBLE1BQUEsU0FBQTs7O1VBR0Esa0JBQUEsWUFBQTtZQUNBLE9BQUEsTUFBQSxTQUFBOzs7VUFHQSxVQUFBLFlBQUE7WUFDQSxPQUFBLEtBQUEsVUFBQSxlQUFBOzs7Ozs7O0FDbkhBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQSxVQUFBOztZQUVBOztZQUVBO1lBQ0E7Ozs7Ozs7OztBQ0pBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsY0FBQTs7SUFFQSxXQUFBLFVBQUEsQ0FBQTtJQUNBLFNBQUEsV0FBQSxNQUFBOzs7O1FBSUE7Ozs7UUFJQSxTQUFBLFdBQUE7VUFDQSxLQUFBLElBQUE7Ozs7QUFJQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcclxuICogXHJcbiAqIEFuZ2xlIC0gQm9vdHN0cmFwIEFkbWluIEFwcCArIEFuZ3VsYXJKU1xyXG4gKiBcclxuICogVmVyc2lvbjogMy4xLjBcclxuICogQXV0aG9yOiBAdGhlbWljb25fY29cclxuICogV2Vic2l0ZTogaHR0cDovL3RoZW1pY29uLmNvXHJcbiAqIExpY2Vuc2U6IGh0dHBzOi8vd3JhcGJvb3RzdHJhcC5jb20vaGVscC9saWNlbnNlc1xyXG4gKiBcclxuICovXHJcblxyXG4vLyBBUFAgU1RBUlRcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FuZ2xlJywgW1xyXG4gICAgICAgICAgICAnYXBwLmNvcmUnLFxyXG4gICAgICAgICAgICAnYXBwLnJvdXRlcycsXHJcbiAgICAgICAgICAgICdhcHAuc2lkZWJhcicsXHJcbiAgICAgICAgICAgICdhcHAucHJlbG9hZGVyJyxcclxuICAgICAgICAgICAgJ2FwcC5sb2FkaW5nYmFyJyxcclxuICAgICAgICAgICAgJ2FwcC50cmFuc2xhdGUnLFxyXG4gICAgICAgICAgICAnYXBwLnNldHRpbmdzJyxcclxuICAgICAgICAgICAgJ2FwcC5kYXNoYm9hcmQnLFxyXG4gICAgICAgICAgICAnYXBwLm5vdGlmeScsXHJcbiAgICAgICAgICAgICdhcHAuZWxlbWVudHMnLFxyXG4gICAgICAgICAgICAnYXBwLnBhbmVscycsXHJcbiAgICAgICAgICAgICdhcHAuY2hhcnRzJyxcclxuICAgICAgICAgICAgJ2FwcC5mb3JtcycsXHJcbiAgICAgICAgICAgICdhcHAubG9jYWxlJyxcclxuICAgICAgICAgICAgJ2FwcC5wYWdlcycsXHJcbiAgICAgICAgICAgICdhcHAudGFibGVzJyxcclxuICAgICAgICAgICAgJ2FwcC51dGlscycsXHJcbiAgICAgICAgICAgICdhcHAuaXRlbXMnLFxyXG4gICAgICAgICAgICAnYXBwLm15c2hvcCcsXHJcbiAgICAgICAgICAgICdhcHAuc2FsZXMnLFxyXG4gICAgICAgICAgICAnYXBwLm1lbWJlcnMnLFxyXG4gICAgICAgICAgICAnYXBwLmNvc3RzJ1xyXG4gICAgICAgIF0pO1xyXG59KSgpO1xyXG5cclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuY2hhcnRzJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbG9ycycsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb3JlJywgW1xyXG4gICAgICAgICAgICAnbmdSb3V0ZScsXHJcbiAgICAgICAgICAgICduZ0FuaW1hdGUnLFxyXG4gICAgICAgICAgICAnbmdTdG9yYWdlJyxcclxuICAgICAgICAgICAgJ25nQ29va2llcycsXHJcbiAgICAgICAgICAgICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJyxcclxuICAgICAgICAgICAgJ3VpLmJvb3RzdHJhcCcsXHJcbiAgICAgICAgICAgICd1aS5yb3V0ZXInLFxyXG4gICAgICAgICAgICAnb2MubGF6eUxvYWQnLFxyXG4gICAgICAgICAgICAnY2ZwLmxvYWRpbmdCYXInLFxyXG4gICAgICAgICAgICAnbmdTYW5pdGl6ZScsXHJcbiAgICAgICAgICAgICduZ1Jlc291cmNlJyxcclxuICAgICAgICAgICAgJ3RtaC5keW5hbWljTG9jYWxlJyxcclxuICAgICAgICAgICAgJ3VpLnV0aWxzJyxcclxuICAgICAgICAgICAgJ2xiU2VydmljZXMnXHJcbiAgICAgICAgXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvc3RzJywgW10pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5kYXNoYm9hcmQnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuZWxlbWVudHMnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuZm9ybXMnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLml0ZW1zJywgW10pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sYXp5bG9hZCcsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sb2FkaW5nYmFyJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmxvY2FsZScsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAubWVtYmVycycsIFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm15c2hvcCcsIFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubm90aWZ5JywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnBhZ2VzJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnBhbmVscycsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wcmVsb2FkZXInLCBbXSk7XHJcbn0pKCk7XHJcblxyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbXHJcbiAgICAgICAgICAgICdhcHAubGF6eWxvYWQnXHJcbiAgICAgICAgXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnNhbGVzJywgW10pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5zZXR0aW5ncycsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5zaWRlYmFyJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnRhYmxlcycsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50cmFuc2xhdGUnLCBbXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudXRpbHMnLCBbXHJcbiAgICAgICAgICAnYXBwLmNvbG9ycydcclxuICAgICAgICBdKTtcclxufSkoKTtcclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogY2hhcnQuanNcclxuICogV3JhcHBlciBkaXJlY3RpdmUgZm9yIGNoYXJ0SlMuIFxyXG4gKiBCYXNlZCBvbiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9BbmRyZWFzSGVpYmVyZy85ODM3ODY4XHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuY2hhcnRzJylcclxuICAgICAgICAvKiBBbGlhc2VzIGZvciB2YXJpb3VzIGNoYXJ0IHR5cGVzICovXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbGluZWNoYXJ0JywgICAgIGNoYXJ0SlMoJ0xpbmUnKSAgICAgIClcclxuICAgICAgICAuZGlyZWN0aXZlKCdiYXJjaGFydCcsICAgICAgY2hhcnRKUygnQmFyJykgICAgICAgKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3JhZGFyY2hhcnQnLCAgICBjaGFydEpTKCdSYWRhcicpICAgICApXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncG9sYXJjaGFydCcsICAgIGNoYXJ0SlMoJ1BvbGFyQXJlYScpIClcclxuICAgICAgICAuZGlyZWN0aXZlKCdwaWVjaGFydCcsICAgICAgY2hhcnRKUygnUGllJykgICAgICAgKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2RvdWdobnV0Y2hhcnQnLCBjaGFydEpTKCdEb3VnaG51dCcpICApXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZG9udXRjaGFydCcsICAgIGNoYXJ0SlMoJ0RvdWdobnV0JykgIClcclxuICAgICAgICA7XHJcblxyXG4gICAgZnVuY3Rpb24gY2hhcnRKUyh0eXBlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogJz0nLFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6ICc9JyxcclxuICAgICAgICAgICAgICAgICAgICBpZDogJ0AnLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnPScsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnPScsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzaXplOiAnPScsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6ICdAJyxcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogJ0AnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6ICc9JyxcclxuICAgICAgICAgICAgICAgICAgICB0b29sdGlwOiAnPScsXHJcbiAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiAnPSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdHggPSAkZWxlbVswXS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhdXRvc2l6ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS53aWR0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZWxlbS53aWR0aCgkZWxlbS5wYXJlbnQoKS53aWR0aCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5jYW52YXMud2lkdGggPSAkZWxlbS53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmNhbnZhcy53aWR0aCA9ICRzY29wZS53aWR0aCB8fCBjdHguY2FudmFzLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b3NpemUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUuaGVpZ2h0IDw9IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW0uaGVpZ2h0KCRlbGVtLnBhcmVudCgpLmhlaWdodCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5jYW52YXMuaGVpZ2h0ID0gY3R4LmNhbnZhcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguY2FudmFzLmhlaWdodCA9ICRzY29wZS5oZWlnaHQgfHwgY3R4LmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRvc2l6ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24gKG5ld1ZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjaGFydENyZWF0ZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydENyZWF0ZWQuZGVzdHJveSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgZGF0YSBub3QgZGVmaW5lZCwgZXhpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW5ld1ZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuY2hhcnQpIHsgdHlwZSA9ICRzY29wZS5jaGFydDsgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYXV0b3NpemUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNpemUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0ID0gbmV3IENoYXJ0KGN0eCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCRzY29wZS5yZXNwb25zaXZlIHx8ICRzY29wZS5yZXNpemUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3B0aW9ucy5yZXNwb25zaXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCRzY29wZS5yZXNwb25zaXZlICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3B0aW9ucy5yZXNwb25zaXZlID0gJHNjb3BlLnJlc3BvbnNpdmU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENyZWF0ZWQgPSBjaGFydFt0eXBlXSgkc2NvcGUuZGF0YSwgJHNjb3BlLm9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENyZWF0ZWQudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCRzY29wZS5sZWdlbmQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJGVsZW1bMF0pLnBhcmVudCgpLmFmdGVyKCBjaGFydENyZWF0ZWQuZ2VuZXJhdGVMZWdlbmQoKSApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCd0b29sdGlwJywgZnVuY3Rpb24gKG5ld1ZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDcmVhdGVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDcmVhdGVkLmRyYXcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobmV3VmFsPT09dW5kZWZpbmVkIHx8ICFjaGFydENyZWF0ZWQuc2VnbWVudHMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc0Zpbml0ZShuZXdWYWwpIHx8IG5ld1ZhbCA+PSBjaGFydENyZWF0ZWQuc2VnbWVudHMubGVuZ3RoIHx8IG5ld1ZhbCA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhY3RpdmVTZWdtZW50ID0gY2hhcnRDcmVhdGVkLnNlZ21lbnRzW25ld1ZhbF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVNlZ21lbnQuc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVTZWdtZW50LmZpbGxDb2xvciA9IGFjdGl2ZVNlZ21lbnQuaGlnaGxpZ2h0Q29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q3JlYXRlZC5zaG93VG9vbHRpcChbYWN0aXZlU2VnbWVudF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVTZWdtZW50LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNpemUoKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2hhcnQgPSBuZXcgQ2hhcnQoY3R4KTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2hhcnRDcmVhdGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5cclxuXHJcblxyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBjbGFzc3ktbG9hZGVyLmpzXHJcbiAqIEVuYWJsZSB1c2Ugb2YgY2xhc3N5bG9hZGVyIGRpcmVjdGx5IGZyb20gZGF0YSBhdHRyaWJ1dGVzXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuY2hhcnRzJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdjbGFzc3lsb2FkZXInLCBjbGFzc3lsb2FkZXIpO1xyXG5cclxuICAgIGNsYXNzeWxvYWRlci4kaW5qZWN0ID0gWyckdGltZW91dCcsICdVdGlscycsICckd2luZG93J107XHJcbiAgICBmdW5jdGlvbiBjbGFzc3lsb2FkZXIgKCR0aW1lb3V0LCBVdGlscywgJHdpbmRvdykge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQpIHtcclxuICAgICAgICAgIHZhciAkc2Nyb2xsZXIgICAgICAgPSAkKCR3aW5kb3cpLFxyXG4gICAgICAgICAgICAgIGluVmlld0ZsYWdDbGFzcyA9ICdqcy1pcy1pbi12aWV3JzsgLy8gYSBjbGFzc25hbWUgdG8gZGV0ZWN0IHdoZW4gYSBjaGFydCBoYXMgYmVlbiB0cmlnZ2VyZWQgYWZ0ZXIgc2Nyb2xsXHJcblxyXG4gICAgICAgICAgLy8gcnVuIGFmdGVyIGludGVycG9sYXRpb24gIFxyXG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgXHJcbiAgICAgICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCksXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zICA9ICRlbGVtZW50LmRhdGEoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEF0IGxlYXNlIHdlIG5lZWQgYSBkYXRhLXBlcmNlbnRhZ2UgYXR0cmlidXRlXHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICBpZiggb3B0aW9ucy50cmlnZ2VySW5WaWV3ICkge1xyXG5cclxuICAgICAgICAgICAgICAgICRzY3JvbGxlci5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNoZWNrTG9hZGVySW5WSWV3KCRlbGVtZW50LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIGVsZW1lbnQgc3RhcnRzIGFscmVhZHkgaW4gdmlld1xyXG4gICAgICAgICAgICAgICAgY2hlY2tMb2FkZXJJblZJZXcoJGVsZW1lbnQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBzdGFydExvYWRlcigkZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9LCAwKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBjaGVja0xvYWRlckluVklldyhlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSAtMjA7XHJcbiAgICAgICAgICAgIGlmKCAhIGVsZW1lbnQuaGFzQ2xhc3MoaW5WaWV3RmxhZ0NsYXNzKSAmJlxyXG4gICAgICAgICAgICAgICAgVXRpbHMuaXNJblZpZXcoZWxlbWVudCwge3RvcG9mZnNldDogb2Zmc2V0fSkgKSB7XHJcbiAgICAgICAgICAgICAgc3RhcnRMb2FkZXIoZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGZ1bmN0aW9uIHN0YXJ0TG9hZGVyKGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5DbGFzc3lMb2FkZXIob3B0aW9ucykuYWRkQ2xhc3MoaW5WaWV3RmxhZ0NsYXNzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jaGFydHMnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdDaGFydERhdGEnLCBDaGFydERhdGEpO1xyXG5cclxuICAgIENoYXJ0RGF0YS4kaW5qZWN0ID0gWyckcmVzb3VyY2UnXTtcclxuICAgIGZ1bmN0aW9uIENoYXJ0RGF0YSgkcmVzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLmxvYWQgPSBsb2FkO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgIFxyXG4gICAgICAgIHZhciBvcHRzID0ge1xyXG4gICAgICAgICAgICBnZXQ6IHsgbWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZSB9XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWQoc291cmNlKSB7XHJcbiAgICAgICAgICByZXR1cm4gJHJlc291cmNlKHNvdXJjZSwge30sIG9wdHMpLmdldCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogZmxvdC5qc1xyXG4gKiBJbml0aWFsaXplcyB0aGUgRmxvdCBjaGFydCBwbHVnaW4gYW5kIGhhbmRsZXMgZGF0YSByZWZyZXNoXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuY2hhcnRzJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdmbG90JywgZmxvdCk7XHJcblxyXG4gICAgZmxvdC4kaW5qZWN0ID0gWyckaHR0cCcsICckdGltZW91dCddO1xyXG4gICAgZnVuY3Rpb24gZmxvdCAoJGh0dHAsICR0aW1lb3V0KSB7XHJcblxyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdj48L2Rpdj4nLFxyXG4gICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgZGF0YXNldDogJz0/JyxcclxuICAgICAgICAgICAgb3B0aW9uczogJz0nLFxyXG4gICAgICAgICAgICBzZXJpZXM6ICc9JyxcclxuICAgICAgICAgICAgY2FsbGJhY2s6ICc9JyxcclxuICAgICAgICAgICAgc3JjOiAnPSdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBsaW5rOiBsaW5rXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgdmFyIGhlaWdodCwgcGxvdCwgcGxvdEFyZWEsIHdpZHRoO1xyXG4gICAgICAgICAgdmFyIGhlaWdodERlZmF1bHQgPSAyMjA7XHJcblxyXG4gICAgICAgICAgcGxvdCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgd2lkdGggPSBhdHRycy53aWR0aCB8fCAnMTAwJSc7XHJcbiAgICAgICAgICBoZWlnaHQgPSBhdHRycy5oZWlnaHQgfHwgaGVpZ2h0RGVmYXVsdDtcclxuXHJcbiAgICAgICAgICBwbG90QXJlYSA9ICQoZWxlbWVudC5jaGlsZHJlbigpWzBdKTtcclxuICAgICAgICAgIHBsb3RBcmVhLmNzcyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgICAgIHZhciBwbG90T2JqO1xyXG4gICAgICAgICAgICBpZighc2NvcGUuZGF0YXNldCB8fCAhc2NvcGUub3B0aW9ucykgcmV0dXJuO1xyXG4gICAgICAgICAgICBwbG90T2JqID0gJC5wbG90KHBsb3RBcmVhLCBzY29wZS5kYXRhc2V0LCBzY29wZS5vcHRpb25zKTtcclxuICAgICAgICAgICAgc2NvcGUuJGVtaXQoJ3Bsb3RSZWFkeScsIHBsb3RPYmopO1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUuY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICBzY29wZS5jYWxsYmFjayhwbG90T2JqLCBzY29wZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwbG90T2JqO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIG9uRGF0YXNldENoYW5nZWQoZGF0YXNldCkge1xyXG4gICAgICAgICAgICBpZiAocGxvdCkge1xyXG4gICAgICAgICAgICAgIHBsb3Quc2V0RGF0YShkYXRhc2V0KTtcclxuICAgICAgICAgICAgICBwbG90LnNldHVwR3JpZCgpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBwbG90LmRyYXcoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBwbG90ID0gaW5pdCgpO1xyXG4gICAgICAgICAgICAgIG9uU2VyaWVUb2dnbGVkKHNjb3BlLnNlcmllcyk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHBsb3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHNjb3BlLiR3YXRjaENvbGxlY3Rpb24oJ2RhdGFzZXQnLCBvbkRhdGFzZXRDaGFuZ2VkLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBvblNlcmllVG9nZ2xlZCAoc2VyaWVzKSB7XHJcbiAgICAgICAgICAgIGlmKCAhcGxvdCB8fCAhc2VyaWVzICkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgc29tZURhdGEgPSBwbG90LmdldERhdGEoKTtcclxuICAgICAgICAgICAgZm9yKHZhciBzTmFtZSBpbiBzZXJpZXMpIHtcclxuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goc2VyaWVzW3NOYW1lXSwgdG9nZ2xlRm9yKHNOYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHBsb3Quc2V0RGF0YShzb21lRGF0YSk7XHJcbiAgICAgICAgICAgIHBsb3QuZHJhdygpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZnVuY3Rpb24gdG9nZ2xlRm9yKHNOYW1lKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzLCBpKXtcclxuICAgICAgICAgICAgICAgIGlmKHNvbWVEYXRhW2ldICYmIHNvbWVEYXRhW2ldW3NOYW1lXSlcclxuICAgICAgICAgICAgICAgICAgc29tZURhdGFbaV1bc05hbWVdLnNob3cgPSBzO1xyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHNjb3BlLiR3YXRjaCgnc2VyaWVzJywgb25TZXJpZVRvZ2dsZWQsIHRydWUpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBmdW5jdGlvbiBvblNyY0NoYW5nZWQoc3JjKSB7XHJcblxyXG4gICAgICAgICAgICBpZiggc3JjICkge1xyXG5cclxuICAgICAgICAgICAgICAkaHR0cC5nZXQoc3JjKVxyXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZGF0YXNldCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJC5lcnJvcignRmxvdCBjaGFydDogQmFkIHJlcXVlc3QuJyk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHNjb3BlLiR3YXRjaCgnc3JjJywgb25TcmNDaGFuZ2VkKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IG1vcnJpcy5qc1xyXG4gKiBBbmd1bGFySlMgRGlyZWN0aXZlcyBmb3IgTW9ycmlzIENoYXJ0c1xyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNoYXJ0cycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbW9ycmlzQmFyJywgICBtb3JyaXNDaGFydCgnQmFyJykgICApXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbW9ycmlzRG9udXQnLCBtb3JyaXNDaGFydCgnRG9udXQnKSApXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbW9ycmlzTGluZScsICBtb3JyaXNDaGFydCgnTGluZScpICApXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbW9ycmlzQXJlYScsICBtb3JyaXNDaGFydCgnQXJlYScpICApO1xyXG5cclxuICAgIGZ1bmN0aW9uIG1vcnJpc0NoYXJ0KHR5cGUpIHtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICBtb3JyaXNEYXRhOiAnPScsXHJcbiAgICAgICAgICAgIG1vcnJpc09wdGlvbnM6ICc9J1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICAvLyBzdGFydCByZWFkeSB0byB3YXRjaCBmb3IgY2hhbmdlcyBpbiBkYXRhXHJcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ21vcnJpc0RhdGEnLCBmdW5jdGlvbihuZXdWYWwpIHtcclxuICAgICAgICAgICAgICBpZiAobmV3VmFsKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubW9ycmlzSW5zdGFuY2Uuc2V0RGF0YShuZXdWYWwpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm1vcnJpc0luc3RhbmNlLnJlZHJhdygpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIC8vIHRoZSBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhlIGNoYXJ0XHJcbiAgICAgICAgICAgICRzY29wZS5tb3JyaXNPcHRpb25zLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICAvLyBJZiBkYXRhIGRlZmluZWQgY29weSB0byBvcHRpb25zXHJcbiAgICAgICAgICAgIGlmKCRzY29wZS5tb3JyaXNEYXRhKVxyXG4gICAgICAgICAgICAgICRzY29wZS5tb3JyaXNPcHRpb25zLmRhdGEgPSAkc2NvcGUubW9ycmlzRGF0YTtcclxuICAgICAgICAgICAgLy8gSW5pdCBjaGFydFxyXG4gICAgICAgICAgICAkc2NvcGUubW9ycmlzSW5zdGFuY2UgPSBuZXcgTW9ycmlzW3R5cGVdKCRzY29wZS5tb3JyaXNPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBzcGFya2xpbmUuanNcbiAqIFNwYXJrTGluZXMgTWluaSBDaGFydHNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuIFxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNoYXJ0cycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NwYXJrbGluZScsIHNwYXJrbGluZSk7XG5cbiAgICBmdW5jdGlvbiBzcGFya2xpbmUgKCkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAnc3BhcmtsaW5lJzogJz0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlcjogQ29udHJvbGxlclxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgfVxuICAgIENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyR0aW1lb3V0JywgJyR3aW5kb3cnXTtcbiAgICBmdW5jdGlvbiBDb250cm9sbGVyKCRzY29wZSwgJGVsZW1lbnQsICR0aW1lb3V0LCAkd2luZG93KSB7XG4gICAgICB2YXIgcnVuU0wgPSBmdW5jdGlvbigpe1xuICAgICAgICBpbml0U3BhckxpbmUoKTtcbiAgICAgIH07XG5cbiAgICAgICR0aW1lb3V0KHJ1blNMKTtcbiAgXG4gICAgICBmdW5jdGlvbiBpbml0U3BhckxpbmUoKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gJHNjb3BlLnNwYXJrbGluZSxcbiAgICAgICAgICAgIGRhdGEgPSAkZWxlbWVudC5kYXRhKCk7XG4gICAgICAgIFxuICAgICAgICBpZighb3B0aW9ucykgLy8gaWYgbm8gc2NvcGUgb3B0aW9ucywgdHJ5IHdpdGggZGF0YSBhdHRyaWJ1dGVzXG4gICAgICAgICAgb3B0aW9ucyA9IGRhdGE7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZihkYXRhKSAvLyBkYXRhIGF0dHJpYnV0ZXMgb3ZlcnJpZGVzIHNjb3BlIG9wdGlvbnNcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgb3B0aW9ucywgZGF0YSk7XG5cbiAgICAgICAgb3B0aW9ucy50eXBlID0gb3B0aW9ucy50eXBlIHx8ICdiYXInOyAvLyBkZWZhdWx0IGNoYXJ0IGlzIGJhclxuICAgICAgICBvcHRpb25zLmRpc2FibGVIaWRkZW5DaGVjayA9IHRydWU7XG5cbiAgICAgICAgJGVsZW1lbnQuc3BhcmtsaW5lKCdodG1sJywgb3B0aW9ucyk7XG5cbiAgICAgICAgaWYob3B0aW9ucy5yZXNpemUpIHtcbiAgICAgICAgICAkKCR3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgJGVsZW1lbnQuc3BhcmtsaW5lKCdodG1sJywgb3B0aW9ucyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cbiAgICBcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbG9ycycpXHJcbiAgICAgICAgLmNvbnN0YW50KCdBUFBfQ09MT1JTJywge1xyXG4gICAgICAgICAgJ3ByaW1hcnknOiAgICAgICAgICAgICAgICAnIzVkOWNlYycsXHJcbiAgICAgICAgICAnc3VjY2Vzcyc6ICAgICAgICAgICAgICAgICcjMjdjMjRjJyxcclxuICAgICAgICAgICdpbmZvJzogICAgICAgICAgICAgICAgICAgJyMyM2I3ZTUnLFxyXG4gICAgICAgICAgJ3dhcm5pbmcnOiAgICAgICAgICAgICAgICAnI2ZmOTAyYicsXHJcbiAgICAgICAgICAnZGFuZ2VyJzogICAgICAgICAgICAgICAgICcjZjA1MDUwJyxcclxuICAgICAgICAgICdpbnZlcnNlJzogICAgICAgICAgICAgICAgJyMxMzFlMjYnLFxyXG4gICAgICAgICAgJ2dyZWVuJzogICAgICAgICAgICAgICAgICAnIzM3YmM5YicsXHJcbiAgICAgICAgICAncGluayc6ICAgICAgICAgICAgICAgICAgICcjZjUzMmU1JyxcclxuICAgICAgICAgICdwdXJwbGUnOiAgICAgICAgICAgICAgICAgJyM3MjY2YmEnLFxyXG4gICAgICAgICAgJ2RhcmsnOiAgICAgICAgICAgICAgICAgICAnIzNhM2Y1MScsXHJcbiAgICAgICAgICAneWVsbG93JzogICAgICAgICAgICAgICAgICcjZmFkNzMyJyxcclxuICAgICAgICAgICdncmF5LWRhcmtlcic6ICAgICAgICAgICAgJyMyMzI3MzUnLFxyXG4gICAgICAgICAgJ2dyYXktZGFyayc6ICAgICAgICAgICAgICAnIzNhM2Y1MScsXHJcbiAgICAgICAgICAnZ3JheSc6ICAgICAgICAgICAgICAgICAgICcjZGRlNmU5JyxcclxuICAgICAgICAgICdncmF5LWxpZ2h0JzogICAgICAgICAgICAgJyNlNGVhZWMnLFxyXG4gICAgICAgICAgJ2dyYXktbGlnaHRlcic6ICAgICAgICAgICAnI2VkZjFmMidcclxuICAgICAgICB9KVxyXG4gICAgICAgIDtcclxufSkoKTsiLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogY29sb3JzLmpzXG4gKiBTZXJ2aWNlcyB0byByZXRyaWV2ZSBnbG9iYWwgY29sb3JzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbG9ycycpXG4gICAgICAgIC5zZXJ2aWNlKCdDb2xvcnMnLCBDb2xvcnMpO1xuXG4gICAgQ29sb3JzLiRpbmplY3QgPSBbJ0FQUF9DT0xPUlMnXTtcbiAgICBmdW5jdGlvbiBDb2xvcnMoQVBQX0NPTE9SUykge1xuICAgICAgICB0aGlzLmJ5TmFtZSA9IGJ5TmFtZTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gYnlOYW1lKG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gKEFQUF9DT0xPUlNbbmFtZV0gfHwgJyNmZmYnKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvcmUnKVxyXG4gICAgICAgIC5jb25maWcoY29yZUNvbmZpZylcclxuICAgICAgICAuY29uZmlnKGxvb3BiYWNrQ29uZmlnKVxyXG4gICAgO1xyXG5cclxuICAgIGNvcmVDb25maWcuJGluamVjdCA9IFsnJGNvbnRyb2xsZXJQcm92aWRlcicsICckY29tcGlsZVByb3ZpZGVyJywgJyRmaWx0ZXJQcm92aWRlcicsICckcHJvdmlkZScsICckaHR0cFByb3ZpZGVyJ107XHJcbiAgICBmdW5jdGlvbiBjb3JlQ29uZmlnKCRjb250cm9sbGVyUHJvdmlkZXIsICRjb21waWxlUHJvdmlkZXIsICRmaWx0ZXJQcm92aWRlciwgJHByb3ZpZGUsICRodHRwUHJvdmlkZXIpe1xyXG4gICAgICBcclxuICAgICAgdmFyIGNvcmUgPSBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvcmUnKTtcclxuICAgICAgLy8gcmVnaXN0ZXJpbmcgY29tcG9uZW50cyBhZnRlciBib290c3RyYXBcclxuICAgICAgY29yZS5jb250cm9sbGVyID0gJGNvbnRyb2xsZXJQcm92aWRlci5yZWdpc3RlcjtcclxuICAgICAgY29yZS5kaXJlY3RpdmUgID0gJGNvbXBpbGVQcm92aWRlci5kaXJlY3RpdmU7XHJcbiAgICAgIGNvcmUuZmlsdGVyICAgICA9ICRmaWx0ZXJQcm92aWRlci5yZWdpc3RlcjtcclxuICAgICAgY29yZS5mYWN0b3J5ICAgID0gJHByb3ZpZGUuZmFjdG9yeTtcclxuICAgICAgY29yZS5zZXJ2aWNlICAgID0gJHByb3ZpZGUuc2VydmljZTtcclxuICAgICAgY29yZS5jb25zdGFudCAgID0gJHByb3ZpZGUuY29uc3RhbnQ7XHJcbiAgICAgIGNvcmUudmFsdWUgICAgICA9ICRwcm92aWRlLnZhbHVlO1xyXG5cclxuICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChmdW5jdGlvbigkcSwgJGxvY2F0aW9uLCBMb29wQmFja0F1dGgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24ocmVqZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChyZWplY3Rpb24uc3RhdHVzID09IDQwMSkge1xyXG4gICAgICAgICAgICAgIExvb3BCYWNrQXV0aC5jbGVhclVzZXIoKTtcclxuICAgICAgICAgICAgICBMb29wQmFja0F1dGguY2xlYXJTdG9yYWdlKCk7XHJcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYWdlL2xvZ2luJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgfSk7ICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgbG9vcGJhY2tDb25maWcuJGluamVjdCA9IFsnTG9vcEJhY2tSZXNvdXJjZVByb3ZpZGVyJywgJ3VybEJhc2UnXTtcclxuICAgIGZ1bmN0aW9uIGxvb3BiYWNrQ29uZmlnKExvb3BCYWNrUmVzb3VyY2VQcm92aWRlciwgdXJsQmFzZSkge1xyXG4gICAgICBMb29wQmFja1Jlc291cmNlUHJvdmlkZXIuc2V0VXJsQmFzZSh1cmxCYXNlKTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogY29uc3RhbnRzLmpzXHJcbiAqIERlZmluZSBjb25zdGFudHMgdG8gaW5qZWN0IGFjcm9zcyB0aGUgYXBwbGljYXRpb25cclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb3JlJylcclxuICAgICAgICAuY29uc3RhbnQoJ0FQUF9NRURJQVFVRVJZJywge1xyXG4gICAgICAgICAgJ2Rlc2t0b3BMRyc6ICAgICAgICAgICAgIDEyMDAsXHJcbiAgICAgICAgICAnZGVza3RvcCc6ICAgICAgICAgICAgICAgIDk5MixcclxuICAgICAgICAgICd0YWJsZXQnOiAgICAgICAgICAgICAgICAgNzY4LFxyXG4gICAgICAgICAgJ21vYmlsZSc6ICAgICAgICAgICAgICAgICA0ODBcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jb25zdGFudCgndXJsQmFzZScsIFwiaHR0cDovLzAuMC4wLjA6MzAwMC9hcGlcIilcclxuICAgICAgICAvLyAuY29uc3RhbnQoJ3VybEJhc2UnLCBcImh0dHA6Ly9hcGkuZmFua2FodWkuY29tOjMwMDAvYXBpXCIpXHJcbiAgICAgIDtcclxuXHJcbn0pKCk7IiwiLyoqXG4gKiBBbmd1bGFySlMgZGVmYXVsdCBmaWx0ZXIgd2l0aCB0aGUgZm9sbG93aW5nIGV4cHJlc3Npb246XG4gKiBcInBlcnNvbiBpbiBwZW9wbGUgfCBmaWx0ZXI6IHtuYW1lOiAkc2VsZWN0LnNlYXJjaCwgYWdlOiAkc2VsZWN0LnNlYXJjaH1cIlxuICogcGVyZm9ybXMgYSBBTkQgYmV0d2VlbiAnbmFtZTogJHNlbGVjdC5zZWFyY2gnIGFuZCAnYWdlOiAkc2VsZWN0LnNlYXJjaCcuXG4gKiBXZSB3YW50IHRvIHBlcmZvcm0gYSBPUi5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29yZScpXG4gICAgICAgIC5maWx0ZXIoJ3JvbGUnLCByb2xlRmlsdGVyKVxuICAgIDtcblxuICAgIGZ1bmN0aW9uIHJvbGVGaWx0ZXIoKSB7XG4gICAgICAgIHZhciByb2xlID0ge1xuICAgICAgICAgIG93bmVyOiBcIuiAgeadv1wiLFxuICAgICAgICAgIHNob3BNYW5hZ2VyOiBcIuW6l+mVv1wiLFxuICAgICAgICAgIGNhc2hpZXI6IFwi5pS26ZO25ZGYXCJcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIHJldHVybiByb2xlW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvcmUnKVxyXG4gICAgICAgIC5ydW4oYXBwUnVuKVxyXG4gICAgICAgIC5ydW4oY3VycmVudFVzZXJSdW4pXHJcbiAgICA7XHJcblxyXG4gICAgYXBwUnVuLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsICAnJHdpbmRvdycsICckdGVtcGxhdGVDYWNoZScsICdDb2xvcnMnXTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gYXBwUnVuKCRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkd2luZG93LCAkdGVtcGxhdGVDYWNoZSwgQ29sb3JzKSB7XHJcbiAgICAgIFxyXG4gICAgICAvLyBTZXQgcmVmZXJlbmNlIHRvIGFjY2VzcyB0aGVtIGZyb20gYW55IHNjb3BlXHJcbiAgICAgICRyb290U2NvcGUuJHN0YXRlID0gJHN0YXRlO1xyXG4gICAgICAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcyA9ICRzdGF0ZVBhcmFtcztcclxuICAgICAgJHJvb3RTY29wZS4kc3RvcmFnZSA9ICR3aW5kb3cubG9jYWxTdG9yYWdlO1xyXG5cclxuICAgICAgLy8gVW5jb21tZW50IHRoaXMgdG8gZGlzYWJsZSB0ZW1wbGF0ZSBjYWNoZVxyXG4gICAgICAvKiRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mKHRvU3RhdGUpICE9PSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgICAgICR0ZW1wbGF0ZUNhY2hlLnJlbW92ZSh0b1N0YXRlLnRlbXBsYXRlVXJsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSk7Ki9cclxuXHJcbiAgICAgIC8vIEFsbG93cyB0byB1c2UgYnJhbmRpbmcgY29sb3Igd2l0aCBpbnRlcnBvbGF0aW9uXHJcbiAgICAgIC8vIHt7IGNvbG9yQnlOYW1lKCdwcmltYXJ5JykgfX1cclxuICAgICAgJHJvb3RTY29wZS5jb2xvckJ5TmFtZSA9IENvbG9ycy5ieU5hbWU7XHJcblxyXG4gICAgICAvLyBjYW5jZWwgY2xpY2sgZXZlbnQgZWFzaWx5XHJcbiAgICAgICRyb290U2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oJGV2ZW50KSB7XHJcbiAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gSG9va3MgRXhhbXBsZVxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuXHJcbiAgICAgIC8vIEhvb2sgbm90IGZvdW5kXHJcbiAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVOb3RGb3VuZCcsXHJcbiAgICAgICAgZnVuY3Rpb24oZXZlbnQsIHVuZm91bmRTdGF0ZS8qLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMqLykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1bmZvdW5kU3RhdGUudG8pOyAvLyBcImxhenkuc3RhdGVcIlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1bmZvdW5kU3RhdGUudG9QYXJhbXMpOyAvLyB7YToxLCBiOjJ9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVuZm91bmRTdGF0ZS5vcHRpb25zKTsgLy8ge2luaGVyaXQ6ZmFsc2V9ICsgZGVmYXVsdCBvcHRpb25zXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIC8vIEhvb2sgZXJyb3JcclxuICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJyxcclxuICAgICAgICBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3Ipe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAvLyBIb29rIHN1Y2Nlc3NcclxuICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLFxyXG4gICAgICAgIGZ1bmN0aW9uKC8qZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMqLykge1xyXG4gICAgICAgICAgLy8gZGlzcGxheSBuZXcgdmlldyBmcm9tIHRvcFxyXG4gICAgICAgICAgJHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcclxuICAgICAgICAgIC8vIFNhdmUgdGhlIHJvdXRlIHRpdGxlXHJcbiAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJUaXRsZSA9ICRzdGF0ZS5jdXJyZW50LnRpdGxlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gTG9hZCBhIHRpdGxlIGR5bmFtaWNhbGx5XHJcbiAgICAgICRyb290U2NvcGUuY3VyclRpdGxlID0gJHN0YXRlLmN1cnJlbnQudGl0bGU7XHJcbiAgICAgICRyb290U2NvcGUucGFnZVRpdGxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gJHJvb3RTY29wZS5hcHAubmFtZSArICcgLSAnICsgKCRyb290U2NvcGUuY3VyclRpdGxlIHx8ICRyb290U2NvcGUuYXBwLmRlc2NyaXB0aW9uKTtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHJldHVybiB0aXRsZTtcclxuICAgICAgfTsgICAgICBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY3VycmVudFVzZXJSdW4uJGluamVjdCA9IFsnJHJvb3RTY29wZScsICdVc2VyJywgJyRmaWx0ZXInXTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gY3VycmVudFVzZXJSdW4oJHJvb3RTY29wZSwgVXNlciwgJGZpbHRlcikge1xyXG4gICAgICBcclxuICAgICAgdXNlckRpZExvZ2luZWQoKTtcclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHVzZXJEaWRMb2dpbmVkKCkge1xyXG4gICAgICAgIGlmKFVzZXIuaXNBdXRoZW50aWNhdGVkKCkpIHtcclxuICAgICAgICAgIFVzZXIuZmluZEJ5SWQoe2lkOiBVc2VyLmdldEN1cnJlbnRJZCgpLCBmaWx0ZXI6e2luY2x1ZGU6WydzaG9wJywgJ21lcmNoYW50J119fSlcclxuICAgICAgICAgIC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgICAgIHVzZXIuam9iID0gJGZpbHRlcigncm9sZScpKHVzZXIucm9sZSk7XHJcbiAgICAgICAgICAgIHVzZXIubmFtZSA9IHVzZXIubmFtZSB8fCB1c2VyLnVzZXJuYW1lO1xyXG4gICAgICAgICAgICB1c2VyLnBpY3R1cmUgPSAnYXBwL2ltZy9kdW1teS5wbmcnO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLnVzZXIgPSB1c2VyO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAkcm9vdFNjb3BlLiRvbignVXNlci5sb2dpbmVkJywgdXNlckRpZExvZ2luZWQpO1xyXG4gICAgICBcclxuICAgIH1cclxufSkoKTtcclxuXHJcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAubW9kdWxlKCdhcHAuY29zdHMnKVxuICAgICAgLmNvbnRyb2xsZXIoJ0Nvc3RzQ29udHJvbGxlcicsIENvc3RzQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdDb3N0Q2F0ZWdvcmllc0NvbnRyb2xsZXInLCBDb3N0Q2F0ZWdvcmllc0NvbnRyb2xsZXIpXG4gICAgICAuY29udHJvbGxlcignY29zdERpYWxvZ0NvbnRyb2xsZXInLCBjb3N0RGlhbG9nQ29udHJvbGxlcilcbiAgICA7XG4gICAgICBcbiAgICBDb3N0c0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0Nvc3QnLCAnbmdUYWJsZVBhcmFtcycsICduZ1RhYmxlTEJTZXJ2aWNlJywgJ1N3ZWV0QWxlcnQnLCAnbmdEaWFsb2cnXTtcbiAgICBmdW5jdGlvbiBDb3N0c0NvbnRyb2xsZXIoJHNjb3BlLCBDb3N0LCBuZ1RhYmxlUGFyYW1zLCBuZ1RhYmxlTEJTZXJ2aWNlLCBTd2VldEFsZXJ0LCBuZ0RpYWxvZykge1xuICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgdm0uZHQgPSB7XG4gICAgICAgIG9wdGlvbnM6IHsgXG4gICAgICAgICAgZm9ybWF0WWVhcjogJ3l5JyxcbiAgICAgICAgICBtYXhEYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIG1pbkRhdGU6IG5ldyBEYXRlKDIwMTYsMSwxKSxcbiAgICAgICAgICBzdGFydGluZ0RheTogMVxuICAgICAgICB9LFxuICAgICAgICBiZWdpbjoge1xuICAgICAgICAgIGR0OiBuZXcgRGF0ZShtb21lbnQoKS5zdGFydE9mKCdtb250aCcpKSxcbiAgICAgICAgICBvcGVuOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBlbmQ6IHtcbiAgICAgICAgICBkdDogbmV3IERhdGUoKSxcbiAgICAgICAgICBvcGVuOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICB2bS50YWJsZVBhcmFtcyA9IG5ldyBuZ1RhYmxlUGFyYW1zKHtjb3VudDogMTB9LCB7XG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJGRlZmVyLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXIgPSB7d2hlcmU6e1xuICAgICAgICAgICAgICBzdGF0dXM6e25lOidkZWxldGVkJ30sXG4gICAgICAgICAgICAgIG1vZGlmaWVkOiB7YmV0d2VlbjogW1xuICAgICAgICAgICAgICAgIG1vbWVudCh2bS5kdC5iZWdpbi5kdCkuc3RhcnRPZignZGF5JyksIFxuICAgICAgICAgICAgICAgIG1vbWVudCh2bS5kdC5lbmQuZHQpLmVuZE9mKCdkYXknKVxuICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG5nVGFibGVMQlNlcnZpY2UuZ2V0RGF0YSgkZGVmZXIsIHBhcmFtcywgQ29zdCwgZmlsdGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICB9XG5cbiAgICAgIHZtLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbmdEaWFsb2cub3Blbih7IFxuICAgICAgICAgIHRlbXBsYXRlOiAnY29zdERpYWxvZ0lkJywgXG4gICAgICAgICAgY29udHJvbGxlcjogJ2Nvc3REaWFsb2dDb250cm9sbGVyJ1xuICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIHZtLnRhYmxlUGFyYW1zLnJlbG9hZCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0uZWRpdCA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICAgICAgJHNjb3BlLmRhdGEgPSBlbnRpdHk7XG4gICAgICAgIG5nRGlhbG9nLm9wZW4oeyBcbiAgICAgICAgICB0ZW1wbGF0ZTogJ2Nvc3REaWFsb2dJZCcsIFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdjb3N0RGlhbG9nQ29udHJvbGxlcicsXG4gICAgICAgICAgc2NvcGU6ICRzY29wZVxuICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIHZtLnRhYmxlUGFyYW1zLnJlbG9hZCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0uZGVsZXRlID0gZnVuY3Rpb24gKGVudGl0eSkge1xuICAgICAgICBTd2VldEFsZXJ0LnN3YWwoeyAgIFxuICAgICAgICAgIHRpdGxlOiAn56Gu6K6k5Yig6Zmk77yfJywgICBcbiAgICAgICAgICB0ZXh0OiAn5Yig6Zmk5Lul5ZCO5bCG5oGi5aSN77yBJywgICBcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsICAgXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSwgICBcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjREQ2QjU1JywgICBcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ+aYr+eahO+8jOWIoOmZpO+8gScsXG4gICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ+S4je+8jOWFiOS4jeWIoCEnLFxuICAgICAgICAgIC8vIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICB9LCBmdW5jdGlvbiAoaXNDb25maXJtKSB7XG4gICAgICAgICAgaWYoaXNDb25maXJtKSB7XG4gICAgICAgICAgICBDb3N0LmRlbGV0ZUJ5SWQoe2lkOiBlbnRpdHkuaWR9KTtcbiAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zLnJlbG9hZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIENvc3RDYXRlZ29yaWVzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnQ29zdGNhdGVnb3J5JywgJ1N3ZWV0QWxlcnQnXTtcbiAgICBmdW5jdGlvbiBDb3N0Q2F0ZWdvcmllc0NvbnRyb2xsZXIoJHNjb3BlLCBDb3N0Y2F0ZWdvcnksIFN3ZWV0QWxlcnQpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG4gICAgICAgIHZtLmNhdGVnb3JpZXMgPSBDb3N0Y2F0ZWdvcnkuZmluZCh7ZmlsdGVyOiB7XG4gICAgICAgICAgb3JkZXI6IFwibmFtZSBERVNDXCIsXG4gICAgICAgICAgd2hlcmU6IHtzdGF0dXM6e25lOidkZWxldGVkJ319XG4gICAgICAgIH19KTtcblxuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5yZWxvYWQgPSBhY3RpdmF0ZSgpO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBkZWxldGVBbGVydChjYWxsYmFjaykge1xuICAgICAgICBTd2VldEFsZXJ0LnN3YWwoeyAgIFxuICAgICAgICAgIHRpdGxlOiAn56Gu6K6k5Yig6Zmk77yfJywgICBcbiAgICAgICAgICB0ZXh0OiAn5Yig6Zmk5Lul5ZCO5bCG5peg5rOV5L2/55So5YiG57G75LqG77yBJywgICBcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsICAgXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSwgICBcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjREQ2QjU1JywgICBcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ+aYr+eahO+8jOWIoOmZpO+8gScsXG4gICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ+S4je+8jOWFiOS4jeWIoCEnLFxuICAgICAgICAgIC8vIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmFkZENhdGVnb3J5ID0gZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG4gICAgICAgIGlmKGNhdGVnb3J5ICYmIGNhdGVnb3J5ICE9ICcnKSB7XG4gICAgICAgICAgQ29zdGNhdGVnb3J5LmNyZWF0ZSh7bmFtZTogY2F0ZWdvcnl9KS4kcHJvbWlzZS50aGVuKGFjdGl2YXRlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICB2bS51cGRhdGVDYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuICAgICAgICBDb3N0Y2F0ZWdvcnkucHJvdG90eXBlJHVwZGF0ZUF0dHJpYnV0ZXMoe2lkOiBjYXRlZ29yeS5pZH0sIHtcbiAgICAgICAgICBzdGF0dXM6IGNhdGVnb3J5LnN0YXR1cyxcbiAgICAgICAgICBuYW1lOiBjYXRlZ29yeS5uYW1lLFxuICAgICAgICAgIHN1YnM6IGNhdGVnb3J5LnN1YnNcbiAgICAgICAgfSkuJHByb21pc2UudGhlbihhY3RpdmF0ZSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmRlbGV0ZUNhdGVnb3J5ID0gZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG4gICAgICAgIGRlbGV0ZUFsZXJ0KGZ1bmN0aW9uIChpc0NvbmZpcm0pIHtcbiAgICAgICAgICBpZihpc0NvbmZpcm0pIHtcbiAgICAgICAgICAgIGNhdGVnb3J5LnN0YXR1cyA9ICdkZWxldGVkJztcbiAgICAgICAgICAgIHZtLnVwZGF0ZUNhdGVnb3J5KGNhdGVnb3J5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmFkZFN1YkNhdGVnb3J5ID0gZnVuY3Rpb24gKGNhdGVnb3J5LCBzdWJjYXRlZ29yeSkge1xuICAgICAgICBpZihzdWJjYXRlZ29yeSAmJiBzdWJjYXRlZ29yeSAhPSAnJyAmJiBjYXRlZ29yeS5zdWJzLmluZGV4T2Yoc3ViY2F0ZWdvcnkpID09PSAtMSkge1xuICAgICAgICAgIGNhdGVnb3J5LnN1YnMucHVzaChzdWJjYXRlZ29yeSk7XG4gICAgICAgICAgdm0udXBkYXRlQ2F0ZWdvcnkoY2F0ZWdvcnkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmRlbGV0ZVN1YmNhdGVnb3J5ID0gZnVuY3Rpb24gKGNhdGVnb3J5LCBpbmRleCkge1xuICAgICAgICAvLyB2YXIgaW5kZXggPSBjYXRlZ29yeS5zdWJzLmluZGV4T2Yoc3ViY2F0ZWdvcnkpO1xuICAgICAgICBkZWxldGVBbGVydChmdW5jdGlvbiAoaXNDb25maXJtKSB7XG4gICAgICAgICAgaWYoaXNDb25maXJtKSB7XG4gICAgICAgICAgICBjYXRlZ29yeS5zdWJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB2bS51cGRhdGVDYXRlZ29yeShjYXRlZ29yeSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb3N0RGlhbG9nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnbmdEaWFsb2cnLCAnQ29zdCcsICdTd2VldEFsZXJ0JywgJ0Nvc3RjYXRlZ29yeScsICd0b2FzdGVyJ107XG4gICAgZnVuY3Rpb24gY29zdERpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCBuZ0RpYWxvZywgQ29zdCwgU3dlZXRBbGVydCwgQ29zdGNhdGVnb3J5LCB0b2FzdGVyKSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgJHNjb3BlLmNhdGVnb3JpZXMgPSBDb3N0Y2F0ZWdvcnkuZmluZCh7ZmlsdGVyOiB7XG4gICAgICAgICAgICBvcmRlcjogXCJuYW1lIERFU0NcIixcbiAgICAgICAgICAgIHdoZXJlOiB7c3RhdHVzOntuZTonZGVsZXRlZCd9fVxuICAgICAgICAgIH19KTtcbiAgICAgICAgICAkc2NvcGUuZGF0YSA9ICRzY29wZS5kYXRhIHx8IHtcbiAgICAgICAgICAgIGNhdGVnb3J5OiAn6K+36YCJ5oupJyxcbiAgICAgICAgICAgIHN1YmNhdGVnb3J5OiAn5YiG57G7JyxcbiAgICAgICAgICAgIGFtb3VudDogMFxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2V0Q2F0ZWdvcnkgPSBmdW5jdGlvbiAoYywgcykge1xuICAgICAgICAgICRzY29wZS5kYXRhLmNhdGVnb3J5ID0gYztcbiAgICAgICAgICAkc2NvcGUuZGF0YS5zdWJjYXRlZ29yeSA9IHM7XG4gICAgICAgICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmNvbmZpcm0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYoJHNjb3BlLmRhdGEuYW1vdW50ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuZGF0YS5tZXJjaGFudElkO1xuICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuZGF0YS5zaG9wSWQ7XG4gICAgICAgICAgZGVsZXRlICRzY29wZS5kYXRhLmNyZWF0ZWQ7XG4gICAgICAgICAgZGVsZXRlICRzY29wZS5kYXRhLm9wZXJhdG9yO1xuICAgICAgICAgIENvc3QudXBzZXJ0KCRzY29wZS5kYXRhKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIG5nRGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICfmiJDlip8nLCBcIuWujOaIkOaUr+WHuueZu+iusFwiKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCAn5aSx6LSlJywgXCLmlK/lh7rnmbvorrDmnKrlrozmiJDvvIzor7fph43or5XvvIFcIilcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5kYXNoYm9hcmQnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XHJcblxyXG4gICAgRGFzaGJvYXJkQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnQ2hhcnREYXRhJywgJyR0aW1lb3V0JywgJ0NoZWNraW4nLCAnRGVhbCcsICdQYXltZW50JywgJ2RlYWxTZXJ2aWNlJ107XHJcbiAgICBmdW5jdGlvbiBEYXNoYm9hcmRDb250cm9sbGVyKCRzY29wZSwgQ2hhcnREYXRhLCAkdGltZW91dCwgQ2hlY2tpbiwgRGVhbCwgUGF5bWVudCwgZGVhbFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBTZXQgTW9tZW50IGxvY2FsZVxyXG4gICAgICAgIG1vbWVudC5sb2NhbGUoJ3poLWNuJyk7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmKCEkc2NvcGUudXNlcikgcmV0dXJuO1xyXG5cclxuICAgICAgICAgIC8vIFN0YXRpc3RpY1xyXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICAgICAgICB2bS5zdGF0RGF0YSA9IFtcclxuICAgICAgICAgICAge2xhYmVsOiBcIumUgOWUruaUtuWFpVwiLCBjb2xvcjogXCIjMmY4MGU3XCIsIGRhdGE6IFtdfSxcclxuICAgICAgICAgICAge2xhYmVsOiBcIumUgOWUruaVsOmHj1wiLCBjb2xvcjogXCIjNTY0YWEzXCIsIGRhdGE6IFtdfSxcclxuICAgICAgICAgICAge2xhYmVsOiBcIuS8muWRmOWCqOWAvFwiLCBjb2xvcjogXCIjMmI5NTdhXCIsIGRhdGE6IFtdfVxyXG4gICAgICAgICAgXTtcclxuICAgICAgICAgIHZhciBkYXlzID0gNztcclxuICAgICAgICAgIHZtLmRheXMgPSBkYXlzO1xyXG4gICAgICAgICAgdmFyIG5vdyA9IG1vbWVudCgpO1xyXG4gICAgICAgICAgdmFyIGZyb20gPSBtb21lbnQoKS5zdWJ0cmFjdChkYXlzLTEsICdkYXlzJykuc3RhcnRPZignZGF5Jyk7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRheXM7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgZCA9IG1vbWVudCgpLnN1YnRyYWN0KGRheXMtaS0xLCAnZGF5cycpLmRhdGUoKTtcclxuICAgICAgICAgICAgdm0uc3RhdERhdGFbMF0uZGF0YS5wdXNoKFtkLCAwXSk7XHJcbiAgICAgICAgICAgIHZtLnN0YXREYXRhWzFdLmRhdGEucHVzaChbZCwgMF0pO1xyXG4gICAgICAgICAgICB2bS5zdGF0RGF0YVsyXS5kYXRhLnB1c2goW2QsIDBdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHZhciBnZXREYXRhQnlEYXRlID0gZnVuY3Rpb24gKHJlcywgZHQpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJlcy5zb21lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgaWYoZGF0YS5faWQueWVhciA9PT0gZHQueWVhcigpIFxyXG4gICAgICAgICAgICAgICYmIGRhdGEuX2lkLm1vbnRoID09PSBkdC5tb250aCgpKzEgXHJcbiAgICAgICAgICAgICAgJiYgZGF0YS5faWQuZGF5T2ZNb250aCA9PT0gZHQuZGF0ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIERlYWwuc3RhdCh7ZmlsdGVyOntcclxuICAgICAgICAgICAgd2hlcmU6e1xyXG4gICAgICAgICAgICAgIHN0YXR1czogJ2Nsb3NlZCcsIFxyXG4gICAgICAgICAgICAgIFwicGF5bWVudC5hbW91bnRcIjogeyRndDogMH0sXHJcbiAgICAgICAgICAgICAgbW9kaWZpZWQ6IHskZ3RlOiBmcm9tLCAkbHRlOiBub3d9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNvcnQ6IHtfaWQ6IDF9XHJcbiAgICAgICAgICB9fSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRheXM7IGkrKykge1xyXG4gICAgICAgICAgICAgIHZhciBtID0gbW9tZW50KCkuc3VidHJhY3QoZGF5cy1pLTEsICdkYXlzJyk7XHJcbiAgICAgICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhQnlEYXRlKHJlcywgbSk7XHJcbiAgICAgICAgICAgICAgaWYoIWRhdGEpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgIHZhciBkID0gbS5kYXRlKCk7XHJcbiAgICAgICAgICAgICAgdm0uc3RhdERhdGFbMF0uZGF0YVtpXSA9IFtkLCBNYXRoLnJvdW5kKGRhdGEuYW1vdW50LzEwMCldO1xyXG4gICAgICAgICAgICAgIHZtLnN0YXREYXRhWzFdLmRhdGFbaV0gPSBbZCwgZGF0YS5xdHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZtLnNwbGluZURhdGFbMF0gPSB2bS5zdGF0RGF0YVswXTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBQYXltZW50LnN0YXQoe2ZpbHRlcjp7XHJcbiAgICAgICAgICAgIHdoZXJlOntcclxuICAgICAgICAgICAgICBzdGF0dXM6ICdjbG9zZWQnLCBcclxuICAgICAgICAgICAgICBjYXRlZ29yeTogJ2RlcG9zaXQnLFxyXG4gICAgICAgICAgICAgIG1vZGlmaWVkOiB7JGd0ZTogZnJvbSwgJGx0ZTogbm93fVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzb3J0OiB7X2lkOiAxfVxyXG4gICAgICAgICAgfX0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXlzOyBpKyspIHtcclxuICAgICAgICAgICAgICB2YXIgbSA9IG1vbWVudCgpLnN1YnRyYWN0KGRheXMtaS0xLCAnZGF5cycpO1xyXG4gICAgICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YUJ5RGF0ZShyZXMsIG0pO1xyXG4gICAgICAgICAgICAgIGlmKCFkYXRhKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICB2YXIgZCA9IG0uZGF0ZSgpO1xyXG4gICAgICAgICAgICAgIHZtLnN0YXREYXRhWzJdLmRhdGFbaV0gPSBbZCwgTWF0aC5yb3VuZChkYXRhLmFtb3VudC8xMDApXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2bS5zcGxpbmVEYXRhWzFdID0gdm0uc3RhdERhdGFbMl07XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gQ0hFQ0tJTlxyXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICAgICAgICB2bS5jaGVja2lucyA9IENoZWNraW4uZmluZCh7ZmlsdGVyOntcclxuICAgICAgICAgICAgd2hlcmU6IHttZXJjaGFudElkOiAkc2NvcGUudXNlci5zaG9wSWR9LFxyXG4gICAgICAgICAgICBpbmNsdWRlOiBbe21lbWJlcjogJ3d4dXNlcid9XSxcclxuICAgICAgICAgICAgbGltaXQ6IDEwLCBcclxuICAgICAgICAgICAgb3JkZXI6ICdjcmVhdGVkIERFU0MnXHJcbiAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHZtLnNlbGwgPSBmdW5jdGlvbiAobWVtYmVyKSB7XHJcbiAgICAgICAgICAgIGRlYWxTZXJ2aWNlLm9wZW5EZWFsKG1lbWJlcik7XHJcbiAgICAgICAgICAgICRzY29wZS4kc3RhdGUuZ28oJ2FwcC5zZWxsJyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gU1BMSU5FXHJcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuICAgICAgICAgIHZtLnNwbGluZURhdGEgPSBDaGFydERhdGEubG9hZCgnc2VydmVyL2NoYXJ0L3NwbGluZS5qc29uJyk7XHJcbiAgICAgICAgICB2bS5zcGxpbmVPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgIHNlcmllczoge1xyXG4gICAgICAgICAgICAgICAgICBsaW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgcG9pbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiA0XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIHNwbGluZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiAwLjQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICBmaWxsOiAwLjVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJyNlZWUnLFxyXG4gICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMSxcclxuICAgICAgICAgICAgICAgICAgaG92ZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmNmY2ZjJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDogdHJ1ZSxcclxuICAgICAgICAgICAgICB0b29sdGlwT3B0czoge1xyXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiBmdW5jdGlvbiAobGFiZWwsIHgsIHkpIHsgcmV0dXJuIHggKyAnIDogJyArIHk7IH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHhheGlzOiB7XHJcbiAgICAgICAgICAgICAgICAgIHRpY2tDb2xvcjogJyNmY2ZjZmMnLFxyXG4gICAgICAgICAgICAgICAgICBtb2RlOiAnY2F0ZWdvcmllcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHlheGlzOiB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIG1pbjogMCxcclxuICAgICAgICAgICAgICAgICAgLy8gbWF4OiA1MDAwMCwgLy8gb3B0aW9uYWw6IHVzZSBpdCBmb3IgYSBjbGVhciByZXByZXNldGF0aW9uXHJcbiAgICAgICAgICAgICAgICAgIHRpY2tDb2xvcjogJyNlZWUnLFxyXG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogKCRzY29wZS5hcHAubGF5b3V0LmlzUlRMID8gJ3JpZ2h0JyA6ICdsZWZ0JyksXHJcbiAgICAgICAgICAgICAgICAgIHRpY2tGb3JtYXR0ZXI6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdjtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgc2hhZG93U2l6ZTogMFxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICRzY29wZS4kb24oJ1VzZXIubG9naW5lZCcsIGFjdGl2YXRlKTtcclxuICAgICAgICBcclxuICAgIH1cclxufSkoKTsiLCIvKipcbiAqIEFuZ3VsYXJKUyBkZWZhdWx0IGZpbHRlciB3aXRoIHRoZSBmb2xsb3dpbmcgZXhwcmVzc2lvbjpcbiAqIFwicGVyc29uIGluIHBlb3BsZSB8IGZpbHRlcjoge25hbWU6ICRzZWxlY3Quc2VhcmNoLCBhZ2U6ICRzZWxlY3Quc2VhcmNofVwiXG4gKiBwZXJmb3JtcyBhIEFORCBiZXR3ZWVuICduYW1lOiAkc2VsZWN0LnNlYXJjaCcgYW5kICdhZ2U6ICRzZWxlY3Quc2VhcmNoJy5cbiAqIFdlIHdhbnQgdG8gcGVyZm9ybSBhIE9SLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5kYXNoYm9hcmQnKVxuICAgICAgICAuZmlsdGVyKCdtb21lbnRfdW5peCcsIG1vbWVudFVuaXhGaWx0ZXIpXG4gICAgICAgIC5maWx0ZXIoJ21vbWVudF9mcm9tX25vdycsIG1vbWVudEZyb21Ob3dGaWx0ZXIpXG4gICAgICAgIC5maWx0ZXIoJ21vbWVudF91bml4X2Zyb21fbm93JywgbW9tZW50VW5peEZyb21Ob3dGaWx0ZXIpXG4gICAgO1xuXG4gICAgZnVuY3Rpb24gbW9tZW50VW5peEZpbHRlcihpbnB1dCwgZm9ybWF0KSB7XG4gICAgICByZXR1cm4gbW9tZW50LnVuaXgoaW5wdXQpLmZvcm1hdChmb3JtYXQgfHwgJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gbW9tZW50RnJvbU5vd0ZpbHRlcigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudChpbnB1dCkuZnJvbU5vdygpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRVbml4RnJvbU5vd0ZpbHRlcihpbnB1dCkge1xuICAgICAgcmV0dXJuIG1vbWVudC51bml4KGlucHV0KS5mcm9tTm93KCk7XG4gICAgfVxuXG59KSgpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBzY3JvbGwuanNcbiAqIE1ha2UgYSBjb250ZW50IGJveCBzY3JvbGxhYmxlXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmVsZW1lbnRzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnc2Nyb2xsYWJsZScsIHNjcm9sbGFibGUpO1xuXG4gICAgZnVuY3Rpb24gc2Nyb2xsYWJsZSAoKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIHZhciBkZWZhdWx0SGVpZ2h0ID0gMjUwO1xuICAgICAgICAgIGVsZW1lbnQuc2xpbVNjcm9sbCh7XG4gICAgICAgICAgICAgIGhlaWdodDogKGF0dHJzLmhlaWdodCB8fCBkZWZhdWx0SGVpZ2h0KVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogZmlsZXN0eWxlLmpzXHJcbiAqIEluaXRpYWxpemVzIHRoZSBmaWVsc3R5bGUgcGx1Z2luXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuZm9ybXMnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2ZpbGVzdHlsZScsIGZpbGVzdHlsZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gZmlsZXN0eWxlICgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICB2YXIgb3B0aW9ucyA9IGVsZW1lbnQuZGF0YSgpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBvbGQgdXNhZ2Ugc3VwcG9ydFxyXG4gICAgICAgICAgb3B0aW9ucy5jbGFzc0lucHV0ID0gZWxlbWVudC5kYXRhKCdjbGFzc2lucHV0JykgfHwgb3B0aW9ucy5jbGFzc0lucHV0O1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBlbGVtZW50LmZpbGVzdHlsZShvcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBmb3JtLXdpemFyZC5qc1xyXG4gKiBIYW5kbGVzIGZvcm0gd2l6YXJkIHBsdWdpbiBhbmQgdmFsaWRhdGlvblxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mb3JtcycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZm9ybVdpemFyZCcsIGZvcm1XaXphcmQpO1xyXG5cclxuICAgIGZvcm1XaXphcmQuJGluamVjdCA9IFsnJHBhcnNlJ107XHJcbiAgICBmdW5jdGlvbiBmb3JtV2l6YXJkICgkcGFyc2UpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZTogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgIHZhciB2YWxpZGF0ZSA9ICRwYXJzZShhdHRycy52YWxpZGF0ZVN0ZXBzKShzY29wZSksXHJcbiAgICAgICAgICAgICAgd2l6ID0gbmV3IFdpemFyZChhdHRycy5zdGVwcywgISF2YWxpZGF0ZSwgZWxlbWVudCk7XHJcbiAgICAgICAgICBzY29wZS53aXphcmQgPSB3aXouaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gV2l6YXJkIChxdWFudGl0eSwgdmFsaWRhdGUsIGVsZW1lbnQpIHtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgc2VsZi5xdWFudGl0eSA9IHBhcnNlSW50KHF1YW50aXR5LDEwKTtcclxuICAgICAgICAgIHNlbGYudmFsaWRhdGUgPSB2YWxpZGF0ZTtcclxuICAgICAgICAgIHNlbGYuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZWxmLmNyZWF0ZXN0ZXBzKHNlbGYucXVhbnRpdHkpO1xyXG4gICAgICAgICAgICBzZWxmLmdvKDEpOyAvLyBhbHdheXMgc3RhcnQgYXQgZmlzdCBzdGVwXHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBzZWxmLmdvID0gZnVuY3Rpb24oc3RlcCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCBhbmd1bGFyLmlzRGVmaW5lZChzZWxmLnN0ZXBzW3N0ZXBdKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgaWYoc2VsZi52YWxpZGF0ZSAmJiBzdGVwICE9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm9ybSA9ICQoc2VsZi5lbGVtZW50KSxcclxuICAgICAgICAgICAgICAgICAgICBncm91cCA9IGZvcm0uY2hpbGRyZW4oKS5jaGlsZHJlbignZGl2JykuZ2V0KHN0ZXAgLSAyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGZvcm0ucGFyc2xleSgpLnZhbGlkYXRlKCBncm91cC5pZCApKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHNlbGYuY2xlYW5hbGwoKTtcclxuICAgICAgICAgICAgICBzZWxmLnN0ZXBzW3N0ZXBdID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBzZWxmLmFjdGl2ZSA9IGZ1bmN0aW9uKHN0ZXApIHtcclxuICAgICAgICAgICAgcmV0dXJuICEhc2VsZi5zdGVwc1tzdGVwXTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgc2VsZi5jbGVhbmFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgaW4gc2VsZi5zdGVwcyl7XHJcbiAgICAgICAgICAgICAgc2VsZi5zdGVwc1tpXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHNlbGYuY3JlYXRlc3RlcHMgPSBmdW5jdGlvbihxKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RlcHMgPSBbXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMTsgaSA8PSBxOyBpKyspIHNlbGYuc3RlcHNbaV0gPSBmYWxzZTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogbWFza2VkLGpzXG4gKiBJbml0aWFsaXplcyB0aGUgbWFza2VkIGlucHV0c1xuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mb3JtcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ21hc2tlZCcsIG1hc2tlZCk7XG5cbiAgICBmdW5jdGlvbiBtYXNrZWQgKCkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgdmFyICRlbGVtID0gJChlbGVtZW50KTtcbiAgICAgICAgICBpZigkLmZuLmlucHV0bWFzaylcbiAgICAgICAgICAgICRlbGVtLmlucHV0bWFzaygpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXHJcbiAqIEFuZ3VsYXJKUyBkZWZhdWx0IGZpbHRlciB3aXRoIHRoZSBmb2xsb3dpbmcgZXhwcmVzc2lvbjpcclxuICogXCJwZXJzb24gaW4gcGVvcGxlIHwgZmlsdGVyOiB7bmFtZTogJHNlbGVjdC5zZWFyY2gsIGFnZTogJHNlbGVjdC5zZWFyY2h9XCJcclxuICogcGVyZm9ybXMgYSBBTkQgYmV0d2VlbiAnbmFtZTogJHNlbGVjdC5zZWFyY2gnIGFuZCAnYWdlOiAkc2VsZWN0LnNlYXJjaCcuXHJcbiAqIFdlIHdhbnQgdG8gcGVyZm9ybSBhIE9SLlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZvcm1zJylcclxuICAgICAgICAuZmlsdGVyKCdwcm9wc0ZpbHRlcicsIHByb3BzRmlsdGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBwcm9wc0ZpbHRlcigpIHtcclxuICAgICAgICByZXR1cm4gZmlsdGVyRmlsdGVyO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgZnVuY3Rpb24gZmlsdGVyRmlsdGVyKGl0ZW1zLCBwcm9wcykge1xyXG4gICAgICAgICAgdmFyIG91dCA9IFtdO1xyXG5cclxuICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoaXRlbXMpKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgIHZhciBpdGVtTWF0Y2hlcyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BzKTtcclxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wID0ga2V5c1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gcHJvcHNbcHJvcF0udG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtW3Byb3BdLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICBpdGVtTWF0Y2hlcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKGl0ZW1NYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICBvdXQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTGV0IHRoZSBvdXRwdXQgYmUgdGhlIGlucHV0IHVudG91Y2hlZFxyXG4gICAgICAgICAgICBvdXQgPSBpdGVtcztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IHRhZ3MtaW5wdXQuanNcbiAqIEluaXRpYWxpemVzIHRoZSB0YWcgaW5wdXRzIHBsdWdpblxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mb3JtcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3RhZ3NpbnB1dCcsIHRhZ3NpbnB1dCk7XG5cbiAgICB0YWdzaW5wdXQuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcbiAgICBmdW5jdGlvbiB0YWdzaW5wdXQgKCR0aW1lb3V0KSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XG4gICAgICAgICAgZWxlbWVudC5vbignaXRlbUFkZGVkIGl0ZW1SZW1vdmVkJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHZpZXcgdmFsdWUgaXMgbm90IGVtcHR5IGFuZCBpcyBhIHN0cmluZ1xuICAgICAgICAgICAgLy8gYW5kIHVwZGF0ZSB0aGUgdmlldyBmcm9tIHN0cmluZyB0byBhbiBhcnJheSBvZiB0YWdzXG4gICAgICAgICAgICBpZihuZ01vZGVsLiR2aWV3VmFsdWUgJiYgbmdNb2RlbC4kdmlld1ZhbHVlLnNwbGl0KSB7XG4gICAgICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZSggbmdNb2RlbC4kdmlld1ZhbHVlLnNwbGl0KCcsJykgKTtcbiAgICAgICAgICAgICAgbmdNb2RlbC4kcmVuZGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgZWxlbWVudC50YWdzaW5wdXQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiB2YWxpZGF0ZS1mb3JtLmpzXG4gKiBJbml0aWFsaXplcyB0aGUgdmFsaWRhdGlvbiBwbHVnaW4gUGFyc2xleVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mb3JtcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3ZhbGlkYXRlRm9ybScsIHZhbGlkYXRlRm9ybSk7XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZUZvcm0gKCkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgdmFyICRlbGVtID0gJChlbGVtZW50KTtcbiAgICAgICAgICBpZigkLmZuLnBhcnNsZXkpXG4gICAgICAgICAgICAkZWxlbS5wYXJzbGV5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgLm1vZHVsZSgnYXBwLml0ZW1zJywgW10pXG4gICAgICAuY29udHJvbGxlcignSXRlbXNDb250cm9sbGVyJywgSXRlbXNDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ1N0b2NrRGlhbG9nQ29udHJvbGxlcicsIFN0b2NrRGlhbG9nQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdTdG9ja3NDb250cm9sbGVyJywgU3RvY2tzQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdJdGVtQWRkQ29udHJvbGxlcicsIEl0ZW1BZGRDb250cm9sbGVyKTtcbiAgICBcbiAgICBJdGVtc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ25nVGFibGVQYXJhbXMnLCAnU2t1JywgJ25nRGlhbG9nJywgJ1N3ZWV0QWxlcnQnLCAnbmdUYWJsZUxCU2VydmljZSddO1xuICAgIGZ1bmN0aW9uIEl0ZW1zQ29udHJvbGxlcigkc2NvcGUsIG5nVGFibGVQYXJhbXMsIFNrdSwgbmdEaWFsb2csIFN3ZWV0QWxlcnQsIG5nVGFibGVMQlNlcnZpY2UpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICBcbiAgICAgIGFjdGl2YXRlKCk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICB2bS5rZXl3b3JkID0gXCJcIjtcbiAgICAgICAgdm0udGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7Y291bnQ6IDEwfSwge1xuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCRkZWZlciwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyID0ge1xuICAgICAgICAgICAgICB3aGVyZTp7c3RhdHVzOntuZTonZGVsZXRlZCd9fSwgXG4gICAgICAgICAgICAgIGluY2x1ZGU6W1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHJlbGF0aW9uOidpbnZlbnRvcmllcycsXG4gICAgICAgICAgICAgICAgICBzY29wZTp7IHdoZXJlOiB7c2hvcElkOiAkc2NvcGUudXNlci5zaG9wLmlkfSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYodm0ua2V5d29yZCAhPSAnJykge1xuICAgICAgICAgICAgICB2YXIgcXMgPSB7cmVnZXg6IGtleXdvcmR9O1xuICAgICAgICAgICAgICBmaWx0ZXIud2hlcmUub3IgPSBbe1wiaXRlbS5uYW1lXCI6cXN9LCB7bW9kZWw6cXN9XTtcbiAgICAgICAgICAgICAgcGFyYW1zLnBhZ2UoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZ1RhYmxlTEJTZXJ2aWNlLmdldERhdGEoJGRlZmVyLCBwYXJhbXMsIFNrdSwgZmlsdGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICB2bS5zdG9jayA9IGZ1bmN0aW9uIChza3UsIHR5cGUpIHtcbiAgICAgICAgbmdEaWFsb2cub3Blbih7IFxuICAgICAgICAgIHRlbXBsYXRlOiAnc3RvY2tEaWFsb2dJZCcsIFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdTdG9ja0RpYWxvZ0NvbnRyb2xsZXInLCBcbiAgICAgICAgICBkYXRhOiB7c2t1OiBza3UsIHR5cGU6IHR5cGV9IFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0uZGVsZXRlID0gZnVuY3Rpb24gKHNrdSkge1xuICAgICAgICBTd2VldEFsZXJ0LnN3YWwoeyAgIFxuICAgICAgICAgIHRpdGxlOiAn56Gu5a6a5Yig6Zmk5ZWG5ZOBJytza3UuaXRlbS5uYW1lLCAgIFxuICAgICAgICAgIHRleHQ6ICfliKDpmaTllYblk4HlkI7lsIbml6Dms5XmgaLlpI3vvIzkvaDnoa7lrpropoHliKDpmaTllYblk4HvvJ8nLCAgIFxuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJywgICBcbiAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLCAgIFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogJyNERDZCNTUnLCAgIFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAn5piv55qE77yM5Yig6Zmk77yBJyxcbiAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiAn5LiN77yM5Y+W5raI77yBJywgICBcbiAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgfSwgIGZ1bmN0aW9uKGlzQ29uZmlybSl7ICBcbiAgICAgICAgICBpZihpc0NvbmZpcm0pIHtcbiAgICAgICAgICAgIHNrdS5zdGF0dXMgPSAnZGVsZXRlZCc7XG4gICAgICAgICAgICBza3UuJHNhdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBTd2VldEFsZXJ0LnN3YWwoJ+W3suWIoOmZpCEnLCfkvaDnmoTllYblk4EnK3NrdS5pdGVtLm5hbWUrJ+W3sue7j+WIoOmZpOOAgicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgIFN3ZWV0QWxlcnQuc3dhbCgn5aSx6LSlIScsICfliKDpmaTllYblk4Hml7blj5HnlJ/plJnor6/vvIzkvaDnmoTllYblk4HmsqHmnInooqvliKDpmaTjgIInLCAnZXJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLmNvbmZpcm0gPSBmdW5jdGlvbiAoc2t1KSB7XG4gICAgICAgIHZhciBxdHkgPSAwO1xuICAgICAgICB2YXIgaW52ZW50b3J5ID0gc2t1LmludmVudG9yaWVzWzBdO1xuICAgICAgICBpZihpbnZlbnRvcnkpIHtcbiAgICAgICAgICBxdHkgPSBpbnZlbnRvcnkuYmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICBTa3Uuc3RvY2tzLmNyZWF0ZSh7aWQ6IHNrdS5pZH0sIHt0eXBlOiAnaW52ZW50b3J5JywgcXR5OiBxdHl9KS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgdm0udGFibGVQYXJhbXMucmVsb2FkKCk7XG4gICAgICAgICAgU3dlZXRBbGVydC5zd2FsKCfnm5jngrnmiJDlip8hJywn5L2g55qE5ZWG5ZOBJytza3UuaXRlbS5uYW1lKyflt7Lnu4/nm5jngrnnoa7orqTjgIInLCAnc3VjY2VzcycpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgIH1cbiAgICBcbiAgICBJdGVtQWRkQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnSXRlbSddO1xuICAgIGZ1bmN0aW9uIEl0ZW1BZGRDb250cm9sbGVyKCRzY29wZSwgSXRlbSkge1xuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgd2luZG93LlBhcnNsZXlWYWxpZGF0b3Iuc2V0TG9jYWxlKCd6aF9jbicpO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgJHNjb3BlLmVudGl0eSA9IHtcbiAgICAgICAgICB0eXBlOiBcImVudGl0eVwiLFxuICAgICAgICAgIG5hbWU6IFwiaVBob25lNlMgUGx1c1wiLFxuICAgICAgICAgIHNrdXM6IFt7YmFyY29kZTogXCI0NTZcIiwgcHJpY2U6IDYwODgwMCwgbW9kZWw6IFwiMTZHQlwiLCBzdG9ja1F0eTozfV1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIEl0ZW0uY3JlYXRlKCRzY29wZS5lbnRpdHkpLiRwcm9taXNlXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgJHNjb3BlLiRzdGF0ZS5nbygnYXBwLml0ZW0nKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgICRzY29wZS5zYXZlQW5kTW9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgSXRlbS5jcmVhdGUoJHNjb3BlLmVudGl0eSlcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgU3RvY2tEaWFsb2dDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICduZ0RpYWxvZycsICdTdG9jaycsICd0b2FzdGVyJywgJyRmaWx0ZXInXTtcbiAgICBmdW5jdGlvbiBTdG9ja0RpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCBuZ0RpYWxvZywgU3RvY2ssIHRvYXN0ZXIsICRmaWx0ZXIpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAkc2NvcGUuc3RvY2tRdHkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY29uZmlybSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgc2t1ID0gJHNjb3BlLm5nRGlhbG9nRGF0YS5za3U7XG4gICAgICAgICAgdmFyIHR5cGUgPSAkc2NvcGUubmdEaWFsb2dEYXRhLnR5cGU7XG4gICAgICAgICAgdmFyIG1lbW8gPSAkc2NvcGUubmdEaWFsb2dEYXRhLm1lbW87XG4gICAgICAgICAgU3RvY2suY3JlYXRlKHtza3VJZDogc2t1LmlkLCBxdHk6ICRzY29wZS5zdG9ja1F0eSwgdHlwZTogdHlwZSwgbWVtbzogbWVtb30pO1xuICAgICAgICAgIGlmKCFza3UuaW52ZW50b3JpZXNbMF0pIHtcbiAgICAgICAgICAgIHNrdS5pbnZlbnRvcmllc1swXSA9IHtxdHk6IDAsIG1vZGlmaWVkOiBuZXcgRGF0ZSgpfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2t1LmludmVudG9yaWVzWzBdLnF0eSArPSAkc2NvcGUuc3RvY2tRdHk7XG4gICAgICAgICAgbmdEaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICfmiJDlip8nLFxuICAgICAgICAgICBcIuWujOaIkFwiKyRmaWx0ZXIoJ3N0b2NrX3R5cGUnKSh0eXBlKStza3UuaXRlbS5uYW1lK1wiOiBcIiskc2NvcGUuc3RvY2tRdHkrXCLku7ZcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgU3RvY2tzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnU3RvY2snLCAnbmdUYWJsZVBhcmFtcyddO1xuICAgIGZ1bmN0aW9uIFN0b2Nrc0NvbnRyb2xsZXIoJHNjb3BlLCBTdG9jaywgbmdUYWJsZVBhcmFtcykge1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIFxuICAgICAgYWN0aXZlKCk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2ZSgpIHtcbiAgICAgICAgdm0uZmlsdGVyID0ge3RleHQ6ICcnfVxuICAgICAgICB2bS50YWJsZVBhcmFtcyA9IG5ldyBuZ1RhYmxlUGFyYW1zKHtcbiAgICAgICAgICBjb3VudDogMTAsXG4gICAgICAgICAgZmlsdGVyOiB2bS5maWx0ZXIudGV4dFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJGRlZmVyLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBvcHQgPSB7d2hlcmU6e30sIGluY2x1ZGU6Wydza3UnXX1cbiAgICAgICAgICAgIG9wdC5saW1pdCA9IHBhcmFtcy5jb3VudCgpXG4gICAgICAgICAgICBvcHQuc2tpcCA9IChwYXJhbXMucGFnZSgpLTEpKm9wdC5saW1pdFxuICAgICAgICAgICAgaWYodm0uZmlsdGVyLnRleHQgIT0gJycpIHtcbiAgICAgICAgICAgICAgb3B0LnNraXAgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgU3RvY2suY291bnQoe3doZXJlOiBvcHQud2hlcmV9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgIHZtLnRhYmxlUGFyYW1zLnRvdGFsKHJlc3VsdC5jb3VudClcbiAgICAgICAgICAgICAgU3RvY2suZmluZCh7ZmlsdGVyOm9wdH0sICRkZWZlci5yZXNvbHZlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxufSkoKTsiLCIvKipcbiAqIEFuZ3VsYXJKUyBkZWZhdWx0IGZpbHRlciB3aXRoIHRoZSBmb2xsb3dpbmcgZXhwcmVzc2lvbjpcbiAqIFwicGVyc29uIGluIHBlb3BsZSB8IGZpbHRlcjoge25hbWU6ICRzZWxlY3Quc2VhcmNoLCBhZ2U6ICRzZWxlY3Quc2VhcmNofVwiXG4gKiBwZXJmb3JtcyBhIEFORCBiZXR3ZWVuICduYW1lOiAkc2VsZWN0LnNlYXJjaCcgYW5kICdhZ2U6ICRzZWxlY3Quc2VhcmNoJy5cbiAqIFdlIHdhbnQgdG8gcGVyZm9ybSBhIE9SLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5pdGVtcycpXG4gICAgICAgIC5maWx0ZXIoJ2l0ZW1fdHlwZScsIGl0ZW1UeXBlRmlsdGVyKVxuICAgICAgICAuZmlsdGVyKCdzdG9ja190eXBlJywgc3RvY2tUeXBlRmlsdGVyKVxuICAgICAgICAuZmlsdGVyKCdjdXJyZW5jeV9jbnknLCBjdXJyZW5jeUNOWUZpbHRlcilcbiAgICA7XG5cbiAgICBmdW5jdGlvbiBpdGVtVHlwZUZpbHRlcigpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB7XG4gICAgICAgICAgZW50aXR5OiBcIuWunueJqeWVhuWTgVwiLFxuICAgICAgICAgIHNlcnZpY2U6IFwi5pyN5Yqh6aG555uuXCJcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjdXJyZW5jeUNOWUZpbHRlcigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHJldHVybiBcIsKlIFwiK3ZhbC8xMDA7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHN0b2NrVHlwZUZpbHRlcigpIHtcbiAgICAgIHZhciB0eXBlID0ge1xuICAgICAgICBzdG9jazogXCLov5votKflhaXlupNcIixcbiAgICAgICAgc2FsZTogXCLplIDllK7lh7rlupNcIixcbiAgICAgICAgY2FuY2VsOiBcIuaguOmUgOWHuuW6k1wiLFxuICAgICAgICBpbnZlbnRvcnk6IFwi55uY54K55L+u5q2jXCIsXG4gICAgICAgIHRyYW5zZmVyOiBcIuW6k+WtmOiwg+i0p1wiXG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBrZXkgPSBrZXkgfHwgJ3N0b2NrJztcbiAgICAgICAgcmV0dXJuIHR5cGVba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubGF6eWxvYWQnKVxyXG4gICAgICAgIC5jb25maWcobGF6eWxvYWRDb25maWcpO1xyXG5cclxuICAgIGxhenlsb2FkQ29uZmlnLiRpbmplY3QgPSBbJyRvY0xhenlMb2FkUHJvdmlkZXInLCAnQVBQX1JFUVVJUkVTJ107XHJcbiAgICBmdW5jdGlvbiBsYXp5bG9hZENvbmZpZygkb2NMYXp5TG9hZFByb3ZpZGVyLCBBUFBfUkVRVUlSRVMpe1xyXG5cclxuICAgICAgLy8gTGF6eSBMb2FkIG1vZHVsZXMgY29uZmlndXJhdGlvblxyXG4gICAgICAkb2NMYXp5TG9hZFByb3ZpZGVyLmNvbmZpZyh7XHJcbiAgICAgICAgZGVidWc6IGZhbHNlLFxyXG4gICAgICAgIGV2ZW50czogdHJ1ZSxcclxuICAgICAgICBtb2R1bGVzOiBBUFBfUkVRVUlSRVMubW9kdWxlc1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubGF6eWxvYWQnKVxyXG4gICAgICAgIC5jb25zdGFudCgnQVBQX1JFUVVJUkVTJywge1xyXG4gICAgICAgICAgLy8galF1ZXJ5IGJhc2VkIGFuZCBzdGFuZGFsb25lIHNjcmlwdHNcclxuICAgICAgICAgIHNjcmlwdHM6IHtcclxuICAgICAgICAgICAgJ3doaXJsJzogICAgICAgICAgICAgIFsndmVuZG9yL3doaXJsL2Rpc3Qvd2hpcmwuY3NzJ10sXHJcbiAgICAgICAgICAgICdjbGFzc3lsb2FkZXInOiAgICAgICBbJ3ZlbmRvci9qcXVlcnktY2xhc3N5bG9hZGVyL2pzL2pxdWVyeS5jbGFzc3lsb2FkZXIubWluLmpzJ10sXHJcbiAgICAgICAgICAgICdhbmltbyc6ICAgICAgICAgICAgICBbJ3ZlbmRvci9hbmltby5qcy9hbmltby5qcyddLFxyXG4gICAgICAgICAgICAnZmFzdGNsaWNrJzogICAgICAgICAgWyd2ZW5kb3IvZmFzdGNsaWNrL2xpYi9mYXN0Y2xpY2suanMnXSxcclxuICAgICAgICAgICAgJ21vZGVybml6cic6ICAgICAgICAgIFsndmVuZG9yL21vZGVybml6ci9tb2Rlcm5penIuanMnXSxcclxuICAgICAgICAgICAgJ2FuaW1hdGUnOiAgICAgICAgICAgIFsndmVuZG9yL2FuaW1hdGUuY3NzL2FuaW1hdGUubWluLmNzcyddLFxyXG4gICAgICAgICAgICAnc2t5Y29ucyc6ICAgICAgICAgICAgWyd2ZW5kb3Ivc2t5Y29ucy9za3ljb25zLmpzJ10sXHJcbiAgICAgICAgICAgICdpY29ucyc6ICAgICAgICAgICAgICBbJ3ZlbmRvci9mb250YXdlc29tZS9jc3MvZm9udC1hd2Vzb21lLm1pbi5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3Ivc2ltcGxlLWxpbmUtaWNvbnMvY3NzL3NpbXBsZS1saW5lLWljb25zLmNzcyddLFxyXG4gICAgICAgICAgICAnd2VhdGhlci1pY29ucyc6ICAgICAgWyd2ZW5kb3Ivd2VhdGhlci1pY29ucy9jc3Mvd2VhdGhlci1pY29ucy5taW4uY3NzJ10sXHJcbiAgICAgICAgICAgICdzcGFya2xpbmVzJzogICAgICAgICBbJ2FwcC92ZW5kb3Ivc3BhcmtsaW5lcy9qcXVlcnkuc3BhcmtsaW5lLm1pbi5qcyddLFxyXG4gICAgICAgICAgICAnd3lzaXd5Zyc6ICAgICAgICAgICAgWyd2ZW5kb3IvYm9vdHN0cmFwLXd5c2l3eWcvYm9vdHN0cmFwLXd5c2l3eWcuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYm9vdHN0cmFwLXd5c2l3eWcvZXh0ZXJuYWwvanF1ZXJ5LmhvdGtleXMuanMnXSxcclxuICAgICAgICAgICAgJ3NsaW1zY3JvbGwnOiAgICAgICAgIFsndmVuZG9yL3NsaW1TY3JvbGwvanF1ZXJ5LnNsaW1zY3JvbGwubWluLmpzJ10sXHJcbiAgICAgICAgICAgICdzY3JlZW5mdWxsJzogICAgICAgICBbJ3ZlbmRvci9zY3JlZW5mdWxsL2Rpc3Qvc2NyZWVuZnVsbC5qcyddLFxyXG4gICAgICAgICAgICAndmVjdG9yLW1hcCc6ICAgICAgICAgWyd2ZW5kb3IvaWthLmp2ZWN0b3JtYXAvanF1ZXJ5LWp2ZWN0b3JtYXAtMS4yLjIubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2lrYS5qdmVjdG9ybWFwL2pxdWVyeS1qdmVjdG9ybWFwLTEuMi4yLmNzcyddLFxyXG4gICAgICAgICAgICAndmVjdG9yLW1hcC1tYXBzJzogICAgWyd2ZW5kb3IvaWthLmp2ZWN0b3JtYXAvanF1ZXJ5LWp2ZWN0b3JtYXAtd29ybGQtbWlsbC1lbi5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9pa2EuanZlY3Rvcm1hcC9qcXVlcnktanZlY3Rvcm1hcC11cy1taWxsLWVuLmpzJ10sXHJcbiAgICAgICAgICAgICdsb2FkR29vZ2xlTWFwc0pTJzogICBbJ2FwcC92ZW5kb3IvZ21hcC9sb2FkLWdvb2dsZS1tYXBzLmpzJ10sXHJcbiAgICAgICAgICAgICdmbG90LWNoYXJ0JzogICAgICAgICBbJ3ZlbmRvci9GbG90L2pxdWVyeS5mbG90LmpzJ10sXHJcbiAgICAgICAgICAgICdmbG90LWNoYXJ0LXBsdWdpbnMnOiBbJ3ZlbmRvci9mbG90LnRvb2x0aXAvanMvanF1ZXJ5LmZsb3QudG9vbHRpcC5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvRmxvdC9qcXVlcnkuZmxvdC5yZXNpemUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvRmxvdC9qcXVlcnkuZmxvdC5waWUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvRmxvdC9qcXVlcnkuZmxvdC50aW1lLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL0Zsb3QvanF1ZXJ5LmZsb3QuY2F0ZWdvcmllcy5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9mbG90LXNwbGluZS9qcy9qcXVlcnkuZmxvdC5zcGxpbmUubWluLmpzJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBqcXVlcnkgY29yZSBhbmQgd2lkZ2V0c1xyXG4gICAgICAgICAgICAnanF1ZXJ5LXVpJzogICAgICAgICAgWyd2ZW5kb3IvanF1ZXJ5LXVpL3VpL2NvcmUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvanF1ZXJ5LXVpL3VpL3dpZGdldC5qcyddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxvYWRzIG9ubHkganF1ZXJ5IHJlcXVpcmVkIG1vZHVsZXMgYW5kIHRvdWNoIHN1cHBvcnRcclxuICAgICAgICAgICAgJ2pxdWVyeS11aS13aWRnZXRzJzogIFsndmVuZG9yL2pxdWVyeS11aS91aS9jb3JlLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2pxdWVyeS11aS91aS93aWRnZXQuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvanF1ZXJ5LXVpL3VpL21vdXNlLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2pxdWVyeS11aS91aS9kcmFnZ2FibGUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvanF1ZXJ5LXVpL3VpL2Ryb3BwYWJsZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9qcXVlcnktdWkvdWkvc29ydGFibGUuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvanF1ZXJ5dWktdG91Y2gtcHVuY2gvanF1ZXJ5LnVpLnRvdWNoLXB1bmNoLm1pbi5qcyddLFxyXG4gICAgICAgICAgICAnbW9tZW50JyA6ICAgICAgICAgICAgWyd2ZW5kb3IvbW9tZW50L21pbi9tb21lbnQtd2l0aC1sb2NhbGVzLm1pbi5qcyddLFxyXG4gICAgICAgICAgICAnaW5wdXRtYXNrJzogICAgICAgICAgWyd2ZW5kb3IvanF1ZXJ5LmlucHV0bWFzay9kaXN0L2pxdWVyeS5pbnB1dG1hc2suYnVuZGxlLm1pbi5qcyddLFxyXG4gICAgICAgICAgICAnZmxhdGRvYyc6ICAgICAgICAgICAgWyd2ZW5kb3IvZmxhdGRvYy9mbGF0ZG9jLmpzJ10sXHJcbiAgICAgICAgICAgICdjb2RlbWlycm9yJzogICAgICAgICBbJ3ZlbmRvci9jb2RlbWlycm9yL2xpYi9jb2RlbWlycm9yLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2NvZGVtaXJyb3IvbGliL2NvZGVtaXJyb3IuY3NzJ10sXHJcbiAgICAgICAgICAgIC8vIG1vZGVzIGZvciBjb21tb24gd2ViIGZpbGVzXHJcbiAgICAgICAgICAgICdjb2RlbWlycm9yLW1vZGVzLXdlYic6IFsndmVuZG9yL2NvZGVtaXJyb3IvbW9kZS9qYXZhc2NyaXB0L2phdmFzY3JpcHQuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9jb2RlbWlycm9yL21vZGUveG1sL3htbC5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2NvZGVtaXJyb3IvbW9kZS9odG1sbWl4ZWQvaHRtbG1peGVkLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvY29kZW1pcnJvci9tb2RlL2Nzcy9jc3MuanMnXSxcclxuICAgICAgICAgICAgJ3RhZ2lucHV0JyA6ICAgICAgICAgIFsndmVuZG9yL2Jvb3RzdHJhcC10YWdzaW5wdXQvZGlzdC9ib290c3RyYXAtdGFnc2lucHV0LmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9ib290c3RyYXAtdGFnc2lucHV0L2Rpc3QvYm9vdHN0cmFwLXRhZ3NpbnB1dC5taW4uanMnXSxcclxuICAgICAgICAgICAgJ2ZpbGVzdHlsZSc6ICAgICAgICAgIFsndmVuZG9yL2Jvb3RzdHJhcC1maWxlc3R5bGUvc3JjL2Jvb3RzdHJhcC1maWxlc3R5bGUuanMnXSxcclxuICAgICAgICAgICAgJ3BhcnNsZXknOiAgICAgICAgICAgIFsndmVuZG9yL3BhcnNsZXlqcy9zcmMvaTE4bi96aF9jbi5leHRyYS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9wYXJzbGV5anMvZGlzdC9wYXJzbGV5Lm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9wYXJzbGV5anMvc3JjL2kxOG4vemhfY24uanMnXSxcclxuICAgICAgICAgICAgJ2Z1bGxjYWxlbmRhcic6ICAgICAgIFsndmVuZG9yL2Z1bGxjYWxlbmRhci9kaXN0L2Z1bGxjYWxlbmRhci5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvZnVsbGNhbGVuZGFyL2Rpc3QvZnVsbGNhbGVuZGFyLmNzcyddLFxyXG4gICAgICAgICAgICAnZ2NhbCc6ICAgICAgICAgICAgICAgWyd2ZW5kb3IvZnVsbGNhbGVuZGFyL2Rpc3QvZ2NhbC5qcyddLFxyXG4gICAgICAgICAgICAnY2hhcnRqcyc6ICAgICAgICAgICAgWyd2ZW5kb3IvQ2hhcnQuanMvQ2hhcnQuanMnXSxcclxuICAgICAgICAgICAgJ21vcnJpcyc6ICAgICAgICAgICAgIFsndmVuZG9yL3JhcGhhZWwvcmFwaGFlbC5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9tb3JyaXMuanMvbW9ycmlzLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL21vcnJpcy5qcy9tb3JyaXMuY3NzJ10sXHJcbiAgICAgICAgICAgICdsb2FkZXJzLmNzcyc6ICAgICAgICAgIFsndmVuZG9yL2xvYWRlcnMuY3NzL2xvYWRlcnMuY3NzJ10sXHJcbiAgICAgICAgICAgICdzcGlua2l0JzogICAgICAgICAgICAgIFsndmVuZG9yL3NwaW5raXQvY3NzL3NwaW5raXQuY3NzJ11cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAvLyBBbmd1bGFyIGJhc2VkIHNjcmlwdCAodXNlIHRoZSByaWdodCBtb2R1bGUgbmFtZSlcclxuICAgICAgICAgIG1vZHVsZXM6IFtcclxuICAgICAgICAgICAge25hbWU6ICd0b2FzdGVyJywgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2FuZ3VsYXJqcy10b2FzdGVyL3RvYXN0ZXIuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyanMtdG9hc3Rlci90b2FzdGVyLmNzcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICdsb2NhbHl0aWNzLmRpcmVjdGl2ZXMnLCAgICAgZmlsZXM6IFsndmVuZG9yL2Nob3Nlbl92MS4yLjAvY2hvc2VuLmpxdWVyeS5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9jaG9zZW5fdjEuMi4wL2Nob3Nlbi5taW4uY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1jaG9zZW4tbG9jYWx5dGljcy9jaG9zZW4uanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnbmdEaWFsb2cnLCAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9uZ0RpYWxvZy9qcy9uZ0RpYWxvZy5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9uZ0RpYWxvZy9jc3MvbmdEaWFsb2cubWluLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL25nRGlhbG9nL2Nzcy9uZ0RpYWxvZy10aGVtZS1kZWZhdWx0Lm1pbi5jc3MnXSB9LFxyXG4gICAgICAgICAgICB7bmFtZTogJ25nV2lnJywgICAgICAgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvbmdXaWcvZGlzdC9uZy13aWcubWluLmpzJ10gfSxcclxuICAgICAgICAgICAge25hbWU6ICduZ1RhYmxlJywgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL25nLXRhYmxlL2Rpc3QvbmctdGFibGUubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL25nLXRhYmxlL2Rpc3QvbmctdGFibGUubWluLmNzcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICduZ1RhYmxlRXhwb3J0JywgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL25nLXRhYmxlLWV4cG9ydC9uZy10YWJsZS1leHBvcnQuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnYW5ndWxhckJvb3RzdHJhcE5hdlRyZWUnLCAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLWJvb3RzdHJhcC1uYXYtdHJlZS9kaXN0L2Fibl90cmVlX2RpcmVjdGl2ZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLWJvb3RzdHJhcC1uYXYtdHJlZS9kaXN0L2Fibl90cmVlLmNzcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICdodG1sU29ydGFibGUnLCAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2h0bWwuc29ydGFibGUvZGlzdC9odG1sLnNvcnRhYmxlLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2h0bWwuc29ydGFibGUvZGlzdC9odG1sLnNvcnRhYmxlLmFuZ3VsYXIuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAneGVkaXRhYmxlJywgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLXhlZGl0YWJsZS9kaXN0L2pzL3hlZGl0YWJsZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLXhlZGl0YWJsZS9kaXN0L2Nzcy94ZWRpdGFibGUuY3NzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2FuZ3VsYXJGaWxlVXBsb2FkJywgICAgICAgICBmaWxlczogWyd2ZW5kb3IvYW5ndWxhci1maWxlLXVwbG9hZC9hbmd1bGFyLWZpbGUtdXBsb2FkLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ25nSW1nQ3JvcCcsICAgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvbmctaW1nLWNyb3AvY29tcGlsZS91bm1pbmlmaWVkL25nLWltZy1jcm9wLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL25nLWltZy1jcm9wL2NvbXBpbGUvdW5taW5pZmllZC9uZy1pbWctY3JvcC5jc3MnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAndWkuc2VsZWN0JywgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLXVpLXNlbGVjdC9kaXN0L3NlbGVjdC5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLXVpLXNlbGVjdC9kaXN0L3NlbGVjdC5jc3MnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAndWkuY29kZW1pcnJvcicsICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLXVpLWNvZGVtaXJyb3IvdWktY29kZW1pcnJvci5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICdhbmd1bGFyLWNhcm91c2VsJywgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2FuZ3VsYXItY2Fyb3VzZWwvZGlzdC9hbmd1bGFyLWNhcm91c2VsLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLWNhcm91c2VsL2Rpc3QvYW5ndWxhci1jYXJvdXNlbC5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICduZ0dyaWQnLCAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL25nLWdyaWQvYnVpbGQvbmctZ3JpZC5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvbmctZ3JpZC9uZy1ncmlkLmNzcycgXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnaW5maW5pdGUtc2Nyb2xsJywgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9uZ0luZmluaXRlU2Nyb2xsL2J1aWxkL25nLWluZmluaXRlLXNjcm9sbC5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICd1aS5ib290c3RyYXAtc2xpZGVyJywgICAgICAgZmlsZXM6IFsndmVuZG9yL3NlaXlyaWEtYm9vdHN0cmFwLXNsaWRlci9kaXN0L2Jvb3RzdHJhcC1zbGlkZXIubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3NlaXlyaWEtYm9vdHN0cmFwLXNsaWRlci9kaXN0L2Nzcy9ib290c3RyYXAtc2xpZGVyLm1pbi5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1ib290c3RyYXAtc2xpZGVyL3NsaWRlci5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICd1aS5ncmlkJywgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2FuZ3VsYXItdWktZ3JpZC91aS1ncmlkLm1pbi5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci11aS1ncmlkL3VpLWdyaWQubWluLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ3RleHRBbmd1bGFyJywgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvdGV4dEFuZ3VsYXIvZGlzdC90ZXh0QW5ndWxhci5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvdGV4dEFuZ3VsYXIvZGlzdC90ZXh0QW5ndWxhci1yYW5neS5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvdGV4dEFuZ3VsYXIvZGlzdC90ZXh0QW5ndWxhci1zYW5pdGl6ZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci90ZXh0QW5ndWxhci9zcmMvZ2xvYmFscy5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci90ZXh0QW5ndWxhci9zcmMvZmFjdG9yaWVzLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3RleHRBbmd1bGFyL3NyYy9ET00uanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvdGV4dEFuZ3VsYXIvc3JjL3ZhbGlkYXRvcnMuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvdGV4dEFuZ3VsYXIvc3JjL3RhQmluZC5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci90ZXh0QW5ndWxhci9zcmMvbWFpbi5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci90ZXh0QW5ndWxhci9kaXN0L3RleHRBbmd1bGFyU2V0dXAuanMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgc2VyaWU6IHRydWV9LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2FuZ3VsYXItcmlja3NoYXcnLCAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvZDMvZDMubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3JpY2tzaGF3L3JpY2tzaGF3LmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL3JpY2tzaGF3L3JpY2tzaGF3Lm1pbi5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1yaWNrc2hhdy9yaWNrc2hhdy5qcyddLCBzZXJpZTogdHJ1ZX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnYW5ndWxhci1jaGFydGlzdCcsICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9jaGFydGlzdC9kaXN0L2NoYXJ0aXN0Lm1pbi5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvY2hhcnRpc3QvZGlzdC9jaGFydGlzdC5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLWNoYXJ0aXN0LmpzL2Rpc3QvYW5ndWxhci1jaGFydGlzdC5qcyddLCBzZXJpZTogdHJ1ZX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAndWkubWFwJywgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLXVpLW1hcC91aS1tYXAuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnZGF0YXRhYmxlcycsICAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9kYXRhdGFibGVzL21lZGlhL2Nzcy9qcXVlcnkuZGF0YVRhYmxlcy5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvZGF0YXRhYmxlcy9tZWRpYS9qcy9qcXVlcnkuZGF0YVRhYmxlcy5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLWRhdGF0YWJsZXMvZGlzdC9hbmd1bGFyLWRhdGF0YWJsZXMuanMnXSwgc2VyaWU6IHRydWV9LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2FuZ3VsYXItanFjbG91ZCcsICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvanFjbG91ZDIvZGlzdC9qcWNsb3VkLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9qcWNsb3VkMi9kaXN0L2pxY2xvdWQuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYW5ndWxhci1qcWNsb3VkL2FuZ3VsYXItanFjbG91ZC5qcyddfSxcclxuICAgICAgICAgICAge25hbWU6ICdhbmd1bGFyR3JpZCcsICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2FnLWdyaWQvZGlzdC9hbmd1bGFyLWdyaWQuY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FnLWdyaWQvZGlzdC9hbmd1bGFyLWdyaWQuanMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3IvYWctZ3JpZC9kaXN0L3RoZW1lLWRhcmsuY3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FnLWdyaWQvZGlzdC90aGVtZS1mcmVzaC5jc3MnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnbmctbmVzdGFibGUnLCAgICAgICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9uZy1uZXN0YWJsZS9zcmMvYW5ndWxhci1uZXN0YWJsZS5qcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9uZXN0YWJsZS9qcXVlcnkubmVzdGFibGUuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnYWtvZW5pZy5kZWNrZ3JpZCcsICAgICAgICAgIGZpbGVzOiBbJ3ZlbmRvci9hbmd1bGFyLWRlY2tncmlkL2FuZ3VsYXItZGVja2dyaWQuanMnXX0sXHJcbiAgICAgICAgICAgIHtuYW1lOiAnb2l0b3plcm8ubmdTd2VldEFsZXJ0JywgICAgIGZpbGVzOiBbJ3ZlbmRvci9zd2VldGFsZXJ0L2Rpc3Qvc3dlZXRhbGVydC5jc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2ZW5kb3Ivc3dlZXRhbGVydC9kaXN0L3N3ZWV0YWxlcnQubWluLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FuZ3VsYXItc3dlZXRhbGVydC9Td2VldEFsZXJ0LmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2JtLmJzVG91cicsICAgICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvYm9vdHN0cmFwLXRvdXIvYnVpbGQvY3NzL2Jvb3RzdHJhcC10b3VyLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9ib290c3RyYXAtdG91ci9idWlsZC9qcy9ib290c3RyYXAtdG91ci1zdGFuZGFsb25lLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2FuZ3VsYXItYm9vdHN0cmFwLXRvdXIvZGlzdC9hbmd1bGFyLWJvb3RzdHJhcC10b3VyLmpzJ10sIHNlcmllOiB0cnVlfSxcclxuICAgICAgICAgICAge25hbWU6ICd1aS5rbm9iJywgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsndmVuZG9yL2FuZ3VsYXIta25vYi9zcmMvYW5ndWxhci1rbm9iLmpzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVuZG9yL2pxdWVyeS1rbm9iL2Rpc3QvanF1ZXJ5Lmtub2IubWluLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2Vhc3lwaWVjaGFydCcsICAgICAgICAgICAgICBmaWxlczogWyd2ZW5kb3IvanF1ZXJ5LmVhc3ktcGllLWNoYXJ0L2Rpc3QvYW5ndWxhci5lYXN5cGllY2hhcnQubWluLmpzJ119LFxyXG4gICAgICAgICAgICB7bmFtZTogJ2NvbG9ycGlja2VyLm1vZHVsZScsICAgICAgICBmaWxlczogWyd2ZW5kb3IvYW5ndWxhci1ib290c3RyYXAtY29sb3JwaWNrZXIvY3NzL2NvbG9ycGlja2VyLmNzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci9hbmd1bGFyLWJvb3RzdHJhcC1jb2xvcnBpY2tlci9qcy9ib290c3RyYXAtY29sb3JwaWNrZXItbW9kdWxlLmpzJ119XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sb2FkaW5nYmFyJylcclxuICAgICAgICAuY29uZmlnKGxvYWRpbmdiYXJDb25maWcpXHJcbiAgICAgICAgO1xyXG4gICAgbG9hZGluZ2JhckNvbmZpZy4kaW5qZWN0ID0gWydjZnBMb2FkaW5nQmFyUHJvdmlkZXInXTtcclxuICAgIGZ1bmN0aW9uIGxvYWRpbmdiYXJDb25maWcoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcclxuICAgICAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVCYXIgPSB0cnVlO1xyXG4gICAgICBjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcclxuICAgICAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmxhdGVuY3lUaHJlc2hvbGQgPSA1MDA7XHJcbiAgICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5wYXJlbnRTZWxlY3RvciA9ICcud3JhcHBlciA+IHNlY3Rpb24nO1xyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmxvYWRpbmdiYXInKVxyXG4gICAgICAgIC5ydW4obG9hZGluZ2JhclJ1bilcclxuICAgICAgICA7XHJcbiAgICBsb2FkaW5nYmFyUnVuLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnLCAnY2ZwTG9hZGluZ0JhciddO1xyXG4gICAgZnVuY3Rpb24gbG9hZGluZ2JhclJ1bigkcm9vdFNjb3BlLCAkdGltZW91dCwgY2ZwTG9hZGluZ0Jhcil7XHJcblxyXG4gICAgICAvLyBMb2FkaW5nIGJhciB0cmFuc2l0aW9uXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG4gICAgICB2YXIgdGhCYXI7XHJcbiAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaWYoJCgnLndyYXBwZXIgPiBzZWN0aW9uJykubGVuZ3RoKSAvLyBjaGVjayBpZiBiYXIgY29udGFpbmVyIGV4aXN0c1xyXG4gICAgICAgICAgICB0aEJhciA9ICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIGNmcExvYWRpbmdCYXIuc3RhcnQoKTtcclxuICAgICAgICAgICAgfSwgMCk7IC8vIHNldHMgYSBsYXRlbmN5IFRocmVzaG9sZFxyXG4gICAgICB9KTtcclxuICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgZXZlbnQudGFyZ2V0U2NvcGUuJHdhdGNoKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aEJhcik7XHJcbiAgICAgICAgICAgIGNmcExvYWRpbmdCYXIuY29tcGxldGUoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmxvY2FsZScpXHJcbiAgICAgICAgLmNvbmZpZyhsb2NhbGVDb25maWcpXHJcbiAgICAgICAgO1xyXG4gICAgbG9jYWxlQ29uZmlnLiRpbmplY3QgPSBbJ3RtaER5bmFtaWNMb2NhbGVQcm92aWRlciddO1xyXG4gICAgZnVuY3Rpb24gbG9jYWxlQ29uZmlnKHRtaER5bmFtaWNMb2NhbGVQcm92aWRlcil7XHJcbiAgXHJcbiAgICAgIHRtaER5bmFtaWNMb2NhbGVQcm92aWRlci5kZWZhdWx0TG9jYWxlKCd6aCcpO1xyXG4gICAgICB0bWhEeW5hbWljTG9jYWxlUHJvdmlkZXIubG9jYWxlTG9jYXRpb25QYXR0ZXJuKCd2ZW5kb3IvYW5ndWxhci1pMThuL2FuZ3VsYXItbG9jYWxlX3t7bG9jYWxlfX0uanMnKTtcclxuICAgICAgLy8gdG1oRHluYW1pY0xvY2FsZVByb3ZpZGVyLnVzZVN0b3JhZ2UoJyRjb29raWVTdG9yZScpO1xyXG5cclxuICAgIH1cclxufSkoKTsiLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBsb2NhbGUuanNcclxuICogRGVtbyBmb3IgbG9jYWxlIHNldHRpbmdzXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sb2NhbGUnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMb2NhbGl6YXRpb25Db250cm9sbGVyJywgTG9jYWxpemF0aW9uQ29udHJvbGxlcik7XHJcblxyXG4gICAgTG9jYWxpemF0aW9uQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ3RtaER5bmFtaWNMb2NhbGUnLCAnJGxvY2FsZSddO1xyXG4gICAgZnVuY3Rpb24gTG9jYWxpemF0aW9uQ29udHJvbGxlcigkcm9vdFNjb3BlLCB0bWhEeW5hbWljTG9jYWxlLCAkbG9jYWxlKSB7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAkcm9vdFNjb3BlLmF2YWlsYWJsZUxvY2FsZXMgPSB7XHJcbiAgICAgICAgICAgICdlbic6ICdFbmdsaXNoJyxcclxuICAgICAgICAgICAgJ2VzJzogJ1NwYW5pc2gnLFxyXG4gICAgICAgICAgICAnZGUnOiAnR2VybWFuJyxcclxuICAgICAgICAgICAgJ2ZyJzogJ0ZyZW5jaCcsXHJcbiAgICAgICAgICAgICdhcic6ICdBcmFiaWMnLFxyXG4gICAgICAgICAgICAnamEnOiAnSmFwYW5lc2UnLFxyXG4gICAgICAgICAgICAna28nOiAnS29yZWFuJyxcclxuICAgICAgICAgICAgJ3poJzogJ0NoaW5lc2UnfTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgJHJvb3RTY29wZS5tb2RlbCA9IHtzZWxlY3RlZExvY2FsZTogJ3poJ307XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICRyb290U2NvcGUuJGxvY2FsZSA9ICRsb2NhbGU7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICRyb290U2NvcGUuY2hhbmdlTG9jYWxlID0gdG1oRHluYW1pY0xvY2FsZS5zZXQ7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgIC5tb2R1bGUoJ2FwcC5tZW1iZXJzJylcbiAgICAgIC5jb250cm9sbGVyKCdNZW1iZXJzQ29udHJvbGxlcicsIE1lbWJlcnNDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ01lbWJlckNvbnRyb2xsZXInLCBNZW1iZXJDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ3JlY2hhcmdlRGlhbG9nQ29udHJvbGxlcicsIHJlY2hhcmdlRGlhbG9nQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdib251c0RpYWxvZ0NvbnRyb2xsZXInLCBib251c0RpYWxvZ0NvbnRyb2xsZXIpXG4gICAgO1xuICAgICAgXG4gICAgTWVtYmVyc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ01lbWJlcicsICduZ1RhYmxlUGFyYW1zJywgJ25nVGFibGVMQlNlcnZpY2UnLCAnU3dlZXRBbGVydCcsICdxcmNvZGVTZXJ2aWNlJywgJ2RlYWxTZXJ2aWNlJ107XG4gICAgZnVuY3Rpb24gTWVtYmVyc0NvbnRyb2xsZXIoJHNjb3BlLCBNZW1iZXIsIG5nVGFibGVQYXJhbXMsIG5nVGFibGVMQlNlcnZpY2UsIFN3ZWV0QWxlcnQsIHFyY29kZVNlcnZpY2UsIGRlYWxTZXJ2aWNlKSB7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgXG4gICAgICBhY3RpdmF0ZSgpO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgJHNjb3BlLnFyY29kZVNlcnZpY2UgPSBxcmNvZGVTZXJ2aWNlO1xuICAgICAgICB2bS5rZXl3b3JkID0gXCJcIjtcbiAgICAgICAgdm0udGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7Y291bnQ6IDEwfSwge1xuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCRkZWZlciwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyID0ge3doZXJlOntzdGF0dXM6e25lOidkZWxldGVkJ319LCBpbmNsdWRlOlsnd3h1c2VyJ119XG4gICAgICAgICAgICBpZih2bS5rZXl3b3JkICE9ICcnKSB7XG4gICAgICAgICAgICAgIHZhciBxcyA9IHtyZWdleDoga2V5d29yZH07XG4gICAgICAgICAgICAgIGZpbHRlci53aGVyZS5vciA9IFt7XCJlbnRpdGllcy5za3UuaXRlbS5uYW1lXCI6cXN9XTtcbiAgICAgICAgICAgICAgcGFyYW1zLnBhZ2UoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZ1RhYmxlTEJTZXJ2aWNlLmdldERhdGEoJGRlZmVyLCBwYXJhbXMsIE1lbWJlciwgZmlsdGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5zZWxsID0gZnVuY3Rpb24gKG1lbWJlcikge1xuICAgICAgICBkZWFsU2VydmljZS5vcGVuRGVhbChtZW1iZXIpO1xuICAgICAgICAkc2NvcGUuJHN0YXRlLmdvKCdhcHAuc2VsbCcpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBNZW1iZXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdNZW1iZXInLCAnbmdUYWJsZVBhcmFtcycsICduZ1RhYmxlTEJTZXJ2aWNlJywgJ1N3ZWV0QWxlcnQnLCAnZGVhbFNlcnZpY2UnLCAnbmdEaWFsb2cnXTtcbiAgICBmdW5jdGlvbiBNZW1iZXJDb250cm9sbGVyKCRzY29wZSwgTWVtYmVyLCBuZ1RhYmxlUGFyYW1zLCBuZ1RhYmxlTEJTZXJ2aWNlLCBTd2VldEFsZXJ0LCBkZWFsU2VydmljZSwgbmdEaWFsb2cpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2YXIgbWVtYmVySWQgPSAkc2NvcGUuJHN0YXRlLnBhcmFtcy5tZW1iZXJJZDtcbiAgICAgICAgICAgIFxuICAgICAgdm0uZGVhbFRhYmxlUGFyYW1zID0gbmV3IG5nVGFibGVQYXJhbXMoe1xuICAgICAgICBjb3VudDogMTBcbiAgICAgIH0sIHtcbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJGRlZmVyLCBwYXJhbXMpIHtcbiAgICAgICAgICB2YXIgb3B0ID0ge3doZXJlOntzdGF0dXM6e25lOidkZWxldGVkJ319fVxuICAgICAgICAgIG9wdC5saW1pdCA9IHBhcmFtcy5jb3VudCgpXG4gICAgICAgICAgb3B0LnNraXAgPSAocGFyYW1zLnBhZ2UoKS0xKSpvcHQubGltaXRcbiAgICAgICAgICBNZW1iZXIuZGVhbHMuY291bnQoe2lkOiBtZW1iZXJJZCwgd2hlcmU6IG9wdC53aGVyZX0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHZtLmRlYWxUYWJsZVBhcmFtcy50b3RhbChyZXN1bHQuY291bnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIE1lbWJlci5kZWFscyh7aWQ6IG1lbWJlcklkLCBmaWx0ZXI6b3B0fSwgJGRlZmVyLnJlc29sdmUpO1xuICAgICAgICB9XG4gICAgICB9KTsgICAgIFxuICAgICAgXG4gICAgICB2bS5kZXBvc2l0VGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7XG4gICAgICAgIGNvdW50OiAxMFxuICAgICAgfSwge1xuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbigkZGVmZXIsIHBhcmFtcykge1xuICAgICAgICAgIHZhciBvcHQgPSB7XG4gICAgICAgICAgICB3aGVyZTp7c3RhdHVzOntuZTonZGVsZXRlZCd9LCBvcjpbe3R5cGU6ICdkZXBvc2l0J30sIHtjYXRlZ29yeTogJ2RlcG9zaXQnfV19LFxuICAgICAgICAgICAgaW5jbHVkZTogWydzaG9wJ11cbiAgICAgICAgICB9XG4gICAgICAgICAgb3B0LmxpbWl0ID0gcGFyYW1zLmNvdW50KClcbiAgICAgICAgICBvcHQuc2tpcCA9IChwYXJhbXMucGFnZSgpLTEpKm9wdC5saW1pdFxuICAgICAgICAgIE1lbWJlci5wYXltZW50cy5jb3VudCh7aWQ6IG1lbWJlcklkLCB3aGVyZTogb3B0LndoZXJlfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgdm0uZGVwb3NpdFRhYmxlUGFyYW1zLnRvdGFsKHJlc3VsdC5jb3VudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgTWVtYmVyLnBheW1lbnRzKHtpZDogbWVtYmVySWQsIGZpbHRlcjpvcHR9LCAkZGVmZXIucmVzb2x2ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB2bS5ib251c1RhYmxlUGFyYW1zID0gbmV3IG5nVGFibGVQYXJhbXMoe1xuICAgICAgICBjb3VudDogMTBcbiAgICAgIH0sIHtcbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJGRlZmVyLCBwYXJhbXMpIHtcbiAgICAgICAgICB2YXIgb3B0ID0ge1xuICAgICAgICAgICAgd2hlcmU6e3N0YXR1czp7bmU6J2RlbGV0ZWQnfX0sXG4gICAgICAgICAgICBpbmNsdWRlOiBbXVxuICAgICAgICAgIH1cbiAgICAgICAgICBvcHQubGltaXQgPSBwYXJhbXMuY291bnQoKVxuICAgICAgICAgIG9wdC5za2lwID0gKHBhcmFtcy5wYWdlKCktMSkqb3B0LmxpbWl0XG4gICAgICAgICAgTWVtYmVyLmJvbnVzZXMuY291bnQoe2lkOiBtZW1iZXJJZCwgd2hlcmU6IG9wdC53aGVyZX0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHZtLmJvbnVzVGFibGVQYXJhbXMudG90YWwocmVzdWx0LmNvdW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBNZW1iZXIuYm9udXNlcyh7aWQ6IG1lbWJlcklkLCBmaWx0ZXI6b3B0fSwgJGRlZmVyLnJlc29sdmUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIFxuICAgICAgICBtZW1iZXJJZCA9ICRzY29wZS4kc3RhdGUucGFyYW1zLm1lbWJlcklkO1xuXG4gICAgICAgIHZtLm1lbWJlciA9IE1lbWJlci5maW5kT25lKHtmaWx0ZXI6IHtcbiAgICAgICAgICB3aGVyZToge2lkOiBtZW1iZXJJZH0sIFxuICAgICAgICAgIGluY2x1ZGU6Wyd3eHVzZXInXVxuICAgICAgICB9fSk7XG4gICAgICAgIFxuICAgICAgICB2bS5kZWFsVGFibGVQYXJhbXMucmVsb2FkKCk7XG4gICAgICAgIHZtLmRlcG9zaXRUYWJsZVBhcmFtcy5yZWxvYWQoKTtcbiAgICAgICAgdm0uYm9udXNUYWJsZVBhcmFtcy5yZWxvYWQoKTtcbiAgICAgIH1cblxuICAgICAgdm0uc2VsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVhbFNlcnZpY2Uub3BlbkRlYWwodm0ubWVtYmVyKTtcbiAgICAgICAgJHNjb3BlLiRzdGF0ZS5nbygnYXBwLnNlbGwnKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdm0ucmVjaGFyZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG5nRGlhbG9nLm9wZW4oeyBcbiAgICAgICAgICB0ZW1wbGF0ZTogJ3JlY2hhcmdlRGlhbG9nSWQnLCBcbiAgICAgICAgICBjb250cm9sbGVyOiAncmVjaGFyZ2VEaWFsb2dDb250cm9sbGVyJ1xuICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGFjdGl2YXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5zZXRCb251cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbmdEaWFsb2cub3Blbih7IFxuICAgICAgICAgIHRlbXBsYXRlOiAnYm9udXNEaWFsb2dJZCcsIFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdib251c0RpYWxvZ0NvbnRyb2xsZXInXG4gICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgYWN0aXZhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJlY2hhcmdlRGlhbG9nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnbmdEaWFsb2cnLCAnTWVtYmVyJywgJ3RvYXN0ZXInLCAnZGVhbFNlcnZpY2UnXTtcbiAgICBmdW5jdGlvbiByZWNoYXJnZURpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCBuZ0RpYWxvZywgTWVtYmVyLCB0b2FzdGVyLCBkZWFsU2VydmljZSkge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIHZhciBtZW1iZXJJZCA9ICRzY29wZS4kc3RhdGUucGFyYW1zLm1lbWJlcklkO1xuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICBtZW1iZXJJZCA9ICRzY29wZS4kc3RhdGUucGFyYW1zLm1lbWJlcklkO1xuICAgICAgICAgICRzY29wZS5tZW1iZXIgPSBNZW1iZXIuZmluZEJ5SWQoe2lkOm1lbWJlcklkfSk7XG4gICAgICAgICAgJHNjb3BlLmRhdGEgPSB7XG4gICAgICAgICAgICB0eXBlOiAnY2FzaCcsIFxuICAgICAgICAgICAgYW1vdW50OiAwLFxuICAgICAgICAgICAgY2F0ZWdvcnk6ICdkZXBvc2l0J1xuICAgICAgICAgIH07XG4gICAgICAgICAgJHNjb3BlLnBheVR5cGUgPSBkZWFsU2VydmljZS5wYXlUeXBlO1xuICAgICAgICAgICRzY29wZS5jYXNoID0ge1xuICAgICAgICAgICAgcGFpZDogMCxcbiAgICAgICAgICAgIGNoYW5nZTogMCxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5vbkNoYW5nZVBheVR5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYoZGF0YS50eXBlID09PSAnY2FzaCcpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhLmNvc3QgPSAkc2NvcGUuZGF0YS5hbW91bnQlJHNjb3BlLnVzZXIubWVyY2hhbnQuY2hhbmdlUmF0ZTtcbiAgICAgICAgICAgICRzY29wZS5kYXRhLmFtb3VudCAtPSAkc2NvcGUuZGF0YS5jb3N0O1xuICAgICAgICAgICAgJHNjb3BlLmNvdW50Q2hhbmdlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhLmNvc3QgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmNvdW50Q2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS5jYXNoLnBhaWQgPSAgJHNjb3BlLmNhc2gucGFpZDtcbiAgICAgICAgICAkc2NvcGUuY2FzaC5jaGFuZ2UgPSAkc2NvcGUuZGF0YS5hbW91bnQgLSAkc2NvcGUuY2FzaC5wYWlkO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY29uZmlybSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZigkc2NvcGUuZGF0YS5hbW91bnQgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgTWVtYmVyLnBheW1lbnRzLmNyZWF0ZSh7aWQ6IG1lbWJlcklkfSwgJHNjb3BlLmRhdGEpLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgbmdEaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ+aIkOWKnycsIFwi5a6M5oiQ5YKo5YC85pON5L2cXCIpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsICflpLHotKUnLCBcIuWCqOWAvOaTjeS9nOacquWujOaIkO+8jOivt+mHjeivle+8gVwiKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICBib251c0RpYWxvZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ25nRGlhbG9nJywgJ01lbWJlcicsICd0b2FzdGVyJ107XG4gICAgZnVuY3Rpb24gYm9udXNEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgbmdEaWFsb2csIE1lbWJlciwgdG9hc3Rlcikge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIHZhciBtZW1iZXJJZCA9ICRzY29wZS4kc3RhdGUucGFyYW1zLm1lbWJlcklkO1xuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICBtZW1iZXJJZCA9ICRzY29wZS4kc3RhdGUucGFyYW1zLm1lbWJlcklkO1xuICAgICAgICAgICRzY29wZS5tZW1iZXIgPSBNZW1iZXIuZmluZEJ5SWQoe2lkOm1lbWJlcklkfSk7XG4gICAgICAgICAgJHNjb3BlLmRhdGEgPSB7XG4gICAgICAgICAgICBhbW91bnQ6IDAsXG4gICAgICAgICAgICBtZW1vOiAnbWFudWFsJ1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5jb25maXJtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmKCRzY29wZS5kYXRhLmFtb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZigkc2NvcGUuZGF0YS5hbW91bnQgPiAwKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YS5tZW1vID0gJ21hbnVhbCc7XG4gICAgICAgICAgfSBlbHNlIGlmKCRzY29wZS5kYXRhLmFtb3VudCA8IDApIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhLm1lbW8gPSAnd3JpdGVvZmYnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBNZW1iZXIuYm9udXNlcy5jcmVhdGUoe2lkOiBtZW1iZXJJZH0sICRzY29wZS5kYXRhKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIG5nRGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICfmiJDlip8nLCBcIuWujOaIkOWCqOWAvOaTjeS9nFwiKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCAn5aSx6LSlJywgXCLlgqjlgLzmk43kvZzmnKrlrozmiJDvvIzor7fph43or5XvvIFcIilcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiLyoqXG4gKiBBbmd1bGFySlMgZGVmYXVsdCBmaWx0ZXIgd2l0aCB0aGUgZm9sbG93aW5nIGV4cHJlc3Npb246XG4gKiBcInBlcnNvbiBpbiBwZW9wbGUgfCBmaWx0ZXI6IHtuYW1lOiAkc2VsZWN0LnNlYXJjaCwgYWdlOiAkc2VsZWN0LnNlYXJjaH1cIlxuICogcGVyZm9ybXMgYSBBTkQgYmV0d2VlbiAnbmFtZTogJHNlbGVjdC5zZWFyY2gnIGFuZCAnYWdlOiAkc2VsZWN0LnNlYXJjaCcuXG4gKiBXZSB3YW50IHRvIHBlcmZvcm0gYSBPUi5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAubWVtYmVycycpXG4gICAgICAgIC5maWx0ZXIoJ3d4X3NleCcsIHd4c2V4RmlsdGVyKVxuICAgICAgICAuZmlsdGVyKCd3eF9zdWJzY3JpYmUnLCB3eHN1YnNjcmliZUZpbHRlcilcbiAgICAgICAgLmZpbHRlcignZGVwb3NpdF9jYXRlZ29yeScsIGRlcG9zaXRjYXRlZ29yeUZpbHRlcilcbiAgICAgICAgLmZpbHRlcignYm9udXNfbWVtbycsIGJvbnVzTWVtb0ZpbHRlcilcbiAgICA7XG5cbiAgICBmdW5jdGlvbiB3eHNleEZpbHRlcigpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBbJ+S/neWvhicsICfnlLcnLCAn5aWzJ107XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZVtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHd4c3Vic2NyaWJlRmlsdGVyKCkge1xuICAgICAgdmFyIHN0YXRlID0gWyfmnKrlhbPms6gnLCAn5bey5YWz5rOoJ107XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gc3RhdGVba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gZGVwb3NpdGNhdGVnb3J5RmlsdGVyKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkZXBvc2l0KSB7XG4gICAgICAgIGlmKGRlcG9zaXQudHlwZSA9PT0gJ2RlcG9zaXQnKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcG9zaXQuYW1vdW50IDwgMCA/ICflgqjlgLzmtojotLknOiflgqjlgLzpgIDmrL4nO1xuICAgICAgICB9IGVsc2UgaWYoZGVwb3NpdC5jYXRlZ29yeSA9PT0gJ2RlcG9zaXQnKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcG9zaXQuYW1vdW50IDwgMCA/ICfmj5DnjrAnOiflhYXlgLwnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAn5pyq55+lJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJvbnVzTWVtb0ZpbHRlcigpIHtcbiAgICAgIHZhciBtZW1vID0ge1xuICAgICAgICByZXdhcmQ6ICfmtojotLnnp6/liIYnLFxuICAgICAgICB2b3VjaDogJ+a2iOi0ueaKteaJoycsXG4gICAgICAgIG1hbnVhbDogJ+aJi+WKqOenr+WIhicsXG4gICAgICAgIHdyaXRlb2ZmOiAn5omL5Yqo5YeP6K6hJyxcbiAgICAgICAgZXhjaGFuZ2U6ICflhZHmjaInXG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gbWVtb1trZXldO1xuICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm1lbWJlcnMnKVxuICAgICAgICAuc2VydmljZSgncXJjb2RlU2VydmljZScsIHFyY29kZVNlcnZpY2UpO1xuXG4gICAgcXJjb2RlU2VydmljZS4kaW5qZWN0ID0gWyduZ0RpYWxvZyddO1xuICAgIGZ1bmN0aW9uIHFyY29kZVNlcnZpY2UobmdEaWFsb2cpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFxuICAgICAgdGhpcy5zaG93UVJDb2RlID0gc2hvd1FSQ29kZTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gc2hvd1FSQ29kZShpbWFnZXVybCkge1xuICAgICAgICBpbWFnZXVybCA9IGltYWdldXJsIHx8ICdhcHAvaW1nL3FyY29kZS1mb3ItZ2guanBnJztcbiAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgdGVtcGxhdGU6IFwiPGltZyBzcmM9XCIraW1hZ2V1cmwrXCIgY2xhc3M9J2ltZy1yZXNwb25zaXZlJz5cIixcbiAgICAgICAgICBwbGFpbjogdHJ1ZSxcbiAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0J1xuICAgICAgICB9KTsgICAgXG4gICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgIC5tb2R1bGUoJ2FwcC5teXNob3AnLCBbXSlcbiAgICAgIC5jb250cm9sbGVyKCdNeVNob3BDb250cm9sbGVyJywgTXlTaG9wQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdTaG9wc0NvbnRyb2xsZXInLCBTaG9wc0NvbnRyb2xsZXIpXG4gICAgICAuY29udHJvbGxlcignU2hvcEFkZENvbnRyb2xsZXInLCBTaG9wQWRkQ29udHJvbGxlcik7XG4gICAgICAgIFxuICAgIE15U2hvcENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ2VkaXRhYmxlT3B0aW9ucycsICdlZGl0YWJsZVRoZW1lcycsICdTaG9wJywgJ01lcmNoYW50J107XG4gICAgZnVuY3Rpb24gTXlTaG9wQ29udHJvbGxlcigkc2NvcGUsIGVkaXRhYmxlT3B0aW9ucywgZWRpdGFibGVUaGVtZXMsIFNob3AsIE1lcmNoYW50KSB7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICBBTWFwLnNlcnZpY2UoJ0FNYXAuRGlzdHJpY3RTZWFyY2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkaXN0cmljdFNlYXJjaCA9IG5ldyBBTWFwLkRpc3RyaWN0U2VhcmNoKHtcbiAgICAgICAgICBsZXZlbCA6ICdjb3VudHJ5JyxcbiAgICAgICAgICBzdWJkaXN0cmljdCA6IDMgICAgXG4gICAgICAgIH0pO1xuICAgIFxuICAgICAgICBkaXN0cmljdFNlYXJjaC5zZWFyY2goJ+S4reWbvScsIGZ1bmN0aW9uIChzdGF0dXMsIHJlc3VsdCkge1xuICAgICAgICAgIHZtLnByb3ZpbmNlcyA9IHJlc3VsdC5kaXN0cmljdExpc3RbMF0uZGlzdHJpY3RMaXN0O1xuICAgICAgICAgIC8vICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgYWN0aXZhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIFxuICAgICAgICBlZGl0YWJsZU9wdGlvbnMudGhlbWUgPSAnYnMzJztcbiAgICAgICAgXG4gICAgICAgIGVkaXRhYmxlVGhlbWVzLmJzMy5pbnB1dENsYXNzID0gJ2lucHV0LXNtJztcbiAgICAgICAgZWRpdGFibGVUaGVtZXMuYnMzLmJ1dHRvbnNDbGFzcyA9ICdidG4tc20nO1xuICAgICAgICBlZGl0YWJsZVRoZW1lcy5iczMuc3VibWl0VHBsID0gJzxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzXCI+PHNwYW4gY2xhc3M9XCJmYSBmYS1jaGVja1wiPjwvc3Bhbj48L2J1dHRvbj4nO1xuICAgICAgICBlZGl0YWJsZVRoZW1lcy5iczMuY2FuY2VsVHBsID0gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgbmctY2xpY2s9XCIkZm9ybS4kY2FuY2VsKClcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJmYSBmYS10aW1lcyB0ZXh0LW11dGVkXCI+PC9zcGFuPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9idXR0b24+JztcbiAgICAgICAgXG4gICAgICAgIHZtLnNob3AgPSAkc2NvcGUudXNlci5zaG9wO1xuICAgICAgICB2bS5tZXJjaGFudCA9ICRzY29wZS51c2VyLm1lcmNoYW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS51cGRhdGUgPSBmdW5jdGlvbiAob2JqLCBrZXksIGRhdGEpIHtcbiAgICAgICAgdm1bb2JqXVtrZXldID0gZGF0YS5uYW1lO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5zYXZlU2hvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgU2hvcC51cHNlcnQodm0uc2hvcCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZtLnNhdmVNZXJjaGFudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgTWVyY2hhbnQudXBzZXJ0KHZtLm1lcmNoYW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgU2hvcHNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICduZ1RhYmxlJywgJ1Nob3AnXTtcbiAgICBmdW5jdGlvbiBTaG9wc0NvbnRyb2xsZXIoJHNjb3BlLCBuZ1RhYmxlLCBTaG9wKSB7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgXG4gICAgICBhY3RpdmF0ZSgpO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgXG4gICAgICB9XG4gICAgICBcbiAgICAgICRzY29wZS5maWx0ZXIgPSB7dGV4dDogJyd9XG4gICAgICAkc2NvcGUudGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7XG4gICAgICAgIGNvdW50OiAxMCxcbiAgICAgICAgZmlsdGVyOiAkc2NvcGUuZmlsdGVyLnRleHRcbiAgICAgIH0sIHtcbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJGRlZmVyLCBwYXJhbXMpIHtcbiAgICAgICAgICB2YXIgb3B0ID0ge29yZGVyOiAnc3Vic2NyaWJlX3RpbWUgREVTQyd9XG4gICAgICAgICAgb3B0LmxpbWl0ID0gcGFyYW1zLmNvdW50KClcbiAgICAgICAgICBvcHQuc2tpcCA9IChwYXJhbXMucGFnZSgpLTEpKm9wdC5saW1pdFxuICAgICAgICAgIG9wdC53aGVyZSA9IHt9XG4gICAgICAgICAgaWYoJHNjb3BlLmZpbHRlci50ZXh0ICE9ICcnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZmlsdGVyLnRleHQpO1xuICAgICAgICAgICAgLy8gdmFyIHFzID0ge2xpa2U6ICclJyskc2NvcGUuZmlsdGVyLnRleHQrJyUnfTtcbiAgICAgICAgICAgIHZhciBxcyA9IHtyZWdleDogJHNjb3BlLmZpbHRlci50ZXh0fTtcbiAgICAgICAgICAgIG9wdC53aGVyZS5vciA9IFt7bmlja25hbWU6cXN9LCB7cmVtYXJrOnFzfV07XG4gICAgICAgICAgICBvcHQuc2tpcCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIFNrdS5jb3VudCh7d2hlcmU6IG9wdC53aGVyZX0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS50YWJsZVBhcmFtcy50b3RhbChyZXN1bHQuY291bnQpXG4gICAgICAgICAgICBTa3UuZmluZCh7ZmlsdGVyOm9wdH0sICRkZWZlci5yZXNvbHZlKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pICAgXG4gICAgfVxuICAgIFxuICAgIFNob3BBZGRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdTaG9wJ107XG4gICAgZnVuY3Rpb24gU2hvcEFkZENvbnRyb2xsZXIoJHNjb3BlLCBTaG9wKSB7XG4gICAgICBhY3RpdmF0ZSgpO1xuICAgICAgXG4gICAgICB3aW5kb3cuUGFyc2xleVZhbGlkYXRvci5zZXRMb2NhbGUoJ3poX2NuJyk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAkc2NvcGUuZW50aXR5ID0ge1xuICAgICAgICAgIHR5cGU6IFwiZW50aXR5XCIsXG4gICAgICAgICAgbmFtZTogXCJpUGhvbmU2UyBQbHVzXCIsXG4gICAgICAgICAgc2t1czogW3tiYXJjb2RlOlwiMTIzXCIsIHByaWNlOiA1Mjg4LCBtb2RlbDogXCIxNkdcIn1dXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBcbiAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgIH1cbiAgICAgIFxuICAgICAgJHNjb3BlLnNhdmVBbmRNb3JlID0gZnVuY3Rpb24gKCkge1xuICAgICAgfVxuICAgIH0gICAgXG59KSgpOyIsIi8qKlxuICogQW5ndWxhckpTIGRlZmF1bHQgZmlsdGVyIHdpdGggdGhlIGZvbGxvd2luZyBleHByZXNzaW9uOlxuICogXCJwZXJzb24gaW4gcGVvcGxlIHwgZmlsdGVyOiB7bmFtZTogJHNlbGVjdC5zZWFyY2gsIGFnZTogJHNlbGVjdC5zZWFyY2h9XCJcbiAqIHBlcmZvcm1zIGEgQU5EIGJldHdlZW4gJ25hbWU6ICRzZWxlY3Quc2VhcmNoJyBhbmQgJ2FnZTogJHNlbGVjdC5zZWFyY2gnLlxuICogV2Ugd2FudCB0byBwZXJmb3JtIGEgT1IuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm15c2hvcCcpXG4gICAgICAgIC5maWx0ZXIoJ2l0ZW1fdHlwZTInLCBpdGVtVHlwZUZpbHRlcjIpO1xuXG4gICAgZnVuY3Rpb24gaXRlbVR5cGVGaWx0ZXIyKCkge1xuICAgICAgICB2YXIgdHlwZSA9IHtcbiAgICAgICAgICBlbnRpdHk6IFwi5a6e5L2T5ZWG5ZOBXCIsXG4gICAgICAgICAgc2VydmljZTogXCLmnI3liqHpobnnm65cIlxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZVtrZXldO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IGRlbW8tbm90aWZ5LmpzXHJcbiAqIFByb3ZpZGVzIGEgc2ltcGxlIGRlbW8gZm9yIG5vdGlmeVxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAubm90aWZ5JylcclxuICAgICAgICAuY29udHJvbGxlcignTm90aWZ5RGVtb0N0cmwnLCBOb3RpZnlEZW1vQ3RybCk7XHJcblxyXG4gICAgTm90aWZ5RGVtb0N0cmwuJGluamVjdCA9IFsnTm90aWZ5JywgJyR0aW1lb3V0J107XHJcbiAgICBmdW5jdGlvbiBOb3RpZnlEZW1vQ3RybChOb3RpZnksICR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgIHZtLm1zZ0h0bWwgPSAnPGVtIGNsYXNzPVwiZmEgZmEtY2hlY2tcIj48L2VtPiBNZXNzYWdlIHdpdGggaWNvbi4uJztcclxuXHJcbiAgICAgICAgICB2bS5ub3RpZnlNc2cgPSAnU29tZSBtZXNzYWdlcyBoZXJlLi4nO1xyXG4gICAgICAgICAgdm0ubm90aWZ5T3B0cyA9IHtcclxuICAgICAgICAgICAgc3RhdHVzOiAnZGFuZ2VyJyxcclxuICAgICAgICAgICAgcG9zOiAnYm90dG9tLWNlbnRlcidcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgLy8gU2VydmljZSB1c2FnZSBleGFtcGxlXHJcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgTm90aWZ5LmFsZXJ0KCBcclxuICAgICAgICAgICAgICAgICdUaGlzIGlzIGEgY3VzdG9tIG1lc3NhZ2UgZnJvbSBub3RpZnkuLicsIFxyXG4gICAgICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IG5vdGlmeS5qc1xuICogRGlyZWN0aXZlIGZvciBub3RpZnkgcGx1Z2luXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLm5vdGlmeScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ25vdGlmeScsIG5vdGlmeSk7XG5cbiAgICBub3RpZnkuJGluamVjdCA9IFsnJHdpbmRvdycsICdOb3RpZnknXTtcbiAgICBmdW5jdGlvbiBub3RpZnkgKCR3aW5kb3csIE5vdGlmeSkge1xuXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgIG9wdGlvbnM6ICc9JyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJz0nXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCkge1xuXG4gICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgTm90aWZ5LmFsZXJ0KHNjb3BlLm1lc3NhZ2UsIHNjb3BlLm9wdGlvbnMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pKCk7XG5cbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IG5vdGlmeS5qc1xyXG4gKiBDcmVhdGUgYSBub3RpZmljYXRpb25zIHRoYXQgZmFkZSBvdXQgYXV0b21hdGljYWxseS5cclxuICogQmFzZWQgb24gTm90aWZ5IGFkZG9uIGZyb20gVUlLaXQgKGh0dHA6Ly9nZXR1aWtpdC5jb20vZG9jcy9hZGRvbnNfbm90aWZ5Lmh0bWwpXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5ub3RpZnknKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdOb3RpZnknLCBOb3RpZnkpO1xyXG5cclxuICAgIE5vdGlmeS4kaW5qZWN0ID0gWyckdGltZW91dCddO1xyXG4gICAgZnVuY3Rpb24gTm90aWZ5KCR0aW1lb3V0KSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWxlcnQgPSBub3RpZnlBbGVydDtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBub3RpZnlBbGVydChtc2csIG9wdHMpIHtcclxuICAgICAgICAgICAgaWYgKCBtc2cgKSB7XHJcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICQubm90aWZ5KG1zZywgb3B0cyB8fCB7fSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogTm90aWZ5IEFkZG9uIGRlZmluaXRpb24gYXMgalF1ZXJ5IHBsdWdpblxyXG4gKiBBZGFwdGVkIHZlcnNpb24gdG8gd29yayB3aXRoIEJvb3RzdHJhcCBjbGFzc2VzXHJcbiAqIE1vcmUgaW5mb3JtYXRpb24gaHR0cDovL2dldHVpa2l0LmNvbS9kb2NzL2FkZG9uc19ub3RpZnkuaHRtbFxyXG4gKi9cclxuKGZ1bmN0aW9uKCQpe1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGNvbnRhaW5lcnMgPSB7fSxcclxuICAgICAgICBtZXNzYWdlcyAgID0ge30sXHJcbiAgICAgICAgbm90aWZ5ICAgICA9ICBmdW5jdGlvbihvcHRpb25zKXtcclxuICAgICAgICAgICAgaWYgKCQudHlwZShvcHRpb25zKSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7IG1lc3NhZ2U6IG9wdGlvbnMgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzWzFdKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQob3B0aW9ucywgJC50eXBlKGFyZ3VtZW50c1sxXSkgPT09ICdzdHJpbmcnID8ge3N0YXR1czphcmd1bWVudHNbMV19IDogYXJndW1lbnRzWzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKG5ldyBNZXNzYWdlKG9wdGlvbnMpKS5zaG93KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbG9zZUFsbCAgPSBmdW5jdGlvbihncm91cCwgaW5zdGFudGx5KXtcclxuICAgICAgICAgICAgdmFyIGlkO1xyXG4gICAgICAgICAgICBpZihncm91cCkge1xyXG4gICAgICAgICAgICAgICAgZm9yKGlkIGluIG1lc3NhZ2VzKSB7IGlmKGdyb3VwPT09bWVzc2FnZXNbaWRdLmdyb3VwKSBtZXNzYWdlc1tpZF0uY2xvc2UoaW5zdGFudGx5KTsgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yKGlkIGluIG1lc3NhZ2VzKSB7IG1lc3NhZ2VzW2lkXS5jbG9zZShpbnN0YW50bHkpOyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgdmFyIE1lc3NhZ2UgPSBmdW5jdGlvbihvcHRpb25zKXtcclxuICAgICAgICAvLyB2YXIgJHRoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBNZXNzYWdlLmRlZmF1bHRzLCBvcHRpb25zKTtcclxuICAgICAgICB0aGlzLnV1aWQgICAgPSAnSUQnKyhuZXcgRGF0ZSgpLmdldFRpbWUoKSkrJ1JBTkQnKyhNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSAqIDEwMDAwMCkpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoW1xyXG4gICAgICAgICAgICAvLyBAZ2VlZG1vOiBhbGVydC1kaXNtaXNzYWJsZSBlbmFibGVzIGJzIGNsb3NlIGljb25cclxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ1ay1ub3RpZnktbWVzc2FnZSBhbGVydC1kaXNtaXNzYWJsZVwiPicsXHJcbiAgICAgICAgICAgICAgICAnPGEgY2xhc3M9XCJjbG9zZVwiPiZ0aW1lczs8L2E+JyxcclxuICAgICAgICAgICAgICAgICc8ZGl2PicrdGhpcy5vcHRpb25zLm1lc3NhZ2UrJzwvZGl2PicsXHJcbiAgICAgICAgICAgICc8L2Rpdj4nXHJcbiAgICAgICAgXS5qb2luKCcnKSkuZGF0YSgnbm90aWZ5TWVzc2FnZScsIHRoaXMpO1xyXG4gICAgICAgIC8vIHN0YXR1c1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcygnYWxlcnQgYWxlcnQtJyt0aGlzLm9wdGlvbnMuc3RhdHVzKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50c3RhdHVzID0gdGhpcy5vcHRpb25zLnN0YXR1cztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ncm91cCA9IHRoaXMub3B0aW9ucy5ncm91cDtcclxuICAgICAgICBtZXNzYWdlc1t0aGlzLnV1aWRdID0gdGhpcztcclxuICAgICAgICBpZighY29udGFpbmVyc1t0aGlzLm9wdGlvbnMucG9zXSkge1xyXG4gICAgICAgICAgICBjb250YWluZXJzW3RoaXMub3B0aW9ucy5wb3NdID0gJCgnPGRpdiBjbGFzcz1cInVrLW5vdGlmeSB1ay1ub3RpZnktJyt0aGlzLm9wdGlvbnMucG9zKydcIj48L2Rpdj4nKS5hcHBlbmRUbygnYm9keScpLm9uKCdjbGljaycsICcudWstbm90aWZ5LW1lc3NhZ2UnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5kYXRhKCdub3RpZnlNZXNzYWdlJykuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgICQuZXh0ZW5kKE1lc3NhZ2UucHJvdG90eXBlLCB7XHJcbiAgICAgICAgdXVpZDogZmFsc2UsXHJcbiAgICAgICAgZWxlbWVudDogZmFsc2UsXHJcbiAgICAgICAgdGltb3V0OiBmYWxzZSxcclxuICAgICAgICBjdXJyZW50c3RhdHVzOiAnJyxcclxuICAgICAgICBncm91cDogZmFsc2UsXHJcbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuaXMoJzp2aXNpYmxlJykpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcclxuICAgICAgICAgICAgY29udGFpbmVyc1t0aGlzLm9wdGlvbnMucG9zXS5zaG93KCkucHJlcGVuZCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB2YXIgbWFyZ2luYm90dG9tID0gcGFyc2VJbnQodGhpcy5lbGVtZW50LmNzcygnbWFyZ2luLWJvdHRvbScpLCAxMCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3MoeydvcGFjaXR5JzowLCAnbWFyZ2luLXRvcCc6IC0xKnRoaXMuZWxlbWVudC5vdXRlckhlaWdodCgpLCAnbWFyZ2luLWJvdHRvbSc6MH0pLmFuaW1hdGUoeydvcGFjaXR5JzoxLCAnbWFyZ2luLXRvcCc6IDAsICdtYXJnaW4tYm90dG9tJzptYXJnaW5ib3R0b219LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCR0aGlzLm9wdGlvbnMudGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjbG9zZWZuID0gZnVuY3Rpb24oKXsgJHRoaXMuY2xvc2UoKTsgfTtcclxuICAgICAgICAgICAgICAgICAgICAkdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChjbG9zZWZuLCAkdGhpcy5vcHRpb25zLnRpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVsZW1lbnQuaG92ZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyBjbGVhclRpbWVvdXQoJHRoaXMudGltZW91dCk7IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyAkdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChjbG9zZWZuLCAkdGhpcy5vcHRpb25zLnRpbWVvdXQpOyAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsb3NlOiBmdW5jdGlvbihpbnN0YW50bHkpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzICAgID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIGZpbmFsaXplID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFjb250YWluZXJzWyR0aGlzLm9wdGlvbnMucG9zXS5jaGlsZHJlbigpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJzWyR0aGlzLm9wdGlvbnMucG9zXS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXNzYWdlc1skdGhpcy51dWlkXTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGltZW91dCkgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XHJcbiAgICAgICAgICAgIGlmKGluc3RhbnRseSkge1xyXG4gICAgICAgICAgICAgICAgZmluYWxpemUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hbmltYXRlKHsnb3BhY2l0eSc6MCwgJ21hcmdpbi10b3AnOiAtMSogdGhpcy5lbGVtZW50Lm91dGVySGVpZ2h0KCksICdtYXJnaW4tYm90dG9tJzowfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBmaW5hbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbnRlbnQ6IGZ1bmN0aW9uKGh0bWwpe1xyXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5lbGVtZW50LmZpbmQoJz5kaXYnKTtcclxuICAgICAgICAgICAgaWYoIWh0bWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuaHRtbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0YXR1czogZnVuY3Rpb24oc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIGlmKCFzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRzdGF0dXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdhbGVydCBhbGVydC0nK3RoaXMuY3VycmVudHN0YXR1cykuYWRkQ2xhc3MoJ2FsZXJ0IGFsZXJ0LScrc3RhdHVzKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50c3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIE1lc3NhZ2UuZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgc3RhdHVzOiAnbm9ybWFsJyxcclxuICAgICAgICB0aW1lb3V0OiA1MDAwLFxyXG4gICAgICAgIGdyb3VwOiBudWxsLFxyXG4gICAgICAgIHBvczogJ3RvcC1jZW50ZXInXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAkLm5vdGlmeSAgICAgICAgICA9IG5vdGlmeTtcclxuICAgICQubm90aWZ5Lm1lc3NhZ2UgID0gTWVzc2FnZTtcclxuICAgICQubm90aWZ5LmNsb3NlQWxsID0gY2xvc2VBbGw7XHJcbiAgICBcclxuICAgIHJldHVybiBub3RpZnk7XHJcbn0oalF1ZXJ5KSk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBhY2Nlc3MtbG9naW4uanNcbiAqIERlbW8gZm9yIGxvZ2luIGFwaVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYWdlcycpXG4gICAgICAgIC5jb250cm9sbGVyKCdMb2dpbkZvcm1Db250cm9sbGVyJywgTG9naW5Gb3JtQ29udHJvbGxlcik7XG5cbiAgICBMb2dpbkZvcm1Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzdGF0ZScsICdVc2VyJywgJyRyb290U2NvcGUnXTtcbiAgICBmdW5jdGlvbiBMb2dpbkZvcm1Db250cm9sbGVyKCRzdGF0ZSwgVXNlciwgJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgIC8vIGJpbmQgaGVyZSBhbGwgZGF0YSBmcm9tIHRoZSBmb3JtXG4gICAgICAgICAgdm0uYWNjb3VudCA9IHtcbiAgICAgICAgICAgIHJlYWxtOiAnbWVyY2hhbnQnLFxuICAgICAgICAgICAgcmVtZW1iZXI6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIC8vIHBsYWNlIHRoZSBtZXNzYWdlIGlmIHNvbWV0aGluZyBnb2VzIHdyb25nXG4gICAgICAgICAgdm0uYXV0aE1zZyA9ICcnO1xuXG4gICAgICAgICAgdm0ubG9naW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmF1dGhNc2cgPSAnJztcblxuICAgICAgICAgICAgaWYodm0ubG9naW5Gb3JtLiR2YWxpZCkge1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgVXNlclxuICAgICAgICAgICAgICAgIC5sb2dpbih2bS5hY2NvdW50LCBmdW5jdGlvbiAoYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnVXNlci5sb2dpbmVkJyk7XG4gICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHZtLmF1dGhNc2cgPSBlcnJvci5kYXRhLmVycm9yLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAvLyBzZXQgYXMgZGlydHkgaWYgdGhlIHVzZXIgY2xpY2sgZGlyZWN0bHkgdG8gbG9naW4gc28gd2Ugc2hvdyB0aGUgdmFsaWRhdGlvbiBtZXNzYWdlc1xuICAgICAgICAgICAgICAvKmpzaGludCAtVzEwNiovXG4gICAgICAgICAgICAgIHZtLmxvZ2luRm9ybS5hY2NvdW50X3VzZXJuYW1lLiRkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgIHZtLmxvZ2luRm9ybS5hY2NvdW50X3Bhc3N3b3JkLiRkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogYWNjZXNzLXJlZ2lzdGVyLmpzXG4gKiBEZW1vIGZvciByZWdpc3RlciBhY2NvdW50IGFwaVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYWdlcycpXG4gICAgICAgIC5jb250cm9sbGVyKCdSZWdpc3RlckZvcm1Db250cm9sbGVyJywgUmVnaXN0ZXJGb3JtQ29udHJvbGxlcik7XG5cbiAgICBSZWdpc3RlckZvcm1Db250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJ1VzZXInLCAnJGZpbHRlciddO1xuICAgIGZ1bmN0aW9uIFJlZ2lzdGVyRm9ybUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHN0YXRlLCBVc2VyLCAkZmlsdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgLy8gYmluZCBoZXJlIGFsbCBkYXRhIGZyb20gdGhlIGZvcm1cbiAgICAgICAgICB2bS5hY2NvdW50ID0ge1xuICAgICAgICAgICAgcmVhbG06ICdtZXJjaGFudCcsXG4gICAgICAgICAgICByb2xlOiAnb3duZXInXG4gICAgICAgICAgfTtcbiAgICAgICAgICB2bS5hZ3JlZWQgPSB0cnVlO1xuICAgICAgICAgIC8vIHBsYWNlIHRoZSBtZXNzYWdlIGlmIHNvbWV0aGluZyBnb2VzIHdyb25nXG4gICAgICAgICAgdm0uYXV0aE1zZyA9ICcnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgdm0ucmVnaXN0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmF1dGhNc2cgPSAnJztcblxuICAgICAgICAgICAgaWYodm0ucmVnaXN0ZXJGb3JtLiR2YWxpZCkge1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgdm0uYWNjb3VudC5lbWFpbCA9IHZtLmFjY291bnQudXNlcm5hbWUrXCJAZmFua2FodWkuY29tXCI7XG4gICAgICAgICAgICAgIHZtLmFjY291bnQucGhvbmUgPSB2bS5hY2NvdW50LnVzZXJuYW1lO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgVXNlclxuICAgICAgICAgICAgICAgIC5jcmVhdGUodm0uYWNjb3VudCwgZnVuY3Rpb24gKGFjY291bnQpIHtcbiAgICAgICAgICAgICAgICAgIFVzZXJcbiAgICAgICAgICAgICAgICAgICAgLmxvZ2luKHt1c2VybmFtZTogdm0uYWNjb3VudC51c2VybmFtZSwgcGFzc3dvcmQ6IHZtLmFjY291bnQucGFzc3dvcmR9KVxuICAgICAgICAgICAgICAgICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAoYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ1VzZXIubG9naW5lZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHZtLmF1dGhNc2cgPSAkZmlsdGVyKCdyZWdpc3Rlcl9lcnJvcicpKGVycm9yLmRhdGEuZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAvLyBzZXQgYXMgZGlydHkgaWYgdGhlIHVzZXIgY2xpY2sgZGlyZWN0bHkgdG8gbG9naW4gc28gd2Ugc2hvdyB0aGUgdmFsaWRhdGlvbiBtZXNzYWdlc1xuICAgICAgICAgICAgICAvKmpzaGludCAtVzEwNiovXG4gICAgICAgICAgICAgIHZtLnJlZ2lzdGVyRm9ybS5hY2NvdW50X3VzZXJuYW1lLiRkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgIHZtLnJlZ2lzdGVyRm9ybS5hY2NvdW50X3Bhc3N3b3JkLiRkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgIHZtLnJlZ2lzdGVyRm9ybS5hY2NvdW50X2FncmVlZC4kZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiIsIi8qKlxuICogQW5ndWxhckpTIGRlZmF1bHQgZmlsdGVyIHdpdGggdGhlIGZvbGxvd2luZyBleHByZXNzaW9uOlxuICogXCJwZXJzb24gaW4gcGVvcGxlIHwgZmlsdGVyOiB7bmFtZTogJHNlbGVjdC5zZWFyY2gsIGFnZTogJHNlbGVjdC5zZWFyY2h9XCJcbiAqIHBlcmZvcm1zIGEgQU5EIGJldHdlZW4gJ25hbWU6ICRzZWxlY3Quc2VhcmNoJyBhbmQgJ2FnZTogJHNlbGVjdC5zZWFyY2gnLlxuICogV2Ugd2FudCB0byBwZXJmb3JtIGEgT1IuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnBhZ2VzJylcbiAgICAgICAgLmZpbHRlcigncmVnaXN0ZXJfZXJyb3InLCByZWdpc3RlckVycm9yRmlsdGVyKVxuICAgIDtcbiAgICBcbiAgICBmdW5jdGlvbiByZWdpc3RlckVycm9yRmlsdGVyKCkge1xuICAgICAgICAvLyBcIlRoZSBgbWVyY2hhbnRgIGluc3RhbmNlIGlzIG5vdCB2YWxpZC4gRGV0YWlsczogYG5hbWVgIG5hbWUgZXhpc3QgKHZhbHVlOiBcImZhbmthaHVpXCIpLlwiXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBpZigvTWVyY2hhbnQgbmFtZSBleGlzdC8udGVzdChtc2cpKSByZXR1cm4gXCLllYbmiLflkI3lrZflt7Lnu4/lrZjlnKhcIjtcbiAgICAgICAgaWYoL1VzZXIgYWxyZWFkeSBleGlzdHMvLnRlc3QobXNnKSkgcmV0dXJuIFwi55So5oi35ZCN5bey57uP5a2Y5ZyoXCI7XG4gICAgICAgIGVsc2UgcmV0dXJuIG1zZztcbiAgICAgIH1cbiAgICB9XG59KSgpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBDb2xsYXBzZSBwYW5lbHMgKiBbcGFuZWwtY29sbGFwc2VdXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYW5lbHMnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BhbmVsQ29sbGFwc2UnLCBwYW5lbENvbGxhcHNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBwYW5lbENvbGxhcHNlICgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBDb250cm9sbGVyLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZTogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbiAgICB9XHJcblxyXG4gICAgQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHRpbWVvdXQnLCAnJGxvY2FsU3RvcmFnZSddO1xyXG4gICAgZnVuY3Rpb24gQ29udHJvbGxlciAoJHNjb3BlLCAkZWxlbWVudCwgJHRpbWVvdXQsICRsb2NhbFN0b3JhZ2UpIHtcclxuICAgICAgdmFyIHN0b3JhZ2VLZXlOYW1lID0gJ3BhbmVsU3RhdGUnO1xyXG5cclxuICAgICAgLy8gUHJlcGFyZSB0aGUgcGFuZWwgdG8gYmUgY29sbGFwc2libGVcclxuICAgICAgdmFyICRlbGVtICAgPSAkKCRlbGVtZW50KSxcclxuICAgICAgICAgIHBhcmVudCAgPSAkZWxlbS5jbG9zZXN0KCcucGFuZWwnKSwgLy8gZmluZCB0aGUgZmlyc3QgcGFyZW50IHBhbmVsXHJcbiAgICAgICAgICBwYW5lbElkID0gcGFyZW50LmF0dHIoJ2lkJyk7XHJcblxyXG4gICAgICAvLyBMb2FkIHRoZSBzYXZlZCBzdGF0ZSBpZiBleGlzdHNcclxuICAgICAgdmFyIGN1cnJlbnRTdGF0ZSA9IGxvYWRQYW5lbFN0YXRlKCBwYW5lbElkICk7XHJcbiAgICAgIGlmICggdHlwZW9mIGN1cnJlbnRTdGF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkc2NvcGVbcGFuZWxJZF0gPSBjdXJyZW50U3RhdGU7IH0sXHJcbiAgICAgICAgICAxMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGJpbmQgZXZlbnRzIHRvIHN3aXRjaCBpY29uc1xyXG4gICAgICAkZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgc2F2ZVBhbmVsU3RhdGUoIHBhbmVsSWQsICEkc2NvcGVbcGFuZWxJZF0gKTtcclxuXHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICAvLyBDb250cm9sbGVyIGhlbHBlcnNcclxuICAgICAgZnVuY3Rpb24gc2F2ZVBhbmVsU3RhdGUoaWQsIHN0YXRlKSB7XHJcbiAgICAgICAgaWYoIWlkKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBhbmd1bGFyLmZyb21Kc29uKCRsb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleU5hbWVdKTtcclxuICAgICAgICBpZighZGF0YSkgeyBkYXRhID0ge307IH1cclxuICAgICAgICBkYXRhW2lkXSA9IHN0YXRlO1xyXG4gICAgICAgICRsb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleU5hbWVdID0gYW5ndWxhci50b0pzb24oZGF0YSk7XHJcbiAgICAgIH1cclxuICAgICAgZnVuY3Rpb24gbG9hZFBhbmVsU3RhdGUoaWQpIHtcclxuICAgICAgICBpZighaWQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgZGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24oJGxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5TmFtZV0pO1xyXG4gICAgICAgIGlmKGRhdGEpIHtcclxuICAgICAgICAgIHJldHVybiBkYXRhW2lkXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBEaXNtaXNzIHBhbmVscyAqIFtwYW5lbC1kaXNtaXNzXVxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnBhbmVscycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGFuZWxEaXNtaXNzJywgcGFuZWxEaXNtaXNzKTtcclxuXHJcbiAgICBmdW5jdGlvbiBwYW5lbERpc21pc3MgKCkge1xyXG5cclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBDb250cm9sbGVyLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckZWxlbWVudCcsICckcScsICdVdGlscyddO1xyXG4gICAgZnVuY3Rpb24gQ29udHJvbGxlciAoJHNjb3BlLCAkZWxlbWVudCwgJHEsIFV0aWxzKSB7XHJcbiAgICAgIHZhciByZW1vdmVFdmVudCAgID0gJ3BhbmVsLXJlbW92ZScsXHJcbiAgICAgICAgICByZW1vdmVkRXZlbnQgID0gJ3BhbmVsLXJlbW92ZWQnO1xyXG5cclxuICAgICAgJGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIC8vIGZpbmQgdGhlIGZpcnN0IHBhcmVudCBwYW5lbFxyXG4gICAgICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wYW5lbCcpO1xyXG5cclxuICAgICAgICByZW1vdmVFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBDb21tdW5pY2F0ZSBldmVudCBkZXN0cm95aW5nIHBhbmVsXHJcbiAgICAgICAgICAkc2NvcGUuJGVtaXQocmVtb3ZlRXZlbnQsIHBhcmVudC5hdHRyKCdpZCcpLCBkZWZlcnJlZCk7XHJcbiAgICAgICAgICBwcm9taXNlLnRoZW4oZGVzdHJveU1pZGRsZXdhcmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUnVuIHRoZSBhbmltYXRpb24gYmVmb3JlIGRlc3Ryb3kgdGhlIHBhbmVsXHJcbiAgICAgICAgZnVuY3Rpb24gZGVzdHJveU1pZGRsZXdhcmUoKSB7XHJcbiAgICAgICAgICBpZihVdGlscy5zdXBwb3J0LmFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICBwYXJlbnQuYW5pbW8oe2FuaW1hdGlvbjogJ2JvdW5jZU91dCd9LCBkZXN0cm95UGFuZWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBkZXN0cm95UGFuZWwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lQYW5lbCgpIHtcclxuXHJcbiAgICAgICAgICB2YXIgY29sID0gcGFyZW50LnBhcmVudCgpO1xyXG4gICAgICAgICAgcGFyZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgLy8gcmVtb3ZlIHRoZSBwYXJlbnQgaWYgaXQgaXMgYSByb3cgYW5kIGlzIGVtcHR5IGFuZCBub3QgYSBzb3J0YWJsZSAocG9ydGxldClcclxuICAgICAgICAgIGNvbFxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gKGVsLmlzKCdbY2xhc3MqPVwiY29sLVwiXTpub3QoLnNvcnRhYmxlKScpICYmIGVsLmNoaWxkcmVuKCcqJykubGVuZ3RoID09PSAwKTtcclxuICAgICAgICAgIH0pLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgIC8vIENvbW11bmljYXRlIGV2ZW50IGRlc3Ryb3llZCBwYW5lbFxyXG4gICAgICAgICAgJHNjb3BlLiRlbWl0KHJlbW92ZWRFdmVudCwgcGFyZW50LmF0dHIoJ2lkJykpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9KTtcclxuICAgIH1cclxufSkoKTtcclxuXHJcblxyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogUmVmcmVzaCBwYW5lbHNcclxuICogW3BhbmVsLXJlZnJlc2hdICogW2RhdGEtc3Bpbm5lcj1cInN0YW5kYXJkXCJdXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucGFuZWxzJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdwYW5lbFJlZnJlc2gnLCBwYW5lbFJlZnJlc2gpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHBhbmVsUmVmcmVzaCAoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogQ29udHJvbGxlcixcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckZWxlbWVudCddO1xyXG4gICAgZnVuY3Rpb24gQ29udHJvbGxlciAoJHNjb3BlLCAkZWxlbWVudCkge1xyXG4gICAgICB2YXIgcmVmcmVzaEV2ZW50ICAgPSAncGFuZWwtcmVmcmVzaCcsXHJcbiAgICAgICAgICB3aGlybENsYXNzICAgICA9ICd3aGlybCcsXHJcbiAgICAgICAgICBkZWZhdWx0U3Bpbm5lciA9ICdzdGFuZGFyZCc7XHJcblxyXG4gICAgICAvLyBjYXRjaCBjbGlja3MgdG8gdG9nZ2xlIHBhbmVsIHJlZnJlc2hcclxuICAgICAgJGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgcGFuZWwgICA9ICR0aGlzLnBhcmVudHMoJy5wYW5lbCcpLmVxKDApLFxyXG4gICAgICAgICAgICBzcGlubmVyID0gJHRoaXMuZGF0YSgnc3Bpbm5lcicpIHx8IGRlZmF1bHRTcGlubmVyXHJcbiAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgLy8gc3RhcnQgc2hvd2luZyB0aGUgc3Bpbm5lclxyXG4gICAgICAgIHBhbmVsLmFkZENsYXNzKHdoaXJsQ2xhc3MgKyAnICcgKyBzcGlubmVyKTtcclxuXHJcbiAgICAgICAgLy8gRW1pdCBldmVudCB3aGVuIHJlZnJlc2ggY2xpY2tlZFxyXG4gICAgICAgICRzY29wZS4kZW1pdChyZWZyZXNoRXZlbnQsIHBhbmVsLmF0dHIoJ2lkJykpO1xyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBsaXN0ZW4gdG8gcmVtb3ZlIHNwaW5uZXJcclxuICAgICAgJHNjb3BlLiRvbigncmVtb3ZlU3Bpbm5lcicsIHJlbW92ZVNwaW5uZXIpO1xyXG5cclxuICAgICAgLy8gbWV0aG9kIHRvIGNsZWFyIHRoZSBzcGlubmVyIHdoZW4gZG9uZVxyXG4gICAgICBmdW5jdGlvbiByZW1vdmVTcGlubmVyIChldiwgaWQpIHtcclxuICAgICAgICBpZiAoIWlkKSByZXR1cm47XHJcbiAgICAgICAgdmFyIG5ld2lkID0gaWQuY2hhckF0KDApID09PSAnIycgPyBpZCA6ICgnIycraWQpO1xyXG4gICAgICAgIGFuZ3VsYXJcclxuICAgICAgICAgIC5lbGVtZW50KG5ld2lkKVxyXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKHdoaXJsQ2xhc3MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5cclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGUgcGFuZWwtdG9vbHMuanNcbiAqIERpcmVjdGl2ZSB0b29scyB0byBjb250cm9sIHBhbmVscy4gXG4gKiBBbGxvd3MgY29sbGFwc2UsIHJlZnJlc2ggYW5kIGRpc21pc3MgKHJlbW92ZSlcbiAqIFNhdmVzIHBhbmVsIHN0YXRlIGluIGJyb3dzZXIgc3RvcmFnZVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wYW5lbHMnKVxuICAgICAgICAuZGlyZWN0aXZlKCdwYW5lbHRvb2wnLCBwYW5lbHRvb2wpO1xuXG4gICAgcGFuZWx0b29sLiRpbmplY3QgPSBbJyRjb21waWxlJywgJyR0aW1lb3V0J107XG4gICAgZnVuY3Rpb24gcGFuZWx0b29sICgkY29tcGlsZSwgJHRpbWVvdXQpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICAgIHZhciB0ZW1wbGF0ZXMgPSB7XG4gICAgICAgICAgICAvKiBqc2hpbnQgbXVsdGlzdHI6IHRydWUgKi9cbiAgICAgICAgICAgIGNvbGxhcHNlOic8YSBocmVmPVwiI1wiIHBhbmVsLWNvbGxhcHNlPVwiXCIgdWliLXRvb2x0aXA9XCJDb2xsYXBzZSBQYW5lbFwiIG5nLWNsaWNrPVwie3twYW5lbElkfX0gPSAhe3twYW5lbElkfX1cIj4gXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxlbSBuZy1zaG93PVwie3twYW5lbElkfX1cIiBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2VtPiBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGVtIG5nLXNob3c9XCIhe3twYW5lbElkfX1cIiBjbGFzcz1cImZhIGZhLW1pbnVzXCI+PC9lbT4gXFxcbiAgICAgICAgICAgICAgICAgICAgICA8L2E+JyxcbiAgICAgICAgICAgIGRpc21pc3M6ICc8YSBocmVmPVwiI1wiIHBhbmVsLWRpc21pc3M9XCJcIiB1aWItdG9vbHRpcD1cIkNsb3NlIFBhbmVsXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgPGVtIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L2VtPlxcXG4gICAgICAgICAgICAgICAgICAgICA8L2E+JyxcbiAgICAgICAgICAgIHJlZnJlc2g6ICc8YSBocmVmPVwiI1wiIHBhbmVsLXJlZnJlc2g9XCJcIiBkYXRhLXNwaW5uZXI9XCJ7e3NwaW5uZXJ9fVwiIHVpYi10b29sdGlwPVwiUmVmcmVzaCBQYW5lbFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgIDxlbSBjbGFzcz1cImZhIGZhLXJlZnJlc2hcIj48L2VtPlxcXG4gICAgICAgICAgICAgICAgICAgICA8L2E+J1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgdG9vbHMgPSBzY29wZS5wYW5lbFRvb2xzIHx8IGF0dHJzO1xuICAgICAgXG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwoZ2V0VGVtcGxhdGUoZWxlbWVudCwgdG9vbHMgKSkuc2hvdygpO1xuICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKShzY29wZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3B1bGwtcmlnaHQnKTtcbiAgICAgICAgICB9KTtcbiAgXG4gICAgICAgICAgZnVuY3Rpb24gZ2V0VGVtcGxhdGUoIGVsZW0sIGF0dHJzICl7XG4gICAgICAgICAgICB2YXIgdGVtcCA9ICcnO1xuICAgICAgICAgICAgYXR0cnMgPSBhdHRycyB8fCB7fTtcbiAgICAgICAgICAgIGlmKGF0dHJzLnRvb2xDb2xsYXBzZSlcbiAgICAgICAgICAgICAgdGVtcCArPSB0ZW1wbGF0ZXMuY29sbGFwc2UucmVwbGFjZSgve3twYW5lbElkfX0vZywgKGVsZW0ucGFyZW50KCkucGFyZW50KCkuYXR0cignaWQnKSkgKTtcbiAgICAgICAgICAgIGlmKGF0dHJzLnRvb2xEaXNtaXNzKVxuICAgICAgICAgICAgICB0ZW1wICs9IHRlbXBsYXRlcy5kaXNtaXNzO1xuICAgICAgICAgICAgaWYoYXR0cnMudG9vbFJlZnJlc2gpXG4gICAgICAgICAgICAgIHRlbXAgKz0gdGVtcGxhdGVzLnJlZnJlc2gucmVwbGFjZSgve3tzcGlubmVyfX0vZywgYXR0cnMudG9vbFJlZnJlc2gpO1xuICAgICAgICAgICAgcmV0dXJuIHRlbXA7XG4gICAgICAgICAgfVxuICAgICAgICB9Ly8gbGlua1xuICAgIH0gXG5cbn0pKCk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogZGVtby1wYW5lbHMuanNcbiAqIFByb3ZpZGVzIGEgc2ltcGxlIGRlbW8gZm9yIHBhbmVsIGFjdGlvbnNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAucGFuZWxzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BhbmVsc0N0cmwnLCBQYW5lbHNDdHJsKTtcblxuICAgIFBhbmVsc0N0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyR0aW1lb3V0J107XG4gICAgZnVuY3Rpb24gUGFuZWxzQ3RybCgkc2NvcGUsICR0aW1lb3V0KSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cbiAgICAgICAgICAvLyBQQU5FTCBDT0xMQVBTRSBFVkVOVFNcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuICAgICAgICAgIC8vIFdlIGNhbiB1c2UgcGFuZWwgaWQgbmFtZSBmb3IgdGhlIGJvb2xlYW4gZmxhZyB0byBbdW5dY29sbGFwc2UgdGhlIHBhbmVsXG4gICAgICAgICAgJHNjb3BlLiR3YXRjaCgncGFuZWxEZW1vMScsZnVuY3Rpb24obmV3VmFsKXtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwYW5lbERlbW8xIGNvbGxhcHNlZDogJyArIG5ld1ZhbCk7XG5cbiAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgLy8gUEFORUwgRElTTUlTUyBFVkVOVFNcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuICAgICAgICAgIC8vIEJlZm9yZSByZW1vdmUgcGFuZWxcbiAgICAgICAgICAkc2NvcGUuJG9uKCdwYW5lbC1yZW1vdmUnLCBmdW5jdGlvbihldmVudCwgaWQsIGRlZmVycmVkKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BhbmVsICMnICsgaWQgKyAnIHJlbW92aW5nJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEhlcmUgaXMgb2JsaWdhdG9yeSB0byBjYWxsIHRoZSByZXNvbHZlKCkgaWYgd2UgcHJldGVuZCB0byByZW1vdmUgdGhlIHBhbmVsIGZpbmFsbHlcbiAgICAgICAgICAgIC8vIE5vdCBjYWxsaW5nIHJlc29sdmUoKSB3aWxsIE5PVCByZW1vdmUgdGhlIHBhbmVsXG4gICAgICAgICAgICAvLyBJdCdzIHVwIHRvIHlvdXIgYXBwIHRvIGRlY2lkZSBpZiBwYW5lbCBzaG91bGQgYmUgcmVtb3ZlZCBvciBub3RcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICBcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFBhbmVsIHJlbW92ZWQgKCBvbmx5IGlmIGFib3ZlIHdhcyByZXNvbHZlZCgpIClcbiAgICAgICAgICAkc2NvcGUuJG9uKCdwYW5lbC1yZW1vdmVkJywgZnVuY3Rpb24oZXZlbnQsIGlkKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BhbmVsICMnICsgaWQgKyAnIHJlbW92ZWQnKTtcblxuICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAvLyBQQU5FTCBSRUZSRVNIIEVWRU5UU1xuICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG4gICAgICAgICAgJHNjb3BlLiRvbigncGFuZWwtcmVmcmVzaCcsIGZ1bmN0aW9uKGV2ZW50LCBpZCkge1xuICAgICAgICAgICAgdmFyIHNlY3MgPSAzO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVmcmVzaGluZyBkdXJpbmcgJyArIHNlY3MgKydzICMnK2lkKTtcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgLy8gZGlyZWN0aXZlIGxpc3RlbiBmb3IgdG8gcmVtb3ZlIHRoZSBzcGlubmVyIFxuICAgICAgICAgICAgICAvLyBhZnRlciB3ZSBlbmQgdXAgdG8gcGVyZm9ybSBvd24gb3BlcmF0aW9uc1xuICAgICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgncmVtb3ZlU3Bpbm5lcicsIGlkKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZWZyZXNoZWQgIycgKyBpZCk7XG5cbiAgICAgICAgICAgIH0sIDMwMDApO1xuXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBQQU5FTFMgVklBIE5HLVJFUEVBVFxuICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG4gICAgICAgICAgJHNjb3BlLnBhbmVscyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6ICdwYW5lbFJlcGVhdDEnLFxuICAgICAgICAgICAgICB0aXRsZTogJ1BhbmVsIFRpdGxlIDEnLFxuICAgICAgICAgICAgICBib2R5OiAnTnVsbGEgZWdldCBsb3JlbSBsZW8sIHNpdCBhbWV0IGVsZW1lbnR1bSBsb3JlbS4gJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6ICdwYW5lbFJlcGVhdDInLFxuICAgICAgICAgICAgICB0aXRsZTogJ1BhbmVsIFRpdGxlIDInLFxuICAgICAgICAgICAgICBib2R5OiAnTnVsbGEgZWdldCBsb3JlbSBsZW8sIHNpdCBhbWV0IGVsZW1lbnR1bSBsb3JlbS4gJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6ICdwYW5lbFJlcGVhdDMnLFxuICAgICAgICAgICAgICB0aXRsZTogJ1BhbmVsIFRpdGxlIDMnLFxuICAgICAgICAgICAgICBib2R5OiAnTnVsbGEgZWdldCBsb3JlbSBsZW8sIHNpdCBhbWV0IGVsZW1lbnR1bSBsb3JlbS4gJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF07XG4gICAgICAgIH1cblxuICAgIH0gLy9QYW5lbHNDdHJsXG5cbn0pKCk7XG5cbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogRHJhZyBhbmQgZHJvcCBhbnkgcGFuZWwgYmFzZWQgb24galF1ZXJ5VUkgcG9ydGxldHNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAucGFuZWxzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgncG9ydGxldCcsIHBvcnRsZXQpO1xuXG4gICAgcG9ydGxldC4kaW5qZWN0ID0gWyckdGltZW91dCcsICckbG9jYWxTdG9yYWdlJ107XG4gICAgZnVuY3Rpb24gcG9ydGxldCAoJHRpbWVvdXQsICRsb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHZhciBzdG9yYWdlS2V5TmFtZSA9ICdwb3J0bGV0U3RhdGUnO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBsaW5rXG4gICAgICB9O1xuXG4gICAgICAvLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICBcbiAgICAgICAgLy8gbm90IGNvbXBhdGlibGUgd2l0aCBqcXVlcnkgc29ydGFibGVcbiAgICAgICAgaWYoISQuZm4uc29ydGFibGUpIHJldHVybjtcblxuICAgICAgICBlbGVtZW50LnNvcnRhYmxlKHtcbiAgICAgICAgICBjb25uZWN0V2l0aDogICAgICAgICAgJ1twb3J0bGV0XScsIC8vIHNhbWUgbGlrZSBkaXJlY3RpdmUgXG4gICAgICAgICAgaXRlbXM6ICAgICAgICAgICAgICAgICdkaXYucGFuZWwnLFxuICAgICAgICAgIGhhbmRsZTogICAgICAgICAgICAgICAnLnBvcnRsZXQtaGFuZGxlcicsXG4gICAgICAgICAgb3BhY2l0eTogICAgICAgICAgICAgIDAuNyxcbiAgICAgICAgICBwbGFjZWhvbGRlcjogICAgICAgICAgJ3BvcnRsZXQgYm94LXBsYWNlaG9sZGVyJyxcbiAgICAgICAgICBjYW5jZWw6ICAgICAgICAgICAgICAgJy5wb3J0bGV0LWNhbmNlbCcsXG4gICAgICAgICAgZm9yY2VQbGFjZWhvbGRlclNpemU6IHRydWUsXG4gICAgICAgICAgaWZyYW1lRml4OiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgIHRvbGVyYW5jZTogICAgICAgICAgICAncG9pbnRlcicsXG4gICAgICAgICAgaGVscGVyOiAgICAgICAgICAgICAgICdvcmlnaW5hbCcsXG4gICAgICAgICAgcmV2ZXJ0OiAgICAgICAgICAgICAgIDIwMCxcbiAgICAgICAgICBmb3JjZUhlbHBlclNpemU6ICAgICAgdHJ1ZSxcbiAgICAgICAgICB1cGRhdGU6ICAgICAgICAgICAgICAgc2F2ZVBvcnRsZXRPcmRlcixcbiAgICAgICAgICBjcmVhdGU6ICAgICAgICAgICAgICAgbG9hZFBvcnRsZXRPcmRlclxuICAgICAgICB9KTtcblxuICAgICAgfVxuXG5cbiAgICAgIGZ1bmN0aW9uIHNhdmVQb3J0bGV0T3JkZXIoZXZlbnQvKiwgdWkqLykge1xuICAgICAgICB2YXIgc2VsZiA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgdmFyIGRhdGEgPSBhbmd1bGFyLmZyb21Kc29uKCRsb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleU5hbWVdKTtcbiAgICAgICAgXG4gICAgICAgIGlmKCFkYXRhKSB7IGRhdGEgPSB7fTsgfVxuXG4gICAgICAgIGRhdGFbc2VsZi5pZF0gPSAkKHNlbGYpLnNvcnRhYmxlKCd0b0FycmF5Jyk7XG5cbiAgICAgICAgaWYoZGF0YSkge1xuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5TmFtZV0gPSBhbmd1bGFyLnRvSnNvbihkYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBsb2FkUG9ydGxldE9yZGVyKGV2ZW50KSB7XG4gICAgICAgIHZhciBzZWxmID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgZGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24oJGxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5TmFtZV0pO1xuXG4gICAgICAgIGlmKGRhdGEpIHtcbiAgICAgICAgICBcbiAgICAgICAgICB2YXIgcG9ybGV0SWQgPSBzZWxmLmlkLFxuICAgICAgICAgICAgICBwYW5lbHMgICA9IGRhdGFbcG9ybGV0SWRdO1xuXG4gICAgICAgICAgaWYocGFuZWxzKSB7XG4gICAgICAgICAgICB2YXIgcG9ydGxldCA9ICQoJyMnK3BvcmxldElkKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJC5lYWNoKHBhbmVscywgZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAkKCcjJyt2YWx1ZSkuYXBwZW5kVG8ocG9ydGxldCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuXG59KSgpO1xuICIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnByZWxvYWRlcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncHJlbG9hZGVyJywgcHJlbG9hZGVyKTtcclxuXHJcbiAgICBwcmVsb2FkZXIuJGluamVjdCA9IFsnJGFuaW1hdGUnLCAnJHRpbWVvdXQnLCAnJHEnXTtcclxuICAgIGZ1bmN0aW9uIHByZWxvYWRlciAoJGFuaW1hdGUsICR0aW1lb3V0LCAkcSkge1xyXG5cclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBQycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcclxuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInByZWxvYWRlci1wcm9ncmVzc1wiPicgK1xyXG4gICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInByZWxvYWRlci1wcm9ncmVzcy1iYXJcIiAnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAnbmctc3R5bGU9XCJ7d2lkdGg6IGxvYWRDb3VudGVyICsgXFwnJVxcJ31cIj48L2Rpdj4nICtcclxuICAgICAgICAgICAgICAnPC9kaXY+J1xyXG4gICAgICAgICAgICAsXHJcbiAgICAgICAgICAgIGxpbms6IGxpbmtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWwpIHtcclxuXHJcbiAgICAgICAgICBzY29wZS5sb2FkQ291bnRlciA9IDA7XHJcblxyXG4gICAgICAgICAgdmFyIGNvdW50ZXIgID0gMCxcclxuICAgICAgICAgICAgICB0aW1lb3V0O1xyXG5cclxuICAgICAgICAgIC8vIGRpc2FibGVzIHNjcm9sbGJhclxyXG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdib2R5JykuY3NzKCdvdmVyZmxvdycsICdoaWRkZW4nKTtcclxuICAgICAgICAgIC8vIGVuc3VyZSBjbGFzcyBpcyBwcmVzZW50IGZvciBzdHlsaW5nXHJcbiAgICAgICAgICBlbC5hZGRDbGFzcygncHJlbG9hZGVyJyk7XHJcblxyXG4gICAgICAgICAgYXBwUmVhZHkoKS50aGVuKGVuZENvdW50ZXIpO1xyXG5cclxuICAgICAgICAgIHRpbWVvdXQgPSAkdGltZW91dChzdGFydENvdW50ZXIpO1xyXG5cclxuICAgICAgICAgIC8vLy8vLy9cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBzdGFydENvdW50ZXIoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVtYWluaW5nID0gMTAwIC0gY291bnRlcjtcclxuICAgICAgICAgICAgY291bnRlciA9IGNvdW50ZXIgKyAoMC4wMTUgKiBNYXRoLnBvdygxIC0gTWF0aC5zcXJ0KHJlbWFpbmluZyksIDIpKTtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLmxvYWRDb3VudGVyID0gcGFyc2VJbnQoY291bnRlciwgMTApO1xyXG5cclxuICAgICAgICAgICAgdGltZW91dCA9ICR0aW1lb3V0KHN0YXJ0Q291bnRlciwgMjApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGVuZENvdW50ZXIoKSB7XHJcblxyXG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZW91dCk7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5sb2FkQ291bnRlciA9IDEwMDtcclxuXHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgLy8gYW5pbWF0ZSBwcmVsb2FkZXIgaGlkaW5nXHJcbiAgICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3MoZWwsICdwcmVsb2FkZXItaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgLy8gcmV0b3JlIHNjcm9sbGJhclxyXG4gICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLmNzcygnb3ZlcmZsb3cnLCAnJyk7XHJcbiAgICAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gYXBwUmVhZHkoKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHZhciB2aWV3c0xvYWRlZCA9IDA7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgZG9lc24ndCBzeW5jIHdpdGggdGhlIHJlYWwgYXBwIHJlYWR5XHJcbiAgICAgICAgICAgIC8vIGEgY3VzdG9tIGV2ZW50IG11c3QgYmUgdXNlZCBpbnN0ZWFkXHJcbiAgICAgICAgICAgIHZhciBvZmYgPSBzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICB2aWV3c0xvYWRlZCArKztcclxuICAgICAgICAgICAgICAvLyB3ZSBrbm93IHRoZXJlIGFyZSBhdCBsZWFzdCB0d28gdmlld3MgdG8gYmUgbG9hZGVkIFxyXG4gICAgICAgICAgICAgIC8vIGJlZm9yZSB0aGUgYXBwIGlzIHJlYWR5ICgxLWluZGV4Lmh0bWwgMi1hcHAqLmh0bWwpXHJcbiAgICAgICAgICAgICAgaWYgKCB2aWV3c0xvYWRlZCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgLy8gd2l0aCByZXNvbHZlIHRoaXMgZmlyZXMgb25seSBvbmNlXHJcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAzMDAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICBvZmYoKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IC8vbGlua1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiBoZWxwZXJzLmpzXHJcbiAqIFByb3ZpZGVzIGhlbHBlciBmdW5jdGlvbnMgZm9yIHJvdXRlcyBkZWZpbml0aW9uXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm91dGVzJylcclxuICAgICAgICAucHJvdmlkZXIoJ1JvdXRlSGVscGVycycsIFJvdXRlSGVscGVyc1Byb3ZpZGVyKVxyXG4gICAgICAgIDtcclxuXHJcbiAgICBSb3V0ZUhlbHBlcnNQcm92aWRlci4kaW5qZWN0ID0gWydBUFBfUkVRVUlSRVMnXTtcclxuICAgIGZ1bmN0aW9uIFJvdXRlSGVscGVyc1Byb3ZpZGVyKEFQUF9SRVFVSVJFUykge1xyXG5cclxuICAgICAgLyoganNoaW50IHZhbGlkdGhpczp0cnVlICovXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gcHJvdmlkZXIgYWNjZXNzIGxldmVsXHJcbiAgICAgICAgYmFzZXBhdGg6IGJhc2VwYXRoLFxyXG4gICAgICAgIHJlc29sdmVGb3I6IHJlc29sdmVGb3IsXHJcbiAgICAgICAgLy8gY29udHJvbGxlciBhY2Nlc3MgbGV2ZWxcclxuICAgICAgICAkZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGJhc2VwYXRoOiBiYXNlcGF0aCxcclxuICAgICAgICAgICAgcmVzb2x2ZUZvcjogcmVzb2x2ZUZvclxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBTZXQgaGVyZSB0aGUgYmFzZSBvZiB0aGUgcmVsYXRpdmUgcGF0aFxyXG4gICAgICAvLyBmb3IgYWxsIGFwcCB2aWV3c1xyXG4gICAgICBmdW5jdGlvbiBiYXNlcGF0aCh1cmkpIHtcclxuICAgICAgICByZXR1cm4gJ2FwcC92aWV3cy8nICsgdXJpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBHZW5lcmF0ZXMgYSByZXNvbHZlIG9iamVjdCBieSBwYXNzaW5nIHNjcmlwdCBuYW1lc1xyXG4gICAgICAvLyBwcmV2aW91c2x5IGNvbmZpZ3VyZWQgaW4gY29uc3RhbnQuQVBQX1JFUVVJUkVTXHJcbiAgICAgIGZ1bmN0aW9uIHJlc29sdmVGb3IoKSB7XHJcbiAgICAgICAgdmFyIF9hcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBkZXBzOiBbJyRvY0xhenlMb2FkJywnJHEnLCBmdW5jdGlvbiAoJG9jTEwsICRxKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZXMgYSBwcm9taXNlIGNoYWluIGZvciBlYWNoIGFyZ3VtZW50XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJHEud2hlbigxKTsgLy8gZW1wdHkgcHJvbWlzZVxyXG4gICAgICAgICAgICBmb3IodmFyIGk9MCwgbGVuPV9hcmdzLmxlbmd0aDsgaSA8IGxlbjsgaSArKyl7XHJcbiAgICAgICAgICAgICAgcHJvbWlzZSA9IGFuZFRoZW4oX2FyZ3NbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG5cclxuICAgICAgICAgICAgLy8gY3JlYXRlcyBwcm9taXNlIHRvIGNoYWluIGR5bmFtaWNhbGx5XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFuZFRoZW4oX2FyZykge1xyXG4gICAgICAgICAgICAgIC8vIGFsc28gc3VwcG9ydCBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2VcclxuICAgICAgICAgICAgICBpZih0eXBlb2YgX2FyZyA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbihfYXJnKTtcclxuICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXMgYSBtb2R1bGUsIHBhc3MgdGhlIG5hbWUuIElmIG5vdCwgcGFzcyB0aGUgYXJyYXlcclxuICAgICAgICAgICAgICAgICAgICB2YXIgd2hhdFRvTG9hZCA9IGdldFJlcXVpcmVkKF9hcmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNpbXBsZSBlcnJvciBjaGVja1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCF3aGF0VG9Mb2FkKSByZXR1cm4gJC5lcnJvcignUm91dGUgcmVzb2x2ZTogQmFkIHJlc291cmNlIG5hbWUgWycgKyBfYXJnICsgJ10nKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBmaW5hbGx5LCByZXR1cm4gYSBwcm9taXNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRvY0xMLmxvYWQoIHdoYXRUb0xvYWQgKTtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY2hlY2sgYW5kIHJldHVybnMgcmVxdWlyZWQgZGF0YVxyXG4gICAgICAgICAgICAvLyBhbmFseXplIG1vZHVsZSBpdGVtcyB3aXRoIHRoZSBmb3JtIFtuYW1lOiAnJywgZmlsZXM6IFtdXVxyXG4gICAgICAgICAgICAvLyBhbmQgYWxzbyBzaW1wbGUgYXJyYXkgb2Ygc2NyaXB0IGZpbGVzIChmb3Igbm90IGFuZ3VsYXIganMpXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFJlcXVpcmVkKG5hbWUpIHtcclxuICAgICAgICAgICAgICBpZiAoQVBQX1JFUVVJUkVTLm1vZHVsZXMpXHJcbiAgICAgICAgICAgICAgICAgIGZvcih2YXIgbSBpbiBBUFBfUkVRVUlSRVMubW9kdWxlcylcclxuICAgICAgICAgICAgICAgICAgICAgIGlmKEFQUF9SRVFVSVJFUy5tb2R1bGVzW21dLm5hbWUgJiYgQVBQX1JFUVVJUkVTLm1vZHVsZXNbbV0ubmFtZSA9PT0gbmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQVBQX1JFUVVJUkVTLm1vZHVsZXNbbV07XHJcbiAgICAgICAgICAgICAgcmV0dXJuIEFQUF9SRVFVSVJFUy5zY3JpcHRzICYmIEFQUF9SRVFVSVJFUy5zY3JpcHRzW25hbWVdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfV19O1xyXG4gICAgICB9IC8vIHJlc29sdmVGb3JcclxuXHJcbiAgICB9XHJcblxyXG5cclxufSkoKTtcclxuXHJcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IGNvbmZpZy5qc1xyXG4gKiBBcHAgcm91dGVzIGFuZCByZXNvdXJjZXMgY29uZmlndXJhdGlvblxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5yb3V0ZXMnKVxyXG4gICAgICAgIC5jb25maWcocm91dGVzQ29uZmlnKTtcclxuXHJcbiAgICByb3V0ZXNDb25maWcuJGluamVjdCA9IFsnJHN0YXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgJ1JvdXRlSGVscGVyc1Byb3ZpZGVyJ107XHJcbiAgICBmdW5jdGlvbiByb3V0ZXNDb25maWcoJHN0YXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsIGhlbHBlcil7XHJcblxyXG4gICAgICAgIC8vIFNldCB0aGUgZm9sbG93aW5nIHRvIHRydWUgdG8gZW5hYmxlIHRoZSBIVE1MNSBNb2RlXHJcbiAgICAgICAgLy8gWW91IG1heSBoYXZlIHRvIHNldCA8YmFzZT4gdGFnIGluIGluZGV4IGFuZCBhIHJvdXRpbmcgY29uZmlndXJhdGlvbiBpbiB5b3VyIHNlcnZlclxyXG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZShmYWxzZSk7XHJcblxyXG4gICAgICAgIC8vIGRlZmF1bHRzIHRvIGRhc2hib2FyZFxyXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9hcHAvZGFzaGJvYXJkJyk7XHJcblxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gQXBwbGljYXRpb24gUm91dGVzXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2FwcCcsXHJcbiAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnYXBwLmh0bWwnKSxcclxuICAgICAgICAgICAgICByZXNvbHZlOiBoZWxwZXIucmVzb2x2ZUZvcignZmFzdGNsaWNrJywgJ21vZGVybml6cicsICdpY29ucycsICdzY3JlZW5mdWxsJywgJ2FuaW1vJywgJ3NwYXJrbGluZXMnLCAnc2xpbXNjcm9sbCcsICdjbGFzc3lsb2FkZXInLCAndG9hc3RlcicsICd3aGlybCcsICdtb21lbnQnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLmRhc2hib2FyZCcsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvZGFzaGJvYXJkJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0Rhc2hib2FyZCcsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnZGFzaGJvYXJkLmh0bWwnKSxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGFzaGJvYXJkQ29udHJvbGxlciBhcyBkYXNoJyxcclxuICAgICAgICAgICAgICByZXNvbHZlOiBoZWxwZXIucmVzb2x2ZUZvcignZmxvdC1jaGFydCcsJ2Zsb3QtY2hhcnQtcGx1Z2lucycsICduZ0RpYWxvZycpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAuc2VsbCcsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvc2VsbCcsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdzZWxsJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdzZWxsLmh0bWwnKSxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2VsbENvbnRyb2xsZXIgYXMgc2VsbCcsXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdEaWFsb2cnLCAnb2l0b3plcm8ubmdTd2VldEFsZXJ0JywgJ2xvYWRlcnMuY3NzJywgJ3NwaW5raXQnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLm1lbWJlcnMnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL21lbWJlcnMnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnTWVtYmVycycsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnbWVtYmVycy5odG1sJyksXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01lbWJlcnNDb250cm9sbGVyIGFzIG1lbWJlcnMnLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCduZ1RhYmxlJywgJ25nVGFibGVFeHBvcnQnLCAnbmdEaWFsb2cnLCAnb2l0b3plcm8ubmdTd2VldEFsZXJ0JywgJ3NwaW5raXQnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLm1lbWJlcicsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvbWVtYmVycy86bWVtYmVySWQnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnTWVtYmVyIERldGFpbCcsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnbWVtYmVyLmh0bWwnKSxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWVtYmVyQ29udHJvbGxlciBhcyBtZW1iZXInLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCduZ1RhYmxlJywgJ25nRGlhbG9nJywgJ29pdG96ZXJvLm5nU3dlZXRBbGVydCcsICdzcGlua2l0JylcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ2FwcC5kZWFscycsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvZGVhbHMnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnRGVhbHMnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBoZWxwZXIuYmFzZXBhdGgoJ2RlYWxzLmh0bWwnKSxcclxuICAgICAgICAgICAgICByZXNvbHZlOiBoZWxwZXIucmVzb2x2ZUZvcignbmdUYWJsZScsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAuZGVhbCcsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvZGVhbHMvOmRlYWxJZCcsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdEZWFsJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdkZWFsLmh0bWwnKSxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGVhbENvbnRyb2xsZXIgYXMgZGMnLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCduZ1RhYmxlJywgJ25nRGlhbG9nJywgJ29pdG96ZXJvLm5nU3dlZXRBbGVydCcsICdzcGlua2l0JylcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ2FwcC5jb3N0Jywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9jb3N0JyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0Nvc3QnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBoZWxwZXIuYmFzZXBhdGgoJ2Nvc3QuaHRtbCcpLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCduZ1RhYmxlJywgJ25nVGFibGVFeHBvcnQnLCAnbmdEaWFsb2cnLCAnb2l0b3plcm8ubmdTd2VldEFsZXJ0JywgJ3NwaW5raXQnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLml0ZW0nLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2l0ZW0nLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnSXRlbScsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnaXRlbS5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdUYWJsZUV4cG9ydCcsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAuaXRlbS1hZGQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2l0ZW0tYWRkJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0l0ZW0gQWRkJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdpdGVtLWFkZC5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ3BhcnNsZXknKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLmNhcmQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2NhcmQnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnQ2FyZCcsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnY2FyZC5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdUYWJsZUV4cG9ydCcsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAuY2FtcGFpZ24nLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL2NhbXBhaWduJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0NhbXBhaWduJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdjYW1wYWlnbi5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdUYWJsZUV4cG9ydCcsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdhcHAubXlzaG9wJywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9teXNob3AnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnTXlTaG9wJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogaGVscGVyLmJhc2VwYXRoKCdteXNob3AuaHRtbCcpLFxyXG4gICAgICAgICAgICAgIHJlc29sdmU6IGhlbHBlci5yZXNvbHZlRm9yKCd4ZWRpdGFibGUnKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgnYXBwLnNldHRpbmcnLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3NldHRpbmcnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnU2V0dGluZycsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGhlbHBlci5iYXNlcGF0aCgnc2V0dGluZy5odG1sJyksXHJcbiAgICAgICAgICAgICAgcmVzb2x2ZTogaGVscGVyLnJlc29sdmVGb3IoJ25nVGFibGUnLCAnbmdUYWJsZUV4cG9ydCcsICduZ0RpYWxvZycsICdvaXRvemVyby5uZ1N3ZWV0QWxlcnQnLCAnc3BpbmtpdCcpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLy9cclxuICAgICAgICAgIC8vIFNpbmdsZSBQYWdlIFJvdXRlc1xyXG4gICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgIC5zdGF0ZSgncGFnZScsIHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZScsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvcGFnZS5odG1sJyxcclxuICAgICAgICAgICAgICByZXNvbHZlOiBoZWxwZXIucmVzb2x2ZUZvcignbW9kZXJuaXpyJywgJ2ljb25zJyksXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogWyckcm9vdFNjb3BlJywgZnVuY3Rpb24oJHJvb3RTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmFwcC5sYXlvdXQuaXNCb3hlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnN0YXRlKCdwYWdlLmxvZ2luJywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdMb2dpbicsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvbG9naW4uaHRtbCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ3BhZ2UucmVnaXN0ZXInLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ1JlZ2lzdGVyJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy9yZWdpc3Rlci5odG1sJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zdGF0ZSgncGFnZS5yZWNvdmVyJywge1xyXG4gICAgICAgICAgICAgIHVybDogJy9yZWNvdmVyJyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ1JlY292ZXInLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BhZ2VzL3JlY292ZXIuaHRtbCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3RhdGUoJ3BhZ2UuNDA0Jywge1xyXG4gICAgICAgICAgICAgIHVybDogJy80MDQnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnTm90IEZvdW5kJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy80MDQuaHRtbCdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAvL1xyXG4gICAgICAgICAgLy8gQ1VTVE9NIFJFU09MVkVTXHJcbiAgICAgICAgICAvLyAgIEFkZCB5b3VyIG93biByZXNvbHZlcyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAvLyAgIGZvbGxvd2luZyB0aGlzIG9iamVjdCBleHRlbmRcclxuICAgICAgICAgIC8vICAgbWV0aG9kXHJcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgLy8gLnN0YXRlKCdhcHAuc29tZXJvdXRlJywge1xyXG4gICAgICAgICAgLy8gICB1cmw6ICcvc29tZV91cmwnLFxyXG4gICAgICAgICAgLy8gICB0ZW1wbGF0ZVVybDogJ3BhdGhfdG9fdGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAvLyAgIGNvbnRyb2xsZXI6ICdzb21lQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAvLyAgIHJlc29sdmU6IGFuZ3VsYXIuZXh0ZW5kKFxyXG4gICAgICAgICAgLy8gICAgIGhlbHBlci5yZXNvbHZlRm9yKCksIHtcclxuICAgICAgICAgIC8vICAgICAvLyBZT1VSIFJFU09MVkVTIEdPIEhFUkVcclxuICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAvLyAgIClcclxuICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICA7XHJcblxyXG4gICAgfSAvLyByb3V0ZXNDb25maWdcclxuXHJcbn0pKCk7XHJcblxyXG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuc2FsZXMnKVxuICAgICAgICAuc2VydmljZSgnZGVhbFNlcnZpY2UnLCBkZWFsU2VydmljZSlcbiAgICAgICAgLnNlcnZpY2UoJ3JldHVyblNlcnZpY2UnLCByZXR1cm5TZXJ2aWNlKVxuICAgIDtcblxuICAgIGRlYWxTZXJ2aWNlLiRpbmplY3QgPSBbJ0RlYWwnLCAnU2t1JywgJ25nRGlhbG9nJywgJyRyb290U2NvcGUnXTtcbiAgICBmdW5jdGlvbiBkZWFsU2VydmljZShEZWFsLCBTa3UsIG5nRGlhbG9nLCAkcm9vdFNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHRoaXMub3BlbkRlYWwgPSBvcGVuRGVhbDtcbiAgICAgIHRoaXMucXVlcnlTa3VzID0gcXVlcnlTa3VzO1xuICAgICAgdGhpcy5yZWdpc3RlciA9IHJlZ2lzdGVyO1xuICAgICAgdGhpcy5zdWJzdHJhY3RPbmUgPSBzdWJzdHJhY3RPbmU7XG4gICAgICB0aGlzLmNvdW50VG90YWwgPSBjb3VudFRvdGFsO1xuICAgICAgdGhpcy5jaGVja291dCA9IGNoZWNrb3V0OyBcbiAgICAgIHRoaXMub25DaGFuZ2VQYXlUeXBlID0gb25DaGFuZ2VQYXlUeXBlO1xuICAgICAgdGhpcy5jb3VudENoYW5nZSA9IGNvdW50Q2hhbmdlO1xuICAgICAgdGhpcy5wYXkgPSBwYXk7XG4gICAgICB0aGlzLnBheVR5cGUgPSB7XG4gICAgICAgIGRlcG9zaXQ6IFwi5Lya5ZGY5YKo5YC8XCIsXG4gICAgICAgIGNhc2g6IFwi546w6YeR5pSv5LuYXCIsXG4gICAgICAgIGJhbmtjYXJkOiBcIuWIt+WNoeaUr+S7mFwiLFxuICAgICAgICB3eHBheTogXCLlvq7kv6HmlK/ku5hcIixcbiAgICAgICAgYWxpcGF5OiBcIuaUr+S7mOWunVwiXG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBvcGVuRGVhbChtZW1iZXIpIHtcbiAgICAgICAgc2VsZi5kZWFsID0ge1xuICAgICAgICAgIGVudGl0aWVzOiBbXSxcbiAgICAgICAgICB0b3RhbEFtb3VudDogMCxcbiAgICAgICAgICB0b3RhbFF0eTogMCxcbiAgICAgICAgICBtZW1iZXI6IG1lbWJlcixcbiAgICAgICAgICBzdGF0dXM6ICdvcGVuZWQnLFxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKClcbiAgICAgICAgfVxuICAgICAgICBzZWxmLnNlbGVjdGVkU2t1ID0gdW5kZWZpbmVkO1xuICAgICAgICBzZWxmLmNhc2ggPSB7fTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gcXVlcnlTa3VzICh2YWwpIHtcbiAgICAgICAgcmV0dXJuIFNrdS5maW5kKHtmaWx0ZXI6e3doZXJlOntiYXJjb2RlOntyZWdleDogdmFsfX19LCBsaW1pdDogMTB9KVxuICAgICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAoc2t1cykge1xuICAgICAgICAgIHJldHVybiBza3VzO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgZnVuY3Rpb24gcmVnaXN0ZXIgKCkge1xuICAgICAgICBpZihzZWxmLnNlbGVjdGVkU2t1ICYmIHNlbGYuc2VsZWN0ZWRTa3UgaW5zdGFuY2VvZiBTa3UpIHtcbiAgICAgICAgICB2YXIgZW50aXR5ID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzZWxmLmRlYWwuZW50aXRpZXMsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZihlLnNrdS5iYXJjb2RlID09PSBzZWxmLnNlbGVjdGVkU2t1LmJhcmNvZGUpe1xuICAgICAgICAgICAgICBlLnF0eSsrO1xuICAgICAgICAgICAgICBlbnRpdHkgPSBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmKCFlbnRpdHkpIHtcbiAgICAgICAgICAgIGVudGl0eSA9IHtcbiAgICAgICAgICAgICAgc2t1OiBzZWxmLnNlbGVjdGVkU2t1LFxuICAgICAgICAgICAgICBxdHk6IDFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzZWxmLmRlYWwuZW50aXRpZXMucHVzaChlbnRpdHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZWxmLnNlbGVjdGVkU2t1ID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBzdWJzdHJhY3RPbmUgKGVudGl0eSwgaW5kZXgpIHtcbiAgICAgICAgZW50aXR5LnF0eS0tO1xuICAgICAgICBpZihlbnRpdHkucXR5ID09PSAwKSB7XG4gICAgICAgICAgc2VsZi5kZWFsLmVudGl0aWVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgZnVuY3Rpb24gY291bnRUb3RhbCAoKSB7XG4gICAgICAgIHNlbGYuZGVhbC50b3RhbEFtb3VudCA9IDA7XG4gICAgICAgIHNlbGYuZGVhbC50b3RhbFF0eSA9IDA7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzZWxmLmRlYWwuZW50aXRpZXMsIGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICAgICAgICBzZWxmLmRlYWwudG90YWxRdHkgKz0gZW50aXR5LnF0eTtcbiAgICAgICAgICBzZWxmLmRlYWwudG90YWxBbW91bnQgKz0gZW50aXR5LnF0eSplbnRpdHkuc2t1LnByaWNlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHNlbGYuZGVhbC50b3RhbEFtb3VudDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gY2hlY2tvdXQgKCkge1xuICAgICAgICBzZWxmLmRlYWwucGF5bWVudCA9IHt0eXBlOiAnY2FzaCd9O1xuICAgICAgICBpZihzZWxmLmRlYWwubWVtYmVyKSB7XG4gICAgICAgICAgc2VsZi5kZWFsLm1lbWJlcklkID0gc2VsZi5kZWFsLm1lbWJlci5pZDtcbiAgICAgICAgICBzZWxmLmRlYWwuZGlzY291bnRBbW91bnQgPSBzZWxmLmRlYWwudG90YWxBbW91bnQqKDEwMC1zZWxmLmRlYWwubWVtYmVyLmRpc2NvdW50KS8xMDA7XG4gICAgICAgICAgaWYoJHJvb3RTY29wZS51c2VyLm1lcmNoYW50LmVuYWJsZUJvbnVzQmlkKSB7XG4gICAgICAgICAgICBzZWxmLmRlYWwuYm9udXNWb3VjaEFtb3VudCA9IE1hdGgucm91bmQoc2VsZi5kZWFsLm1lbWJlci5ib251cy8kcm9vdFNjb3BlLnVzZXIubWVyY2hhbnQuYm9udXNCaWRSYXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5kZWFsLmRpc2NvdW50QW1vdW50ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmRlYWwuZmVlID0gc2VsZi5kZWFsLnRvdGFsQW1vdW50LXNlbGYuZGVhbC5kaXNjb3VudEFtb3VudDtcbiAgICAgICAgaWYoc2VsZi5kZWFsLm1lbWJlcikge1xuICAgICAgICAgIGlmKCRyb290U2NvcGUudXNlci5tZXJjaGFudC5lbmFibGVCb251c0JpZCkge1xuICAgICAgICAgICAgaWYoc2VsZi5kZWFsLmJvbnVzVm91Y2hBbW91bnQgPiBzZWxmLmRlYWwuZmVlKSB7XG4gICAgICAgICAgICAgIHNlbGYuZGVhbC5ib251c1ZvdWNoQW1vdW50ID0gc2VsZi5kZWFsLmZlZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuZGVhbC5mZWUgLT0gc2VsZi5kZWFsLmJvbnVzVm91Y2hBbW91bnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKHNlbGYuZGVhbC5tZW1iZXIuYmFsYW5jZSA+PSBzZWxmLmRlYWwuZmVlKSB7XG4gICAgICAgICAgICBzZWxmLmRlYWwucGF5bWVudC50eXBlID0gJ2RlcG9zaXQnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgXG4gICAgICAgIG9uQ2hhbmdlUGF5VHlwZSgpO1xuICAgICAgICBcbiAgICAgICAgbmdEaWFsb2cub3Blbih7IFxuICAgICAgICAgIHRlbXBsYXRlOiAnY2hlY2tvdXREaWFsb2dJZCcsIFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdjaGVja291dERpYWxvZ0NvbnRyb2xsZXInXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBvbkNoYW5nZVBheVR5cGUoKSB7XG4gICAgICAgIHNlbGYuZGVhbC5wYXltZW50LmFtb3VudCA9IHNlbGYuZGVhbC5mZWU7XG4gICAgICAgIGlmKHNlbGYuZGVhbC5wYXltZW50LnR5cGUgPT09ICdjYXNoJykge1xuICAgICAgICAgIHNlbGYuZGVhbC5wYXltZW50LmNoYW5nZSA9IHNlbGYuZGVhbC5mZWUlJHJvb3RTY29wZS51c2VyLm1lcmNoYW50LmNoYW5nZVJhdGU7XG4gICAgICAgICAgc2VsZi5kZWFsLnBheW1lbnQuYW1vdW50IC09IHNlbGYuZGVhbC5wYXltZW50LmNoYW5nZTtcbiAgICAgICAgICBjb3VudENoYW5nZSgpO1xuICAgICAgICB9IGVsc2UgaWYoc2VsZi5kZWFsLnBheW1lbnQudHlwZSA9PT0gJ2RlcG9zaXQnKSB7XG4gICAgICAgICAgc2VsZi5kZWFsLnBheW1lbnQuYW1vdW50ID0gMC1zZWxmLmRlYWwuZmVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuZGVhbC5wYXltZW50LmFtb3VudCA9IHNlbGYuZGVhbC5mZWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gY291bnRDaGFuZ2UoKSB7XG4gICAgICAgIGlmKHNlbGYuZGVhbC5wYXltZW50LnR5cGUgPT09ICdjYXNoJykge1xuICAgICAgICAgIHNlbGYuY2FzaCA9IHNlbGYuY2FzaCB8fCB7fTtcbiAgICAgICAgICBzZWxmLmNhc2gucGFpZCA9IHNlbGYuY2FzaC5wYWlkIHx8IHNlbGYuZGVhbC5wYXltZW50LmFtb3VudDtcbiAgICAgICAgICBzZWxmLmNhc2guY2hhbmdlID0gc2VsZi5kZWFsLnBheW1lbnQuYW1vdW50IC0gc2VsZi5jYXNoLnBhaWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgZnVuY3Rpb24gcGF5KCkge1xuICAgICAgICBzZWxmLmRlYWwuc3RhdHVzID0gJ2Nsb3NlZCc7XG4gICAgICAgIGRlbGV0ZSBzZWxmLmRlYWwubWVtYmVyO1xuICAgICAgICByZXR1cm4gRGVhbC5jcmVhdGUoc2VsZi5kZWFsKS4kcHJvbWlzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm5TZXJ2aWNlLiRpbmplY3QgPSBbJ0RlYWwnLCAnU2t1JywgJ25nRGlhbG9nJywgJyRyb290U2NvcGUnXTtcbiAgICBmdW5jdGlvbiByZXR1cm5TZXJ2aWNlKERlYWwsIFNrdSwgbmdEaWFsb2csICRyb290U2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgdGhpcy5vcGVuUmV0dXJuID0gb3BlblJldHVybjtcbiAgICAgIHRoaXMuY2hlY2tvdXQgPSBjaGVja291dDtcbiAgICAgIHRoaXMuZG9SZXR1cm4gPSBkb1JldHVybjtcbiAgICAgIHRoaXMuY291bnQgPSBjb3VudDtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gb3BlblJldHVybihkZWFsKSB7XG4gICAgICAgIHNlbGYuZGVhbCA9IGRlYWw7XG4gICAgICAgIHNlbGYucG9zdERhdGEgPSB7XG4gICAgICAgICAgZW50aXRpZXM6IFtdLFxuICAgICAgICAgIHRvdGFsQW1vdW50OiAwLFxuICAgICAgICAgIHRvdGFsUXR5OiAwLFxuICAgICAgICAgIHN0YXR1czogJ29wZW5lZCcsXG4gICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGNvdW50KCkge1xuICAgICAgICBzZWxmLnBvc3REYXRhLnRvdGFsQW1vdW50ID0gMDtcbiAgICAgICAgc2VsZi5wb3N0RGF0YS50b3RhbFF0eSA9IDA7XG4gICAgICAgIHNlbGYucG9zdERhdGEuZW50aXRpZXMuZm9yRWFjaChmdW5jdGlvbiAoZW50aXR5KSB7XG4gICAgICAgICAgc2VsZi5wb3N0RGF0YS50b3RhbEFtb3VudCArPSBlbnRpdHkucXR5KmVudGl0eS5za3UucHJpY2U7XG4gICAgICAgICAgc2VsZi5wb3N0RGF0YS50b3RhbFF0eSArPSBlbnRpdHkucXR5O1xuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLnBvc3REYXRhLmRpc2NvdW50QW1vdW50ID0gMDtcbiAgICAgICAgaWYoc2VsZi5kZWFsLm1lbWJlcikge1xuICAgICAgICAgIHNlbGYucG9zdERhdGEuZGlzY291bnRBbW91bnQgPSBzZWxmLnBvc3REYXRhLnRvdGFsQW1vdW50KigxMDAtc2VsZi5kZWFsLm1lbWJlci5kaXNjb3VudCkvMTAwOyAgICAgICAgICAgfVxuICAgICAgICBzZWxmLnBvc3REYXRhLmZlZSA9IHNlbGYucG9zdERhdGEudG90YWxBbW91bnQgLSBzZWxmLnBvc3REYXRhLmRpc2NvdW50QW1vdW50O1xuICAgICAgICBzZWxmLnBvc3REYXRhLnBheW1lbnQuYW1vdW50ID0gc2VsZi5wb3N0RGF0YS5mZWU7XG4gICAgICAgIGlmKHNlbGYucG9zdERhdGEucGF5bWVudC50eXBlID09PSAnY2FzaCcpIHtcbiAgICAgICAgICBzZWxmLnBvc3REYXRhLnBheW1lbnQuY2hhbmdlID0gc2VsZi5wb3N0RGF0YS5mZWUlJHJvb3RTY29wZS51c2VyLm1lcmNoYW50LmNoYW5nZVJhdGU7XG4gICAgICAgICAgc2VsZi5wb3N0RGF0YS5wYXltZW50LmFtb3VudCAtPSBzZWxmLnBvc3REYXRhLnBheW1lbnQuY2hhbmdlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGNoZWNrb3V0KGVudGl0eSkge1xuICAgICAgICBzZWxmLnBvc3REYXRhLnBheW1lbnQgPSB7dHlwZTogc2VsZi5kZWFsLnBheW1lbnQudHlwZX07XG4gICAgICAgIFxuICAgICAgICB2YXIgZW50aXRpZXMgPSBzZWxmLmRlYWwuZW50aXRpZXM7XG4gICAgICAgIGlmKGVudGl0eSkgZW50aXRpZXMgPSBbZW50aXR5XTtcbiAgICAgICAgXG4gICAgICAgIHNlbGYucG9zdERhdGEuZW50aXRpZXMgPSBbXTtcbiAgICAgICAgZW50aXRpZXMuZm9yRWFjaChmdW5jdGlvbiAoZW50aXR5KSB7XG4gICAgICAgICAgdmFyIGUgPSAge1xuICAgICAgICAgICAgc2t1OiBlbnRpdHkuc2t1LFxuICAgICAgICAgICAgcXR5OiBlbnRpdHkucXR5IC0gZW50aXR5LnJldHVybmVkUXR5XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGUucXR5ID4gMCkgc2VsZi5wb3N0RGF0YS5lbnRpdGllcy5wdXNoKGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGNvdW50KCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbmdEaWFsb2cub3Blbih7IFxuICAgICAgICAgIHRlbXBsYXRlOiAnY2hlY2tvdXRSZXR1cm5EaWFsb2dJZCcsIFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdjaGVja291dFJldHVybkRpYWxvZ0NvbnRyb2xsZXInXG4gICAgICAgIH0pLmNsb3NlUHJvbWlzZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gZG9SZXR1cm4oKSB7XG4gICAgICAgIHNlbGYucG9zdERhdGEuc3RhdHVzID0gJ2Nsb3NlZCc7XG4gICAgICAgIHJldHVybiBEZWFsLnJldHVybnMuY3JlYXRlKHtpZDogc2VsZi5kZWFsLmlkfSwgc2VsZi5wb3N0RGF0YSkuJHByb21pc2U7XG4gICAgICB9XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAubW9kdWxlKCdhcHAuc2FsZXMnKVxuICAgICAgLmNvbnRyb2xsZXIoJ1NlbGxDb250cm9sbGVyJywgU2VsbENvbnRyb2xsZXIpXG4gICAgICAuY29udHJvbGxlcignY2hlY2tvdXREaWFsb2dDb250cm9sbGVyJywgY2hlY2tvdXREaWFsb2dDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ0RlYWxzQ29udHJvbGxlcicsIERlYWxzQ29udHJvbGxlcilcbiAgICAgIC5jb250cm9sbGVyKCdEZWFsQ29udHJvbGxlcicsIERlYWxDb250cm9sbGVyKVxuICAgICAgLmNvbnRyb2xsZXIoJ2NoZWNrb3V0UmV0dXJuRGlhbG9nQ29udHJvbGxlcicsIGNoZWNrb3V0UmV0dXJuRGlhbG9nQ29udHJvbGxlcilcbiAgICA7XG4gICAgICBcbiAgICBTZWxsQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnZGVhbFNlcnZpY2UnLCAnQ2hlY2tpbiddO1xuICAgIGZ1bmN0aW9uIFNlbGxDb250cm9sbGVyKCRzY29wZSwgZGVhbFNlcnZpY2UsIENoZWNraW4pIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICBcbiAgICAgIGFjdGl2YXRlKCk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAkc2NvcGUuZGVhbFNlcnZpY2UgPSBkZWFsU2VydmljZTtcbiAgICAgICAgaWYoIWRlYWxTZXJ2aWNlLmRlYWwpIHtcbiAgICAgICAgICBkZWFsU2VydmljZS5vcGVuRGVhbCgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBDSEVDS0lOXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuICAgICAgICB2bS5jaGVja2lucyA9IENoZWNraW4uZmluZCh7ZmlsdGVyOntcbiAgICAgICAgICB3aGVyZToge21lcmNoYW50SWQ6ICRzY29wZS51c2VyLnNob3BJZH0sXG4gICAgICAgICAgaW5jbHVkZTogW3ttZW1iZXI6ICd3eHVzZXInfV0sXG4gICAgICAgICAgbGltaXQ6IDEwLCBcbiAgICAgICAgICBvcmRlcjogJ2NyZWF0ZWQgREVTQydcbiAgICAgICAgfX0pO1xuICAgICAgICBcbiAgICAgICAgdm0udGVtcGxhdGVVcmwgPSAnY2hlY2tpbnNUZW1wbGF0ZS5odG1sJztcbiAgICAgIH1cbiAgICAgICAgICAgIFxuICAgIH1cbiAgICBcbiAgICBjaGVja291dERpYWxvZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ25nRGlhbG9nJywgJ2RlYWxTZXJ2aWNlJywgJ3RvYXN0ZXInXTtcbiAgICBmdW5jdGlvbiBjaGVja291dERpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCBuZ0RpYWxvZywgZGVhbFNlcnZpY2UsIHRvYXN0ZXIpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAkc2NvcGUuZGVhbFNlcnZpY2UgPSBkZWFsU2VydmljZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmNvbmZpcm0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZGVhbFNlcnZpY2UucGF5KCkudGhlbihmdW5jdGlvbiAoZGVhbCkge1xuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgbmdEaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICAgIGRlYWxTZXJ2aWNlLm9wZW5EZWFsKCk7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICfmiJDlip8nLCBcIuWujOaIkOS6pOaYk1wiKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCAn5aSx6LSlJywgXCLkuqTmmJPmnKrlrozmiJDvvIzor7fph43or5XvvIFcIilcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgRGVhbHNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdEZWFsJywgJ25nVGFibGVQYXJhbXMnLCAnbmdUYWJsZUxCU2VydmljZSddO1xuICAgIGZ1bmN0aW9uIERlYWxzQ29udHJvbGxlcigkc2NvcGUsIERlYWwsIG5nVGFibGVQYXJhbXMsIG5nVGFibGVMQlNlcnZpY2UpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICBcbiAgICAgIGFjdGl2YXRlKCk7XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICB2bS5rZXl3b3JkID0gXCJcIjtcbiAgICAgICAgdm0udGFibGVQYXJhbXMgPSBuZXcgbmdUYWJsZVBhcmFtcyh7Y291bnQ6IDEwfSwge1xuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCRkZWZlciwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyID0ge3doZXJlOntzdGF0dXM6e25lOidkZWxldGVkJ319LCBpbmNsdWRlOltdfVxuICAgICAgICAgICAgaWYodm0ua2V5d29yZCAhPSAnJykge1xuICAgICAgICAgICAgICB2YXIgcXMgPSB7cmVnZXg6IGtleXdvcmR9O1xuICAgICAgICAgICAgICBmaWx0ZXIud2hlcmUub3IgPSBbe1wiZW50aXRpZXMuc2t1Lml0ZW0ubmFtZVwiOnFzfV07XG4gICAgICAgICAgICAgIHBhcmFtcy5wYWdlKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmdUYWJsZUxCU2VydmljZS5nZXREYXRhKCRkZWZlciwgcGFyYW1zLCBEZWFsLCBmaWx0ZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIERlYWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdEZWFsJywgJ25nVGFibGVQYXJhbXMnLCAnbmdUYWJsZUxCU2VydmljZScsICdyZXR1cm5TZXJ2aWNlJ107XG4gICAgZnVuY3Rpb24gRGVhbENvbnRyb2xsZXIoJHNjb3BlLCBEZWFsLCBuZ1RhYmxlUGFyYW1zLCBuZ1RhYmxlTEJTZXJ2aWNlLCByZXR1cm5TZXJ2aWNlKSB7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgXG4gICAgICBhY3RpdmF0ZSgpO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgdm0ucmV0dXJuU2t1ID0ge307XG4gICAgICAgIHZtLmRlYWwgPSBEZWFsLmZpbmRPbmUoe2ZpbHRlcjp7XG4gICAgICAgICAgd2hlcmU6IHtpZDogJHNjb3BlLiRzdGF0ZS5wYXJhbXMuZGVhbElkfSxcbiAgICAgICAgICBpbmNsdWRlOlsncmV0dXJucycsICdib251c2VzJ11cbiAgICAgICAgfX0pO1xuICAgICAgICB2bS5kZWFsLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKGRlYWwpIHtcbiAgICAgICAgICB2bS5kZWFsLmVudGl0aWVzLmZvckVhY2goZnVuY3Rpb24gKGVudGl0eSkge1xuICAgICAgICAgICAgZW50aXR5LnJldHVybmVkUXR5ID0gMDtcbiAgICAgICAgICAgIHZtLnJldHVyblNrdVtlbnRpdHkuc2t1LmlkXSA9IGVudGl0eTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZih2bS5kZWFsLnJldHVybnMgJiYgdm0uZGVhbC5yZXR1cm5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZtLmRlYWwucmV0dXJucy5mb3JFYWNoKGZ1bmN0aW9uIChyZXQpIHtcbiAgICAgICAgICAgICAgcmV0LmVudGl0aWVzLmZvckVhY2goZnVuY3Rpb24gKHJldHVybkVudGl0eSkge1xuICAgICAgICAgICAgICAgIHZtLnJldHVyblNrdVtyZXR1cm5FbnRpdHkuc2t1LmlkXS5yZXR1cm5lZFF0eSArPSByZXR1cm5FbnRpdHkucXR5O1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdm0ucmV0dXJuID0gdm0uZGVhbC5yZXR1cm5zWzBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5yZXR1cm4gPSB7ZW50aXRpZXM6W119O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5TZXJ2aWNlLm9wZW5SZXR1cm4odm0uZGVhbCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2bS5nb1JldHVybiA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICAgICAgcmV0dXJuU2VydmljZS5jaGVja291dChlbnRpdHkpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBhY3RpdmF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja291dFJldHVybkRpYWxvZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ25nRGlhbG9nJywgJ3JldHVyblNlcnZpY2UnLCAndG9hc3RlciddO1xuICAgIGZ1bmN0aW9uIGNoZWNrb3V0UmV0dXJuRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsIG5nRGlhbG9nLCByZXR1cm5TZXJ2aWNlLCB0b2FzdGVyKSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgJHNjb3BlLnJldHVyblNlcnZpY2UgPSByZXR1cm5TZXJ2aWNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY29uZmlybSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm5TZXJ2aWNlLmRvUmV0dXJuKCkudGhlbihmdW5jdGlvbiAocmV0KSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBuZ0RpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAn5oiQ5YqfJywgXCLlrozmiJDpgIDmrL7pgIDotKdcIik7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgJ+Wksei0pScsIFwi6YCA5qy+6YCA6LSn5pyq5a6M5oiQ77yM6K+36YeN6K+V77yBXCIpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJHNjb3BlLnN1Ym1pdGluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG59KSgpOyIsIi8qKlxuICogQW5ndWxhckpTIGRlZmF1bHQgZmlsdGVyIHdpdGggdGhlIGZvbGxvd2luZyBleHByZXNzaW9uOlxuICogXCJwZXJzb24gaW4gcGVvcGxlIHwgZmlsdGVyOiB7bmFtZTogJHNlbGVjdC5zZWFyY2gsIGFnZTogJHNlbGVjdC5zZWFyY2h9XCJcbiAqIHBlcmZvcm1zIGEgQU5EIGJldHdlZW4gJ25hbWU6ICRzZWxlY3Quc2VhcmNoJyBhbmQgJ2FnZTogJHNlbGVjdC5zZWFyY2gnLlxuICogV2Ugd2FudCB0byBwZXJmb3JtIGEgT1IuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnNhbGVzJylcbiAgICAgICAgLmZpbHRlcignZGVhbF9zdGF0dXMnLCBkZWFsU3RhdHVzRmlsdGVyKVxuICAgICAgICAuZmlsdGVyKCdwYXltZW50X3R5cGUnLCBwYXltZW50VHlwZUZpbHRlcilcbiAgICA7XG5cbiAgICBwYXltZW50VHlwZUZpbHRlci4kaW5qZWN0ID0gWydkZWFsU2VydmljZSddO1xuICAgIGZ1bmN0aW9uIHBheW1lbnRUeXBlRmlsdGVyKGRlYWxTZXJ2aWNlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICByZXR1cm4gZGVhbFNlcnZpY2UucGF5VHlwZVtrZXldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGVhbFN0YXR1c0ZpbHRlci4kaW5qZWN0ID0gW107XG4gICAgZnVuY3Rpb24gZGVhbFN0YXR1c0ZpbHRlcigpIHtcbiAgICAgIHZhciBkaWMgPSB7XG4gICAgICAgIGNsb3NlZDogJ+W3suWujOaIkCdcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiBkaWNba2V5XTtcbiAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgICAubW9kdWxlKCdhcHAuc2V0dGluZ3MnKVxuICAgICAgLmNvbnRyb2xsZXIoJ1NldHRpbmdDb250cm9sbGVyJywgU2V0dGluZ0NvbnRyb2xsZXIpXG4gIFxuICBTZXR0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICdNZXJjaGFudCcsICdTaG9wJywgJ01lbWJlcicsICd0b2FzdGVyJ107XG4gIGZ1bmN0aW9uIFNldHRpbmdDb250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSwgTWVyY2hhbnQsIFNob3AsIE1lbWJlciwgdG9hc3Rlcikge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uaW5kdXN0cnkgPSB7XG4gICAgICBcIklU56eR5oqAXCI6IHtcbiAgICAgICAgXCLkupLogZTnvZEv55S15a2Q5ZWG5YqhXCI6IFwiMVwiLFxuICAgICAgICBcIklU6L2v5Lu25LiO5pyN5YqhXCI6IFwiMlwiLFxuICAgICAgICBcIklU56Gs5Lu25LiO6K6+5aSHXCI6IFwiM1wiLFxuICAgICAgICBcIueUteWtkOaKgOacr1wiOiBcIjRcIixcbiAgICAgICAgXCLpgJrkv6HkuI7ov5DokKXllYZcIjogXCI1XCIsXG4gICAgICAgIFwi572R57uc5ri45oiPXCI6IFwiNlwiXG4gICAgICB9LFxuICAgICAgXCLph5Hono3kuJpcIjoge1xuICAgICAgICBcIumTtuihjFwiOiBcIjdcIixcbiAgICAgICAgXCLln7rph5F855CG6LSifOS/oeaJmFwiOiBcIjhcIixcbiAgICAgICAgXCLkv53pmalcIjogXCI5XCJcbiAgICAgIH0sXG4gICAgICBcIumkkOmlrlwiOiB7XG4gICAgICAgIFwi6aSQ6aWuXCI6IFwiMTBcIlxuICAgICAgfSxcbiAgICAgIFwi6YWS5bqX5peF5ri4XCI6IHtcbiAgICAgICAgXCLphZLlupdcIjogXCIxMVwiLFxuICAgICAgICBcIuaXhea4uFwiOiBcIjEyXCJcbiAgICAgIH0sXG4gICAgICBcIui/kOi+k+S4juS7k+WCqFwiOiB7XG4gICAgICAgIFwi5b+r6YCSXCI6IFwiMTNcIixcbiAgICAgICAgXCLnianmtYFcIjogXCIxNFwiLFxuICAgICAgICBcIuS7k+WCqFwiOiBcIjE1XCJcbiAgICAgIH0sXG4gICAgICBcIuaVmeiCslwiOiB7XG4gICAgICAgIFwi5Z+56K6tXCI6IFwiMTZcIixcbiAgICAgICAgXCLpmaLmoKFcIjogXCIxN1wiXG4gICAgICB9LFxuICAgICAgXCLmlL/lupzkuI7lhazlhbHkuovkuJpcIjoge1xuICAgICAgICBcIuWtpuacr+enkeeglFwiOiBcIjE4XCIsXG4gICAgICAgIFwi5Lqk6K2mXCI6IFwiMTlcIixcbiAgICAgICAgXCLljZrnianppoZcIjogXCIyMFwiLFxuICAgICAgICBcIuWFrOWFseS6i+S4mnzpnZ7nm4jliKnmnLrmnoRcIjogXCIyMVwiXG4gICAgICB9LFxuICAgICAgXCLljLvoja/miqTnkIZcIjoge1xuICAgICAgICBcIuWMu+iNr+WMu+eWl1wiOiBcIjIyXCIsXG4gICAgICAgIFwi5oqk55CG576O5a65XCI6IFwiMjNcIixcbiAgICAgICAgXCLkv53lgaXkuI7ljavnlJ9cIjogXCIyNFwiXG4gICAgICB9LFxuICAgICAgXCLkuqTpgJrlt6XlhbdcIjoge1xuICAgICAgICBcIuaxvei9puebuOWFs1wiOiBcIjI1XCIsXG4gICAgICAgIFwi5pGp5omY6L2m55u45YWzXCI6IFwiMjZcIixcbiAgICAgICAgXCLngavovabnm7jlhbNcIjogXCIyN1wiLFxuICAgICAgICBcIumjnuacuuebuOWFs1wiOiBcIjI4XCJcbiAgICAgIH0sXG4gICAgICBcIuaIv+WcsOS6p1wiOiB7XG4gICAgICAgIFwi5bu6562RXCI6IFwiMjlcIixcbiAgICAgICAgXCLniankuJpcIjogXCIzMFwiXG4gICAgICB9LFxuICAgICAgXCLmtojotLnlk4FcIjoge1xuICAgICAgICBcIua2iOi0ueWTgVwiOiBcIjMxXCJcbiAgICAgIH0sXG4gICAgICBcIuWVhuS4muacjeWKoVwiOiB7XG4gICAgICAgIFwi5rOV5b6LXCI6IFwiMzJcIixcbiAgICAgICAgXCLkvJrlsZVcIjogXCIzM1wiLFxuICAgICAgICBcIuS4reS7i+acjeWKoVwiOiBcIjM0XCIsXG4gICAgICAgIFwi6K6k6K+BXCI6IFwiMzVcIixcbiAgICAgICAgXCLlrqHorqFcIjogXCIzNlwiXG4gICAgICB9LFxuICAgICAgXCLmlofkvZPlqLHkuZBcIjoge1xuICAgICAgICBcIuS8oOWqklwiOiBcIjM3XCIsXG4gICAgICAgIFwi5L2T6IKyXCI6IFwiMzhcIixcbiAgICAgICAgXCLlqLHkuZDkvJHpl7JcIjogXCIzOVwiXG4gICAgICB9LFxuICAgICAgXCLljbDliLdcIjoge1xuICAgICAgICBcIuWNsOWIt1wiOiBcIjQwXCJcbiAgICAgIH0sXG4gICAgICBcIuWFtuWug1wiOiB7XG4gICAgICAgIFwi5YW25a6DXCI6IFwiNDFcIlxuICAgICAgfVxuICAgIH07XG5cbiAgICBhY3RpdmV0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZldGUoKSB7XG4gICAgICB2bS53eGdoID0gTWVyY2hhbnQucHJvdG90eXBlJF9fZ2V0X193eGdoKHtpZDogJHNjb3BlLnVzZXIubWVyY2hhbnRJZCwgcmVmcmVzaDogdHJ1ZX0pO1xuICAgIH1cblxuICAgIHZtLnVwZGF0ZSA9IGZ1bmN0aW9uIChpc1Nob3ApIHtcbiAgICAgIHZhciBtb2RlbCA9IE1lcmNoYW50O1xuICAgICAgdmFyIGRhdGEgPSAkc2NvcGUudXNlci5tZXJjaGFudDtcbiAgICAgIGlmKGlzU2hvcCkge1xuICAgICAgICBkYXRhID0gJHNjb3BlLnVzZXIuc2hvcDtcbiAgICAgICAgbW9kZWwgPSBTaG9wO1xuICAgICAgfVxuICAgICAgbW9kZWwudXBkYXRlKHt3aGVyZToge2lkOiBkYXRhLmlkfX0sIGRhdGEsIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzdWx0LCByZXMpIHtcbiAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAn5oiQ5YqfJywgXCLorr7nva7lt7Lnu4/kv53lrZhcIik7XG4gICAgICB9LCBmdW5jdGlvbiBlcnJvcihyZXMpIHtcbiAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgJ+Wksei0pScsIFwi6K6+572u5pyq5oiQ5Yqf77yM6K+36YeN6K+V77yBXCIpXG4gICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgdm0uYWRkTWVtYmVyTGV2ZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbGV2ZWxzID0gJHNjb3BlLnVzZXIubWVyY2hhbnQubWVtYmVyTGV2ZWxzIHx8IFtdO1xuICAgICAgdmFyIGxhc3QgPSBsZXZlbHMubGVuZ3RoID4gMCAmJiBsZXZlbHNbbGV2ZWxzLmxlbmd0aC0xXSB8fCB7dXBwZXI6IC0xfTtcbiAgICAgIGxldmVscy5wdXNoKHtsb3dlcjogbGFzdC51cHBlcisxLCB1cHBlcjogbGFzdC51cHBlcisxMDAwLCBkaXNjb3VudDoxMDAsIG5hbWU6ICdWSVAnfSk7XG4gICAgICBpZighJHNjb3BlLnVzZXIubWVyY2hhbnQubWVtYmVyTGV2ZWxzKSAkc2NvcGUudXNlci5tZXJjaGFudC5tZW1iZXJMZXZlbHMgPSBsZXZlbHM7XG4gICAgfVxuICAgIFxuICAgIHZtLnVwZGFldGVNZW1iZXJMZXZlbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUudXNlci5tZXJjaGFudC5tZW1iZXJMZXZlbHMuZm9yRWFjaChmdW5jdGlvbiAobGV2ZWwpIHtcbiAgICAgICAgTWVtYmVyLnVwZGF0ZSh7XG4gICAgICAgICAgd2hlcmU6IHttZXJjaGFudElkOiRzY29wZS51c2VyLm1lcmNoYW50LmlkLCB0b3RhbEJvbnVzOiB7Z3RlOiBsZXZlbC5sb3dlciwgbHRlOiBsZXZlbC51cHBlcn19XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBkaXNjb3VudDogbGV2ZWwuZGlzY291bnQsIGxldmVsOiBsZXZlbC5uYW1lXG4gICAgICAgIH0sIGZ1bmN0aW9uIHN1Y2VzcyhyZXN1bHQsIHJlcykge1xuICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ+aIkOWKnycsIFwi5pu05paw5YWo5L2T5Lya5ZGY562J57qn5a6M5oiQXCIpO1xuICAgICAgICB9LCBmdW5jdGlvbiBlcnJvcihyZXMpIHtcbiAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCAn5aSx6LSlJywgXCLmm7TmlrDlhajkvZPkvJrlkZjnrYnnuqfmnKrmiJDlip/vvIzor7fph43or5XvvIFcIilcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgICAgICAgICBcbiAgICB2bS51cGRhdGVXeGdoID0gZnVuY3Rpb24gKCkge1xuICAgICAgdm0udXBkYXRlKCk7XG4gICAgICBNZXJjaGFudC51cGRhdGVXeGdoKHtcbiAgICAgICAgaWQ6IHZtLnd4Z2guaWQsXG4gICAgICAgIGFwcGlkOiB2bS53eGdoLmFwcGlkLFxuICAgICAgICBhcHBzZWNyZXQ6IHZtLnd4Z2guYXBwc2VjcmV0LFxuICAgICAgICBpbmR1c3RyeTogJHNjb3BlLnVzZXIubWVyY2hhbnQuaW5kdXN0cnlcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAn5oiQ5YqfJywgXCLlvq7kv6HlhazkvJflj7forr7nva7lt7Lnu4/kv53lrZhcIik7XG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsICflpLHotKUnLCBcIuiuvue9ruacquaIkOWKn++8jOivt+mHjeivle+8gVwiKVxuICAgICAgfSk7XG4gICAgfSBcbiAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5zZXR0aW5ncycpXHJcbiAgICAgICAgLnJ1bihzZXR0aW5nc1J1bik7XHJcblxyXG4gICAgc2V0dGluZ3NSdW4uJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckbG9jYWxTdG9yYWdlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0dGluZ3NSdW4oJHJvb3RTY29wZSwgJGxvY2FsU3RvcmFnZSl7XHJcblxyXG4gICAgICAvLyBHbG9iYWwgU2V0dGluZ3NcclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICAgICRyb290U2NvcGUuYXBwID0ge1xyXG4gICAgICAgIG5hbWU6ICfms5vljaHmsYdXZWJQT1MnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn5Zyo57q/5pS26ZO257O757ufJyxcclxuICAgICAgICB5ZWFyOiAoKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkpLFxyXG4gICAgICAgIGxheW91dDoge1xyXG4gICAgICAgICAgaXNGaXhlZDogdHJ1ZSxcclxuICAgICAgICAgIGlzQ29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgICAgIGlzQm94ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgaXNSVEw6IGZhbHNlLFxyXG4gICAgICAgICAgaG9yaXpvbnRhbDogZmFsc2UsXHJcbiAgICAgICAgICBpc0Zsb2F0OiBmYWxzZSxcclxuICAgICAgICAgIGFzaWRlSG92ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgdGhlbWU6IFwiYXBwL2Nzcy90aGVtZS1lLmNzc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB1c2VGdWxsTGF5b3V0OiBmYWxzZSxcclxuICAgICAgICBoaWRkZW5Gb290ZXI6IGZhbHNlLFxyXG4gICAgICAgIG9mZnNpZGViYXJPcGVuOiBmYWxzZSxcclxuICAgICAgICBhc2lkZVRvZ2dsZWQ6IGZhbHNlLFxyXG4gICAgICAgIHZpZXdBbmltYXRpb246ICduZy1mYWRlSW5VcCdcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIFNldHVwIHRoZSBsYXlvdXQgbW9kZVxyXG4gICAgICAkcm9vdFNjb3BlLmFwcC5sYXlvdXQuaG9yaXpvbnRhbCA9ICggJHJvb3RTY29wZS4kc3RhdGVQYXJhbXMubGF5b3V0ID09PSAnYXBwLWgnKSA7XHJcblxyXG4gICAgICAvLyBSZXN0b3JlIGxheW91dCBzZXR0aW5nc1xyXG4gICAgICBpZiggYW5ndWxhci5pc0RlZmluZWQoJGxvY2FsU3RvcmFnZS5sYXlvdXQpIClcclxuICAgICAgICAkcm9vdFNjb3BlLmFwcC5sYXlvdXQgPSAkbG9jYWxTdG9yYWdlLmxheW91dDtcclxuICAgICAgZWxzZVxyXG4gICAgICAgICRsb2NhbFN0b3JhZ2UubGF5b3V0ID0gJHJvb3RTY29wZS5hcHAubGF5b3V0O1xyXG5cclxuICAgICAgJHJvb3RTY29wZS4kd2F0Y2goJ2FwcC5sYXlvdXQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJGxvY2FsU3RvcmFnZS5sYXlvdXQgPSAkcm9vdFNjb3BlLmFwcC5sYXlvdXQ7XHJcbiAgICAgIH0sIHRydWUpO1xyXG5cclxuICAgICAgLy8gQ2xvc2Ugc3VibWVudSB3aGVuIHNpZGViYXIgY2hhbmdlIGZyb20gY29sbGFwc2VkIHRvIG5vcm1hbFxyXG4gICAgICAkcm9vdFNjb3BlLiR3YXRjaCgnYXBwLmxheW91dC5pc0NvbGxhcHNlZCcsIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgaWYoIG5ld1ZhbHVlID09PSBmYWxzZSApXHJcbiAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2Nsb3NlU2lkZWJhck1lbnUnKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogc2lkZWJhci1tZW51LmpzXHJcbiAqIEhhbmRsZSBzaWRlYmFyIGNvbGxhcHNpYmxlIGVsZW1lbnRzXHJcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuc2lkZWJhcicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NpZGViYXJDb250cm9sbGVyJywgU2lkZWJhckNvbnRyb2xsZXIpO1xyXG5cclxuICAgIFNpZGViYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHNjb3BlJywgJyRzdGF0ZScsICdTaWRlYmFyTG9hZGVyJywgJ1V0aWxzJ107XHJcbiAgICBmdW5jdGlvbiBTaWRlYmFyQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc2NvcGUsICRzdGF0ZSwgU2lkZWJhckxvYWRlciwgIFV0aWxzKSB7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICB2YXIgY29sbGFwc2VMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgLy8gZGVtbzogd2hlbiBzd2l0Y2ggZnJvbSBjb2xsYXBzZSB0byBob3ZlciwgY2xvc2UgYWxsIGl0ZW1zXHJcbiAgICAgICAgICAkcm9vdFNjb3BlLiR3YXRjaCgnYXBwLmxheW91dC5hc2lkZUhvdmVyJywgZnVuY3Rpb24ob2xkVmFsLCBuZXdWYWwpe1xyXG4gICAgICAgICAgICBpZiAoIG5ld1ZhbCA9PT0gZmFsc2UgJiYgb2xkVmFsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgY2xvc2VBbGxCdXQoLTEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgLy8gTG9hZCBtZW51IGZyb20ganNvbiBmaWxlXHJcbiAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuXHJcbiAgICAgICAgICBTaWRlYmFyTG9hZGVyLmdldE1lbnUoc2lkZWJhclJlYWR5KTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgZnVuY3Rpb24gc2lkZWJhclJlYWR5KGl0ZW1zKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5tZW51SXRlbXMgPSBpdGVtcztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBIYW5kbGUgc2lkZWJhciBhbmQgY29sbGFwc2UgaXRlbXNcclxuICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgJHNjb3BlLmdldE1lbnVJdGVtUHJvcENsYXNzZXMgPSBmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoaXRlbS5oZWFkaW5nID8gJ25hdi1oZWFkaW5nJyA6ICcnKSArXHJcbiAgICAgICAgICAgICAgICAgICAoaXNBY3RpdmUoaXRlbSkgPyAnIGFjdGl2ZScgOiAnJykgO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAkc2NvcGUuYWRkQ29sbGFwc2UgPSBmdW5jdGlvbigkaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgICAgY29sbGFwc2VMaXN0WyRpbmRleF0gPSAkcm9vdFNjb3BlLmFwcC5sYXlvdXQuYXNpZGVIb3ZlciA/IHRydWUgOiAhaXNBY3RpdmUoaXRlbSk7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICRzY29wZS5pc0NvbGxhcHNlID0gZnVuY3Rpb24oJGluZGV4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoY29sbGFwc2VMaXN0WyRpbmRleF0pO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAkc2NvcGUudG9nZ2xlQ29sbGFwc2UgPSBmdW5jdGlvbigkaW5kZXgsIGlzUGFyZW50SXRlbSkge1xyXG5cclxuICAgICAgICAgICAgLy8gY29sbGFwc2VkIHNpZGViYXIgZG9lc24ndCB0b2dnbGUgZHJvZG9wd25cclxuICAgICAgICAgICAgaWYoIFV0aWxzLmlzU2lkZWJhckNvbGxhcHNlZCgpIHx8ICRyb290U2NvcGUuYXBwLmxheW91dC5hc2lkZUhvdmVyICkgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIGl0ZW0gaW5kZXggZXhpc3RzXHJcbiAgICAgICAgICAgIGlmKCBhbmd1bGFyLmlzRGVmaW5lZCggY29sbGFwc2VMaXN0WyRpbmRleF0gKSApIHtcclxuICAgICAgICAgICAgICBpZiAoICEgJHNjb3BlLmxhc3RFdmVudEZyb21DaGlsZCApIHtcclxuICAgICAgICAgICAgICAgIGNvbGxhcHNlTGlzdFskaW5kZXhdID0gIWNvbGxhcHNlTGlzdFskaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgY2xvc2VBbGxCdXQoJGluZGV4KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoIGlzUGFyZW50SXRlbSApIHtcclxuICAgICAgICAgICAgICBjbG9zZUFsbEJ1dCgtMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICRzY29wZS5sYXN0RXZlbnRGcm9tQ2hpbGQgPSBpc0NoaWxkKCRpbmRleCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAvLyBDb250cm9sbGVyIGhlbHBlcnNcclxuICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaXRlbSBhbmQgY2hpbGRyZW4gYWN0aXZlIHN0YXRlXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzQWN0aXZlKGl0ZW0pIHtcclxuXHJcbiAgICAgICAgICAgICAgaWYoIWl0ZW0pIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgaWYoICFpdGVtLnNyZWYgfHwgaXRlbS5zcmVmID09PSAnIycpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmb3VuZEFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGl0ZW0uc3VibWVudSwgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgaWYoaXNBY3RpdmUodmFsdWUpKSBmb3VuZEFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmb3VuZEFjdGl2ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRzdGF0ZS5pcyhpdGVtLnNyZWYpIHx8ICRzdGF0ZS5pbmNsdWRlcyhpdGVtLnNyZWYpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjbG9zZUFsbEJ1dChpbmRleCkge1xyXG4gICAgICAgICAgICAgIGluZGV4ICs9ICcnO1xyXG4gICAgICAgICAgICAgIGZvcih2YXIgaSBpbiBjb2xsYXBzZUxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmKGluZGV4IDwgMCB8fCBpbmRleC5pbmRleE9mKGkpIDwgMClcclxuICAgICAgICAgICAgICAgICAgY29sbGFwc2VMaXN0W2ldID0gdHJ1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzQ2hpbGQoJGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgLypqc2hpbnQgLVcwMTgqL1xyXG4gICAgICAgICAgICAgIHJldHVybiAodHlwZW9mICRpbmRleCA9PT0gJ3N0cmluZycpICYmICEoJGluZGV4LmluZGV4T2YoJy0nKSA8IDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgfSAvLyBhY3RpdmF0ZVxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogc2lkZWJhci5qc1xyXG4gKiBXcmFwcyB0aGUgc2lkZWJhciBhbmQgaGFuZGxlcyBjb2xsYXBzZWQgc3RhdGVcclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5zaWRlYmFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdzaWRlYmFyJywgc2lkZWJhcik7XHJcblxyXG4gICAgc2lkZWJhci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgJyR3aW5kb3cnLCAnVXRpbHMnXTtcclxuICAgIGZ1bmN0aW9uIHNpZGViYXIgKCRyb290U2NvcGUsICR0aW1lb3V0LCAkd2luZG93LCBVdGlscykge1xyXG4gICAgICAgIHZhciAkd2luID0gYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpO1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIC8vIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXHJcbiAgICAgICAgICAgIC8vIGNvbnRyb2xsZXI6IENvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIC8vIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPG5hdiBjbGFzcz1cInNpZGViYXJcIiBuZy10cmFuc2NsdWRlPjwvbmF2PicsXHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWVcclxuICAgICAgICAgICAgLy8gc2NvcGU6IHt9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG5cclxuICAgICAgICAgIHZhciBjdXJyZW50U3RhdGUgPSAkcm9vdFNjb3BlLiRzdGF0ZS5jdXJyZW50Lm5hbWU7XHJcbiAgICAgICAgICB2YXIgJHNpZGViYXIgPSBlbGVtZW50O1xyXG5cclxuICAgICAgICAgIHZhciBldmVudE5hbWUgPSBVdGlscy5pc1RvdWNoKCkgPyAnY2xpY2snIDogJ21vdXNlZW50ZXInIDtcclxuICAgICAgICAgIHZhciBzdWJOYXYgPSAkKCk7XHJcblxyXG4gICAgICAgICAgJHNpZGViYXIub24oIGV2ZW50TmFtZSwgJy5uYXYgPiBsaScsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaWYoIFV0aWxzLmlzU2lkZWJhckNvbGxhcHNlZCgpIHx8ICRyb290U2NvcGUuYXBwLmxheW91dC5hc2lkZUhvdmVyICkge1xyXG5cclxuICAgICAgICAgICAgICBzdWJOYXYudHJpZ2dlcignbW91c2VsZWF2ZScpO1xyXG4gICAgICAgICAgICAgIHN1Yk5hdiA9IHRvZ2dsZU1lbnVJdGVtKCAkKHRoaXMpLCAkc2lkZWJhcik7XHJcblxyXG4gICAgICAgICAgICAgIC8vIFVzZWQgdG8gZGV0ZWN0IGNsaWNrIGFuZCB0b3VjaCBldmVudHMgb3V0c2lkZSB0aGUgc2lkZWJhciAgICAgICAgICBcclxuICAgICAgICAgICAgICBzaWRlYmFyQWRkQmFja2Ryb3AoKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBzY29wZS4kb24oJ2Nsb3NlU2lkZWJhck1lbnUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmVtb3ZlRmxvYXRpbmdOYXYoKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIC8vIE5vcm1hbGl6ZSBzdGF0ZSB3aGVuIHJlc2l6ZSB0byBtb2JpbGVcclxuICAgICAgICAgICR3aW4ub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiggISBVdGlscy5pc01vYmlsZSgpIClcclxuICAgICAgICAgIFx0YXNpZGVUb2dnbGVPZmYoKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIC8vIEFkanVzdG1lbnQgb24gcm91dGUgY2hhbmdlc1xyXG4gICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpIHtcclxuICAgICAgICAgICAgY3VycmVudFN0YXRlID0gdG9TdGF0ZS5uYW1lO1xyXG4gICAgICAgICAgICAvLyBIaWRlIHNpZGViYXIgYXV0b21hdGljYWxseSBvbiBtb2JpbGVcclxuICAgICAgICAgICAgYXNpZGVUb2dnbGVPZmYoKTtcclxuXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnY2xvc2VTaWRlYmFyTWVudScpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICBcdCAgLy8gQXV0b2Nsb3NlIHdoZW4gY2xpY2sgb3V0c2lkZSB0aGUgc2lkZWJhclxyXG4gICAgICAgICAgaWYgKCBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5zaWRlYmFyQW55Y2xpY2tDbG9zZSkgKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgd3JhcHBlciA9ICQoJy53cmFwcGVyJyk7XHJcbiAgICAgICAgICAgIHZhciBzYmNsaWNrRXZlbnQgPSAnY2xpY2suc2lkZWJhcic7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiR3YXRjaCgnYXBwLmFzaWRlVG9nZ2xlZCcsIHdhdGNoRXh0ZXJuYWxDbGlja3MpO1xyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLy8vLy9cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiB3YXRjaEV4dGVybmFsQ2xpY2tzKG5ld1ZhbCkge1xyXG4gICAgICAgICAgICAvLyBpZiBzaWRlYmFyIGJlY29tZXMgdmlzaWJsZVxyXG4gICAgICAgICAgICBpZiAoIG5ld1ZhbCA9PT0gdHJ1ZSApIHtcclxuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpeyAvLyByZW5kZXIgYWZ0ZXIgY3VycmVudCBkaWdlc3QgY3ljbGVcclxuICAgICAgICAgICAgICAgIHdyYXBwZXIub24oc2JjbGlja0V2ZW50LCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgICAgLy8gaWYgbm90IGNoaWxkIG9mIHNpZGViYXJcclxuICAgICAgICAgICAgICAgICAgaWYoICEgJChlLnRhcmdldCkucGFyZW50cygnLmFzaWRlJykubGVuZ3RoICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzaWRlVG9nZ2xlT2ZmKCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vIGRldHRhY2ggZXZlbnRcclxuICAgICAgICAgICAgICB3cmFwcGVyLm9mZihzYmNsaWNrRXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gYXNpZGVUb2dnbGVPZmYoKSB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuYXBwLmFzaWRlVG9nZ2xlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZighc2NvcGUuJCRwaGFzZSkgc2NvcGUuJGFwcGx5KCk7IC8vIGFudGktcGF0dGVybiBidXQgc29tZXRpbWVzIG5lY2Vzc2FyeVxyXG4gICAgICBcdCAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNpZGViYXJBZGRCYWNrZHJvcCgpIHtcclxuICAgICAgICAgIHZhciAkYmFja2Ryb3AgPSAkKCc8ZGl2Lz4nLCB7ICdjbGFzcyc6ICdkcm9wZG93bi1iYWNrZHJvcCd9ICk7XHJcbiAgICAgICAgICAkYmFja2Ryb3AuaW5zZXJ0QWZ0ZXIoJy5hc2lkZS1pbm5lcicpLm9uKCdjbGljayBtb3VzZWVudGVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZW1vdmVGbG9hdGluZ05hdigpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBPcGVuIHRoZSBjb2xsYXBzZSBzaWRlYmFyIHN1Ym1lbnUgaXRlbXMgd2hlbiBvbiB0b3VjaCBkZXZpY2VzIFxyXG4gICAgICAgIC8vIC0gZGVza3RvcCBvbmx5IG9wZW5zIG9uIGhvdmVyXHJcbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlVG91Y2hJdGVtKCRlbGVtZW50KXtcclxuICAgICAgICAgICRlbGVtZW50XHJcbiAgICAgICAgICAgIC5zaWJsaW5ncygnbGknKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ29wZW4nKVxyXG4gICAgICAgICAgICAuZW5kKClcclxuICAgICAgICAgICAgLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBIYW5kbGVzIGhvdmVyIHRvIG9wZW4gaXRlbXMgdW5kZXIgY29sbGFwc2VkIG1lbnVcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVNZW51SXRlbSgkbGlzdEl0ZW0sICRzaWRlYmFyKSB7XHJcblxyXG4gICAgICAgICAgcmVtb3ZlRmxvYXRpbmdOYXYoKTtcclxuXHJcbiAgICAgICAgICB2YXIgdWwgPSAkbGlzdEl0ZW0uY2hpbGRyZW4oJ3VsJyk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmKCAhdWwubGVuZ3RoICkgcmV0dXJuICQoKTtcclxuICAgICAgICAgIGlmKCAkbGlzdEl0ZW0uaGFzQ2xhc3MoJ29wZW4nKSApIHtcclxuICAgICAgICAgICAgdG9nZ2xlVG91Y2hJdGVtKCRsaXN0SXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybiAkKCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdmFyICRhc2lkZSA9ICQoJy5hc2lkZScpO1xyXG4gICAgICAgICAgdmFyICRhc2lkZUlubmVyID0gJCgnLmFzaWRlLWlubmVyJyk7IC8vIGZvciB0b3Agb2Zmc2V0IGNhbGN1bGF0aW9uXHJcbiAgICAgICAgICAvLyBmbG9hdCBhc2lkZSB1c2VzIGV4dHJhIHBhZGRpbmcgb24gYXNpZGVcclxuICAgICAgICAgIHZhciBtYXIgPSBwYXJzZUludCggJGFzaWRlSW5uZXIuY3NzKCdwYWRkaW5nLXRvcCcpLCAwKSArIHBhcnNlSW50KCAkYXNpZGUuY3NzKCdwYWRkaW5nLXRvcCcpLCAwKTtcclxuICAgICAgICAgIHZhciBzdWJOYXYgPSB1bC5jbG9uZSgpLmFwcGVuZFRvKCAkYXNpZGUgKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgdG9nZ2xlVG91Y2hJdGVtKCRsaXN0SXRlbSk7XHJcblxyXG4gICAgICAgICAgdmFyIGl0ZW1Ub3AgPSAoJGxpc3RJdGVtLnBvc2l0aW9uKCkudG9wICsgbWFyKSAtICRzaWRlYmFyLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgdmFyIHZ3SGVpZ2h0ID0gJHdpbi5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICBzdWJOYXZcclxuICAgICAgICAgICAgLmFkZENsYXNzKCduYXYtZmxvYXRpbmcnKVxyXG4gICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICBwb3NpdGlvbjogJHJvb3RTY29wZS5hcHAubGF5b3V0LmlzRml4ZWQgPyAnZml4ZWQnIDogJ2Fic29sdXRlJyxcclxuICAgICAgICAgICAgICB0b3A6ICAgICAgaXRlbVRvcCxcclxuICAgICAgICAgICAgICBib3R0b206ICAgKHN1Yk5hdi5vdXRlckhlaWdodCh0cnVlKSArIGl0ZW1Ub3AgPiB2d0hlaWdodCkgPyAwIDogJ2F1dG8nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHN1Yk5hdi5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0b2dnbGVUb3VjaEl0ZW0oJGxpc3RJdGVtKTtcclxuICAgICAgICAgICAgc3ViTmF2LnJlbW92ZSgpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHN1Yk5hdjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUZsb2F0aW5nTmF2KCkge1xyXG4gICAgICAgICAgJCgnLmRyb3Bkb3duLWJhY2tkcm9wJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAkKCcuc2lkZWJhci1zdWJuYXYubmF2LWZsb2F0aW5nJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAkKCcuc2lkZWJhciBsaS5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufSkoKTtcclxuXHJcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnNpZGViYXInKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdTaWRlYmFyTG9hZGVyJywgU2lkZWJhckxvYWRlcik7XHJcblxyXG4gICAgU2lkZWJhckxvYWRlci4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG4gICAgZnVuY3Rpb24gU2lkZWJhckxvYWRlcigkaHR0cCkge1xyXG4gICAgICAgIHRoaXMuZ2V0TWVudSA9IGdldE1lbnU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TWVudShvblJlYWR5LCBvbkVycm9yKSB7XHJcbiAgICAgICAgICB2YXIgbWVudUpzb24gPSAnc2VydmVyL3NpZGViYXItbWVudS5qc29uJyxcclxuICAgICAgICAgICAgICBtZW51VVJMICA9IG1lbnVKc29uICsgJz92PScgKyAobmV3IERhdGUoKS5nZXRUaW1lKCkpOyAvLyBqdW1wcyBjYWNoZVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgIG9uRXJyb3IgPSBvbkVycm9yIHx8IGZ1bmN0aW9uKCkgeyBhbGVydCgnRmFpbHVyZSBsb2FkaW5nIG1lbnUnKTsgfTtcclxuXHJcbiAgICAgICAgICAkaHR0cFxyXG4gICAgICAgICAgICAuZ2V0KG1lbnVVUkwpXHJcbiAgICAgICAgICAgIC5zdWNjZXNzKG9uUmVhZHkpXHJcbiAgICAgICAgICAgIC5lcnJvcihvbkVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnNpZGViYXInKVxuICAgICAgICAuY29udHJvbGxlcignVXNlckJsb2NrQ29udHJvbGxlcicsIFVzZXJCbG9ja0NvbnRyb2xsZXIpO1xuXG4gICAgVXNlckJsb2NrQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJ107XG4gICAgZnVuY3Rpb24gVXNlckJsb2NrQ29udHJvbGxlcigkcm9vdFNjb3BlKSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS51c2VyID0gJHJvb3RTY29wZS51c2VyIHx8IHtcbiAgICAgICAgICAgIG5hbWU6ICAgICAn5p2O5piOJyxcbiAgICAgICAgICAgIGpvYjogICAgICAn6ICB5p2/JyxcbiAgICAgICAgICAgIHBpY3R1cmU6ICAnYXBwL2ltZy9kdW1teS5wbmcnXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIEhpZGVzL3Nob3cgdXNlciBhdmF0YXIgb24gc2lkZWJhclxuICAgICAgICAgICRyb290U2NvcGUudG9nZ2xlVXNlckJsb2NrID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndG9nZ2xlVXNlckJsb2NrJyk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgICRyb290U2NvcGUudXNlckJsb2NrVmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgXG4gICAgICAgICAgJHJvb3RTY29wZS4kb24oJ3RvZ2dsZVVzZXJCbG9jaycsIGZ1bmN0aW9uKC8qZXZlbnQsIGFyZ3MqLykge1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLnVzZXJCbG9ja1Zpc2libGUgPSAhICRyb290U2NvcGUudXNlckJsb2NrVmlzaWJsZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnRhYmxlcycpXHJcbiAgICAgICAgLnNlcnZpY2UoJ25nVGFibGVEYXRhU2VydmljZScsIG5nVGFibGVEYXRhU2VydmljZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gbmdUYWJsZURhdGFTZXJ2aWNlKCkge1xyXG4gICAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmNhY2hlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmdldERhdGEgPSBnZXREYXRhO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldERhdGEoJGRlZmVyLCBwYXJhbXMsIGFwaSkge1xyXG4gICAgICAgICAgLy8gaWYgbm8gY2FjaGUsIHJlcXVlc3QgZGF0YSBhbmQgZmlsdGVyXHJcbiAgICAgICAgICBpZiAoICEgc2VsZi5jYWNoZSApIHtcclxuICAgICAgICAgICAgaWYgKCBhcGkgKSB7XHJcbiAgICAgICAgICAgICAgYXBpLmdldChmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHNlbGYuY2FjaGUgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyZGF0YSgkZGVmZXIsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmaWx0ZXJkYXRhKCRkZWZlciwgcGFyYW1zKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgZnVuY3Rpb24gZmlsdGVyZGF0YSgkZGVmZXIsIHBhcmFtcykge1xyXG4gICAgICAgICAgICB2YXIgZnJvbSA9IChwYXJhbXMucGFnZSgpIC0gMSkgKiBwYXJhbXMuY291bnQoKTtcclxuICAgICAgICAgICAgdmFyIHRvID0gcGFyYW1zLnBhZ2UoKSAqIHBhcmFtcy5jb3VudCgpO1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVyZWREYXRhID0gc2VsZi5jYWNoZS5yZXN1bHQuc2xpY2UoZnJvbSwgdG8pO1xyXG5cclxuICAgICAgICAgICAgcGFyYW1zLnRvdGFsKHNlbGYuY2FjaGUudG90YWwpO1xyXG4gICAgICAgICAgICAkZGVmZXIucmVzb2x2ZShmaWx0ZXJlZERhdGEpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnRhYmxlcycpXHJcbiAgICAgICAgLnNlcnZpY2UoJ25nVGFibGVMQlNlcnZpY2UnLCBuZ1RhYmxlTEJTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBuZ1RhYmxlTEJTZXJ2aWNlKCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICB0aGlzLmdldERhdGEgPSBnZXREYXRhO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0RGF0YSgkZGVmZXIsIHBhcmFtcywgTW9kZWwsIGZpbHRlcikge1xyXG4gICAgICAgIGZpbHRlci5saW1pdCA9IHBhcmFtcy5jb3VudCgpO1xyXG4gICAgICAgIGZpbHRlci5za2lwID0gKHBhcmFtcy5wYWdlKCktMSkqZmlsdGVyLmxpbWl0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIE1vZGVsLmNvdW50KHt3aGVyZTogZmlsdGVyLndoZXJlfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgcGFyYW1zLnRvdGFsKHJlc3VsdC5jb3VudCk7XHJcbiAgICAgICAgICBNb2RlbC5maW5kKHtmaWx0ZXI6ZmlsdGVyfSwgJGRlZmVyLnJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnRyYW5zbGF0ZScpXHJcbiAgICAgICAgLmNvbmZpZyh0cmFuc2xhdGVDb25maWcpXHJcbiAgICAgICAgO1xyXG4gICAgdHJhbnNsYXRlQ29uZmlnLiRpbmplY3QgPSBbJyR0cmFuc2xhdGVQcm92aWRlciddO1xyXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlQ29uZmlnKCR0cmFuc2xhdGVQcm92aWRlcil7XHJcblxyXG4gICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudXNlU3RhdGljRmlsZXNMb2FkZXIoe1xyXG4gICAgICAgICAgcHJlZml4IDogJ2FwcC9pMThuLycsXHJcbiAgICAgICAgICBzdWZmaXggOiAnLmpzb24nXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnByZWZlcnJlZExhbmd1YWdlKCd6aF9DTicpO1xyXG4gICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudXNlTG9jYWxTdG9yYWdlKCk7XHJcbiAgICAgICR0cmFuc2xhdGVQcm92aWRlci51c2VQb3N0Q29tcGlsaW5nKHRydWUpO1xyXG4gICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudXNlU2FuaXRpemVWYWx1ZVN0cmF0ZWd5KCdzYW5pdGl6ZVBhcmFtZXRlcnMnKTtcclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudHJhbnNsYXRlJylcclxuICAgICAgICAucnVuKHRyYW5zbGF0ZVJ1bilcclxuICAgICAgICA7XHJcbiAgICB0cmFuc2xhdGVSdW4uJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckdHJhbnNsYXRlJ107XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZVJ1bigkcm9vdFNjb3BlLCAkdHJhbnNsYXRlKXtcclxuXHJcbiAgICAgIC8vIEludGVybmF0aW9uYWxpemF0aW9uXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICRyb290U2NvcGUubGFuZ3VhZ2UgPSB7XHJcbiAgICAgICAgLy8gSGFuZGxlcyBsYW5ndWFnZSBkcm9wZG93blxyXG4gICAgICAgIGxpc3RJc09wZW46IGZhbHNlLFxyXG4gICAgICAgIC8vIGxpc3Qgb2YgYXZhaWxhYmxlIGxhbmd1YWdlc1xyXG4gICAgICAgIGF2YWlsYWJsZToge1xyXG4gICAgICAgICAgJ3poX0NOJzogICAgJ+S4reaWh+eugOS9kycsXHJcbiAgICAgICAgICAnZW4nOiAgICAgICAnRW5nbGlzaCcsXHJcbiAgICAgICAgICAnZXNfQVInOiAgICAnRXNwYcOxb2wnXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBkaXNwbGF5IGFsd2F5cyB0aGUgY3VycmVudCB1aSBsYW5ndWFnZVxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBwcm9wb3NlZExhbmd1YWdlID0gJHRyYW5zbGF0ZS5wcm9wb3NlZExhbmd1YWdlKCkgfHwgJHRyYW5zbGF0ZS51c2UoKTtcclxuICAgICAgICAgIHZhciBwcmVmZXJyZWRMYW5ndWFnZSA9ICR0cmFuc2xhdGUucHJlZmVycmVkTGFuZ3VhZ2UoKTsgLy8gd2Uga25vdyB3ZSBoYXZlIHNldCBhIHByZWZlcnJlZCBvbmUgaW4gYXBwLmNvbmZpZ1xyXG4gICAgICAgICAgJHJvb3RTY29wZS5sYW5ndWFnZS5zZWxlY3RlZCA9ICRyb290U2NvcGUubGFuZ3VhZ2UuYXZhaWxhYmxlWyAocHJvcG9zZWRMYW5ndWFnZSB8fCBwcmVmZXJyZWRMYW5ndWFnZSkgXTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGxvY2FsZUlkKSB7XHJcbiAgICAgICAgICAvLyBTZXQgdGhlIG5ldyBpZGlvbVxyXG4gICAgICAgICAgJHRyYW5zbGF0ZS51c2UobG9jYWxlSWQpO1xyXG4gICAgICAgICAgLy8gc2F2ZSBhIHJlZmVyZW5jZSBmb3IgdGhlIGN1cnJlbnQgbGFuZ3VhZ2VcclxuICAgICAgICAgICRyb290U2NvcGUubGFuZ3VhZ2Uuc2VsZWN0ZWQgPSAkcm9vdFNjb3BlLmxhbmd1YWdlLmF2YWlsYWJsZVtsb2NhbGVJZF07XHJcbiAgICAgICAgICAvLyBmaW5hbGx5IHRvZ2dsZSBkcm9wZG93blxyXG4gICAgICAgICAgJHJvb3RTY29wZS5sYW5ndWFnZS5saXN0SXNPcGVuID0gISAkcm9vdFNjb3BlLmxhbmd1YWdlLmxpc3RJc09wZW47XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHJvb3RTY29wZS5sYW5ndWFnZS5pbml0KCk7XHJcblxyXG4gICAgfVxyXG59KSgpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBhbmltYXRlLWVuYWJsZWQuanNcbiAqIEVuYWJsZSBvciBkaXNhYmxlcyBuZ0FuaW1hdGUgZm9yIGVsZW1lbnQgd2l0aCBkaXJlY3RpdmVcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudXRpbHMnKVxuICAgICAgICAuZGlyZWN0aXZlKCdhbmltYXRlRW5hYmxlZCcsIGFuaW1hdGVFbmFibGVkKTtcblxuICAgIGFuaW1hdGVFbmFibGVkLiRpbmplY3QgPSBbJyRhbmltYXRlJ107XG4gICAgZnVuY3Rpb24gYW5pbWF0ZUVuYWJsZWQgKCRhbmltYXRlKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZS4kZXZhbChhdHRycy5hbmltYXRlRW5hYmxlZCwgc2NvcGUpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgJGFuaW1hdGUuZW5hYmxlZCghIW5ld1ZhbHVlLCBlbGVtZW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IGJyb3dzZXIuanNcclxuICogQnJvd3NlciBkZXRlY3Rpb25cclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC51dGlscycpXHJcbiAgICAgICAgLnNlcnZpY2UoJ0Jyb3dzZXInLCBCcm93c2VyKTtcclxuXHJcbiAgICBCcm93c2VyLiRpbmplY3QgPSBbJyR3aW5kb3cnXTtcclxuICAgIGZ1bmN0aW9uIEJyb3dzZXIoJHdpbmRvdykge1xyXG4gICAgICByZXR1cm4gJHdpbmRvdy5qUUJyb3dzZXI7XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogY2xlYXItc3RvcmFnZS5qc1xuICogUmVtb3ZlcyBhIGtleSBmcm9tIHRoZSBicm93c2VyIHN0b3JhZ2UgdmlhIGVsZW1lbnQgY2xpY2tcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudXRpbHMnKVxuICAgICAgICAuZGlyZWN0aXZlKCdyZXNldEtleScsIHJlc2V0S2V5KTtcblxuICAgIHJlc2V0S2V5LiRpbmplY3QgPSBbJyRzdGF0ZScsICckbG9jYWxTdG9yYWdlJ107XG4gICAgZnVuY3Rpb24gcmVzZXRLZXkgKCRzdGF0ZSwgJGxvY2FsU3RvcmFnZSkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICByZXNldEtleTogJ0AnXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgIGlmKHNjb3BlLnJlc2V0S2V5KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlICRsb2NhbFN0b3JhZ2Vbc2NvcGUucmVzZXRLZXldO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygkc3RhdGUuY3VycmVudCwge30sIHtyZWxvYWQ6IHRydWV9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAkLmVycm9yKCdObyBzdG9yYWdlIGtleSBzcGVjaWZpZWQgZm9yIHJlc2V0LicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogY3VycmVuY3kuanNcbiAqIEN1cnJlbmN5IGZvcm1hdCBkXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnV0aWxzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnY3VycmVuY3knLCBjdXJyZW5jeSlcbiAgICAgICAgLmRpcmVjdGl2ZSgnYm9udXMnLCBib251cyk7XG5cbiAgICBjdXJyZW5jeS4kaW5qZWN0ID0gWyckd2luZG93J107XG4gICAgZnVuY3Rpb24gY3VycmVuY3koJHdpbmRvdykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWxDb250cm9sbGVyKSB7XG4gICAgICAgICAgbmdNb2RlbENvbnRyb2xsZXIuJHBhcnNlcnMucHVzaChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAvL2NvbnZlcnQgZGF0YSBmcm9tIHZpZXcgZm9ybWF0IHRvIG1vZGVsIGZvcm1hdFxuICAgICAgICAgICAgcmV0dXJuIGRhdGEqMTAwOyAvL2NvbnZlcnRlZFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbmdNb2RlbENvbnRyb2xsZXIuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAvL2NvbnZlcnQgZGF0YSBmcm9tIG1vZGVsIGZvcm1hdCB0byB2aWV3IGZvcm1hdFxuICAgICAgICAgICAgcmV0dXJuIGRhdGEvMTAwOyAvL2NvbnZlcnRlZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBib251cy4kaW5qZWN0ID0gWyckd2luZG93J107XG4gICAgZnVuY3Rpb24gYm9udXMoJHdpbmRvdykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWxDb250cm9sbGVyKSB7XG4gICAgICAgICAgbmdNb2RlbENvbnRyb2xsZXIuJHBhcnNlcnMucHVzaChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAvL2NvbnZlcnQgZGF0YSBmcm9tIHZpZXcgZm9ybWF0IHRvIG1vZGVsIGZvcm1hdFxuICAgICAgICAgICAgcmV0dXJuIGRhdGEvMTAwOyAvL2NvbnZlcnRlZFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbmdNb2RlbENvbnRyb2xsZXIuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAvL2NvbnZlcnQgZGF0YSBmcm9tIG1vZGVsIGZvcm1hdCB0byB2aWV3IGZvcm1hdFxuICAgICAgICAgICAgcmV0dXJuIGRhdGEqMTAwOyAvL2NvbnZlcnRlZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBmdWxsc2NyZWVuLmpzXG4gKiBUb2dnbGUgdGhlIGZ1bGxzY3JlZW4gbW9kZSBvbi9vZmZcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudXRpbHMnKVxuICAgICAgICAuZGlyZWN0aXZlKCd0b2dnbGVGdWxsc2NyZWVuJywgdG9nZ2xlRnVsbHNjcmVlbik7XG5cbiAgICB0b2dnbGVGdWxsc2NyZWVuLiRpbmplY3QgPSBbJ0Jyb3dzZXInXTtcbiAgICBmdW5jdGlvbiB0b2dnbGVGdWxsc2NyZWVuIChCcm93c2VyKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VwcG9ydGVkIHVuZGVyIElFXG4gICAgICAgICAgaWYoIEJyb3dzZXIubXNpZSApIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNjcmVlbmZ1bGwuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICBzY3JlZW5mdWxsLnRvZ2dsZSgpO1xuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAvLyBTd2l0Y2ggaWNvbiBpbmRpY2F0b3JcbiAgICAgICAgICAgICAgICAgIGlmKHNjcmVlbmZ1bGwuaXNGdWxsc2NyZWVuKVxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKCdlbScpLnJlbW92ZUNsYXNzKCdmYS1leHBhbmQnKS5hZGRDbGFzcygnZmEtY29tcHJlc3MnKTtcbiAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGlsZHJlbignZW0nKS5yZW1vdmVDbGFzcygnZmEtY29tcHJlc3MnKS5hZGRDbGFzcygnZmEtZXhwYW5kJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgJC5lcnJvcignRnVsbHNjcmVlbiBub3QgZW5hYmxlZCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbn0pKCk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogbG9hZC1jc3MuanNcbiAqIFJlcXVlc3QgYW5kIGxvYWQgaW50byB0aGUgY3VycmVudCBwYWdlIGEgY3NzIGZpbGVcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudXRpbHMnKVxuICAgICAgICAuZGlyZWN0aXZlKCdsb2FkQ3NzJywgbG9hZENzcyk7XG5cbiAgICBmdW5jdGlvbiBsb2FkQ3NzICgpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgIGlmKGVsZW1lbnQuaXMoJ2EnKSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB2YXIgdXJpID0gYXR0cnMubG9hZENzcyxcbiAgICAgICAgICAgICAgICAgIGxpbms7XG5cbiAgICAgICAgICAgICAgaWYodXJpKSB7XG4gICAgICAgICAgICAgICAgbGluayA9IGNyZWF0ZUxpbmsodXJpKTtcbiAgICAgICAgICAgICAgICBpZiAoICFsaW5rICkge1xuICAgICAgICAgICAgICAgICAgJC5lcnJvcignRXJyb3IgY3JlYXRpbmcgc3R5bGVzaGVldCBsaW5rIGVsZW1lbnQuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICQuZXJyb3IoJ05vIHN0eWxlc2hlZXQgbG9jYXRpb24gZGVmaW5lZC4nKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUxpbmsodXJpKSB7XG4gICAgICAgICAgdmFyIGxpbmtJZCA9ICdhdXRvbG9hZGVkLXN0eWxlc2hlZXQnLFxuICAgICAgICAgICAgICBvbGRMaW5rID0gJCgnIycrbGlua0lkKS5hdHRyKCdpZCcsIGxpbmtJZCArICctb2xkJyk7XG5cbiAgICAgICAgICAkKCdoZWFkJykuYXBwZW5kKCQoJzxsaW5rLz4nKS5hdHRyKHtcbiAgICAgICAgICAgICdpZCc6ICAgbGlua0lkLFxuICAgICAgICAgICAgJ3JlbCc6ICAnc3R5bGVzaGVldCcsXG4gICAgICAgICAgICAnaHJlZic6IHVyaVxuICAgICAgICAgIH0pKTtcblxuICAgICAgICAgIGlmKCBvbGRMaW5rLmxlbmd0aCApIHtcbiAgICAgICAgICAgIG9sZExpbmsucmVtb3ZlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuICQoJyMnK2xpbmtJZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogbm93LmpzXG4gKiBQcm92aWRlcyBhIHNpbXBsZSB3YXkgdG8gZGlzcGxheSB0aGUgY3VycmVudCB0aW1lIGZvcm1hdHRlZFxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC51dGlscycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ25vdycsIG5vdyk7XG5cbiAgICBub3cuJGluamVjdCA9IFsnZGF0ZUZpbHRlcicsICckaW50ZXJ2YWwnXTtcbiAgICBmdW5jdGlvbiBub3cgKGRhdGVGaWx0ZXIsICRpbnRlcnZhbCkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICB2YXIgZm9ybWF0ID0gYXR0cnMuZm9ybWF0O1xuXG4gICAgICAgICAgZnVuY3Rpb24gdXBkYXRlVGltZSgpIHtcbiAgICAgICAgICAgIHZhciBkdCA9IGRhdGVGaWx0ZXIobmV3IERhdGUoKSwgZm9ybWF0KTtcbiAgICAgICAgICAgIGVsZW1lbnQudGV4dChkdCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdXBkYXRlVGltZSgpO1xuICAgICAgICAgIHZhciBpbnRlcnZhbFByb21pc2UgPSAkaW50ZXJ2YWwodXBkYXRlVGltZSwgMTAwMCk7XG5cbiAgICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwoaW50ZXJ2YWxQcm9taXNlKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IHRhYmxlLWNoZWNrYWxsLmpzXG4gKiBUYWJsZXMgY2hlY2sgYWxsIGNoZWNrYm94XG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC51dGlscycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2NoZWNrQWxsJywgY2hlY2tBbGwpO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tBbGwgKCkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgZWxlbWVudC5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIGluZGV4PSAkdGhpcy5pbmRleCgpICsgMSxcbiAgICAgICAgICAgICAgICBjaGVja2JveCA9ICR0aGlzLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLFxuICAgICAgICAgICAgICAgIHRhYmxlID0gJHRoaXMucGFyZW50cygndGFibGUnKTtcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0byBhZmZlY3Qgb25seSB0aGUgY29ycmVjdCBjaGVja2JveCBjb2x1bW5cbiAgICAgICAgICAgIHRhYmxlLmZpbmQoJ3Rib2R5ID4gdHIgPiB0ZDpudGgtY2hpbGQoJytpbmRleCsnKSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKVxuICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsIGNoZWNrYm94WzBdLmNoZWNrZWQpO1xuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiB0cmlnZ2VyLXJlc2l6ZS5qc1xyXG4gKiBUcmlnZ2VycyBhIHdpbmRvdyByZXNpemUgZXZlbnQgZnJvbSBhbnkgZWxlbWVudFxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudXRpbHMnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3RyaWdnZXJSZXNpemUnLCB0cmlnZ2VyUmVzaXplKTtcclxuXHJcbiAgICB0cmlnZ2VyUmVzaXplLiRpbmplY3QgPSBbJyR3aW5kb3cnLCAnJHRpbWVvdXQnXTtcclxuICAgIGZ1bmN0aW9uIHRyaWdnZXJSZXNpemUgKCR3aW5kb3csICR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCkge1xyXG4gICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICR3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3Jlc2l6ZScpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogdXRpbHMuanNcbiAqIFV0aWxpdHkgbGlicmFyeSB0byB1c2UgYWNyb3NzIHRoZSB0aGVtZVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC51dGlscycpXG4gICAgICAgIC5zZXJ2aWNlKCdVdGlscycsIFV0aWxzKTtcblxuICAgIFV0aWxzLiRpbmplY3QgPSBbJyR3aW5kb3cnLCAnQVBQX01FRElBUVVFUlknXTtcbiAgICBmdW5jdGlvbiBVdGlscygkd2luZG93LCBBUFBfTUVESUFRVUVSWSkge1xuXG4gICAgICAgIHZhciAkaHRtbCA9IGFuZ3VsYXIuZWxlbWVudCgnaHRtbCcpLFxuICAgICAgICAgICAgJHdpbiAgPSBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdyksXG4gICAgICAgICAgICAkYm9keSA9IGFuZ3VsYXIuZWxlbWVudCgnYm9keScpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLy8gREVURUNUSU9OXG4gICAgICAgICAgc3VwcG9ydDoge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNpdGlvbkVuZCA9IChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdlYmtpdFRyYW5zaXRpb246ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTW96VHJhbnNpdGlvbjogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPVHJhbnNpdGlvbjogJ29UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ3RyYW5zaXRpb25lbmQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgbmFtZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHJldHVybiB0cmFuc0VuZEV2ZW50TmFtZXNbbmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0oKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25FbmQgJiYgeyBlbmQ6IHRyYW5zaXRpb25FbmQgfTtcbiAgICAgICAgICAgICAgICB9KSgpLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgYW5pbWF0aW9uRW5kID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltRW5kRXZlbnROYW1lcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBXZWJraXRBbmltYXRpb246ICd3ZWJraXRBbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1vekFuaW1hdGlvbjogJ2FuaW1hdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT0FuaW1hdGlvbjogJ29BbmltYXRpb25FbmQgb2FuaW1hdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnYW5pbWF0aW9uZW5kJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgbmFtZTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKG5hbWUgaW4gYW5pbUVuZEV2ZW50TmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHJldHVybiBhbmltRW5kRXZlbnROYW1lc1tuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0oKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uRW5kICYmIHsgZW5kOiBhbmltYXRpb25FbmQgfTtcbiAgICAgICAgICAgIH0pKCksXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihjYWxsYmFjayl7IHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwLzYwKTsgfSxcbiAgICAgICAgICAgIC8qanNoaW50IC1XMDY5Ki9cbiAgICAgICAgICAgIHRvdWNoOiAoXG4gICAgICAgICAgICAgICAgKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL21vYmlsZXx0YWJsZXQvKSkgfHxcbiAgICAgICAgICAgICAgICAod2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiB3aW5kb3cuRG9jdW1lbnRUb3VjaCkgIHx8XG4gICAgICAgICAgICAgICAgKHdpbmRvdy5uYXZpZ2F0b3JbJ21zUG9pbnRlckVuYWJsZWQnXSAmJiB3aW5kb3cubmF2aWdhdG9yWydtc01heFRvdWNoUG9pbnRzJ10gPiAwKSB8fCAvL0lFIDEwXG4gICAgICAgICAgICAgICAgKHdpbmRvdy5uYXZpZ2F0b3JbJ3BvaW50ZXJFbmFibGVkJ10gJiYgd2luZG93Lm5hdmlnYXRvclsnbWF4VG91Y2hQb2ludHMnXSA+IDApIHx8IC8vSUUgPj0xMVxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbXV0YXRpb25vYnNlcnZlcjogKHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8IHdpbmRvdy5XZWJLaXRNdXRhdGlvbk9ic2VydmVyIHx8IHdpbmRvdy5Nb3pNdXRhdGlvbk9ic2VydmVyIHx8IG51bGwpXG4gICAgICAgICAgfSxcbiAgICAgICAgICAvLyBVVElMSVRJRVNcbiAgICAgICAgICBpc0luVmlldzogZnVuY3Rpb24oZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICAgICAgICAvKmpzaGludCAtVzEwNiovXG4gICAgICAgICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgaWYgKCEkZWxlbWVudC5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHdpbmRvd19sZWZ0ID0gJHdpbi5zY3JvbGxMZWZ0KCksXG4gICAgICAgICAgICAgICAgICB3aW5kb3dfdG9wICA9ICR3aW4uc2Nyb2xsVG9wKCksXG4gICAgICAgICAgICAgICAgICBvZmZzZXQgICAgICA9ICRlbGVtZW50Lm9mZnNldCgpLFxuICAgICAgICAgICAgICAgICAgbGVmdCAgICAgICAgPSBvZmZzZXQubGVmdCxcbiAgICAgICAgICAgICAgICAgIHRvcCAgICAgICAgID0gb2Zmc2V0LnRvcDtcblxuICAgICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoe3RvcG9mZnNldDowLCBsZWZ0b2Zmc2V0OjB9LCBvcHRpb25zKTtcblxuICAgICAgICAgICAgICBpZiAodG9wICsgJGVsZW1lbnQuaGVpZ2h0KCkgPj0gd2luZG93X3RvcCAmJiB0b3AgLSBvcHRpb25zLnRvcG9mZnNldCA8PSB3aW5kb3dfdG9wICsgJHdpbi5oZWlnaHQoKSAmJlxuICAgICAgICAgICAgICAgICAgbGVmdCArICRlbGVtZW50LndpZHRoKCkgPj0gd2luZG93X2xlZnQgJiYgbGVmdCAtIG9wdGlvbnMubGVmdG9mZnNldCA8PSB3aW5kb3dfbGVmdCArICR3aW4ud2lkdGgoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXG4gICAgICAgICAgbGFuZ2RpcmVjdGlvbjogJGh0bWwuYXR0cignZGlyJykgPT09ICdydGwnID8gJ3JpZ2h0JyA6ICdsZWZ0JyxcblxuICAgICAgICAgIGlzVG91Y2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHRtbC5oYXNDbGFzcygndG91Y2gnKTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgaXNTaWRlYmFyQ29sbGFwc2VkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGJvZHkuaGFzQ2xhc3MoJ2FzaWRlLWNvbGxhcHNlZCcpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBpc1NpZGViYXJUb2dnbGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGJvZHkuaGFzQ2xhc3MoJ2FzaWRlLXRvZ2dsZWQnKTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgaXNNb2JpbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkd2luLndpZHRoKCkgPCBBUFBfTUVESUFRVUVSWS50YWJsZXQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnY3VzdG9tJywgW1xyXG4gICAgICAgICAgICAvLyByZXF1ZXN0IHRoZSB0aGUgZW50aXJlIGZyYW1ld29ya1xyXG4gICAgICAgICAgICAnYW5nbGUnLFxyXG4gICAgICAgICAgICAvLyBvciBqdXN0IG1vZHVsZXNcclxuICAgICAgICAgICAgJ2FwcC5jb3JlJyxcclxuICAgICAgICAgICAgJ2FwcC5zaWRlYmFyJ1xyXG4gICAgICAgICAgICAvKi4uLiovXHJcbiAgICAgICAgXSk7XHJcbn0pKCk7IiwiXHJcbi8vIFRvIHJ1biB0aGlzIGNvZGUsIGVkaXQgZmlsZSBpbmRleC5odG1sIG9yIGluZGV4LmphZGUgYW5kIGNoYW5nZVxyXG4vLyBodG1sIGRhdGEtbmctYXBwIGF0dHJpYnV0ZSBmcm9tIGFuZ2xlIHRvIG15QXBwTmFtZVxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2N1c3RvbScpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbnRyb2xsZXInLCBDb250cm9sbGVyKTtcclxuXHJcbiAgICBDb250cm9sbGVyLiRpbmplY3QgPSBbJyRsb2cnXTtcclxuICAgIGZ1bmN0aW9uIENvbnRyb2xsZXIoJGxvZykge1xyXG4gICAgICAgIC8vIGZvciBjb250cm9sbGVyQXMgc3ludGF4XHJcbiAgICAgICAgLy8gdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICRsb2cubG9nKCdJXFwnbSBhIGxpbmUgZnJvbSBjdXN0b20uanMnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
