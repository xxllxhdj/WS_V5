(function() {
    var wsModule = angular.module('ionicWS', ['ionic']);

    wsModule
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

    wsModule
    .factory('wsToast', ['$rootScope', '$ionicModal', '$timeout', function ($rootScope, $ionicModal, $timeout) {
        return {
            /**
             * @ngdoc method
             * @name imanToast#showToast
             * @description 创建并显示toast.
             * @param {object} options 配置项如下:
             *  - `{string=}` `position` 显示位置.
             *    Default: 'bottom'
             *  - `{string=}` `duration` 延迟多久关闭.
             *    Default: 2000
             *  - `{string=}` `animation` 动画.
             *    Default: 'ws-toast-fade-in'
             *  - `{boolean=}` `backdropClickToClose` 点击backdrop是否关闭toast.
             *    Default: true.
             *  - `{boolean=}` `hardwareBackButtonClose` 点击返回键是否关闭toast，适用于Android及类似的设备
             *    Default: true.
             */
            show: showToast
        };

        function showToast (opts) {
            opts.animation = opts.animation ? opts.animation : 'ws-toast-fade-in';
            opts.duration = opts.duration !== undefined ? opts.duration : 'short';
            if (opts.duration === 'short') {
                opts.duration = 2000;
            } else if (opts.duration === 'long') {
                opts.duration = 4000;
            }

            var scope = $rootScope.$new(true);
            scope.data = {};
            scope.data.message = opts.message ? opts.message : '';

            var templateString = '<div class="ws-toast-view toast">{{data.message}}</div>';

            opts = angular.extend({
                viewType: 'toast',
                scope: scope
            }, opts || {});

            var modal = $ionicModal.fromTemplate(templateString, opts);

            if (opts.duration && angular.isNumber(opts.duration)) {
                $timeout(function () {
                    modal.hide();
                }, opts.duration);
            }

            var position = opts.position ? opts.position : 'bottom',
                block = !!opts.block,
                toastView = modal.$el.find('.ws-toast-view');
            toastView.addClass('toast-' + position);
            if (block) {
                toastView.addClass('toast-block');
            }

            scope.$on('toast.hidden', function () {
                $timeout(function() {
                    modal.scope.$destroy();
                    modal.$el.remove();
                }, modal.hideDelay || 320);
            });

            modal.show();

            return modal;
        }
    }]);
    wsModule
    .directive('ionToast', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            controller: [function() {}],
            template: 
            '<div class="toast-backdrop">' +
                '<div class="toast-wrapper" ng-transclude></div>' +
            '</div>'
        };
    });

})();
