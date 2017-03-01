
angular.module('ionicdm.controllers')

.controller('HomeController', ['$scope', 'wsNumberpad', function ($scope, wsNumberpad) {
    $scope.showNumberpad = function () {
        wsNumberpad.show({ value: 100.8 });
    };
}]);
