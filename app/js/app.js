
angular.module('WorkStation', [
    'ionic',
    'oc.lazyLoad',
    'ngCordova',

    'WorkStation.controllers',
    'WorkStation.directives',
    'WorkStation.services',
    'WorkStation.utility'
])

    .run(['$ionicPlatform', '$timeout', 'InitService', 'APPCONSTANTS',
        function ($ionicPlatform, $timeout, InitService, APPCONSTANTS) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
                if (navigator.splashscreen) {
                    InitService.initPromise.then(function () {
                        $timeout(function () {
                            navigator.splashscreen.hide();
                            if (window.StatusBar) {
                                StatusBar.show();
                            }
                        }, APPCONSTANTS.splashScreenExtraDelay);
                    });
                }
            });
        }
    ])

    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$ocLazyLoadProvider',
        function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ocLazyLoadProvider) {

            $ocLazyLoadProvider.config({
                debug: false,
                events: true,
            });

            $stateProvider
                .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: 'tpls/app.html',
                    controller: 'AppCtrl'
                })
                .state('app.demos', {
                    url: '/demos',
                    templateUrl: 'tpls/demos.html',
                    controller: 'DemosCtrl',
                    resolve: {
                        'loadingConfig': ['ConfigService', function (ConfigService) {
                            return ConfigService.loadingPromise;
                        }]
                    }
                })
                .state('app.option', {
                    url: '/option',
                    templateUrl: 'tpls/option.html'
                })
                .state('app.about', {
                    url: '/about',
                    templateUrl: 'tpls/about.html'
                });
            $urlRouterProvider.otherwise('/app/demos');

            $ionicConfigProvider.platform.android.scrolling.jsScrolling(true);
            $ionicConfigProvider.platform.android.navBar.alignTitle('center');
            $ionicConfigProvider.platform.android.backButton.previousTitleText(false);
            $ionicConfigProvider.platform.android.navBar.transition('view');
            $ionicConfigProvider.platform.android.views.transition('ios');
            $ionicConfigProvider.platform.android.views.swipeBackEnabled(true);
            $ionicConfigProvider.platform.android.views.swipeBackHitWidth(45);
            $ionicConfigProvider.platform.android.tabs.style('standard');
            $ionicConfigProvider.platform.android.tabs.position('bottom');
            $ionicConfigProvider.platform.android.form.toggle('large');

            $ionicConfigProvider.platform.default.backButton.previousTitleText(false);
            $ionicConfigProvider.platform.default.backButton.text(false);
        }
    ]);

(function () {
    document.addEventListener("deviceready", onReady, false);

    if (typeof cordova === 'undefined') {
        angular.element(document).ready(onReady);
    }

    function onReady () {
        angular.bootstrap(document, ['WorkStation']);
    }
})();