/**
 * @author tpan496
 * Core script that deals with all the events triggered inside html.
 * Include events for svg, buttons, key events, and input boxes.
 */

// variables
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

/**
 * Called when document is loaded. Registers events triggered by
 * clicking buttons/spawning objects.
 */
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

    // Node button for spawning nodes
    $('#button-circle').click(function () {
        var rx = parseInt(randomRange(0, 20));
        var ry = parseInt(randomRange(0, 20));
        var x = parseInt(svg.getBoundingClientRect().width / 2) + rx;
        var y = parseInt(svg.getBoundingClientRect().height / 2) + ry;
        var node = drawNode(x, y);
        svg.appendChild(node);
        if (selectedElement != 0) {
            turnOffSelectedElementIndicators();
        }
        selectedElement = node;
        selectedElement.children[1].setAttribute('fill', 'rgb(175,175,175)');
        currentMatrix = getMatrix(selectedElement);
        displayInfo(node);
    });

    // Label button for spawning lables
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
            turnOffSelectedElementIndicators();
        }
        selectedElement = label;
        currentMatrix = getMatrix(selectedElement);
        displayInfo(label);
    });

    // Save PNG button for exporting to PNG
    $('#button-png').click(function () {
        exportPNG();
    });

    // Save XML button for exporting to XML
    $('#button-xml').click(function () {
        saveXML();
    });

    // Load XML button for loading XML
    $('#button-load').click(function () {
        loadXML();
    });

    // Clear button for clearing the page
    $('#button-clear').click(function () {
        $('svg').html('');
        serialId = 0;
    });

    // SVG click listener
    $('svg').click(function () {
        if (selectedElement != 0 && !mouseOverNode) {
            turnOffSelectedElementIndicators();
        }
    });

    // Input box click/focusout event listener
    $('.clickedit').focusout(endInfoEdit).keyup(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            endInfoEdit(e);
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

    // Enable grid button
    $('#grid').click(function () {
        toggleGrid($(this));
    });

    // Enable directed button
    $('#directed').click(function () {
        toggleDirected($(this));
    });

    // Enable self-loop button
    $('#self-loop').click(function () {
        toggleSelfLoop($(this), selectedElement);
    });

    // Enable terminal button
    $('#terminal').click(function () {
        toggleTerminal($(this), selectedElement);
    });
});

/**
 * Turns off the additional indicators for the previous
 * selected element.
 */
var turnOffSelectedElementIndicators = function () {
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
                endLabelEdit();
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

/**
 * Ends the editing phase for label
 */
var endLabelEdit = function () {
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

/**
 * Updates the label after it is render
 * @param {label} label 
 */
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

/**
 * Called when the linker is selected. Draws a link pointer.
 * @param {mouse event} e 
 */
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

    clearSVGEvents();
    svg.setAttribute('onmousemove', 'moveLinker(evt)');
    svg.setAttribute('onmouseup', 'deselectLinker(evt)');
};

/**
 * Called after a linker has been selected and the user is dragging
 * the pointer to some target.
 * @param {mouse event} e 
 */
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

/**
 * Called after the linker is deselcted.
 * @param {mouse event} e 
 */
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
            clearSVGEvents();
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
    clearSVGEvents();
};

/**
 * Called when an edge is selected.
 * @param {mouse event} e 
 */
var selectEdge = function (e) {
    e.preventDefault();
    clearEdit();

    if (e.target.getAttribute('class') != 'edge') {
        return;
    }
    turnOffSelectedElementIndicators();
    selectedElement = e.target;
    displayInfo(selectedElement);
};

/**
 * Called when a scaler node is selected.
 * @param {mouse event} e 
 */
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
    clearSVGEvents();
    //svg.setAttribute('onmousemove', 'moveScaler(evt)');
    svg.setAttribute('onmouseup', 'deselectElement(evt)');
};

/**
 * Called after a scale node has been selected, and the user
 * is dragging the scaler node.
 * @param {mouse event} e 
 */
