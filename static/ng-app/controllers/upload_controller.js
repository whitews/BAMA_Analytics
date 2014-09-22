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
                var distinct_networks = [];  // array of strings (name)
                var distinct_participants_tmp = [];  // array of strings (name)
                $scope.distinct_participants = [];  // array of objects

                var distinct_analytes_tmp = [];  // array of strings (name)
                $scope.distinct_analytes = [];  // array of objects

                // analyte regex pattern to strip optional bead number
                var analyte_pattern = /^.*(?=\s\(\d+\)$)/;
                var analyte_result;

                var distinct_isotypes_tmp = [];  // array of strings (name)
                $scope.distinct_isotypes = [];  // array of objects

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
                    
                    // get distinct networks (required)
                    if (typeof(d['Network']) == "undefined") {
                        $scope.csv_errors.push("Network field is required");
                    } else {
                        if (distinct_networks.indexOf(d['Network']) == -1) {
                            distinct_networks.push(d['Network']);
                        }
                    }

                    // get distinct participants (required)
                    if (typeof(d['Participant ID']) == "undefined") {
                        $scope.csv_errors.push("Participant ID field is required");
                    } else {
                        if (distinct_participants_tmp.indexOf(d['Participant ID']) == -1) {
                            distinct_participants_tmp.push(d['Participant ID']);

                            // determine if any new participants are present
                            var existing_participant_idx = null;

                            for (var i= 0, len = $scope.participants.length; i < len; i++) {
                                if ($scope.participants[i].code == d['Participant ID']) {
                                    existing_participant_idx = i;
                                    break;
                                }
                            }

                            if (existing_participant_idx != null) {
                                // existing participant:
                                // verify species matches this record.
                                // this is done only for this first encountered
                                // record, all others will be assumed to be the
                                // same, checking this would potentially be
                                // quite expensive
                                if (d['Species'] != $scope.participants[existing_participant_idx].species_name) {
                                    $scope.csv_errors.push("Species for participant " + d['Participant ID'] + " does not match the server");
                                }
                            }

                            $scope.distinct_participants.push(
                                {
                                    code: d['Participant ID'],
                                    new: existing_participant_idx == null
                                }
                            );
                        }
                    }

                    // get distinct analytes (required)
                    if (typeof(d['Analyte']) == "undefined") {
                        $scope.csv_errors.push("Analyte field is required");
                    } else {
                        // need to strip the bead number off analyte string
                        // if present
                        analyte_result = analyte_pattern.exec(d['Analyte']);
                        if (analyte_result == null) {
                            // doesn't contain a trailing bead number
                            analyte_result = d['Analyte'];
                        } else {
                            // contains a bead number, get everything but bead
                            analyte_result = analyte_result[0];
                        }

                        if (distinct_analytes_tmp.indexOf(analyte_result) == -1) {
                            distinct_analytes_tmp.push(analyte_result);

                            // determine if any new analytes are present
                            var existing_analyte_idx = null;

                            for (var i= 0, len = $scope.analytes.length; i < len; i++) {
                                if ($scope.analytes[i].name == analyte_result) {
                                    existing_analyte_idx = i;
                                    break;
                                }
                            }

                            if (existing_analyte_idx == null) {
                                // analyte doesn't exist, uh, that's a problem
                                $scope.csv_errors.push("Analyte \"" + analyte_result + "\" does not exist on the server");
                            }

                            $scope.distinct_analytes.push(
                                {
                                    name: analyte_result,
                                    new: existing_analyte_idx == null
                                }
                            );
                        }
                    }
                    
                    // get distinct isotypes (required)
                    if (typeof(d['Isotype']) == "undefined") {
                        $scope.csv_errors.push("Isotype field is required");
                    } else {
                        if (distinct_isotypes_tmp.indexOf(d['Isotype']) == -1) {
                            distinct_isotypes_tmp.push(d['Isotype']);

                            // determine if any new isotypes are present
                            var existing_isotype_idx = null;

                            for (var i= 0, len = $scope.isotypes.length; i < len; i++) {
                                if ($scope.isotypes[i].name == d['Isotype']) {
                                    existing_isotype_idx = i;
                                    break;
                                }
                            }

                            if (existing_isotype_idx == null) {
                                // isotype doesn't exist, uh, that's a problem
                                $scope.csv_errors.push("Isotype \"" + d['Isotype'] + "\" does not exist on the server");
                            }

                            $scope.distinct_isotypes.push(
                                {
                                    name: d['Isotype'],
                                    new: existing_isotype_idx == null
                                }
                            );
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

                // only one network should be present and should match the
                // cohort's network
                if (distinct_networks.length > 1) {
                    $scope.csv_errors.push("Multiple networks found in CSV file. Data can only be uploaded for one network at a time");
                }

                // cohort must match current cohort
                if (distinct_networks[0] != $scope.current_cohort.network_name) {
                    $scope.csv_errors.push("Network in CSV file doesn't match this cohort's network");
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