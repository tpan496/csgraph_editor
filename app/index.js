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
var editing = false;

// ui infos
var elementInfo;
var radiusInfo;
var idInfo;
var fromInfo;
var toInfo;
var textInfo;
var textSizeInfo;

$(document).ready(function () {
    svg = $('svg')[0];
    logger = $('#logger');
    radiusInfo = $('label#radius');
    idInfo = $('label#id');
    elementInfo = $('.info#element');
    fromInfo = $('label#from');
    toInfo = $('label#to');
    textInfo = $('label#text');
    textSizeInfo = $('label#text-size');
    displayBoard();

    $('#button-circle').click(function () {
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
        selectedElement.children[1].setAttribute('fill', 'rgb(175,175,175)');
        displayInfo(node);
    });

    $('#button-label').click(function () {
        var rx = randomRange(0, 20);
        var ry = randomRange(0, 20);
        var x = svg.getBoundingClientRect().width / 2 + rx;
        var y = svg.getBoundingClientRect().height / 2 + ry;
        var label = drawLabel(x, y);
        svg.appendChild(label);
        updateRect(label);
        label.children[1].setAttribute('stroke', 'rgb(0,122,255)');
        if (selectedElement != 0) {
            turnOffSelectedElementScaler();
        }
        selectedElement = label;
        displayInfo(label);
    });
    $('#paper').click(function () {
        if (selectedElement != 0 && !mouseOverNode) {
            turnOffSelectedElementScaler();
        }
    });

    $('.clickedit').focusout(endEdit).keyup(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            endEdit(e);
            return false;
        } else {
            return true;
        }
    }).prev().click(function () {
        $(this).hide();
        $(this).next().show().focus();

        editing = true;
    });
});

var turnOffSelectedElementScaler = function () {
    if (selectedElement != 0 && (isNode(selectedElement) || isEdge(selectedElement) || selectedElement.getAttribute('class') == 'label')) {
        var scaler = selectedElement.children[2];
        if (scaler) {
            scaler.setAttribute("visibility", "hidden");
        }

        if (isNode(selectedElement)) {
            var text = selectedElement.children[1];
            if (text) {
                text.setAttribute('fill', 'black');
            }
        }
        if (isEdge(selectedElement)) {
            selectedElement.setAttribute('stroke-dasharray', '');
            selectedElement.setAttribute('stroke', 'black');
            selectedElement.parentElement.children[1].setAttribute('fill', 'black');
        }
        if (selectedElement.getAttribute('class') == 'label') {
            selectedElement.children[1].setAttribute('stroke', 'transparent');
        }
        selectedElement = 0;
        displayBoard();
    }
};

var drawLabel = function (x, y) {
    var label = document.createElementNS(svgns, 'g');
    var text = drawText(x, y, '');
    text.setAttribute('font-size', 20);
    var markerRect = drawRect(x, y, 0, 0);
    label.setAttribute('cursor', 'move');
    label.appendChild(text);
    label.appendChild(markerRect);
    label.setAttribute('class', 'label');
    label.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    label.setAttribute('onmousedown', 'selectLabel(evt)');
    label.setAttribute('onmouseover', 'hoverElement(evt)');
    label.setAttribute('onmouseout', 'outElement(evt)');
    label.setAttribute('position-x', x);
    label.setAttribute('position-y', y);
    label.setAttribute('origin-x', x);
    label.setAttribute('origin-y', y);
    return label;
}

var updateRect = function (label) {
    var bbox = label.getBBox();
    label.children[1].setAttribute('x', parseFloat(label.children[1].getAttribute('x')) - bbox.width / 2);
    label.children[1].setAttribute('y', parseFloat(label.children[1].getAttribute('y')) - bbox.height / 2);
    label.children[1].setAttribute('width', bbox.width);
    label.children[1].setAttribute('height', bbox.height);
}

var drawNode = function (x, y) {
    var node = document.createElementNS(svgns, 'g');
    var circle = drawCircle(x, y, 20, 'white', 'black', 1.5);
    var mutator = drawMutator(x, y, 20);

    var text;
    var recycledId = getReusableId();
    if (recycledId >= 0) {
        node.setAttribute('id', recycledId);
        addVertex(recycledId, node);
        text = drawText(x, y, recycledId);
    } else {
        node.setAttribute('id', id);
        addVertex(id, node);
        text = drawText(x, y, id);
        id += 1;
    }

    node.appendChild(circle);
    node.appendChild(text);
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
    var linker = drawCircle(x, y, 6, 'rgb(0,255,0)', 'black', 0.5);
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
        if (E[v1][v2]) {
            svg.removeChild(svg.lastChild);
            selectedLinker = 0;
            linkPointer = 0;
            svg.removeAttribute('onmouseup');
            svg.removeAttribute('onmousedown');
            svg.removeAttribute("onmousemove");
            return;
        }
        var arrow = document.createElementNS(svgns, 'g');
        linkPointer.setAttribute('v1', v1);
        linkPointer.setAttribute('v2', v2);
        linkPointer.setAttribute('stroke', 'black');
        linkPointer.setAttribute('stroke-width', 1.5);
        linkPointer.setAttribute('class', 'edge');
        linkPointer.setAttribute('onclick', 'selectEdge(evt)');
        linkPointer.setAttribute('onmouseover', 'hoverElement(evt)');
        linkPointer.setAttribute('onmouseout', 'outElement(evt)');
        reshapeEdge(linkPointer, 0, V[v1], V[v2]);
        var arrowHead = drawArrowHead(linkPointer);
        arrow.appendChild(linkPointer);
        arrow.appendChild(arrowHead);

        svg.insertBefore(arrow, svg.firstChild);
        addEdge(v1, v2, arrow);
    }
    selectedLinker = 0;
    linkPointer = 0;
    svg.removeAttribute('onmouseup');
    svg.removeAttribute('onmousedown');
    svg.removeAttribute("onmousemove");
};

