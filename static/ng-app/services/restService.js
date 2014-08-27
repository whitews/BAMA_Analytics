var URLS = {
    'PROJECTS':            '/api/analytics/projects/'
};

var service = angular.module('AnalyticsApp');

service
    .factory('Project', ['$resource', function ($resource) {
        var Project = $resource(
            URLS.PROJECTS + ':id',
            {},
            {
                update: { method: 'PUT' }
            }
        );

        return Project;
    }]);