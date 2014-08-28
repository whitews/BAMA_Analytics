app.factory('ModelService', function($rootScope, User, Cohort, Project) {
    var service = {};

    service.user = User.get();
    service.get_projects = function() {
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

    service.get_cohorts = function() {
        return Cohort.query(
            {}
        );
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

    return service;
});