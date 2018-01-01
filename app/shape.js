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

var drawRect = function (x,y,w,h,fill,id) {
    var rect = document.createElementNS(svgns, 'rect');
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'width', w);
    rect.setAttributeNS(null, 'height', h);
    rect.setAttributeNS(null, 'fill', fill);
    rect.setAttributeNS(null, 'id', id);
    return rect;
};

var drawLine = function (x1,y1,x2,y2,w,color) {
    var line = document.createElementNS(svgns, 'line');
    line.setAttribute('x1',x1);
    line.setAttribute('x2',x2);
    line.setAttribute('y1',y1);
    line.setAttribute('y2',y2);
    line.setAttribute('stroke',color);
    line.setAttribute('stroke-width',w);
    line.setAttribute('transform-origin', 'center');
    line.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    line.setAttribute('position-x', (x1+x2)/2);
    line.setAttribute('position-y', (y1+y2)/2);
    line.setAttribute('origin-x', (x1+x2)/2);
    line.setAttribute('origin-y', (y1+y2)/2);
    return line;
};

var drawDashedLine = function (x1,y1,x2,y2,array,w,color) {
    var line = document.createElementNS(svgns, 'line');
    line.setAttribute('x1',x1);
    line.setAttribute('x2',x2);
    line.setAttribute('y1',y1);
    line.setAttribute('y2',y2);
    line.setAttribute('stroke',color);
    line.setAttribute('stroke-width',w);
    line.setAttribute('stroke-dasharray',array);
    line.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    line.setAttribute('transform-origin', 'center');
    line.setAttribute('position-x', (x1+x2)/2);
    line.setAttribute('position-y', (y1+y2)/2);
    line.setAttribute('origin-x', (x1+x2)/2);
    line.setAttribute('origin-y', (y1+y2)/2);
    return line;
};