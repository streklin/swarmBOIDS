define(function(require) {

    var boidDisplay = require('boidDisplay');
    var boidEngine = require('boidEngine');
    var physics = require('physics');

    var visualization = function(parameters,x, y, num_boids) {

        this.displayObject = new boidDisplay(x, y);
        this.engine = new boidEngine(num_boids, x, y, parameters);
        this.physicsEngine = new physics(this.engine.boidSet, x, y);
        this.displayObject.boidSet = this.engine.boidSet;

        this.displayObject.draw();


    };


    visualization.prototype.run = function() {

         setInterval(function() {

             this.engine.update();
             this.physicsEngine.update();
             this.displayObject.draw();

         }, 50);

    };


    return visualization;


});
