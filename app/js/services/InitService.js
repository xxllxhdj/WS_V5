angular.module('WorkStation.services')

.factory('InitService', ['$q', '$ionicPlatform', '$ionicHistory', '$timeout', '$ocLazyLoad', '$cordovaToast', 'ConfigService', 'DemoService', 'Help', 'APPCONSTANTS',
    function($q, $ionicPlatform, $ionicHistory, $timeout, $ocLazyLoad, $cordovaToast, ConfigService, DemoService, Help, APPCONSTANTS) {
        var defer = $q.defer();

        init();

        return defer.promise;

        function init() {
            $ionicPlatform.registerBackButtonAction(
                onHardwareBackButton,
                APPCONSTANTS.platformBackButtonPriorityView
            );

            $ionicPlatform.ready(initJPush);

            publishExternalAPI();

            var tasks = [ConfigService.loadingPromise, DemoService.initPromise];
            $q.all(tasks).finally(function() {
                defer.resolve();
            });
        }

        function publishExternalAPI () {
            var workStation = window.workStation || (window.workStation = {});

            workStation.load = $ocLazyLoad.load;

            workStation.toAppsURL = Help.toAppsURL;

            workStation.registerModule = registerModule;
        }

        function registerModule (moduleName, dependencies) {
          // Create angular module
          var module = angular.module(moduleName, dependencies || []);

          // Add the module to the AngularJS configuration file
          angular.module('WorkStation').requires.push(moduleName);

          return module;
        }

        var _confirmExit = false;
        function onHardwareBackButton(e) {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                if (_confirmExit) {
                    ionic.Platform.exitApp();
                } else {
                    _confirmExit = true;
                    $cordovaToast.showShortBottom('再按一次退出');
                    $timeout(function () {
                        _confirmExit = false;
                    }, APPCONSTANTS.exitAppConfirmTime);
                }
            }

            e.preventDefault();
            return false;
        }

        function initJPush () {
            if (!window.cordova || !window.plugins.jPushPlugin) {
                return;
            }
            document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
            document.addEventListener("jpush.openNotification", onOpenNotification, false);
            document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
            document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
            try {
                window.plugins.jPushPlugin.init();
                if (!ionic.Platform.isAndroid()) {
                    window.plugins.jPushPlugin.setDebugModeFromIos();
                    window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                } else {
                    window.plugins.jPushPlugin.setDebugMode(true);
                    window.plugins.jPushPlugin.setStatisticsOpen(true);
                }
            } catch (exception) {
                console.log(exception);
            }
        }

        function onTagsWithAlias (event) {
            try {
                var result = "result code:" + event.resultCode + " ";
                result += "tags:" + event.tags + " ";
                result += "alias:" + event.alias + " ";
                alert("onTagsWithAlias:" + result);
            } catch (exception) {
                console.log(exception);
            }
        }

        function onOpenNotification (event) {
            try {
                var alertContent;
                if (ionic.Platform.isAndroid()) {
                    alertContent = event.alert;
                } else {
                    alertContent = event.aps.alert;
                }
                alert("open Notification:" + alertContent);
            } catch (exception) {
                console.log("JPushPlugin:onOpenNotification" + exception);
            }
        }

        function onReceiveNotification (event) {
            try {
                var alertContent;
                if (ionic.Platform.isAndroid()) {
                    alertContent = event.alert;
                } else {
                    alertContent = event.aps.alert;
                }
                alert("receive Notification:" + alertContent);
            } catch (exception) {
                console.log(exception);
            }
        }

        function onReceiveMessage (event) {
            try {
                var message;
                if (ionic.Platform.isAndroid()) {
                    message = event.message;
                    window.plugins.jPushPlugin.addLocalNotification(
                        event.extras['cn.jpush.android.MSG_ID'],
                        event.message,
                        "",
                        event.extras['cn.jpush.android.MSG_ID'],
                        event.timeStamp
                    );
                } else {
                    message = event.content;
                }
                //alert("receive Message:" + message);
                alert("receive Message:" + angular.toJson(event));
            } catch (exception) {
                console.log("JPushPlugin:onReceiveMessage-->" + exception);
            }
        }
    }
]);
