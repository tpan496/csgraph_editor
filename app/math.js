/**
 * @author tpan496
 * Script that covers mathematical operations.
 */

/**
 * Returns a random number in [min,max]
 * @param {minimum} min 
 * @param {maximum} max 
 */
var randomRange = function (min, max) {
    return Math.random() * (max - min) + min;
};

/**
 * Returns the distance between a and b, but
 * only in terms of horizontal one
 * @param {point a} a 
 * @param {point b} b 
 */
var dist = function (a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var mult = 1;
    if (dx > 0 && dy > 0) {
        mult = -1;
    }
    return Math.sqrt(dx * dx + dx * dx) * mult;
};

/**
 * Returns the distance between a and b
 * @param {point a} a 
 * @param {point b} b 
 */
var dist2 = function (a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Returns the transformation matrix of object
 * @param {object} x 
 */
var getMatrix = function (x) {
    var matrix = x.getAttribute("transform").slice(7, -1).split(' ');
    for (var i = 0; i < 6; i++) {
        matrix[i] = parseFloat(matrix[i]);
    };
    return matrix;
};

/**
 * Turns the matrix into a string
 * @param {matrix} m 
 */
var matrixToString = function (m) {
    return "matrix(" + m.join(' ') + ")";
};

/**
 * Returns the length of a vector
 * @param {2d vector} v 
 */
var absoluteLength = function (v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};

/**
 * Updates x,y position of object
 * @param {object} x 
 * @param {horizontal shift} dx 
 * @param {vertical shift} dy 
 */
var updateXY = function (x, dx, dy) {
    var prevX = getX(x);
    var prevY = getY(x);
    x.setAttribute("position-x", prevX + dx);
    x.setAttribute("position-y", prevY + dy);
};

/**
 * Updates radius of object
 * @param {object} x 
 * @param {horizontal shift} dx 
 */
var updateRadius = function (x, dx) {
    var r = getRadius(x);
    x.setAttribute("radius", r + dx);
};

/**
 * Returns x position of object
 * @param {object} x 
 */
var getX = function (x) {
    return parseFloat(x.getAttribute("position-x"));
};

/**
 * Returns y position of object
 * @param {object} x 
 */
var getY = function (x) {
    return parseFloat(x.getAttribute("position-y"));
};

/**
 * Returns the absolute x position of object
 * @param {object} x 
 */
var getAbsoluteX = function (x) {
    var currentX = getX(x);
    var originX = parseFloat(x.getAttribute("origin-x"));
    return currentX - originX;
};

/**
 * Returns the absolute y position of object
 * @param {object} x 
 */
var getAbsoluteY = function (x) {
    var currentY = getY(x);
    var originY = parseFloat(x.getAttribute("origin-y"));
    return currentY - originY;
};

/**
 * Returns the current radius of object
 * @param {object} x 
 */
var getRadius = function (x) {
    return parseFloat(x.getAttribute("radius"));
};

/**
 * Returns the original radius of object
 * @param {object} x 
 */
var getBaseRadius = function (x) {
    return parseFloat(x.getAttribute("r"));
};

/**
 * Re-position an edge accroding to two nodes
 * @param {edge} edge 
 * @param {arrow head} head 
 * @param {out node} node1 
 * @param {in node} node2 
 */
var reshapeEdge = function (edge, head, node1, node2) {
    var r1x = getX(node1);
    var r1y = getY(node1);
    var r1 = node1.children[0].getAttribute('radius');
    var r2x = getX(node2);
    var r2y = getY(node2);
    var r2 = node2.children[0].getAttribute('radius');

    var d = Math.abs(dist2([r1x, r1y], [r2x, r2y]));
    var dx = Math.abs(r1x - r2x);
    var dy = Math.abs(r1y - r2y);
    var sina = d == 0 ? 0 : dy / d;
    var cosa = d == 0 ? 0 : dx / d;

    var x1, x2, y1, y2 = 0;
    if (r1x < r2x) {
        x1 = r1x + r1 * cosa;
        x2 = r2x - r2 * cosa;
    } else {
        x1 = r1x - r1 * cosa;
        x2 = r2x + r2 * cosa;
    }

    if (r1y < r2y) {
        y1 = r1y + r1 * sina;
        y2 = r2y - r2 * sina;
    } else {
        y1 = r1y - r1 * sina;
        y2 = r2y + r2 * sina;
    }

    edge.setAttribute('x1', x1);
    edge.setAttribute('x2', x2);
    edge.setAttribute('y1', y1);
    edge.setAttribute('y2', y2);

    if (!head) {
        return;
    }
    // arrowhead
    var a = 15;
    var theta = Math.acos(dx / d) - Math.PI / 6;
    var gamma = Math.PI - theta - Math.PI / 3;

    var xLeft, yLeft, xRight, yRight;
    if (x1 < x2) {
        xLeft = x2 - a * Math.abs(Math.cos(theta));
        if (gamma < Math.PI / 2) {
            xRight = x2 + a * Math.abs(Math.cos(gamma));
        } else {
            xRight = x2 - a * Math.abs(Math.cos(gamma));
        }
    } else {
        xLeft = x2 + a * Math.abs(Math.cos(theta));
        if (gamma < Math.PI / 2) {
            xRight = x2 - a * Math.abs(Math.cos(gamma));
        } else {
            xRight = x2 + a * Math.abs(Math.cos(gamma));
        }
    }

    if (y1 < y2) {
        yLeft = y2 - a * Math.sin(theta);
        yRight = y2 - a * Math.sin(gamma);
    } else {
        yLeft = y2 + a * Math.sin(theta);
        yRight = y2 + a * Math.sin(gamma);
    }


    var array = arr = [[xLeft, yLeft],
    [xRight, yRight],
    [x2, y2]];

    head.setAttribute('points', '');
    for (value of array) {
        var point = svg.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        head.points.appendItem(point);
    }
};

/**
 * Reposition all the edges related to the
 * object node
 * @param {object node} x 
 */
var reshapeEdges = function (x) {
    var id = x.getAttribute('id');
    var edges = getEdges(id);
    var l = edges.length;
    for (i = 0; i < l; i++) {
        var edge = edges[i];
        var v1 = edge.children[0].getAttribute('v1');
        var v2 = edge.children[0].getAttribute('v2');
        reshapeEdge(edge.children[0], edge.children[1], V[v1], V[v2]);
    }
};