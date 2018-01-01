var svg;
var logger;
var svgns = "http://www.w3.org/2000/svg"
var selectedElement = 0;
var selectedScaler = 0;
var selectedLinker = 0;
var linkPointer = 0;
var mouseOverNode = false;
var overNode = 0;
var currentX = 0;
var currentY = 0;
var currentMatrix = [1, 0, 0, 1, 0, 0];
var id = 0;
var dragging = false;
var linkerMouseDown = false;

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
    if (selectedElement !=0 && isNode(selectedElement)) {
        var scaler = selectedElement.children[1];
        scaler.setAttribute("visibility", "hidden");
        selectedElement = 0;
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
    node.setAttribute('diff', 0);
    node.setAttribute('position-x', x);
    node.setAttribute('position-y', y);
    node.setAttribute('origin-x', x);
    node.setAttribute('origin-y', y);
    node.setAttribute('id', id);

    addVertex(id);
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
    linker.setAttribute('class', 'linker');
    linker.setAttribute('onmousedown', 'selectLinker(evt)');
    return linker;
};

var drawScaler = function (x, y, radius) {
    var scaler = document.createElementNS(svgns, 'g');
    var scaleCircle1 = drawScalerNode(x + radius, y + radius, 'se');
    var scaleCircle2 = drawScalerNode(x - radius, y - radius, 'nw');
    var scaleCircle3 = drawScalerNode(x + radius, y - radius, 'ne');
    var scaleCircle4 = drawScalerNode(x - radius, y + radius, 'sw');
    var line1 = drawDashedLine(x - radius, y - radius, x + radius, y - radius, [2, 2], 2, 'rgb(0,122,255)');
    var line2 = drawDashedLine(x - radius, y - radius, x - radius, y + radius, [2, 2], 2, 'rgb(0,122,255)');
    var line3 = drawDashedLine(x + radius, y - radius, x + radius, y + radius, [2, 2], 2, 'rgb(0,122,255)');
    var line4 = drawDashedLine(x - radius, y + radius, x + radius, y + radius, [2, 2], 2, 'rgb(0,122,255)');
    scaler.appendChild(scaleCircle1);
    scaler.appendChild(scaleCircle2);
    scaler.appendChild(scaleCircle3);
    scaler.appendChild(scaleCircle4);
    line1.setAttribute('id', 'n');
    line2.setAttribute('id', 'w');
    line3.setAttribute('id', 'e');
    line4.setAttribute('id', 's');
    scaler.appendChild(line1);
    scaler.appendChild(line2);
    scaler.appendChild(line3);
    scaler.appendChild(line4);
    scaler.setAttributeNS(null, 'id', 'scaler');
    return scaler;
};

var drawScalerNode = function (x, y, id) {
    var scaleCircle = drawCircle(x, y, 5, 'rgb(0,122,255)', 'white', 0.5);
    scaleCircle.setAttribute('onmousedown', 'selectScaler(evt)');
    scaleCircle.setAttribute('class', 'scale-node');
    scaleCircle.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    scaleCircle.setAttribute('id', id);
    return scaleCircle;
};

var selectLinker = function (e) {
    e.preventDefault();
    if (e.target.getAttribute("class") != "linker") {
        return;
    }
    selectedLinker = e.target;
    currentX = e.clientX;
    currentY = e.clientY;

    linkerMouseDown = true;
    linkPointer = drawLine(selectedLinker.parentElement.parentElement.getAttribute('position-x'), selectedLinker.parentElement.parentElement.getAttribute('position-y'), currentX, currentY, 3, 'red');
    svg.appendChild(linkPointer);

    svg.removeAttribute("onmousemove");
    svg.removeAttribute("onmouseup");
    svg.removeAttribute("onmouseout");
    svg.setAttribute('onmousemove', 'moveLinker(evt)');
    svg.setAttribute('onmouseup', 'deselectLinker(evt)');
};

