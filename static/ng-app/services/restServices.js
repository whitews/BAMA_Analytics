var URLS = {
    'USER':                '/api/analytics/user/',
    'COHORTS':             '/api/analytics/cohorts/',
    'PROJECTS':            '/api/analytics/projects/',
    'ANALYTES':            '/api/analytics/analytes/',
    'CONJUGATES':          '/api/analytics/conjugates/',
    'BUFFERS':             '/api/analytics/buffers/',
    'ISOTYPES':            '/api/analytics/isotypes/',
    'SAMPLE_TYPES':        '/api/analytics/sample-types/',
    'NOTEBOOKS':           '/api/analytics/notebooks/',
    'NETWORKS':            '/api/analytics/networks/',
    'PARTICIPANTS':        '/api/analytics/participants/',
    'DATAPOINTS':          '/api/analytics/data-points/'
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
}]).factory('Network', ['$resource', function ($resource) {
    var Network = $resource(
        URLS.NETWORKS + ':id',
        {},
        {
            update: { method: 'PUT' }
        }
    );

    return Network;
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

    Cohort.prototype.getUserPermissions = function() {
        var perms = $resource(
            URLS.COHORTS + this.id + '/permissions/',
            {},
            {
                get: {
                    isArray: false
                }
            }
        );
        return perms.get();
    };

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
}]).factory('Conjugate', ['$resource', function ($resource) {
    var Conjugate = $resource(
        URLS.CONJUGATES + ':id',
        {},
        {
            update: { method: 'PUT' }
        }
    );

    return Conjugate;
}]).factory('Buffer', ['$resource', function ($resource) {
    var Buffer = $resource(
        URLS.BUFFERS + ':id',
        {},
        {
            update: { method: 'PUT' }
        }
    );

    return Buffer;
}]).factory('Isotype', ['$resource', function ($resource) {
    var Isotype = $resource(
        URLS.ISOTYPES + ':id',
        {},
        {
            update: { method: 'PUT' }
        }
    );

    return Isotype;
}]).factory('SampleType', ['$resource', function ($resource) {
    var SampleType = $resource(
        URLS.SAMPLE_TYPES + ':id',
        {},
        {
            update: { method: 'PUT' }
        }
    );

    return SampleType;
}]).factory('Notebook', ['$resource', function ($resource) {
    return $resource(URLS.NOTEBOOKS, {});
}]).factory('Participant', ['$resource', function ($resource) {
    return $resource(URLS.PARTICIPANTS, {});
}]).factory('DataPoint', ['$resource', function ($resource) {
    var DataPoint = $resource(
        URLS.DATAPOINTS,
        {},
        {
            save: {
                method: 'POST',
                isArray: true
            }
        }
    );

    return DataPoint;
}]);