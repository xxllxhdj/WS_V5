angular.module('ionicdm')

.directive('ngCalendar', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            section: '=calSection',
            option: '=calOption',
            select: '&calSelect'
        },
        template:
        '<div class="cal-table">' +
            '<div class="cal-row" ng-repeat="calRow in calRows">' +
                '<div class="cal-day" ng-repeat="col in calRow" ng-class="{selected: col.selected, abnormal: col.abnormal}">' +
                    '<div ng-if="col.date">' +
                        '<div>{{col.text}}</div>' +
                        '<div class="checkbox cal-checkbox" ng-if="checkable">' +
                            '<input type="checkbox" ng-model="col.selected" ng-change="selectChange(col)">' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>',
        link: function(scope, element, attrs) {
            scope.calRows = [];
            scope.checkable = false;

            var _lastSelectCol;
            var _calObj = {};
            var _selectDates = [];

            scope.$watch(function() {
                return scope.section;
            }, function(value) {
                if (value) {
                    redrawCalendar();
                }
            }, true);

            scope.$watch(function() {
                return scope.option;
            }, function(opts) {
                if (opts) {
                    refreshOption();
                }
            }, true);

            scope.selectChange = function(col) {
                var selectType = scope.option.selectType,
                    lastSelectCol = _lastSelectCol;

                _lastSelectCol = col;

                if (selectType === 0) { // 单选
                    if (col.selected) {
                        if (lastSelectCol) {
                            lastSelectCol.selected = false;
                        }
                        _selectDates = [new Date(col.date)];
                    } else {
                        _selectDates = [];
                    }
                } else if (selectType === 1) { // 多选
                    _selectDates = [];
                    angular.forEach(scope.calRows, function(calRow) {
                        angular.forEach(calRow, function(col) {
                            if (col.selected) {
                                _selectDates.push(new Date(col.date));
                            }
                        });
                    });
                } else if (selectType === 2) { // 连选
                    if (!lastSelectCol) {
                        var tmpSelect = col.selected;
                        for(var i = _selectDates.length - 1; i >= 0; i--) {
                            if (_selectDates[i].getTime() === col.date.getTime()) {
                                tmpSelect = true;
                                break;
                            }
                        }
                        uncheckAll();
                        col.selected = tmpSelect;
                        _selectDates = [];
                        return;
                    }
                    if (lastSelectCol === col) {
                        _lastSelectCol = null;
                        return;
                    }
                    var startDate, endDate;
                    if (col.date > lastSelectCol.date) {
                        startDate = new Date(lastSelectCol.date);
                        endDate = new Date(col.date);
                    } else {
                        startDate = new Date(col.date);
                        endDate = new Date(lastSelectCol.date);
                    }
                    uncheckAll();
                    while(startDate <= endDate) {
                        _selectDates.push(new Date(startDate));
                        _calObj[startDate].selected = true;
                        startDate.setDate(startDate.getDate() + 1);
                    }
                    _lastSelectCol = null;
                }
                scope.select({ dates: _selectDates });
            };

            function redrawCalendar() {
                var section = scope.section;
                scope.calRows = processCalendar(section.start, section.end);
            }

            function refreshOption() {
                var opts = scope.option;
                // 更新选择项
                scope.checkable = opts.selectType !== -1;
                uncheckAll();
                _selectDates = [];
                _lastSelectCol = null;
            }

            function processCalendar(start, end) {
                if (!angular.isDate(start) || !angular.isDate(end)) {
                    return;
                }
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
                    var d = new Date(tmpStart);
                    _calObj[d] = { date: new Date(tmpStart), text: getDateText(tmpStart), marks: [] };
                    tmpRow.push(_calObj[d]);
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

            function uncheckAll() {
                angular.forEach(scope.calRows, function(calRow) {
                    angular.forEach(calRow, function(col) {
                        col.selected = false;
                    });
                });
            }
        }
    };
});
