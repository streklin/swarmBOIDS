define(function(require) {

    var $ = require('jquery');
    var visualizationObj = require('visualization');
    var simulatorObj = require('simulator');
    var Statistics = require('statistics');
    var evolutionObj = require('evolution');

    var ui = function() {

        this.visualizationController = null;

        var self = this;
        $('#runVisualizationBtn').click(function() {
            runVisualization.call(self);
        });

        $('#runSimulation').click(function() {
            runSimulation.call(self);
        });

        $('#runEvolutionBtn').click(function() {
            runEvolution.call(self);
        });

    };

    function runEvolution() {
        var ea = new evolutionObj(10, 100, 0.01, 0.60, 1600, 1200);
        var results = ea.run(50);

        console.log(results);
    }


    function runSimulation() {
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

        var simulation = new simulatorObj(parameters, 1600, 1200, num_boids);
        var results = simulation.run(100, 2500);

        alert('Simulation Complete');

        var average = Statistics.findAverage(results);
        var standardDeviation = Statistics.findStandardDev(results);

        var html = '';

        for(var i = 0; i < results.length; i++) {
            html = '<div><span>Trial #' + i + ' :</span>' + results[i].toString() + '</div>';
            $('#results').append(html);
        }

        html = '<div><span>Average :</span>' + average + '</div>';
        $('#results').append(html);

        html = '<div><span>Average :</span>' + standardDeviation + '</div>';
        $('#results').append(html);
    }

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
            this.visualizationController = new visualizationObj(parameters, 1600, 1200, num_boids);
        } else {
            this.visualizationController.reset(parameters, 1600, 1200, num_boids);
        }

        this.visualizationController.run();
    }

    return ui;

});
