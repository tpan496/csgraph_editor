var svgns = "http://www.w3.org/2000/svg"
var selectedElement = 0;
var selectedScaler = 0;
var selectedLinker = 0;
var selectedEditBox = 0;
var linkPointer = 0;
var mouseOverNode = false;
var overNode = 0;
var currentX = 0;
var currentY = 0;
var currentMatrix = [1, 0, 0, 1, 0, 0];
var currentEditTarget = 0;
var serialId = 0;
var dragging = false;
var linkerMouseDown = false;
var editing = false;
var forceAlign = false;

// copy paste
var copiedElement = 0;

// ui infos
var elementInfo;
var xInfo;
var yInfo;
var radiusInfo;
var idInfo;
var fromInfo;
var toInfo;
var textInfo;
var textSizeInfo;
var guideInfo;
var gridOnButton;
var directedOnButton;
var clearButton;
var selfLoopButton;
var terminalButton;

$(document).ready(function () {
    svg = $('svg')[0];
    radiusInfo = $('label#radius');
    idInfo = $('label#id');
    xInfo = $('label#x');
    yInfo = $('label#y');
    elementInfo = $('.info#element');
    fromInfo = $('label#from');
    toInfo = $('label#to');
    textInfo = $('label#text');
    textSizeInfo = $('label#text-size');
    gridOnButton = $('#grid');
    directedOnButton = $('#directed');
    guideInfo = $('#guide');
    selfLoopButton = $('#self-loop');
    terminalButton = $('#terminal');
    displayBoard();

    $('#button-circle').click(function () {
        var rx = parseInt(randomRange(0, 20));
        var ry = parseInt(randomRange(0, 20));
        var x = parseInt(svg.getBoundingClientRect().width / 2) + rx;
        var y = parseInt(svg.getBoundingClientRect().height / 2) + ry;
        var node = drawNode(x, y);
        svg.appendChild(node);
        if (selectedElement != 0) {
            turnOffSelectedElementScaler();
        }
        selectedElement = node;
        selectedElement.children[1].setAttribute('fill', 'rgb(175,175,175)');
        currentMatrix = getMatrix(selectedElement);
        displayInfo(node);
    });

    $('#button-label').click(function () {
        var rx = parseInt(randomRange(0, 20));
        var ry = parseInt(randomRange(0, 20));
        var x = parseInt(svg.getBoundingClientRect().width / 2) + rx;
        var y = parseInt(svg.getBoundingClientRect().height / 2) + ry;
        var label = drawLabel(x, y);
        svg.appendChild(label);
        updateLabel(label);
        label.children[1].setAttribute('stroke', 'rgb(0,122,255)');
        if (selectedElement != 0) {
            turnOffSelectedElementScaler();
        }
        selectedElement = label;
        currentMatrix = getMatrix(selectedElement);
        displayInfo(label);
    });

    $('#button-png').click(function () {
        exportPNG();
    });

    $('#button-xml').click(function () {
        saveXML();
    });

    $('#button-load').click(function () {
        loadXML();
    });

    $('#button-clear').click(function () {
        $('svg').html('');
        serialId = 0;
    });

    $('svg').click(function () {
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
        $(this).next().val($(this).text());

        editing = true;
        currentEditTarget = $(this).next();
    });

    $('#grid').click(function () {
        toggleGrid($(this));
    });

    $('#directed').click(function () {
        toggleDirected($(this));
    });

    $('#self-loop').click(function () {
        toggleSelfLoop($(this), selectedElement);
    });

    $('#terminal').click(function () {
        toggleTerminal($(this), selectedElement);
    });
});

var turnOffSelectedElementScaler = function () {
    if (selectedElement != 0 && (isNode(selectedElement) || isEdge(selectedElement) || isLabel(selectedElement))) {
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
        if (isLabel(selectedElement)) {
            selectedElement.children[1].setAttribute('stroke', 'transparent');
            if (editing) {
                editLabelEnd();
            }
        }
        selectedElement = 0;
        displayBoard();
    }
};

