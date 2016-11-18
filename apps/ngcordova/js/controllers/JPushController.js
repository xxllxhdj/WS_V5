
angular.module('ngcordova')

.controller('JPushController', ['$scope', function ($scope) {
    $scope.data = {
        alia: '',
        tag: ''
    };

    $scope.setAlia = function () {
        if (window.cordova && window.plugins.jPushPlugin) {
            window.plugins.jPushPlugin.setAlias($scope.data.alia);
        }
    };
    $scope.setTag = function () {
        if (window.cordova && window.plugins.jPushPlugin) {
            window.plugins.jPushPlugin.setTags([ $scope.data.tag ]);
        }
    };
}]);