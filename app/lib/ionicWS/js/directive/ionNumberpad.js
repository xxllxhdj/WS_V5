
angular.module('ionicWS')

.directive('ionNumberpad', function() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        controller: [function() {}],
        template:
        '<div class="modal-backdrop numberpad-backdrop">' +
            '<div class="modal-backdrop-bg numberpad-backdrop-bg"></div>' +
            '<div class="modal-wrapper-bg" ng-transclude></div>' +
        '</div>'
    };
});
