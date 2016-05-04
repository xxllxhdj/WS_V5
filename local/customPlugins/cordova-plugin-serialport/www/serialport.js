var exec = require('cordova/exec');

exports.getSerialPort = function (success, error) {
	exec(success, error, "SerialPort", "getSerialPort", []);
};

exports.openSerialPort = function (port, options, success, error) {
    options = options || {};
	exec(success, error, "SerialPort", "openSerialPort", [port, options]);
};

exports.closeSerialPort = function () {
	exec(null, null, "SerialPort", "closeSerialPort", []);
};