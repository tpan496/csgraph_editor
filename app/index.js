var svg;
var logger;
var svgns = "http://www.w3.org/2000/svg"
var selectedElement = 0;
var selectedScaler = 0;
var mouseOverNode = false;
var currentX = 0;
var currentY = 0;
var mouseX = 0;
var mouseY = 0;
var currentMatrix = [1, 0, 0, 1, 0, 0];
var oldMatrix = [1, 0, 0, 1, 0, 0];
var currentCenterMatrix = [1, 0, 0, 1, 0, 0];
var id = 0;
var dragging = false;
var prevDiffValue = 0;

$(document).ready(function () {
    svg = $('svg')[0];
    logger = $('#logger');
    var spawnCircleButton = $('#button-circle');
    spawnCircleButton.click(function () {
        var rx = randomRange(0, 20);
        var ry = randomRange(0, 20);
        var x = svg.getBoundingClientRect().width / 2 + rx;
        var y = svg.getBoundingClientRect().height / 2 + ry;
        var node = drawNode(x, y);
        svg.appendChild(node);
        if (selectedElement != 0) {
            turnOffSelectedElementScaler();
        }
        selectedElement = node;
    });
    $('#paper').click(function () {
        if (selectedElement != 0 && !mouseOverNode) {
            turnOffSelectedElementScaler();
        }
    });
});

var turnOffSelectedElementScaler = function () {
    if (isNode(selectedElement)) {
        var scaler = selectedElement.children[1];
        scaler.setAttribute("visibility", "hidden");
    }
};

var drawNode = function (x, y) {
    var node = document.createElementNS(svgns, 'g');
    var circle = drawCircle(x, y, 20, 'white', 'black', 1.5);
    var mutator = drawMutator(x, y, 20);
    node.appendChild(circle);
    node.appendChild(mutator);
    node.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    node.setAttribute('onmousedown', 'selectElement(evt)');
    node.setAttribute('class', 'node');
    node.setAttribute('onmouseover', 'hoverElement(evt)');
    node.setAttribute('onmouseout', 'outElement(evt)');
    node.setAttribute('radius', 20);
    node.setAttribute('origin',[x,y]);
    node.setAttribute('diff', 0);
    
    id += 1;
    return node;
};

var drawMutator = function (x, y, radius) {
    var mutator = document.createElementNS(svgns, 'g');
    var scaler = drawScaler(x, y, radius);
    var linker = drawLinker(x, y);
    mutator.appendChild(scaler);
    mutator.appendChild(linker);
    mutator.setAttribute('id', 'mutator');
    return mutator;
};

var drawLinker = function (x, y) {
    var linker = drawCircle(x, y, 4, 'rgb(0,255,0)', 'black', 0.5);
    return linker;
};

