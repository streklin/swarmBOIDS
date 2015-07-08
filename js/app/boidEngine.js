define(function(require) {

    var BOID = require('boid');

    var boidEngine = function(NUM_BOIDS) {
        this.boidSet = [];

        initializeBOIDS.call(this, NUM_BOIDS);
    };

    boidEngine.prototype.update = function() {

        for (var i = 0; i < this.boidSet.length; i++) {
            var current = this.boidSet[i];

            var xMult = 1;
            if (Math.random() > 0.5) xMult = -1;
            var yMult = 1;
            if (Math.random() > 0.5) yMult = -1;



            current.x += xMult * Math.random() * 5;
            current.y += yMult * Math.random() * 5;
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
