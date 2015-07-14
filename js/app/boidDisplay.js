define(function(require) {

    var BoidDisplay = function(width, height) {

        this.boidSet = [];
        setupCanvas.call(this, width, height);

    };

    BoidDisplay.prototype.draw = function() {

        this.canvasCTX.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(var i = 0; i < this.boidSet.length; i++) {
            var currentBoid = this.boidSet[i];

            if (currentBoid.isTarget) {
                drawTarget.call(this, currentBoid);
            } else {
                drawTriangle.call(this, currentBoid);
            }
        }

    };

    function drawTriangle(currentBoid) {

        var x = currentBoid.x;
        var y = currentBoid.y;
        var rad = currentBoid.orientation;

        this.canvasCTX.save();

        //Set the origin to the center of the image
        this.canvasCTX.translate(x, y);
        this.canvasCTX.rotate(rad);

        var path = new Path2D();

        path.moveTo(0, 0);
        path.lineTo(10, 2);
        path.lineTo(0, 4);

        this.canvasCTX.fill(path);

        this.canvasCTX.restore();

    }

    function drawTarget(currentBoid) {
        var x = currentBoid.x;
        var y = currentBoid.y;

        this.canvasCTX.fillStyle = '#FF0000';
        this.canvasCTX.fillRect(x-5,y-5,10,10);
        this.canvasCTX.fillStyle = '#000';
    }

    function setupCanvas(width, height) {
        var canvas = document.getElementById('boidUI');
        canvas.setAttribute('height', height);
        canvas.setAttribute('width', width);

        this.canvas = canvas;
        this.canvasCTX = canvas.getContext('2d');
    }

    return BoidDisplay;

});
