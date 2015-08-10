define(function(require) {

    var boidEngine = require('boidEngine');
    var physics = require('physics');
    var $ = require('jquery');

    var simulator = function (parameters, x, y, num_boids, errorLevel) {
        setupSimulation.call(this, parameters, x, y, num_boids, errorLevel);

        this.x = x;
        this.y = y;
        this.parameters = parameters;
        this.num_boids = num_boids;
        this.errorLevel = errorLevel;
    };

    simulator.prototype.run = function(trials, iterations) {

        var trialResults = [];

        for(var t = 0; t < trials; t++) {

            console.log('Trail: ' + t);
            setupSimulation.call(this, this.parameters, this.x, this.y, this.num_boids, this.errorLevel);

            for(var i = 0; i < iterations; i++) {
                this.engine.update();
                this.physicsEngine.update();
            }

            var fitness = this.engine.fitness / iterations;
            trialResults.push(fitness);
        }

        return trialResults;
    };

    simulator.prototype.reset = function(iterations) {
        setupSimulation.call(this, parameters, x, y, num_boids, this.errorLevel);
    };

    function setupSimulation(parameters, x, y, num_boids, errorLevel) {
        this.engine = new boidEngine(num_boids, x, y, parameters, true, errorLevel);
        this.physicsEngine = new physics(this.engine.boidSet, x, y);
    }

    return simulator;

});
