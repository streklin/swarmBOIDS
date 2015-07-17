define(function(require) {

    return {

        findAverage: function(values) {
            var sum = 0;

            for (var index = 0; index < values.length; index++) {
                sum += values[index];
            }

            return sum / values.length;
        },
        findStandardDevation: function(values) {
            var average = this.findAverage(values);

            var sum = 0;

            for (var index = 0; index < values.length; index++) {
                sum += Math.pow(average - values[index], 2);
            }

            return Math.sqrt(sum / values.length);
        }


    }

});
