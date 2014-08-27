var app = angular.module(
    'AnalyticsApp',
    [
        'ngSanitize',
        'ngCookies',
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'ui.select2',
        'ncy-angular-breadcrumb',
        'angularFileUpload'
    ]
);

app.factory('LoginRedirectInterceptor', function($q, $window) {
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

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('LoginRedirectInterceptor');

    $urlRouterProvider.when("", "/");
    $urlRouterProvider.otherwise("/");

    $stateProvider.state({
        name: 'home',
        url: '/',
        views: {
            '@': {
                templateUrl: '/static/ng-app/partials/home.html'
            }
        },
        data: {
            ncyBreadcrumbLabel: 'Projects'
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
    });
});

app.run(function ($http, $cookies) {
    $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
});