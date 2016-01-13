module.exports = {
    subtract: function subtract(p1, p2) {
        return {x: p1.x - p2.x, y: p1.y - p2.y}
    },
    add: function add(p1, p2) {
        return {x: p1.x + p2.x, y: p1.y + p2.y}
    },
    scale: function scale(p, c) {
        return {x: p.x * c, y: p.y*c}
    },
    equals: function equals(p1, p2, tol) {
      return (equalsScalar(p1.x, p2.x, tol) && equalsScalar(p1.y, p2.y, tol));
    },
    equalsScalar: function equals(x, y, tol) {
      tol = tol ? tol : 0.001;
      return Math.abs(x - y) < tol;
    },
};
