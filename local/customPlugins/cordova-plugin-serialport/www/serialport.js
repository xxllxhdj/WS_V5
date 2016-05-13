var exec = require('cordova/exec');

exports.open = function (baudrate, parser, success, error) {
	exec(success, error, "SerialPort", "open", [baudrate, parser]);
};

exports.close = function () {
	exec(null, null, "SerialPort", "close", []);
};