var moveScaler = function (e) {
    e.preventDefault();
    var dx = e.clientX - currentX;
    var dy = e.clientY - currentY;
    var scalerId = selectedScaler.getAttribute('id');

    // in case of circle
    var shiftDx = dx >= dy ? dx : (dx * dy >= 0 ? dy : -dy);
    var shiftDy = dx >= dy ? (dx * dy >= 0 ? dx : -dx) : dy;

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

    // Scale the node according to mouse movement
    scale(shiftDx, shiftDy);
};

/**
 * Called when a label has been selected.
 * @param {mouse event} e 
 */
var selectLabel = function (e) {
    e.preventDefault();
    clearEdit();

    if (e.target.parentElement.getAttribute("class") != "label") {
        return;
    }
    if (selectedElement != e.target.parentElement) {
        turnOffSelectedElementIndicators();
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

/**
 * Called when a graph node is selected.
 * @param {mouse event} e 
 */
var selectNode = function (e) {
    e.preventDefault();
    clearEdit();

    if (e.target.parentElement.getAttribute("class") != "node") {
        return;
    }
    if (selectedElement != e.target.parentElement) {
        turnOffSelectedElementIndicators();
    }
    selectedElement = e.target.parentElement;
    displayInfo(selectedElement);
    selectedElement.children[1].setAttribute('fill', 'rgb(175,175,175)');

    // Render scalers
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

/**
 * Called after a node/label has been selected and the user is
 * dragging the object.
 * @param {mouse event} e 
 */
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

/**
 * Called when the user released the mouse.
 * @param {mouse event} evt 
 */
var deselectElement = function (evt) {
    evt.preventDefault();
    clearSVGEvents();
    selectedScaler = 0;

    if (isNode(selectedElement)) {
        reshapeEdges(selectedElement);
    }
};

/**
 * Called when the mouse is over a object
 * @param {mouse event} e 
 */
var hoverElement = function (e) {
    mouseOverNode = true;
    overNode = e.target;
};

/**
 * Called when the mouse comes out of a object
 * @param {mouse event} e 
 */
var outElement = function (e) {
    mouseOverNode = false;
    overNode = 0;
};

/**
 * Called when user is editing the pressed enter or click somewhere else
 * @param {mouse event} e 
 */
var endInfoEdit = function(e) {
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

/**
 * Called for copy event
 */
var copySelectedElement = function () {
    if (selectedElement != 0) {
        if (isLabel(selectedElement) || isNode(selectedElement)) {
            copiedElement = selectedElement;
            console.log('copied')
        }
    }
};

/**
 * Called for paste event
 */
var pasteSelectedElement = function () {
    if (copiedElement != 0) {
        console.log('pasted');
        if (isNode(copiedElement)) {
            var rx = randomRange(0, 20);
            var ry = randomRange(0, 20);
            var x = getX(copiedElement) + rx;
            var y = getY(copiedElement) + ry;
            var node = drawNode(x, y);
            svg.appendChild(node);
            if (selectedElement != 0) {
                turnOffSelectedElementIndicators();
            }
            selectedElement = node;
            scaleTo(getRadius(copiedElement.children[0]));
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
                turnOffSelectedElementIndicators();
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

/**
 * Clear svg of mouse events
 */
var clearSVGEvents = function(){
    svg.removeAttribute("onmousemove");
    svg.removeAttribute("onmouseup");
    svg.removeAttribute("onmouseout");
};

/**
 * Clear editing phase
 */
var clearEdit = function(){
    if (editing) {
        editing = false;
        if (currentEditTarget) {
            currentEditTarget.hide();
            currentEditTarget.prev().show();
            currentEditTarget = 0;
        }
        if (isLabel(selectedElement) && selectedEditBox) {
            endLabelEdit();
        }
    }
};

// copy paste events
$(document).bind('copy', function () { copySelectedElement(); });
$(document).bind('paste', function () { pasteSelectedElement(); });
$(document).bind('keydown.meta_s', function () { alert('save'); });

// Called when delete key is pressed by user
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

// Called when enter key is pressed by user
$('html').keyup(function (e) {
    if (e.keyCode == 13) {
        if (isLabel(selectedElement) && editing) {
            endLabelEdit();
        }
    }
});

// force align
$('html').keydown(function (e) {
    if (e.keyCode == 65) {
        forceAlign = true;
    }
});