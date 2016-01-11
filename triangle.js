var point = require("./point.js");
var numeric = require("numeric");

//TODO: vectorize contains (given list of inputs
// if any are contained then return true)
function contains(triangle, p) {
    // returns true if triangle contains any of the points
    var origin = triangle[0];
    var v1 = point.subtract(triangle[1], origin);
    var v2 = point.subtract(triangle[2], origin);
    var A = [[v1.x, v2.x], [v1.y, v2.y]];
    if (p.constructor === Array) {
      var b = [];
      for (var i=0; i<p.length; i++) {
        var p0 = point.subtract(p[i], origin);
        b.push([p0.x, p0.y]);
        var x = numeric.dot(numeric.inv(A), numeric.transpose(b));
      }
      for (var i=0; i<x.length; i++) {
        if (x[0][i] >=0 && x[0][i] <= 1
          && x[1][i] >=0 && x[1][i] <= 1
          && (x[0][i] + x[1][i] <= 1)) {
            return true;
        } else {
            return false;
        }
      }
    } else {
      var p0 = point.subtract(p, origin);
      var b = [p0.x, p0.y];
      var x = numeric.dot(numeric.inv(A), b);
      if (x[0] >=0 && x[0] <= 1
        && x[1] >=0 && x[1] <= 1
        && (x[0] + x[1] <= 1)) {
          return true;
      } else {
          return false;
      }
    }
}

function sample(triangle, n) {
    // triangle assumed to be array of 3 points
    n = n != null ? n : 1;
    var samples = [];
    var origin = triangle[0];
    var v1 = point.subtract(triangle[1], origin);
    var v2 = point.subtract(triangle[2], origin);
    for (var i=0; i<n; i++) {
        samples.push(
            point.add(
                point.add(
                    point.scale(v1, Math.random()),
                    point.scale(v2, Math.random())
                ),
                origin
            )
        );
    }
    return samples;
}

module.exports = {
  contains: contains,
  sample: sample,
}
