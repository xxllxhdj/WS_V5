
angular.module('WorkStation.controllers')

.controller('DemosCtrl', ['$scope', '$rootScope', '$ionicSlideBoxDelegate', '$state', 'DemoService', 'Help', 'InitService', 'wsDialog', 'APPCONSTANTS',
    function ($scope, $rootScope, $ionicSlideBoxDelegate, $state, DemoService, Help, InitService, wsDialog, APPCONSTANTS) {
        $scope.data = {
            appsArray: [],
            editing: false
        };

        InitService.then(init);

        var reListSlideBox = $ionicSlideBoxDelegate.$getByHandle('slideApps'),
            preIndex = 0;

        $scope.switchEdit = function () {
            $scope.data.editing = !$scope.data.editing;
            if (!$scope.data.editing) {
                submitChange();
            }
        };
        $scope.clickApp = function (app) {
            if ($scope.data.editing) {
                return;
            }
            Help.loadApp(app.id).then(function () {
                $state.go('app.' + app.id);
            }, function () {
                wsDialog.toastBottom('加载失败，请确认是否已安装然后重试。');
            });
        };
        $scope.onDragStart = function () {
            reListSlideBox.enableSlide(false);
            preIndex = reListSlideBox.currentIndex();
        };
        $scope.onDrag = function(event, ui) {
            var posX = event.clientX,
                clientWidth = document.body.clientWidth,
                cIndex = reListSlideBox.currentIndex();
            ui.position.left += clientWidth * (cIndex - preIndex);
            if (posX < 20) {
                reListSlideBox.previous();
                return;
            }
            if (clientWidth - posX < 20) {
                reListSlideBox.next();
                return;
            }
        };
        $scope.onDragStop = function () {
            reListSlideBox.enableSlide(true);
        };

        // $rootScope.$on('DemoEnabledChanged', function () {
        //     $scope.techData = DemoService.getDemos();
        // });

        function init () {
            $scope.data.appsArray = formatApps(DemoService.getDemos());
        }

        function submitChange () {
            var temps = angular.copy($scope.data.appsArray),
                apps = [];
            angular.forEach(temps, function (appArray) {
                angular.forEach(appArray, function (app) {
                    delete app.$$hashKey;
                    var splits = app.logo.split('/');
                    if (splits.length > 0) {
                        app.logo = splits[splits.length - 1];
                    }
                    apps.push(app);
                });
            });
            DemoService.setDemos(apps);
        }

        function formatApps (apps) {
            var maxNum = APPCONSTANTS.appNumPerPage,
                j = 0,
                temp = [],
                results = [];
            for (var i in apps) {
                temp.push(apps[i]);
                j++;
                if (j === maxNum) {
                    j = 0;
                    results.push(temp);
                    temp = [];
                }
            }
            if (apps.length % maxNum !== 0) {
                results.push(temp);
            }
            return results;
        }
    }
]);
