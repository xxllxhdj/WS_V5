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
                scope.calRows = processCalendar(opts.start, opts.end);
            }

            function processCalendar(start, end) {
                var startWeekDay = start.getDay(),
                    calRows = [], tmpRow = [], i;
                for(i = 0; i < startWeekDay; i++) {
                    tmpRow.push({});
                }
                var tmpStart = new Date(start.getFullYear(), start.getMonth(), start.getDate()),
                    tmpEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate()),
                    j = startWeekDay;
                while(tmpStart <= tmpEnd) {
                    if (j === 7) {
                        j = 0;
                        calRows.push(tmpRow);
                        tmpRow = [];
                    }
                    tmpRow.push({ text: getDateText(tmpStart) });
                    j++;
                    tmpStart.setDate(tmpStart.getDate() + 1);
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