var editLabel = function (evt) {
    if (isLabel(selectedElement)) {
        editing = true;
        selectedElement.children[2].setAttribute('visibility', 'visible');
        selectedElement.children[0].setAttribute('pointer-event', 'none');
        selectedEditBox = selectedElement.children[2];
        svg.appendChild(selectedEditBox);
        selectedElement.setAttribute('pointer-event', 'none');
    }
};

var editLabelEnd = function () {
    if (isLabel(selectedElement)) {
        editing = false;
        if (selectedEditBox.children[0].value === '') {
            svg.removeChild(selectedEditBox);
            svg.removeChild(selectedElement);
            return;
        }
        selectedElement.appendChild(selectedEditBox);
        selectedEditBox.setAttribute('visibility', 'hidden');
        selectedElement.children[0].textContent = selectedEditBox.children[0].value;
        selectedElement.children[0].setAttribute('pointer-event', 'all');
        updateLabel(selectedElement);
        displayInfo(selectedElement);
        selectedElement.children[0].blur();
    }
};

var updateLabel = function (label) {
    var bbox = label.children[0].getBBox();
    label.children[1].setAttribute('x', bbox.x);
    label.children[1].setAttribute('y', bbox.y);
    label.children[1].setAttribute('width', bbox.width);
    label.children[1].setAttribute('height', bbox.height);

    label.children[2].setAttribute('x', getX(label) - bbox.width / 2);
    label.children[2].setAttribute('y', getY(label) - bbox.height / 2);
    label.children[2].setAttribute('width', bbox.width);
    label.children[2].setAttribute('height', bbox.height);

    label.children[2].children[0].setAttribute('x', bbox.x);
    label.children[2].children[0].setAttribute('y', bbox.y);
    label.children[2].children[0].setAttribute('size', label.children[0].textContent.length);
    label.children[2].children[0].value = label.children[0].textContent;
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
    linkPointer = drawLine(getX(selectedLinker.parentElement.parentElement), getY(selectedLinker.parentElement.parentElement), currentX, currentY, 3, 'red');
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
            linkPointer.setAttribute('x2', getX(overNode.parentElement));
            linkPointer.setAttribute('y2', getY(overNode.parentElement));
        }
    }
    currentX = e.clientX;
    currentY = e.clientY;
};

