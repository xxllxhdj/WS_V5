
workStation.registerModule('ngcordova', [])

    .config(['$stateProvider', '$ocLazyLoadProvider', function ($stateProvider, $ocLazyLoadProvider) {
        $stateProvider
            .state('app.ngcordova', {
                url: '/ngcordova',
                templateUrl: workStation.toAppsURL('tpls/index.html', 'ngcordova'),
                resolve: {
                    loadFile: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['ngcordova.file']);
                    }]
                }
            })
            .state('app.sqlite', {
                url: '/sqlite',
                templateUrl: workStation.toAppsURL('tpls/sqlite.html', 'ngcordova'),
                controller: 'SqliteController',
                resolve: {
                    loaded: ['Preference', function(Preference) {
                        return Preference.loadPromise;
                    }]
                }
            })
            .state('app.diagnostic', {
                url: '/diagnostic',
                templateUrl: workStation.toAppsURL('tpls/diagnostic.html', 'ngcordova'),
                controller: 'DiagnosticController'
            });

        $ocLazyLoadProvider.config({
            modules: [{
                name: 'ngcordova.file',
                files: [
                    workStation.toAppsURL('js/controllers/SqliteController.js', 'ngcordova'),
                    workStation.toAppsURL('js/controllers/DiagnosticController.js', 'ngcordova'),
                    workStation.toAppsURL('js/services/Preference.js', 'ngcordova')
                ]
            }]
        });
    }]);
