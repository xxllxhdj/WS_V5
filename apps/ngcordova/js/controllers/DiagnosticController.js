
angular.module('ngcordova')

.controller('DiagnosticController', ['$scope', function ($scope) {
    $scope.switchToSettings = function () {
        if (window.cordova && cordova.plugins.diagnostic) {
            cordova.plugins.diagnostic.switchToSettings();
        }
    };
    $scope.switchToLocationSettings = function () {
        if (window.cordova && cordova.plugins.diagnostic) {
            cordova.plugins.diagnostic.switchToLocationSettings();
        }
    };
    $scope.switchToWifiSettings = function () {
        if (window.cordova && cordova.plugins.diagnostic) {
            cordova.plugins.diagnostic.switchToWifiSettings();
        }
    };
    $scope.switchToBluetoothSettings = function () {
        if (window.cordova && cordova.plugins.diagnostic) {
            cordova.plugins.diagnostic.switchToBluetoothSettings();
        }
    };
    $scope.switchToMobileDataSettings = function () {
        if (window.cordova && cordova.plugins.diagnostic) {
            cordova.plugins.diagnostic.switchToMobileDataSettings();
        }
    };
}]);