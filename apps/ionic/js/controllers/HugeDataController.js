
angular.module('ionicdm')

.controller('HugeDataController', ['$scope',
    function ($scope) {
        $scope.data = {
            img: workStation.toAppsURL('img/ionic.png', 'ionic'),
            hugeData: null
        };

        var temp = [];
        for (var i = 1; i <= 1000; i++) {
            temp.push({
                name: '测试' + i
            });
        }
        $scope.data.hugeData = temp;
    }
]);
