
workStation.registerModule('ionic', [])

    .config(['$stateProvider', '$ocLazyLoadProvider', function ($stateProvider, $ocLazyLoadProvider) {
        $stateProvider
            .state('app.ionic', {
                url: '/ionic',
                templateUrl: workStation.toAppsURL('tpls/index.html', 'ionic'),
                resolve: {
                    loadFile: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['ionic.file']);
                    }]
                }
            })
            .state('app.hugeData', {
                url: '/hugedata',
                templateUrl: workStation.toAppsURL('tpls/hugeData.html', 'ionic'),
                controller: 'HugeDataController'
            })
            .state('app.scroller', {
                url: '/scroller',
                templateUrl: workStation.toAppsURL('tpls/scroller.html', 'ionic'),
                controller: 'ScrollerController'
            });

        $ocLazyLoadProvider.config({
            modules: [{
                name: 'ionic.file',
                files: [
                    workStation.toAppsURL('js/controllers/HugeDataController.js', 'ionic'),
                    workStation.toAppsURL('js/controllers/ScrollerController.js', 'ionic')
                ]
            }]
        });
    }]);
