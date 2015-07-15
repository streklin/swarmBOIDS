define(function (require) {


    var BOID = function (BOID_CONSTANTS, xMax, yMax) {

        this.BOID_CONSTANTS = BOID_CONSTANTS;

        this.x = Math.floor(Math.random() * xMax) + 1;
        this.y = Math.floor(Math.random() * yMax) + 1;
        this.orientation = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * BOID_CONSTANTS.max_boid_speed;
        this.boid_nhd = BOID_CONSTANTS.boid_nhd;

        this.isTarget = false;

    };

    BOID.prototype.update = function (nearbyBOIDS) {

        if (nearbyBOIDS.length === 0) return;

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
            } else {
                //average speed
                averageSpeed += nearbyBOIDS[i].speed;

                //average position
                averagePositionX += nearbyBOIDS[i].x;
                averagePositionY += nearbyBOIDS[i].y;

            }

        }

        averagePositionX /= nearbyBOIDS.length;
        averagePositionY /= nearbyBOIDS.length;
        averageSpeed /= nearbyBOIDS.length;

        averageSpeedRule.call(this, averageSpeed);

        if (closestsDistance < this.BOID_CONSTANTS.min_boid_distance) {
            tooCloseRule.call(this, closestBoid);
        } else if (targetX > 0 && targetY > 0) {
            targetRule.call(this, targetX, targetY);
        } else {
            targetRule.call(this, averagePositionX, averagePositionY);
        }

    };

    function averageSpeedRule(averageSpeed) {
        if (this.speed < averageSpeed) {
            this.speed += this.BOID_CONSTANTS.delta_speed;
            if (this.speed > this.BOID_CONSTANTS.max_boid_speed) this.speed = this.BOID_CONSTANTS.max_boid_speed;
        } else if (this.speed > averageSpeed) {
            this.speed -= this.BOID_CONSTANTS.delta_speed;
            if (this.speed < this.BOID_CONSTANTS.min_boid_speed) this.speed = this.BOID_CONSTANTS.min_boid_speed;
        }
    }

    function tooCloseRule(closestBoid) {
        var boidX = closestBoid.x - this.x;
        var boidY = closestBoid.y - this.y;

        var nextX = Math.cos(this.orientation);
        var nextY = Math.sin(this.orientation);

        var angle = innerProduct(boidX, boidY, nextX, nextY);

        if (angle > 0) {
            this.orientation += this.BOID_CONSTANTS.delta_orientation;
        } else {
            this.orientation -= this.BOID_CONSTANTS.delta_orientation;
        }
    }

    function targetRule(X, Y) {
        var boidX = X - this.x;
        var boidY = Y - this.y;

        var nextX = Math.cos(this.orientation);
        var nextY = Math.sin(this.orientation);

        var angle = innerProduct(boidX, boidY, nextX, nextY);



        if (angle > 0) {
            this.orientation -= this.BOID_CONSTANTS.delta_orientation;
        } else {
            this.orientation += this.BOID_CONSTANTS.delta_orientation;
        }


    }

    function innerProduct(x1, y1, x2, y2) {
        return x1 * y2 - y1 * x2;
    }

    return BOID;

});
