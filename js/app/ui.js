define(function(require) {

    var $ = require('jquery');
    var visualizationObj = require('visualization');

    var ui = function() {

        this.visualizationController = null;

        var self = this;
        $('#runVisualizationBtn').click(function() {
            runVisualization.call(self);
        });

    };

    function runVisualization() {

        var parameters = {
            min_boid_distance: 0,
            min_boid_speed: 0,
            max_boid_speed: 0,
            boid_nhd: 0,
            delta_speed: 0,
            delta_orientation:0
        };

        parameters.min_boid_distance = parseInt($('#min_boid_distance').val());
        parameters.min_boid_speed = parseInt($('#min_boid_speed').val());
        parameters.max_boid_speed = parseInt($('#max_boid_speed').val());
        parameters.boid_nhd = parseInt($('#boid_nhd').val());
        parameters.delta_speed = parseFloat($('#delta_speed').val());
        parameters.delta_orientation = parseFloat($('#delta_orientation').val());

        var num_boids = parseInt($('#num_boids').val());

        if (this.visualizationController === null) {
            this.visualizationController = new visualizationObj(parameters, 1600, 600, num_boids);
        } else {
            this.visualizationController.reset(parameters, 1600, 600, num_boids);
        }

        this.visualizationController.run();

    }

    return ui;

});
