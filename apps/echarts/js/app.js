
workStation.registerModule('echarts', [])

    .config(['$stateProvider', '$ocLazyLoadProvider', function ($stateProvider, $ocLazyLoadProvider) {
        $stateProvider
            .state('app.echarts', {
                url: '/echarts',
                templateUrl: workStation.toAppsURL('tpls/index.html', 'echarts'),
                resolve: {
                    loadFile: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['echarts', 'echarts.file']);
                    }]
                }
            })
            .state('app.linechart', {
                url: '/linechart',
                templateUrl: workStation.toAppsURL('tpls/linechart.html', 'echarts'),
                controller: 'LineChartController'
            });

        $ocLazyLoadProvider.config({
            modules: [{
                name: 'echarts',
                files: [
                    workStation.toAppsURL('lib/echarts/dist/echarts.js', 'echarts')
                ]
            }, {
                name: 'echarts.file',
                files: [
                    workStation.toAppsURL('js/controllers/LineChartController.js', 'echarts'),
                    workStation.toAppsURL('js/directives/ngEcharts.js', 'echarts')
                ]
            }]
        });
    }]);
