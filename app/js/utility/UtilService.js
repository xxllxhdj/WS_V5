
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
                childAppRootDir = o.getConfigDir();
            } else {
                srcURL = appId + '/' + srcURL;
            }
            return childAppRootDir + 'apps/' + srcURL;
        };
        o.loadApp = function (appId) {
            return $ocLazyLoad.load({
                name: appId,
                files: [
                    o.toAppsURL('js/main.js', appId),
                    o.toAppsURL('css/main.css', appId)
                ]
            });
        };

        return o;
    }]);