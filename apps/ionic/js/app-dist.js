
workStation.registerModule('ionic', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ionic', {
                url: '/ionic',
                templateUrl: workStation.toAppsURL('tpls/index.html', 'ionic')
            })
            .state('app.hugeData', {
                url: '/hugedata',
                templateUrl: workStation.toAppsURL('tpls/hugeData.html', 'ionic'),
                controller: 'HugeDataController'
            });
    }]);