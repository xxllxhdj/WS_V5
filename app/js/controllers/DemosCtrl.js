
angular.module('WorkStation.controllers')

    .controller('DemosCtrl', ['$scope', '$rootScope', '$state', 'DemoService', 'UtilService', 'InitService',
        function ($scope, $rootScope, $state, DemoService, UtilService, InitService) {
            InitService.initPromise.then(init);

            $scope.goApp = function (appId) {
                UtilService.loadApp(appId).then(function () {
                    $state.go('app.' + appId);
                }, function () {
                    alert('加载Demo失败，请确认是否已安装然后重试。');
                });
            };

            // $rootScope.$on('DemoEnabledChanged', function () {
            //     $scope.techData = DemoService.getEnabledDemos();
            // });
            // 
            
            function init () {
                $scope.techData = DemoService.getEnabledDemos();
            }
        }
    ]);