
angular.module('ionicdm.controllers')

.controller('HomeController', ['$scope', 'wsNumberpad', 'wsDialog', function ($scope, wsNumberpad, wsDialog) {
    $scope.showNumberpad = function () {
        wsNumberpad.show({
            value: 100,
            decimal: true// ,
            // minValue: 10,
            // maxValue: 1000
        }).then(function (number) {
            wsDialog.toastCenter(number);
        });
    };
}]);
