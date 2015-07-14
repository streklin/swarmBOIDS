define(function(require) {

    var physics = function(boidSet, xBound, yBound) {
        this.boidSet = boidSet;
        this.xBound = xBound;
        this.yBound = yBound;
    };

    physics.prototype.update = function() {
        for (var i = 0; i < this.boidSet.length; i++) {

            var current = this.boidSet[i];

            if (current.isTarget) continue;

            current.x += current.speed * Math.cos(current.orientation);
            current.y += current.speed * Math.sin(current.orientation);

            current.x = wrapValue(current.x, this.xBound);
            current.y = wrapValue(current.y, this.yBound);
        }
    };

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

    return physics;

});
