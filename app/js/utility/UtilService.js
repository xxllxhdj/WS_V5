
angular.module('WorkStation.utility')

    .factory('UtilService', ['$ocLazyLoad', 'APPCONSTANTS', function ($ocLazyLoad, APPCONSTANTS) {
        var o = {};

        o.getAppFileDir = function () {
            return cordova.file.externalRootDirectory || cordova.file.documentsDirectory;
        };
        o.getConfigDir = function () {
            return o.getAppFileDir() + '/' + APPCONSTANTS.appName + '/';
        };
        o.toAppsURL = function (srcURL, appId) {
            var childAppRootDir = '';
            srcURL = appId + '/' + srcURL;
            if (window.cordova && cordova.file) {
                childAppRootDir = o.getConfigDir() + 'apps/';
            } else {
                srcURL = 'apps/' + srcURL;
            }
            return childAppRootDir + srcURL;
        };
        o.loadApp = function (appId) {
            return $ocLazyLoad.load({
                name: appId,
                files: [
                    o.toAppsURL('css/style.css', appId),
                    o.toAppsURL('js/app.js', appId)
                ]
            });
        };

        return o;
    }]);