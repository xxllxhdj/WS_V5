angular.module('WorkStation.services')

.factory('DemoService', ['$q', 'ConfigService', 'APPCONSTANTS', 
    function ($q, ConfigService, APPCONSTANTS) {
        var demos = [],
            defer = $q.defer(),
            o = {
                initPromise: defer.promise
            };

        ConfigService.loadingPromise.then(init);

        o.setDemos = function (demos) {
            var df = $q.defer();

            ConfigService.set('demos', demos).then(function () {
                df.resolve();
            }, function () {
                df.reject();
            });

            return df.promise;
        };
        o.getDemos = function () {
            var results = [];
            angular.forEach(demos, function (demo) {
                demo.logo = workStation.toAppsURL(demo.logo, demo.id);
                results.push(demo);
            });
            return results;
        };

        return o;

        function init () {
            demos = ConfigService.get('demos');
            defer.resolve();
        }
    }
]);