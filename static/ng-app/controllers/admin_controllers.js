var ModalFormCtrl = function ($scope, $modalInstance, instance) {
    $scope.instance = instance;
    $scope.ok = function () {
        $modalInstance.close();
    };
};

app.controller(
    'AdminController',
    ['$scope', '$modal', function ($scope, $modal) {
        $scope.init_form = function(instance, form_type) {
            var proposed_instance = angular.copy(instance);
            $scope.errors = [];

            // launch form modal
            var modalInstance = $modal.open({
                templateUrl: MODAL_URLS[form_type],
                controller: ModalFormCtrl,
                resolve: {
                    instance: function() {
                        return proposed_instance;
                    }
                }
            });
        };
    }
]);

app.controller(
    'CohortController',
    [
        '$scope',
        '$controller',
        '$modal',
        'ModelService',
        function ($scope, $controller, $modal, ModelService) {

            $scope.cohorts = ModelService.get_cohorts();

            $scope.$on('cohorts:updated', function () {
                $scope.cohorts = ModelService.get_cohorts();
            });

            $scope.init_form = function(instance) {
                var proposed_instance = angular.copy(instance);
                $scope.errors = [];

                // launch form modal
                var modalInstance = $modal.open({
                    templateUrl: MODAL_URLS.COHORT,
                    controller: ModalFormCtrl,
                    resolve: {
                        instance: function() {
                            return proposed_instance;
                        }
                    }
                });
            };
        }
    ]
);

app.controller(
    'CohortEditController',
    [
        '$scope',
        '$rootScope',
        '$controller',
        'ModelService',
        function ($scope, $rootScope, $controller, ModelService) {

        }
    ]
);