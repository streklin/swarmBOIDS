define(function(require) {

    var BOID = require('boid');

    var boidEngine = function(NUM_BOIDS, xBound, yBound) {
        this.boidSet = [];
        this.xBound = xBound;
        this.yBound = yBound;

        initializeBOIDS.call(this, NUM_BOIDS);
    };

    boidEngine.prototype.update = function() {

        updatePositions.call(this);
    };

    function updatePositions() {
        for (var i = 0; i < this.boidSet.length; i++) {
            var current = this.boidSet[i];
            current.x += current.speed * Math.cos(current.orientation);
            current.y += current.speed * Math.sin(current.orientation);

            current.x = wrapValue(current.x, this.xBound);
            current.y = wrapValue(current.y, this.yBound);
        }
    }

    function initializeBOIDS(NUM_BOIDS) {
        for (var i = 0; i < NUM_BOIDS; i++) {
            var newBOID = new BOID();
            this.boidSet.push(newBOID);
        }
    }

    function wrapValue(value, maxBound) {
        if (value < 0) {
            value = maxBound + value;
            return value;
        }

        if (value > maxBound) {
            var diff = value - maxBound;
            value = diff;
            return value
        }

        return value;
    }

    return boidEngine;

});
