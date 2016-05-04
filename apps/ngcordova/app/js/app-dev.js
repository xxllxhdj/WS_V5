
workStation.registerModule('ngcordova', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ngcordova', {
                url: '/ngcordova',
                templateUrl: workStation.toAppsURL('tpls/index.html', 'ngcordova'),
                resolve: {
                    loadFile: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'ngcordova.file',
                            files: [
                                workStation.toAppsURL('js/controllers/SqliteController.js', 'ngcordova')
                            ]
                        });
                    }]
                }
            })
            .state('app.sqlite', {
                url: '/sqlite',
                templateUrl: workStation.toAppsURL('tpls/sqlite.html', 'ngcordova'),
                controller: 'SqliteController'
            });
    }]);
