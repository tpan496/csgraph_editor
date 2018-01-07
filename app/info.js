var paperString = "1. This editor is best suited for creating mathematical graphs.<br/> 2. Supports ctrl-c/ctrl-v operations on node and labels. <br/>3. Save your graph either as PNG or XML file for future edits."
var nodeString = "Node object represents a vertex in the graph. Drag from the green center from the node to form an edge with another one.";
var edgeString = "Edge object represents an edge in the graph. You can toggle on/off its arrrow from 'enable directed'.";
var labelString = "Label object allows you to create text on the paper. Note that it cannot be connected via any means.";

var displayInfo = function (node) {
    clearBoard();
    $('.clickedit').hide();
    elementInfo.html(node.getAttribute('class'));
    if (node.getAttribute('class') == 'node') {
        xInfo.html(node.getAttribute('position-x'));
        xInfo.parent().show();
        yInfo.html(node.getAttribute('position-y'));
        yInfo.parent().show();
        idInfo.html(node.getAttribute('id'));
        idInfo.parent().show();
        radiusInfo.html(node.children[0].getAttribute('radius'));
        radiusInfo.parent().show();
        guideInfo.html(nodeString);
        selfLoopButton.show();
        terminalButton.show();
        if(node.children[3].getAttribute('visibility') == 'hidden'){
            selfLoopButton.css('background', '#7a7a7a');
        }else{
            selfLoopButton.css('background', 'rgb(6, 218, 94)');
        }
        if(node.children[4].getAttribute('visibility') == 'hidden'){
            terminalButton.css('background', '#7a7a7a');
        }else{
            terminalButton.css('background', 'rgb(6, 218, 94)');
        }
    } else if (node.getAttribute('class') == 'edge') {
        fromInfo.html(node.getAttribute('v1'));
        fromInfo.parent().show();
        toInfo.html(node.getAttribute('v2'));
        toInfo.parent().show();
        node.setAttribute('stroke-dasharray', [5, 5]);
        node.setAttribute('stroke', 'rgb(0,122,255)');
        node.parentElement.children[1].setAttribute('fill', 'rgb(0,122,255)');
        guideInfo.html(edgeString);
    } else if (node.getAttribute('class') == 'label') {
        xInfo.html(node.getAttribute('position-x'));
        xInfo.parent().show();
        yInfo.html(node.getAttribute('position-y'));
        yInfo.parent().show();
        textInfo.html(node.children[0].textContent);
        textInfo.parent().show();
        textSizeInfo.html(node.children[0].getAttribute('font-size'));
        textSizeInfo.parent().show();
        guideInfo.html(labelString);
        return;
    }

    if (node.children[1]) {
        if (node.children[1].getAttribute('class') == 'text') {
            textInfo.html(node.children[1].textContent);
            textInfo.parent().show();
            textSizeInfo.html(node.children[1].getAttribute('font-size'));
            textSizeInfo.parent().show();
        }
    }
};

var displayXY = function(node) {
    if (node.getAttribute('class') == 'node') {
        xInfo.html(node.getAttribute('position-x'));
        xInfo.parent().show();
        yInfo.html(node.getAttribute('position-y'));
        yInfo.parent().show();
    } else if (node.getAttribute('class') == 'edge') {

    } else if (node.getAttribute('class') == 'label') {
        xInfo.html(node.getAttribute('position-x'));
        xInfo.parent().show();
        yInfo.html(node.getAttribute('position-y'));
        yInfo.parent().show();
    }
};
var displayBoard = function () {
    elementInfo.html('paper');
    clearBoard();
    directedOnButton.show();
    gridOnButton.show();
    guideInfo.html(paperString);
};

var clearBoard = function () {
    radiusInfo.parent().hide();
    idInfo.parent().hide();
    fromInfo.parent().hide();
    toInfo.parent().hide();
    textInfo.parent().hide();
    textSizeInfo.parent().hide();
    xInfo.parent().hide();
    yInfo.parent().hide();
    directedOnButton.hide();
    gridOnButton.hide();
    selfLoopButton.hide();
    terminalButton.hide();
};
