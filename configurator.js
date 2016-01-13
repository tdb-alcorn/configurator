"use strict";

var numeric = require("numeric");
var Rectangle = require("./rectangle.js");
var triangle = require("./triangle.js");
var angle = require("./angle.js");
var point = require("./point.js");
var polygon = require("./polygon.js");
var line = require("./line.js");

//var configurator = (typeof exports === "undefined") ? (function configurator() {}) : (exports);
//if (typeof global !== "undefined") { global.configurator = configurator; }

//configurator.version = "0.0.0";

// interface Point: {x, y}

var Nspaces = 5;

var space = {
    length: 100,
    width: 37,
    area: 3700,
};
// var bounds = {
//     corners: [{x: 0, y: 0},
//         {x: 500, y: 0},
//         {x: 500, y: 500},
//         {x: 0, y: 500}],
//     area: 250000,
// };

// helper methods

function unvectorise(vec) {
    var rects = [];
    for (var i=0; i<vec.length; i+=3) {
        rects.push(new Rectangle(space.length, space.width, {
            x: vec[i],
            y: vec[i+1]},
            angle.toDegrees(vec[i+2])));
    }
    return rects;
}


//function to minimise
function cost(vector) {
    var rects = unvectorise(vector);
    //var cost = Nmax - rects.length;
    var cost = 0;
    for (var i=0; i<rects.length; i++) {
        // check that no rect intersects this rect
        for (var j=0; j<rects.length; j++) {
            if (j!=i) {
              var intersect_cost = Math.pow(100 * rects[i].intersects(rects[j]), 4);
              // console.log('intersection cost for ['+i+']['+j+']: '+intersect_cost);
              cost += intersect_cost;
            }
        }
        // TODO: check that this rect is open
        // check that rect is not out of bounds
        var bounds_cost = Math.pow(100 * rects[i].within(bounds.corners), 4);
        //console.log('bounds cost for ['+i+']: '+bounds_cost);
        cost += bounds_cost;
        var centre_dist_cost = 5 * Math.pow(line.lengthManhattan([bounds.centre, rects[i].centre])/bounds.side, 2);
        cost += centre_dist_cost;
    }
    var fcost = Math.pow(cost, 2);
    //console.log('Total cost on this iteration: ' + fcost);
    return fcost;
}

function costie(Nmax) {
  return cost;
}

function drawAndCost(vector) {
  return function(vector, two, bounds) {
    var rects = unvectorise(vector);
    draw(two, bounds, rects);
    return cost(vector);
  };
}

function drawBounds(two, poly) {
  var inp = [];
  for (var i=0; i<poly.length; i++) {
    inp.push(poly[i].x);
    inp.push(poly[i].y);
  }
  var path = two.makePath.apply(two, inp);
  path.stroke = 'black';
  return path;
}

function startingVector(n) {
  var vec = [];
  var bb = polygon.boundingBox(bounds.corners);
  for (var i=0; i<n; i++) {
    vec.push(Math.round(Math.random()*(bb.x.max - bb.x.min)+bb.x.min));
    vec.push(Math.round(Math.random()*(bb.y.max - bb.y.min)+bb.y.min));
    vec.push(0);  // always start with 0 rotation
  }
  return vec;
}

function draw(two, bounds, rects) {
  two.clear();
  drawBounds(two, bounds.corners);
  for (var i=0; i<rects.length; i++) {
      rects[i].draw(two);
  }
  two.update();
}

var bounds = {corners: [],
              area: 0};

function main() {
  var canvas = document.getElementById('canvas');
  var canvasPosition = {
    x: canvas.offsetLeft,
    y: canvas.offsetTop
  };
  canvas.addEventListener("click", function(e) {
    var mouse = {
        x: e.pageX - canvasPosition.x,
        y: e.pageY - canvasPosition.y
    }
    bounds.corners.push(mouse);
    var ctx = canvas.getContext("2d");
    ctx.moveTo(mouse.x-5,mouse.y);
    ctx.lineTo(mouse.x+5,mouse.y);
    ctx.moveTo(mouse.x,mouse.y-5);
    ctx.lineTo(mouse.x,mouse.y+5)
    ctx.stroke();
  });

  // draw solution
  var go = document.getElementById('go');
  go.addEventListener('click', function() {
      canvas.style.display = 'none';
      go.style.display = 'none';

      var bb = polygon.boundingBox(bounds.corners);
      bounds.area = (bb.x.max-bb.x.min)*(bb.y.max-bb.y.min);
      bounds.centre = polygon.centre(bounds.corners);
      bounds.side = Math.sqrt(bounds.area);
      var Nmax = Math.floor(bounds.area/space.area);

      var solutionElt = document.getElementById('solution');
      var params = {width: 500, height: 500};
      var two = new Two(params).appendTo(solutionElt);

      var boosted = false;
      var Nvecs = 1;
      var mincost;
      var solution;

      if (!boosted) {
        for (var i=0; i<Nvecs; i++) {
          var svec = startingVector(Nspaces);
          var tol = 1;
          var result = numeric.uncmin(cost, svec, tol);
          if (!solution || !mincost || result.f < mincost) {
            mincost = result.f;
            solution = result.solution;
          }
        }
      } else {
        var svecs = [];
        for (var i=0; i<Nvecs; i++) {
          svecs.push(startingVector(Nspaces));
        }
        var result = minimise(cost,
            soln(minimise(cost, svecs, 1).sort(solnCost).slice(0, Math.ceil(Nvecs/5))),
            0.1).sort(solnCost)[0];
        solution = result.solution;
        mincost = result.f;
      }

      console.log('cost: ' + mincost)
      console.log('solution: ' + solution);
      var rects = unvectorise(solution);
      draw(two, bounds, rects);
  });

}

function solnCost(result) {
  return result.f;
}

function soln(result) {
  var res = [];
  for (var i=0; i<result.length; i++) {
    res.push(result[i].solution);
  }
  return res;
}

function minimise(cost, vectors, tol) {
  tol = tol ? tol : 0.1;
  var result = [];
  for (var i=0; i<vectors.length; i++) {
    result.push(numeric.uncmin(cost, vectors[i], tol));
  }
  return result;
}

document.addEventListener('DOMContentLoaded', main);
