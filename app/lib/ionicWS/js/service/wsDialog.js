
angular.module('ionicWS')

.factory('wsDialog', ['wsToast', function (wsToast) {
    return {
        tipsTop: tipsTop,
        tipsCenter: tipsCenter,
        tipsBottom: tipsBottom
    };
    function tipsTop (tips) {
        return wsToast.show({
            message: tips,
            position: 'top',
            duration: 'short'
        });
    }
    function tipsCenter (tips) {
        return wsToast.show({
            message: tips,
            position: 'center',
            duration: 'short'
        });
    }
    function tipsBottom (tips) {
        return wsToast.show({
            message: tips,
            position: 'bottom',
            duration: 'short'
        });
    }
}]);