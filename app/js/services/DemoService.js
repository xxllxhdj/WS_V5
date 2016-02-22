angular.module('WorkStation.services')

.factory('DemoService', ['$q', 'ConfigService', 'APPCONSTANTS', 
    function ($q, ConfigService, APPCONSTANTS) {
        var demos = [],
            defer = $q.defer(),
            o = {
                initPromise: defer.promise
            };

        ConfigService.loadingPromise.then(init);

        o.setDemoEnabled = function (id, enabled) {
            for (var i in demos) {
                if (demos[i].id === id) {
                    demos[i].enabled = enabled;
                    ConfigService.set('demos', demos);
                }
            }
        };
        o.getDemos = function () {
            return angular.isArray(demos) ? demos.slice(0, demos.length) : [];
        };
        o.getEnabledDemos = function () {
            var enabledDemos = [];
            angular.forEach(demos, function (demo) {
                if (demo.enabled) {
                    demo.logo = workStation.toAppsURL(demo.logo, demo.id);
                    enabledDemos.push(demo);
                }
            });
            return enabledDemos;
        };

        return o;

        function init () {
            demos = ConfigService.get('demos');
            defer.resolve();
        }
    }
]);