
angular.module('ionicWS')

.directive('scrollSelector', ['$timeout', '$ionicScrollDelegate', function($timeout, $ionicScrollDelegate) {
    return {
        restrict: 'E',
        scope: {
            list: '=',
            selected: '=',
            displayField: '@'
        },
        replace: true,
        template:
        '<div class="scroll-selector">' +
            '<div class="select-box">' +
            '</div>' +
            '<ion-scroll has-bouncing="true" class="scroll-selector-content" scrollbar-y="false" on-scroll="onScroll()">' +
                '<ion-list>' +
                    '<ion-item></ion-item>' +
                    '<ion-item ng-repeat="t in list">{{t[displayField]}}</ion-item>' +
                    '<ion-item></ion-item>' +
                '</ion-list>' +
            '</ion-scroll>' +
        '</div>',
        compile: function(element, attr) {
            var ionScroll = element.find('ion-scroll');

            angular.forEach({
                'delegate-handle': attr.delegateHandle
            }, function(value, name) {
                if (angular.isDefined(value)) {
                    ionScroll.attr(name, value);
                }
            });

            return { pre: prelink };

            function prelink($scope, $element, $attr) {
                var index = 0;
                var timeOut = null;
                var height = 34;

                $timeout(init);

                $scope.onScroll = function () {
                    scrolling();
                    if (timeOut) {
                        $timeout.cancel(timeOut);
                    }
                    timeOut = $timeout(scrollFinished, 260);
                };

                function init () {
                    var selected = $scope.selected,
                        len = $scope.list.length;
                    for (var i = 0; i < len; i++) {
                        if ($scope.list[i][$attr.valueField] === selected) {
                            index = i;
                            break;
                        }
                    }
                    var scrollCtrl = $ionicScrollDelegate.$getByHandle($attr.delegateHandle);
                    scrollCtrl.scrollTo(0, index * height);
                }
                function scrolling () {
                    var scrollCtrl = $ionicScrollDelegate.$getByHandle($attr.delegateHandle),
                        pos = scrollCtrl.getScrollPosition(),
                        scrollView = scrollCtrl.getScrollView();
                    if (!pos) {
                        return;
                    }
                    if (pos.top < 0 || pos.top > scrollView.__maxScrollTop) {
                        return;
                    }
                    var tmpIndex = parseInt(pos.top / height + 0.5) + 1;
                    var len = $scope.list.length + 2;
                    if (tmpIndex < 0) {
                        tmpIndex = 0;
                    }
                    if (tmpIndex >= len) {
                        tmpIndex = len - 1;
                    }
                    if (index === tmpIndex) {
                        return;
                    }
                    index = tmpIndex;
                    select();
                }
                function scrollFinished () {
                    var scrollCtrl = $ionicScrollDelegate.$getByHandle($attr.delegateHandle),
                        pos = scrollCtrl.getScrollPosition(),
                        scrollView = scrollCtrl.getScrollView();
                    if (!pos) {
                        return;
                    }
                    if (pos.top < 0 || pos.top > scrollView.__maxScrollTop) {
                        return;
                    }
                    if (pos.top % height !== 0) {
                        var index = parseInt(pos.top / height + 0.5);
                        scrollCtrl.scrollTo(0, index * height, true);
                    }
                }
                function select() {
                    var ionList = $element.find('ion-item'),
                        el;
                    angular.forEach(ionList, function (ionItem, i) {
                        el = angular.element(ionItem);
                        if (i === index) {
                            el.addClass('active');
                        } else {
                            el.removeClass('active');
                        }
                    });

                    var tmpIndex = index - 1;
                    if (tmpIndex < 0) {
                        tmpIndex = 0;
                    }
                    if (tmpIndex >= $scope.list.length) {
                        tmpIndex = $scope.list.length - 1;
                    }
                    $scope.$apply(function() {
                        $scope.selected = $scope.list[tmpIndex][$attr.valueField];
                    });
                }
            }
        }
    };
}]);