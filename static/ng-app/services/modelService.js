app.factory('ModelService', function($rootScope, User, Cohort, Project) {
    var service = {};

    service.user = User.get();
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