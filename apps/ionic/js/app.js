
workStation.registerModule('ionicdm', [{
    files: [
        //--inject:lib--//
        //--endinject--//
        //--inject:js--//
        workStation.toAppsURL('js/controllers/HomeController.js', 'ionic'),
        workStation.toAppsURL('js/controllers/HugeDataController.js', 'ionic'),
        workStation.toAppsURL('js/controllers/ScrollerController.js', 'ionic'),
        workStation.toAppsURL('js/controllers/CalendarController.js', 'ionic'),
        workStation.toAppsURL('js/directives/ngCalendar.js', 'ionic')
        //--endinject--//
    ],
    serie: true,
    cache: false
}])

.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('app.ionic', {
            url: '/ionic',
            templateUrl: workStation.toAppsURL('tpls/home.html', 'ionic'),
            controller: 'HomeController'
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
        })
        .state('app.calendar', {
            url: '/calendar',
            templateUrl: workStation.toAppsURL('tpls/calendar.html', 'ionic'),
            controller: 'CalendarController'
        });
}]);
