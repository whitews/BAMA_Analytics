app.controller(
    'UploadController',
    [
        '$scope',
        '$controller',
        '$modal',
        'ModelService',
        function ($scope, ModelService) {
            // file reader stuff
            $scope.fileReaderSupported = window.FileReader != null;
            $scope.hasUploader = function (index) {
                return $scope.upload[index] != null;
            };
            $scope.abort = function (index) {
                $scope.upload[index].abort();
                $scope.upload[index] = null;
            };

            $scope.onFileSelect = function ($files) {
                $scope.file_name = null;
                $scope.csv_data = null;
                $scope.csv_error = null;
                if ($files.length != 1) {
                    $scope.csv_error = 'Please drag only one file at a time.'
                } else {
                    parseCSV($files[0])
                }
            };

            function parseCSV(file) {
                    $scope.file_name = file.name;

                    // parse CSV file
                    Papa.parse(file, {
                        header: true,
                        complete: function (results) {
                            $scope.csv_data = results.data;
                            $scope.$apply();
                        }
                    });
            }
        }
    ]
);