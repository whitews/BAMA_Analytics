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

            $scope.retrieving_data = false;

            $scope.notebooks = ModelService.getNotebooks();

            $scope.analytes = ModelService.getAnalytes();
            $scope.isotypes = ModelService.getIsotypes();
            $scope.conjugates = ModelService.getConjugates();
            $scope.sample_types = ModelService.getSampleTypes();
            $scope.buffers = ModelService.getBuffers();

            $scope.$on('current_cohort:updated', function () {
                $scope.current_cohort = ModelService.current_cohort;
                $scope.participants = ModelService.getParticipants(
                    $scope.current_cohort.id
                );
            });
            $scope.$on('current_cohort:invalid', function () {
                // re-direct to 404
                $state.transitionTo('404');
            });

            $scope.data_point_columns = {
                'notebook_name': {
                    'name': 'Notebook',
                    'show': false
                },
                'participant_code': {
                    'name': 'Participant',
                    'show': true
                },
                'global_id_code': {
                    'name': 'Global ID',
                    'show': false
                },
                'visit_code': {
                    'name': 'Visit',
                    'show': true
                },
                'visit_date': {
                    'name': 'Visit Date',
                    'show': false
                },
                'assay_date': {
                    'name': 'Assay Date',
                    'show': false
                },
                'analyte_name': {
                    'name': 'Analyte',
                    'show': true
                },
                'bead_number': {
                    'name': 'Bead #',
                    'show': false
                },
                'sample_type_name': {
                    'name': 'Sample Type',
                    'show': false
                },
                'conjugate_name': {
                    'name': 'Conjugate',
                    'show': false
                },
                'isotype_name': {
                    'name': 'Isotype',
                    'show': false
                },
                'buffer_name': {
                    'name': 'Buffer',
                    'show': false
                },
                'upload_date': {
                    'name': 'Upload Date',
                    'show': false
                },
                'user': {
                    'name': 'User',
                    'show': false
                },
                'cv': {
                    'name': 'CV',
                    'show': true
                },
                'fi_minus_background': {
                    'name': 'FI-Bkgd',
                    'show': true
                },
                'fi_minus_background_blank': {
                    'name': 'FI-Bkgd-Blank',
                    'show': true
                },
                'dilution': {
                    'name': 'Dilution',
                    'show': false
                }
            };

            $scope.open_column_chooser = function (size) {

                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: ModalFormCtrl,
                    size: size,
                    resolve: {
                        instance: function () {
                            return $scope.data_point_columns;
                        }
                    }
                });

                modalInstance.result.then(function (instance) {
                    //$scope.data_point_columns = instance;
                }, function () {
                    //$log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.apply_filter = function () {
                $scope.data_points = null;
                $scope.retrieving_data = true;
                $scope.filter_errors = [];

                var participants = [];
                if ($scope.participants != null) {
                    $scope.participants.forEach(function (p) {
                        if (p.query) {
                            participants.push(p.id);
                        }
                    });
                }

                var response = ModelService.getDataPoints(
                    {
                        'cohort': $scope.current_cohort.id,
                        'participants': participants,
                        'analytes': $scope.selected_analytes,
                        'isotypes': $scope.selected_isotypes,
                        'conjugates': $scope.selected_conjugates,
                        'sample_types': $scope.selected_sample_types,
                        'buffers': $scope.selected_buffers
                    }
                );

                response.$promise.then(function () {
                    $scope.retrieving_data = false;
                    $scope.data_points = response;
                }, function (error) {
                    $scope.retrieving_data = false;
                    $scope.data_errors = error.data;
                });
            };
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