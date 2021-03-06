var URLS = {
    'USER':                '/api/analytics/user/',
    'ANALYTES':            '/api/analytics/analytes/',
    'CONJUGATES':          '/api/analytics/conjugates/',
    'BUFFERS':             '/api/analytics/buffers/',
    'ISOTYPES':            '/api/analytics/isotypes/',
    'SAMPLE_TYPES':        '/api/analytics/sample-types/'
};

angular.module('RESTServiceModule', []).factory('User', ['$resource', function ($resource) {
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
}]);