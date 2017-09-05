angular.module('ionicdm')

.directive('ngCalendar', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            option: '=calOption'
        },
        template:
        '<div class="cal-table">' +
            '<div class="cal-row" ng-repeat="calRow in calRows">' +
                '<div class="cal-day" ng-repeat="col in calRow">' +
                    '<div>{{col.text}}</div>' +
                '</div>' +
            '</div>' +
        '</div>',
        link: function(scope, element, attrs) {
            scope.calRows = [];
            // update when charts config changes
            scope.$watch(function() {
                return scope.option;
            }, function(value) {
                if (value) {
                    refreshCalendar();
                }
            }, true);

            function refreshCalendar() {
                var opts = scope.option;
                scope.calRows = processCalendar(opts.startDate, opts.endDate);
            }

            function processCalendar(startDate, endDate) {
                var startWeekDay = startDate.getDay(),
                    calRows = [], tmpRow = [], i;
                for(i = 0; i < startWeekDay; i++) {
                    tmpRow.push({});
                }
                var tmpStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
                    tmpendDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
                    j = startWeekDay;
                while(tmpStartDate <= tmpendDate) {
                    if (j === 7) {
                        j = 0;
                        calRows.push(tmpRow);
                        tmpRow = [];
                    }
                    tmpRow.push({ text: getDateText(tmpStartDate) });
                    j++;
                    tmpStartDate = new Date(tmpStartDate.getFullYear(), tmpStartDate.getMonth(), tmpStartDate.getDate() + 1);
                }
                if (j > 0) {
                    for(i = j; i < 7; i++) {
                        tmpRow.push({});
                    }
                    calRows.push(tmpRow);
                }
                return calRows;
            }

            function getDateText(date) {
                var now = new Date();
                if ((date.getFullYear() === now.getFullYear()) &&
                    (date.getMonth() === now.getMonth()) &&
                    (date.getDate() === now.getDate())
                ) {
                    return '今';
                } else {
                    return date.getDate().toString();
                }
            }
        }
    };
});
