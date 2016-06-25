
angular.module('ngcordova')

.controller('SqliteController', ['$scope', 'Help', function ($scope, Help) {
	var db;
	$scope.$on('$ionicView.afterEnter', function () {
		if (window.sqlitePlugin) {
			db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default'}, function () {
				alert('打开数据库成功');
				db.sqlBatch([
					'DROP TABLE IF EXISTS MyTable',
					'CREATE TABLE MyTable (SampleColumn)',
					[ 'INSERT INTO MyTable VALUES (?)', ['test-value'] ],
				], function() {
					db.executeSql('SELECT * FROM MyTable', [], function (resultSet) {
						alert('Sample column value: ' + resultSet.rows.item(0).SampleColumn);
					});
				}, function(error) {
				  	alert('Populate table error: ' + error.message);
				});
			}, function (err) {
				alert(angular.toJson(err));
			});
		}
	});
}]);