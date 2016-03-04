
angular.module('WorkStation.utility')

    .constant('APPCONSTANTS', {
        appName: 'workstation',
        configFileName: 'config.txt',
        debugConfigFileURL: 'apps/config.txt',

        splashScreenExtraDelay: 800,
        platformBackButtonPriorityView: 110,
        exitAppConfirmTime: 2000,

        appNumPerPage: 9
    });