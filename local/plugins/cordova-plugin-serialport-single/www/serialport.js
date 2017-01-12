var exec = require('cordova/exec');

exports.getAllDevices = function (success, error) {
	exec(success, error, "SerialPort", "getAllDevices", []);
};

exports.open = function (options, success, error) {
	exec(success, error, "SerialPort", "open", [options]);
};

exports.close = function () {
	exec(null, null, "SerialPort", "close", []);
};