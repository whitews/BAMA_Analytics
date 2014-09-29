app.factory('ModelService', function(
        $rootScope,
        User,
        Cohort,
        Project,
        Analyte,
        Conjugate,
        Buffer,
        Isotype,
        SampleType,
        Notebook,
        Network,
        Participant,
        DataPoint) {
    var service = {};

    service.user = User.get();

    // Network services
    service.getNetworks = function() {
        return Network.query(
            {}
        );
    };

    service.createUpdateNetwork = function(instance) {
        var errors = null;
        var response;

        if (instance.id) {
            response = Network.update(
                {id: instance.id },
                instance
            );
        } else {
            response = Network.save(instance);
        }

        response.$promise.then(function () {
            // let everyone know the networks have changed
            $rootScope.$broadcast('networks:updated');
        }, function (error) {
            errors = error.data;
        });

        return errors;
    };

    // Cohort services
    service.getCohorts = function() {
        return Cohort.query(
            {}
        );
    };

    service.setCurrentCohortById = function(id) {
        service.current_cohort = Cohort.get({'id':id});
        service.current_cohort.$promise.then(function(c) {
            c.getUserPermissions().$promise.then(function (value) {
                c.permissions = value;
                $rootScope.$broadcast('current_cohort:updated');
            });
        }, function() {
            $rootScope.$broadcast('current_cohort:invalid');
        });
    };

    service.createUpdateCohort = function(instance) {
        var errors = null;
        var response;

        if (instance.id) {
            response = Cohort.update(
                {id: instance.id },
                instance
            );
        } else {
            response = Cohort.save(instance);
        }

        response.$promise.then(function () {
            // let everyone know the cohorts have changed
            $rootScope.$broadcast('cohorts:updated');
        }, function (error) {
            errors = error.data;
        });

        return errors;
    };

    //Project services
    service.getProjects = function() {
        return Project.query();
    };

    service.setCurrentProjectById = function(id) {
        service.current_project = Project.get({'id':id});
        service.current_project.$promise.then(function() {
            $rootScope.$broadcast('current_project:updated');
        }, function() {
            $rootScope.$broadcast('current_project:invalid');
        });
    };

    service.createUpdateProject = function(instance) {
        var errors = null;
        var response;

        if (instance.id) {
            response = Project.update(
                {id: instance.id },
                instance
            );
        } else {
            response = Project.save(instance);
        }

        response.$promise.then(function () {
            // let everyone know the projects have changed
            $rootScope.$broadcast('projects:updated');
        }, function (error) {
            errors = error.data;
        });

        return errors;
    };
    
    // Analyte services
    service.getAnalytes = function() {
        return Analyte.query(
            {}
        );
    };

    service.createUpdateAnalyte = function(instance) {
        var errors = null;
        var response;

        if (instance.id) {
            response = Analyte.update(
                {id: instance.id },
                instance
            );
        } else {
            response = Analyte.save(instance);
        }

        response.$promise.then(function () {
            // let everyone know the analytes have changed
            $rootScope.$broadcast('analytes:updated');
        }, function (error) {
            errors = error.data;
        });

        return errors;
    };
    
    // Conjugate services
    service.getConjugates = function() {
        return Conjugate.query(
            {}
        );
    };

    service.createUpdateConjugate = function(instance) {
        var errors = null;
        var response;

        if (instance.id) {
            response = Conjugate.update(
                {id: instance.id },
                instance
            );
        } else {
            response = Conjugate.save(instance);
        }

        response.$promise.then(function () {
            // let everyone know the conjugates have changed
            $rootScope.$broadcast('conjugates:updated');
        }, function (error) {
            errors = error.data;
        });

        return errors;
    };
    
    // Buffer services
    service.getBuffers = function() {
        return Buffer.query(
            {}
        );
    };

    service.createUpdateBuffer = function(instance) {
        var errors = null;
        var response;

        if (instance.id) {
            response = Buffer.update(
                {id: instance.id },
                instance
            );
        } else {
            response = Buffer.save(instance);
        }

        response.$promise.then(function () {
            // let everyone know the buffers have changed
            $rootScope.$broadcast('buffers:updated');
        }, function (error) {
            errors = error.data;
        });

        return errors;
    };

    // Isotype services
    service.getIsotypes = function() {
        return Isotype.query(
            {}
        );
    };

    service.createUpdateIsotype = function(instance) {
        var errors = null;
        var response;

        if (instance.id) {
            response = Isotype.update(
                {id: instance.id },
                instance
            );
        } else {
            response = Isotype.save(instance);
        }

        response.$promise.then(function () {
            // let everyone know the isotypes have changed
            $rootScope.$broadcast('isotypes:updated');
        }, function (error) {
            errors = error.data;
        });

        return errors;
    };
    
    // SampleType services
    service.getSampleTypes = function() {
        return SampleType.query(
            {}
        );
    };

    service.createUpdateSampleType = function(instance) {
        var errors = null;
        var response;

        if (instance.id) {
            response = SampleType.update(
                {id: instance.id },
                instance
            );
        } else {
            response = SampleType.save(instance);
        }

        response.$promise.then(function () {
            // let everyone know the sample_types have changed
            $rootScope.$broadcast('sample_types:updated');
        }, function (error) {
            errors = error.data;
        });

        return errors;
    };

    // Notebook services
    service.getNotebooks = function() {
        return Notebook.query(
            {}
        );
    };

    // Participant services
    service.getParticipants = function() {
        return Participant.query(
            {}
        );
    };

    // DataPoint services
    service.saveDataPoints = function(data_array) {
        return DataPoint.save(data_array);
    };

    service.getDataPoints = function(query_object) {
        return DataPoint.query(
            {
                'participant': query_object.participants || null
            }
        );
    };

    return service;
});