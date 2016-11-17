
angular.module('ionicWS')

.factory('wsDialog', ['wsToast', function (wsToast) {
    return {
        toastTop: toastTop,
        toastCenter: toastCenter,
        toastBottom: toastBottom
    };
    function toastTop (tips) {
        return wsToast.show({
            message: tips,
            position: 'top',
            duration: 'short'
        });
    }
    function toastCenter (tips) {
        return wsToast.show({
            message: tips,
            position: 'center',
            duration: 'short'
        });
    }
    function toastBottom (tips) {
        return wsToast.show({
            message: tips,
            position: 'bottom',
            duration: 'short'
        });
    }
}]);