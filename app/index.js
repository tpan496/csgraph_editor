var svg;
var svgns = "http://www.w3.org/2000/svg"
var selectedElement = 0;
var mouseOverNode = false;
var currentX = 0;
var currentY = 0;
var mouseX = 0;
var mouseY = 0;
var lastX = 0;
var lastY = 0;
var currentMatrix = [1, 0, 0, 1, 0, 0];
var id = 0;

$(document).ready(function () {
    svg = $('svg')[0];
    var spawnCircleButton = $('#button-circle');
    spawnCircleButton.click(function () {
        var rx = randomRange(0, 20);
        var ry = randomRange(0, 20);
        var x = svg.getBoundingClientRect().width / 2 + rx;
        var y = svg.getBoundingClientRect().height / 2 + ry;
        var node = drawNode(x, y);
        svg.appendChild(node);
        if(selectedElement!=0){
           turnOffSelectedElementScaler();
        }
        selectedElement = node;
    });
    $('#paper').click(function (){
        if(selectedElement != 0 && !mouseOverNode){
            turnOffSelectedElementScaler();
        }
    });
});

var turnOffSelectedElementScaler = function () {
    var scaler = selectedElement.children[1];
    scaler.setAttributeNS(null, "visibility", "hidden");
};

var drawNode = function(x,y) {
    var node = document.createElementNS(svgns, 'g');
    var circle = drawCircle(x,y,20,'white','black',1.5);
    var mutator = drawMutator(x,y);
    node.appendChild(circle);
    node.appendChild(mutator);
    node.setAttribute('class', 'draggable');
    node.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    node.setAttribute('onmousedown', 'selectElement(evt)');
    node.setAttribute('onclick','onClickElement(evt)');
    node.setAttribute('id', 'node');
    node.setAttribute('onmouseover', "hoverElement(evt)");
    node.setAttribute('onmouseout',"outElement(evt)");
    id += 1;
    return node;
};

var drawMutator = function(x,y) {
    var mutator = document.createElementNS(svgns, 'g');
    var scaler = drawScaler(x,y);
    var linker = drawLinker(x,y);
    mutator.appendChild(scaler);
    mutator.appendChild(linker);
    mutator.setAttribute('id','mutator');
    return mutator;
}

var drawScaler = function(x,y) {
    var scaler = document.createElementNS(svgns, 'g');
    var scaleCircle1 = drawCircle(x+20,y+20,4,'rgb(0,122,255)', 'white',0.5);
    var scaleCircle2 = drawCircle(x-20,y-20,4,'rgb(0,122,255)', 'white',0.5);
    var scaleCircle3 = drawCircle(x+20,y-20,4,'rgb(0,122,255)', 'white',0.5);
    var scaleCircle4 = drawCircle(x-20,y+20,4,'rgb(0,122,255)', 'white',0.5);
    var line1 = drawDashedLine(x-20,y-20,x+20,y-20,[2,2],2,'rgb(0,122,255)');
    var line2 = drawDashedLine(x-20,y-20,x-20,y+20,[2,2],2,'rgb(0,122,255)');
    var line3 = drawDashedLine(x+20,y-20,x+20,y+20,[2,2],2,'rgb(0,122,255)');
    var line4 = drawDashedLine(x-20,y+20,x+20,y+20,[2,2],2,'rgb(0,122,255)');
    scaler.appendChild(scaleCircle1);
    scaler.appendChild(scaleCircle2);
    scaler.appendChild(scaleCircle3);
    scaler.appendChild(scaleCircle4);
    scaler.appendChild(line1);
    scaler.appendChild(line2);
    scaler.appendChild(line3);
    scaler.appendChild(line4);
    scaler.setAttributeNS(null, 'id', 'scaler');
    return scaler;
};

var drawLinker = function(x,y) {
    var linker = drawCircle(x,y,4,'rgb(0,255,0)', 'black', 0.5);
    return linker;
};

var drawCircle = function (x, y, radius, fill, stroke, strokeWidth) {
    var circle = document.createElementNS(svgns, 'circle');
    circle.setAttributeNS(null, 'cx', x);
    circle.setAttributeNS(null, 'cy', y);
    circle.setAttributeNS(null, 'r', radius);
    circle.setAttributeNS(null, 'fill', fill);
    circle.setAttributeNS(null, 'stroke', stroke);
    circle.setAttributeNS(null, 'stroke-width', strokeWidth);
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
    line.setAttribute('stroke-dasharray',array)
    return line;
};

var selectElement = function (e) {
    e.preventDefault();
    if(e.target.parentElement.getAttribute("id") != "node"){
        return;
    }
    if(selectedElement != e.target.parentElement) {
        turnOffSelectedElementScaler();
    }
    selectedElement = e.target.parentElement;
    var scaler = selectedElement.children[1];
    if(scaler.getAttribute("visibility") === "hidden"){
        scaler.setAttribute("visibility", "visible");
    }
    currentX = e.clientX;
    currentY = e.clientY;
    currentMatrix = selectedElement.getAttributeNS(null, "transform").slice(7, -1).split(' ');
    for (var i = 0; i < currentMatrix.length; i++) {
        currentMatrix[i] = parseFloat(currentMatrix[i]);
    }

    svg.setAttribute("onmousemove", "moveElement(evt)");
    svg.setAttribute("onmouseup", "deselectElement(evt)");
};

var hoverElement = function (e) {
    mouseOverNode = true;
};

var outElement = function (e) {
    mouseOverNode = false;
};

var moveElement = function (e) {
    e.preventDefault();
    dx = lastX + e.clientX - currentX;
    dy = lastY + e.clientY - currentY;
    currentMatrix[4] += dx;
    currentMatrix[5] += dy;
    newMatrix = "matrix(" + currentMatrix.join(' ') + ")";

    selectedElement.setAttributeNS(null, "transform", newMatrix);
    currentX = e.clientX;
    currentY = e.clientY;
};

var onClickElement = function (e) {
    e.preventDefault();
    if(e.target.parentElement.getAttribute('id')!="node"){
        return;
    }
    var scaler = selectedElement.children[1];
    if(scaler.getAttribute("visibility") === "hidden"){
        selectedElement = e.target.parentElement;
        scaler.setAttribute("visibility", "visible");
    }
    $('#selected').text(e.target.getAttributeNS(null, 'id'));
};

var deselectElement = function (evt) {
    evt.preventDefault();
    lastX = 0;
    lastY = 0;
    svg.removeAttribute("onmousemove");
    svg.removeAttribute("onmouseout");
    svg.removeAttribute("onmouseup");
};

var randomRange = function(min, max) {
    return Math.random() * (max - min) + min;
};