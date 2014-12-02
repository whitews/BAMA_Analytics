var analytics_app = angular.module(
    'AnalyticsApp',
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

analytics_app.config(function ($stateProvider, $urlRouterProvider) {
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
            ncyBreadcrumbLabel: 'Analytics App'
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
    });
});

analytics_app.run(function ($http, $cookies) {
    $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
});