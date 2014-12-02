var ModalCtrl = function ($scope, $modalInstance, instance) {
    $scope.instance = instance;
    $scope.ok = function () {
        $modalInstance.close();
    };
};

analytics_app.controller(
    'AnalyticsAppController',
    ['$scope', '$modal', 'ModelService', function ($scope, $modal, ModelService) {
        $scope.notebooks = [];
        $scope.participants = [];
        $scope.data_points = [];

        $scope.append_data_points = function(data_points) {
            $scope.data_points = $scope.data_points.concat(data_points);
            $scope.totalItems = $scope.data_points.length;
        };

        $scope.analytes = ModelService.getAnalytes();
        $scope.isotypes = ModelService.getIsotypes();
        $scope.conjugates = ModelService.getConjugates();
        $scope.sample_types = ModelService.getSampleTypes();
        $scope.buffers = ModelService.getBuffers();

        // pagination stuff for data points table
        $scope.totalItems = $scope.data_points.length;
        $scope.currentPage = 1;
        $scope.numPerPage = 5;

        $scope.paginate = function(value) {
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.data_points.indexOf(value);
            return (begin <= index && index < end);
        };

        $scope.data_point_columns = {
            'notebook_name': {
                'name': 'Notebook',
                'show': false
            },
            'participant_code': {
                'name': 'Participant',
                'show': true
            },
            'global_id_code': {
                'name': 'Global ID',
                'show': false
            },
            'visit_code': {
                'name': 'Visit',
                'show': true
            },
            'visit_date': {
                'name': 'Visit Date',
                'show': false
            },
            'assay_date': {
                'name': 'Assay Date',
                'show': false
            },
            'analyte_name': {
                'name': 'Analyte',
                'show': true
            },
            'bead_number': {
                'name': 'Bead #',
                'show': false
            },
            'sample_type_name': {
                'name': 'Sample Type',
                'show': false
            },
            'conjugate_name': {
                'name': 'Conjugate',
                'show': false
            },
            'isotype_name': {
                'name': 'Isotype',
                'show': false
            },
            'buffer_name': {
                'name': 'Buffer',
                'show': false
            },
            'cv': {
                'name': 'CV',
                'show': true
            },
            'fi_minus_background': {
                'name': 'FI-Bkgd',
                'show': true
            },
            'fi_minus_background_blank': {
                'name': 'FI-Bkgd-Blank',
                'show': true
            },
            'dilution': {
                'name': 'Dilution',
                'show': false
            }
        };

        $scope.open_column_chooser = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalFormCtrl,
                size: size,
                resolve: {
                    instance: function () {
                        return $scope.data_point_columns;
                    }
                }
            });

            modalInstance.result.then(function (instance) {
                //$scope.data_point_columns = instance;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.apply_filter = function () {
            $scope.retrieving_data = true;
            $scope.filter_errors = [];

            var participants = [];
            if ($scope.participants != null) {
                $scope.participants.forEach(function (p) {
                    if (p.query) {
                        participants.push(p.id);
                    }
                });
            }

            // TODO: filter imported data points here
        };
    }
]);

