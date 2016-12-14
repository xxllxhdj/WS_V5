
workStation.registerModule('angular', [])

.config(['$stateProvider', '$ocLazyLoadProvider', function ($stateProvider, $ocLazyLoadProvider) {
    $stateProvider
        .state('app.angular', {
            url: '/angular',
            templateUrl: workStation.toAppsURL('tpls/index.html', 'angular'),
            resolve: {
                loadFile: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
                    var defer = $q.defer();

                    $ocLazyLoad.load(['angular-awesome-slider', 'angular.file']).then(function () {
                        angular.module('angular').requires.push('angularAwesomeSlider');
                        defer.resolve();
                    }, function () {
                        defer.reject();
                    });

                    return defer.promise;
                }]
            }
        })
        .state('app.angularBMap', {
            url: '/angularBMap',
            templateUrl: workStation.toAppsURL('tpls/angularBMap.html', 'angular'),
            controller: 'AngularBMapController'
        })
        .state('app.angularSlider', {
            url: '/angularSlider',
            templateUrl: workStation.toAppsURL('tpls/angularSlider.html', 'angular'),
            controller: 'AngularSliderController'
        })
        .state('app.angularLoadingBar', {
            url: '/angularLoadingBar',
            templateUrl: workStation.toAppsURL('tpls/angularLoadingBar.html', 'angular'),
            controller: 'AngularLoadingBarController'
        });

    $ocLazyLoadProvider.config({
        modules: [{
            name: 'angular-awesome-slider',
            files: [
                workStation.toAppsURL('lib/angular-awesome-slider/dist/css/angular-awesome-slider.min.css', 'angular'),
                workStation.toAppsURL('lib/angular-awesome-slider/dist/angular-awesome-slider.js', 'angular')
            ]
        }, {
            name: 'angular.file',
            files: [
                workStation.toAppsURL('js/controllers/AngularBMapController.js', 'angular'),
                workStation.toAppsURL('js/controllers/AngularSliderController.js', 'angular'),
                workStation.toAppsURL('js/controllers/AngularLoadingBarController.js', 'angular')
            ]
        }]
    });
}]);
