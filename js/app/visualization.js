define(function (require) {

    var boidDisplay = require('boidDisplay');
    var boidEngine = require('boidEngine');
    var physics = require('physics');
    var $ = require('jquery');

    var visualization = function (parameters, x, y, num_boids) {
        setupSimulation.call(this, parameters, x, y, num_boids);
    };


    visualization.prototype.run = function () {

        var self = this;

        this.iterations = 0;

        this.intervalToken = setInterval(function () {
            self.iterations++;
            self.engine.update();
            self.physicsEngine.update();
            self.displayObject.draw();

            $('#iterationsCount').text(self.iterations);

            if (self.iterations >= 6000) {
                clearInterval(self.intervalToken);
                $('#fitnessValue').text(self.engine.fitness / 6000);
            }

        }, 50);

    };

    visualization.prototype.reset = function (parameters, x, y, num_boids) {
        clearInterval(this.intervalToken);
        setupSimulation.call(this, parameters, x, y, num_boids);
    };


    function setupSimulation(parameters, x, y, num_boids) {
        this.displayObject = new boidDisplay(x, y);
        this.engine = new boidEngine(num_boids, x, y, parameters);
        this.physicsEngine = new physics(this.engine.boidSet, x, y);
        this.displayObject.boidSet = this.engine.boidSet;
        this.displayObject.draw();
    }

    return visualization;


});
