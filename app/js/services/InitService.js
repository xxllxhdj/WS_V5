angular.module('WorkStation.services')

.factory('InitService', ['$q', '$ionicPlatform', '$ionicHistory', '$timeout', '$ocLazyLoad', '$cordovaToast', 'ConfigService', 'DemoService', 'UtilService', 'APPCONSTANTS',
    function($q, $ionicPlatform, $ionicHistory, $timeout, $ocLazyLoad, $cordovaToast, ConfigService, DemoService, UtilService, APPCONSTANTS) {
        var defer = $q.defer();

        init();

        return defer.promise;

        function init() {
            $ionicPlatform.registerBackButtonAction(
                onHardwareBackButton,
                APPCONSTANTS.platformBackButtonPriorityView
            );

            publishExternalAPI();

            var tasks = [ConfigService.loadingPromise, DemoService.initPromise];
            $q.all(tasks).finally(function() {
                defer.resolve();
            });
        }

        function publishExternalAPI () {
            var workStation = window.workStation || (window.workStation = {});

            workStation.load = $ocLazyLoad.load;

            workStation.toAppsURL = UtilService.toAppsURL;

            workStation.registerModule = registerModule;
        }

        function registerModule (moduleName, dependencies) {
          // Create angular module
          var module = angular.module(moduleName, dependencies || []);

          // Add the module to the AngularJS configuration file
          angular.module('WorkStation').requires.push(moduleName);

          return module;
        }

        var _confirmExit = false;
        function onHardwareBackButton(e) {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                if (_confirmExit) {
                    ionic.Platform.exitApp();
                } else {
                    _confirmExit = true;
                    $cordovaToast.showShortBottom('再按一次退出');
                    $timeout(function () {
                        _confirmExit = false;
                    }, APPCONSTANTS.exitAppConfirmTime);
                }
            }

            e.preventDefault();
            return false;
        }
    }
]);
