var triangle = require("./triangle.js");
var angle = require("./angle.js");
var line = require("./line.js");
var polygon = require("./polygon.js");


function Rectangle(length, width, centre, rotation) {
    // rotation should be between 0 and 180
    this._rot = angle.toRadians(rotation);
    var trigs = {cos: Math.cos(this._rot), sin: Math.sin(this._rot)};
    // obtain corners by rotating from rectilinear reference frame
    // and translating with centre
    this.corners = [];
    var l2 = 0;
    var w2 = 0;
    for (var w = -1; w <= 1; w += 2) {
        for (var l = -1; l <= 1; l += 2) {
            l2 = l * length / 2;
            w2 = w * width / 2;
            this.corners.push({
                x: trigs.cos * w2 - trigs.sin * l2 + centre.x,
                y: trigs.sin * w2 + trigs.cos * l2 + centre.y,
            });
        }
    }
    this.sides = [];
    for (var i=0; i<this.corners.length; i++) {
      for (var j=0; j<i; j++) {
        if (this.corners[i].x == this.corners[j].x || this.corners[i].y == this.corners[j].y) {
          this.sides.push([this.corners[i], this.corners[j]])
        }
      }
    }
    this.length = length;
    this.width = width;
    this.centre = centre;
    this.rotation = rotation;
}

Rectangle.prototype.draw = function draw(two) {
    var rect = two.makeRectangle(
        Math.round(this.centre.x),
        Math.round(this.centre.y),
        Math.round(this.width),
        Math.round(this.length)
        );
    rect.rotation = this._rot;
    rect.stroke = 'black';
    rect.fill = '#00ff00';
    this.path = rect;
};

Rectangle.prototype.intersects = function intersects(poly) {
    // poly must have attribute corners, which is an array of points
    // that are assumed to be in a sensible order for enclosing
    // a polygon
    if (poly.constructor === Rectangle) {
        // sample from one and check if it is contained in the other
        var n = 100;
        var cost = 0;
        var samples = this.sample(n);
        // call vectorized contains here
        for (var i=0; i<samples.length; i++) {
            if (poly.contains(samples[i])) {
                cost += 1;
            }
        }
        // no intersections found
        return cost/n;
    } else {
      console.log("not a Rectangle");
      return 0;
    }
};

Rectangle.prototype.within = function within(poly) {
    // poly assumed same as intersects
    // checks that rectangle lies within polygon
    var n = 100;
    var cost = 0;
    var samples = this.sample(n);
    for (var i=0; i<samples.length; i++) {
        if (!polygon.contains(poly, samples[i])) {
            cost += 1;
        }
    }
    return cost/n;

    // for (var i=0; i<this.corners.length; i++) {
    //   if (!polygon.contains(poly, this.corners[i])) {
    //     return false;
    //   }
    // }
    // for (var i=0; i<poly.length; i++) {
    //   var l = (i != poly.length - 1) ? poly.slice(i, i+2) : [poly[i], poly[0]];
    //   for (var j=0; j<this.sides.length; j++) {
    //     if (line.intersect(this.sides[j], l)) {
    //       return false;
    //     }
    //   }
    // }
    // return true;
};

Rectangle.prototype.open = function open() {
    // checks that one or both ends are open (accessible)
};

Rectangle.prototype.triangulate = function triangulate() {
    return [
        this.corners.slice(0, 3),
        this.corners.slice(1, 4)
    ]
};

Rectangle.prototype.sample = function sample(n) {
    // TODO: speed this up by using vectorization available within triangle.sample?
    n = n != null ? n : 1;
    var samples = [];
    var triangles = this.triangulate();
    for (var i=0; i<n; i++) {
        var heads = Math.round(Math.random());
        if (heads) {
            samples.push(triangle.sample(triangles[0])[0]);
        } else {
            samples.push(triangle.sample(triangles[1])[0]);
        }
    }
    return samples;
};

Rectangle.prototype.contains = function contains(p) {
    // p can be either an array or a single point
    // either way, this function returns true if any point is contained by
    // the rectangle
    var triangles = this.triangulate();
    var contains = (triangle.contains(triangles[0], p) || triangle.contains(triangles[1], p));
    return contains;
};

module.exports = Rectangle;
