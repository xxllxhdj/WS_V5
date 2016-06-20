
workStation.registerModule('ngcordova', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ngcordova', {
                url: '/ngcordova',
                templateUrl: workStation.toAppsURL('tpls/index.html', 'ngcordova')
            })
            .state('app.sqlite', {
                url: '/sqlite',
                templateUrl: workStation.toAppsURL('tpls/sqlite.html', 'ngcordova'),
                controller: 'SqliteController'
            })
            .state('app.diagnostic', {
                url: '/diagnostic',
                templateUrl: workStation.toAppsURL('tpls/diagnostic.html', 'ngcordova'),
                controller: 'DiagnosticController'
            });
    }]);