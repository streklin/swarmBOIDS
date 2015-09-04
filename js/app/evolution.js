define(function (require) {

    var simulatorObj = require('simulator');
    var Statistics = require('statistics');
    var $ = require('jquery');

    var EVOLUTION_CONSTANTS = {
        MAX_NHD_SIZE: 75,
        MAX_SPEED: 20,
        MAX_DELTA_SPEED: 20,
        MAX_DELTA_ORIENTATION: 1,
        MAX_BOID_DISTANCE: 10
    };

    var evolution = function (populationSize, trials, mutationRate, crossOverRate, xLimit, yLimit) {
        this.populationSize = populationSize;
        this.trials = trials;
        this.mutationRate = mutationRate;
        this.crossOverRate = crossOverRate;
        this.xLimit = xLimit;
        this.yLimit = yLimit;

        this.population = [];
    };

    evolution.prototype.run = function (num_boids, errorLevel) {

        this.errorLevel = errorLevel;

        initializePopulation.call(this);

        for (var t = 0; t < this.trials; t++) {

            console.log('Running Trail #: ' + t);

            this.wheelPosition = 0;
            var trialResults = [];
            var totalFitness = 0;
            var trialStatistics = [];

            for (var p = 0; p < this.populationSize; p++) {

                var parameters = this.population[p];
                var simulation = new simulatorObj(parameters, this.xLimit, this.yLimit, num_boids, errorLevel);

                var fitnessResults = simulation.run(5, 1000);

                //calculate fitness statistics
                var average = Statistics.findAverage(fitnessResults);
                var std = Statistics.findStandardDev(fitnessResults);

                trialResults.push({
                    average: average,
                    std: std
                });

                totalFitness += average;
                trialStatistics.push(average);
            }

            trialResults = populationSort.call(this, trialResults, num_boids, totalFitness);

            var trialAverage = Statistics.findAverage(trialStatistics);
            var html = '<div><span>Trial #' + t + 'Average Fitness :</span>' + trialAverage + '</div>';
            $('#results').append(html);

            /*
            Create the next generation.
             */
            var newPopulation = [];

            while(newPopulation.length < this.populationSize) {

                //grab the mating pair
                var matingPair = selection.call(this, trialResults, totalFitness);

                //perform mutation on each mate
                matingPair[0] = mutation.call(this, matingPair[0]);
                matingPair[1] = mutation.call(this, matingPair[1]);

                //perform cross over
                var child = crossOver.call(this, matingPair[0], matingPair[1]);

                //add the resulting individual to the population
                newPopulation.push(child);
            }

            this.population = newPopulation;
        }

        return this.population;
    };


    /*
     Create the initial population from which to run the evolution algorithm on.
     */
    function initializePopulation() {

        this.population = [];

        for (var p = 0; p < this.populationSize; p++) {

            var minspeed = Math.ceil(Math.random() * EVOLUTION_CONSTANTS.MAX_SPEED);
            var diff = EVOLUTION_CONSTANTS.MAX_SPEED - minspeed;
            var maxspeed = Math.ceil(Math.random() * diff) + minspeed;

            var parameters = {
                min_boid_distance: Math.ceil(Math.random() * EVOLUTION_CONSTANTS.MAX_BOID_DISTANCE),
                min_boid_speed: minspeed,
                max_boid_speed: maxspeed,
                boid_nhd: Math.ceil(Math.random() * EVOLUTION_CONSTANTS.MAX_NHD_SIZE),
                delta_speed: Math.ceil(Math.random() * EVOLUTION_CONSTANTS.MAX_DELTA_SPEED),
                delta_orientation: Math.random() * EVOLUTION_CONSTANTS.MAX_DELTA_ORIENTATION
            };

            this.population.push(parameters);
        }

    };

    /*
    Sorts the population by fitness.
    */
    function populationSort(trialResults, num_boids) {

        return trialResults.sort(function(a, b) {
            return Statistics.compareMeans(a.average, a.std, b.average, b.std, num_boids);
        });

    };

    /*
     Selects the next individuals for mating or cross over. This presumes that the individuals have been sorted from most fit, to least fit
     and uses a roulette wheel style of selection.
     */
    function selection(individuals, totalFitness) {

        var matingPair = [];

        //spin the wheel
        spinWheel.call(this, totalFitness);

        //grab the individual
        var mate1Index = findOnWheel.call(this, individuals);
        matingPair.push(this.population[mate1Index]);

        //spin the wheel again
        spinWheel.call(this, totalFitness);

        //grab the individual
        var mate2Index = findOnWheel.call(this, individuals);
        matingPair.push(this.population[mate2Index]);

        //return the pair
        return matingPair;
    }

    function spinWheel(totalFitness) {
        this.wheelPosition += Math.random() * 5 * totalFitness;
        this.wheelPosition = this.wheelPosition % totalFitness;
    }

    function findOnWheel(individuals) {

        var index = 0;
        var wheel = 0;
        while (wheel < this.wheelPosition) {

            wheel += individuals[index].average;
            if (wheel > this.wheelPosition) return index;
            index++;
        }

        return index;
    }

    /*
     Performs the mutation operation on an individual
     */
    function mutation(original) {

        //mutate distance
        if (Math.random() < this.mutationRate) {
            original.min_boid_distance = randomValue(EVOLUTION_CONSTANTS.MAX_BOID_DISTANCE, 0);
        }

        //mutate min speed
        if (Math.random() < this.mutationRate) {
            original.min_boid_speed = randomValue(original.max_boid_speed, 0);
        }

        //mutate max speed
        if (Math.random() < this.mutationRate) {
            original.max_boid_speed = randomValue(EVOLUTION_CONSTANTS.MAX_SPEED, original.min_boid_speed);
        }

        //muate nhd
        if (Math.random() < this.mutationRate) {
            original.boid_nhd = randomValue(EVOLUTION_CONSTANTS.MAX_NHD_SIZE, 0);
        }

        //muatate delta speed
        if (Math.random() < this.mutationRate) {
            original.delta_speed = randomValue(EVOLUTION_CONSTANTS.MAX_DELTA_SPEED, 0);
        }

        //mutate delta orientation
        if (Math.random() < this.mutationRate) {
            original.delta_orientation = randomValue(EVOLUTION_CONSTANTS.MAX_DELTA_ORIENTATION, 0);
        }

        return original;

    }

    function randomValue(max, min) {
        var randomAmount = Math.random() * max;
        if (randomAmount < min) randomAmount = min;
        return randomAmount;
    }

    /*
     Performs the crossover operation on two individuals
     */
    function crossOver(individualAParams, individualBParams) {

        //determine if crossOver should occur
        if (Math.random() > this.crossOverRate) return individualAParams;

        var parametersA = convertToArray(individualAParams);
        var parametersB = convertToArray(individualBParams);

        var crossOverPoint = Math.floor(Math.random() * parametersA.length);

        for (var index = 0; index < parametersA.length; index++) {
            if (index < crossOverPoint) continue;
            parametersA[index] = parametersB[index];
        }

        var results = {
            min_boid_distance: parametersA[0],
            min_boid_speed: parametersA[1],
            max_boid_speed: parametersA[2],
            boid_nhd: parametersA[3],
            delta_speed: parametersA[4],
            delta_orientation: parametersA[5]
        };

        return results;

    }

    function convertToArray(params) {
        var value = [];

        value.push(params.min_boid_distance);
        value.push(params.min_boid_speed);
        value.push(params.max_boid_speed);
        value.push(params.boid_nhd);
        value.push(params.delta_speed);
        value.push(params.delta_orientation);

        return value;
    }

    return evolution;

});
