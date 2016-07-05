
angular.module('ngcordova')

.factory('Preference', ['$q', 'wsDialog', function ($q, wsDialog) {
    var prefDefer = $q.defer(),
        o = {
            loadPromise: prefDefer.promise
        };

    var _db;

    o.set = function (key, value) {
        if (!angular.isString(value)) {
            value = angular.toJson(value);
        }
        return upset(key, value);
    };
    o.get = function (key, notString) {
        var defer = $q.defer();

        find(key).then(function (resultSet) {
            if (resultSet.rows.length > 0) {
                var value = resultSet.rows.item(0).value;
                if (notString) {
                    value = angular.fromJson(value);
                }
                defer.resolve(value);
            } else {
                defer.reject('没有找到该参数');
            }
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    };

    init();

    return o;

    function init () {
        openDatabase({name: 'my.db', location: 'default'}).then(function () {
            return executeSql('CREATE TABLE IF NOT EXISTS Preference (key text primary key, value text)');
        }).then(function () {}, function (err) {
            if (err) {
                wsDialog.tipsBottom(err);
            }
        }).finally(function () {
            prefDefer.resolve();
        });
    }

    function openDatabase (options) {
        var defer = $q.defer();

        if (window.sqlitePlugin) {
            _db = window.sqlitePlugin.openDatabase(options, function () {
                defer.resolve();
            }, function (err) {
                defer.reject('打开数据库失败');
            });
        } else {
            defer.reject('请安装Sqlite插件');
        }

        return defer.promise;
    }
    function insert (key, value) {
        var sql = "INSERT INTO Preference (key, value) VALUES (?,?)";
        return executeSql(sql, [key, value]);
    }
    function upset (key, value) {
        var sql = "REPLACE INTO Preference (key, value) VALUES (?,?)";
        return executeSql(sql, [key, value]);
    }
    function find (key) {
        var sql = "SELECT value FROM Preference WHERE key = ?";
        return executeSql(sql, [key]);
    }
    function update (key, value) {
        var sql = "UPDATE Preference SET value = ? WHERE key = ?";
        return executeSql(sql, [value, key]);
    }
    function executeSql (sql, values) {
        var defer = $q.defer();

        if (!_db) {
            defer.reject('未打开数据库');
            return defer.promise;
        }
        _db.executeSql(sql, values, function (resultSet) {
            defer.resolve(resultSet);
        }, function () {
            defer.reject('执行数据库操作失败');
        });

        return defer.promise;
    }
}]);