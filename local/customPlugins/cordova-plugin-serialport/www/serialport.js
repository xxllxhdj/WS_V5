var exec = require('cordova/exec');

exports.getSerialPort = function(success, error) {
	exec(success, error, "SerialPort", "getSerialPort", []);
};