analytics_app.controller(
    'ImportController',
    [
        '$scope',
        function ($scope) {
            $scope.file_name = null;
            $scope.csv_data = null;
            $scope.csv_errors = [];
            $scope.import_success = false;
            $scope.success_message = null;

            // file reader stuff
            $scope.fileReaderSupported = window.FileReader != null;

            $scope.onFileSelect = function ($files) {
                $scope.file_name = null;
                $scope.csv_data = null;
                $scope.csv_errors = [];
                $scope.import_success = false;
                $scope.success_message = null;
                $scope.importing = false;
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
                // clear errors
                $scope.csv_errors = [];
                $scope.import_errors = [];

                var distinct_cohorts = [];
                var distinct_notebooks_tmp = [];  // array of strings (name)
                $scope.distinct_notebooks = [];  // array of objects
                var distinct_networks = [];  // array of strings (name)
                var distinct_participants_tmp = [];  // array of strings (name)
                $scope.distinct_participants = [];  // array of objects
                var current_visit_id = null;
                var sample_type_match = false;
                var buffer_match = false;
                var visit_date = null;
                var assay_date = null;

                var distinct_analytes_tmp = [];  // array of strings (name)
                $scope.distinct_analytes = [];  // array of objects

                // analyte regex pattern to strip optional bead number
                var analyte_pattern = /^.*(?=\s\((\d+)\)$)/;
                var analyte_result;
                var analyte_name;
                var existing_analyte_pk;

                // CV regex pattern to find number with optional '%'
                var cv_pattern = /^\d+\.?\d*(?=\%?$)/;
                var cv_result;

                // Description field helper vars
                var desc_first_pass = [];
                var desc_second_pass = [];

                // gather validation data for every data point
                data.forEach(function (d) {
                    // populate some d properties we'll need to convert
                    // to match the web API
                    d['participant_pk'] = null;
                    d['participant_species_name'] = null;
                    d['conjugate_pk'] = null;
                    d['isotype_pk'] = null;
                    d['cv_value'] = null;
                    d['notebook_pk'] = null;
                    d['sample_type_pk'] = null;
                    d['buffer_pk'] = null;

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
                        // check if notebook has already been seen
                        for (var i = 0, len = $scope.notebooks.length; i < len; i++) {
                            if ($scope.notebooks[i].name == d['Notebook Number']) {
                                d['notebook_pk'] = $scope.notebooks[i].id;
                                break;
                            }
                        }

                        // we show the distinct notebooks to the user along
                        // with a new tag for the new ones
                        if (distinct_notebooks_tmp.indexOf(d['Notebook Number']) == -1) {
                            distinct_notebooks_tmp.push(d['Notebook Number']);

                            $scope.distinct_notebooks.push(
                                {
                                    name: d['Notebook Number'],
                                    new: d['notebook_pk'] == null
                                }
                            );
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
                        for (var i = 0, len = $scope.participants.length; i < len; i++) {
                            if ($scope.participants[i].code == d['Participant ID']) {
                                d['participant_pk'] = $scope.participants[i].id;
                                d['participant_species_name'] = $scope.participants[i].species_name;
                                break;
                            }
                        }

                        if (d['participant_pk'] != null) {
                            // existing participant:
                            // verify species matches this record.
                            // this is done only for this first encountered
                            // record, all others will be assumed to be the
                            // same, checking this would potentially be
                            // quite expensive
                            if (typeof(d['Species']) == "undefined") {
                                $scope.csv_errors.push("Species field is required");
                            } else if (d['Species'] != d['participant_species_name']) {
                                $scope.csv_errors.push("Species for participant " + d['Participant ID'] + " does not match the server");
                            }
                        }

                        if (distinct_participants_tmp.indexOf(d['Participant ID']) == -1) {
                            distinct_participants_tmp.push(d['Participant ID']);

                            $scope.distinct_participants.push(
                                {
                                    code: d['Participant ID'],
                                    new: d['participant_pk'] == null
                                }
                            );
                        }
                    }

                    // get visit ID (optional)
                    if (typeof(d['Visit ID']) == "undefined") {
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
                            analyte_name = d['Analyte'];
                            d['bead_number'] = null;
                        } else {
                            // contains a bead number, get everything but bead
                            analyte_name = analyte_result[0];
                            // save bead number
                            d['bead_number'] = analyte_result[1];
                        }

                        // determine if any new analytes are present
                        var existing_analyte_idx = null;

                        for (var i = 0, len = $scope.analytes.length; i < len; i++) {
                            if ($scope.analytes[i].name == analyte_name) {
                                existing_analyte_pk = $scope.analytes[i].id;
                                break;
                            }
                        }

                        if (existing_analyte_pk == null) {
                            // analyte doesn't exist, uh, that's a problem
                            $scope.csv_errors.push("Analyte \"" + analyte_result + "\" does not exist on the server");
                        } else {
                            // save existing analyte PK for importing
                            d['analyte_pk'] = existing_analyte_pk
                        }

                        if (distinct_analytes_tmp.indexOf(analyte_name) == -1) {
                            distinct_analytes_tmp.push(analyte_name);

                            $scope.distinct_analytes.push(
                                {
                                    name: analyte_name,
                                    new: existing_analyte_pk == null
                                }
                            );
                        }
                    }

                    // get distinct isotypes (required)
                    if (typeof(d['Isotype']) == "undefined") {
                        $scope.csv_errors.push("Isotype field is required");
                    } else {
                        // determine if any new isotypes are present
                        for (var i = 0, len = $scope.isotypes.length; i < len; i++) {
                            if ($scope.isotypes[i].name == d['Isotype']) {
                                d['isotype_pk'] = $scope.isotypes[i].id;
                                break;
                            }
                        }

                        if (d['isotype_pk'] == null) {
                            // isotype doesn't exist, uh, that's a problem
                            $scope.csv_errors.push("Isotype \"" + d['Isotype'] + "\" does not exist on the server");
                        }
                    }

                    // get distinct conjugates (required)
                    if (typeof(d['Conjugate']) == "undefined") {
                        $scope.csv_errors.push("Conjugate field is required");
                    } else {

                        // determine if any new conjugates are present
                        for (var i = 0, len = $scope.conjugates.length; i < len; i++) {
                            if ($scope.conjugates[i].name == d['Conjugate']) {
                                d['conjugate_pk'] = $scope.conjugates[i].id;
                                break;
                            }
                        }

                        if (d['conjugate_pk'] == null) {
                            // conjugate doesn't exist, uh, that's a problem
                            $scope.csv_errors.push("Conjugate \"" + d['Conjugate'] + "\" does not exist on the server");
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
                        } else {
                            d['cv_value'] = cv_result[0];
                        }
                    }

                    // get assay date (required)
                    if (typeof(d['Assay Date']) == "undefined") {
                        $scope.csv_errors.push("Assay Date field is required");
                    } else {
                        assay_date = new Date(d['Assay Date'].trim());
                        if (isNaN(assay_date)) {
                            $scope.csv_errors.push("Assay Date format is incorrect. Found: " + d['Assay Date']);
                        } else {
                            d['assay_date'] =
                                assay_date.getFullYear().toString() +
                                "-" +
                                (assay_date.getMonth() + 1) +
                                "-" +
                                assay_date.getDate().toString();
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
                                if (desc_second_pass[0] != d['Participant ID']) {
                                    $scope.csv_errors.push("Description field participant field doesn't match Participant ID column: " + desc_second_pass[0] + " vs " + d['Participant ID']);
                                }

                                // 3rd field is visit ID, which is also in a
                                // separate column. Verify it matches that
                                // visit column
                                if (desc_second_pass[1].trim() != current_visit_id) {
                                    $scope.csv_errors.push("Description field visit ID field doesn't match Visit ID column: " + desc_second_pass[1] + " vs " + current_visit_id);
                                }

                                // 4th field is visit date
                                visit_date = new Date(desc_second_pass[2].trim());
                                if (isNaN(visit_date)) {
                                    d['visit_date'] = null;
                                } else {
                                    d['visit_date'] =
                                        visit_date.getFullYear().toString() +
                                        "-" +
                                        (visit_date.getMonth() + 1) +
                                        "-" +
                                        visit_date.getDate().toString();
                                }

                                // 5th field is sample type which is required
                                // and must match a sample type defined on the
                                // server
                                sample_type_match = false;
                                for (var i = 0, len = $scope.sample_types.length; i < len; i++) {
                                    if ($scope.sample_types[i].name == desc_second_pass[3].trim()) {
                                        sample_type_match = true;
                                        d['sample_type_pk'] = $scope.sample_types[i].id;
                                        break;
                                    }
                                }
                                if (!sample_type_match) {
                                    $scope.csv_errors.push("Description sample type does not exist on the server: " + desc_second_pass[3]);
                                }

                                // 6th field is buffer which is optional
                                // but must match a buffer defined on the
                                // server if it is present
                                buffer_match = false;
                                for (var i = 0, len = $scope.buffers.length; i < len; i++) {
                                    if ($scope.buffers[i].name == desc_second_pass[4].trim()) {
                                        buffer_match = true;
                                        d['buffer_pk'] = $scope.buffers[i].id;
                                        break;
                                    }
                                }
                                // if a buffer was present but didn't match
                                // inform the user
                                if (!buffer_match && desc_second_pass[4] != "") {
                                    $scope.csv_errors.push("Description buffer does not exist on the server: " + desc_second_pass[4]);
                                }
                            }
                        }
                    }
                });
            }

            $scope.import_data = function() {
                if (!$scope.csv_data) {
                    // there's no data
                    return;
                }

                $scope.importing = true;

                // coerce data objects to conform to web API import format
                var data_points = [];

                $scope.csv_data.forEach(function (d) {
                    data_points.push({
                        'cohort': d['Cohort'],
                        'notebook': d['notebook_pk'],
                        'notebook_name': d['Notebook Number'],
                        'assay_date': d['assay_date'],
                        'participant': d['participant_pk'],
                        'participant_code': d['Participant ID'],
                        'species': d['Species'],
                        'sample_type': d['sample_type_pk'],
                        'analyte': d['analyte_pk'],
                        'isotype': d['isotype_pk'],
                        'conjugate': d['conjugate_pk'],
                        'buffer': d['buffer_pk'],
                        'global_id_code': d['Specimen ID'],
                        'visit_code': d['Visit ID'],
                        'visit_date': d['visit_date'],
                        'bead_number': d['bead_number'],
                        'dilution': d['Dilution'],
                        'fi_minus_background': d['FI-Bkgd'],
                        'fi_minus_background_blank': d['FI-Bkgd-Blank'],
                        'cv': d['cv_value']
                    });
                });

                $scope.append_data_points(data_points);

                $scope.import_success = true;
                $scope.success_message = data_points.length + " records successfully imported.";

                // reset data import vars
                $scope.file_name = null;
                $scope.csv_data = null;
                $scope.csv_errors = [];
                $scope.importing = false;
            }
        }
    ]
);