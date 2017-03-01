
angular.module('ionicWS')

.factory('wsNumberpad', ['$q', '$rootScope', '$ionicModal', '$timeout', function ($q, $rootScope, $ionicModal, $timeout) {
    return {
        /**
         * @ngdoc method
         * @name wsNumberpad#show
         * @description 创建并显示Numberpad.
         * @param {object} options 配置项如下:
         *  - `{string=}` `animation` 动画.
         *    Default: 'im-toast-fade-in'
         *  - `{boolean=}` `backdropClickToClose` 点击backdrop是否关闭toast.
         *    Default: true.
         *  - `{boolean=}` `hardwareBackButtonClose` 点击返回键是否关闭toast，适用于Android及类似的设备
         *    Default: true.
         */
        show: showNumberpad
    };

    function showNumberpad(opts) {
        var defer = $q.defer();

        var scope = $rootScope.$new(true);
        scope.value = opts.value ? opts.value : '';

        scope.keyss = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

        var templateString =
        '<div class="ws-numberpad-view numberpad">' +
            '<div class="numberpad-hd">' +
                '<button class="button button-clear">取消</button>' +
                '<button class="button button-clear">确认</button>' +
            '</div>' +
            '<div class="item item-icon-right numberpad-dp">' +
                '<i class="icon ion-backspace-outline"></i>' +
                '{{value}}' +
            '</div>' +
            '<div class="numberpad-bd">' +
                '<div class="row" ng-repeat="keys in keyss">' +
                    '<div class="col button" ng-repeat="key in keys">{{key}}</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col button">.</div>' +
                    '<div class="col button">0</div>' +
                    '<div class="col button">C</div>' +
                '</div>' +
            '</div>' +
        '</div>';

        var modal = $ionicModal.fromTemplate(templateString, {
            viewType: 'numberpad',
            animation: 'slide-in-up',
            scope: scope
        });

        scope.$on('numberpad.hidden', function () {
            $timeout(function() {
                modal.scope.$destroy();
                modal.$el.remove();
            }, modal.hideDelay || 320);
        });

        modal.show();

        return defer.promise;
    }
}]);
