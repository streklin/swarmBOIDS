define(function (require) {

    var BOID = require('boid');
    var statistics = require('statistics');
    var obstaclePrototype = require('obstacle');

    var boidEngine = function (NUM_BOIDS, xBound, yBound, parameters, useErrorData, errorLevel) {
        this.boidSet = [];
        this.signals = [];//allow the boids to communicate
        this.obstacles = []; //give boids something that needs to be avoided.
        this.xBound = xBound;
        this.yBound = yBound;
        this.parameters = parameters;
        this.fitness = 0;
        this.useErrorData = false;
        this.errorLevel = 0.00;

        if (typeof(useErrorData) !== 'undefined') {
            this.useErrorData = useErrorData;
            this.errorLevel = errorLevel;
        }

        initializeBOIDS.call(this, NUM_BOIDS);
        initializeTargetBOID.call(this);
        initializeObstacles.call(this);
    };

    boidEngine.prototype.update = function () {
        updateBOIDS.call(this);
    };

    function updateBOIDS() {

        var newSignalSet = [];

        for (var i = 0; i < this.boidSet.length; i++) {

            var obstacles = findObstaclesNearTarget.call(this, this.boidSet[i]);


            if (this.boidSet[i].isTarget) {
                var nhdBOIDS = findBOIDSNearTarget.call(this, this.boidSet[i]);
                this.fitness += nhdBOIDS.length;
                this.boidSet[i].update([], [], obstacles);
                continue;
            }

            var nhdBOIDS = findBOIDSNearTarget.call(this, this.boidSet[i]);
            var filteredSignals = findSignalsNearTarget.call(this, this.boidSet[i]);

            var boidResponse = this.boidSet[i].update(nhdBOIDS, filteredSignals, obstacles);
            if (boidResponse !== null)
                newSignalSet.push(boidResponse);
        }

        this.signals = newSignalSet;
    }

    function findSignalsNearTarget(current) {
        var result = [];

        for (var j = 0; j < this.signals.length; j++) {
            var distance = distanceMetric.call(this, this.signals[j], current);

            if (distance < current.boid_nhd && distance !== 0) {
                result.push(this.signals[j]);
            }
        }

        return result;
    }

    function findBOIDSNearTarget(current) {
        var result = [];

        for (var j = 0; j < this.boidSet.length; j++) {
            var distance = distanceMetric.call(this, current, this.boidSet[j]);

            //insert uncertainty in the distance measurement
            if (this.useErrorData && distance !== 0) {
                distance = statistics.generateRandomError(distance, this.errorLevel);
            }

            if (distance < current.boid_nhd && distance !== 0) {
                this.boidSet[j].distance = distance; //cache this calculation for later
                result.push(this.boidSet[j]);
            }
        }

        return result;
    }

    function findObstaclesNearTarget(current) {
        var result = [];
        var virtuals = createVirtualObstalces.call(this, current);

        var searchSet =  virtuals.concat(this.obstacles);

        for (var j = 0; j < searchSet.length; j++) {
            var distance = distanceMetric.call(this, searchSet[j], current);

            if (distance < current.boid_nhd + searchSet[j].radius) {
                searchSet[j].distance = distance - searchSet[j].radius;
                result.push(searchSet[j]);
            }
        }

        return result;
    }

    function createVirtualObstalces(current) {
        var virtualObs = [];

        var x1 = new obstaclePrototype(0, current.y, 1);
        var x2 = new obstaclePrototype(this.xBound, current.y, 1);
        var y1 = new obstaclePrototype(current.x, 0, 1);
        var y2 = new obstaclePrototype(current.x, this.yBound, 1);

        virtualObs.push(x1);
        virtualObs.push(x2);
        virtualObs.push(y1);
        virtualObs.push(y2);

        return virtualObs;

    }

    function distanceMetric(boid1, boid2) {

        var distanceSq1 = Math.pow(boid1.x - boid2.x, 2) + Math.pow(boid1.y - boid2.y, 2);
        //var distanceSq2 = Math.pow(boid1.x - boid2.x - this.xBound, 2) + Math.pow(boid1.y - boid2.y - this.yBound, 2);

        return Math.sqrt(distanceSq1);
        //return Math.min(Math.sqrt(distanceSq2), Math.sqrt(distanceSq1));
    }

    function initializeBOIDS(NUM_BOIDS) {
        for (var i = 0; i < NUM_BOIDS; i++) {
            var newBOID = new BOID(this.parameters, this.xBound, this.yBound);
            newBOID.useErrorData = this.useErrorData;
            newBOID.errorLevel = this.errorLevel;
            this.boidSet.push(newBOID);
        }
    }

    function initializeTargetBOID() {
        this.targetBOID = new BOID(this.parameters, this.xBound, this.yBound);
        this.targetBOID.isTarget = true;
        //this.targetBOID.speed = 0;
        this.boidSet.push(this.targetBOID);
    }

    function initializeObstacles() {

        //how many obstacles to generate?
        var numObstacles = Math.floor(Math.random() * 75) + 25;

        //generate at random x,y position with random radius
        for (var index = 0; index < numObstacles; index++) {
            var x = Math.floor(Math.random() * this.xBound) + 1;
            var y = Math.floor(Math.random() * this.yBound) + 1;
            var r = Math.floor(Math.random() * 50);

            var obst = new obstaclePrototype(x,y,r);
            this.obstacles.push(obst);

        }
    }

    return boidEngine;

});
