
angular.module('ngcordova')

.factory('SqliteService', ['$q', 'wsDialog', function ($q, wsDialog) {
    var sqplteDefer = $q.defer(),
        o = {
            loadPromise: sqplteDefer.promise
        };

    var _db;

    o.openDatabase = function (options) {
        var defer = $q.defer();

        if (window.sqlitePlugin) {
            _db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default'}, function () {
                defer.resolve();
            }, function (err) {
                defer.reject('打开数据库失败');
            });
        } else {
            defer.reject('请安装Sqlite插件');
        }

        return defer.promise;
    };

    init();

    return o;

    function init () {
        o.openDatabase({name: 'my.db', location: 'default'}).then(function () {

        }, function (err) {
            wsDialog.tipsBottom(err);
        }).finally(function () {
            sqplteDefer.resolve();
        });
    }
}]);