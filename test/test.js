var assert = require('assert');
var triangle = require('../triangle');
var Rectangle = require('../rectangle.js');
var line = require('../line.js');
var polygon = require("../polygon.js");

describe('Triangle', function() {
    describe('#contains()', function() {
        var t = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}];
        it('should contain things it contains', function() {
            var p = {x: 0.7, y: 0.5};
            assert(triangle.contains(t, p));
        });
        it("should not contain things it doesn't", function() {
            var p = {x: 0.3, y: 0.7};
            assert(!triangle.contains(t, p));
        });
        it("should accept on the border", function() {
            var p = {x: 0.5, y: 0.5};
            assert(triangle.contains(t, p));
        });
    });
});

describe('Rectangle', function() {
  describe('#intersects()', function() {
    var r1 = new Rectangle(10, 10, {x: 5, y:5}, 0);
    it('should intersect this', function() {
      var r2 = new Rectangle(10, 10, {x: 9, y: 9}, 0);
      assert(r1.intersects(r2) > 0);
    });
    it('should not intersect this', function() {
      var r3 = new Rectangle(10, 10, {x: 21, y: 21}, 0);
      assert(r1.intersects(r3) == 0);
    });
  });
  describe('#contains()', function() {
    var r1 = new Rectangle(10, 10, {x:5, y:5}, 0);
    it('should contain this', function() {
      var p = {x: 5, y: 5};
      assert(r1.contains(p));
    });
    it('should not contain this', function() {
      var p = {x: 11, y: 11};
      assert(!r1.contains(p));
    });
    it('should contain these', function() {
      var p = [{x: 5, y: 5},
               {x: 7, y: 5}];
      assert(r1.contains(p));
    });
    it('should not contain these', function() {
      var p = [{x: 11, y: 11},
               {x: 15, y: 15}];
      assert(!r1.contains(p));
    })
  });
  describe('#within', function() {
    var poly = [{x:0, y:0},
      {x:10, y:0},
      {x:20, y:10},
      {x:10, y:10},
      {x:0, y:20}];
    it('should be within', function() {
      var r1 = new Rectangle(1, 1, {x:5, y:5}, 0);
      assert(r1.within(poly) == 0);
    });
    it('should be without', function() {
      var r2 = new Rectangle(1, 1, {x: 50, y: 50}, 0);
      assert(r2.within(poly) > 0);
    });
  });
});

describe('Line', function() {
  describe('#intersect', function() {
    var l1 = [{x: 0, y: 0}, {x: 1, y: 1}];
    it('should intersect', function() {
      var l2 = [{x:0, y: 1}, {x: 1, y: 0}];
      assert(line.intersect(l1, l2));
    });
    it('should not intersect', function() {
      var l2 = [{x: 0, y: 1}, {x: 1, y: 2}];
      assert(!line.intersect(l1, l2));
    });
  });
});

describe('Polygon', function() {
  describe('#contains', function() {
    var poly = [{x:0, y:0},
      {x:1, y:0},
      {x:2, y:1},
      {x:1, y:1},
      {x:0, y:2}];
    it('should contain this', function() {
      var p = {x: 0.5, y: 0.5};
      assert(polygon.contains(poly, p));
    });
    it('should not contain this', function() {
      var p = {x: 5, y: 5};
      assert(!polygon.contains(poly, p));
    });
  });
});

// var t1 = rects[i].triangulate()[0];
// var t2 = rects[i].triangulate()[1];
// for (var k=0; k<10; k++) {
//     var s1 = triangle.sample(t1, 1)[0];
//     var s2 = triangle.sample(t2, 1)[0];
//     if (triangle.contains(t1, s1) != true || triangle.contains(t2, s2) != true) {
//         console.log('self contains failed');
//     }
//     if (triangle.contains(t1, s2) || triangle.contains(t2, s1)) {
//         console.log("doesn't reject points not contained");
//         if (triangle.contains(t1, s2)) {
//         console.log(t1, s2);
//         }
//         if (triangle.contains(t2, s1)) {
//         console.log(t2, s1);
//         }
//     }
// }
