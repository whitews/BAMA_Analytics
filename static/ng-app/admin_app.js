var MODAL_URLS = {
    'USER':               'static/ng-app/partials/forms/user-form.html',
    'NETWORK':            'static/ng-app/partials/forms/network-form.html',
    'COHORT':             'static/ng-app/partials/forms/cohort-form.html',
    'PARTICIPANT':        'static/ng-app/partials/forms/participant-form.html',
    'PROJECT':            'static/ng-app/partials/forms/project-form.html',
    'ANALYTE':            'static/ng-app/partials/forms/analyte-form.html',
    'CONJUGATE':          'static/ng-app/partials/forms/conjugate-form.html',
    'BUFFER':             'static/ng-app/partials/forms/buffer-form.html',
    'SAMPLE_TYPE':        'static/ng-app/partials/forms/sample-type-form.html',
    'ISOTYPE':            'static/ng-app/partials/forms/isotype-form.html',

    // delete modals
    'USER_DELETE':        'static/ng-app/partials/forms/user-delete.html',
    'COHORT_DELETE':      'static/ng-app/partials/forms/cohort-delete.html',
    'PARTICIPANT_DELETE': 'static/ng-app/partials/forms/participant-delete.html',
    'PROJECT_DELETE':     'static/ng-app/partials/forms/project-delete.html',
    'ANALYTE_DELETE':     'static/ng-app/partials/forms/analyte-delete.html',
    'CONJUGATE_DELETE':   'static/ng-app/partials/forms/conjugate-delete.html',
    'BUFFER_DELETE':      'static/ng-app/partials/forms/buffer-delete.html',
    'SAMPLE_TYPE_DELETE': 'static/ng-app/partials/forms/sample-type-delete.html',
    'ISOTYPE_DELETE':     'static/ng-app/partials/forms/isotype-delete.html'
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
        name: 'network-list',
        parent: 'admin',
        url: 'networks/',
        views: {
            '@': {
                templateUrl: '/static/ng-app/partials/network-list.html',
                controller: 'NetworkController'
            }
        },
        data: {
            ncyBreadcrumbLabel: 'Networks'
        }
    }).state({
        name: 'cohort-list',
        parent: 'admin',
        url: 'cohorts/',
        views: {
            '@': {
                templateUrl: '/static/ng-app/partials/cohort-list.html',
                controller: 'CohortController'
            }
        },
        data: {
            ncyBreadcrumbLabel: 'Cohorts'
        }
    }).state({
        name: 'cohort-detail',
        parent: 'cohort-list',
        url: 'cohort/:cohortId',
        views: {
            '@': {
                templateUrl: '/static/ng-app/partials/cohort-detail.html',
                controller: 'CohortDetailController'
            }
        },
        data: {
            ncyBreadcrumbLabel: '{{current_cohort.name}}'
        }
    }).state({
        name: 'project-detail',
        parent: 'home',
        url: 'project/:projectId',
        views: {
            '@': {
                templateUrl: '/static/ng-app/partials/project-detail.html',
                controller: 'ProjectDetailController'
            }
        },
        data: {
            ncyBreadcrumbLabel: '{{current_project.name}}'
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