var selectEdge = function (e) {
    e.preventDefault();
    if (e.target.getAttribute('class') != 'edge') {
        return;
    }
    turnOffSelectedElementScaler();
    selectedElement = e.target;
    displayInfo(selectedElement);
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

var selectLabel = function (e) {
    e.preventDefault();
    if (e.target.parentElement.getAttribute("class") != "label") {
        return;
    }
    if (selectedElement != e.target.parentElement) {
        turnOffSelectedElementScaler();
    }
    selectedElement = e.target.parentElement;
    displayInfo(selectedElement);
    selectedElement.children[1].setAttribute('stroke', 'rgb(0,122,255)');

    currentX = e.clientX;
    currentY = e.clientY;
    currentMatrix = getMatrix(selectedElement);

    svg.setAttribute("onmousemove", "moveElement(evt)");
    svg.setAttribute("onmouseup", "deselectElement(evt)");
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
    displayInfo(selectedElement);
    selectedElement.children[1].setAttribute('fill', 'rgb(175,175,175)');

    var scaler = selectedElement.children[2];
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

    if (selectedElement.getAttribute('class') == 'node') {
        var id = selectedElement.getAttribute('id');
        var edges = getEdges(id);
        var l = edges.length;
        for (i = 0; i < l; i++) {
            var edge = edges[i];
            var v1 = edge.children[0].getAttribute('v1');
            var v2 = edge.children[0].getAttribute('v2');
            reshapeEdge(edge.children[0], edge.children[1], V[v1], V[v2]);
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

    if (selectedElement.getAttribute('class') == 'node') {
        var id = selectedElement.getAttribute('id');
        var edges = getEdges(id);
        var l = edges.length;
        for (i = 0; i < l; i++) {
            var edge = edges[i];
            var v1 = edge.children[0].getAttribute('v1');
            var v2 = edge.children[0].getAttribute('v2');
            reshapeEdge(edge.children[0], edge.children[1], V[v1], V[v2]);
        }
    }
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

var isEdge = function (e) {
    if (e.getAttribute('class') == 'edge') {
        return true;
    } else {
        return false;
    }
};

// deletion
$('html').keyup(function (e) {
    if (!editing) {
        if (e.keyCode == 46 || e.keyCode == 8) {
            if (selectedElement != 0) {
                if (selectedElement.getAttribute('class') == 'node') {
                    svg.removeChild(selectedElement);
                } else if (selectedElement.getAttribute('class') == 'edge') {
                    svg.removeChild(selectedElement.parentElement);
                }
                if (selectedElement.getAttribute('class') == 'node') {
                    deleteVertex(selectedElement.getAttribute('id'));
                } else if (selectedElement.getAttribute('class') == 'edge') {
                    deleteEdge(selectedElement.getAttribute('v1'), selectedElement.getAttribute('v2'));
                }
                selectedElement = 0;
            }
        }
    }
});

// edit ends
function endEdit(e) {
    // change selected element shape according to text
    if (editing) {
        var input = $(e.target),
            label = input && input.prev();
        label.text(input.val() === '' ? label.textContent : input.val());
        input.hide();
        label.show();

        var id = label.attr('id');
        if (id == 'radius') {
            scaleTo(parseFloat(input.val()));
            console.log('time');
        } else if (id == 'text') {
            if (isNode(selectedElement)) {
                selectedElement.children[1].textContent = input.val();
            } else if (selectedElement.getAttribute('class') == 'label') {
                selectedElement.children[0].textContent = input.val();
                var bbox = selectedElement.children[0].getBBox();
                selectedElement.children[1].setAttribute('x', parseFloat(selectedElement.children[0].getAttribute('x')) - bbox.width / 2);
                selectedElement.children[1].setAttribute('y', parseFloat(selectedElement.children[0].getAttribute('y')) - bbox.height / 2);
                selectedElement.children[1].setAttribute('width', bbox.width);
                selectedElement.children[1].setAttribute('height', bbox.height);
            }
        } else if (id == 'text-size') {
            if (isNode(selectedElement)) {
                selectedElement.children[1].setAttribute('font-size', input.val());
            } else {
                selectedElement.children[0].setAttribute('font-size', input.val());
                var bbox = selectedElement.children[0].getBBox();
                selectedElement.children[1].setAttribute('x', parseFloat(selectedElement.children[0].getAttribute('x')) - bbox.width / 2);
                selectedElement.children[1].setAttribute('y', parseFloat(selectedElement.children[0].getAttribute('y')) - bbox.height / 2);
                selectedElement.children[1].setAttribute('width', bbox.width);
                selectedElement.children[1].setAttribute('height', bbox.height);
            }
        }
        input.val('');
    }
    editing = false;
}