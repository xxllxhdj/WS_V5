
workStation.registerModule('ionicdm', [])

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
            })
            .state('app.scroller', {
                url: '/scroller',
                templateUrl: workStation.toAppsURL('tpls/scroller.html', 'ionic'),
                controller: 'ScrollerController'
            });
    }]);
