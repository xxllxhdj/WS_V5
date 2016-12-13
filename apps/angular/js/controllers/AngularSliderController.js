angular.module('ionic')
    .controller('AngularSliderController', ['$scope', function($scope) {
        $scope.hValue = '50';
        // $scope.hOptions = {
        //     from: 1,
        //     to: 100,
        //     step: 1,
        //     dimension: ' km',
        //     css: {
        //         background: { 'background-color': 'silver' },
        //         before: { 'background-color': 'purple' },
        //         default: { 'background-color': 'white' },
        //         after: { 'background-color': 'green' },
        //         pointer: { 'background-color': 'red' }
        //     }
        // };
        $scope.hOptions = {
            from: 1,
            to: 100,
            step: 1,
            dimension: ' km',
            scale: [0, '|', 50, '|', 100]
        };

        $scope.vValue = '50';
        $scope.vOptions = {
            from: 1,
            to: 100,
            step: 1,
            dimension: ' km',
            scale: [0, '|', 50, '|', 100],
            vertical: true
        };
    }]);
