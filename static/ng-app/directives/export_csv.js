analytics_app.directive('exportCsv', function() {
    return {
        controller: 'ExportController',
        restrict: 'E',
        replace: true,
        templateUrl: 'static/ng-app/directives/export_csv.html'
    };
});