var moveLinker = function (e) {
    e.preventDefault();
    if (linkerMouseDown) {
        linkPointer.setAttribute('x2', currentX);
        linkPointer.setAttribute('y2', currentY);
        if (mouseOverNode && overNode.parentElement.hasAttribute("position-x")) {
            linkPointer.setAttribute('x2', parseFloat(overNode.parentElement.getAttribute('position-x')));
            linkPointer.setAttribute('y2', parseFloat(overNode.parentElement.getAttribute('position-y')));
        }
    }
    currentX = e.clientX;
    currentY = e.clientY;
};

var deselectLinker = function (e) {
    e.preventDefault();
    linkerMouseDown = false;
    if (!mouseOverNode || !overNode.parentElement.hasAttribute("position-x")) {
        svg.removeChild(svg.lastChild);
    } else {
        var v1 = selectedLinker.parentElement.parentElement.getAttribute('id')
        var v2 = overNode.parentElement.getAttribute('id')
        linkPointer.setAttribute('v1', v1);
        linkPointer.setAttribute('v2', v2);
        linkPointer.setAttribute('stroke', 'black');
        linkPointer.setAttribute('stroke-width', 1.5);
        svg.insertBefore(linkPointer, svg.firstChild);
        addEdge(v1, v2, linkPointer);
    }
    selectedLinker = 0;
    linkPointer = 0;
    svg.removeAttribute('onmouseup');
    svg.removeAttribute('onmousedown');
    svg.removeAttribute("onmousemove");

};

var selectScaler = function (e) {
    e.preventDefault();
    if (e.target.getAttribute("class") != "scale-node") {
        return;
    }
    dragging = true;
    selectedScaler = e.target;
    currentX = e.clientX;
    currentY = e.clientY;
    currentMatrix = selectedScaler.getAttribute("transform").slice(7, -1).split(' ');
    for (var i = 0; i < 6; i++) {
        var par = parseFloat(currentMatrix[i]);
        currentMatrix[i] = par;
    }
    svg.removeAttribute("onmousemove");
    svg.removeAttribute("onmouseup");
    svg.removeAttribute("onmouseout");
    svg.setAttribute('onmousemove', 'moveScaler(evt)');
    svg.setAttribute('onmouseup', 'deselectElement(evt)');
};

var moveScaler = function (e) {
    e.preventDefault();
    logger.html(e.clientX);
    var dx = e.clientX - currentX;
    var dy = e.clientY - currentY;
    var scalerId = selectedScaler.getAttribute('id');

    // in case of circle
    var shiftDx = dx >= dy ? dx : (dx * dy >= 0 ? dy : -dy);
    var shiftDy = dx >= dy ? (dx * dy >= 0 ? dx : -dx) : dy;
    //var shiftDx = dx;
    //var shiftDy = dx * dy >= 0 ? dx : -dx;
    var radius = getRadius(selectedElement.children[0]);
    switch (scalerId) {
        case 'nw':
            if (shiftDx * shiftDy < 0) {
                return;
            }
            break;
        case 'ne':
            if (shiftDx * shiftDy > 0) {
                return;
            }
            break;
        case 'se':
            if (shiftDx * shiftDy < 0) {
                return;
            }
            break;
        case 'sw':
            if (shiftDx * shiftDy > 0) {
                return;
            }
            break;
    }
    currentMatrix[4] += shiftDx;
    currentMatrix[5] += shiftDy;
    newMatrix = "matrix(" + currentMatrix.join(' ') + ")";
    updateXY(selectedScaler, shiftDx, shiftDy);

    selectedScaler.setAttribute('transform', newMatrix);
    currentX = e.clientX;
    currentY = e.clientY;
    scale(shiftDx, shiftDy);
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
    currentMatrix = getMatrix(selectedElement);

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
    updateXY(selectedElement, dx, dy);

    var id = selectedElement.getAttribute('id');
    var edges = getEdges(id);
    var l = edges.length;
    for (i = 0; i < l; i++) {
        var edge = edges[i];
        var v1 = edge.getAttribute('v1');
        if (id == v1) {
            edge.setAttribute('x1', selectedElement.getAttribute('position-x'));
            edge.setAttribute('y1', selectedElement.getAttribute('position-y'));
        } else {
            edge.setAttribute('x2', selectedElement.getAttribute('position-x'));
            edge.setAttribute('y2', selectedElement.getAttribute('position-y'));
        }
    }

    currentX = e.clientX;
    currentY = e.clientY;
};

