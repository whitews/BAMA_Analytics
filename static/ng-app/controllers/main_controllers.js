var ModalFormCtrl = function ($scope, $modalInstance, instance) {
    $scope.instance = instance;
    $scope.ok = function () {
        $modalInstance.close();
    };
};

app.controller(
    'MainController',
    ['$scope', function ($scope) {
        // reserved for site wide functions
    }
]);

app.controller(
    'ProjectListController',
    [
        '$scope',
        '$controller',
        '$modal',
        'ModelService',
        function ($scope, $controller, $modal, ModelService) {
            $scope.projects = ModelService.projects;
        }
    ]
);

app.controller(
    'ProjectDetailController',
    [
        '$scope',
        '$controller',
        '$state',
        '$stateParams',
        '$modal',
        'ModelService',
        function ($scope, $controller, $state, $stateParams, $modal, ModelService) {
            ModelService.setCurrentProjectById($stateParams.projectId);
            $scope.$on('current_project:updated', function () {
                $scope.current_project = ModelService.current_project;
            });
            $scope.$on('current_project:invalid', function () {
                // re-direct to 404
                $state.transitionTo('404');
            });
        }
    ]
);