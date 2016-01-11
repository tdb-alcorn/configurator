"use strict";

var numeric = require("numeric");
var Rectangle = require("./rectangle.js");
var triangle = require("./triangle.js");
var angle = require("./angle.js");
var point = require("./point.js");
var polygon = require("./polygon.js");

//var configurator = (typeof exports === "undefined") ? (function configurator() {}) : (exports);
//if (typeof global !== "undefined") { global.configurator = configurator; }

//configurator.version = "0.0.0";

// interface Point: {x, y}

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
               cost += 100 * rects[i].intersects(rects[j]);
            }
        }
        // check that this rect is open
        // check that rect is not out of bounds
        cost += 1000 * rects[i].within(bounds.corners);
    }
    console.log(cost);
    return cost;
}

function costie(Nmax) {
  return cost;
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
      var Nmax = Math.floor(bounds.area/space.area);

      var solutionElt = document.getElementById('solution');
      var params = {width: 500, height: 500};
      var two = new Two(params).appendTo(solutionElt);

      drawBounds(two, bounds.corners);

      var svec = startingVector(10);

      var rects = unvectorise(svec);

      for (var i=0; i<rects.length; i++) {
          rects[i].draw(two);
      }
      two.update();

      // minimise it
      // need shim to vectorise and shim to unvectorise
      var tol = 0.1;
      var solution = numeric.uncmin(cost, svec, tol).solution;
      console.log(solution);
      var rects = unvectorise(solution);

      for (var i=0; i<rects.length; i++) {
          rects[i].draw(two);
      }
      two.update();

  });

}

document.addEventListener('DOMContentLoaded', main);
