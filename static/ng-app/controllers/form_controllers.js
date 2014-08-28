app.controller(
    'ProjectEditController',
    [
        '$scope',
        '$rootScope',
        'ModelService',
        function ($scope, $rootScope, ModelService) {
            $scope.errors = null;
            $scope.create_update = function(instance) {
                $scope.errors = ModelService.createUpdateProject(instance);

                if (!$scope.errors) {
                    // close modal
                    $scope.ok();
                }
            }
        }
    ]
);