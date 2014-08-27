var URLS = {
    'COHORTS':             '/api/analytics/cohorts/',
    'PROJECTS':            '/api/analytics/projects/'
};

app.factory('Project', ['$resource', function ($resource) {
    var Project = $resource(
        URLS.PROJECTS + ':id',
        {},
        {
            update: { method: 'PUT' }
        }
    );

    return Project;
}]).factory('Cohort', ['$resource', function ($resource) {
    var Cohort = $resource(
        URLS.COHORTS + ':id',
        {},
        {
            update: { method: 'PUT' }
        }
    );

    return Cohort;
}]);