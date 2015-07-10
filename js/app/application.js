define(function(require) {

    var boidDisplay = require('boidDisplay');
    var boidEngine = require('boidEngine');
    var physics = require('physics');

    var NUM_BOIDS = 100;

    function init() {
        var displayObject = new boidDisplay(800, 600);
        var engine = new boidEngine(NUM_BOIDS, 800, 600);
        var physicsEngine = new physics(engine.boidSet, 800, 600);
        displayObject.boidSet = engine.boidSet;

        displayObject.draw();

        setInterval(function() {

            engine.update();
            physicsEngine.update();
            displayObject.draw();

        }, 50);

    }

    init();

});