var drawScaler = function (x, y, radius) {
    var scaler = document.createElementNS(svgns, 'g');
    var scaleCircle1 = drawScalerNode(x + radius, y + radius);
    var scaleCircle2 = drawScalerNode(x - radius, y - radius);
    var scaleCircle3 = drawScalerNode(x + radius, y - radius);
    var scaleCircle4 = drawScalerNode(x - radius, y + radius);
    var line1 = drawDashedLine(x - radius, y - radius, x + radius, y - radius, [2, 2], 2, 'rgb(0,122,255)');
    var line2 = drawDashedLine(x - radius, y - radius, x - radius, y + radius, [2, 2], 2, 'rgb(0,122,255)');
    var line3 = drawDashedLine(x + radius, y - radius, x + radius, y + radius, [2, 2], 2, 'rgb(0,122,255)');
    var line4 = drawDashedLine(x - radius, y + radius, x + radius, y + radius, [2, 2], 2, 'rgb(0,122,255)');
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

var drawScalerNode = function (x, y) {
    var scaleCircle = drawCircle(x, y, 5, 'rgb(0,122,255)', 'white', 0.5);
    scaleCircle.setAttribute('onmousedown', 'selectScaler(evt)');
    scaleCircle.setAttribute('class', 'scale-node');
    scaleCircle.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    return scaleCircle;
};

var selectScaler = function (e) {
    e.preventDefault();
    if (e.target.getAttribute("class") != "scale-node") {
        return;
    }
    dragging = true;
    var target = e.target;
    selectedScaler = target;
    currentX = e.clientX;
    currentY = e.clientY;
    currentMatrix = e.target.getAttribute("transform").slice(7, -1).split(' ');
    for (var i = 0; i < currentMatrix.length; i++) {
        var par = parseFloat(currentMatrix[i]);
        currentMatrix[i] = par;
        oldMatrix[i] = par;
    }
    currentCenterMatrix = selectedElement.children[1].children[1].getAttribute('transform').slice(7, -1).split(' ');
    for (var i = 0; i < currentCenterMatrix.length; i++) {
        var par = parseFloat(currentCenterMatrix[i]);
        currentCenterMatrix[i] = par;
    }
    svg.removeAttribute("onmousemove");
    svg.removeAttribute("onmouseup");
    svg.removeAttribute("onmouseout");
    svg.setAttribute('onmousemove', 'moveScaler(evt)');
    svg.setAttribute('onmouseup', 'deselectElement(evt)')
};

var moveScaler = function (e) {
    e.preventDefault();
    logger.html(e.clientX);
    var dx = e.clientX - currentX;
    var dy = e.clientY - currentY;
    currentMatrix[4] += dx;
    currentMatrix[5] += dy;
    newMatrix = "matrix(" + currentMatrix.join(' ') + ")";

    selectedScaler.setAttribute('transform', newMatrix);
    currentX = e.clientX;
    currentY = e.clientY;
    scale(selectedElement, dx, dy);
};

var selectElement = function (e) {
    e.preventDefault();
    if (e.target.parentElement.getAttribute("class") != "node") {
        return;
    }
    if (selectedElement != e.target.parentElement) {
        turnOffSelectedElementScaler();
    }
    selectedElement = e.target.parentElement;
    var scaler = selectedElement.children[1];
    if (scaler.getAttribute("visibility") === "hidden") {
        scaler.setAttribute("visibility", "visible");
    }
    currentX = e.clientX;
    currentY = e.clientY;
    currentMatrix = selectedElement.getAttribute("transform").slice(7, -1).split(' ');
    for (var i = 0; i < currentMatrix.length; i++) {
        currentMatrix[i] = parseFloat(currentMatrix[i]);
    }

    svg.setAttribute("onmousemove", "moveElement(evt)");
    svg.setAttribute("onmouseup", "deselectElement(evt)");
};

var moveElement = function (e) {
    e.preventDefault();
    var dx = e.clientX - currentX;
    var dy = e.clientY - currentY;
    currentMatrix[4] += dx;
    currentMatrix[5] += dy;
    newMatrix = "matrix(" + currentMatrix.join(' ') + ")";

    selectedElement.setAttribute('transform', newMatrix);
    currentX = e.clientX;
    currentY = e.clientY;
};

var deselectElement = function (evt) {
    evt.preventDefault();
    svg.removeAttribute("onmousemove");
    svg.removeAttribute("onmouseup");
    oldMatrix = currentMatrix;
    selectedElement.setAttribute('diff', prevDiffValue);
    console.log('deselected');
};

var hoverElement = function (e) {
    mouseOverNode = true;
};

var outElement = function (e) {
    mouseOverNode = false;
};

var isNode = function (e) {
    if (e.getAttribute('class') == 'node') {
        return true;
    } else {
        return false;
    }
};

var scale = function (selectedElement, dx, dy) {
    if (!isNode(selectedElement)) {
        return;
    }
    var radius = selectedElement.getAttribute('radius');
    var origin = selectedElement.getAttribute('origin');
    var newPosition = [currentMatrix[4], currentMatrix[5]];
    var position = [oldMatrix[4], oldMatrix[5]];
    var diff = dist(newPosition, position);

    var mutator = selectedElement.children[1];

    // change linker position
    var linker = mutator.children[1];
    var linkerMatrix = linker.getAttribute("transform").slice(7, -1).split(' ');
    for (var i = 0; i < currentMatrix.length; i++) {
        linkerMatrix[i] = parseFloat(currentMatrix[i]);
    }
    linkerMatrix[4] = currentCenterMatrix[4] + (currentMatrix[4] - oldMatrix[4])/2;
    linkerMatrix[5] = currentCenterMatrix[5] + (currentMatrix[5] - oldMatrix[5])/2;
    newMatrix = "matrix(" + linkerMatrix.join(' ') + ")";
    linker.setAttribute('transform', newMatrix);

    // change scaler position
    var scaler = mutator.children[0];

    // change circle scale and position
    var circle = selectedElement.children[0];
    var circleMatrix = circle.getAttribute("transform").slice(7, -1).split(' ');
    for (var i = 0; i < currentMatrix.length; i++) {
        circleMatrix[i] = parseFloat(circleMatrix[i]);
    }
    var prevDiff = parseInt(selectedElement.getAttribute('diff'));
    var scale = currentMatrix[0];
    console.log(diff);
    var newRadius = radius*scale + diff/(Math.sqrt(2)*2)+prevDiff;
    var rate = newRadius / (radius*scale);
    prevDiffValue = diff/(Math.sqrt(2)*2) + prevDiff;

    circleMatrix[0] = rate;
    circleMatrix[3] = rate;
    circleMatrix[4] = currentCenterMatrix[4] + (currentMatrix[4] - oldMatrix[4])/2;
    circleMatrix[5] = currentCenterMatrix[5] + (currentMatrix[5] - oldMatrix[5])/2;
    newMatrix = "matrix(" + circleMatrix.join(' ') + ")";
    circle.setAttribute('transform', newMatrix);
};