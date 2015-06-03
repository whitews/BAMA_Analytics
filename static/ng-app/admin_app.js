var MODAL_URLS = {
    'ANALYTE':            '/static/ng-app/partials/forms/analyte-form.html',
    'CONJUGATE':          '/static/ng-app/partials/forms/conjugate-form.html',
    'BUFFER':             '/static/ng-app/partials/forms/buffer-form.html',
    'SAMPLE_TYPE':        '/static/ng-app/partials/forms/sample-type-form.html',
    'ISOTYPE':            '/static/ng-app/partials/forms/isotype-form.html',

    // delete modals
    'ANALYTE_DELETE':     '/static/ng-app/partials/forms/analyte-delete.html',
    'CONJUGATE_DELETE':   '/static/ng-app/partials/forms/conjugate-delete.html',
    'BUFFER_DELETE':      '/static/ng-app/partials/forms/buffer-delete.html',
    'SAMPLE_TYPE_DELETE': '/static/ng-app/partials/forms/sample-type-delete.html',
    'ISOTYPE_DELETE':     '/static/ng-app/partials/forms/isotype-delete.html'
};

var admin_app = angular.module(
    'AnalyticsAdmin',
    [
        'ngSanitize',
        'ngCookies',
        'ngResource',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'ui.select2',
        'ncy-angular-breadcrumb',
        'angularFileUpload',
        'ModelServiceModule'
    ]
);

admin_app.factory('LoginRedirectInterceptor', function($q, $window) {
    return {
        responseError: function(rejection) {
            if (rejection.status == 401) {
                $window.location.assign('/login');
            } else {
                return $q.reject(rejection);
            }
        }
    };
});

admin_app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('LoginRedirectInterceptor');

    $urlRouterProvider.when("", "/");
    $urlRouterProvider.otherwise("/");

    $stateProvider.state({
        name: 'admin',
        url: '/',
        views: {
            '@': {
                templateUrl: '/static/ng-app/partials/admin.html',
                controller: 'AdminController'
            }
        },
        data: {
            ncyBreadcrumbLabel: 'Admin'
        }
     }).state({
        name: '404',
        url: '^',
        parent: 'home',
        views: {
            '@': {
                templateUrl: '/static/ng-app/partials/404.html'
            }
        },
        data: {
            ncyBreadcrumbLabel: ': ('
        }
    }).state({
        name: 'analyte-list',
        parent: 'admin',
        url: 'analytes/',
        views: {
            '@': {
                templateUrl: '/static/ng-app/partials/analyte-list.html',
                controller: 'AnalyteController'
            }
        },
        data: {
            ncyBreadcrumbLabel: 'Analytes'
        }
    }).state({
        name: 'conjugate-list',
        parent: 'admin',
        url: 'conjugates/',
        views: {
            '@': {
                templateUrl: '/static/ng-app/partials/conjugate-list.html',
                controller: 'ConjugateController'
            }
        },
        data: {
            ncyBreadcrumbLabel: 'Conjugates'
        }
    }).state({
        name: 'buffer-list',
        parent: 'admin',
        url: 'buffers/',
        views: {
            '@': {
                templateUrl: '/static/ng-app/partials/buffer-list.html',
                controller: 'BufferController'
            }
        },
        data: {
            ncyBreadcrumbLabel: 'Buffers'
        }
    }).state({
        name: 'isotype-list',
        parent: 'admin',
        url: 'isotypes/',
        views: {
            '@': {
                templateUrl: '/static/ng-app/partials/isotype-list.html',
                controller: 'IsotypeController'
            }
        },
        data: {
            ncyBreadcrumbLabel: 'Isotypes'
        }
    }).state({
        name: 'sample-type-list',
        parent: 'admin',
        url: 'sample-types/',
        views: {
            '@': {
                templateUrl: '/static/ng-app/partials/sample-type-list.html',
                controller: 'SampleTypeController'
            }
        },
        data: {
            ncyBreadcrumbLabel: 'SampleTypes'
        }
    });
});

admin_app.run(function ($http, $cookies) {
    $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
});