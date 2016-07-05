
angular.module('ngcordova')

.controller('SqliteController', ['$scope', 'Preference', function ($scope, Preference) {
    Preference.get('test').finally(function () {
        Preference.set('test', 'test').finally(function () {
            Preference.get('test');
        });
    });
}]);