var deselectElement = function (evt) {
    evt.preventDefault();
    svg.removeAttribute("onmousemove");
    svg.removeAttribute("onmouseup");
    selectedScaler = 0;
};

var hoverElement = function (e) {
    mouseOverNode = true;
    overNode = e.target;
};

var outElement = function (e) {
    mouseOverNode = false;
    overNode = 0;
};

var isNode = function (e) {
    if (e.getAttribute('class') == 'node') {
        return true;
    } else {
        return false;
    }
};

var scale = function (dx, dy) {
    if (!isNode(selectedElement)) {
        return;
    }
    var radius = selectedElement.getAttribute('radius');
    var diff = Math.sqrt(dx * dx + dy * dy);

    var mutator = selectedElement.children[1];

    // change linker position
    var linker = mutator.children[1];
    var linkerMatrix = getMatrix(linker);
    linkerMatrix[4] = getAbsoluteX(linker) + dx / 2;
    linkerMatrix[5] = getAbsoluteY(linker) + dy / 2;
    newMatrix = matrixToString(linkerMatrix);
    linker.setAttribute('transform', newMatrix);
    updateXY(linker, dx / 2, dy / 2);

    // change circle scale and position
    var circle = selectedElement.children[0];
    var circleMatrix = getMatrix(circle);

    // change scaler position
    var scaler = mutator.children[0];

    // check which is current scaler
    var scalerNE = scaler.children[2];
    var scalerSE = scaler.children[0];
    var scalerNW = scaler.children[1];
    var scalerSW = scaler.children[3];
    var scalerId = selectedScaler.getAttribute('id');

    var lineN = scaler.children[4];
    var lineW = scaler.children[5];
    var lineE = scaler.children[6];
    var lineS = scaler.children[7];

    if (scalerId == 'nw') {
        var rate = (getRadius(circle) - dx / 2) / getBaseRadius(circle);

        circleMatrix[0] = rate;
        circleMatrix[3] = rate;
        circleMatrix[4] = getAbsoluteX(circle) + dx / 2;
        circleMatrix[5] = getAbsoluteY(circle) + dy / 2;
        newMatrix = matrixToString(circleMatrix);
        circle.setAttribute('transform', newMatrix);
        updateRadius(circle, -dx / 2);
        updateXY(circle, dx / 2, dy / 2);
        updateXY(selectedElement, dx / 2, dy / 2);

        var swMatrix = getMatrix(scalerSW);
        swMatrix[4] = getAbsoluteX(scalerSW) + dx;
        scalerSW.setAttribute('transform', matrixToString(swMatrix));
        updateXY(scalerSW, dx, 0);

        var neMatrix = getMatrix(scalerNE);
        neMatrix[5] = getAbsoluteY(scalerNE) + dy;
        scalerNE.setAttribute('transform', matrixToString(neMatrix));
        updateXY(scalerNE, 0, dy);

        var nMatrix = getMatrix(lineN);
        nMatrix[4] = getAbsoluteX(lineN) + dx / 2;
        nMatrix[5] = getAbsoluteY(lineN) + dy;
        nMatrix[0] = rate;
        nMatrix[3] = rate;
        lineN.setAttribute('transform', matrixToString(nMatrix));
        updateXY(lineN, dx / 2, dy);

        var wMatrix = getMatrix(lineW);
        wMatrix[4] = getAbsoluteX(lineW) + dx;
        wMatrix[5] = getAbsoluteY(lineW) + dy / 2;
        wMatrix[0] = rate;
        wMatrix[3] = rate;
        lineW.setAttribute('transform', matrixToString(wMatrix));
        updateXY(lineW, dx, dy / 2);

        var sMatrix = getMatrix(lineS);
        sMatrix[4] = getAbsoluteX(lineS) + dx / 2;
        sMatrix[0] = rate;
        sMatrix[3] = rate;
        lineS.setAttribute('transform', matrixToString(sMatrix));
        updateXY(lineS, dx / 2, 0);

        var eMatrix = getMatrix(lineE);
        eMatrix[5] = getAbsoluteY(lineE) + dy / 2;
        eMatrix[0] = rate;
        eMatrix[3] = rate;
        lineE.setAttribute('transform', matrixToString(eMatrix));
        updateXY(lineE, 0, dy / 2);
    } else if (scalerId == 'ne') {
        var rate = (getRadius(circle) + dx / 2) / getBaseRadius(circle);

        circleMatrix[0] = rate;
        circleMatrix[3] = rate;
        circleMatrix[4] = getAbsoluteX(circle) + dx / 2;
        circleMatrix[5] = getAbsoluteY(circle) + dy / 2;
        newMatrix = matrixToString(circleMatrix);
        circle.setAttribute('transform', newMatrix);
        updateXY(circle, dx / 2, dy / 2);
        updateRadius(circle, dx / 2);
        updateXY(selectedElement, dx / 2, dy / 2);

        var nwMatrix = getMatrix(scalerNW);
        nwMatrix[5] = getAbsoluteY(scalerNW) + dy;
        scalerNW.setAttribute('transform', matrixToString(nwMatrix));
        updateXY(scalerNW, 0, dy);

        var seMatrix = getMatrix(scalerSE);
        seMatrix[4] = getAbsoluteX(scalerSE) + dx;
        scalerSE.setAttribute('transform', matrixToString(seMatrix));
        updateXY(scalerSE, dx, 0);

        var nMatrix = getMatrix(lineN);
        nMatrix[4] = getAbsoluteX(lineN) + dx / 2;
        nMatrix[5] = getAbsoluteY(lineN) + dy;
        nMatrix[0] = rate;
        nMatrix[3] = rate;
        lineN.setAttribute('transform', matrixToString(nMatrix));
        updateXY(lineN, dx / 2, dy);

        var wMatrix = getMatrix(lineW);
        wMatrix[5] = getAbsoluteY(lineW) + dy / 2;
        wMatrix[0] = rate;
        wMatrix[3] = rate;
        lineW.setAttribute('transform', matrixToString(wMatrix));
        updateXY(lineW, 0, dy / 2);

        var sMatrix = getMatrix(lineS);
        sMatrix[4] = getAbsoluteX(lineS) + dx / 2;
        sMatrix[0] = rate;
        sMatrix[3] = rate;
        lineS.setAttribute('transform', matrixToString(sMatrix));
        updateXY(lineS, dx / 2, 0);

        var eMatrix = getMatrix(lineE);
        eMatrix[4] = getAbsoluteX(lineE) + dx;
        eMatrix[5] = getAbsoluteY(lineE) + dy / 2;
        eMatrix[0] = rate;
        eMatrix[3] = rate;
        lineE.setAttribute('transform', matrixToString(eMatrix));
        updateXY(lineE, dx, dy / 2);
    } else if (scalerId == 'se') {
        var rate = (getRadius(circle) + dx / 2) / getBaseRadius(circle);

        circleMatrix[0] = rate;
        circleMatrix[3] = rate;
        circleMatrix[4] = getAbsoluteX(circle) + dx / 2;
        circleMatrix[5] = getAbsoluteY(circle) + dy / 2;
        newMatrix = matrixToString(circleMatrix);
        circle.setAttribute('transform', newMatrix);
        updateXY(circle, dx / 2, dy / 2);
        updateRadius(circle, dx / 2);
        updateXY(selectedElement, dx / 2, dy / 2);

        var swMatrix = getMatrix(scalerSW);
        swMatrix[5] = getAbsoluteY(scalerSW) + dy;
        scalerSW.setAttribute('transform', matrixToString(swMatrix));
        updateXY(scalerSW, 0, dy);

        var neMatrix = getMatrix(scalerNE);
        neMatrix[4] = getAbsoluteX(scalerNE) + dx;
        scalerNE.setAttribute('transform', matrixToString(neMatrix));
        updateXY(scalerNE, dx, 0);

        var nMatrix = getMatrix(lineN);
        nMatrix[4] = getAbsoluteX(lineN) + dx / 2;
        nMatrix[0] = rate;
        nMatrix[3] = rate;
        lineN.setAttribute('transform', matrixToString(nMatrix));
        updateXY(lineN, dx / 2, 0);

        var wMatrix = getMatrix(lineW);
        wMatrix[5] = getAbsoluteY(lineW) + dy / 2;
        wMatrix[0] = rate;
        wMatrix[3] = rate;
        lineW.setAttribute('transform', matrixToString(wMatrix));
        updateXY(lineW, 0, dy / 2);

        var sMatrix = getMatrix(lineS);
        sMatrix[4] = getAbsoluteX(lineS) + dx / 2;
        sMatrix[5] = getAbsoluteY(lineS) + dy;
        sMatrix[0] = rate;
        sMatrix[3] = rate;
        lineS.setAttribute('transform', matrixToString(sMatrix));
        updateXY(lineS, dx / 2, dy);

        var eMatrix = getMatrix(lineE);
        eMatrix[4] = getAbsoluteX(lineE) + dx;
        eMatrix[5] = getAbsoluteY(lineE) + dy / 2;
        eMatrix[0] = rate;
        eMatrix[3] = rate;
        lineE.setAttribute('transform', matrixToString(eMatrix));
        updateXY(lineE, dx, dy / 2);
    } else if (scalerId == 'sw') {
        var rate = (getRadius(circle) - dx / 2) / getBaseRadius(circle);

        circleMatrix[0] = rate;
        circleMatrix[3] = rate;
        circleMatrix[4] = getAbsoluteX(circle) + dx / 2;
        circleMatrix[5] = getAbsoluteY(circle) + dy / 2;
        newMatrix = matrixToString(circleMatrix);
        circle.setAttribute('transform', newMatrix);
        updateXY(circle, dx / 2, dy / 2);
        updateRadius(circle, -dx / 2);
        updateXY(selectedElement, dx / 2, dy / 2);

        var nwMatrix = getMatrix(scalerNW);
        nwMatrix[4] = getAbsoluteX(scalerNW) + dx;
        scalerNW.setAttribute('transform', matrixToString(nwMatrix));
        updateXY(scalerNW, dx, 0);

        var seMatrix = getMatrix(scalerSE);
        seMatrix[5] = getAbsoluteY(scalerSE) + dy;
        scalerSE.setAttribute('transform', matrixToString(seMatrix));
        updateXY(scalerSE, 0, dy);

        var nMatrix = getMatrix(lineN);
        nMatrix[4] = getAbsoluteX(lineN) + dx / 2;
        nMatrix[0] = rate;
        nMatrix[3] = rate;
        lineN.setAttribute('transform', matrixToString(nMatrix));
        updateXY(lineN, dx / 2, 0);

        var wMatrix = getMatrix(lineW);
        wMatrix[4] = getAbsoluteX(lineW) + dx;
        wMatrix[5] = getAbsoluteY(lineW) + dy / 2;
        wMatrix[0] = rate;
        wMatrix[3] = rate;
        lineW.setAttribute('transform', matrixToString(wMatrix));
        updateXY(lineW, dx, dy / 2);

        var sMatrix = getMatrix(lineS);
        sMatrix[4] = getAbsoluteX(lineS) + dx / 2;
        sMatrix[5] = getAbsoluteY(lineS) + dy;
        sMatrix[0] = rate;
        sMatrix[3] = rate;
        lineS.setAttribute('transform', matrixToString(sMatrix));
        updateXY(lineS, dx / 2, dy);

        var eMatrix = getMatrix(lineE);
        eMatrix[5] = getAbsoluteY(lineE) + dy / 2;
        eMatrix[0] = rate;
        eMatrix[3] = rate;
        lineE.setAttribute('transform', matrixToString(eMatrix));
        updateXY(lineE, 0, dy / 2);
    }
};

$('html').keyup(function(e){
    console.log(e.keyCode);
    if(e.keyCode == 46 || e.keyCode == 8) {
        console.log('sss');
        if(selectedElement!=0){
            console.log(selectedElement);
            svg.removeChild(selectedElement);
        }
    }
});