app.factory('ModelService', function($rootScope, User, Cohort, Project) {
    var service = {};

    service.user = User.get();

    // Cohort services
    service.getCohorts = function() {
        return Cohort.query(
            {}
        );
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

    return service;
});