define(function(require) {

    var BOID_CONSTANTS = {
        min_boid_distance: 5,
        min_boid_speed: 2,
        max_boid_speed: 5,
        boid_nhd: 300,
        delta_speed: 0.5,
        delta_orientation: 0.05
    };

    var BOID = function() {
        this.x = Math.floor(Math.random() * 800) + 1;
        this.y = Math.floor(Math.random() * 600) + 1;
        this.orientation = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * 3 + 1;

        //eventually I want to consider individually altering these values
        this.boid_nhd = BOID_CONSTANTS.boid_nhd;
    };

    BOID.prototype.update = function(nearbyBOIDS) {

        if (nearbyBOIDS.length === 0) return;

        var averageSpeed = 0;
        var averagePositionX = 0;
        var averagePositionY = 0;

        var closestBoid = null;
        var closestsDistance = 1000000000;

        //closest boid
        for (var i = 0; i < nearbyBOIDS.length; i++) {
            if (closestBoid != null){

                if (closestsDistance > nearbyBOIDS[i].distance) {
                    closestBoid = nearbyBOIDS[i];
                    closestsDistance = nearbyBOIDS[i].distance;
                }

            } else {
                closestBoid = nearbyBOIDS[i];
                closestsDistance = nearbyBOIDS[i].distance;
            }

            //average speed
            averageSpeed += nearbyBOIDS[i].speed;

            //average position
            averagePositionX += nearbyBOIDS[i].x;
            averagePositionY += nearbyBOIDS[i].y;
        }

        averagePositionX /= nearbyBOIDS.length;
        averagePositionY /= nearbyBOIDS.length;
        averageSpeed /= nearbyBOIDS.length;

        //am I slower than the nearby boids?
        if (this.speed < averageSpeed) {
            this.speed += BOID_CONSTANTS.delta_speed;
            if (this.speed > BOID_CONSTANTS.max_boid_speed) this.speed = BOID_CONSTANTS.max_boid_speed;
        } else if (this.speed > averageSpeed) {
            this.speed -= BOID_CONSTANTS.delta_speed;
            if (this.speed < BOID_CONSTANTS.min_boid_speed) this.speed = BOID_CONSTANTS.min_boid_speed;
        }

        //am I too close
        if (closestsDistance < BOID_CONSTANTS.min_boid_distance) {

            var boidX = closestBoid.x - this.x;
            var boidY = closestBoid.y - this.y;

            var nextX = Math.cos(this.orientation);
            var nextY = Math.sin(this.orientation);

            var angle = innerProduct(boidX, boidY,nextX, nextY);

            if (angle < 0) {
                this.orientation += BOID_CONSTANTS.delta_orientation;
            } else {
                this.orientation -= BOID_CONSTANTS.delta_orientation;
            }

        } else {
            var boidX = averagePositionX - this.x;
            var boidY = averagePositionY - this.y;

            var nextX = Math.cos(this.orientation);
            var nextY = Math.sin(this.orientation);

            var angle = innerProduct(boidX, boidY,nextX, nextY);

            if (angle < 0) {
                this.orientation -= BOID_CONSTANTS.delta_orientation;
            } else {
                this.orientation += BOID_CONSTANTS.delta_orientation;
            }
        }


    };

    function innerProduct(x1, y1, x2, y2) {
        return x1 * -y2 +  x2 * y2;
    }

    return BOID;

});
