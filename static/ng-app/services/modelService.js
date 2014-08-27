app.factory('ModelService', function($rootScope, Cohort, Project) {
    var service = {};

    service.projects = Project.query();

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

    return service;
});