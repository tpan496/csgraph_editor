var svgns = "http://www.w3.org/2000/svg"
var drawCircle = function (x, y, radius, fill, stroke, strokeWidth) {
    var circle = document.createElementNS(svgns, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', strokeWidth);
    circle.setAttribute('transform-origin', 'center');
    circle.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    circle.setAttribute('vector-effect', 'non-scaling-stroke');
    circle.setAttribute('position-x', x);
    circle.setAttribute('position-y', y);
    circle.setAttribute('origin-x', x);
    circle.setAttribute('origin-y', y);
    circle.setAttribute('radius', radius);
    return circle;
};

var drawRect = function (x, y, w, h) {
    var rect = document.createElementNS(svgns, 'rect');
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'width', w);
    rect.setAttributeNS(null, 'height', h);
    rect.setAttribute('stroke', 'rgb(0,122,255)');
    rect.setAttribute('fill', 'transparent');
    rect.setAttribute('stroke-dasharray', [2, 2]);
    rect.setAttribute('stroke-width', 2);
    return rect;
};

var drawLine = function (x1, y1, x2, y2, w, color) {
    var line = document.createElementNS(svgns, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('x2', x2);
    line.setAttribute('y1', y1);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', w);
    line.setAttribute('transform-origin', 'center');
    line.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    line.setAttribute('position-x', (x1 + x2) / 2);
    line.setAttribute('position-y', (y1 + y2) / 2);
    line.setAttribute('origin-x', (x1 + x2) / 2);
    line.setAttribute('origin-y', (y1 + y2) / 2);
    return line;
};

var drawDashedLine = function (x1, y1, x2, y2, array, w, color) {
    var line = document.createElementNS(svgns, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('x2', x2);
    line.setAttribute('y1', y1);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', w);
    line.setAttribute('stroke-dasharray', array);
    line.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    line.setAttribute('transform-origin', 'center');
    line.setAttribute('position-x', (x1 + x2) / 2);
    line.setAttribute('position-y', (y1 + y2) / 2);
    line.setAttribute('origin-x', (x1 + x2) / 2);
    line.setAttribute('origin-y', (y1 + y2) / 2);
    return line;
};

var drawText = function (x, y, t) {
    var text = document.createElementNS(svgns, 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('transform-origin', 'center');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', 'Arial');
    text.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    text.setAttribute('vector-effect', 'non-scaling-stroke');
    text.setAttribute('fill', 'black');
    text.setAttribute('stroke-width', '0.5px');
    text.setAttribute('pointer-events', 'none');
    text.setAttribute('position-x', x);
    text.setAttribute('position-y', y);
    text.setAttribute('origin-x', x);
    text.setAttribute('origin-y', y);
    text.setAttribute('class', 'text');
    text.setAttribute('font-size', 15);
    text.setAttribute('alignment-baseline', 'central');
    if (t === "") {
        text.textContent = 'text';
    } else {
        text.textContent = t;
    }
    return text;
};

var drawArrowHead = function (edge) {
    var a = 15.0;
    var x1 = parseFloat(edge.getAttribute('x1'));
    var x2 = parseFloat(edge.getAttribute('x2'));
    var y1 = parseFloat(edge.getAttribute('y1'));
    var y2 = parseFloat(edge.getAttribute('y2'));
    var polygon = document.createElementNS(svgns, "polygon");
    svg.appendChild(polygon);

    var d = dist2([x1, y1], [x2, y2]);
    var dx = Math.abs(x1 - x2);
    var dy = Math.abs(y1 - y2);

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


    for (value of array) {
        var point = svg.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        polygon.points.appendItem(point);
    }

    polygon.setAttribute('class', 'arrow-head');
    polygon.setAttribute('transform-origin', 'center');
    polygon.setAttribute('fill', 'black');

    return polygon;
};

var drawInputBox = function (x, y, w, h) {
    var foreign = document.createElementNS(svgns, 'foreignObject');
    foreign.setAttribute('x', x);
    foreign.setAttribute('y', y);
    foreign.setAttribute('width', 100);
    foreign.setAttribute('height', 100);
    var input = document.createElement('input')
    input.x = x;
    input.y = y;
    input.type = 'text';
    input.value = 'text';
    input.style.textAlign = "center";
    input.style.fontSize = "15pt";
    input.size = 4;
    input.style.paddingTop = 0;
    foreign.appendChild(input);
    return foreign;
};

var drawHalfCircle = function (x, y, r) {
    var g = document.createElementNS(svgns, 'g');
    var path = document.createElementNS(svgns, 'path');
    var R = r;
    var r = 15;
    if(R<15){
        r = R*0.8;
    }
    var xx = x;
    var yy = y - (Math.sqrt(R*R-r*r/8)+r/Math.sqrt(2));
    path.setAttribute('d', describeArc(xx,yy,r,-135,135));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', 1.5);
    path.setAttribute('stroke', 'black');

    var polygon = document.createElementNS(svgns, "polygon");
    var x = xx - r*8/15, y = yy - r*2/15;
    var theta = Math.PI / 6;
    var gamma = Math.PI - Math.PI / 6 - Math.PI / 3;
    var xLeft = x - 15 * Math.cos(theta),
        yLeft = y + 15 * Math.sin(theta),
        xRight = x + 15 * Math.cos(gamma),
        yRight = y + 15 * Math.sin(gamma);

    var array = arr = [[xLeft, yLeft],
    [xRight, yRight],
    [x, y]];

    for (value of array) {
        var point = svg.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        polygon.points.appendItem(point);
    }

    polygon.setAttribute('class', 'arrow-head');
    polygon.setAttribute('transform-origin', 'center');
    polygon.setAttribute('fill', 'black');

    g.appendChild(path);
    g.appendChild(polygon);
    return g;
};

var updateHalfCircle = function (node, loop, x, y, r) {
    var g = drawHalfCircle(x, y, r);
    if(loop.getAttribute('visibility') == 'hidden'){
        g.setAttribute('visibility', 'hidden');
    }
    var terminal = node.children[4];
    node.removeChild(terminal);
    node.removeChild(loop);
    node.appendChild(g);
    node.appendChild(terminal);
};

var polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

var describeArc = function(x, y, radius, startAngle, endAngle) {

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}