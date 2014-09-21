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
    'NetworkController',
    [
        '$scope',
        '$controller',
        '$modal',
        'ModelService',
        function ($scope, $controller, $modal, ModelService) {

            $scope.networks = ModelService.getNetworks();

            $scope.$on('networks:updated', function () {
                $scope.networks = ModelService.getNetworks();
            });

            $scope.init_form = function(instance) {
                var proposed_instance = angular.copy(instance);
                $scope.errors = [];

                // launch form modal
                var modalInstance = $modal.open({
                    templateUrl: MODAL_URLS.NETWORK,
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
    'CohortController',
    [
        '$scope',
        '$controller',
        '$modal',
        'ModelService',
        function ($scope, $controller, $modal, ModelService) {

            $scope.cohorts = ModelService.getCohorts();

            $scope.$on('cohorts:updated', function () {
                $scope.cohorts = ModelService.getCohorts();
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
    'CohortDetailController',
    [
        '$scope',
        '$controller',
        '$state',
        '$stateParams',
        '$modal',
        'ModelService',
        function ($scope, $controller, $state, $stateParams, $modal, ModelService) {
            ModelService.setCurrentCohortById($stateParams.cohortId);

            $scope.notebooks = ModelService.getNotebooks();
            $scope.networks = ModelService.getNetworks();
            $scope.participants = ModelService.getParticipants();

            $scope.$on('current_cohort:updated', function () {
                $scope.current_cohort = ModelService.current_cohort;
            });
            $scope.$on('current_cohort:invalid', function () {
                // re-direct to 404
                $state.transitionTo('404');
            });
        }
    ]
);

app.controller(
    'AnalyteController',
    [
        '$scope',
        '$controller',
        '$modal',
        'ModelService',
        function ($scope, $controller, $modal, ModelService) {

            $scope.analytes = ModelService.getAnalytes();

            $scope.$on('analytes:updated', function () {
                $scope.analytes = ModelService.getAnalytes();
            });

            $scope.init_form = function(instance) {
                var proposed_instance = angular.copy(instance);
                $scope.errors = [];

                // launch form modal
                var modalInstance = $modal.open({
                    templateUrl: MODAL_URLS.ANALYTE,
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
    'ConjugateController',
    [
        '$scope',
        '$controller',
        '$modal',
        'ModelService',
        function ($scope, $controller, $modal, ModelService) {

            $scope.conjugates = ModelService.getConjugates();

            $scope.$on('conjugates:updated', function () {
                $scope.conjugates = ModelService.getConjugates();
            });

            $scope.init_form = function(instance) {
                var proposed_instance = angular.copy(instance);
                $scope.errors = [];

                // launch form modal
                var modalInstance = $modal.open({
                    templateUrl: MODAL_URLS.CONJUGATE,
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
    'BufferController',
    [
        '$scope',
        '$controller',
        '$modal',
        'ModelService',
        function ($scope, $controller, $modal, ModelService) {

            $scope.buffers = ModelService.getBuffers();

            $scope.$on('buffers:updated', function () {
                $scope.buffers = ModelService.getBuffers();
            });

            $scope.init_form = function(instance) {
                var proposed_instance = angular.copy(instance);
                $scope.errors = [];

                // launch form modal
                var modalInstance = $modal.open({
                    templateUrl: MODAL_URLS.BUFFER,
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
    'IsotypeController',
    [
        '$scope',
        '$controller',
        '$modal',
        'ModelService',
        function ($scope, $controller, $modal, ModelService) {

            $scope.isotypes = ModelService.getIsotypes();

            $scope.$on('isotypes:updated', function () {
                $scope.isotypes = ModelService.getIsotypes();
            });

            $scope.init_form = function(instance) {
                var proposed_instance = angular.copy(instance);
                $scope.errors = [];

                // launch form modal
                var modalInstance = $modal.open({
                    templateUrl: MODAL_URLS.ISOTYPE,
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
    'SampleTypeController',
    [
        '$scope',
        '$controller',
        '$modal',
        'ModelService',
        function ($scope, $controller, $modal, ModelService) {

            $scope.sample_types = ModelService.getSampleTypes();

            $scope.$on('sample_types:updated', function () {
                $scope.sample_types = ModelService.getSampleTypes();
            });

            $scope.init_form = function(instance) {
                var proposed_instance = angular.copy(instance);
                $scope.errors = [];

                // launch form modal
                var modalInstance = $modal.open({
                    templateUrl: MODAL_URLS.SAMPLE_TYPE,
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