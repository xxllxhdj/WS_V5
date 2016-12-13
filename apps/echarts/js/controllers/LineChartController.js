angular.module('echarts')

.controller('LineChartController', ['$scope', function($scope) {

    $scope.lineChartOption = {
        legend: {
            data: ['高度(km)与气温(°C)变化关系']
        },
        tooltip: {
            trigger: 'axis',
            formatter: 'Temperature : <br/>{b}km : {c}°C'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        yAxis: {
            type: 'category',
            axisLine: { onZero: false },
            axisLabel: {
                formatter: '{value} km'
            },
            boundaryGap: false,
            data: ['0', '10', '20', '30', '40', '50', '60', '70', '80']
        },
        series: [{
            name: '高度(km)与气温(°C)变化关系',
            type: 'line',
            smooth: true,
            lineStyle: {
                normal: {
                    width: 3,
                    shadowColor: 'rgba(0,0,0,0.4)',
                    shadowBlur: 10,
                    shadowOffsetY: 10
                }
            },
            data: [15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
        }]
    };

    var data = [];

    for (var i = 0; i <= 100; i++) {
        var theta = i / 100 * 360;
        var r = 5 * (1 + Math.sin(theta / 180 * Math.PI));
        data.push([r, theta]);
    }

    $scope.linePolarOption = {
        title: {
            text: '极坐标双数值轴'
        },
        legend: {
            data: ['line']
        },
        polar: {},
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        angleAxis: {
            type: 'value',
            startAngle: 0
        },
        radiusAxis: {},
        series: [{
            coordinateSystem: 'polar',
            name: 'line',
            type: 'line',
            data: data
        }]
    };
}]);