var deselectLinker = function (e) {
    e.preventDefault();
    linkerMouseDown = false;
    if (!mouseOverNode || !(overNode.parentElement.getAttribute('class') == 'node')) {
        svg.removeChild(svg.lastChild);
    } else {
        var v1 = selectedLinker.parentElement.parentElement.getAttribute('id')
        var v2 = overNode.parentElement.getAttribute('id')
        if (E_out[v1].indexOf(v2) >= 0) {
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
        if (!directedOn) {
            arrowHead.setAttribute('visibility', 'hidden');
        }

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
    if (editing) {
        editing = false;
        if (currentEditTarget) {
            currentEditTarget.hide();
            currentEditTarget.prev().show();
            currentEditTarget = 0;
        }
        if (isLabel(selectedElement) && selectedEditBox) {
            editLabelEnd();
        }
    }

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
    if (editing) {
        editing = false;
        if (currentEditTarget) {
            currentEditTarget.hide();
            currentEditTarget.prev().show();
            currentEditTarget = 0;
        }
        if (isLabel(selectedElement) && selectedEditBox) {
            editLabelEnd();
        }
    }

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
    if (editing) {
        editing = false;
        if (currentEditTarget) {
            currentEditTarget.hide();
            currentEditTarget.prev().show();
            currentEditTarget = 0;
        }
        if (isLabel(selectedElement) && selectedEditBox) {
            editLabelEnd();
        }
    }
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
    displayXY(selectedElement);

    if (isNode(selectedElement)) {
        reshapeEdges(selectedElement);
    } else if (isLabel(selectedElement)) {
        var foreign = selectedElement.children[2];
        var bbox = selectedElement.children[0].getBBox();
        foreign.setAttribute('x', getX(selectedElement) - bbox.width / 2);
        foreign.setAttribute('y', getY(selectedElement) - bbox.height / 2);
    }

    currentX = e.clientX;
    currentY = e.clientY;
};

var deselectElement = function (evt) {
    evt.preventDefault();
    svg.removeAttribute("onmousemove");
    svg.removeAttribute("onmouseup");
    selectedScaler = 0;

    if (isNode(selectedElement)) {
        reshapeEdges(selectedElement);
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

// deletion
$('html').keyup(function (e) {
    if (!editing) {
        if (e.keyCode == 46 || e.keyCode == 8) {
            if (selectedElement != 0) {
                if (isNode(selectedElement)) {
                    svg.removeChild(selectedElement);
                    deleteVertex(selectedElement.getAttribute('id'));
                } else if (isEdge(selectedElement)) {
                    svg.removeChild(selectedElement.parentElement);
                    deleteEdge(selectedElement.getAttribute('v1'), selectedElement.getAttribute('v2'));
                } else if (isLabel(selectedElement)) {
                    svg.removeChild(selectedElement);
                }
                displayBoard();
                selectedElement = 0;
            }
        }
    }
    if (forceAlign) {
        forceAlign = false;
    }
});

// enter to complete edit
$('html').keyup(function (e) {
    if (e.keyCode == 13) {
        if (isLabel(selectedElement) && editing) {
            editLabelEnd();
        }
    }
});

// force align
$('html').keydown(function (e) {
    if (e.keyCode == 65) {
        forceAlign = true;
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
        var val = input.val() === '' ? '' : input.val();

        var id = label.attr('id');
        if (id == 'radius') {
            scaleTo(parseFloat(input.val()));
            var id = selectedElement.getAttribute('id');
            var edges = getEdges(id);
            var l = edges.length;
            for (i = 0; i < l; i++) {
                var edge = edges[i];
                var v1 = edge.children[0].getAttribute('v1');
                var v2 = edge.children[0].getAttribute('v2');
                reshapeEdge(edge.children[0], edge.children[1], V[v1], V[v2]);
            }
        } else if (id == 'text') {
            if (isNode(selectedElement)) {
                selectedElement.children[1].textContent = val;
            } else if (isLabel(selectedElement)) {
                selectedElement.children[0].textContent = input.val();
                var bbox = selectedElement.children[0].getBBox();
                selectedElement.children[1].setAttribute('x', parseFloat(selectedElement.children[0].getAttribute('x')) - bbox.width / 2);
                selectedElement.children[1].setAttribute('y', parseFloat(selectedElement.children[0].getAttribute('y')) - bbox.height / 2);
                selectedElement.children[1].setAttribute('width', bbox.width);
                selectedElement.children[1].setAttribute('height', bbox.height);
                selectedElement.children[2].children[0].value = input.val();
            }
        } else if (id == 'text-size') {
            if (isNode(selectedElement)) {
                selectedElement.children[1].setAttribute('font-size', input.val());
            } else if (isLabel(selectedElement)) {
                selectedElement.children[0].setAttribute('font-size', input.val());
                var bbox = selectedElement.children[0].getBBox();
                selectedElement.children[1].setAttribute('x', parseFloat(selectedElement.children[0].getAttribute('x')) - bbox.width / 2);
                selectedElement.children[1].setAttribute('y', parseFloat(selectedElement.children[0].getAttribute('y')) - bbox.height / 2);
                selectedElement.children[1].setAttribute('width', bbox.width);
                selectedElement.children[1].setAttribute('height', bbox.height);

                selectedElement.children[2].children[0].style.fontSize = input.val() * 0.8 + "pt";
                selectedElement.children[2].children[0].height = bbox.height;
                selectedElement.children[0].setAttribute('pointer-event', 'all');
                updateLabel(selectedElement);
            }
        } else if (id == 'x') {
            var newPosX = parseFloat(input.val());
            var dx = newPosX - getX(selectedElement);
            currentMatrix[4] += dx;
            newMatrix = "matrix(" + currentMatrix.join(' ') + ")";
            selectedElement.setAttribute('transform', newMatrix);
            updateXY(selectedElement, dx, 0);
            displayXY(selectedElement);
            if (isNode(selectedElement)) {
                reshapeEdges(selectedElement);
            } else if (isLabel(selectedElement)) {
                var foreign = selectedElement.children[2];
                var bbox = selectedElement.children[0].getBBox();
                foreign.setAttribute('x', getX(selectedElement) - bbox.width / 2);
                updateLabel(selectedElement);
            }
        } else if (id == 'y') {
            var newPosY = parseFloat(input.val());
            var dy = newPosY - getY(selectedElement);
            currentMatrix[5] += dy;
            newMatrix = "matrix(" + currentMatrix.join(' ') + ")";
            selectedElement.setAttribute('transform', newMatrix);
            updateXY(selectedElement, 0, dy);
            displayXY(selectedElement);
            if (isNode(selectedElement)) {
                reshapeEdges(selectedElement);
            } else if (isLabel(selectedElement)) {
                var foreign = selectedElement.children[2];
                var bbox = selectedElement.children[0].getBBox();
                foreign.setAttribute('y', getY(selectedElement) - bbox.height / 2);
                updateLabel(selectedElement);
            }
        }
        input.val(' ');
    }
    editing = false;
};

var copySelectedElement = function () {
    console.log('s');
    if (selectedElement != 0) {
        if (isLabel(selectedElement) || isNode(selectedElement)) {
            copiedElement = selectedElement;
            console.log('copied')
        }
    }
};

var pasteSelectedElement = function () {
    if (copiedElement != 0) {
        if (isNode(copiedElement)) {
            console.log('pasted');
            var rx = randomRange(0, 20);
            var ry = randomRange(0, 20);
            var x = getX(copiedElement) + rx;
            var y = getY(copiedElement) + ry;
            var node = drawNode(x, y);
            svg.appendChild(node);
            if (selectedElement != 0) {
                turnOffSelectedElementScaler();
            }
            selectedElement = node;
            scaleTo(copiedElement.children[0].getAttribute('radius'));
            node.children[1].textContent = copiedElement.children[1].textContent;
            selectedElement.children[1].setAttribute('fill', 'rgb(175,175,175)');
            currentMatrix = getMatrix(selectedElement);
            displayInfo(node);
        } else {
            var rx = randomRange(0, 20);
            var ry = randomRange(0, 20);
            var x = getX(copiedElement) + rx;
            var y = getY(copiedElement) + ry;
            var label = drawLabel(x, y);
            svg.appendChild(label);
            label.children[0].setAttribute('font-size', copiedElement.children[0].getAttribute('font-size'));
            label.children[1].setAttribute('stroke', 'rgb(0,122,255)');
            if (selectedElement != 0) {
                turnOffSelectedElementScaler();
            }
            selectedElement = label;
            label.children[0].textContent = copiedElement.children[0].textContent;
            updateLabel(label);

            var bbox = label.children[0].getBBox();
            label.children[1].setAttribute('x', parseFloat(label.children[0].getAttribute('x')) - bbox.width / 2);
            label.children[1].setAttribute('y', parseFloat(label.children[0].getAttribute('y')) - bbox.height / 2);
            label.children[1].setAttribute('width', bbox.width);
            label.children[1].setAttribute('height', bbox.height);

            label.children[2].children[0].style.fontSize = copiedElement.children[2].children[0].style.fontSize;
            label.children[2].children[0].height = bbox.height;
            label.children[0].setAttribute('pointer-event', 'all');
            updateLabel(label);
            currentMatrix = getMatrix(selectedElement);
            displayInfo(label);
        }
    }
};

// copy paste
$(document).bind('copy', function () { copySelectedElement(); });
$(document).bind('paste', function () { pasteSelectedElement(); });
$(document).bind('keydown.meta_s', function () { alert('save'); });
