
angular.module('ionicWS')

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