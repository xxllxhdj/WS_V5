
angular.module('WorkStation.services')

    .factory('ConfigService', ['$q', '$http', '$cordovaFile', 'Help', 'APPCONSTANTS', 
        function ($q, $http, $cordovaFile, Help, APPCONSTANTS) {
            var configDefer = $q.defer(),
                config = {},
                o = {
                    loadingPromise: configDefer.promise
                };

            o.loadingPromise.finally(function () {
                o.set = function (key, value) {
                    var defer = $q.defer();

                    config[key] = value;
                    writeConfigFile().then(function () {
                        defer.resolve();
                    }, function () {
                        defer.reject();
                    });

                    return defer.promise;
                };
                o.get = function (key, defaults) {
                    return config.hasOwnProperty(key) ? config[key] : (defaults || null);
                };
            });

            init();

            return o;

            function init () {
                if (window.cordova) {
                    initAppFileDir().then(function () {
                        readConfigFile().then(function (jsonData) {
                            angular.extend(config, jsonData);
                            configDefer.resolve();
                        }, function () {
                            configDefer.resolve();
                        });
                    }, function () {
                        configDefer.resolve();
                    });
                } else {
                    //configDefer.resolve();
                    $http.get(APPCONSTANTS.debugConfigFileURL).success(function (jsonData) {
                        angular.extend(config, jsonData);
                        configDefer.resolve();
                    }).error(function () {
                        configDefer.resolve();
                    });
                }

            }
            function initAppFileDir () {
                var defer = $q.defer(),
                    appFileDir = Help.getAppFileDir();
                $cordovaFile.checkDir(appFileDir, APPCONSTANTS.appName).then(function () {
                    defer.resolve();
                }, function () {
                    $cordovaFile.createDir(appFileDir, APPCONSTANTS.appName, false).finally(function () {
                        defer.resolve();
                    });
                });

                return defer.promise;
            }
            function readConfigFile () {
                var defer = $q.defer(),
                    configFileDir = Help.getConfigDir();
                $cordovaFile.checkFile(configFileDir, APPCONSTANTS.configFileName).then(function () {
                    $cordovaFile.readAsText(configFileDir, APPCONSTANTS.configFileName).then(function (data) {
                        defer.resolve(angular.fromJson(data));
                    }, function () {
                        defer.resolve({});
                    });
                }, function () {
                    defer.resolve({});
                });

                return defer.promise;
            }
            function writeConfigFile () {
                var defer = $q.defer();

                if (window.cordova) {
                    $cordovaFile.writeFile(Help.getConfigDir(), APPCONSTANTS.configFileName, angular.toJson(config), true).then(function () {
                        defer.resolve();
                    }, function () {
                        defer.reject();
                    });
                } else {
                    defer.resolve();
                }

                return defer.promise;
            }
        }
    ]);