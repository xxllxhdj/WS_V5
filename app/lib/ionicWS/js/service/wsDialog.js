
angular.module('ionicWS')

.factory('wsDialog', ['wsToast', 'cfpLoadingBar', function (wsToast, cfpLoadingBar) {
    return {
        toastTop: toastTop,
        toastCenter: toastCenter,
        toastBottom: toastBottom,

        showLoading: showLoading,
        hideLoading: hideLoading
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

    function showLoading () {
        cfpLoadingBar.start();
    }
    function hideLoading () {
        cfpLoadingBar.complete();
    }
}]);
