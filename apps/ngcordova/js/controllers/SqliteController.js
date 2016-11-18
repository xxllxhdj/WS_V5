
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
            wsDialog.toastBottom('请输入Key');
            return;
        }
        Preference.set($scope.data.strKey, $scope.data.strValue).then(function () {
            wsDialog.toastBottom('设置成功');
        }, function (err) {
            wsDialog.toastBottom(err);
        });
    };
    $scope.getString = function () {
        if (!$scope.data.strKey) {
            wsDialog.toastBottom('请输入Key');
            return;
        }
        Preference.get($scope.data.strKey).then(function (value) {
            $scope.data.strValue = value;
            wsDialog.toastBottom('获取成功');
        }, function (err) {
            wsDialog.toastBottom(err);
        });
    };

    $scope.setNumber = function () {
        if (!$scope.data.numKey) {
            wsDialog.toastBottom('请输入Key');
            return;
        }
        Preference.set($scope.data.numKey, $scope.data.numValue).then(function () {
            wsDialog.toastBottom('设置成功');
        }, function (err) {
            wsDialog.toastBottom(err);
        });
    };
    $scope.getNumber = function () {
        if (!$scope.data.numKey) {
            wsDialog.toastBottom('请输入Key');
            return;
        }
        Preference.get($scope.data.numKey).then(function (value) {
            $scope.data.numValue = value;
            wsDialog.toastBottom('获取成功');
        }, function (err) {
            wsDialog.toastBottom(err);
        });
    };
}]);