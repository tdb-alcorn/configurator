module.exports = {
    toDegrees: function toDegrees(radians) {
        return (radians % Math.PI) / Math.PI * 180;
    },
    toRadians: function toRadians(degrees) {
        return (degrees % 180) / 180 * Math.PI;
    },
}
