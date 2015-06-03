angular.module('ModelServiceModule', ['RESTServiceModule']).factory('ModelService', function(
        $rootScope,
        User,
        Analyte,
        Conjugate,
        Buffer,
        Isotype,
        SampleType) {
    var service = {};

    service.getUser = function () {
        return User.get();
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

    return service;
});