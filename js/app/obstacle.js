define(function(require) {

    /*
    To make writing the simulation easier, I'll approximate all obstacles as circles for now.
    */
    var obstacle = function(xPos, yPos, radius) {
        this.x = xPos;
        this.y = yPos;
        this.radius = radius;
    };

    return obstacle;

});
