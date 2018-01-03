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
    rect.setAttribute('stroke-dasharray', [2,2]);
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
    var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    svg.appendChild(polygon);

    var d = dist2([x1, y1], [x2, y2]);
    var dx = Math.abs(x1 - x2);
    var dy = Math.abs(y1 - y2);

    var theta = Math.acos(dx / d) - Math.PI / 6;
    var gamma = Math.PI - theta - Math.PI / 3;

    var xLeft, yLeft, xRight, yRight;
    if(x1<x2){
        xLeft = x2 - a * Math.abs(Math.cos(theta));
        if(gamma < Math.PI/2){
            xRight = x2 + a*Math.abs(Math.cos(gamma));
        }else{
            xRight = x2 - a * Math.abs(Math.cos(gamma));
        }
    }else{
        xLeft = x2 + a * Math.abs(Math.cos(theta));
        if(gamma < Math.PI/2){
            xRight = x2 - a*Math.abs(Math.cos(gamma));
        }else{
            xRight = x2 + a * Math.abs(Math.cos(gamma));
        }
    }

    if(y1<y2){
        yLeft = y2 - a * Math.sin(theta);
        yRight = y2 - a * Math.sin(gamma);
    }else{
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