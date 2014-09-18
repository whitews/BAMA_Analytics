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
                $scope.csv_errors = [];
                if ($files.length != 1) {
                    $scope.csv_errors.push('Please drag only one file at a time.');
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
                            validateData(results.data);
                            $scope.csv_data = results.data;
                            $scope.$apply();
                        }
                    });
            }

            function validateData(data) {
                var distinct_cohorts = [];
                var distinct_notebooks_tmp = [];  // array of strings (name)
                $scope.distinct_notebooks = [];  // array of objects

                // gather validation data for every data point
                data.forEach(function (d) {
                    // get distinct cohorts, must be only one and must match
                    // the current cohort
                    if (typeof(d.Cohort) == "undefined") {
                        $scope.csv_errors.push("Cohort field is required");
                    } else {
                        if (distinct_cohorts.indexOf(d.Cohort) == -1) {
                            distinct_cohorts.push(d.Cohort);
                        }
                    }

                    // get distinct notebooks. this field is required but there
                    // are no additional rules for this one
                    // but we will show the new ones to the user
                    if (typeof(d['Notebook Number']) == "undefined") {
                        $scope.csv_errors.push("Notebook field is required");
                    } else {
                        if (distinct_notebooks_tmp.indexOf(d['Notebook Number']) == -1) {
                            distinct_notebooks_tmp.push(d['Notebook Number']);
                        }
                    }


                });

                // Now check all our validation data

                // only one cohort should be present
                if (distinct_cohorts.length > 1) {
                    $scope.csv_errors.push("Multiple cohorts found in CSV file. Data can only be uploaded for one cohort at a time");
                }

                // cohort must match current cohort
                if (distinct_cohorts[0] != $scope.current_cohort.name) {
                    $scope.csv_errors.push("Cohort in CSV file doesn't match this cohort");
                }

                // determine if any new notebooks are present
                distinct_notebooks_tmp.forEach(function (n) {
                    var new_nb = false;
                    if ($scope.notebooks.indexOf(n) == -1) {
                        new_nb = true;
                    }
                    $scope.distinct_notebooks.push(
                        {
                            name: n,
                            new: new_nb
                        }
                    );
                });

            }
        }
    ]
);