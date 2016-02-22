
angular.module('WorkStation.utility')

    .constant('APPCONSTANTS', {
        appName: 'workstation',
        configFileName: 'config.txt',
        debugConfigFileURL: 'apps/config.txt',

        splashScreenExtraDelay: 1000,
        platformBackButtonPriorityView: 110,
        exitAppConfirmTime: 2000
    });