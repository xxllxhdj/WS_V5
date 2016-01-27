
angular.module('WorkStation.utility')

    .factory('UtilService', ['APPCONSTANTS', function (APPCONSTANTS) {
        var o = {};

        o.getAppFileDir = function () {
            return cordova.file.externalRootDirectory || cordova.file.documentsDirectory;
        };
        o.getConfigDir = function () {
            return o.getAppFileDir() + '/' + APPCONSTANTS.appName + '/';
        };

        return o;
    }]);