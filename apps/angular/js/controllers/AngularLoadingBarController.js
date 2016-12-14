angular.module('angular')

.controller('AngularLoadingBarController', ['$scope', 'wsDialog', function($scope, wsDialog) {
    $scope.showLoading = function () {
        wsDialog.showLoading();
    };
    $scope.hideLoading = function () {
        wsDialog.hideLoading();
    };
}]);
