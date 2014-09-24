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
                var current_participant = null;
                var current_visit_id = null;
                var sample_type_match = false;
                var buffer_match = false;

                var distinct_analytes_tmp = [];  // array of strings (name)
                $scope.distinct_analytes = [];  // array of objects

                // analyte regex pattern to strip optional bead number
                var analyte_pattern = /^.*(?=\s\(\d+\)$)/;
                var analyte_result;

                var distinct_isotypes_tmp = [];  // array of strings (name)
                $scope.distinct_isotypes = [];  // array of objects

                var distinct_conjugates_tmp = [];  // array of strings (name)
                $scope.distinct_conjugates = [];  // array of objects

                // CV regex pattern to find number with optional '%'
                var cv_pattern = /^\d+\.?\d*(?=\%?$)/;
                var cv_result;

                // Description field helper vars
                var desc_first_pass = [];
                var desc_second_pass = [];

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
                        current_participant = null;
                    } else {
                        current_participant = d['Participant ID'];
                        if (distinct_participants_tmp.indexOf(current_participant) == -1) {
                            distinct_participants_tmp.push(current_participant);

                            // determine if any new participants are present
                            var existing_participant_idx = null;

                            for (var i = 0, len = $scope.participants.length; i < len; i++) {
                                if ($scope.participants[i].code == current_participant) {
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
                                if (typeof(d['Species']) == "undefined") {
                                    $scope.csv_errors.push("Species field is required");
                                } else if (d['Species'] != $scope.participants[existing_participant_idx].species_name) {
                                    $scope.csv_errors.push("Species for participant " + current_participant + " does not match the server");
                                }
                            }

                            $scope.distinct_participants.push(
                                {
                                    code: current_participant,
                                    new: existing_participant_idx == null
                                }
                            );
                        }
                    }

                    // get visit ID (required)
                    if (typeof(d['Visit ID']) == "undefined") {
                        $scope.csv_errors.push("Visit ID is required");
                        current_visit_id = null;
                    } else {
                        current_visit_id = d['Visit ID'];
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

                            for (var i = 0, len = $scope.analytes.length; i < len; i++) {
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

                            for (var i = 0, len = $scope.isotypes.length; i < len; i++) {
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
                    
                    // get distinct conjugates (required)
                    if (typeof(d['Conjugate']) == "undefined") {
                        $scope.csv_errors.push("Conjugate field is required");
                    } else {
                        if (distinct_conjugates_tmp.indexOf(d['Conjugate']) == -1) {
                            distinct_conjugates_tmp.push(d['Conjugate']);

                            // determine if any new conjugates are present
                            var existing_conjugate_idx = null;

                            for (var i = 0, len = $scope.conjugates.length; i < len; i++) {
                                if ($scope.conjugates[i].name == d['Conjugate']) {
                                    existing_conjugate_idx = i;
                                    break;
                                }
                            }

                            if (existing_conjugate_idx == null) {
                                // conjugate doesn't exist, uh, that's a problem
                                $scope.csv_errors.push("Conjugate \"" + d['Conjugate'] + "\" does not exist on the server");
                            }

                            $scope.distinct_conjugates.push(
                                {
                                    name: d['Conjugate'],
                                    new: existing_conjugate_idx == null
                                }
                            );
                        }
                    }

                    // validate dilution is present and a positive number
                    if (typeof(d['Dilution']) == "undefined") {
                        $scope.csv_errors.push("Dilution field is required");
                    } else if (isNaN(d['Dilution'])) {
                        $scope.csv_errors.push("Dilution value must be a positive number. Found: " + d['Dilution']);
                    } else if (parseFloat(d['Dilution']) <= 0) {
                        $scope.csv_errors.push("Dilution value must be a positive number. Found: " + d['Dilution']);
                    }

                    // validate FI-Bkgd is present and a number
                    if (typeof(d['FI-Bkgd']) == "undefined") {
                        $scope.csv_errors.push("FI-Bkgd field is required");
                    } else if (isNaN(d['FI-Bkgd'])) {
                        $scope.csv_errors.push("FI-Bkgd value must be a number. Found: " + d['FI-Bkgd']);
                    }

                    // validate FI-Bkgd-Blank is present and a number
                    if (typeof(d['FI-Bkgd-Blank']) == "undefined") {
                        $scope.csv_errors.push("FI-Bkgd-Blank field is required");
                    } else if (isNaN(d['FI-Bkgd-Blank'])) {
                        $scope.csv_errors.push("FI-Bkgd-Blank value must be a number. Found: " + d['FI-Bkgd-Blank']);
                    }

                    // validate CV is present and a number w/ opt. trailing '%'
                    if (typeof(d['CV']) == "undefined") {
                        $scope.csv_errors.push("CV field is required");
                    } else {
                        // need to strip the trailing % if present
                        cv_result = cv_pattern.exec(d['CV']);
                        if (cv_result == null) {
                            $scope.csv_errors.push("CV value must be a percentage. Found: " + d['CV']);
                        } else if (isNaN(cv_result[0])) {
                            $scope.csv_errors.push("CV value must be a percentage. Found: " + d['CV']);
                        }
                    }

                    // finally, check the description field
                    // this one's overloaded as a double quoted string with
                    // it's own semi-colon and comma delimited internal values:
                    // <specimen_id> ; <participant_id> , <visit_id> , <visit_date> , <sample_type> , <buffer>
                    if (typeof(d['Description']) == "undefined") {
                        $scope.csv_errors.push("Description field is required");
                    } else {
                        // first value is specimen ID and it is delimited by a
                        // semi-colon
                        desc_first_pass = d['Description'].split(";");

                        if (desc_first_pass.length != 2) {
                            $scope.csv_errors.push("Description field format is incorrect. Found: " + d['Description']);
                        } else {
                            d['Specimen ID'] = desc_first_pass[0];

                            // the rest are comma delimited
                            desc_second_pass = desc_first_pass[1].split(",");

                            if (desc_second_pass.length != 5) {
                                $scope.csv_errors.push("Description field format is incorrect. Found: " + d['Description']);
                            } else {
                                // 2nd field is participant ID, which is also in
                                // a separate column. Verify it matches what we
                                // already have
                                if (desc_second_pass[0] != current_participant) {
                                    $scope.csv_errors.push("Description field participant field doesn't match Participant ID column: " + desc_second_pass[0] + " vs " + current_participant);
                                }

                                // 3rd field is visit ID, which is also in a
                                // separate column. Verify it matches that
                                // visit column
                                if (desc_second_pass[1].trim() != current_visit_id) {
                                    $scope.csv_errors.push("Description field visit ID field doesn't match Visit ID column: " + desc_second_pass[1] + " vs " + current_visit_id);
                                }

                                // 4th field is visit date, don't capture it

                                // 5th field is sample type which is required
                                // and must match a sample type defined on the
                                // server
                                sample_type_match = false;
                                for (var i = 0, len = $scope.sample_types.length; i < len; i++) {
                                    if ($scope.sample_types[i].name == desc_second_pass[3].trim()) {
                                        sample_type_match = true;
                                        break;
                                    }
                                }
                                if (!sample_type_match) {
                                    $scope.csv_errors.push("Description sample type does not exist on the server: " + desc_second_pass[3]);
                                }

                                // 6th field is buffer which is required
                                // and must match a buffer defined on the
                                // server
                                buffer_match = false;
                                for (var i = 0, len = $scope.buffers.length; i < len; i++) {
                                    if ($scope.buffers[i].name == desc_second_pass[4].trim()) {
                                        buffer_match = true;
                                        break;
                                    }
                                }
                                if (!buffer_match) {
                                    $scope.csv_errors.push("Description buffer does not exist on the server: " + desc_second_pass[4]);
                                }
                            }
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