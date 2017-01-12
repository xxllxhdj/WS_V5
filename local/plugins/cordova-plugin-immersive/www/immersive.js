var exec = require('cordova/exec');

exports.getImmersive = function (success, error) {
    exec(success, error, "Immersive", "getImmersive", []);
};