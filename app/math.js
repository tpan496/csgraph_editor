var randomRange = function (min, max) {
    return Math.random() * (max - min) + min;
};

var dist = function (a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var mult = 1;
    if (dx > 0 && dy > 0) {
        mult = -1;
    }
    return Math.sqrt(dx * dx + dx * dx) * mult;
};

var getMatrix = function (x) {
    var matrix = x.getAttribute("transform").slice(7, -1).split(' ');
    for (var i = 0; i < 6; i++) {
        matrix[i] = parseFloat(matrix[i]);
    };
    return matrix;
};

var matrixToString = function (m) {
    return "matrix(" + m.join(' ') + ")";
};

var absoluteLength = function (v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};

var updateXY = function (x, dx, dy) {
    var prevX = parseFloat(x.getAttribute("position-x"));
    var prevY = parseFloat(x.getAttribute("position-y"));
    x.setAttribute("position-x", prevX + dx);
    x.setAttribute("position-y", prevY + dy);
};

var updateRadius = function (x, dx) {
    var r = parseFloat(x.getAttribute("radius"));
    x.setAttribute("radius", r + dx);
};

var getAbsoluteX = function (x) {
    var currentX = parseFloat(x.getAttribute("position-x"));
    var originX = parseFloat(x.getAttribute("origin-x"));
    return currentX - originX;
};

var getAbsoluteY = function (x) {
    var currentY = parseFloat(x.getAttribute("position-y"));
    var originY = parseFloat(x.getAttribute("origin-y"));
    return currentY - originY;
};

var getRadius = function (x) {
    return parseFloat(x.getAttribute("radius"));
};

var getBaseRadius = function (x) {
    return parseFloat(x.getAttribute("r"));
};