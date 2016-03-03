angular.module('WorkStation.services')

.factory('InitService', ['$q', '$ocLazyLoad', 'ConfigService', 'DemoService', 'UtilService',  
    function($q, $ocLazyLoad, ConfigService, DemoService, UtilService) {
        var defer = $q.defer();

        init();

        return {
            initPromise: defer.promise
        };

        function init() {
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
    }
]);
