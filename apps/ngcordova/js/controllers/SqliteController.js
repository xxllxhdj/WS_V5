
angular.module('ngcordova')

.controller('SqliteController', ['$scope', 'Preference', 'wsDialog', function ($scope, Preference, wsDialog) {
    $scope.data = {
        strKey: '',
        strValue: '',
        numKey: '',
        numValue: null
    };

    $scope.setString = function () {
        if (!$scope.data.strKey) {
            wsDialog.tipsBottom('请输入Key');
            return;
        }
        Preference.set($scope.data.strKey, $scope.data.strValue).then(function () {
            wsDialog.tipsBottom('设置成功');
        }, function (err) {
            wsDialog.tipsBottom(err);
        });
    };
    $scope.getString = function () {
        if (!$scope.data.strKey) {
            wsDialog.tipsBottom('请输入Key');
            return;
        }
        Preference.get($scope.data.strKey).then(function (value) {
            $scope.data.strValue = value;
            wsDialog.tipsBottom('获取成功');
        }, function (err) {
            wsDialog.tipsBottom(err);
        });
    };

    $scope.setNumber = function () {
        if (!$scope.data.numKey) {
            wsDialog.tipsBottom('请输入Key');
            return;
        }
        Preference.set($scope.data.numKey, $scope.data.numValue).then(function () {
            wsDialog.tipsBottom('设置成功');
        }, function (err) {
            wsDialog.tipsBottom(err);
        });
    };
    $scope.getNumber = function () {
        if (!$scope.data.numKey) {
            wsDialog.tipsBottom('请输入Key');
            return;
        }
        Preference.get($scope.data.numKey, true).then(function (value) {
            $scope.data.numValue = value;
            wsDialog.tipsBottom('获取成功');
        }, function (err) {
            wsDialog.tipsBottom(err);
        });
    };
}]);