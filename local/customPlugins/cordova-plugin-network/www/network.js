var exec = require('cordova/exec');

exports.getInfo = function (success, error) {
	exec(success, error, "Network", "getInfo", []);
};