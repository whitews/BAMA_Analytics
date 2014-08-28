var URLS = {
    'USER':                '/api/analytics/user/',
    'COHORTS':             '/api/analytics/cohorts/',
    'PROJECTS':            '/api/analytics/projects/',
    'ANALYTES':            '/api/analytics/analytes/'
};

app.factory('User', ['$resource', function ($resource) {
    var User = $resource(
        URLS.USER + ':username',
        {
            username: '@username'
        },
        {
            is_user: {method: 'GET'}
        }
    );

    return User;
}]).factory('Project', ['$resource', function ($resource) {
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
}]).factory('Analyte', ['$resource', function ($resource) {
    var Analyte = $resource(
        URLS.ANALYTES + ':id',
        {},
        {
            update: { method: 'PUT' }
        }
    );

    return Analyte;
}]);