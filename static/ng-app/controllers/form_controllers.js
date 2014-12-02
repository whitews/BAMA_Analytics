admin_app.controller(
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

admin_app.controller(
    'NetworkEditController',
    [
        '$scope',
        '$rootScope',
        'ModelService',
        function ($scope, $rootScope, ModelService) {
            $scope.errors = null;
            $scope.create_update = function(instance) {
                $scope.errors = ModelService.createUpdateNetwork(instance);

                if (!$scope.errors) {
                    // close modal
                    $scope.ok();
                }
            }
        }
    ]
);

admin_app.controller(
    'CohortEditController',
    [
        '$scope',
        '$rootScope',
        'ModelService',
        function ($scope, $rootScope, ModelService) {
            // need list of networks
            $scope.networks = ModelService.getNetworks();

            $scope.errors = null;
            $scope.create_update = function(instance) {
                $scope.errors = ModelService.createUpdateCohort(instance);

                if (!$scope.errors) {
                    // close modal
                    $scope.ok();
                }
            }
        }
    ]
);

admin_app.controller(
    'AnalyteEditController',
    [
        '$scope',
        '$rootScope',
        'ModelService',
        function ($scope, $rootScope, ModelService) {
            // need list of analytes for the subtrahend
            $scope.analytes = ModelService.getAnalytes();

            $scope.errors = null;
            $scope.create_update = function(instance) {
                $scope.errors = ModelService.createUpdateAnalyte(instance);

                if (!$scope.errors) {
                    // close modal
                    $scope.ok();
                }
            }
        }
    ]
);

admin_app.controller(
    'ConjugateEditController',
    [
        '$scope',
        '$rootScope',
        'ModelService',
        function ($scope, $rootScope, ModelService) {
            $scope.errors = null;
            $scope.create_update = function(instance) {
                $scope.errors = ModelService.createUpdateConjugate(instance);

                if (!$scope.errors) {
                    // close modal
                    $scope.ok();
                }
            }
        }
    ]
);

admin_app.controller(
    'BufferEditController',
    [
        '$scope',
        '$rootScope',
        'ModelService',
        function ($scope, $rootScope, ModelService) {
            $scope.errors = null;
            $scope.create_update = function(instance) {
                $scope.errors = ModelService.createUpdateBuffer(instance);

                if (!$scope.errors) {
                    // close modal
                    $scope.ok();
                }
            }
        }
    ]
);

admin_app.controller(
    'IsotypeEditController',
    [
        '$scope',
        '$rootScope',
        'ModelService',
        function ($scope, $rootScope, ModelService) {
            $scope.errors = null;
            $scope.create_update = function(instance) {
                $scope.errors = ModelService.createUpdateIsotype(instance);

                if (!$scope.errors) {
                    // close modal
                    $scope.ok();
                }
            }
        }
    ]
);

admin_app.controller(
    'SampleTypeEditController',
    [
        '$scope',
        '$rootScope',
        'ModelService',
        function ($scope, $rootScope, ModelService) {
            $scope.errors = null;
            $scope.create_update = function(instance) {
                $scope.errors = ModelService.createUpdateSampleType(instance);

                if (!$scope.errors) {
                    // close modal
                    $scope.ok();
                }
            }
        }
    ]
);