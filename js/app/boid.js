define(function (require) {

    var statistics = require('statistics');

    var BOID = function (BOID_CONSTANTS, xMax, yMax) {

        this.BOID_CONSTANTS = BOID_CONSTANTS;

        this.x = Math.floor(Math.random() * xMax) + 1;
        this.y = Math.floor(Math.random() * yMax) + 1;
        this.orientation = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * BOID_CONSTANTS.max_boid_speed;
        this.boid_nhd = BOID_CONSTANTS.boid_nhd;

        this.isTarget = false;
        this.sendingSignal = false;

    };

    BOID.prototype.update = function (nearbyBOIDS, signals, obstacles) {

        //if (nearbyBOIDS.length === 0) return calculateTransmission(signals, this.x, this.y);
        if (this.isTarget) {
            updateTarget.call(this,obstacles);
            return;
        }

        var averageSpeed = 0;
        var averagePositionX = 0;
        var averagePositionY = 0;

        var closestBoid = null;
        var closestsDistance = 1000000000;

        var targetX = -1;
        var targetY = -1;

        //closest boid
        for (var i = 0; i < nearbyBOIDS.length; i++) {
            if (closestBoid != null && !nearbyBOIDS[i].isTarget) {

                if (closestsDistance > nearbyBOIDS[i].distance) {
                    closestBoid = nearbyBOIDS[i];
                    closestsDistance = nearbyBOIDS[i].distance;
                }

            } else if (!nearbyBOIDS[i].isTarget) {
                closestBoid = nearbyBOIDS[i];
                closestsDistance = nearbyBOIDS[i].distance;
            }

            if (nearbyBOIDS[i].isTarget) {
                targetX = nearbyBOIDS[i].x;
                targetY = nearbyBOIDS[i].y;

                if (this.useErrorData) {
                    targetX = statistics.generateRandomError(nearbyBOIDS[i].x, this.errorLevel);
                    targetY = statistics.generateRandomError(nearbyBOIDS[i].y, this.errorLevel);
                }

                var signal = {
                    xs: targetX,
                    ys: targetY,
                    ts: 0
                };

                signals.push(signal);

            } else {
                //average speed
                averageSpeed += nearbyBOIDS[i].speed;

                //average position
                averagePositionX += nearbyBOIDS[i].x;
                averagePositionY += nearbyBOIDS[i].y;

            }

        }

        //check the obstacles, if we are too close to one we need to avoid it
        var hasObstacle = false;
        if (obstacles.length > 0) {
            obstacles.sort(function(a,b) {
                return a.distance - b.distance;
            });

            hasObstacle = true;
        }

        averagePositionX /= nearbyBOIDS.length;
        averagePositionY /= nearbyBOIDS.length;
        averageSpeed /= nearbyBOIDS.length;

        if (this.useErrorData) {
            averageSpeed = statistics.generateRandomError(averageSpeed, this.errorLevel);
            averagePositionX = statistics.generateRandomError(averagePositionX, this.errorLevel);
            averagePositionY = statistics.generateRandomError(averagePositionY, this.errorLevel);
        }

        var believedTarget = calculateTransmission(signals, this.x, this.y);

        averageSpeedRule.call(this, averageSpeed);

        if (hasObstacle && obstacles[0].distance < this.BOID_CONSTANTS.min_boid_distance) {
            tooCloseRule.call(this, obstacles[0]);
        } else if (closestsDistance < this.BOID_CONSTANTS.min_boid_distance) {
            tooCloseRule.call(this, closestBoid);
        } else if (believedTarget !== null) {
            targetRule.call(this, believedTarget.xs, believedTarget.ys);
        } else {
            targetRule.call(this, averagePositionX, averagePositionY);
        }

        if (believedTarget) this.sendingSignal = true; else this.sendingSignal = false;

        return believedTarget;

    };

    function updateTarget(obstacles) {
        //check the obstacles, if we are too close to one we need to avoid it
        var hasObstacle = false;
        if (obstacles.length > 0) {
            obstacles.sort(function(a,b) {
                return a.distance - b.distance;
            });

            hasObstacle = true;
        }

        if (hasObstacle && obstacles[0].distance < this.BOID_CONSTANTS.min_boid_distance) {
            tooCloseRule.call(this, obstacles[0]);
        }
    }

    function averageSpeedRule(averageSpeed) {
        var deltaSpeed = this.BOID_CONSTANTS.delta_speed;

        if (this.useErrorData) {
            deltaSpeed = statistics.generateRandomError(deltaSpeed, this.errorLevel);
        }

        if (this.speed < averageSpeed) {
            this.speed += deltaSpeed;
            if (this.speed > this.BOID_CONSTANTS.max_boid_speed) this.speed = this.BOID_CONSTANTS.max_boid_speed;
        } else if (this.speed > averageSpeed) {
            this.speed -= deltaSpeed;
            if (this.speed < this.BOID_CONSTANTS.min_boid_speed) this.speed = this.BOID_CONSTANTS.min_boid_speed;
        }
    }

    function tooCloseRule(closestBoid) {
        var boidX = closestBoid.x - this.x;
        var boidY = closestBoid.y - this.y;

        var nextX = Math.cos(this.orientation);
        var nextY = Math.sin(this.orientation);

        var angle = innerProduct(boidX, boidY, nextX, nextY);

        var deltaO = this.BOID_CONSTANTS.delta_orientation;

        if (this.useErrorData) {
            deltaO = statistics.generateRandomError(deltaO, this.errorLevel);
        }

        if (angle > 0) {
            this.orientation += deltaO;
        } else {
            this.orientation -= deltaO;
        }
    }

    function targetRule(X, Y) {
        var boidX = X - this.x;
        var boidY = Y - this.y;

        var nextX = Math.cos(this.orientation);
        var nextY = Math.sin(this.orientation);

        var angle = innerProduct(boidX, boidY, nextX, nextY);


        var deltaO = this.BOID_CONSTANTS.delta_orientation;

        if (this.useErrorData) {
            deltaO = statistics.generateRandomError(deltaO, this.errorLevel);
        }


        if (angle > 0) {
            this.orientation -= deltaO;
        } else {
            this.orientation += deltaO;
        }
    }

    function innerProduct(x1, y1, x2, y2) {
        return x1 * y2 - y1 * x2;
    }

    function calculateTransmission(signals,x, y) {
        if (signals.length == 0) return null;

        //find the newest signal, if that signal is older than 3 iterations do not re-transmit
        var result = null;
        var ts = 110;
        for (var index = 0; index < signals.length; index++) {
            if (signals[index].ts < ts) {
                result = signals[index];
                ts = result.ts;
            }
        }

        if (ts > 100) return null;

        return {
            x: x,
            y: y,
            xs: result.xs,
            ys: result.ys,
            ts: result.ts + 1
        };
    }

    return BOID;

});
