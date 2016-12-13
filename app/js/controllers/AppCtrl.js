
angular.module('WorkStation.controllers')

.controller('AppCtrl', ['$scope', '$ionicHistory', '$state',
    function ($scope, $ionicHistory, $state) {
        $scope.appModel = {
            tabsVisible: false
        };
        $scope.go = function (state) {
            $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableAnimate: false,
                expire: 300
            });
            $state.go(state);
        };

        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            var url = toState.url;
            if (url.indexOf('demos') !== -1 || url.indexOf('about') !== -1 || url.indexOf('option') !== -1) {
                $scope.appModel.tabsVisible = false;
            } else {
                $scope.appModel.tabsVisible = true;
            }
        });
    }
]);
