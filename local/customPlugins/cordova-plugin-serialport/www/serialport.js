var exec = require('cordova/exec');

exports.getSerialPort = function(success, error) {
	exec(success, error, "SerialPort", "getSerialPort", []);
};

exports.openSerialPort = function(port, baudrate, success, error) {
	exec(success, error, "SerialPort", "openSerialPort", [port, baudrate]);
};

exports.closeSerialPort = function() {
	exec(null, null, "SerialPort", "closeSerialPort", []);
};