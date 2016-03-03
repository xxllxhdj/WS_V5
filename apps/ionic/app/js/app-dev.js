
workStation.registerModule('ionic', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ionic', {
                url: '/ionic',
                templateUrl: workStation.toAppsURL('tpls/index.html', 'ionic'),
                resolve: {
                    loadFile: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'ionic.file',
                            files: [
                                workStation.toAppsURL('js/controllers/HugeDataController.js', 'ionic')
                            ]
                        });
                    }]
                }
            })
            .state('app.hugeData', {
                url: '/hugedata',
                templateUrl: workStation.toAppsURL('tpls/hugeData.html', 'ionic'),
                controller: 'HugeDataController'
            });
    }]);
