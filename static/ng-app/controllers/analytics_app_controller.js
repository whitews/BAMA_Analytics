var ModalCtrl = function ($scope, $modalInstance, instance) {
    $scope.instance = instance;
    $scope.ok = function () {
        $modalInstance.close();
    };
};

analytics_app.controller(
    'AnalyticsAppController',
    ['$scope', 'ModelService', function ($scope, ModelService) {

    }
]);