
angular.module('ionicdm')

.controller('CalendarController', ['$scope', function ($scope) {
    $scope.calOption1 = {
        start: new Date(2017, 7, 26),
        end: new Date(2017, 8, 25)
    };
    $scope.calOption2 = {
        start: new Date(2017, 8, 26),
        end: new Date(2017, 9, 25)
    };
    $scope.calOption3 = {
        start: new Date(2017, 9, 26),
        end: new Date(2017, 10, 25)
    };
    $scope.calOption = {
        start: new Date(2017, 8, 1),
        end: new Date(2017, 8, 30)
    };
}]);
