var drawNode = function (x, y) {
    var node = document.createElementNS(svgns, 'g');
    var circle = drawCircle(x, y, 20, 'white', 'black', 1.5);
    var mutator = drawMutator(x, y, 20);
    var loop = drawHalfCircle(x,y, 20);
    loop.setAttribute('visibility', 'hidden');
    var terminal = drawCircle(x, y, 15, 'transparent', 'black', 1.5);
    terminal.setAttribute('visibility', 'hidden');

    var text;
    var recycledId = getReusableId();
    if (recycledId >= 0) {
        node.setAttribute('id', recycledId);
        addVertex(recycledId, node);
        text = drawText(x, y, recycledId);
    } else {
        node.setAttribute('id', serialId);
        addVertex(serialId, node);
        text = drawText(x, y, serialId);
        serialId += 1;
    }

    node.appendChild(circle);
    node.appendChild(text);
    node.appendChild(mutator);
    node.appendChild(loop);
    node.appendChild(terminal);
    node.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    node.setAttribute('onmousedown', 'selectNode(evt)');
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

var drawLabel = function (x, y) {
    var label = document.createElementNS(svgns, 'g');
    var text = drawText(x, y, '');
    text.setAttribute('font-size', 20);
    text.setAttribute('editable', 'true');
    var markerRect = drawRect(x, y, 0, 0);
    var input = drawInputBox(x, y, 0, 0);
    input.setAttribute('visibility', 'hidden');
    input.setAttribute('onmouseover', 'hoverElement(evt)');
    input.setAttribute('onmouseout', 'outElement(evt)');
    label.setAttribute('cursor', 'move');
    label.appendChild(text);
    label.appendChild(markerRect);
    label.appendChild(input);
    label.setAttribute('class', 'label');
    label.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    label.setAttribute('onmousedown', 'selectLabel(evt)');
    label.setAttribute('onmouseover', 'hoverElement(evt)');
    label.setAttribute('onmouseout', 'outElement(evt)');
    label.setAttribute('ondblclick', 'editLabel(evt)');
    label.setAttribute('position-x', x);
    label.setAttribute('position-y', y);
    label.setAttribute('origin-x', x);
    label.setAttribute('origin-y', y);
    return label;
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

var isLabel = function (e) {
    if (e.getAttribute('class') == 'label'){
        return true;
    } else {
        return false;
    }
};