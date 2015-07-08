define(function(require) {

    var BOID = function() {

        this.x = Math.floor(Math.random() * 800) + 1;
        this.y = Math.floor(Math.random() * 600) + 1;
        this.orientation = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * 5;
    };


    return BOID;

});
