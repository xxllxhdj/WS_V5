var exec = require('cordova/exec');

exports.getAllDevices = function (success, error) {
	exec(success, error, "SerialPort", "getAllDevices", []);
};

exports.open = function (port, options, success, error) {
    options = options || {};
	exec(success, error, "SerialPort", "open", [port, options]);
};

exports.close = function () {
	exec(null, null, "SerialPort", "close", []);
};