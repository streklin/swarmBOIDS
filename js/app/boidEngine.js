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

    function initializeBOIDS(NUM_BOIDS) {
        for (var i = 0; i < NUM_BOIDS; i++) {
            var newBOID = new BOID();
            this.boidSet.push(newBOID);
        }
    }


    return boidEngine;

});
