
angular.module('ionicdm')

.controller('CalendarController', ['$scope', function ($scope) {
    $scope.calOption1 = {
        startDate: new Date(2017, 7, 26),
        endDate: new Date(2017, 8, 25)
    };
    $scope.calOption2 = {
        startDate: new Date(2017, 8, 26),
        endDate: new Date(2017, 9, 25)
    };
    $scope.calOption3 = {
        startDate: new Date(2017, 9, 26),
        endDate: new Date(2017, 10, 25)
    };
    $scope.calOption = {
        startDate: new Date(2017, 8, 1),
        endDate: new Date(2017, 8, 30)
    };
}]);
