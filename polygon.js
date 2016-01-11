var earcut = require('earcut');
var triangle = require("./triangle.js");

function triangulate(poly) {
  // poly is ordered list of points
  var inp = [];
  for (var i=0; i<poly.length; i++) {
    inp.push(poly[i].x);
    inp.push(poly[i].y);
  }
  var res = earcut(inp);
  var triangles = [];
  for (var i=0; i<res.length; i+=3) {
    triangles.push([poly[res[i]],
                    poly[res[i+1]],
                    poly[res[i+2]]]);
  }
  return triangles;
}

function contains(poly, p) {
  var triangles = triangulate(poly);
  for (var i=0; i<triangles.length; i++) {
    if (triangle.contains(triangles[i], p)) {
      return true;
    }
  }
  return false;
}

function boundingBox(poly) {
  var res = {
    x: {min: null,
        max: null},
    y: {min: null,
        max: null}
  }
  for (var i=0; i<poly.length; i++) {
    res.x.min = (res.x.min == null || poly[i].x < res.x.min) ? poly[i].x : res.x.min;
    res.x.max = (res.x.max == null || poly[i].x > res.x.max) ? poly[i].x : res.x.max;
    res.y.min = (res.y.min == null || poly[i].y < res.y.min) ? poly[i].y : res.y.min;
    res.y.max = (res.y.max == null || poly[i].y > res.y.max) ? poly[i].y : res.y.max;
  }
  return res;
}

function sample(poly) {
  // not implemented yet
}

module.exports = {
  triangulate: triangulate,
  contains: contains,
  boundingBox: boundingBox,
}
