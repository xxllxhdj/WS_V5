(function() {
    var wsModule = angular.module('ionicWS', ['ionic']);

    wsModule.factory('wsDialog', ['wsTips', function (wsTips) {
        return {
            tipsTop: tipsTop,
            tipsCenter: tipsCenter,
            tipsBottom: tipsBottom
        };
        function tipsTop (tips, missable) {
            var config = {
                content: tips,
                position: 'top',
                dismissable: !missable
            };
            if (!missable) {
                config.duration = 1500;
            }
            wsTips.show(config);
        }
        function tipsCenter (tips, missable) {
            var config = {
                content: tips,
                position: 'center',
                dismissable: !missable
            };
            if (!missable) {
                config.duration = 1500;
            }
            wsTips.show(config);
        }
        function tipsBottom (tips, missable) {
            var config = {
                content: tips,
                position: 'bottom',
                dismissable: !missable
            };
            if (!missable) {
                config.duration = 1500;
            }
            wsTips.show(config);
        }
    }]);

    var TIPS_TPL =
        '<div class="popup-container ws-tips-container" ng-class="cssClass">' +
            '<div class="popup ws-tips">' +
                '<div class="ws-tips-wrapper">' +
                    '<div class="popup-body">' +
                '</div>' +
            '</div>' +
        '</div>';
    wsModule.factory('wsTips', [
        '$ionicTemplateLoader',
        '$q',
        '$document',
        '$timeout',
        '$rootScope',
        '$ionicBody',
        '$compile',
        '$ionicPlatform',
        'IONIC_BACK_PRIORITY',
        function($ionicTemplateLoader, $q, $document, $timeout, $rootScope, $ionicBody, $compile, $ionicPlatform, IONIC_BACK_PRIORITY) {

            var config = {
                stackPushDelay: 75
            };
            var popupStack = [];

            var ionicwsTips = {
                show: showPopup,

                _createPopup: createPopup,
                _popupStack: popupStack
            };

            return ionicwsTips;

            function createPopup(options) {
                options = angular.extend({
                    scope: null
                }, options || {});

                var self = {};
                self.scope = (options.scope || $rootScope).$new();
                self.element = angular.element(TIPS_TPL);
                self.responseDeferred = $q.defer();

                $ionicBody.get().appendChild(self.element[0]);
                $compile(self.element)(self.scope);

                var cssClass = options.cssClass || '';
                if (options.position === 'top') {
                    cssClass += ' ws-tips-top';
                } else if (options.position === 'bottom') {
                    cssClass += ' ws-tips-bottom';
                }
                angular.extend(self.scope, {
                    cssClass: cssClass,
                    dismissable: !!options.dismissable,
                    buttonTapped: function(event) {
                        event = event.originalEvent || event; //jquery events

                        if (!event.defaultPrevented) {
                            self.responseDeferred.resolve(true);
                        }
                    }
                });

                $q.when(
                    options.templateUrl ?
                    $ionicTemplateLoader.load(options.templateUrl) :
                    (options.template || options.content || '')
                ).then(function(template) {
                    var popupBody = angular.element(self.element[0].querySelector('.popup-body'));
                    if (template) {
                        popupBody.html(template);
                        $compile(popupBody.contents())(self.scope);
                    } else {
                        popupBody.remove();
                    }
                });

                var onDocClick = function() {
                    if (!self.isShown || self.removed) {
                        return;
                    }
                    self.responseDeferred.resolve(true);
                };
                self.scope.$on('$destroy', function() {
                    $document.unbind('click', onDocClick);
                });
                $document.bind('click', onDocClick);

                self.show = function() {
                    if (self.isShown || self.removed) {
                        return;
                    }

                    self.isShown = true;
                    ionic.requestAnimationFrame(function() {
                        //if hidden while waiting for raf, don't show
                        if (!self.isShown) {
                            return;
                        }

                        self.element.removeClass('popup-hidden');
                        self.element.addClass('popup-showing active');
                    });
                };

                self.hide = function(callback) {
                    callback = callback || angular.noop;
                    if (!self.isShown) {
                        return callback();
                    }

                    self.isShown = false;
                    self.element.removeClass('active');
                    self.element.addClass('popup-hidden');
                    $timeout(callback, 250, false);
                };

                self.remove = function() {
                    if (self.removed) {
                        return;
                    }

                    self.hide(function() {
                        self.element.remove();
                        self.scope.$destroy();
                    });

                    self.removed = true;
                };

                return self;
            }

            function onHardwareBackButton() {
                var last = popupStack[popupStack.length - 1];
                if (last) {
                    last.responseDeferred.resolve();
                }
            }

            function showPopup(options) {
                var popup = ionicwsTips._createPopup(options);
                var showDelay = 0;

                if (popupStack.length > 0) {
                    popupStack[popupStack.length - 1].hide();
                    showDelay = config.stackPushDelay;
                } else {
                    //Add popup-open & backdrop if this is first popup
                    $ionicBody.addClass('popup-open');
                    //only show the backdrop on the first popup
                    ionicwsTips._backButtonActionDone = $ionicPlatform.registerBackButtonAction(
                        onHardwareBackButton,
                        IONIC_BACK_PRIORITY.popup
                    );
                }

                // Expose a 'close' method on the returned promise
                popup.responseDeferred.promise.close = function popupClose(result) {
                    if (!popup.removed) {
                        popup.responseDeferred.resolve(result);
                    }
                };
                //DEPRECATED: notify the promise with an object with a close method
                popup.responseDeferred.notify({ close: popup.responseDeferred.close });

                doShow();

                return popup.responseDeferred.promise;

                function doShow() {
                    popupStack.push(popup);
                    $timeout(function() {
                        popup.show();
                        if (options.dismissable) {
                            $timeout(function() {
                                popup.responseDeferred.resolve(true);
                            }, options.duration || 3000);
                        }
                    }, showDelay, false);

                    popup.responseDeferred.promise.then(function(result) {
                        var index = popupStack.indexOf(popup);
                        if (index !== -1) {
                            popupStack.splice(index, 1);
                        }

                        if (popupStack.length > 0) {
                            popupStack[popupStack.length - 1].show();
                        } else {
                            //Remove popup-open & backdrop if this is last popup
                            $timeout(function() {
                                // wait to remove this due to a 300ms delay native
                                // click which would trigging whatever was underneath this
                                if (!popupStack.length) {
                                    $ionicBody.removeClass('popup-open');
                                }
                            }, 400, false);
                            (ionicwsTips._backButtonActionDone || angular.noop)();
                        }

                        popup.remove();

                        return result;
                    });
                }
            }
        }
    ]);
})();
