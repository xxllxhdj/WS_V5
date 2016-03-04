
workStation.registerModule('angular', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.angular', {
                url: '/angular',
                templateUrl: workStation.toAppsURL('tpls/index.html', 'angular'),
                resolve: {
                    loadFile: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'angular.file',
                            files: [
                                workStation.toAppsURL('js/controllers/AngularBMapController.js', 'angular')
                            ]
                        });
                    }]
                }
            })
            .state('app.angularBMap', {
                url: '/angularBMap',
                templateUrl: workStation.toAppsURL('tpls/angularBMap.html', 'angular'),
                controller: 'AngularBMapController'
            });
    }]);
