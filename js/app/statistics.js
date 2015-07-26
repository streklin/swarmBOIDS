define(function(require) {

    return {

        findAverage: function(values) {
            var sum = 0;

            for (var index = 0; index < values.length; index++) {
                sum += values[index];
            }

            return sum / values.length;
        },
        findStandardDev: function(values) {
            var average = this.findAverage(values);

            var sum = 0;

            for (var index = 0; index < values.length; index++) {
                sum += Math.pow(average - values[index], 2);
            }

            return Math.sqrt(sum / values.length);
        },
        compareMeans: function(mean1, std1, mean2, std2, size) {
            var meanDiff = mean1 - mean2;
            var stdDiff = Math.sqrt( (Math.pow(std1, 2) / size) + (Math.pow(std2, 2) / size));
            var z = meanDiff / stdDiff;

            var pValue = 2 * (1 - std_n_cdf(z));

            if (pValue < 0.05) {
                return 0;
            } else if (mean1 > mean2) {
                return 1;
            } else {
                return -1;
            }
        }
    }


    /*
    Stole these functions from stack overflow, http://stackoverflow.com/questions/14846767/std-normal-cdf-normal-cdf-or-error-function
    */
    function std_n_cdf(x) {
        return cdf(x, 0, 1);
    }

    function cdf(x, mean, variance) {
        return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2 * variance))));
    }

    function erf(x) {
        // save the sign of x
        var sign = (x >= 0) ? 1 : -1;
        x = Math.abs(x);

        // constants
        var a1 =  0.254829592;
        var a2 = -0.284496736;
        var a3 =  1.421413741;
        var a4 = -1.453152027;
        var a5 =  1.061405429;
        var p  =  0.3275911;

        // A&S formula 7.1.26
        var t = 1.0/(1.0 + p*x);
        var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        return sign * y; // erf(-x) = -erf(x);
    }

});
