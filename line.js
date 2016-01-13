var point = require('./point.js');

function intersect(l1, l2) {
    var p0 = l1[0];
    var p1 = l1[1];
    var p2 = l2[0];
    var p3 = l2[1];

    var s1, s2;
    s1 = {x: p1.x - p0.x, y: p1.y - p0.y};
    s2 = {x: p3.x - p2.x, y: p3.y - p2.y};

    var s10_x = p1.x - p0.x;
    var s10_y = p1.y - p0.y;
    var s32_x = p3.x - p2.x;
    var s32_y = p3.y - p2.y;

    var denom = s10_x * s32_y - s32_x * s10_y;

    if(denom == 0) {
        return false;
    }

    var denom_positive = denom > 0;

    var s02_x = p0.x - p2.x;
    var s02_y = p0.y - p2.y;

    var s_numer = s10_x * s02_y - s10_y * s02_x;

    if((s_numer < 0) == denom_positive) {
        return false;
    }

    var t_numer = s32_x * s02_y - s32_y * s02_x;

    if((t_numer < 0) == denom_positive) {
        return false;
    }

    if((s_numer > denom) == denom_positive || (t_numer > denom) == denom_positive) {
        return false;
    }

    var t = t_numer / denom;

    var p = {x: p0.x + (t * s10_x), y: p0.y + (t * s10_y)};
    return p;
}

function collinear(A, B, C, tol) {
  tol = tol ? tol : 0.001;
  return Math.abs(A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)) < tol;
}

function sample(line) {
  var rand = Math.random();
  var p = point.subtract(line[1], line[0]);
  return point.add(point.scale(p, rand), line[0]);
}

function contains(line, p, tol) {
  if (_between(p.x, line[0].x, line[1].x) && _between(p.y, line[0].y, line[1].y)) {
    return collinear(line[0], line[1], p, tol);
  } else {
    return false;
  }
}

function length(line) {
  var dy = Math.abs(line[0].y - line[1].y);
  var dx = Math.abs(line[0].x - line[1].x);
  return Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
}

function lengthManhattan(line) {
  return Math.abs(line[0].y - line[1].y) + Math.abs(line[0].x - line[1].x);
}

function _between(n, bound1, bound2) {
  return ((n <= bound2 && n >= bound1) || (n >= bound2 && n >= bound1));
}

module.exports = {
  intersect: intersect,
  sample: sample,
  contains: contains,
  length: length,
  lengthManhattan: lengthManhattan,
}
