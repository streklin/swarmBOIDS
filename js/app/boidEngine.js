define(function (require) {

    var BOID = require('boid');

    var boidEngine = function (NUM_BOIDS, xBound, yBound) {
        this.boidSet = [];
        this.xBound = xBound;
        this.yBound = yBound;

        initializeBOIDS.call(this, NUM_BOIDS);
    };

    boidEngine.prototype.update = function () {
        updateBOIDS.call(this);
        updatePositions.call(this);
    };

    function updateBOIDS() {
        for (var i = 0; i < this.boidSet.length; i++) {
            var nhdBOIDS = findBOIDSNearTarget.call(this, this.boidSet[i]);
            this.boidSet[i].update(nhdBOIDS);
        }
    }

    function findBOIDSNearTarget(current) {
        var result = [];

        for (var j = 0; j < this.boidSet.length; j++) {
            var distance = distanceMetric.call(this, current, this.boidSet[j]);
            if (distance < current.boid_nhd && distance !== 0) {
                this.boidSet[j].distance = distance; //cache this calculation for later
                result.push(this.boidSet[j]);
            }
        }

        return result;
    }

    function distanceMetric(boid1, boid2) {

        var distanceSq1 = Math.pow(boid1.x - boid2.x, 2) + Math.pow(boid1.y - boid2.y, 2);
        var distanceSq2 = Math.pow(boid1.x - boid2.x - this.xBound, 2) + Math.pow(boid1.y - boid2.y - this.yBound, 2);

        return Math.min(Math.sqrt(distanceSq2), Math.sqrt(distanceSq1));

    }

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
