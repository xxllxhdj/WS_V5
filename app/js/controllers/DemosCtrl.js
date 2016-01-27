
angular.module('WorkStation.controllers')

    .controller('DemosCtrl', ['$scope', '$rootScope', '$state', 
        function ($scope, $rootScope, $state) {
            //$scope.techData = DemoService.getEnabledDemos();

            $scope.goApp = function (appId) {
                // routeResolver.load(appId).then(function () {
                //     $state.go('app.' + appId);
                // }, function () {
                //     alert('加载Demo失败，请确认是否已安装然后重试。');
                // });
            };

            // $rootScope.$on('DemoEnabledChanged', function () {
            //     $scope.techData = DemoService.getEnabledDemos();
            // });
        }
    ]);