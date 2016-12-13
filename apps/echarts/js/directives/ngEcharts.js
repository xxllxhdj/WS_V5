angular.module('echarts')

.directive('ngEcharts', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            option: '=ecOption',
            config: '=ecConfig'
        },
        template: '<div></div>',
        link: function(scope, element, attrs, ctrl) {
            var theme = (scope.config && scope.config.theme) ? scope.config.theme : 'default',
                chart = echarts.init(element[0], theme);

            if (scope.config && scope.config.event) {
                if (angular.isArray(scope.config.event)) {
                    angular.forEach(scope.config.event, function(value, key) {
                        for (var e in value) {
                            chart.on(e, value[e]);
                        }
                    });
                }
            }

            window.addEventListener('resize', resize);
            scope.$on('$destroy', function() {
                window.removeEventListener('resize', resize);
            });

            // update when charts config changes
            scope.$watch(function() {
                return scope.config;
            }, function(value) {
                if (value) {
                    refreshChart();
                }
            }, true);
            scope.$watch(function() {
                return scope.option;
            }, function(value) {
                if (value) {
                    refreshChart();
                }
            }, true);

            function resize() {
                chart.resize();
            }

            function refreshChart() {
                if (scope.config && scope.config.dataLoaded === false) {
                    chart.showLoading();
                }
                chart.setOption(scope.option);
                chart.resize();
                if (scope.config && scope.config.dataLoaded) {
                    chart.hideLoading();
                }
            }
        }
    };
});
