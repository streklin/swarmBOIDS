define(function(require) {

    var BOID = require('boid');

    var boidEngine = function(NUM_BOIDS) {
        this.boidSet = [];

        initializeBOIDS.call(this, NUM_BOIDS);
    };

    boidEngine.prototype.update = function() {

        for (var i = 0; i < this.boidSet.length; i++) {
            var current = this.boidSet[i];

            current.x += current.speed * Math.cos(current.orientation);
            current.y += current.speed * Math.sin(current.orientation);

        }

    };

    function initializeBOIDS(NUM_BOIDS) {
        for (var i = 0; i < NUM_BOIDS; i++) {
            var newBOID = new BOID();
            this.boidSet.push(newBOID);
        }
    }

    return boidEngine;

});
