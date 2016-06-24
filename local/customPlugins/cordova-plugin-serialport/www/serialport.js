var exec = require('cordova/exec');

exports.open = function (ports, options, success, error) {
	exec(success, error, "SerialPort", "open", [ports, options]);
};

exports.close = function () {
	exec(null, null, "SerialPort", "close", []);
};